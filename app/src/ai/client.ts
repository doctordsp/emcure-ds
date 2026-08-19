import { findAiModel } from "./models";
import { isAiConnected, proxyUrl, readAiSetup, type AiSetup } from "./config";

export type ChatMessage = { role: "user" | "assistant"; content: string };

async function postComplete(setup: AiSetup, messages: ChatMessage[]): Promise<string> {
  const option = findAiModel(setup.selection);
  if (option.provider === "none") {
    throw new Error("Choose a Claude or ChatGPT model first.");
  }
  if (!setup.passcode.trim()) {
    throw new Error("Enter the time-limited passcode.");
  }
  const base = proxyUrl();
  if (!base) {
    throw new Error("AI proxy URL is not configured (VITE_AI_PROXY_URL).");
  }
  const response = await fetch(`${base}/v1/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      passcode: setup.passcode,
      provider: option.provider,
      model: option.model,
      messages,
    }),
  });
  const body = (await response.json().catch(() => ({}))) as { text?: string; error?: string };
  if (!response.ok) {
    throw new Error(body.error || `AI proxy returned ${response.status}.`);
  }
  if (!body.text?.trim()) {
    throw new Error("The model returned an empty response.");
  }
  return body.text.trim();
}

export async function complete(messages: ChatMessage[]): Promise<string> {
  if (!isAiConnected()) {
    throw new Error("No AI API is connected. Open Setup AI API.");
  }
  return postComplete(readAiSetup(), messages);
}

/** Uses the current form values even before a successful test marks the session verified. */
export async function testConnection(setup = readAiSetup()): Promise<string> {
  return postComplete(setup, [{ role: "user", content: "Reply with the single word: connected" }]);
}
