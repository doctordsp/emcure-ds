import { allActivities, primaryBigRedX } from "./createDesign";
import { getFrameworkItem } from "./frameworks";
import { createId } from "./ids";
import { mvrcClaimsDemonstratedImpact, mvrcStatement, MVRC_DEFINITION, MVRC_LABEL } from "./mvrc";
import {
  MVRC_OBJECT_ID,
  type AlignmentFinding,
  type EmcureDesign,
  type FindingSeverity,
  type WorkspaceRoute,
} from "./types";

export function findingKey(finding: Pick<AlignmentFinding, "ruleId" | "affectedObjectIds">): string {
  return `${finding.ruleId}:${[...finding.affectedObjectIds].sort().join(",")}`;
}

function makeFinding(input: {
  ruleId: string;
  severity: FindingSeverity;
  title: string;
  explanation: string;
  affectedObjectIds: string[];
  suggestedAction: string;
  route: WorkspaceRoute;
}): AlignmentFinding {
  return {
    id: createId(),
    status: "open",
    ...input,
  };
}

export function evaluateDesign(design: EmcureDesign): AlignmentFinding[] {
  const findings: AlignmentFinding[] = [];
  const activities = allActivities(design);
  const linkedIds = new Set(activities.flatMap((activity) => activity.linkedObjectIds));
  const brx = primaryBigRedX(design);

  for (const selection of design.frameworkSelections) {
    if (selection.scopeType !== "course") continue;
    if (linkedIds.has(selection.frameworkItemId)) continue;
    const item = getFrameworkItem(selection.frameworkItemId);
    const name = item?.name ?? selection.frameworkItemId;
    findings.push(
      makeFinding({
        ruleId: "AL-001",
        severity: "warning",
        title: "Selected EM item is never practiced",
        explanation: `“${name}” is selected but no activity is connected to it.`,
        suggestedAction:
          "Link a student activity to this habit or behavior, or remove it from the course priorities.",
        affectedObjectIds: [selection.id, selection.frameworkItemId],
        route: "journey",
      }),
    );
  }

  if (brx && activities.length > 0) {
    const linkedInvestigations = activities.filter((activity) =>
      activity.linkedObjectIds.includes(brx.id),
    );
    if (linkedInvestigations.length === 0) {
      findings.push(
        makeFinding({
          ruleId: "AL-005",
          severity: "error",
          title: "Investigation is not linked to the Big Red X",
          explanation:
            "The planned experiment does not address the selected critical uncertainty.",
          suggestedAction:
            "Connect at least one investigation activity to the primary Big Red X.",
          affectedObjectIds: [brx.id, ...activities.map((activity) => activity.id)],
          route: "journey",
        }),
      );
    }
  }

  if (brx && !brx.decisionIfResolved?.trim()) {
    findings.push(
      makeFinding({
        ruleId: "AL-006",
        severity: "error",
        title: "Big Red X is missing a decision statement",
        explanation:
          "State what decision could change if this uncertainty is resolved.",
        suggestedAction:
          "Add a decision-if-resolved statement on the Big Red X page.",
        affectedObjectIds: [brx.id],
        route: "big-red-x",
      }),
    );
  }

  for (const opportunity of design.opportunities) {
    if (opportunity.needIds.length > 0 && opportunity.stakeholderIds.length > 0) {
      continue;
    }
    findings.push(
      makeFinding({
        ruleId: "AL-007",
        severity: "error",
        title: "Opportunity lacks a supported need-holder",
        explanation:
          "The opportunity is not linked to both a need and at least one stakeholder.",
        suggestedAction: "Link this opportunity to a need and the stakeholder who holds it.",
        affectedObjectIds: [opportunity.id],
        route: "opportunity-impact",
      }),
    );
  }

  for (const impact of design.intendedImpacts) {
    if (impact.mechanism.trim() && impact.indicator?.trim()) continue;
    findings.push(
      makeFinding({
        ruleId: "AL-008",
        severity: "warning",
        title: "Intended impact is missing a mechanism or indicator",
        explanation:
          "Explain how this work could contribute to the intended change and how students would notice it.",
        suggestedAction: "Add a mechanism and an indicator on the Opportunity–Impact canvas.",
        affectedObjectIds: [impact.id],
        route: "opportunity-impact",
      }),
    );
  }

  for (const impact of design.intendedImpacts) {
    if (impact.claimLevel !== "demonstrated_impact") continue;
    findings.push(
      makeFinding({
        ruleId: "AL-009",
        severity: "warning",
        title: "Impact claim exceeds likely evidence",
        explanation:
          "The course can support potential impact, not demonstrated impact, unless evidence of change already exists.",
        suggestedAction:
          "Change the claim level to potential impact, outcome, or output, or document existing evidence.",
        affectedObjectIds: [impact.id],
        route: "opportunity-impact",
      }),
    );
  }

  for (const criterion of design.successCriteria) {
    if (criterion.metric?.trim() && criterion.targetOrThreshold?.trim()) continue;
    findings.push(
      makeFinding({
        ruleId: "AL-010",
        severity: "warning",
        title: "Success criterion is not measurable",
        explanation: "Add a metric, threshold, or decision rule.",
        suggestedAction: "Specify a metric and a target or decision threshold.",
        affectedObjectIds: [criterion.id],
        route: "success",
      }),
    );
  }

  if (brx && !mvrcStatement(design)) {
    findings.push(
      makeFinding({
        ruleId: "AL-019",
        severity: "warning",
        title: `Big Red X has no ${MVRC_LABEL}`,
        explanation:
          `Name ${MVRC_DEFINITION} so the investigation has a bounded contribution, not only a question.`,
        suggestedAction: `Add a ${MVRC_LABEL} on the Big Red X page.`,
        affectedObjectIds: [brx.id],
        route: "big-red-x",
      }),
    );
  }

  if (mvrcStatement(design) && activities.length > 0) {
    const linked = activities.filter((activity) =>
      activity.linkedObjectIds.includes(MVRC_OBJECT_ID),
    );
    if (linked.length === 0) {
      findings.push(
        makeFinding({
          ruleId: "AL-020",
          severity: "warning",
          title: `No activity is linked to the ${MVRC_LABEL}`,
          explanation:
            `The student journey does not identify which work produces the ${MVRC_LABEL}.`,
          suggestedAction: `Link at least one investigation or communication activity to the ${MVRC_LABEL}.`,
          affectedObjectIds: [MVRC_OBJECT_ID, ...activities.map((activity) => activity.id)],
          route: "journey",
        }),
      );
    }
  }

  if (mvrcClaimsDemonstratedImpact(design)) {
    findings.push(
      makeFinding({
        ruleId: "AL-021",
        severity: "warning",
        title: `${MVRC_LABEL} claims demonstrated impact`,
        explanation:
          `The ${MVRC_LABEL} should be a student research product this term, not demonstrated neighborhood or partner impact.`,
        suggestedAction:
          `Rewrite the ${MVRC_LABEL} so it names evidence, a packet, or a bounded recommendation rather than demonstrated impact.`,
        affectedObjectIds: [MVRC_OBJECT_ID],
        route: "big-red-x",
      }),
    );
  }

  return findings;
}

export function mergeFindings(
  previous: AlignmentFinding[],
  next: AlignmentFinding[],
): AlignmentFinding[] {
  const prior = new Map(previous.map((finding) => [findingKey(finding), finding]));
  return next.map((finding) => {
    const existing = prior.get(findingKey(finding));
    if (!existing) return finding;
    return {
      ...finding,
      id: existing.id,
      status: existing.status,
      resolutionNote: existing.resolutionNote,
    };
  });
}

export function applyAlignment(design: EmcureDesign): EmcureDesign {
  return {
    ...design,
    findings: mergeFindings(design.findings, evaluateDesign(design)),
  };
}

export function openFindings(design: EmcureDesign): AlignmentFinding[] {
  return design.findings.filter((finding) => finding.status === "open");
}

export function countBySeverity(design: EmcureDesign): {
  error: number;
  warning: number;
  consideration: number;
} {
  const open = openFindings(design);
  return {
    error: open.filter((finding) => finding.severity === "error").length,
    warning: open.filter((finding) => finding.severity === "warning").length,
    consideration: open.filter((finding) => finding.severity === "consideration").length,
  };
}
