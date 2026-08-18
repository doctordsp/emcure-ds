import { applyAlignment, countBySeverity } from "../domain/alignment";
import { cloneDesign, createEmptyDesign, displayTitle } from "../domain/createDesign";
import { nowIso } from "../domain/ids";
import { SCHEMA_VERSION, type EmcureDesign } from "../domain/types";

const INDEX_KEY = "emcure.designs.index.v1";
const ACTIVE_KEY = "emcure.activeDesignId.v1";
const designKey = (id: string) => `emcure.design.v1.${id}`;

export interface DesignSummary {
  id: string;
  title: string;
  status: EmcureDesign["status"];
  updatedAt: string;
  archivedAt?: string;
  openErrorCount: number;
  openWarningCount: number;
}

function readIndex(): DesignSummary[] {
  const raw = localStorage.getItem(INDEX_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as DesignSummary[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIndex(summaries: DesignSummary[]): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(summaries));
}

function toSummary(design: EmcureDesign): DesignSummary {
  const counts = countBySeverity(design);
  return {
    id: design.id,
    title: displayTitle(design),
    status: design.status,
    updatedAt: design.updatedAt,
    archivedAt: design.archivedAt,
    openErrorCount: counts.error,
    openWarningCount: counts.warning,
  };
}

export function listDesigns(): DesignSummary[] {
  return readIndex().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getDesign(id: string): EmcureDesign | null {
  const raw = localStorage.getItem(designKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EmcureDesign;
  } catch {
    return null;
  }
}

export function saveDesign(design: EmcureDesign): EmcureDesign {
  const aligned = applyAlignment({ ...design, updatedAt: nowIso() });
  localStorage.setItem(designKey(aligned.id), JSON.stringify(aligned));
  const others = readIndex().filter((item) => item.id !== aligned.id);
  writeIndex([toSummary(aligned), ...others]);
  return aligned;
}

export function getActiveDesignId(): string | null {
  const id = localStorage.getItem(ACTIVE_KEY);
  if (!id) return null;
  const summary = readIndex().find((item) => item.id === id);
  if (!summary || summary.archivedAt) return null;
  return id;
}

export function setActiveDesignId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function clearActiveDesignId(): void {
  localStorage.removeItem(ACTIVE_KEY);
}

export function getActiveDesignSummary(): DesignSummary | null {
  const id = getActiveDesignId();
  if (!id) return null;
  return readIndex().find((item) => item.id === id) ?? null;
}

export function archiveDesign(id: string): void {
  const design = getDesign(id);
  if (!design) return;
  design.status = "archived";
  design.archivedAt = nowIso();
  saveDesign(design);
  if (localStorage.getItem(ACTIVE_KEY) === id) {
    clearActiveDesignId();
  }
}

export function restoreDesign(id: string): void {
  const design = getDesign(id);
  if (!design) return;
  design.status = "draft";
  delete design.archivedAt;
  saveDesign(design);
}

export function deleteDesign(id: string): void {
  localStorage.removeItem(designKey(id));
  writeIndex(readIndex().filter((item) => item.id !== id));
  if (localStorage.getItem(ACTIVE_KEY) === id) {
    clearActiveDesignId();
  }
}

export function duplicateDesign(id: string): EmcureDesign | null {
  const source = getDesign(id);
  if (!source) return null;
  return saveDesign(cloneDesign(source));
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

export function parseImportedDesign(raw: unknown): EmcureDesign {
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
  const existing = getDesign(incoming.id);
  if (existing) {
    return saveDesign(cloneDesign(incoming, displayTitle(incoming)));
  }
  return saveDesign(incoming);
}

export function createAndSaveDesign(title?: string): EmcureDesign {
  return saveDesign(createEmptyDesign(title));
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
