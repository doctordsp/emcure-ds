import { allActivities, displayTitle, primaryBigRedX } from "./createDesign";
import { ALL_FRAMEWORKS, getFrameworkItem } from "./frameworks";
import { openFindings } from "./alignment";
import type { EmcureDesign } from "./types";

function join(lines: string[]): string {
  return lines.join("\n");
}

export function designToMarkdown(design: EmcureDesign): string {
  const brx = primaryBigRedX(design);
  const frameworksUsed = ALL_FRAMEWORKS.filter((fw) =>
    fw.items.some((item) =>
      design.frameworkSelections.some((sel) => sel.frameworkItemId === item.id),
    ),
  );
  const open = openFindings(design);

  return join([
    `# ${displayTitle(design)}`,
    "",
    "Faculty design specification — EMCURE Design Studio prototype",
    "",
    `Schema version: ${design.schemaVersion}`,
    `Status: ${design.status}`,
    `Last updated: ${design.updatedAt}`,
    "",
    "## Course profile",
    "",
    `- Code: ${design.courseProfile.code || "—"}`,
    `- Discipline: ${design.courseProfile.discipline || "—"}`,
    `- Level: ${design.courseProfile.level || "—"}`,
    `- Enrollment: ${design.courseProfile.enrollment ?? "—"}`,
    `- Team size: ${design.courseProfile.teamSize ?? "—"}`,
    `- Duration (weeks): ${design.courseProfile.durationWeeks ?? "—"}`,
    `- Meeting pattern: ${design.courseProfile.meetingPattern || "—"}`,
    `- Autonomy: ${design.courseProfile.autonomyLevel}`,
    `- Prerequisites: ${design.courseProfile.prerequisites || "—"}`,
    "",
    "### Technical objectives",
    "",
    design.courseProfile.technicalObjectives || "—",
    "",
    "### Project situation",
    "",
    design.projectSituation || "—",
    "",
    "## Framework provenance",
    "",
    ...frameworksUsed.flatMap((fw) => [
      `### ${fw.framework.name}`,
      "",
      `- Publisher: ${fw.framework.publisher}`,
      `- Version: ${fw.framework.version}`,
      `- Provenance: ${fw.framework.provenance}`,
      `- License notes: ${fw.framework.licenseNotes}`,
      "",
    ]),
    "Mode: " + design.frameworkMode,
    "",
    "### Selected priorities",
    "",
    ...design.frameworkSelections.map((sel) => {
      const item = getFrameworkItem(sel.frameworkItemId);
      const interpretation = sel.localInterpretation
        ? ` Local interpretation: ${sel.localInterpretation}`
        : "";
      return `- ${item?.name ?? sel.frameworkItemId} (${sel.priority}; canonical)${interpretation}`;
    }),
    design.frameworkSelections.length === 0 ? "- None selected" : "",
    "",
    "## Stakeholders",
    "",
    ...design.stakeholders.flatMap((stk) => [
      `### ${stk.name}`,
      "",
      `- Roles: ${stk.roles.join(", ") || "—"}`,
      `- Access: ${stk.accessStatus || "—"}`,
      `- Evidence status: ${stk.evidenceStatus}`,
      `- Potential benefit: ${stk.potentialBenefit || "—"}`,
      `- Potential burden: ${stk.potentialBurden || "—"}`,
      "",
    ]),
    design.stakeholders.length === 0 ? "None recorded.\n" : "",
    "## Needs",
    "",
    ...design.needs.flatMap((need) => [
      `### ${need.statement || "Untitled need"}`,
      "",
      need.context,
      "",
      `- Current condition: ${need.currentCondition || "—"}`,
      `- Evidence: ${need.evidenceNotes || "—"} (${need.evidenceStatus})`,
      "",
    ]),
    "## Opportunities and intended impact",
    "",
    ...design.opportunities.flatMap((opp) => [
      `### Opportunity`,
      "",
      opp.statement || "—",
      "",
      `- Value created: ${opp.valueCreated || "—"}`,
      `- Evidence status: ${opp.evidenceStatus}`,
      "",
    ]),
    ...design.intendedImpacts.flatMap((impact) => [
      `### Intended impact (${impact.claimLevel}; ${impact.category || "uncategorized"})`,
      "",
      impact.statement || "—",
      "",
      `- Mechanism: ${impact.mechanism || "—"}`,
      `- Indicator: ${impact.indicator || "—"}`,
      `- Timeframe: ${impact.timeframe || "—"}`,
      `- Claim boundary: ${impact.claimBoundary || "—"}`,
      "",
    ]),
    "## Line of sight",
    "",
    design.lineOfSightStatement || "—",
    "",
    "## Success criteria",
    "",
    ...design.successCriteria.flatMap((criterion) => [
      `- **${criterion.statement || "Untitled"}** — metric: ${criterion.metric || "missing"}; target: ${criterion.targetOrThreshold || "missing"}; source: ${criterion.evidenceSource || "—"}`,
    ]),
    design.successCriteria.length === 0 ? "- None recorded" : "",
    "",
    "## Big Red X",
    "",
    brx
      ? join([
          brx.statement,
          "",
          `- Decision if resolved: ${brx.decisionIfResolved || "—"}`,
          `- Rationale: ${brx.rationale || "—"}`,
          `- Type: ${brx.type}`,
        ])
      : "No primary Big Red X selected.",
    "",
    "### Other uncertainties",
    "",
    ...design.uncertainties
      .filter((item) => item.id !== brx?.id)
      .map((item) => `- (${item.designation}) ${item.statement}`),
    "",
    "## Student journey",
    "",
    ...design.phases.flatMap((phase) => [
      `### ${phase.title}`,
      "",
      ...phase.activities.flatMap((activity) => [
        `#### ${activity.title || "Untitled activity"}`,
        "",
        activity.instructions || "—",
        "",
        `- Grouping: ${activity.grouping}; discovery: ${activity.discoveryMode}`,
        activity.discoveryMode === "student_discovered"
          ? "- Faculty note: marked for student discovery; omit from student-facing materials."
          : "",
        "",
      ]),
      phase.activities.length === 0 ? "_No activities yet._\n" : "",
    ]),
    "## Open alignment findings",
    "",
    ...open.map(
      (finding) =>
        `- **${finding.ruleId} (${finding.severity})** ${finding.title} — ${finding.explanation}`,
    ),
    open.length === 0 ? "- None open." : "",
    "",
    "---",
    "",
    `Activities in this design: ${allActivities(design).length}`,
  ]);
}

export function designToHtml(design: EmcureDesign): string {
  const markdownish = designToMarkdown(design)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const body = markdownish
    .split("\n")
    .map((line) => {
      if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
      if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
      if (line.startsWith("#### ")) return `<h4>${line.slice(5)}</h4>`;
      if (line.startsWith("- ")) return `<li>${line.slice(2)}</li>`;
      if (line.trim() === "") return "";
      if (line.startsWith("---")) return "<hr />";
      return `<p>${line}</p>`;
    })
    .join("\n")
    .replace(/(<li>[\s\S]*?<\/li>\n)+/g, (block) => `<ul>${block}</ul>`);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(displayTitle(design))}</title>
  <style>
    body { font-family: Mulish, Arial, Helvetica, sans-serif; color: #18323C; max-width: 46rem; margin: 2rem auto; line-height: 1.55; }
    h1, h2, h3 { color: #125670; }
    li { margin: 0.25rem 0; }
    @media print { body { margin: 0.75in; } }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
