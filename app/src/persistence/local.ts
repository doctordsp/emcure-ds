import { applyAlignment, countBySeverity } from "../domain/alignment";
import { cloneDesign, createEmptyDesign, displayTitle } from "../domain/createDesign";
import { nowIso } from "../domain/ids";
import { SCHEMA_VERSION, type EmcureDesign } from "../domain/types";

const INDEX_KEY = "emcure.designs.index.v1";
const ACTIVE_KEY = "emcure.activeDesignId.v1";
const designKey = (id: string) => `emcure.design.v1.${id}`;

export type DesignStoragePlace = "cloud" | "local";

export interface DesignSummary {
  id: string;
  title: string;
  status: EmcureDesign["status"];
  updatedAt: string;
  archivedAt?: string;
  openErrorCount: number;
  openWarningCount: number;
  storagePlace: DesignStoragePlace;
}

function readIndex(): DesignSummary[] {
  const raw = localStorage.getItem(INDEX_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Partial<DesignSummary>[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Partial<DesignSummary> & { id: string } => Boolean(item?.id))
      .map((item) => ({
        id: item.id,
        title: item.title ?? "Untitled EM-CURE",
        status: item.status ?? "draft",
        updatedAt: item.updatedAt ?? "",
        archivedAt: item.archivedAt,
        openErrorCount: item.openErrorCount ?? 0,
        openWarningCount: item.openWarningCount ?? 0,
        storagePlace: "local",
      }));
  } catch {
    return [];
  }
}

function writeIndex(summaries: DesignSummary[]): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(summaries));
}

export function toSummary(design: EmcureDesign): DesignSummary {
  const counts = countBySeverity(design);
  return {
    id: design.id,
    title: displayTitle(design),
    status: design.status,
    updatedAt: design.updatedAt,
    archivedAt: design.archivedAt,
    openErrorCount: counts.error,
    openWarningCount: counts.warning,
    storagePlace: "local",
  };
}

export function listLocalDesigns(): DesignSummary[] {
  return readIndex().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getLocalDesign(id: string): EmcureDesign | null {
  const raw = localStorage.getItem(designKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EmcureDesign;
  } catch {
    return null;
  }
}

export function putLocalDesign(design: EmcureDesign): EmcureDesign {
  localStorage.setItem(designKey(design.id), JSON.stringify(design));
  const others = readIndex().filter((item) => item.id !== design.id);
  writeIndex([toSummary(design), ...others]);
  return design;
}

export function saveLocalDesign(design: EmcureDesign): EmcureDesign {
  return putLocalDesign(applyAlignment({ ...design, updatedAt: nowIso() }));
}

export function getActiveDesignId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveDesignId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function clearActiveDesignId(): void {
  localStorage.removeItem(ACTIVE_KEY);
}

export function getLocalActiveDesignSummary(): DesignSummary | null {
  const id = getActiveDesignId();
  if (!id) return null;
  return readIndex().find((item) => item.id === id) ?? null;
}

export function archiveLocalDesign(id: string): void {
  const design = getLocalDesign(id);
  if (!design) return;
  design.status = "archived";
  design.archivedAt = nowIso();
  saveLocalDesign(design);
  if (localStorage.getItem(ACTIVE_KEY) === id) {
    clearActiveDesignId();
  }
}

export function restoreLocalDesign(id: string): void {
  const design = getLocalDesign(id);
  if (!design) return;
  design.status = "draft";
  delete design.archivedAt;
  saveLocalDesign(design);
}

export function deleteLocalDesign(id: string): void {
  localStorage.removeItem(designKey(id));
  writeIndex(readIndex().filter((item) => item.id !== id));
  if (localStorage.getItem(ACTIVE_KEY) === id) {
    clearActiveDesignId();
  }
}

export function duplicateLocalDesign(id: string): EmcureDesign | null {
  const source = getLocalDesign(id);
  if (!source) return null;
  return saveLocalDesign(cloneDesign(source));
}

export function parseImportedDesignLocal(raw: unknown): EmcureDesign {
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
  const existing = getLocalDesign(incoming.id);
  if (existing) {
    return saveLocalDesign(cloneDesign(incoming, displayTitle(incoming)));
  }
  return saveLocalDesign(incoming);
}

export function createAndSaveLocalDesign(title?: string): EmcureDesign {
  return saveLocalDesign(createEmptyDesign(title));
}

export function downloadDesignJson(design: EmcureDesign): void {
  const blob = new Blob([JSON.stringify(design, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const slug = displayTitle(design).replace(/[^\w]+/g, "-").toLowerCase();
  anchor.href = url;
  anchor.download = `${slug || "emcure"}-${design.id.slice(0, 8)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadTextFile(filename: string, contents: string, mime: string): void {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
