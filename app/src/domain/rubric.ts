import { allActivities, displayTitle, primaryBigRedX } from "./createDesign";
import { getFrameworkItem } from "./frameworks";
import { escapeHtml } from "./html";
import { mvrcDeliverables, mvrcStatement } from "./mvrc";
import type { EmcureDesign, EmcureRubric, RubricAudience, RubricKind } from "./types";

export const RUBRIC_LEVELS = ["Beginning", "Developing", "Proficient", "Exemplary"] as const;

const LEVEL_STUBS: Record<(typeof RUBRIC_LEVELS)[number], string> = {
  Beginning: "Little or no usable evidence for this criterion.",
  Developing: "Partial evidence; remaining gaps still block a decision.",
  Proficient: "Meets the expected evidence for this course.",
  Exemplary: "Evidence is complete, bounded, and ready for a partner decision.",
};

export function emptyRubric(): EmcureRubric {
  return {
    title: "Assessment rubric",
    kind: "both",
    audience: "students",
    body: "",
    facultyNotes: "",
  };
}

export function resolvedRubric(design: EmcureDesign): EmcureRubric {
  return { ...emptyRubric(), ...design.rubric };
}

export interface RubricSourceSummary {
  title: string;
  technicalObjectives: string;
  lineOfSight: string;
  bigRedX: string;
  mvrc: string;
  mvrcDeliverables: string[];
  successCriteria: { statement: string; metric: string; target: string }[];
  emItems: { name: string; definition: string; priority: string }[];
  activities: { title: string; grouping: string }[];
  stakeholders: string[];
}

export function collectRubricSources(design: EmcureDesign): RubricSourceSummary {
  const brx = primaryBigRedX(design);
  return {
    title: displayTitle(design),
    technicalObjectives: design.courseProfile.technicalObjectives.trim(),
    lineOfSight: design.lineOfSightStatement?.trim() ?? "",
    bigRedX: brx?.statement.trim() ?? "",
    mvrc: mvrcStatement(design),
    mvrcDeliverables: mvrcDeliverables(design),
    successCriteria: design.successCriteria
      .filter((item) => item.statement.trim())
      .map((item) => ({
        statement: item.statement.trim(),
        metric: item.metric?.trim() ?? "",
        target: item.targetOrThreshold?.trim() ?? "",
      })),
    emItems: design.frameworkSelections.map((sel) => {
      const item = getFrameworkItem(sel.frameworkItemId);
      return {
        name: item?.name ?? sel.frameworkItemId,
        definition: item?.definition ?? "",
        priority: sel.priority,
      };
    }),
    activities: allActivities(design)
      .filter((activity) => activity.title.trim() || activity.instructions.trim())
      .map((activity) => ({
        title: activity.title.trim() || "Untitled activity",
        grouping: activity.grouping.replaceAll("_", " "),
      })),
    stakeholders: design.stakeholders
      .map((stk) => stk.name.trim())
      .filter(Boolean),
  };
}

export function canDraftRubric(design: EmcureDesign): boolean {
  const sources = collectRubricSources(design);
  return Boolean(
    sources.technicalObjectives ||
      sources.bigRedX ||
      sources.mvrc ||
      sources.successCriteria.length ||
      sources.emItems.length,
  );
}

export function kindLabel(kind: RubricKind): string {
  if (kind === "formative") return "Formative — feedback during the investigation.";
  if (kind === "summative") return "Summative — judgment of the end-of-term evidence packet.";
  return "Formative and summative. Use the same criteria for feedback, then for the final packet.";
}

export function audienceLabel(audience: RubricAudience): string {
  if (audience === "faculty") return "Faculty only — not released to students.";
  if (audience === "both") return "Shared with students; faculty notes stay off the student copy.";
  return "Student-facing.";
}

