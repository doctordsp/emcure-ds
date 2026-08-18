import { displayTitle, primaryBigRedX } from "./createDesign";
import { getFrameworkItem } from "./frameworks";
import { escapeHtml } from "./html";
import { stakeholderTypeLabel } from "./stakeholders";
import type {
  DistributionDocument,
  EmcureDesign,
  StudentPackageOptions,
} from "./types";

const DISCOVERY_PLACEHOLDER =
  "Your team will develop this part. Details are reserved for student discovery and are not included here.";

export function defaultStudentPackageOptions(): StudentPackageOptions {
  return {
    includeBrief: true,
    includeActivities: true,
    includeSuccessCriteria: true,
  };
}

export function resolvedStudentPackageOptions(
  design: EmcureDesign,
): StudentPackageOptions {
  return { ...defaultStudentPackageOptions(), ...design.studentPackageOptions };
}

export interface PackageInventoryItem {
  id: string;
  title: string;
  included: boolean;
  reason: string;
}

export function studentPackageInventory(design: EmcureDesign): PackageInventoryItem[] {
  const options = resolvedStudentPackageOptions(design);
  const items: PackageInventoryItem[] = [
    {
      id: "brief",
      title: "Project brief (need, opportunity, impact, line of sight)",
      included: options.includeBrief,
      reason: options.includeBrief
        ? "Included in the student companion."
        : "Turned off for this package.",
    },
    {
      id: "success",
      title: "How we will know we succeeded",
      included: options.includeSuccessCriteria,
      reason: options.includeSuccessCriteria
        ? "Success criteria are visible to students."
        : "Turned off for this package.",
    },
  ];

  for (const phase of design.phases) {
    for (const activity of phase.activities) {
      if (!activity.title.trim() && !activity.instructions.trim()) continue;
      const reserved = activity.discoveryMode === "student_discovered";
      items.push({
        id: activity.id,
        title: `${phase.title}: ${activity.title || "Untitled activity"}`,
        included: options.includeActivities && !reserved,
        reason: reserved
          ? "Marked for student discovery — title is listed, instructions are withheld."
          : options.includeActivities
            ? `Included (${activity.discoveryMode.replaceAll("_", " ")}).`
            : "Activity packet turned off for this package.",
      });
    }
  }

  for (const doc of design.distributionDocuments ?? []) {
    const forStudents = doc.audience === "students" || doc.audience === "both";
    items.push({
      id: doc.id,
      title: doc.title || doc.filename,
      included: forStudents,
      reason: forStudents
        ? `Faculty document for ${doc.audience}.`
        : "Faculty-only — excluded from the student package.",
    });
  }

  return items;
}

export function studentVisibleActivityInstructions(instructions: string, discoveryMode: string): string {
  if (discoveryMode === "student_discovered") return DISCOVERY_PLACEHOLDER;
  return instructions.trim() || "Instructions will be provided in class.";
}

