import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  TEXT_MAX_TOKENS,
  REASONING_MAX_TOKENS,
  anthropicPayload,
  anthropicText,
  completeAnthropic,
  completeOpenAi,
  openaiPayload,
  openaiText,
  usesAdaptiveThinking,
} from "./complete.mjs";

const messages = [{ role: "user", content: "Draft a rubric." }];

describe("anthropicPayload", () => {
  it("disables adaptive thinking on Claude Sonnet 5 so a rubric can fit in max_tokens", () => {
    const payload = anthropicPayload("claude-sonnet-5", messages);
    assert.equal(payload.thinking.type, "disabled");
    assert.equal(payload.max_tokens, TEXT_MAX_TOKENS);
    assert.equal(payload.output_config, undefined);
  });

  it("leaves Haiku 4.5 unchanged", () => {
    const payload = anthropicPayload("claude-haiku-4-5-20251001", messages);
    assert.equal(payload.thinking, undefined);
    assert.equal(payload.max_tokens, TEXT_MAX_TOKENS);
  });

  it("uses low effort and a larger cap when thinking stays on", () => {
    const payload = anthropicPayload("claude-sonnet-5", messages, { thinkingDisabled: false });
    assert.equal(payload.thinking.type, "adaptive");
    assert.equal(payload.output_config.effort, "low");
    assert.equal(payload.max_tokens, REASONING_MAX_TOKENS);
  });
});

describe("openaiPayload", () => {
  it("turns GPT-5.5 reasoning off and raises the completion cap", () => {
    const payload = openaiPayload("gpt-5.5", messages, { effort: "none" });
    assert.equal(payload.reasoning_effort, "none");
    assert.equal(payload.max_completion_tokens, REASONING_MAX_TOKENS);
    assert.equal(payload.max_tokens, undefined);
  });

  it("keeps GPT-4o on max_tokens with no reasoning field", () => {
    const payload = openaiPayload("gpt-4o", messages);
    assert.equal(payload.max_tokens, TEXT_MAX_TOKENS);
    assert.equal(payload.reasoning_effort, undefined);
  });
});

describe("usesAdaptiveThinking", () => {
  it("is true for Sonnet 5 and false for Haiku and Sonnet 4.6", () => {
    assert.equal(usesAdaptiveThinking("claude-sonnet-5"), true);
    assert.equal(usesAdaptiveThinking("claude-haiku-4-5-20251001"), false);
    assert.equal(usesAdaptiveThinking("claude-sonnet-4-6"), false);
  });
});

describe("text extractors", () => {
  it("keeps Anthropic text blocks and drops thinking", () => {
    assert.equal(
      anthropicText({
        content: [
          { type: "thinking", thinking: "plan" },
          { type: "text", text: "Criterion | 4" },
        ],
      }),
      "Criterion | 4",
    );
  });

  it("reads OpenAI string content and output_text", () => {
    assert.equal(openaiText({ choices: [{ message: { content: "  ok  " } }] }), "ok");
    assert.equal(openaiText({ output_text: "from responses" }), "from responses");
  });
});

describe("completeAnthropic retries", () => {
  it("retries with low-effort thinking when disabled thinking is rejected", async () => {
    const calls = [];
    const request = async (payload) => {
      calls.push(payload);
      if (payload.thinking?.type === "disabled") {
        return {
          ok: false,
          status: 400,
          body: { error: { message: "thinking type disabled is not supported" } },
        };
      }
      return {
        ok: true,
        status: 200,
        body: { content: [{ type: "text", text: "rubric" }], stop_reason: "end_turn" },
      };
    };
    const text = await completeAnthropic("claude-sonnet-5", messages, request);
    assert.equal(text, "rubric");
    assert.equal(calls.length, 2);
    assert.equal(calls[1].output_config.effort, "low");
  });
});

describe("completeOpenAi retries", () => {
  it("falls back from reasoning none to low when none is invalid", async () => {
    const efforts = [];
    const request = async (payload) => {
      efforts.push(payload.reasoning_effort);
      if (payload.reasoning_effort === "none") {
        return {
          ok: false,
          status: 400,
          body: { error: { message: "Invalid value for reasoning_effort: none" } },
        };
      }
      return {
        ok: true,
        status: 200,
        body: { choices: [{ message: { content: "connected" }, finish_reason: "stop" }] },
      };
    };
    const text = await completeOpenAi("gpt-5.5", messages, request);
    assert.equal(text, "connected");
    assert.deepEqual(efforts, ["none", "low"]);
  });

  it("retries with low effort when none returns empty content", async () => {
    const request = async (payload) => {
      if (payload.reasoning_effort === "none") {
        return {
          ok: true,
          status: 200,
          body: { choices: [{ message: { content: "" }, finish_reason: "length" }] },
        };
      }
      return {
        ok: true,
        status: 200,
        body: { choices: [{ message: { content: "# Rubric" }, finish_reason: "stop" }] },
      };
    };
    const text = await completeOpenAi("gpt-5.5", messages, request);
    assert.equal(text, "# Rubric");
  });
});