export function draftRubricFromDesign(design: EmcureDesign, rubric = resolvedRubric(design)): string {
  const sources = collectRubricSources(design);
  const title = `${rubric.title.trim() || "Assessment rubric"} — ${sources.title}`;
  const performance = performanceRows(sources);
  const em = emRows(sources);
  const lines = [
    `# ${title}`,
    "",
    kindLabel(rubric.kind),
    audienceLabel(rubric.audience),
    "",
    "Descriptors are a starting draft from this EM-CURE. Edit before using with students. Do not treat stakeholder satisfaction as a grade.",
    "",
    "## Student performance",
    "",
    "Technical work, investigation quality, and the minimum research contribution.",
    "",
  ];

  if (performance.length) {
    lines.push(...markdownTable(["Criterion", ...RUBRIC_LEVELS, "Evidence"], performance), "");
  } else {
    lines.push("_No success criteria, MVRC, or technical objectives yet. Add those in the studio, then draft again._", "");
  }

  lines.push(
    "## Entrepreneurial mindset",
    "",
    "Score observable work and interaction. Self-report alone is not sufficient evidence.",
    "",
  );

  if (em.length) {
    lines.push(...markdownTable(["Criterion", ...RUBRIC_LEVELS, "Evidence"], em), "");
  } else {
    lines.push("_No Habits of EM or Observable Behaviors selected yet._", "");
  }

  if (rubric.kind !== "formative") {
    lines.push(
      "## Course and program evaluation (faculty)",
      "",
      "Use this section to learn about the course. Do not convert it into a student grade.",
      "",
      sources.stakeholders.length
        ? `- Stakeholder feedback from: ${sources.stakeholders.join("; ")}.`
        : "- Stakeholder feedback, if collected, stays separate from grading.",
      sources.bigRedX
        ? `- Did the investigation reduce uncertainty about: ${sources.bigRedX}`
        : "- Did the investigation reduce the intended uncertainty?",
      "- What should change the next time this EM-CURE runs?",
      "",
    );
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

function performanceRows(sources: RubricSourceSummary): string[][] {
  const rows: string[][] = [];
  if (sources.technicalObjectives) {
    rows.push(
      row(
        "Technical objectives",
        sources.technicalObjectives,
        "Work products and methods that address the stated technical objectives.",
      ),
    );
  }
  if (sources.mvrc) {
    rows.push(
      row(
        "Minimum viable research contribution",
        sources.mvrc,
        sources.mvrcDeliverables.join("; ") || "The stated MVRC deliverables.",
      ),
    );
  }
  for (const item of sources.successCriteria) {
    const evidence = [item.metric && `Metric: ${item.metric}`, item.target && `Target: ${item.target}`]
      .filter(Boolean)
      .join(". ");
    rows.push(row(item.statement, item.statement, evidence || "Linked success criterion."));
  }
  if (sources.bigRedX) {
    rows.push(
      row(
        "Evidence on the Big Red X",
        `The packet reduces uncertainty about: ${sources.bigRedX}`,
        "Data, interpretation, remaining uncertainty, and a bounded recommendation.",
      ),
    );
  }
  return rows;
}

function emRows(sources: RubricSourceSummary): string[][] {
  return sources.emItems.map((item) =>
    row(
      `${item.name} (${item.priority})`,
      item.definition || item.name,
      "Observable product, conversation, or decision — not a self-report survey alone.",
    ),
  );
}

function row(name: string, focus: string, evidence: string): string[] {
  return [
    `${name}. ${focus}`,
    LEVEL_STUBS.Beginning,
    LEVEL_STUBS.Developing,
    LEVEL_STUBS.Proficient,
    LEVEL_STUBS.Exemplary,
    evidence,
  ];
}

function markdownTable(headers: string[], rows: string[][]): string[] {
  const escape = (cell: string) => cell.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const header = `| ${headers.map(escape).join(" | ")} |`;
  const divider = `| ${headers.map(() => "---").join(" | ")} |`;
  return [header, divider, ...rows.map((cells) => `| ${cells.map(escape).join(" | ")} |`)];
}

export function studentFacingRubricMarkdown(design: EmcureDesign): string | null {
  const rubric = resolvedRubric(design);
  if (!rubric.body.trim()) return null;
  if (rubric.audience === "faculty") return null;
  return rubric.body.trim();
}

export function facultyRubricMarkdown(design: EmcureDesign): string {
  const rubric = resolvedRubric(design);
  const title = rubric.title.trim() || `Assessment rubric — ${displayTitle(design)}`;
  const notes = rubric.facultyNotes.trim();
  const body = rubric.body.trim() || "_No rubric draft yet._";
  return [
    body.startsWith("#") ? body : `# ${title}\n\n${body}`,
    notes ? `\n\n## Faculty notes\n\n${notes}\n` : "",
  ].join("");
}

export function rubricToHtml(title: string, markdown: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Mulish, Arial, Helvetica, sans-serif; color: #18323C; max-width: 56rem; margin: 2rem auto; line-height: 1.55; }
    h1, h2, h3 { color: #125670; }
    table { border-collapse: collapse; width: 100%; font-size: 0.9rem; margin: 1rem 0; }
    th, td { border: 1px solid #cbd8dd; padding: 8px; vertical-align: top; }
    th { background: #dcebf0; text-align: left; }
    @media print { body { margin: 0.6in; } table { font-size: 0.8rem; } }
  </style>
</head>
<body>
${markdownToPrintableHtml(markdown)}
</body>
</html>`;
}

export function markdownToPrintableHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (isTableRow(line) && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        if (!isTableDivider(lines[i])) rows.push(splitCells(lines[i]));
        i += 1;
      }
      if (rows.length) {
        const [header, ...body] = rows;
        out.push("<table>");
        out.push(
          `<thead><tr>${header.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead>`,
        );
        out.push(
          `<tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>`,
        );
        out.push("</table>");
      }
      continue;
    }
    if (line.startsWith("# ")) out.push(`<h1>${inline(line.slice(2))}</h1>`);
    else if (line.startsWith("## ")) out.push(`<h2>${inline(line.slice(3))}</h2>`);
    else if (line.startsWith("### ")) out.push(`<h3>${inline(line.slice(4))}</h3>`);
    else if (line.startsWith("- ")) out.push(`<li>${inline(line.slice(2))}</li>`);
    else if (line.startsWith("_") && line.endsWith("_") && line.length > 2) {
      out.push(`<p><em>${inline(line.slice(1, -1))}</em></p>`);
    } else if (line.trim() === "") out.push("");
    else out.push(`<p>${inline(line)}</p>`);
    i += 1;
  }
  return out.join("\n").replace(/(<li>[\s\S]*?<\/li>\n)+/g, (block) => `<ul>${block}</ul>`);
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 1;
}

function isTableDivider(line: string): boolean {
  return isTableRow(line) && /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function splitCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim().replace(/\\\|/g, "|"));
}

function inline(value: string): string {
  return escapeHtml(value).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}
