import { describe, expect, it } from "vitest";
import { mergeCloudAndLocalSummaries } from "./store";
import type { DesignSummary } from "./local";

function summary(partial: Partial<DesignSummary> & Pick<DesignSummary, "id" | "updatedAt">): DesignSummary {
  return {
    title: partial.title ?? partial.id,
    status: "draft",
    openErrorCount: 0,
    openWarningCount: 0,
    storagePlace: "local",
    ...partial,
  };
}

describe("mergeCloudAndLocalSummaries", () => {
  it("keeps cloud rows and leftover local-only ids, tagging each place", () => {
    const cloud = [summary({ id: "shared", updatedAt: "2026-01-02", title: "Cloud copy" })];
    const local = [
      summary({ id: "shared", updatedAt: "2026-01-03", title: "Stale local" }),
      summary({ id: "browser-only", updatedAt: "2026-01-01", title: "Local only" }),
    ];
    const merged = mergeCloudAndLocalSummaries(cloud, local);
    expect(merged.map((item) => item.id)).toEqual(["shared", "browser-only"]);
    expect(merged[0]).toMatchObject({
      id: "shared",
      title: "Cloud copy",
      storagePlace: "cloud",
    });
    expect(merged[1]).toMatchObject({
      id: "browser-only",
      storagePlace: "local",
    });
  });

  it("sorts by updatedAt descending", () => {
    const merged = mergeCloudAndLocalSummaries(
      [summary({ id: "older-cloud", updatedAt: "2026-01-01" })],
      [summary({ id: "newer-local", updatedAt: "2026-02-01" })],
    );
    expect(merged.map((item) => item.id)).toEqual(["newer-local", "older-cloud"]);
  });
});
