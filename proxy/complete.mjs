/** Provider calls for POST /v1/complete. Thinking models need extra headroom. */

export const TEXT_MAX_TOKENS = 8192;
export const REASONING_MAX_TOKENS = 16384;

export function usesAdaptiveThinking(model) {
  return /^claude-(sonnet|opus|fable)-5/i.test(model);
}

export function isReasoningGpt(model) {
  return model.startsWith("gpt-5") || model.startsWith("o");
}

export function anthropicPayload(model, messages, { thinkingDisabled = true } = {}) {
  const payload = { model, max_tokens: TEXT_MAX_TOKENS, messages };
  if (!usesAdaptiveThinking(model)) return payload;
  if (thinkingDisabled) {
    payload.thinking = { type: "disabled" };
    return payload;
  }
  payload.max_tokens = REASONING_MAX_TOKENS;
  payload.thinking = { type: "adaptive" };
  payload.output_config = { effort: "low" };
  return payload;
}

export function openaiPayload(model, messages, { effort = "none" } = {}) {
  const payload = { model, messages };
  if (isReasoningGpt(model)) {
    payload.max_completion_tokens = REASONING_MAX_TOKENS;
    if (effort) payload.reasoning_effort = effort;
  } else {
    payload.max_tokens = TEXT_MAX_TOKENS;
  }
  return payload;
}

export function anthropicText(data) {
  return (data.content || [])
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("\n")
    .trim();
}

export function openaiText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }
  const message = data?.choices?.[0]?.message;
  if (typeof message?.output_text === "string" && message.output_text.trim()) {
    return message.output_text.trim();
  }
  const content = message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part?.type && part.type !== "text" && part.type !== "output_text") return "";
        return part?.text || part?.content || "";
      })
      .join("\n")
      .trim();
  }
  return "";
}

export function isUnknownParameter(body, name) {
  const message = String(body?.error?.message || "");
  return message.toLowerCase().includes(name) && /unknown|unsupported|unrecognized|invalid/i.test(message);
}

export function thinkingRejected(body) {
  const message = String(body?.error?.message || body?.error || "");
  return /thinking|output_config|effort/i.test(message) && /unknown|unsupported|unrecognized|invalid|not support/i.test(message);
}

export function emptyModelMessage(reason, provider) {
  if (reason === "length" || reason === "max_tokens") {
    return `${provider} used the token budget on thinking before writing the rubric. Try Haiku or GPT-4o.`;
  }
  if (reason === "content_filter") {
    return `${provider} blocked the draft. Try Draft from design, then edit.`;
  }
  return "The model returned an empty response.";
}

export async function completeAnthropic(model, messages, request = defaultAnthropicRequest) {
  let payload = anthropicPayload(model, messages, { thinkingDisabled: true });
  let data = await request(payload);
  if (!data.ok && usesAdaptiveThinking(model) && thinkingRejected(data.body)) {
    payload = anthropicPayload(model, messages, { thinkingDisabled: false });
    data = await request(payload);
  }
  if (!data.ok) {
    fail(mapProviderStatus(data.status), providerError(data.body, "Anthropic request failed."));
  }
  let text = anthropicText(data.body);
  if (
    !text &&
    usesAdaptiveThinking(model) &&
    payload.thinking?.type === "disabled" &&
    (data.body.stop_reason === "max_tokens" || !data.body.stop_reason)
  ) {
    payload = anthropicPayload(model, messages, { thinkingDisabled: false });
    data = await request(payload);
    if (!data.ok) {
      fail(mapProviderStatus(data.status), providerError(data.body, "Anthropic request failed."));
    }
    text = anthropicText(data.body);
  }
  if (!text) {
    fail(502, emptyModelMessage(data.body.stop_reason, "Anthropic"));
  }
  return text;
}

export async function completeOpenAi(model, messages, request = defaultOpenAiRequest) {
  let payload = isReasoningGpt(model)
    ? openaiPayload(model, messages, { effort: "none" })
    : openaiPayload(model, messages);
  let data = await request(payload);
  if (!data.ok && payload.reasoning_effort && isUnknownParameter(data.body, "reasoning_effort")) {
    if (payload.reasoning_effort === "none") {
      payload = openaiPayload(model, messages, { effort: "low" });
      data = await request(payload);
    }
    if (!data.ok && isUnknownParameter(data.body, "reasoning_effort")) {
      delete payload.reasoning_effort;
      data = await request(payload);
    }
  }
  if (!data.ok) {
    fail(mapProviderStatus(data.status), providerError(data.body, "OpenAI request failed."));
  }
  let text = openaiText(data.body);
  if (!text && isReasoningGpt(model) && payload.reasoning_effort === "none") {
    payload = openaiPayload(model, messages, { effort: "low" });
    data = await request(payload);
    if (!data.ok) {
      fail(mapProviderStatus(data.status), providerError(data.body, "OpenAI request failed."));
    }
    text = openaiText(data.body);
  }
  if (!text) {
    const refusal = data.body?.choices?.[0]?.message?.refusal;
    if (typeof refusal === "string" && refusal.trim()) {
      fail(502, "The model refused to draft that rubric.");
    }
    fail(502, emptyModelMessage(data.body?.choices?.[0]?.finish_reason, "OpenAI"));
  }
  return text;
}

async function defaultAnthropicRequest(payload) {
  const key = process.env.ANTHROPIC_API_KEY || "";
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, body };
}

async function defaultOpenAiRequest(payload) {
  const key = process.env.OPENAI_API_KEY || "";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, body };
}

function mapProviderStatus(status) {
  if (status === 401 || status === 403) return 502;
  if (status === 429) return 429;
  if (status >= 400 && status < 500) return 400;
  return 502;
}

function providerError(data, fallback) {
  const message = data?.error?.message || data?.error || fallback;
  const text = String(message);
  if (/api[-_ ]?key|secret|bearer/i.test(text)) return fallback;
  return text.slice(0, 280);
}

function fail(status, publicMessage) {
  throw Object.assign(new Error(publicMessage), { status, publicMessage });
}
