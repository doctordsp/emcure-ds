import { describe, expect, it } from "vitest";
import { cardRewritePrompt, normalizeRewrite } from "./cardRewrite";

describe("cardRewritePrompt", () => {
  it("asks to rewrite supplied text only and omit faculty notes", () => {
    const prompt = cardRewritePrompt("description", "Students map a watershed.");
    expect(prompt).toContain("Description");
    expect(prompt).toContain("Rewrite the supplied text only");
    expect(prompt).toContain("faculty notes");
    expect(prompt).toContain("Students map a watershed.");
  });
});

describe("normalizeRewrite", () => {
  it("strips fenced markdown and wrapping quotes", () => {
    expect(normalizeRewrite('```\nHello\n```')).toBe("Hello");
    expect(normalizeRewrite('"Hello"')).toBe("Hello");
  });
});
