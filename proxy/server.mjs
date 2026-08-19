import http from "node:http";
import { validateAccessPassword } from "./passcode.mjs";

const PORT = Number(process.env.PORT || 8080);
const MAX_TOKENS = 8192;
const MAX_MESSAGES = 20;
const MAX_CONTENT_CHARS = 20_000;
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

const ACCESS_CODES = (process.env.ACCESS_CODES || "")
  .split(",")
  .map((code) => code.trim())
  .filter(Boolean);
const ACCESS_VALIDITY_DAYS = Number(process.env.ACCESS_VALIDITY_DAYS || 7);
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || "";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const ALLOWED_MODELS = {
  anthropic: new Set(["claude-sonnet-5", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"]),
  openai: new Set(["gpt-5.5", "gpt-5.4-mini", "gpt-4o"]),
};

const CORS_ORIGINS = (process.env.CORS_ORIGINS ||
  "https://storage.googleapis.com,https://ai-app-directory.storage.googleapis.com,http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const rateBuckets = new Map();

const server = http.createServer(async (req, res) => {
  try {
    if (!applyCors(req, res)) return;
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && url.pathname === "/v1/health") {
      json(res, 200, { ok: true });
      return;
    }

    if (req.method === "POST" && url.pathname === "/v1/complete") {
      if (!rateLimit(clientIp(req))) {
        json(res, 429, { error: "Too many requests. Try again in a minute." });
        return;
      }
      const body = await readJson(req);
      await handleComplete(body, res);
      return;
    }

    json(res, 404, { error: "Not found." });
  } catch (error) {
    const status = error.status || 500;
    json(res, status, { error: error.publicMessage || "Proxy error." });
  }
});

server.listen(PORT, () => {
  console.log(`EM-CURE AI proxy listening on ${PORT}`);
});

async function handleComplete(body, res) {
  if (!ACCESS_CODES.length && !ACCESS_PASSWORD.trim()) {
    fail(401, "Access is not configured on the proxy.");
  }
  const passcode = String(body?.passcode ?? "");
  if (!validateAccessPassword(passcode, ACCESS_CODES, ACCESS_VALIDITY_DAYS, ACCESS_PASSWORD)) {
    fail(401, "Invalid or expired passcode.");
  }

  const provider = String(body?.provider ?? "");
  const model = String(body?.model ?? "");
  if (provider !== "anthropic" && provider !== "openai") {
    fail(400, "Provider must be anthropic or openai.");
  }
  if (!ALLOWED_MODELS[provider].has(model)) {
    fail(400, "That model is not allowed.");
  }

  const messages = normalizeMessages(body?.messages);
  if (!messages.length) {
    fail(400, "messages must be a non-empty array.");
  }

  if (provider === "anthropic") {
    if (!ANTHROPIC_API_KEY) fail(503, "Anthropic is not configured on the proxy.");
    const text = await completeAnthropic(model, messages);
    json(res, 200, { text });
    return;
  }

  if (!OPENAI_API_KEY) fail(503, "OpenAI is not configured on the proxy.");
  const text = await completeOpenAi(model, messages);
  json(res, 200, { text });
}

async function completeAnthropic(model, messages) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      messages,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    fail(mapProviderStatus(response.status), providerError(data, "Anthropic request failed."));
  }
  const text = anthropicText(data);
  if (!text) {
    fail(502, emptyModelMessage(data.stop_reason, "Anthropic"));
  }
  return text;
}

function anthropicText(data) {
  return (data.content || [])
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("\n")
    .trim();
}

async function completeOpenAi(model, messages) {
  const payload = openaiPayload(model, messages);
  let data = await callOpenAi(payload);
  if (!data.ok && isUnknownParameter(data.body, "reasoning_effort") && payload.reasoning_effort) {
    delete payload.reasoning_effort;
    data = await callOpenAi(payload);
  }
  if (!data.ok) {
    fail(mapProviderStatus(data.status), providerError(data.body, "OpenAI request failed."));
  }
  const text = openaiText(data.body);
  if (!text) {
    const refusal = data.body?.choices?.[0]?.message?.refusal;
    if (typeof refusal === "string" && refusal.trim()) {
      fail(502, "The model refused to draft that rubric.");
    }
    const reason = data.body?.choices?.[0]?.finish_reason;
    fail(502, emptyModelMessage(reason, "OpenAI"));
  }
  return text;
}

function openaiPayload(model, messages) {
  const payload = { model, messages };
  if (model.startsWith("gpt-5") || model.startsWith("o")) {
    payload.max_completion_tokens = MAX_TOKENS;
    payload.reasoning_effort = "low";
  } else {
    payload.max_tokens = MAX_TOKENS;
  }
  return payload;
}

async function callOpenAi(payload) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, body };
}

function openaiText(data) {
  const message = data?.choices?.[0]?.message;
  const content = message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text || part?.content || ""))
      .join("\n")
      .trim();
  }
  if (typeof message?.refusal === "string" && message.refusal.trim()) return "";
  return "";
}

function isUnknownParameter(body, name) {
  const message = String(body?.error?.message || "");
  return message.toLowerCase().includes(name) && /unknown|unsupported|unrecognized|invalid/i.test(message);
}

function emptyModelMessage(reason, provider) {
  if (reason === "length" || reason === "max_tokens") {
    return `${provider} hit the token limit before writing any rubric text. Try Claude, or GPT-4o.`;
  }
  if (reason === "content_filter") {
    return `${provider} blocked the draft. Try Draft from design, then edit.`;
  }
  return "The model returned an empty response.";
}

function normalizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  if (raw.length > MAX_MESSAGES) fail(400, `At most ${MAX_MESSAGES} messages.`);
  return raw.map((item) => {
    const role = item?.role === "assistant" ? "assistant" : item?.role === "user" ? "user" : "";
    const content = String(item?.content ?? "");
    if (!role) fail(400, "Each message role must be user or assistant.");
    if (!content.trim()) fail(400, "Each message must have content.");
    if (content.length > MAX_CONTENT_CHARS) fail(400, "Message is too long.");
    return { role, content };
  });
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const allowAll = CORS_ORIGINS.includes("*");
  if (!allowAll && !CORS_ORIGINS.includes(origin)) {
    json(res, 403, { error: "Origin not allowed." });
    return false;
  }
  res.setHeader("Access-Control-Allow-Origin", allowAll ? origin : origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
  return true;
}

function rateLimit(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT) return false;
  bucket.count += 1;
  return true;
}

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket.remoteAddress || "unknown";
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 200_000) {
        reject(Object.assign(new Error("Payload too large"), { status: 413, publicMessage: "Payload too large." }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("Invalid JSON"), { status: 400, publicMessage: "Invalid JSON." }));
      }
    });
    req.on("error", reject);
  });
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(body);
}

function fail(status, publicMessage) {
  throw Object.assign(new Error(publicMessage), { status, publicMessage });
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
