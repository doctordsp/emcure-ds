import { describe, expect, it } from "vitest";
import { STARTER_EXAMPLES } from "../data/examples";
import { createEmptyDesign } from "./createDesign";
import {
  activityComplete,
  brxReady,
  courseProfileReady,
  filledNumber,
  filledText,
  frameworkReady,
  impactComplete,
  journeyReady,
  mvrcReady,
  needComplete,
  opportunityComplete,
  readySlot,
  sectionStatuses,
  stakeholderNamed,
  stakeholdersReady,
  successComplete,
  successReady,
  threadReady,
} from "./progress";
import type { EmcureDesign } from "./types";

function withProfile(
  design: EmcureDesign,
  patch: Partial<EmcureDesign["courseProfile"]>,
): EmcureDesign {
  return { ...design, courseProfile: { ...design.courseProfile, ...patch } };
}

describe("filled helpers", () => {
  it("treats whitespace as empty text", () => {
    expect(filledText("")).toBe(false);
    expect(filledText("   ")).toBe(false);
    expect(filledText("CIVE 390")).toBe(true);
  });

  it("requires a finite number greater than zero", () => {
    expect(filledNumber(undefined)).toBe(false);
    expect(filledNumber(0)).toBe(false);
    expect(filledNumber(-1)).toBe(false);
    expect(filledNumber(24)).toBe(true);
  });
});

describe("readySlot", () => {
  it("is green when this field is filled", () => {
    expect(readySlot(true, false)).toBe(true);
    expect(readySlot(true, true)).toBe(true);
  });

  it("is red when the group is still missing and this field is empty", () => {
    expect(readySlot(false, false)).toBe(false);
  });

  it("is optional when the group is already satisfied and this field is empty", () => {
    expect(readySlot(false, true)).toBeUndefined();
  });
});

describe("courseProfileReady", () => {
  it("is not Ready from a title and duration alone", () => {
    const design = withProfile(createEmptyDesign("Stormwater studio"), { durationWeeks: 14 });
    expect(courseProfileReady(design)).toBe(false);
  });

  it("requires the main profile fields, not only title", () => {
    const almost = withProfile(createEmptyDesign("Stormwater studio"), {
      code: "CIVE 390",
      discipline: "Civil engineering",
      level: "Junior",
      enrollment: 24,
      teamSize: 4,
      durationWeeks: 14,
      meetingPattern: "Studio twice weekly",
      prerequisites: "Fluid mechanics",
      technicalObjectives: "",
    });
    expect(courseProfileReady(almost)).toBe(false);
    expect(courseProfileReady(withProfile(almost, { technicalObjectives: "Design a measurement plan." }))).toBe(
      true,
    );
  });

  it("does not gate autonomy, which already has a default", () => {
    const ready = withProfile(createEmptyDesign("Stormwater studio"), {
      code: "CIVE 390",
      discipline: "Civil engineering",
      level: "Junior",
      enrollment: 24,
      teamSize: 4,
      durationWeeks: 14,
      meetingPattern: "Studio twice weekly",
      prerequisites: "Fluid mechanics",
      technicalObjectives: "Design a measurement plan.",
      autonomyLevel: "guided",
    });
    expect(courseProfileReady(ready)).toBe(true);
    expect(courseProfileReady(withProfile(ready, { autonomyLevel: "high" }))).toBe(true);
  });
});

