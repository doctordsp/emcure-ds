import { allActivities, displayTitle, primaryBigRedX } from "./createDesign";
import { getFrameworkItem } from "./frameworks";
import { escapeHtml } from "./html";
import type { EmcureCard, EmcureDesign } from "./types";

export const YEAR_LEVELS = [
  { id: "lower-division", label: "Lower Division (1st/2nd)" },
  { id: "upper-division", label: "Upper Division (3rd/4th)" },
  { id: "graduate", label: "Graduate" },
  { id: "professional", label: "Professional / other" },
] as const;

export const CARD_STAGES = [
  { id: "idea-generation", label: "Idea Generation & Discovery" },
  { id: "user-identification", label: "User Identification" },
  { id: "value-proposition", label: "Value Proposition" },
  { id: "competitor-analysis", label: "Competitor Analysis" },
  { id: "prototypes", label: "Prototypes" },
  { id: "pilot-pivot", label: "Pilot / Pivot" },
] as const;

export const CARD_COMPONENTS = [
  { id: "case-study", label: "Case Study/Scenario" },
  { id: "concept-map", label: "Concept Map/Sketching/Brainstorming" },
  { id: "hands-on", label: "Hands-on Activity" },
  { id: "literature-review", label: "Literature Review" },
  { id: "mockup", label: "Mockup/Low-Fidelity Prototype" },
  { id: "student-survey", label: "Student Survey / Testing" },
  { id: "video-case", label: "Video / Case / Article" },
] as const;

export const CARD_FORMATS = [
  { id: "service-learning", label: "Service Learning / Community Project" },
  { id: "challenge-based", label: "Problem/Challenge-Based Project" },
  { id: "team-design", label: "Team Design/Build Project" },
  { id: "independent-research", label: "Independent Research Project" },
  { id: "collaborative-research", label: "Collaborative Research Project" },
  { id: "consultancy", label: "Consultancy Project" },
] as const;

/** Classic KEEN 3C outcomes used on Engineering Unleashed-style cards. */
export const CARD_EM_OUTCOMES = [
  {
    id: "cur-curiosity",
    group: "Curiosity",
    label: "Demonstrate constant curiosity about our changing world",
    habitIds: ["H-CUR-INQ"],
  },
  {
    id: "cur-contrarian",
    group: "Curiosity",
    label: "Explore a contrarian view of accepted ideas",
    habitIds: ["H-CUR-CON"],
  },
  {
    id: "con-integrate",
    group: "Connections",
    label: "Integrate information from many sources to gain insight",
    habitIds: ["H-CON-CRE", "H-CON-KNO"],
  },
  {
    id: "con-risk",
    group: "Connections",
    label: "Assess and manage risk",
    habitIds: ["H-CON-RSK"],
  },
  {
    id: "val-opportunity",
    group: "Creating Value",
    label: "Identify unexpected opportunities to create extraordinary value",
    habitIds: ["H-CUR-OPP", "H-VAL-AWA"],
  },
  {
    id: "val-persist",
    group: "Creating Value",
    label: "Persist through and learn from failure",
    habitIds: ["H-VAL-PER"],
  },
] as const;

export const FEATURED_IMAGE_MAX_BYTES = 1_500_000;
export const FEATURED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export function emptyCard(): EmcureCard {
  return {
    title: "",
    author: "",
    yearLevel: "",
    course: "",
    materials: "",
    problemNeed: "",
    description: "",
    emOutcomeIds: [],
    emComments: "",
    learningObjectives: "",
    stages: [],
    components: [],
    formats: [],
    assessment: "",
    acknowledgments: "",
    category: "",
    subCategory: "",
    references: "",
    license: "",
    summary: "",
  };
}

export function yearLevelFromCourse(level: string): string {
  const text = level.toLowerCase();
  if (
    text.includes("first") ||
    text.includes("1st") ||
    text.includes("fresh") ||
    text.includes("soph") ||
    text.includes("2nd") ||
    text.includes("lower")
  ) {
    return "lower-division";
  }
  if (
    text.includes("junior") ||
    text.includes("senior") ||
    text.includes("3rd") ||
    text.includes("4th") ||
    text.includes("upper")
  ) {
    return "upper-division";
  }
  if (text.includes("grad")) return "graduate";
  return level.trim() ? "professional" : "";
}

/** Fields that can be copied from the studio design without AI. */
export type CardFillField =
  | "title"
  | "yearLevel"
  | "course"
  | "materials"
  | "problemNeed"
  | "description"
  | "emComments"
  | "emOutcomeIds"
  | "learningObjectives"
  | "stages"
  | "components"
  | "formats"
  | "assessment"
  | "category"
  | "summary";

