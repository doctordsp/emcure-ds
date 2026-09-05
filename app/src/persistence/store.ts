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
  type DesignSummary,
} from "./local";
import { currentUserId, isSupabaseConfigured } from "./supabase";

export type { DesignSummary } from "./local";
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

export async function listDesigns(): Promise<DesignSummary[]> {
  if (await usingCloud()) return listCloudDesigns();
  return listLocalDesigns();
}

export async function getDesign(id: string): Promise<EmcureDesign | null> {
  if (await usingCloud()) {
    const cloud = await getCloudDesign(id);
    if (cloud) return cloud;
  }
  return getLocalDesign(id);
}

export async function saveDesign(design: EmcureDesign): Promise<EmcureDesign> {
  if (await usingCloud()) {
    const saved = await saveCloudDesign(design);
    putLocalDesign(saved);
    return saved;
  }
  return saveLocalDesign(design);
}

export async function getActiveDesignSummary(): Promise<DesignSummary | null> {
  const id = getActiveDesignId();
  if (!id) return null;
  if (await usingCloud()) {
    const found = (await listCloudDesigns()).find((item) => item.id === id);
    if (!found || found.archivedAt) return null;
    return found;
  }
  const local = getLocalActiveDesignSummary();
  if (local?.archivedAt) return null;
  return local;
}

export async function archiveDesign(id: string): Promise<void> {
  if (await usingCloud()) {
    const design = await getDesign(id);
    if (!design) return;
    design.status = "archived";
    design.archivedAt = nowIso();
    await saveDesign(design);
    if (getActiveDesignId() === id) clearActiveDesignId();
    return;
  }
  archiveLocalDesign(id);
}

export async function restoreDesign(id: string): Promise<void> {
  if (await usingCloud()) {
    const design = await getDesign(id);
    if (!design) return;
    design.status = "draft";
    delete design.archivedAt;
    await saveDesign(design);
    return;
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
  return saveDesign(cloneDesign(source));
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
    return saveDesign(cloneDesign(incoming, displayTitle(incoming)));
  }
  return saveDesign(applyAlignment(incoming));
}

export async function createAndSaveDesign(title?: string): Promise<EmcureDesign> {
  if (await usingCloud()) {
    return saveDesign(createEmptyDesign(title));
  }
  return createAndSaveLocalDesign(title);
}
