import { findAiModel, type AiProvider } from "./models";

const STORAGE_KEY = "emcure.ai.setup.v1";

export interface AiSetup {
  selection: string;
  passcode: string;
  verified: boolean;
}

export function emptyAiSetup(): AiSetup {
  return { selection: "none", passcode: "", verified: false };
}

export function readAiSetup(): AiSetup {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAiSetup();
    const parsed = JSON.parse(raw) as Partial<AiSetup>;
    return {
      selection: parsed.selection || "none",
      passcode: parsed.passcode ?? "",
      verified: Boolean(parsed.verified),
    };
  } catch {
    return emptyAiSetup();
  }
}

export function writeAiSetup(setup: AiSetup): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(setup));
}

export function clearAiSetup(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isAiConnected(): boolean {
  const setup = readAiSetup();
  const option = findAiModel(setup.selection);
  return option.provider !== "none" && Boolean(setup.passcode.trim()) && setup.verified;
}

export function connectedModel(): { provider: AiProvider; model: string } | null {
  if (!isAiConnected()) return null;
  const option = findAiModel(readAiSetup().selection);
  if (option.provider === "none") return null;
  return { provider: option.provider, model: option.model };
}

export function proxyUrl(): string {
  return (import.meta.env.VITE_AI_PROXY_URL as string | undefined)?.replace(/\/$/, "") ?? "";
}