const FILL_SOURCES: Record<CardFillField, string> = {
  title: "from Course profile",
  yearLevel: "from Course level",
  course: "from Course profile",
  materials: "starter from course envelope and journey — not a supply list",
  problemNeed: "from Need + Opportunity",
  description: "from Situation, Opportunity, Impact, and line of sight",
  emComments: "from selected habits and behaviors",
  emOutcomeIds: "from selected habits mapped to the 3Cs",
  learningObjectives: "from technical objectives",
  stages: "from stakeholders, opportunity, and journey",
  components: "starter from the student journey",
  formats: "from stakeholders and team size",
  assessment: "from Success criteria",
  category: "from Course discipline",
  summary: "template summary from the design",
};

export function cardFillSource(field: CardFillField): string {
  return FILL_SOURCES[field];
}

export function cardTitleFromDesign(design: EmcureDesign): string {
  return displayTitle(design);
}

export function cardYearLevelFromDesign(design: EmcureDesign): string {
  return yearLevelFromCourse(design.courseProfile.level);
}

export function cardCourseFromDesign(design: EmcureDesign): string {
  return (
    [design.courseProfile.code, design.courseProfile.title].filter(Boolean).join(" — ") ||
    displayTitle(design)
  );
}

/** Course envelope + activity titles. Starter text, not a lab supply list. */
export function cardMaterialsFromDesign(design: EmcureDesign): string {
  const profile = design.courseProfile;
  const parts: string[] = [];
  if (profile.durationWeeks) {
    parts.push(`${profile.durationWeeks}-week ${profile.meetingPattern.trim() || "course"}`);
  } else if (profile.meetingPattern.trim()) {
    parts.push(profile.meetingPattern.trim());
  }
  if (profile.teamSize) parts.push(`teams of ${profile.teamSize}`);
  if (profile.enrollment) parts.push(`${profile.enrollment} students`);
  const activityTitles = allActivities(design)
    .map((activity) => activity.title.trim())
    .filter(Boolean);
  if (activityTitles.length > 0) parts.push(activityTitles.join("; "));
  return parts.join("; ");
}

export function cardProblemNeedFromDesign(design: EmcureDesign): string {
  const need = design.needs.find((item) => item.statement.trim());
  const opportunity = design.opportunities.find((item) => item.statement.trim());
  return [need?.statement, need?.context, opportunity?.statement]
    .filter((part) => part?.trim())
    .join("\n\n");
}

export function cardDescriptionFromDesign(design: EmcureDesign): string {
  const opportunity = design.opportunities.find((item) => item.statement.trim());
  const impact = design.intendedImpacts.find((item) => item.statement.trim());
  return [
    design.projectSituation,
    opportunity?.valueCreated ? `Value created: ${opportunity.valueCreated}` : "",
    impact?.statement ? `Intended impact: ${impact.statement}` : "",
    design.lineOfSightStatement,
  ]
    .filter((part) => part?.trim())
    .join("\n\n");
}

export function cardEmCommentsFromDesign(design: EmcureDesign): string {
  return design.frameworkSelections
    .map((sel) => {
      const item = getFrameworkItem(sel.frameworkItemId);
      const interpretation = sel.localInterpretation
        ? ` Local interpretation: ${sel.localInterpretation}`
        : "";
      return `${item?.name ?? sel.frameworkItemId} (${sel.priority})${interpretation}`;
    })
    .join("\n");
}

export function cardEmOutcomeIdsFromDesign(design: EmcureDesign): string[] {
  const selectedIds = new Set(design.frameworkSelections.map((sel) => sel.frameworkItemId));
  return CARD_EM_OUTCOMES.filter((outcome) =>
    outcome.habitIds.some((habitId) => selectedIds.has(habitId)),
  ).map((outcome) => outcome.id);
}

export function cardLearningObjectivesFromDesign(design: EmcureDesign): string {
  return design.courseProfile.technicalObjectives;
}

export function cardStagesFromDesign(design: EmcureDesign): string[] {
  return guessStages(design);
}

export function cardComponentsFromDesign(design: EmcureDesign): string[] {
  return guessComponents(design);
}

export function cardFormatsFromDesign(design: EmcureDesign): string[] {
  return guessFormats(design);
}

export function cardAssessmentFromDesign(design: EmcureDesign): string {
  return design.successCriteria
    .filter((item) => item.statement.trim())
    .map((item) => {
      const metric = item.metric ? ` Metric: ${item.metric}.` : "";
      const target = item.targetOrThreshold ? ` Target: ${item.targetOrThreshold}.` : "";
      return `${item.statement}.${metric}${target}`;
    })
    .join("\n\n");
}

export function cardCategoryFromDesign(design: EmcureDesign): string {
  return design.courseProfile.discipline.trim() || "Engineering/Technology";
}

export function cardSummaryFromDesign(design: EmcureDesign): string {
  return generateCardSummary(draftCardFromDesign(design));
}

