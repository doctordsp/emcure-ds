import { studentSafeCard, type PublishedCardRow, type PublishedVisibility } from "../domain/publish";
import type { EmcureCard } from "../domain/types";
import {
  dataUrlToBlob,
  downloadDesignAsset,
  publicCardImageUrl,
  uploadPublishedCardImage,
} from "./assets";
import { currentUserId, getSupabase } from "./supabase";

async function copyFeaturedImage(params: {
  userId: string;
  slug: string;
  card: EmcureCard;
}): Promise<string | null> {
  const { userId, slug, card } = params;
  if (card.featuredImageDataUrl) {
    return uploadPublishedCardImage({
      userId,
      slug,
      blob: dataUrlToBlob(card.featuredImageDataUrl),
      filename: card.featuredImageName || "featured",
    });
  }
  if (card.featuredImagePath) {
    const blob = await downloadDesignAsset(card.featuredImagePath);
    return uploadPublishedCardImage({
      userId,
      slug,
      blob,
      filename: card.featuredImageName || "featured",
    });
  }
  return null;
}

export async function getPublishedCardForDesign(designId: string): Promise<PublishedCardRow | null> {
  const supabase = getSupabase();
  const userId = await currentUserId();
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("published_cards")
    .select("*")
    .eq("design_id", designId)
    .eq("owner_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as PublishedCardRow | null) ?? null;
}

export async function getPublishedCardBySlug(slug: string): Promise<PublishedCardRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_published_card_by_slug", { p_slug: slug });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return (row as PublishedCardRow | undefined) ?? null;
}

export async function publishCard(params: {
  designId: string;
  slug: string;
  card: EmcureCard;
  visibility?: PublishedVisibility;
}): Promise<PublishedCardRow> {
  const supabase = getSupabase();
  const userId = await currentUserId();
  if (!supabase || !userId) {
    throw new Error("Sign in to publish a card.");
  }
  const snapshot = studentSafeCard(params.card);
  const imagePath = await copyFeaturedImage({
    userId,
    slug: params.slug,
    card: params.card,
  });
  const existing = await getPublishedCardForDesign(params.designId);
  const row = {
    owner_id: userId,
    design_id: params.designId,
    slug: params.slug,
    visibility: params.visibility ?? existing?.visibility ?? "unlisted",
    published_at: new Date().toISOString(),
    card: snapshot,
    image_path: imagePath,
  };
  const query = existing
    ? supabase.from("published_cards").update(row).eq("id", existing.id).select().single()
    : supabase.from("published_cards").insert(row).select().single();
  const { data, error } = await query;
  if (error) throw error;
  return data as PublishedCardRow;
}

export async function unpublishCard(designId: string): Promise<void> {
  const supabase = getSupabase();
  const userId = await currentUserId();
  if (!supabase || !userId) {
    throw new Error("Sign in to unpublish a card.");
  }
  const { error } = await supabase
    .from("published_cards")
    .delete()
    .eq("design_id", designId)
    .eq("owner_id", userId);
  if (error) throw error;
}

export function publishedImageSrc(row: PublishedCardRow): string | undefined {
  if (row.image_path) return publicCardImageUrl(row.image_path);
  if (row.card.featuredImageDataUrl) return row.card.featuredImageDataUrl;
  return undefined;
}
