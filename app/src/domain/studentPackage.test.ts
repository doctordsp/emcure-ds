import { describe, expect, it } from "vitest";
import { EXAMPLE_DESIGN } from "../data/exampleDesign";
import {
  studentPackageInventory,
  studentPackageMarkdown,
  studentVisibleActivityInstructions,
} from "./studentPackage";

describe("student package", () => {
  it("withholds instructions marked for student discovery", () => {
    expect(
      studentVisibleActivityInstructions(
        "Update the opportunity and claim boundary.",
        "student_discovered",
      ),
    ).toMatch(/reserved for student discovery/i);
    expect(
      studentVisibleActivityInstructions("Present evidence to the partner.", "instructor_provided"),
    ).toBe("Present evidence to the partner.");
  });

  it("omits discovery-reserved instructions from the companion markdown", () => {
    const markdown = studentPackageMarkdown(EXAMPLE_DESIGN);
    expect(markdown).toContain("Student project companion");
    expect(markdown).toContain("Stakeholder briefing");
    expect(markdown).toContain("Present evidence, uncertainty remaining");
    expect(markdown).toContain("Interpret results against the decision");
    expect(markdown).not.toContain("Update the opportunity and claim boundary");
    expect(markdown).toContain("reserved for student discovery");
    expect(markdown).not.toContain("Open alignment findings");
    expect(markdown).not.toContain("AL-009");
  });

  it("lists discovery activities as excluded in the inventory", () => {
    const inventory = studentPackageInventory(EXAMPLE_DESIGN);
    const analysis = inventory.find((item) => item.id === "act-analyze");
    const briefing = inventory.find((item) => item.id === "act-brief");
    expect(analysis?.included).toBe(false);
    expect(briefing?.included).toBe(true);
  });
});
