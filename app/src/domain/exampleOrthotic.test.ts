import { describe, expect, it } from "vitest";
import { STARTER_EXAMPLES } from "../data/examples";
import { ORTHOTIC_EXAMPLE } from "../data/exampleOrthotic";
import { evaluateDesign } from "./alignment";
import { allActivities } from "./createDesign";
import { MVRC_OBJECT_ID } from "./types";
import { studentPackageMarkdown } from "./studentPackage";

describe("orthotic starter example", () => {
  it("has activities in every journey phase", () => {
    expect(ORTHOTIC_EXAMPLE.phases.length).toBeGreaterThan(0);
    for (const phase of ORTHOTIC_EXAMPLE.phases) {
      expect(phase.activities.length, phase.title).toBeGreaterThan(0);
    }
  });

  it("has no alignment errors and links the MVRC", () => {
    const findings = evaluateDesign(ORTHOTIC_EXAMPLE);
    expect(findings.filter((item) => item.severity === "error")).toEqual([]);
    expect(findings.map((item) => item.ruleId)).not.toContain("AL-019");
    expect(findings.map((item) => item.ruleId)).not.toContain("AL-020");
    expect(findings.map((item) => item.ruleId)).not.toContain("AL-021");
    expect(
      allActivities(ORTHOTIC_EXAMPLE).some((activity) =>
        activity.linkedObjectIds.includes(MVRC_OBJECT_ID),
      ),
    ).toBe(true);
  });

  it("withholds discovery-reserved soak/Instron interpretation from the student companion", () => {
    const markdown = studentPackageMarkdown(ORTHOTIC_EXAMPLE);
    expect(markdown).toContain("Read the soak-Instron interaction");
    expect(markdown).toContain("Spec memo with the prosthetist");
    expect(markdown).toContain("reserved for student discovery");
    expect(markdown).not.toContain("Decide which failure mode");
  });
});

describe("starter catalog", () => {
  it("lists stormwater and orthotic with contrast blurbs", () => {
    expect(STARTER_EXAMPLES.map((item) => item.id)).toEqual(["stormwater", "orthotic"]);
    expect(STARTER_EXAMPLES[0].blurb).toMatch(/field sensors/i);
    expect(STARTER_EXAMPLES[1].blurb).toMatch(/instron/i);
  });
});
