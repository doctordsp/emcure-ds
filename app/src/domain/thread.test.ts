import { describe, expect, it } from "vitest";
import { createEmptyDesign } from "./createDesign";
import { draftLineOfSight, threadNodes } from "./thread";

describe("threadNodes", () => {
  it("places MVRC between the Big Red X and investigation", () => {
    const nodes = threadNodes(createEmptyDesign("Test"));
    const keys = nodes.map((node) => node.key);
    expect(keys.indexOf("mvrc")).toBe(keys.indexOf("brx") + 1);
    expect(keys.indexOf("investigation")).toBe(keys.indexOf("mvrc") + 1);
    expect(nodes.find((node) => node.key === "mvrc")?.route).toBe("mvrc");
  });
});

describe("draftLineOfSight", () => {
  it("prefers the MVRC statement as the work being investigated", () => {
    const design = createEmptyDesign("Test");
    design.minimumViableResearchContribution = {
      statement: "a bounded evidence packet for the city",
    };
    design.courseProfile.technicalObjectives = "learn sensors";
    expect(draftLineOfSight(design)).toContain("a bounded evidence packet for the city");
    expect(draftLineOfSight(design)).not.toContain("learn sensors");
    expect(draftLineOfSight(design)).toContain("[a possible new product, service, or venture]");
  });
});
