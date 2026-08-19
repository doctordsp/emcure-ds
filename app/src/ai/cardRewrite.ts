export type CardRewriteField = "problemNeed" | "description" | "summary";

export const CARD_REWRITE_FIELDS: CardRewriteField[] = ["problemNeed", "description", "summary"];

const LABELS: Record<CardRewriteField, string> = {
  problemNeed: "Problem / Need",
  description: "Description",
  summary: "Summary",
};

export function cardRewriteLabel(field: CardRewriteField): string {
  return LABELS[field];
}

export function cardRewritePrompt(field: CardRewriteField, text: string): string {
  return [
    `Rewrite the following public EM-CURE card field: ${LABELS[field]}.`,
    "Rewrite the supplied text only. Do not invent a new project or add facts that are not in the text.",
    "Do not include faculty notes, internal studio language, or discovery-reserved instructions.",
    "Return only the rewritten field text. No preamble, title, or quotation marks wrapping the whole answer.",
    "",
    "Text:",
    text.trim(),
  ].join("\n");
}

export function normalizeRewrite(raw: string): string {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:\w+)?\n?/, "").replace(/\n?```$/, "").trim();
  }
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1).trim();
  }
  return text;
}

export function isCardRewriteField(value: string): value is CardRewriteField {
  return CARD_REWRITE_FIELDS.includes(value as CardRewriteField);
}