export function cardFillValue(
  design: EmcureDesign,
  field: CardFillField,
): string | string[] {
  switch (field) {
    case "title":
      return cardTitleFromDesign(design);
    case "yearLevel":
      return cardYearLevelFromDesign(design);
    case "course":
      return cardCourseFromDesign(design);
    case "materials":
      return cardMaterialsFromDesign(design);
    case "problemNeed":
      return cardProblemNeedFromDesign(design);
    case "description":
      return cardDescriptionFromDesign(design);
    case "emComments":
      return cardEmCommentsFromDesign(design);
    case "emOutcomeIds":
      return cardEmOutcomeIdsFromDesign(design);
    case "learningObjectives":
      return cardLearningObjectivesFromDesign(design);
    case "stages":
      return cardStagesFromDesign(design);
    case "components":
      return cardComponentsFromDesign(design);
    case "formats":
      return cardFormatsFromDesign(design);
    case "assessment":
      return cardAssessmentFromDesign(design);
    case "category":
      return cardCategoryFromDesign(design);
    case "summary":
      return cardSummaryFromDesign(design);
  }
}

export function canFillCardField(design: EmcureDesign, field: CardFillField): boolean {
  if (field === "yearLevel") return Boolean(design.courseProfile.level.trim());
  if (field === "category") return Boolean(design.courseProfile.discipline.trim());
  if (field === "title" || field === "course") {
    return Boolean(design.courseProfile.title.trim() || design.title.trim());
  }
  const value = cardFillValue(design, field);
  if (Array.isArray(value)) return value.length > 0;
  return value.trim().length > 0;
}

export function fillCardField(
  card: EmcureCard,
  design: EmcureDesign,
  field: CardFillField,
): EmcureCard {
  if (!canFillCardField(design, field)) return card;
  const value = cardFillValue(design, field);
  return { ...card, [field]: value };
}

export function draftCardFromDesign(design: EmcureDesign): EmcureCard {
  return {
    ...emptyCard(),
    title: cardTitleFromDesign(design),
    yearLevel: cardYearLevelFromDesign(design),
    course: cardCourseFromDesign(design),
    materials: cardMaterialsFromDesign(design),
    problemNeed: cardProblemNeedFromDesign(design),
    description: cardDescriptionFromDesign(design),
    emOutcomeIds: cardEmOutcomeIdsFromDesign(design),
    emComments: cardEmCommentsFromDesign(design),
    learningObjectives: cardLearningObjectivesFromDesign(design),
    assessment: cardAssessmentFromDesign(design),
    category: cardCategoryFromDesign(design),
    formats: cardFormatsFromDesign(design),
    stages: cardStagesFromDesign(design),
    components: cardComponentsFromDesign(design),
  };
}

export function resolvedCard(design: EmcureDesign): EmcureCard {
  if (!design.card) return draftCardFromDesign(design);
  return { ...emptyCard(), ...design.card };
}

export function generateCardSummary(card: EmcureCard): string {
  const year =
    YEAR_LEVELS.find((item) => item.id === card.yearLevel)?.label || card.yearLevel || "undergraduate";
  const formatLabels = CARD_FORMATS.filter((item) => card.formats.includes(item.id)).map(
    (item) => item.label,
  );
  const outcomes = CARD_EM_OUTCOMES.filter((item) => card.emOutcomeIds.includes(item.id)).map(
    (item) => item.label,
  );
  const formatText = formatLabels.length ? formatLabels.join("; ") : "course-based undergraduate research experience";
  const need = card.problemNeed.trim().split(/\n+/)[0] || "an authentic stakeholder need";
  const em =
    outcomes.length > 0
      ? `Entrepreneurial mindset outcomes include ${outcomes.join("; ")}.`
      : "Selected entrepreneurial mindset habits are listed on the card.";
  const objectives = card.learningObjectives.trim()
    ? `Learning objectives: ${card.learningObjectives.trim()}`
    : "";
  return [
    `${card.title || "This EMCURE"} is a ${year} ${formatText}${card.course ? ` in ${card.course}` : ""}.`,
    `Students investigate ${need.replace(/\.$/, "")}.`,
    em,
    objectives,
  ]
    .filter(Boolean)
    .join(" ");
}

