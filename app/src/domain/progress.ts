import { allActivities, primaryBigRedX } from "./createDesign";
import type { EmcureDesign, WorkspaceRoute } from "./types";

export interface SectionStatus {
  route: WorkspaceRoute;
  label: string;
  state: "not_started" | "in_progress" | "ready";
}

export function sectionStatuses(design: EmcureDesign): SectionStatus[] {
  const hasProfile =
    Boolean(design.courseProfile.title.trim()) &&
    Boolean(design.courseProfile.durationWeeks);
  const hasFramework = design.frameworkSelections.length > 0;
  const hasNeed =
    design.stakeholders.length > 0 &&
    design.needs.some((need) => need.statement.trim());
  const hasThread =
    design.opportunities.some((item) => item.statement.trim()) &&
    design.intendedImpacts.some((item) => item.statement.trim());
  const hasSuccess = design.successCriteria.some((item) => item.statement.trim());
  const brx = primaryBigRedX(design);
  const hasBrx = Boolean(brx?.statement.trim() && brx.decisionIfResolved?.trim());
  const hasJourney = allActivities(design).length > 0;
  const openErrors = design.findings.filter(
    (finding) => finding.status === "open" && finding.severity === "error",
  ).length;

  return [
    { route: "course", label: "1. Course profile", state: flag(hasProfile, design.courseProfile.title) },
    { route: "framework", label: "2. EM framework", state: flag(hasFramework, design.frameworkMode) },
    { route: "stakeholders", label: "3. Stakeholders and need", state: flag(hasNeed, design.projectSituation || design.stakeholders.length) },
    { route: "opportunity-impact", label: "4. Opportunity and impact", state: flag(hasThread, design.opportunities.length || design.intendedImpacts.length) },
    { route: "success", label: "5. Success criteria", state: flag(hasSuccess, design.successCriteria.length) },
    { route: "big-red-x", label: "6. Big Red X", state: flag(hasBrx, design.uncertainties.length) },
    { route: "journey", label: "7. Student journey", state: flag(hasJourney, hasJourney) },
    {
      route: "review",
      label: "8. Alignment review",
      state: hasJourney && hasBrx ? (openErrors === 0 ? "ready" : "in_progress") : "not_started",
    },
    { route: "export", label: "9. Export", state: hasProfile ? "ready" : "not_started" },
  ];
}

function flag(ready: boolean, started: unknown): SectionStatus["state"] {
  if (ready) return "ready";
  if (started) return "in_progress";
  return "not_started";
}
