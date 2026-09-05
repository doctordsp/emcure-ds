import { applyAlignment } from "../domain/alignment";
import { cloneDesign, createEmptyDesign, displayTitle } from "../domain/createDesign";
import { nowIso } from "../domain/ids";
import { SCHEMA_VERSION, type EmcureDesign } from "../domain/types";
import { deleteCloudDesign, getCloudDesign, listCloudDesigns, saveCloudDesign } from "./cloud";
import {
  archiveLocalDesign,
  clearActiveDesignId,
  createAndSaveLocalDesign,
  deleteLocalDesign,
  getActiveDesignId,
  getLocalActiveDesignSummary,
  getLocalDesign,
  listLocalDesigns,
  restoreLocalDesign,
  saveLocalDesign,
  putLocalDesign,
  type DesignStoragePlace,
  type DesignSummary,
} from "./local";
import { currentUserId, isSupabaseConfigured } from "./supabase";

export type { DesignStoragePlace, DesignSummary } from "./local";
export {
  clearActiveDesignId,
  downloadDesignJson,
  downloadTextFile,
  getActiveDesignId,
  setActiveDesignId,
} from "./local";

export async function usingCloud(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  return Boolean(await currentUserId());
}

/** Cloud rows win on id collision. Leftover local ids stay Local. */
export function mergeCloudAndLocalSummaries(
  cloud: DesignSummary[],
  local: DesignSummary[],
): DesignSummary[] {
  const cloudIds = new Set(cloud.map((item) => item.id));
  const taggedCloud = cloud.map((item) => ({ ...item, storagePlace: "cloud" as const }));
  const localOnly = local
    .filter((item) => !cloudIds.has(item.id))
    .map((item) => ({ ...item, storagePlace: "local" as const }));
  return [...taggedCloud, ...localOnly].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listDesigns(): Promise<DesignSummary[]> {
  const local = listLocalDesigns();
  if (!(await usingCloud())) {
    return local.map((item) => ({ ...item, storagePlace: "local" as const }));
  }
  return mergeCloudAndLocalSummaries(await listCloudDesigns(), local);
}

export async function getDesign(id: string): Promise<EmcureDesign | null> {
  return (await getDesignRecord(id))?.design ?? null;
}

export async function getDesignRecord(
  id: string,
): Promise<{ design: EmcureDesign; storagePlace: DesignStoragePlace } | null> {
  if (await usingCloud()) {
    const cloud = await getCloudDesign(id);
    if (cloud) return { design: cloud, storagePlace: "cloud" };
  }
  const local = getLocalDesign(id);
  if (local) return { design: local, storagePlace: "local" };
  return null;
}

async function persistCloud(design: EmcureDesign): Promise<EmcureDesign> {
  const saved = await saveCloudDesign(design);
  putLocalDesign(saved);
  return saved;
}

export async function saveNewDesign(design: EmcureDesign): Promise<EmcureDesign> {
  if (await usingCloud()) return persistCloud(design);
  return saveLocalDesign(design);
}

export async function saveDesign(design: EmcureDesign): Promise<EmcureDesign> {
  if (await usingCloud()) {
    const existing = await getCloudDesign(design.id);
    if (existing) return persistCloud(design);
  }
  return saveLocalDesign(design);
}

export async function saveDesignToCloud(id: string): Promise<EmcureDesign> {
  if (!(await usingCloud())) {
    throw new Error("Sign in to save this EM-CURE in the cloud.");
  }
  const design = (await getCloudDesign(id)) ?? getLocalDesign(id);
  if (!design) throw new Error("That EM-CURE was not found.");
  return persistCloud(design);
}

export async function getActiveDesignSummary(): Promise<DesignSummary | null> {
  const id = getActiveDesignId();
  if (!id) return null;
  if (await usingCloud()) {
    const found = (await listDesigns()).find((item) => item.id === id);
    if (!found || found.archivedAt) return null;
    return found;
  }
  const local = getLocalActiveDesignSummary();
  if (local?.archivedAt) return null;
  return local ? { ...local, storagePlace: "local" } : null;
}

export async function archiveDesign(id: string): Promise<void> {
  if (await usingCloud()) {
    const cloud = await getCloudDesign(id);
    if (cloud) {
      cloud.status = "archived";
      cloud.archivedAt = nowIso();
      await persistCloud(cloud);
      if (getActiveDesignId() === id) clearActiveDesignId();
      return;
    }
  }
  archiveLocalDesign(id);
}

export async function restoreDesign(id: string): Promise<void> {
  if (await usingCloud()) {
    const cloud = await getCloudDesign(id);
    if (cloud) {
      cloud.status = "draft";
      delete cloud.archivedAt;
      await persistCloud(cloud);
      return;
    }
  }
  restoreLocalDesign(id);
}

export async function deleteDesign(id: string): Promise<void> {
  if (await usingCloud()) {
    await deleteCloudDesign(id);
  }
  deleteLocalDesign(id);
}

export async function duplicateDesign(id: string): Promise<EmcureDesign | null> {
  const source = await getDesign(id);
  if (!source) return null;
  const clone = cloneDesign(source);
  if (await usingCloud()) {
    const cloudSource = await getCloudDesign(id);
    if (cloudSource) return persistCloud(clone);
  }
  return saveLocalDesign(clone);
}

export async function parseImportedDesign(raw: unknown): Promise<EmcureDesign> {
  if (!raw || typeof raw !== "object") {
    throw new Error("File is not a JSON object.");
  }
  const data = raw as Partial<EmcureDesign>;
  if (data.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(
      `Unsupported schema version “${String(data.schemaVersion)}”. Expected ${SCHEMA_VERSION}.`,
    );
  }
  if (!data.id || !data.courseProfile) {
    throw new Error("JSON is missing required design fields.");
  }
  const incoming = raw as EmcureDesign;
  const existing = await getDesign(incoming.id);
  if (existing) {
    return saveNewDesign(cloneDesign(incoming, displayTitle(incoming)));
  }
  return saveNewDesign(applyAlignment(incoming));
}

export async function createAndSaveDesign(title?: string): Promise<EmcureDesign> {
  if (await usingCloud()) {
    return persistCloud(createEmptyDesign(title));
  }
  return createAndSaveLocalDesign(title);
}