export function studentPackageMarkdown(design: EmcureDesign): string {
  const options = resolvedStudentPackageOptions(design);
  const brx = primaryBigRedX(design);
  const em = design.frameworkSelections
    .map((sel) => getFrameworkItem(sel.frameworkItemId)?.name ?? sel.frameworkItemId)
    .filter(Boolean);

  const brief = options.includeBrief
    ? [
        "## Why this work matters",
        "",
        design.projectSituation || "—",
        "",
        "### Need",
        "",
        design.needs.find((item) => item.statement.trim())?.statement || "—",
        "",
        "### Opportunity",
        "",
        design.opportunities.find((item) => item.statement.trim())?.statement || "—",
        "",
        "### Intended impact",
        "",
        design.intendedImpacts.find((item) => item.statement.trim())?.statement || "—",
        "",
        "### Line of sight",
        "",
        design.lineOfSightStatement || "—",
        "",
        brx
          ? [
              "### What we are investigating",
              "",
              brx.statement,
              "",
              brx.decisionIfResolved
                ? `If this is resolved, it could change: ${brx.decisionIfResolved}`
                : "",
              "",
            ].join("\n")
          : "",
        em.length
          ? ["### Entrepreneurial mindset in this project", "", ...em.map((name) => `- ${name}`), ""].join(
              "\n",
            )
          : "",
        "### People involved",
        "",
        ...design.stakeholders.map((stk) => {
          const involvement = stk.researchInvolvement ? ` ${stk.researchInvolvement}` : "";
          const benefit = stk.potentialBenefit ? ` ${stk.potentialBenefit}` : "";
          const type = stakeholderTypeLabel(stk);
          const typeBit = type ? ` ${type}.` : "";
          return `- **${stk.name}** (${stk.roles.join(", ") || "role TBD"}).${typeBit}${involvement}${benefit}`;
        }),
        design.stakeholders.length === 0 ? "- To be introduced in class." : "",
        "",
      ]
    : [];

  const success = options.includeSuccessCriteria
    ? [
        "## How we will know we succeeded",
        "",
        ...design.successCriteria
          .filter((item) => item.statement.trim())
          .map((item) => {
            const target = item.targetOrThreshold ? ` Target: ${item.targetOrThreshold}.` : "";
            return `- ${item.statement}.${target}`;
          }),
        design.successCriteria.every((item) => !item.statement.trim())
          ? "- Success criteria will be shared in class."
          : "",
        "",
      ]
    : [];

  const activities = options.includeActivities
    ? [
        "## Activities",
        "",
        ...design.phases.flatMap((phase) => {
          const visible = phase.activities.filter(
            (activity) => activity.title.trim() || activity.instructions.trim(),
          );
          if (visible.length === 0) return [];
          return [
            `### ${phase.title}`,
            "",
            ...visible.flatMap((activity) => [
              `#### ${activity.title || "Untitled activity"}`,
              "",
              studentVisibleActivityInstructions(activity.instructions, activity.discoveryMode),
              "",
              `- Working as: ${activity.grouping.replaceAll("_", " ")}`,
              activity.estimatedMinutes ? `- About ${activity.estimatedMinutes} minutes` : "",
              "",
            ]),
          ];
        }),
      ]
    : [];

  const extras = (design.distributionDocuments ?? [])
    .filter((doc) => doc.audience === "students" || doc.audience === "both")
    .flatMap((doc) => {
      if (doc.dataUrl && !doc.body.trim()) {
        return [`### ${doc.title}`, "", `Attached file: ${doc.filename}`, ""];
      }
      return [`### ${doc.title}`, "", doc.body || `See attached file: ${doc.filename}`, ""];
    });

  const extraSection = extras.length ? ["## Additional documents", "", ...extras] : [];

  return [
    `# ${displayTitle(design)}`,
    "",
    "Student project companion — EMCURE Design Studio",
    "",
    design.courseProfile.code
      ? `${design.courseProfile.code}${design.courseProfile.level ? ` · ${design.courseProfile.level}` : ""}`
      : "",
    "",
    ...brief,
    ...success,
    ...activities,
    ...extraSection,
    "---",
    "",
    "Faculty notes, alignment findings, and content marked for student discovery are not included.",
    "",
  ]
    .filter((line, index, lines) => !(line === "" && lines[index - 1] === ""))
    .join("\n");
}

export function studentPackageHtml(design: EmcureDesign): string {
  const markdownish = studentPackageMarkdown(design)
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
      if (line.startsWith("- ")) {
        const item = line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return `<li>${item}</li>`;
      }
      if (line.startsWith("---")) return "<hr />";
      if (line.trim() === "") return "";
      const text = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return `<p>${text}</p>`;
    })
    .join("\n")
    .replace(/(<li>[\s\S]*?<\/li>\n)+/g, (block) => `<ul>${block}</ul>`);

  const attachments = (design.distributionDocuments ?? [])
    .filter((doc) => (doc.audience === "students" || doc.audience === "both") && doc.dataUrl)
    .map(
      (doc) =>
        `<li><a download="${escapeHtml(doc.filename)}" href="${escapeHtml(doc.dataUrl ?? "")}">${escapeHtml(doc.title || doc.filename)}</a></li>`,
    )
    .join("\n");

  const attachmentBlock = attachments
    ? `<h2>Downloadable files</h2>\n<ul>\n${attachments}\n</ul>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(displayTitle(design))} — student companion</title>
  <style>
    body { font-family: Mulish, Arial, Helvetica, sans-serif; color: #18323C; max-width: 46rem; margin: 2rem auto; line-height: 1.55; }
    h1, h2, h3, h4 { color: #125670; }
    li { margin: 0.25rem 0; }
    @media print { body { margin: 0.75in; } }
  </style>
</head>
<body>
${body}
${attachmentBlock}
</body>
</html>`;
}

export function studentFacingDocuments(design: EmcureDesign): DistributionDocument[] {
  return (design.distributionDocuments ?? []).filter(
    (doc) => doc.audience === "students" || doc.audience === "both",
  );
}

export function emptyHandout(): Omit<DistributionDocument, "id"> {
  return {
    title: "",
    audience: "students",
    kind: "handout",
    body: "",
    filename: "student-handout.md",
    mimeType: "text/markdown",
  };
}
