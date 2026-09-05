import { allActivities, primaryBigRedX } from "./createDesign";
import type {
  Activity,
  EmcureDesign,
  IntendedImpact,
  Need,
  Opportunity,
  Stakeholder,
  SuccessCriterion,
  WorkspaceRoute,
} from "./types";

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
    | "mvrc"
    | "journey"
    | "assessment"
    | "destination";
}

export function filledText(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

export function filledNumber(value: number | undefined | null): boolean {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
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

export function courseProfileReady(design: EmcureDesign): boolean {
  const profile = design.courseProfile;
  return (
    filledText(profile.title) &&
    filledText(profile.code) &&
    filledText(profile.discipline) &&
    filledText(profile.level) &&
    filledNumber(profile.enrollment) &&
    filledNumber(profile.teamSize) &&
    filledNumber(profile.durationWeeks) &&
    filledText(profile.meetingPattern) &&
    filledText(profile.prerequisites) &&
    filledText(profile.technicalObjectives)
  );
}

export function frameworkReady(design: EmcureDesign): boolean {
  return design.frameworkSelections.some((item) => item.scopeType === "course");
}

export function stakeholderNamed(stk: Stakeholder): boolean {
  return filledText(stk.name);
}

export function needComplete(need: Need): boolean {
  return (
    filledText(need.statement) && filledText(need.context) && filledText(need.currentCondition)
  );
}

export function stakeholdersReady(design: EmcureDesign): boolean {
  return (
    filledText(design.projectSituation) &&
    design.stakeholders.some(stakeholderNamed) &&
    design.needs.some(needComplete)
  );
}

export function opportunityComplete(item: Opportunity): boolean {
  return (
    filledText(item.statement) &&
    filledText(item.valueCreated) &&
    item.needIds.length > 0 &&
    item.stakeholderIds.length > 0
  );
}

export function impactComplete(item: IntendedImpact): boolean {
  return (
    filledText(item.statement) &&
    filledText(item.mechanism) &&
    filledText(item.indicator) &&
    filledText(item.claimBoundary)
  );
}

export function threadReady(design: EmcureDesign): boolean {
  return (
    design.opportunities.some(opportunityComplete) &&
    design.intendedImpacts.some(impactComplete)
  );
}

export function successComplete(item: SuccessCriterion): boolean {
  return (
    filledText(item.statement) && filledText(item.metric) && filledText(item.targetOrThreshold)
  );
}

export function successReady(design: EmcureDesign): boolean {
  return design.successCriteria.some(successComplete);
}

export function brxReady(design: EmcureDesign): boolean {
  const brx = primaryBigRedX(design);
  return Boolean(
    brx &&
      filledText(brx.statement) &&
      filledText(brx.decisionIfResolved) &&
      filledText(brx.rationale),
  );
}

export function mvrcReady(design: EmcureDesign): boolean {
  return filledText(design.minimumViableResearchContribution?.statement);
}

export function activityComplete(item: Activity): boolean {
  return filledText(item.title) && filledText(item.instructions);
}

export function journeyReady(design: EmcureDesign): boolean {
  return allActivities(design).some(activityComplete);
}

export function sectionStatuses(design: EmcureDesign): SectionStatus[] {
  const hasProfile = courseProfileReady(design);
  const hasFramework = frameworkReady(design);
  const hasNeed = stakeholdersReady(design);
  const hasThread = threadReady(design);
  const hasSuccess = successReady(design);
  const hasBrx = brxReady(design);
  const hasMvrc = mvrcReady(design);
  const hasJourney = journeyReady(design);
  const openErrors = design.findings.filter(
    (finding) => finding.status === "open" && finding.severity === "error",
  ).length;

  return [
    {
      route: "course",
      label: "1. Course profile",
      state: flag(hasProfile, design.courseProfile.title),
      stage: "course",
    },
    {
      route: "framework",
      label: "2. EM framework",
      state: flag(hasFramework, design.frameworkMode),
      stage: "framework",
    },
    {
      route: "stakeholders",
      label: "3. Stakeholders and need",
      state: flag(hasNeed, design.projectSituation || design.stakeholders.length),
      stage: "project",
    },
    {
      route: "opportunity-impact",
      label: "4. Opportunity and impact",
      state: flag(hasThread, design.opportunities.length || design.intendedImpacts.length),
      stage: "opportunity",
    },
    {
      route: "success",
      label: "5. Success criteria",
      state: flag(hasSuccess, design.successCriteria.length),
      stage: "success",
    },
    {
      route: "big-red-x",
      label: "6. Big Red X",
      state: flag(hasBrx, design.uncertainties.length),
      stage: "brx",
    },
    {
      route: "mvrc",
      label: "7. MVRC",
      state: flag(hasMvrc, design.minimumViableResearchContribution?.statement),
      stage: "mvrc",
    },
    {
      route: "journey",
      label: "8. Student journey",
      state: flag(hasJourney, allActivities(design).length),
      stage: "journey",
    },
    {
      route: "review",
      label: "9. Alignment review",
      state:
        hasJourney && hasBrx && hasMvrc
          ? openErrors === 0
            ? "ready"
            : "in_progress"
          : "not_started",
      stage: "assessment",
    },
    {
      route: "export",
      label: "10. Export",
      state: hasProfile ? "ready" : "not_started",
      stage: "destination",
    },
  ];
}

function flag(ready: boolean, started: unknown): SectionStatus["state"] {
  if (ready) return "ready";
  if (started) return "in_progress";
  return "not_started";
}