describe("section Ready predicates", () => {
  it("does not mark stakeholders Ready from a named person without a complete need", () => {
    const design = createEmptyDesign();
    design.projectSituation = "A neighborhood floods after moderate storms.";
    design.stakeholders = [
      {
        id: "stk-1",
        name: "Public works",
        roles: [],
        evidenceStatus: "assumption",
      },
    ];
    design.needs = [
      {
        id: "need-1",
        statement: "Need a decision packet.",
        context: "",
        stakeholderIds: [],
        currentCondition: "",
        evidenceNotes: "",
        evidenceStatus: "assumption",
      },
    ];
    expect(stakeholderNamed(design.stakeholders[0])).toBe(true);
    expect(needComplete(design.needs[0])).toBe(false);
    expect(stakeholdersReady(design)).toBe(false);
  });

  it("does not mark opportunity/impact Ready from statements alone", () => {
    const design = createEmptyDesign();
    design.opportunities = [
      {
        id: "opp-1",
        statement: "Students can produce a packet.",
        needIds: [],
        stakeholderIds: [],
        valueCreated: "",
        evidenceStatus: "assumption",
      },
    ];
    design.intendedImpacts = [
      {
        id: "imp-1",
        statement: "Fewer flooded homes.",
        category: "human",
        opportunityIds: [],
        stakeholderIds: [],
        mechanism: "",
        claimLevel: "potential_impact",
      },
    ];
    expect(opportunityComplete(design.opportunities[0])).toBe(false);
    expect(impactComplete(design.intendedImpacts[0])).toBe(false);
    expect(threadReady(design)).toBe(false);
  });

  it("does not mark success Ready from a statement without a metric and threshold", () => {
    const design = createEmptyDesign();
    design.successCriteria = [
      {
        id: "sc-1",
        statement: "The city can decide.",
        linkedObjectIds: [],
      },
    ];
    expect(successComplete(design.successCriteria[0])).toBe(false);
    expect(successReady(design)).toBe(false);
  });

  it("does not mark journey Ready from an untitled empty activity", () => {
    const design = createEmptyDesign();
    design.phases[0].activities = [
      {
        id: "act-1",
        title: "",
        instructions: "",
        discoveryMode: "mixed",
        grouping: "team",
        linkedObjectIds: [],
      },
    ];
    expect(activityComplete(design.phases[0].activities[0])).toBe(false);
    expect(journeyReady(design)).toBe(false);
  });

  it("keeps a blank design out of Ready across the main sections", () => {
    const design = createEmptyDesign();
    expect(courseProfileReady(design)).toBe(false);
    expect(frameworkReady(design)).toBe(false);
    expect(stakeholdersReady(design)).toBe(false);
    expect(threadReady(design)).toBe(false);
    expect(successReady(design)).toBe(false);
    expect(brxReady(design)).toBe(false);
    expect(mvrcReady(design)).toBe(false);
    expect(journeyReady(design)).toBe(false);
    expect(sectionStatuses(design).find((item) => item.route === "course")?.state).toBe("in_progress");
    expect(sectionStatuses(design).find((item) => item.route === "mvrc")?.state).toBe("not_started");
    expect(sectionStatuses(design).find((item) => item.route === "export")?.state).toBe("not_started");
    expect(sectionStatuses(design).map((item) => item.label)).toEqual([
      "1. Course profile",
      "2. EM framework",
      "3. Stakeholders and need",
      "4. Opportunity and impact",
      "5. Success criteria",
      "6. Big Red X",
      "7. MVRC",
      "8. Student journey",
      "9. Alignment review",
      "10. Export",
    ]);
  });

  it("can mark Big Red X Ready without an MVRC statement", () => {
    const design = createEmptyDesign();
    design.currentBigRedXId = "brx-1";
    design.uncertainties = [
      {
        id: "brx-1",
        type: "unknown",
        statement: "Does the bioswale reduce peak runoff?",
        scores: {},
        linkedImpactIds: [],
        linkedSuccessCriterionIds: [],
        decisionIfResolved: "Whether the city advances, revises, or pauses.",
        rationale: "This is the decision the liaison asked the course to inform.",
        designation: "primary_big_red_x",
      },
    ];
    expect(brxReady(design)).toBe(true);
    expect(mvrcReady(design)).toBe(false);
  });
});

describe("starter examples stay Ready", () => {
  it.each(STARTER_EXAMPLES.map((item) => [item.id, item.design] as const))(
    "%s satisfies the tightened Ready gates",
    (_id, design) => {
      expect(courseProfileReady(design)).toBe(true);
      expect(frameworkReady(design)).toBe(true);
      expect(stakeholdersReady(design)).toBe(true);
      expect(threadReady(design)).toBe(true);
      expect(successReady(design)).toBe(true);
      expect(brxReady(design)).toBe(true);
      expect(mvrcReady(design)).toBe(true);
      expect(journeyReady(design)).toBe(true);
      const states = Object.fromEntries(sectionStatuses(design).map((item) => [item.route, item.state]));
      expect(states).toMatchObject({
        course: "ready",
        framework: "ready",
        stakeholders: "ready",
        "opportunity-impact": "ready",
        success: "ready",
        "big-red-x": "ready",
        mvrc: "ready",
        journey: "ready",
        review: "ready",
        export: "ready",
      });
    },
  );
});
