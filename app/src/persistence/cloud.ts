import { applyAlignment, countBySeverity } from "../domain/alignment";
import { displayTitle } from "../domain/createDesign";
import { nowIso } from "../domain/ids";
import type { EmcureDesign } from "../domain/types";
import { hydrateDesignAssets } from "./assets";
import type { DesignSummary } from "./local";
import { currentUserId, getSupabase } from "./supabase";

interface DesignRow {
  id: string;
  owner_id: string;
  title: string;
  status: EmcureDesign["status"];
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  open_error_count: number;
  open_warning_count: number;
  body: EmcureDesign;
}

function rowToSummary(row: DesignRow): DesignSummary {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at ?? undefined,
    openErrorCount: row.open_error_count,
    openWarningCount: row.open_warning_count,
  };
}

function toRow(design: EmcureDesign, ownerId: string) {
  const counts = countBySeverity(design);
  return {
    id: design.id,
    owner_id: ownerId,
    title: displayTitle(design),
    status: design.status,
    created_at: design.createdAt,
    updated_at: design.updatedAt,
    archived_at: design.archivedAt ?? null,
    open_error_count: counts.error,
    open_warning_count: counts.warning,
    body: design,
  };
}

export async function listCloudDesigns(): Promise<DesignSummary[]> {
  const supabase = getSupabase();
  const userId = await currentUserId();
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from("designs")
    .select(
      "id, owner_id, title, status, created_at, updated_at, archived_at, open_error_count, open_warning_count",
    )
    .eq("owner_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as Omit<DesignRow, "body">[]).map((row) =>
    rowToSummary({ ...row, body: {} as EmcureDesign }),
  );
}

export async function getCloudDesign(id: string): Promise<EmcureDesign | null> {
  const supabase = getSupabase();
  const userId = await currentUserId();
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("designs")
    .select("body")
    .eq("id", id)
    .eq("owner_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data?.body as EmcureDesign | undefined) ?? null;
}

export async function saveCloudDesign(design: EmcureDesign): Promise<EmcureDesign> {
  const supabase = getSupabase();
  const userId = await currentUserId();
  if (!supabase || !userId) {
    throw new Error("Sign in to save this EM-CURE in the cloud.");
  }
  const aligned = applyAlignment({ ...design, updatedAt: nowIso() });
  const hydrated = await hydrateDesignAssets(aligned, userId);
  const { error } = await supabase.from("designs").upsert(toRow(hydrated, userId), { onConflict: "id" });
  if (error) throw error;
  return hydrated;
}

export async function deleteCloudDesign(id: string): Promise<void> {
  const supabase = getSupabase();
  const userId = await currentUserId();
  if (!supabase || !userId) return;
  const { error } = await supabase.from("designs").delete().eq("id", id).eq("owner_id", userId);
  if (error) throw error;
}
