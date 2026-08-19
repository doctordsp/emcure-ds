import { describe, expect, it } from "vitest";
import { EXAMPLE_DESIGN } from "../data/exampleDesign";
import { rubricDraftPrompt } from "./rubricDraft";

describe("rubricDraftPrompt", () => {
  it("asks for three sections and forbids inventing facts", () => {
    const prompt = rubricDraftPrompt(EXAMPLE_DESIGN);
    expect(prompt).toContain("Student performance");
    expect(prompt).toContain("Entrepreneurial mindset");
    expect(prompt).toContain("Course and program evaluation");
    expect(prompt).toContain("Do not invent");
    expect(prompt).toContain("Self-report alone is not sufficient");
    expect(prompt).toContain("Stormwater");
  });
});
