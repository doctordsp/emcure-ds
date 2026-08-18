import { describe, expect, it } from "vitest";
import { EXAMPLE_DESIGN } from "../data/exampleDesign";
import {
  canFillCardField,
  cardMaterialsFromDesign,
  draftCardFromDesign,
  emptyCard,
  fillCardField,
  generateCardSummary,
  yearLevelFromCourse,
} from "./card";
import { createEmptyDesign } from "./createDesign";

describe("draftCardFromDesign", () => {
  it("maps junior level to upper division and pre-checks mapped 3C outcomes", () => {
    const card = draftCardFromDesign(EXAMPLE_DESIGN);
    expect(card.yearLevel).toBe("upper-division");
    expect(card.title).toContain("Stormwater");
    expect(card.problemNeed).toContain("basement flooding");
    expect(card.emOutcomeIds).toContain("val-opportunity");
    expect(card.formats).toContain("service-learning");
    expect(card.learningObjectives).toContain("measurement plan");
  });

  it("leaves year level empty when the course has no level", () => {
    expect(yearLevelFromCourse("")).toBe("");
    expect(yearLevelFromCourse("First-year")).toBe("lower-division");
  });

  it("drafts a summary from card fields", () => {
    const card = draftCardFromDesign(createEmptyDesign("River sensors"));
    card.yearLevel = "lower-division";
    card.formats = ["challenge-based"];
    card.problemNeed = "A town needs cheaper flood alerts.";
    const summary = generateCardSummary(card);
    expect(summary).toContain("River sensors");
    expect(summary).toContain("Lower Division");
    expect(summary).toContain("cheaper flood alerts");
  });

  it("builds a materials starter from the course envelope and journey titles", () => {
    const materials = cardMaterialsFromDesign(EXAMPLE_DESIGN);
    expect(materials).toContain("14-week");
    expect(materials).toContain("teams of 4");
    expect(materials).toContain("Stakeholder briefing");
  });
});

describe("fillCardField", () => {
  it("refills one field and leaves other card edits intact", () => {
    const card = {
      ...draftCardFromDesign(EXAMPLE_DESIGN),
      title: "Custom public title",
      description: "Keep this edited description.",
    };
    const next = fillCardField(card, EXAMPLE_DESIGN, "title");
    expect(next.title).toContain("Stormwater");
    expect(next.description).toBe("Keep this edited description.");
  });

  it("does not change the card when the design has nothing to copy", () => {
    const empty = createEmptyDesign("");
    empty.title = "";
    empty.courseProfile.title = "";
    empty.courseProfile.level = "";
    empty.courseProfile.discipline = "";
    empty.courseProfile.technicalObjectives = "";
    const card = { ...emptyCard(), title: "Keep", problemNeed: "Keep need" };
    expect(canFillCardField(empty, "problemNeed")).toBe(false);
    expect(canFillCardField(empty, "yearLevel")).toBe(false);
    expect(canFillCardField(empty, "assessment")).toBe(false);
    expect(canFillCardField(empty, "emOutcomeIds")).toBe(false);
    expect(fillCardField(card, empty, "problemNeed")).toEqual(card);
  });
});
