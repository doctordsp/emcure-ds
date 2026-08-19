import { describe, expect, it } from "vitest";
import { EXAMPLE_DESIGN } from "../data/exampleDesign";
import { createEmptyDesign } from "./createDesign";
import {
  canDraftRubric,
  collectRubricSources,
  draftRubricFromDesign,
  markdownToPrintableHtml,
  studentFacingRubricMarkdown,
} from "./rubric";

describe("rubric developer", () => {
  it("collects success criteria, EM items, and the Big Red X from the example", () => {
    const sources = collectRubricSources(EXAMPLE_DESIGN);
    expect(sources.successCriteria.length).toBeGreaterThan(0);
    expect(sources.emItems.some((item) => /opportunity/i.test(item.name))).toBe(true);
    expect(sources.bigRedX).toMatch(/bioswale|runoff/i);
    expect(canDraftRubric(EXAMPLE_DESIGN)).toBe(true);
  });

  it("drafts a three-section rubric without inventing a new project", () => {
    const draft = draftRubricFromDesign(EXAMPLE_DESIGN);
    expect(draft).toContain("Student performance");
    expect(draft).toContain("Entrepreneurial mindset");
    expect(draft).toContain("Course and program evaluation");
    expect(draft).toContain("not convert it into a student grade");
    expect(draft).toContain("Self-report alone is not sufficient");
    expect(draft).toMatch(/Beginning/);
    expect(draft).toContain("Stormwater");
    expect(draft).not.toMatch(/invent/i);
    expect(draft).toContain("bioswale");
  });

  it("cannot draft from an empty design", () => {
    expect(canDraftRubric(createEmptyDesign())).toBe(false);
  });

  it("withholds a faculty-only rubric from the student-facing copy", () => {
    expect(
      studentFacingRubricMarkdown({
        ...EXAMPLE_DESIGN,
        rubric: {
          title: "Hidden",
          kind: "summative",
          audience: "faculty",
          body: "Do not show students this.",
          facultyNotes: "",
        },
      }),
    ).toBeNull();
  });

  it("renders markdown tables to HTML", () => {
    const html = markdownToPrintableHtml(
      ["| A | B |", "| --- | --- |", "| one | two |"].join("\n"),
    );
    expect(html).toContain("<table>");
    expect(html).toContain("<th>A</th>");
    expect(html).toContain("<td>two</td>");
  });
});
