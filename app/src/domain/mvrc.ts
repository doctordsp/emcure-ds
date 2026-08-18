import type { EmcureDesign, MinimumViableResearchContribution } from "./types";

export const MVRC_LABEL = "MVRC (Minimum Viable Research Contribution)";

export const MVRC_DEFINITION =
  "the floor of authentic research students must produce this term";

export function mvrcOf(design: EmcureDesign): MinimumViableResearchContribution {
  return {
    statement: design.minimumViableResearchContribution?.statement ?? "",
    deliverables: design.minimumViableResearchContribution?.deliverables ?? [],
    studentFacingStatement:
      design.minimumViableResearchContribution?.studentFacingStatement ?? "",
  };
}

export function mvrcStatement(design: EmcureDesign): string {
  return design.minimumViableResearchContribution?.statement?.trim() ?? "";
}

export function studentFacingMvrc(design: EmcureDesign): string {
  return (
    design.minimumViableResearchContribution?.studentFacingStatement?.trim() ||
    mvrcStatement(design)
  );
}

export function mvrcDeliverables(design: EmcureDesign): string[] {
  return (design.minimumViableResearchContribution?.deliverables ?? [])
    .map((item) => item.trim())
    .filter(Boolean);
}

export function patchMvrc(
  current: EmcureDesign,
  patch: Partial<MinimumViableResearchContribution>,
): EmcureDesign {
  return {
    ...current,
    minimumViableResearchContribution: {
      ...mvrcOf(current),
      ...patch,
    },
  };
}

export function mvrcClaimsDemonstratedImpact(design: EmcureDesign): boolean {
  const mvrc = mvrcOf(design);
  const blob = [mvrc.statement, mvrc.studentFacingStatement, ...(mvrc.deliverables ?? [])]
    .join("\n")
    .trim();
  if (!blob) return false;
  if (/\bdemonstrated impact\b/i.test(blob)) return true;
  return design.intendedImpacts.some((impact) => {
    if (impact.claimLevel !== "demonstrated_impact") return false;
    const statement = impact.statement.trim();
    return Boolean(statement) && blob.includes(statement);
  });
}
