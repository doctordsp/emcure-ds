import { applyAlignment } from "../domain/alignment";
import { MVRC_OBJECT_ID, SCHEMA_VERSION, type EmcureDesign } from "../domain/types";

const createdAt = "2026-08-01T12:00:00.000Z";

/** Seeded faculty example with one intentional alignment gap (AL-009). */
export const EXAMPLE_DESIGN: EmcureDesign = applyAlignment({
  schemaVersion: SCHEMA_VERSION,
  id: "example-stormwater-emcure",
  title: "Stormwater sensors for neighborhood flooding",
  status: "draft",
  frameworkMode: "both",
  frameworkSelections: [
    {
      id: "sel-opp",
      frameworkItemId: "H-CUR-OPP",
      scopeType: "course",
      scopeId: "example-stormwater-emcure",
      priority: "primary",
    },
    {
      id: "sel-imp",
      frameworkItemId: "H-CON-IMP",
      scopeType: "course",
      scopeId: "example-stormwater-emcure",
      priority: "primary",
    },
    {
      id: "sel-cus",
      frameworkItemId: "H-VAL-CUS",
      scopeType: "course",
      scopeId: "example-stormwater-emcure",
      priority: "supporting",
    },
    {
      id: "sel-isi",
      frameworkItemId: "B-ISI",
      scopeType: "course",
      scopeId: "example-stormwater-emcure",
      priority: "primary",
    },
    {
      id: "sel-gsd",
      frameworkItemId: "B-GSD",
      scopeType: "course",
      scopeId: "example-stormwater-emcure",
      priority: "primary",
    },
  ],
  courseProfile: {
    title: "Stormwater sensors for neighborhood flooding",
    code: "CIVE 390",
    discipline: "Civil engineering",
    level: "Junior",
    enrollment: 24,
    teamSize: 4,
    durationWeeks: 14,
    meetingPattern: "Studio twice weekly",
    prerequisites: "Fluid mechanics; introductory statistics",
    autonomyLevel: "guided",
    technicalObjectives:
      "Students will design a measurement plan, collect hydrologic evidence, and recommend whether a bioswale design should advance with a municipal partner.",
  },
  projectSituation:
    "A low-lying neighborhood experiences repeated basement flooding after moderate storms. The city is considering a bioswale retrofit but lacks local performance evidence. A public-works liaison can meet twice during the semester.",
  lineOfSightStatement:
    "We are investigating whether a proposed bioswale reduces peak runoff during typical storms to resolve uncertainty about on-site performance. This uncertainty affects the opportunity to site low-cost green infrastructure where it can reduce flooding, which could contribute to fewer inundated homes for neighborhood residents and the city. The evidence will inform whether the city advances, revises, or pauses the retrofit.",
  currentBigRedXId: "brx-runoff",
  minimumViableResearchContribution: {
    statement:
      "Students produce a bounded evidence packet that measures whether the proposed bioswale reduces peak runoff under typical local storms, and a recommendation the city can use as one input to advance, revise, or pause.",
    deliverables: [
      "A measurement protocol and storm-event dataset compared to an untreated baseline",
      "A written recommendation that separates student interpretation from the partner's decision",
    ],
    studentFacingStatement:
      "Your team's minimum contribution is a usable evidence packet and a bounded recommendation: does this bioswale reduce peak runoff enough to inform the city's go/revise/pause decision? Neighborhood-scale flooding reduction is beyond this course.",
  },
  stakeholders: [
    {
      id: "stk-residents",
      name: "Neighborhood residents",
      group: "Affected households",
      roles: ["need-holder", "beneficiary", "affected party"],
      priority: "primary",
      arena: "external",
      lens: {
        statedInterests: "Fewer flooded basements and clearer information about the retrofit.",
        underlyingValues: "Safety of home, being treated as residents rather than a drainage problem.",
        powerOver: "Little formal authority over the capital decision.",
        powerWith: "Complaint history, neighbor networks, and a community liaison.",
        immediateImpact: "Survey time and possible privacy exposure during student visits.",
        longerTermImpact: "If the retrofit proceeds, fewer inundated homes over later storm seasons.",
      },
      influence: 2,
      interest: 5,
      accessStatus: "Limited; community liaison available",
      researchInvolvement:
        "Students may interview residents through a community liaison. Residents do not attend the city briefing.",
      potentialBenefit: "Reduced flooding and clearer information about the retrofit.",
      potentialBurden: "Survey fatigue; privacy concerns if homes are identified.",
      evidenceStatus: "anecdotal",
    },
    {
      id: "stk-city",
      name: "Municipal public works",
      group: "City partner",
      roles: ["decision-maker", "partner", "implementer"],
      priority: "primary",
      arena: "external",
      lens: {
        statedInterests: "Site-specific evidence before committing capital to the bioswale.",
        underlyingValues: "Stewardship of public funds and avoiding a visible failed retrofit.",
        powerOver: "Authority to advance, revise, or pause the project.",
        powerWith: "Two scheduled meetings and staff who can open access to the site.",
        immediateImpact: "Meeting time; risk that a student packet is treated as a final design.",
        longerTermImpact: "A more defensible go/revise/pause record for later storms.",
      },
      influence: 5,
      interest: 4,
      accessStatus: "Two scheduled meetings",
      researchInvolvement:
        "Meets twice; can open site access; reviews the evidence packet and makes a go/revise/pause call.",
      potentialBenefit: "Local performance evidence before capital commitment.",
      potentialBurden: "Staff time; risk that student work is taken as a final design.",
      evidenceStatus: "supported",
    },
  ],
  needs: [
    {
      id: "need-flooding",
      statement:
        "Residents and the city need credible, local evidence of whether a bioswale retrofit would reduce flooding during typical storms.",
      context:
        "Complaint logs and a handful of resident interviews describe repeated basement flooding. Current solutions are complaint-driven pumping and a generic vendor drawing.",
      stakeholderIds: ["stk-residents", "stk-city"],
      currentCondition:
        "The city has a concept drawing but no site-specific hydrologic performance data.",
      evidenceNotes:
        "Faculty site visit plus city complaint summaries. Residents have not been systematically interviewed by students yet.",
      evidenceStatus: "anecdotal",
    },
  ],
  opportunities: [
    {
      id: "opp-siting",
      statement:
        "Undergraduate teams can generate a bounded performance comparison that helps the city decide whether this bioswale concept is worth advancing.",
      needIds: ["need-flooding"],
      stakeholderIds: ["stk-city", "stk-residents"],
      valueCreated:
        "A decision-ready evidence packet: what was measured, what remains uncertain, and a bounded recommendation.",
      evidenceStatus: "assumption",
    },
  ],
  intendedImpacts: [
    {
      id: "imp-flooding",
      statement:
        "If the retrofit proceeds on the basis of student evidence, residents could experience fewer flooded basements over subsequent storm seasons.",
      category: "human",
      opportunityIds: ["opp-siting"],
      stakeholderIds: ["stk-residents", "stk-city"],
      mechanism:
        "City staff use the student recommendation as one input to a go/revise/pause decision on the retrofit.",
      indicator: "City decision recorded; optional follow-up on repeat flood complaints.",
      timeframe: "City decision this year; flood outcomes over subsequent seasons.",
      claimLevel: "demonstrated_impact",
      claimBoundary:
        "This course can support a potential-impact claim. Demonstrated neighborhood change is beyond a one-semester student investigation unless the city already has outcome data.",
    },
  ],
  successCriteria: [
    {
      id: "sc-runoff",
      statement: "Bioswale performance relative to a baseline storm hydrograph",
      metric: "Peak runoff reduction versus untreated baseline",
      baseline: "Unknown; students will establish a baseline from nearby untreated drainage.",
      targetOrThreshold:
        "Enough reduction to change the city from pause to revise or advance, or a clear finding of no meaningful reduction.",
      unit: "% peak reduction",
      evidenceSource: "Student-deployed sensors and a defined storm event protocol",
      linkedObjectIds: ["opp-siting", "imp-flooding", "brx-runoff"],
    },
    {
      id: "sc-decision",
      statement: "City partner can act on the student packet",
      metric: "Partner rates the packet as usable for a go/revise/pause conversation",
      targetOrThreshold: "Public-works liaison states a next action using the packet",
      evidenceSource: "End-of-term stakeholder briefing notes",
      linkedObjectIds: ["opp-siting", "stk-city"],
    },
  ],
  uncertainties: [
    {
      id: "brx-runoff",
      type: "unknown",
      statement:
        "Whether the proposed bioswale actually reduces peak runoff under typical local storms.",
      scores: {
        influenceOnOpportunity: 5,
        influenceOnImpact: 5,
        uncertainty: 4,
        investigability: 4,
        courseFeasibility: 4,
      },
      linkedImpactIds: ["imp-flooding"],
      linkedSuccessCriterionIds: ["sc-runoff"],
      decisionIfResolved:
        "Whether the city should advance, revise, or pause the bioswale retrofit.",
      rationale:
        "If on-site performance is negligible, the opportunity to create value with this design collapses. Students can investigate it with sensors in one semester.",
      designation: "primary_big_red_x",
    },
    {
      id: "unc-access",
      type: "barrier",
      statement: "Whether residents will allow sensor placement near private property.",
      scores: {
        influenceOnOpportunity: 3,
        influenceOnImpact: 2,
        uncertainty: 3,
        investigability: 3,
        courseFeasibility: 3,
      },
      linkedImpactIds: ["imp-flooding"],
      linkedSuccessCriterionIds: [],
      decisionIfResolved: "Whether the measurement plan stays on public right-of-way only.",
      designation: "secondary",
    },
    {
      id: "unc-model",
      type: "assumption",
      statement: "Vendor drawings assume soil infiltration rates that may not match the site.",
      scores: {
        influenceOnOpportunity: 4,
        influenceOnImpact: 4,
        uncertainty: 3,
        investigability: 4,
        courseFeasibility: 4,
      },
      linkedImpactIds: ["imp-flooding"],
      linkedSuccessCriterionIds: ["sc-runoff"],
      designation: "candidate",
    },
  ],
  phases: [
    {
      id: "ph-situation",
      title: "Understand the situation",
      order: 0,
      activities: [
        {
          id: "act-briefing",
          title: "Partner briefing and site walk",
          instructions:
            "Meet public works, walk the drainage path, and record what is known, assumed, and still uncertain.",
          discoveryMode: "instructor_provided",
          grouping: "whole_class",
          estimatedMinutes: 120,
          linkedObjectIds: ["H-CUR-OPP", "B-ISI", "need-flooding"],
        },
      ],
    },
    {
      id: "ph-stakeholders",
      title: "Engage stakeholders",
      order: 1,
      activities: [
        {
          id: "act-interviews",
          title: "Resident and city interviews",
          instructions:
            "Use a short protocol to distinguish evidence from assumption. Do not identify households in shared notes.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 180,
          linkedObjectIds: ["H-VAL-CUS", "B-ISI", "stk-residents", "stk-city"],
        },
      ],
    },
    {
      id: "ph-define",
      title: "Define need, opportunity, and impact",
      order: 2,
      activities: [
        {
          id: "act-thread",
          title: "Draft and revise the opportunity–impact thread",
          instructions:
            "Write a need, opportunity, intended impact, and claim boundary. Revisit after evidence is in.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 90,
          linkedObjectIds: ["H-CON-IMP", "opp-siting", "imp-flooding"],
        },
      ],
    },
    {
      id: "ph-success",
      title: "Define success",
      order: 3,
      activities: [],
    },
    {
      id: "ph-brx",
      title: "Prioritize uncertainties and select the Big Red X",
      order: 4,
      activities: [
        {
          id: "act-brx",
          title: "Compare candidate uncertainties",
          instructions:
            "Score candidates, then write a rationale. The highest score does not automatically win.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 75,
          linkedObjectIds: ["brx-runoff", "H-CON-IMP"],
        },
      ],
    },
    {
      id: "ph-investigate",
      title: "Plan the investigation",
      order: 5,
      activities: [
        {
          id: "act-protocol",
          title: "Sensor protocol for peak runoff",
          instructions:
            "Design a measurement plan that can confirm or refute a meaningful reduction in peak runoff. Include a plan for disconfirming evidence.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 240,
          linkedObjectIds: ["brx-runoff", "B-GSD", "sc-runoff", MVRC_OBJECT_ID],
        },
      ],
    },
    {
      id: "ph-evidence",
      title: "Generate evidence, interpret, and decide",
      order: 6,
      activities: [
        {
          id: "act-analyze",
          title: "Interpret results against the decision",
          instructions:
            "Update the opportunity and claim boundary. Recommend advance, revise, or pause.",
          discoveryMode: "student_discovered",
          grouping: "team",
          estimatedMinutes: 180,
          linkedObjectIds: [
            "brx-runoff",
            "opp-siting",
            "imp-flooding",
            "B-GSD",
            "H-CON-IMP",
            MVRC_OBJECT_ID,
          ],
        },
      ],
    },
    {
      id: "ph-communicate",
      title: "Communicate and reflect",
      order: 7,
      activities: [
        {
          id: "act-brief",
          title: "Stakeholder briefing",
          instructions:
            "Present evidence, uncertainty remaining, and a bounded recommendation. Separate student interpretation from partner decision.",
          discoveryMode: "instructor_provided",
          grouping: "whole_class",
          estimatedMinutes: 90,
          linkedObjectIds: ["B-ISI", "stk-city", "sc-decision", MVRC_OBJECT_ID],
        },
      ],
    },
  ],
  findings: [],
  createdAt,
  updatedAt: createdAt,
});