export function cardToMarkdown(design: EmcureDesign): string {
  const card = resolvedCard(design);
  const brx = primaryBigRedX(design);
  const labelList = (
    options: readonly { id: string; label: string }[],
    selected: string[],
  ) =>
    options
      .filter((item) => selected.includes(item.id))
      .map((item) => item.label)
      .join(", ") || "—";

  const outcomesByGroup = ["Curiosity", "Connections", "Creating Value"].flatMap((group) => {
    const items = CARD_EM_OUTCOMES.filter(
      (item) => item.group === group && card.emOutcomeIds.includes(item.id),
    );
    if (items.length === 0) return [];
    return [`### ${group}`, "", ...items.map((item) => `- ${item.label}`), ""];
  });

  return [
    `# ${card.title || displayTitle(design)}`,
    "",
    card.author ? `by ${card.author}` : "",
    card.author ? "" : "",
    `Card ID: ${cardDisplayId(design.id)}`,
    "",
    "## Details",
    "",
    `- Year level: ${YEAR_LEVELS.find((item) => item.id === card.yearLevel)?.label || card.yearLevel || "—"}`,
    `- Course: ${card.course || "—"}`,
    `- Category: ${card.category || "—"}`,
    `- Sub-category: ${card.subCategory || "—"}`,
    "",
    "### Materials",
    "",
    card.materials || "—",
    "",
    "### Problem / Need",
    "",
    card.problemNeed || "—",
    "",
    "### Description",
    "",
    card.description || "—",
    "",
    "## Entrepreneurial Mindset",
    "",
    card.emComments || "—",
    "",
    "## Educational Outcomes",
    "",
    ...outcomesByGroup,
    outcomesByGroup.length === 0 ? "None selected.\n" : "",
    "### Learning objectives",
    "",
    card.learningObjectives || "—",
    "",
    "## Programming",
    "",
    `- Stages: ${labelList(CARD_STAGES, card.stages)}`,
    `- Components: ${labelList(CARD_COMPONENTS, card.components)}`,
    `- Format: ${labelList(CARD_FORMATS, card.formats)}`,
    "",
    "## Assessment",
    "",
    card.assessment || "—",
    "",
    brx ? `Primary investigation (Big Red X): ${brx.statement}` : "",
    brx ? "" : "",
    "## Authoring details",
    "",
    card.acknowledgments || "—",
    "",
    `- References: ${card.references || "—"}`,
    `- License: ${card.license || "—"}`,
    "",
    "## Summary",
    "",
    card.summary || "—",
    "",
  ]
    .filter((line, index, lines) => !(line === "" && lines[index - 1] === ""))
    .join("\n");
}

export function cardToHtml(design: EmcureDesign): string {
  const card = resolvedCard(design);
  const markdownish = cardToMarkdown(design)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const body = markdownish
    .split("\n")
    .map((line) => {
      if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
      if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
      if (line.startsWith("- ")) return `<li>${line.slice(2)}</li>`;
      if (line.trim() === "") return "";
      return `<p>${line}</p>`;
    })
    .join("\n")
    .replace(/(<li>[\s\S]*?<\/li>\n)+/g, (block) => `<ul>${block}</ul>`);

  const image = card.featuredImageDataUrl
    ? `<img class="featured" src="${escapeHtml(card.featuredImageDataUrl)}" alt="Featured image for ${escapeHtml(card.title || displayTitle(design))}" />`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(card.title || displayTitle(design))} — EMCURE Card</title>
  <style>
    body { font-family: Mulish, Arial, Helvetica, sans-serif; color: #18323C; max-width: 46rem; margin: 2rem auto; line-height: 1.55; }
    h1, h2, h3 { color: #125670; }
    .featured { width: 100%; height: auto; border-radius: 12px; margin: 0 0 1.5rem; }
    li { margin: 0.25rem 0; }
    @media print { body { margin: 0.75in; } }
  </style>
</head>
<body>
${image}
${body}
</body>
</html>`;
}

export function cardDisplayId(designId: string): string {
  const digits = designId.replace(/\D/g, "");
  if (digits.length >= 5) return digits.slice(0, 5);
  return designId.slice(0, 8);
}

function guessFormats(design: EmcureDesign): string[] {
  const formats: string[] = ["challenge-based"];
  if (design.stakeholders.length > 0) formats.push("service-learning");
  if ((design.courseProfile.teamSize ?? 2) > 1) formats.push("team-design");
  formats.push("collaborative-research");
  return formats;
}

function guessStages(design: EmcureDesign): string[] {
  const stages = new Set<string>(["idea-generation"]);
  if (design.stakeholders.length > 0) stages.add("user-identification");
  if (design.opportunities.length > 0) stages.add("value-proposition");
  if (design.phases.some((phase) => /investig|evidence|prototyp/i.test(phase.title))) {
    stages.add("prototypes");
  }
  return [...stages];
}

function guessComponents(design: EmcureDesign): string[] {
  const components = new Set<string>(["hands-on"]);
  const text = allActivities(design)
    .map((activity) => `${activity.title} ${activity.instructions}`)
    .join(" ")
    .toLowerCase();
  if (/survey|interview|test/.test(text)) components.add("student-survey");
  if (/sketch|brainstorm|map/.test(text)) components.add("concept-map");
  if (/literature|read|article/.test(text)) components.add("literature-review");
  if (/prototype|mockup/.test(text)) components.add("mockup");
  return [...components];
}
