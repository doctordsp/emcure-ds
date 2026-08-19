export type AiProvider = "none" | "anthropic" | "openai";

export interface AiModelOption {
  value: string;
  label: string;
  provider: AiProvider;
  model: string;
}

export const AI_MODEL_OPTIONS: AiModelOption[] = [
  { value: "none", label: "No AI API", provider: "none", model: "" },
  {
    value: "anthropic:claude-sonnet-5",
    label: "Anthropic Claude Sonnet 5 (recommended)",
    provider: "anthropic",
    model: "claude-sonnet-5",
  },
  {
    value: "anthropic:claude-sonnet-4-6",
    label: "Anthropic Claude Sonnet 4.6",
    provider: "anthropic",
    model: "claude-sonnet-4-6",
  },
  {
    value: "anthropic:claude-haiku-4-5-20251001",
    label: "Anthropic Claude Haiku 4.5",
    provider: "anthropic",
    model: "claude-haiku-4-5-20251001",
  },
  {
    value: "openai:gpt-5.5",
    label: "OpenAI GPT-5.5 (recommended)",
    provider: "openai",
    model: "gpt-5.5",
  },
  {
    value: "openai:gpt-5.4-mini",
    label: "OpenAI GPT-5.4 Mini",
    provider: "openai",
    model: "gpt-5.4-mini",
  },
  {
    value: "openai:gpt-4o",
    label: "OpenAI GPT-4o",
    provider: "openai",
    model: "gpt-4o",
  },
];

export function findAiModel(value: string): AiModelOption {
  return AI_MODEL_OPTIONS.find((item) => item.value === value) ?? AI_MODEL_OPTIONS[0];
}
