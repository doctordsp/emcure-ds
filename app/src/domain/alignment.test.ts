import { describe, expect, it } from "vitest";
import { EXAMPLE_DESIGN } from "../data/exampleDesign";
import { applyAlignment, evaluateDesign, findingKey, mergeFindings } from "./alignment";
import { createEmptyDesign } from "./createDesign";
import { createId } from "./ids";
import {
  MVRC_OBJECT_ID,
  type AlignmentFinding,
  type EmcureDesign,
} from "./types";

function baseDesign(): EmcureDesign {
  return createEmptyDesign("Test course");
}

function finding(partial: Partial<AlignmentFinding> & Pick<AlignmentFinding, "ruleId">): AlignmentFinding {
  return {
    id: createId(),
    severity: "warning",
    title: "t",
    explanation: "e",
    affectedObjectIds: [],
    status: "open",
    route: "review",
    ...partial,
  };
}

describe("evaluateDesign", () => {
  it("warns when a selected EM item has no activity (AL-001)", () => {
    const design = baseDesign();
    design.frameworkSelections = [
      {
        id: "sel-1",
        frameworkItemId: "H-CUR-OPP",
        scopeType: "course",
        scopeId: design.id,
        priority: "primary",
      },
    ];
    const rules = evaluateDesign(design).map((item) => item.ruleId);
    expect(rules).toContain("AL-001");
  });

  it("does not warn AL-001 when an activity links the EM item", () => {
    const design = baseDesign();
    design.frameworkSelections = [
      {
        id: "sel-1",
        frameworkItemId: "H-CUR-OPP",
        scopeType: "course",
        scopeId: design.id,
        priority: "primary",
      },
    ];
    design.phases[0].activities.push({
      id: "act-1",
      title: "Need interview",
      instructions: "Talk with residents.",
      discoveryMode: "mixed",
      grouping: "team",
      linkedObjectIds: ["H-CUR-OPP"],
    });
    const rules = evaluateDesign(design).map((item) => item.ruleId);
    expect(rules).not.toContain("AL-001");
  });

  it("errors when activities exist but none link to the Big Red X (AL-005)", () => {
    const design = baseDesign();
    design.currentBigRedXId = "brx-1";
    design.uncertainties = [
      {
        id: "brx-1",
        type: "unknown",
        statement: "Does the bioswale reduce peak runoff?",
        scores: {},
        linkedImpactIds: [],
        linkedSuccessCriterionIds: [],
        decisionIfResolved: "Whether to recommend the design to the city.",
        designation: "primary_big_red_x",
      },
    ];
    design.phases[5].activities.push({
      id: "act-inv",
      title: "Lab test",
      instructions: "Measure something unrelated.",
      discoveryMode: "instructor_provided",
      grouping: "team",
      linkedObjectIds: [],
    });
    const al005 = evaluateDesign(design).find((item) => item.ruleId === "AL-005");
    expect(al005?.severity).toBe("error");
    expect(al005?.affectedObjectIds).toContain("act-inv");
  });

  it("does not fire AL-005 when no investigation has been planned yet", () => {
    const design = baseDesign();
    design.currentBigRedXId = "brx-1";
    design.uncertainties = [
      {
        id: "brx-1",
        type: "unknown",
        statement: "Unknown",
        scores: {},
        linkedImpactIds: [],
        linkedSuccessCriterionIds: [],
        decisionIfResolved: "A decision",
        designation: "primary_big_red_x",
      },
    ];
    expect(evaluateDesign(design).map((item) => item.ruleId)).not.toContain("AL-005");
  });

  it("errors when the Big Red X has no decision statement (AL-006)", () => {
    const design = baseDesign();
    design.currentBigRedXId = "brx-1";
    design.uncertainties = [
      {
        id: "brx-1",
        type: "assumption",
        statement: "Residents will share data.",
        scores: {},
        linkedImpactIds: [],
        linkedSuccessCriterionIds: [],
        designation: "primary_big_red_x",
      },
    ];
    const al006 = evaluateDesign(design).find((item) => item.ruleId === "AL-006");
    expect(al006?.severity).toBe("error");
    expect(al006?.route).toBe("big-red-x");
  });

  it("errors when an opportunity has no need or stakeholder (AL-007)", () => {
    const design = baseDesign();
    design.opportunities = [
      {
        id: "opp-1",
        statement: "A sensor network could inform green infrastructure siting.",
        needIds: [],
        stakeholderIds: [],
        valueCreated: "Better placement decisions",
        evidenceStatus: "assumption",
      },
    ];
    expect(evaluateDesign(design).some((item) => item.ruleId === "AL-007")).toBe(true);
  });

  it("does not fire AL-007 when need and stakeholder are linked", () => {
    const design = baseDesign();
    design.opportunities = [
      {
        id: "opp-1",
        statement: "A sensor network could inform green infrastructure siting.",
        needIds: ["need-1"],
        stakeholderIds: ["stk-1"],
        valueCreated: "Better placement decisions",
        evidenceStatus: "assumption",
      },
    ];
    expect(evaluateDesign(design).some((item) => item.ruleId === "AL-007")).toBe(false);
  });

  it("warns when impact lacks mechanism or indicator (AL-008)", () => {
    const design = baseDesign();
    design.intendedImpacts = [
      {
        id: "imp-1",
        statement: "Fewer flooded basements",
        category: "human",
        opportunityIds: [],
        stakeholderIds: [],
        mechanism: "",
        claimLevel: "potential_impact",
      },
    ];
    expect(evaluateDesign(design).some((item) => item.ruleId === "AL-008")).toBe(true);
  });

  it("warns when claim level is demonstrated impact (AL-009)", () => {
    const design = baseDesign();
    design.intendedImpacts = [
      {
        id: "imp-1",
        statement: "Neighborhood flooding ends",
        category: "human",
        opportunityIds: [],
        stakeholderIds: [],
        mechanism: "Students share results with the city.",
        indicator: "Peak runoff",
        claimLevel: "demonstrated_impact",
      },
    ];
    const al009 = evaluateDesign(design).find((item) => item.ruleId === "AL-009");
    expect(al009?.severity).toBe("warning");
  });

  it("warns when a success criterion is not measurable (AL-010)", () => {
    const design = baseDesign();
    design.successCriteria = [
      {
        id: "sc-1",
        statement: "It should work well",
        linkedObjectIds: [],
      },
    ];
    expect(evaluateDesign(design).some((item) => item.ruleId === "AL-010")).toBe(true);
  });

  it("does not warn AL-010 when metric and threshold exist", () => {
    const design = baseDesign();
    design.successCriteria = [
      {
        id: "sc-1",
        statement: "Peak runoff reduction",
        metric: "percent reduction vs baseline storm",
        targetOrThreshold: "15% or enough to change the city recommendation",
        linkedObjectIds: [],
      },
    ];
    expect(evaluateDesign(design).some((item) => item.ruleId === "AL-010")).toBe(false);
  });

  it("warns when a Big Red X exists without an MVRC (AL-019)", () => {
    const design = baseDesign();
    design.currentBigRedXId = "brx-1";
    design.uncertainties = [
      {
        id: "brx-1",
        type: "unknown",
        statement: "Does the bioswale reduce peak runoff?",
        scores: {},
        linkedImpactIds: [],
        linkedSuccessCriterionIds: [],
        decisionIfResolved: "Whether to recommend the design to the city.",
        designation: "primary_big_red_x",
      },
    ];
    const al019 = evaluateDesign(design).find((item) => item.ruleId === "AL-019");
    expect(al019?.severity).toBe("warning");
    expect(al019?.route).toBe("big-red-x");
  });

  it("does not warn AL-019 when the MVRC statement is present", () => {
    const design = baseDesign();
    design.currentBigRedXId = "brx-1";
    design.uncertainties = [
      {
        id: "brx-1",
        type: "unknown",
        statement: "Does the bioswale reduce peak runoff?",
        scores: {},
        linkedImpactIds: [],
        linkedSuccessCriterionIds: [],
        decisionIfResolved: "Whether to recommend the design to the city.",
        designation: "primary_big_red_x",
      },
    ];
    design.minimumViableResearchContribution = {
      statement: "A bounded evidence packet the city can use as one input.",
    };
    expect(evaluateDesign(design).some((item) => item.ruleId === "AL-019")).toBe(false);
  });

  it("warns when activities exist but none link to the MVRC (AL-020)", () => {
    const design = baseDesign();
    design.minimumViableResearchContribution = {
      statement: "A bounded evidence packet the city can use as one input.",
    };
    design.phases[0].activities.push({
      id: "act-1",
      title: "Lab test",
      instructions: "Measure something.",
      discoveryMode: "instructor_provided",
      grouping: "team",
      linkedObjectIds: [],
    });
    const al020 = evaluateDesign(design).find((item) => item.ruleId === "AL-020");
    expect(al020?.severity).toBe("warning");
    expect(al020?.route).toBe("journey");
    expect(al020?.affectedObjectIds).toContain("act-1");
  });

  it("does not fire AL-020 when an activity is linked to the MVRC", () => {
    const design = baseDesign();
    design.minimumViableResearchContribution = {
      statement: "A bounded evidence packet the city can use as one input.",
    };
    design.phases[0].activities.push({
      id: "act-1",
      title: "Write the packet",
      instructions: "Assemble evidence and a bounded recommendation.",
      discoveryMode: "mixed",
      grouping: "team",
      linkedObjectIds: [MVRC_OBJECT_ID],
    });
    expect(evaluateDesign(design).some((item) => item.ruleId === "AL-020")).toBe(false);
  });

  it("warns when the MVRC claims demonstrated impact (AL-021)", () => {
    const design = baseDesign();
    design.minimumViableResearchContribution = {
      statement: "Students will produce demonstrated impact this semester.",
    };
    const al021 = evaluateDesign(design).find((item) => item.ruleId === "AL-021");
    expect(al021?.severity).toBe("warning");
    expect(al021?.route).toBe("big-red-x");
  });

  it("does not flag the stormwater example for MVRC gaps", () => {
    const rules = evaluateDesign(EXAMPLE_DESIGN).map((item) => item.ruleId);
    expect(rules).not.toContain("AL-019");
    expect(rules).not.toContain("AL-020");
    expect(rules).not.toContain("AL-021");
  });
});

