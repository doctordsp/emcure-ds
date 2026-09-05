import { allActivities, primaryBigRedX } from "./createDesign";
import type { EmcureDesign, WorkspaceRoute } from "./types";

export interface SectionStatus {
  route: WorkspaceRoute;
  label: string;
  state: "not_started" | "in_progress" | "ready";
  stage:
    | "course"
    | "framework"
    | "project"
    | "opportunity"
    | "success"
    | "brx"
    | "journey"
    | "assessment"
    | "destination";
}

export function filledText(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

/**
 * Dot state for “at least one of these” fields.
 * `true` = green, `false` = red, `undefined` = optional (no dot).
 */
export function readySlot(thisFilled: boolean, groupOk: boolean): boolean | undefined {
  if (thisFilled) return true;
  if (!groupOk) return false;
  return undefined;
}

export function sectionStatuses(design: EmcureDesign): SectionStatus[] {
  const hasProfile =
    filledText(design.courseProfile.title) && Boolean(design.courseProfile.durationWeeks);
  const hasFramework = design.frameworkSelections.length > 0;
  const hasNeed =
    design.stakeholders.length > 0 && design.needs.some((need) => filledText(need.statement));
  const hasThread =
    design.opportunities.some((item) => filledText(item.statement)) &&
    design.intendedImpacts.some((item) => filledText(item.statement));
  const hasSuccess = design.successCriteria.some((item) => filledText(item.statement));
  const brx = primaryBigRedX(design);
  const hasBrx = Boolean(
    filledText(brx?.statement) &&
      filledText(brx?.decisionIfResolved) &&
      filledText(design.minimumViableResearchContribution?.statement),
  );
  const hasJourney = allActivities(design).length > 0;
  const openErrors = design.findings.filter(
    (finding) => finding.status === "open" && finding.severity === "error",
  ).length;

  return [
    { route: "course", label: "1. Course profile", state: flag(hasProfile, design.courseProfile.title), stage: "course" },
    { route: "framework", label: "2. EM framework", state: flag(hasFramework, design.frameworkMode), stage: "framework" },
    { route: "stakeholders", label: "3. Stakeholders and need", state: flag(hasNeed, design.projectSituation || design.stakeholders.length), stage: "project" },
    { route: "opportunity-impact", label: "4. Opportunity and impact", state: flag(hasThread, design.opportunities.length || design.intendedImpacts.length), stage: "opportunity" },
    { route: "success", label: "5. Success criteria", state: flag(hasSuccess, design.successCriteria.length), stage: "success" },
    { route: "big-red-x", label: "6. Big Red X", state: flag(hasBrx, design.uncertainties.length), stage: "brx" },
    { route: "journey", label: "7. Student journey", state: flag(hasJourney, hasJourney), stage: "journey" },
    {
      route: "review",
      label: "8. Alignment review",
      state: hasJourney && hasBrx ? (openErrors === 0 ? "ready" : "in_progress") : "not_started",
      stage: "assessment",
    },
    { route: "export", label: "9. Export", state: hasProfile ? "ready" : "not_started", stage: "destination" },
  ];
}

function flag(ready: boolean, started: unknown): SectionStatus["state"] {
  if (ready) return "ready";
  if (started) return "in_progress";
  return "not_started";
}
