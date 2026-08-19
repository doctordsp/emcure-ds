import { collectRubricSources, kindLabel, resolvedRubric } from "../domain/rubric";
import type { EmcureDesign } from "../domain/types";

function clip(value: string, max = 400): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trim()}…`;
}

export function rubricDraftPrompt(design: EmcureDesign): string {
  const rubric = resolvedRubric(design);
  const sources = collectRubricSources(design);
  const facts = [
    `Title: ${sources.title}`,
    sources.technicalObjectives && `Technical objectives: ${clip(sources.technicalObjectives)}`,
    sources.lineOfSight && `Line of sight: ${clip(sources.lineOfSight)}`,
    sources.bigRedX && `Big Red X: ${clip(sources.bigRedX)}`,
    sources.mvrc && `MVRC: ${clip(sources.mvrc)}`,
    sources.mvrcDeliverables.length
      ? `MVRC deliverables: ${sources.mvrcDeliverables.map(clip).join("; ")}`
      : "",
    sources.successCriteria.length
      ? `Success criteria: ${sources.successCriteria
          .map((item) =>
            [item.statement, item.metric && `metric ${item.metric}`, item.target && `target ${item.target}`]
              .filter(Boolean)
              .join(" — "),
          )
          .join("; ")}`
      : "",
    sources.emItems.length
      ? `EM items: ${sources.emItems
          .map((item) => `${item.name} (${item.priority})${item.definition ? `: ${clip(item.definition, 160)}` : ""}`)
          .join("; ")}`
      : "",
    sources.activities.length
      ? `Activities: ${sources.activities.map((item) => `${item.title} [${item.grouping}]`).join("; ")}`
      : "",
    sources.stakeholders.length ? `Stakeholders: ${sources.stakeholders.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "Draft an assessment rubric for this EM-CURE (entrepreneurially minded course-based undergraduate research experience).",
    `Use: ${kindLabel(rubric.kind)}`,
    `Audience: ${rubric.audience}.`,
    "Write only from the design facts below. Do not invent a new project, stakeholders, metrics, or learning outcomes.",
    "Include three sections: (1) Student performance, (2) Entrepreneurial mindset, (3) Course and program evaluation (faculty).",
    "Use four levels: Beginning, Developing, Proficient, Exemplary.",
    "EM criteria must require observable work or interaction. Self-report alone is not sufficient evidence.",
    "Do not convert stakeholder satisfaction or partner feedback into a student grade.",
    "Do not include faculty studio notes, alignment-rule IDs, or discovery-reserved activity instructions.",
    "Return Markdown only: a title, short intro, then complete Markdown tables for every section. Never return an empty document or stop after the heading.",
    "",
    "Design facts:",
    facts,
  ].join("\n");
}
