import { MVRC_LABEL } from "./mvrc";
import { escapeHtml } from "./html";

export interface CardProseBlock {
  name?: string;
  meta?: string;
  body: string;
}

const LOCAL_INTERPRETATION = /\bLocal interpretation:\s*/gi;

export function splitCardProse(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.replace(LOCAL_INTERPRETATION, "").trim())
    .filter(Boolean);
}

export function parseCardProseBlock(block: string): CardProseBlock {
  const cleaned = block.replace(LOCAL_INTERPRETATION, "").trim();
  const lines = cleaned.split("\n");
  const head = lines[0] ?? "";

  const emMatch = head.match(/^(.*?)\s*\((primary|supporting)\)\s*(.*)$/i);
  if (emMatch) {
    const rest = [emMatch[3], ...lines.slice(1)].join(" ").replace(/\s+/g, " ").trim();
    return { name: emMatch[1].trim(), meta: emMatch[2].toLowerCase(), body: rest };
  }

  if (cleaned.startsWith(MVRC_LABEL)) {
    const rest = cleaned.slice(MVRC_LABEL.length).replace(/^[:\s]+/, "");
    return { name: MVRC_LABEL, body: rest };
  }

  return { body: cleaned };
}

export function cardProseBlockToHtml(block: CardProseBlock): string {
  if (block.name) {
    const meta = block.meta ? ` (${escapeHtml(block.meta)})` : "";
    const body = block.body ? `: ${escapeHtml(block.body)}` : "";
    return `<strong>${escapeHtml(block.name)}</strong>${meta}${body}`;
  }
  return escapeHtml(block.body);
}

export function cardProseToHtml(text: string): string {
  if (!text.trim()) return "";
  return splitCardProse(text)
    .map((block) => `<p>${cardProseBlockToHtml(parseCardProseBlock(block))}</p>`)
    .join("\n");
}
