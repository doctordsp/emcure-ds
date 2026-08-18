/**
 * Phase 2 (deferred): optional Claude rewrite of Description, Problem / Need,
 * and Summary after deterministic Fill from design.
 *
 * Keep this false until an Anthropic adapter exists. When enabled, suggestions
 * must accept / edit / dismiss (never overwrite on arrival), rewrite supplied
 * text only, and omit faculty notes and discovery-reserved instructions.
 * A browser-pasted API key is not institutional-ready.
 */
export const CARD_AI_REWRITE_ENABLED = false;
