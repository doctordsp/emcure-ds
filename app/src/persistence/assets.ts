import { MAX_ASSET_BYTES } from "../domain/files";
import type { EmcureDesign } from "../domain/types";
import { getSupabase } from "./supabase";

export const DESIGN_ASSETS_BUCKET = "design-assets";
export const CARD_IMAGES_BUCKET = "card-images";

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(header)?.[1] || "application/octet-stream";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function extensionFor(filename: string, mime: string): string {
  const fromName = filename.split(".").pop();
  if (fromName && fromName !== filename && fromName.length <= 8) {
    return fromName.toLowerCase();
  }
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/gif") return "gif";
  return "bin";
}

export async function uploadDesignAsset(params: {
  userId: string;
  designId: string;
  folder: "card" | "assets";
  blob: Blob;
  filename: string;
}): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured.");
  if (params.blob.size > MAX_ASSET_BYTES) {
    throw new Error("Keep each file under 2 MB (Supabase Free storage quota).");
  }
  const ext = extensionFor(params.filename, params.blob.type);
  const path = `${params.userId}/${params.designId}/${params.folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(DESIGN_ASSETS_BUCKET).upload(path, params.blob, {
    contentType: params.blob.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function uploadPublishedCardImage(params: {
  userId: string;
  slug: string;
  blob: Blob;
  filename: string;
}): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured.");
  if (params.blob.size > MAX_ASSET_BYTES) {
    throw new Error("Keep each file under 2 MB (Supabase Free storage quota).");
  }
  const ext = extensionFor(params.filename, params.blob.type);
  const path = `${params.userId}/${params.slug}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(CARD_IMAGES_BUCKET).upload(path, params.blob, {
    contentType: params.blob.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function downloadDesignAsset(path: string): Promise<Blob> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.storage.from(DESIGN_ASSETS_BUCKET).download(path);
  if (error || !data) throw error ?? new Error("Could not download file.");
  return data;
}

export async function signedDesignAssetUrl(path: string): Promise<string | undefined> {
  const supabase = getSupabase();
  if (!supabase) return undefined;
  const { data, error } = await supabase.storage
    .from(DESIGN_ASSETS_BUCKET)
    .createSignedUrl(path, 3600);
  if (error) return undefined;
  return data.signedUrl;
}

export function publicCardImageUrl(path: string): string | undefined {
  const supabase = getSupabase();
  if (!supabase) return undefined;
  const { data } = supabase.storage.from(CARD_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function resolveCardImageSrc(params: {
  dataUrl?: string;
  path?: string;
  publishedPath?: string | null;
}): Promise<string | undefined> {
  if (params.dataUrl) return params.dataUrl;
  if (params.publishedPath) return publicCardImageUrl(params.publishedPath);
  if (params.path) return signedDesignAssetUrl(params.path);
  return undefined;
}

export async function resolveDocumentHref(params: {
  dataUrl?: string;
  storagePath?: string;
}): Promise<string | undefined> {
  if (params.dataUrl) return params.dataUrl;
  if (params.storagePath) return signedDesignAssetUrl(params.storagePath);
  return undefined;
}

/** Upload any leftover data URLs, then drop them from jsonb. */
export async function hydrateDesignAssets(
  design: EmcureDesign,
  userId: string,
): Promise<EmcureDesign> {
  const next = structuredClone(design);
  if (next.card?.featuredImageDataUrl) {
    const blob = dataUrlToBlob(next.card.featuredImageDataUrl);
    next.card.featuredImagePath = await uploadDesignAsset({
      userId,
      designId: next.id,
      folder: "card",
      blob,
      filename: next.card.featuredImageName || "featured",
    });
    delete next.card.featuredImageDataUrl;
  }
  if (next.distributionDocuments) {
    for (const doc of next.distributionDocuments) {
      if (!doc.dataUrl) continue;
      const blob = dataUrlToBlob(doc.dataUrl);
      doc.storagePath = await uploadDesignAsset({
        userId,
        designId: next.id,
        folder: "assets",
        blob,
        filename: doc.filename || "asset",
      });
      delete doc.dataUrl;
    }
  }
  return next;
}

export function stripInlineAssets(design: EmcureDesign): EmcureDesign {
  const next = structuredClone(design);
  if (next.card) delete next.card.featuredImageDataUrl;
  for (const doc of next.distributionDocuments ?? []) {
    delete doc.dataUrl;
  }
  return next;
}
