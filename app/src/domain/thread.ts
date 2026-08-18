import { allActivities, primaryBigRedX } from "./createDesign";
import { MVRC_LABEL, mvrcStatement } from "./mvrc";
import type { EmcureDesign, WorkspaceRoute } from "./types";

export interface ThreadNode {
  key: string;
  label: string;
  summary: string;
  filled: boolean;
  route: WorkspaceRoute;
  gap?: string;
}

export function threadNodes(design: EmcureDesign): ThreadNode[] {
  const need = design.needs.find((item) => item.statement.trim());
  const opportunity = design.opportunities.find((item) => item.statement.trim());
  const impact = design.intendedImpacts.find((item) => item.statement.trim());
  const success = design.successCriteria.find((item) => item.statement.trim());
  const brx = primaryBigRedX(design);
  const mvrc = mvrcStatement(design);
  const activities = allActivities(design);
  const investigation = brx
    ? activities.find((activity) => activity.linkedObjectIds.includes(brx.id))
    : undefined;
  const evidence = design.successCriteria.find((item) => item.evidenceSource?.trim());
  const decision = brx?.decisionIfResolved?.trim();

  const nodes: ThreadNode[] = [
    {
      key: "need",
      label: "Need",
      filled: Boolean(need),
      summary: need?.statement ?? "",
      gap: "No need statement yet",
      route: "stakeholders",
    },
    {
      key: "opportunity",
      label: "Opportunity",
      filled: Boolean(opportunity),
      summary: opportunity?.statement ?? "",
      gap: "No opportunity linked to a need",
      route: "opportunity-impact",
    },
    {
      key: "impact",
      label: "Intended impact",
      filled: Boolean(impact),
      summary: impact?.statement ?? "",
      gap: "No intended impact yet",
      route: "opportunity-impact",
    },
    {
      key: "success",
      label: "Success",
      filled: Boolean(success),
      summary: success?.statement ?? "",
      gap: "No success criterion yet",
      route: "success",
    },
    {
      key: "brx",
      label: "Big Red X",
      filled: Boolean(brx?.statement.trim()),
      summary: brx?.statement ?? "",
      gap: "No primary Big Red X selected",
      route: "big-red-x",
    },
    {
      key: "mvrc",
      label: MVRC_LABEL,
      filled: Boolean(mvrc),
      summary: mvrc,
      gap: `No ${MVRC_LABEL} yet`,
      route: "big-red-x",
    },
    {
      key: "investigation",
      label: "Investigation",
      filled: Boolean(investigation),
      summary: investigation?.title ?? "",
      gap: "No activity is linked to the Big Red X",
      route: "journey",
    },
    {
      key: "evidence",
      label: "Evidence",
      filled: Boolean(evidence),
      summary: evidence?.evidenceSource ?? "",
      gap: "No evidence source on a success criterion",
      route: "success",
    },
    {
      key: "decision",
      label: "Decision",
      filled: Boolean(decision),
      summary: decision ?? "",
      gap: "No decision-if-resolved statement",
      route: "big-red-x",
    },
  ];
  return nodes;
}

export function draftLineOfSight(design: EmcureDesign): string {
  const brx = primaryBigRedX(design);
  const opportunity = design.opportunities.find((item) => item.statement.trim());
  const impact = design.intendedImpacts.find((item) => item.statement.trim());
  const stakeholders = design.stakeholders
    .filter((item) => item.name.trim())
    .map((item) => item.name)
    .join(", ");
  const investigation = allActivities(design).find(
    (activity) => brx && activity.linkedObjectIds.includes(brx.id),
  );
  const work =
    mvrcStatement(design) ||
    investigation?.title.trim() ||
    design.courseProfile.technicalObjectives.trim() ||
    "[research question or technical work]";
  return `We are investigating ${work} to resolve ${brx?.statement.trim() || "[critical uncertainty]"}. This uncertainty affects ${opportunity?.statement.trim() || "[opportunity to create value]"}, which could contribute to ${impact?.statement.trim() || "[intended impact]"} for ${stakeholders || "[stakeholders]"}. The evidence will inform ${brx?.decisionIfResolved?.trim() || "[decision or next action]"}.`;
}
