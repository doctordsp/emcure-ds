import { isAiConnected } from "./config";

/**
 * Optional rewrite of Description, Problem / Need, and Summary after
 * deterministic Fill from design.
 *
 * Enabled only when Setup AI API has a verified model and passcode.
 * Suggestions must accept / edit / dismiss (never overwrite on arrival),
 * rewrite supplied text only, and omit faculty notes and discovery-reserved
 * instructions.
 */
export function cardAiRewriteEnabled(): boolean {
  return isAiConnected();
}
