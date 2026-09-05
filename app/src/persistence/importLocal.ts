import { getLocalDesign, listLocalDesigns, type DesignSummary } from "./local";
import { saveCloudDesign } from "./cloud";
import { usingCloud } from "./store";

const IMPORT_KEY = "emcure.cloudImport.v1";

export function localDesignsPendingImport(): DesignSummary[] {
  try {
    if (localStorage.getItem(IMPORT_KEY) === "done") return [];
  } catch {
    return [];
  }
  return listLocalDesigns();
}

export function markLocalImportDone(): void {
  try {
    localStorage.setItem(IMPORT_KEY, "done");
  } catch {
    /* private mode */
  }
}

export async function importLocalDesignsToCloud(): Promise<number> {
  if (!(await usingCloud())) {
    throw new Error("Sign in before importing browser designs.");
  }
  const pending = listLocalDesigns();
  let imported = 0;
  for (const summary of pending) {
    const design = getLocalDesign(summary.id);
    if (!design) continue;
    await saveCloudDesign(design);
    imported += 1;
  }
  markLocalImportDone();
  return imported;
}

export function dismissLocalImport(): void {
  markLocalImportDone();
}