describe("mergeFindings", () => {
  it("preserves dismissal across re-evaluation", () => {
    const design = baseDesign();
    design.successCriteria = [
      { id: "sc-1", statement: "vague", linkedObjectIds: [] },
    ];
    const first = applyAlignment(design);
    const dismissed = first.findings.find((item) => item.ruleId === "AL-010");
    expect(dismissed).toBeTruthy();
    dismissed!.status = "dismissed";
    dismissed!.resolutionNote = "Will refine next week.";
    const second = applyAlignment(first);
    const kept = second.findings.find((item) => item.ruleId === "AL-010");
    expect(kept?.status).toBe("dismissed");
    expect(kept?.resolutionNote).toBe("Will refine next week.");
    expect(kept?.id).toBe(dismissed!.id);
  });

  it("uses rule id and affected objects as the merge key", () => {
    const previous = [
      finding({
        id: "old",
        ruleId: "AL-007",
        affectedObjectIds: ["b", "a"],
        status: "deferred",
      }),
    ];
    const next = [
      finding({
        id: "new",
        ruleId: "AL-007",
        affectedObjectIds: ["a", "b"],
      }),
    ];
    expect(findingKey(previous[0])).toBe(findingKey(next[0]));
    expect(mergeFindings(previous, next)[0].status).toBe("deferred");
  });
});
