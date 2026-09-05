import { applyAlignment } from "../domain/alignment";
import { MVRC_OBJECT_ID, SCHEMA_VERSION, type EmcureDesign } from "../domain/types";
import { withExportSurfaces } from "./exportSurfaces";

const createdAt = "2026-08-01T12:00:00.000Z";

/** Complete stormwater specimen: every studio field filled, including export surfaces. */
const EXAMPLE_CORE: EmcureDesign = {
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
      localInterpretation:
        "In this studio, opportunity means finding a measurement the city does not already have, not inventing a new green-infrastructure product.",
    },
    {
      id: "sel-imp",
      frameworkItemId: "H-CON-IMP",
      scopeType: "course",
      scopeId: "example-stormwater-emcure",
      priority: "primary",
      localInterpretation:
        "Students must state what the evidence can support (a go/revise/pause input) versus neighborhood-scale flood reduction they will not observe this term.",
    },
    {
      id: "sel-cus",
      frameworkItemId: "H-VAL-CUS",
      scopeType: "course",
      scopeId: "example-stormwater-emcure",
      priority: "supporting",
      localInterpretation:
        "Customer here is both residents who live with flooding and public-works staff who must defend a capital call. Interviews stay with the liaison, not door-to-door canvassing.",
    },
    {
      id: "sel-isi",
      frameworkItemId: "B-ISI",
      scopeType: "course",
      scopeId: "example-stormwater-emcure",
      priority: "primary",
      localInterpretation:
        "Students practice identifying who holds the need, who decides, and who is only affected, using the two scheduled city meetings and liaison-mediated resident contact.",
    },
    {
      id: "sel-gsd",
      frameworkItemId: "B-GSD",
      scopeType: "course",
      scopeId: "example-stormwater-emcure",
      priority: "primary",
      localInterpretation:
        "The design is a measurement plan and a bounded recommendation, not a redesigned bioswale. Disconfirming evidence (no meaningful peak reduction) is a successful investigation.",
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
    "A low-lying neighborhood experiences repeated basement flooding after moderate storms. The city is considering a bioswale retrofit but lacks local performance evidence. A public-works liaison can meet twice during the semester. The instructor has walked the drainage path and has complaint summaries, not a complete hydrologic record.",
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
      accessStatus: "Limited; community liaison available for scheduled interviews, not unannounced home visits.",
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
      accessStatus: "Two scheduled meetings plus email with the liaison between meetings.",
      researchInvolvement:
        "Meets twice; can open site access; reviews the evidence packet and makes a go/revise/pause call.",
      potentialBenefit: "Local performance evidence before capital commitment.",
      potentialBurden: "Staff time; risk that student work is taken as a final design.",
      evidenceStatus: "supported",
    },
    {
      id: "stk-instructor",
      name: "Course instructor",
      group: "Teaching team",
      roles: ["expert", "implementer"],
      priority: "secondary",
      arena: "internal",
      lens: {
        statedInterests: "A feasible 14-week investigation that still produces partner-usable evidence.",
        underlyingValues: "Undergraduate research authenticity without over-claiming impact.",
        powerOver: "Sets the measurement envelope, safety rules, and what appears in the student companion.",
        powerWith: "Relationship with the public-works liaison and the community contact.",
        immediateImpact: "Studio time, equipment checkout, and IRB-aware interview protocols.",
        longerTermImpact: "A repeatable EM-CURE other civil faculty can adapt.",
      },
      influence: 4,
      interest: 5,
      accessStatus: "Present in every studio; holds the equipment locker and partner calendar.",
      researchInvolvement:
        "Scaffolds protocols, reviews drafts, and withholds discovery-reserved analysis prompts from the student companion.",
      potentialBenefit: "A complete worked example of need through investigation.",
      potentialBurden: "Partner coordination and equipment risk if sensors are left in the right-of-way.",
      evidenceStatus: "supported",
    },
  ],
  needs: [
    {
      id: "need-flooding",
      statement:
        "Residents need credible, local evidence of whether a bioswale retrofit would reduce basement flooding during typical storms.",
      context:
        "Complaint logs and a handful of resident interviews describe repeated basement flooding after moderate rain. Current responses are complaint-driven pumping and a generic vendor drawing that has not been checked on this soil.",
      stakeholderIds: ["stk-residents"],
      currentCondition:
        "Households know they flood. They do not know whether this specific bioswale would change that, and they have not seen site data they trust.",
      evidenceNotes:
        "Faculty site visit plus city complaint summaries. Residents have not been systematically interviewed by students yet.",
      evidenceStatus: "anecdotal",
    },
    {
      id: "need-decision",
      statement:
        "Public works needs a go/revise/pause packet it can defend internally: what was measured, what remains uncertain, and what the student team recommends as one input, not a final design.",
      context:
        "Capital staff will not advance the retrofit on a vendor drawing alone. Two liaison meetings are already on the calendar. The city will not treat a student report as construction documents.",
      stakeholderIds: ["stk-city"],
      currentCondition:
        "The city has a concept drawing and no site-specific hydrologic performance data, and no written decision rule for this site.",
      evidenceNotes:
        "Liaison email confirming two meetings and that a bounded recommendation is the expected student product.",
      evidenceStatus: "supported",
    },
  ],
  opportunities: [
    {
      id: "opp-siting",
      statement:
        "Undergraduate teams can generate a bounded performance comparison that helps the city decide whether this bioswale concept is worth advancing.",
      needIds: ["need-flooding", "need-decision"],
      stakeholderIds: ["stk-city", "stk-residents"],
      valueCreated:
        "A decision-ready evidence packet: what was measured, what remains uncertain, and a bounded recommendation the liaison can carry into a capital conversation.",
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
      indicator: "City decision recorded; optional follow-up on repeat flood complaints after later seasons.",
      timeframe: "City decision this year; flood outcomes over subsequent seasons.",
      claimLevel: "potential_impact",
      claimBoundary:
        "This course can support a potential-impact claim. Demonstrated neighborhood change is beyond a one-semester student investigation unless the city already has outcome data.",
    },
    {
      id: "imp-learning",
      statement:
        "Students leave with a hydrologic dataset, a written claim boundary, and practice distinguishing evidence from a partner decision.",
      category: "educational",
      opportunityIds: ["opp-siting"],
      stakeholderIds: ["stk-instructor"],
      mechanism:
        "Teams design a protocol, capture at least one storm against a baseline, and brief the liaison on what the data can and cannot support.",
      indicator: "Complete evidence packet plus individual memos that state remaining uncertainty.",
      timeframe: "This 14-week term.",
      claimLevel: "outcome",
      claimBoundary:
        "This is a student-learning outcome, not a claim that the neighborhood flooding problem is solved.",
    },
  ],
  successCriteria: [
    {
      id: "sc-runoff",
      statement: "Bioswale performance relative to a baseline storm hydrograph is measured clearly enough to inform a city decision.",
      metric: "Peak runoff reduction versus untreated baseline for a defined typical storm",
      baseline: "Nearby untreated drainage, same storm event, student-deployed sensors on public right-of-way",
      targetOrThreshold:
        "Enough reduction to move the city from pause to revise or advance, or a clear finding of no meaningful reduction. Either result counts as success.",
      unit: "% peak reduction",
      evidenceSource: "Student-deployed sensors and a defined storm-event protocol",
      linkedObjectIds: ["opp-siting", "imp-flooding", "brx-runoff", "need-flooding"],
    },
    {
      id: "sc-decision",
      statement: "The city partner can act on the student packet without treating it as construction documents.",
      metric: "Partner rates the packet as usable for a go/revise/pause conversation",
      baseline: "No site-specific packet exists; the liaison currently has only a vendor drawing.",
      targetOrThreshold: "Public-works liaison states a next action (advance, revise, or pause) using the packet",
      unit: "binary usable / not usable, plus recorded next action",
      evidenceSource: "End-of-term stakeholder briefing notes signed by the liaison",
      linkedObjectIds: ["opp-siting", "stk-city", "need-decision"],
    },
    {
      id: "sc-packet",
      statement: "The minimum research contribution is present: protocol, dataset, and bounded recommendation.",
      metric: "Packet completeness against the MVRC deliverable list",
      baseline: "Empty packet at week 1",
      targetOrThreshold: "Both listed deliverables present; recommendation names remaining uncertainty",
      unit: "checklist of 2 deliverables",
      evidenceSource: "Submitted packet and briefing slides",
      linkedObjectIds: [MVRC_OBJECT_ID, "imp-learning", "brx-runoff"],
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
      linkedSuccessCriterionIds: ["sc-runoff", "sc-packet"],
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
      linkedSuccessCriterionIds: ["sc-runoff"],
      decisionIfResolved: "Whether the measurement plan stays on public right-of-way only.",
      rationale:
        "Access shapes how the protocol is run, not whether peak-runoff performance is the critical uncertainty. Right-of-way measurement is the fallback.",
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
      decisionIfResolved:
        "Whether the team treats vendor infiltration numbers as given or as a hypothesis to test.",
      rationale:
        "This assumption feeds the Big Red X. It is a candidate, not the primary, because a wrong infiltration number is one mechanism among others for poor peak-runoff performance.",
      designation: "candidate",
    },
    {
      id: "unc-sewer",
      type: "unknown",
      statement: "Whether the city will fund a neighborhood-scale storm sewer this decade.",
      scores: {
        influenceOnOpportunity: 5,
        influenceOnImpact: 5,
        uncertainty: 5,
        investigability: 1,
        courseFeasibility: 1,
      },
      linkedImpactIds: ["imp-flooding"],
      linkedSuccessCriterionIds: [],
      decisionIfResolved: "Not a decision this course can inform.",
      rationale:
        "Consequential, but undergraduates cannot generate useful evidence on capital budgeting this term. Out of scope so it does not swallow the investigation.",
      designation: "out_of_scope",
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
            "Meet public works, walk the drainage path, and record what is known, assumed, and still uncertain. Photograph only public right-of-way.",
          discoveryMode: "instructor_provided",
          grouping: "whole_class",
          estimatedMinutes: 120,
          linkedObjectIds: ["H-CUR-OPP", "B-ISI", "need-flooding", "need-decision", "stk-city"],
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
            "Use a short protocol to distinguish evidence from assumption. Do not identify households in shared notes. Route resident contact through the community liaison.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 180,
          linkedObjectIds: ["H-VAL-CUS", "B-ISI", "stk-residents", "stk-city", "need-flooding"],
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
          title: "Draft and revise the opportunity-impact thread",
          instructions:
            "Write a need for residents, a need for the city, one opportunity, intended impact, and a claim boundary. Revisit after evidence is in.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 90,
          linkedObjectIds: ["H-CON-IMP", "opp-siting", "imp-flooding", "need-flooding", "need-decision"],
        },
      ],
    },
    {
      id: "ph-success",
      title: "Define success",
      order: 3,
      activities: [
        {
          id: "act-success",
          title: "Write measurable success criteria",
          instructions:
            "Turn the intended city decision into criteria a liaison could recognize. For peak runoff, include metric, untreated baseline, unit, and a threshold where either reduction or no-reduction is a valid finding. Add a usability criterion for the packet itself.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 75,
          linkedObjectIds: ["sc-runoff", "sc-decision", "sc-packet", "opp-siting", "stk-city"],
        },
      ],
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
            "Score candidates, then write a rationale. The highest score does not automatically win. Mark capital-scale sewer questions out of scope.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 75,
          linkedObjectIds: ["brx-runoff", "H-CON-IMP", "unc-access", "unc-model"],
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
            "Design a measurement plan that can confirm or refute a meaningful reduction in peak runoff. Include a plan for disconfirming evidence and a public right-of-way fallback.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 240,
          linkedObjectIds: ["brx-runoff", "B-GSD", "sc-runoff", MVRC_OBJECT_ID],
        },
        {
          id: "act-deploy",
          title: "Deploy sensors and capture a storm event",
          instructions:
            "Install the agreed layout on public right-of-way. Log at least one typical storm against the untreated baseline. Record gaps (missed peak, sensor failure) in the packet.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 180,
          linkedObjectIds: ["brx-runoff", "B-GSD", "sc-runoff", "sc-packet"],
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
            "Update the opportunity and claim boundary. Recommend advance, revise, or pause. Name what the data cannot support.",
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
          linkedObjectIds: ["B-ISI", "stk-city", "sc-decision", "sc-packet", MVRC_OBJECT_ID],
        },
        {
          id: "act-reflect",
          title: "Individual investigation memo",
          instructions:
            "Each student writes what the evidence can and cannot support, and one protocol change they would make next time.",
          discoveryMode: "instructor_provided",
          grouping: "individual",
          estimatedMinutes: 45,
          linkedObjectIds: ["H-CON-IMP", "brx-runoff", "imp-learning"],
        },
      ],
    },
  ],
  findings: [],
  createdAt,
  updatedAt: createdAt,
};

export const EXAMPLE_DESIGN: EmcureDesign = applyAlignment(
  withExportSurfaces(EXAMPLE_CORE, {
    cardAuthor: "Jordan Hale, Department of Civil Engineering",
    cardAcknowledgments:
      "Public-works liaison and community contact who scheduled site access. Neighborhood residents are not named in student products.",
    cardSubCategory: "Hydrology / green infrastructure",
    cardReferences:
      "City complaint summaries (internal); vendor bioswale concept drawing; course fluid-mechanics notes.",
    rubricTitle: "Stormwater EM-CURE rubric",
    rubricFacultyNotes:
      "Do not grade stakeholder satisfaction. A finding of no meaningful peak reduction can still be Exemplary if the packet is complete and bounded.",
    facultyHandout: {
      id: "doc-faculty-notes",
      title: "Faculty partner-briefing notes",
      filename: "faculty-partner-briefing-notes.md",
      body: [
        "# Faculty notes (not for the student companion)",
        "",
        "The liaison has agreed to two meetings and a go/revise/pause conversation, not a design review.",
        "Keep household identifiers out of shared notes. Analysis prompts on the evidence page stay discovery-reserved.",
      ].join("\n"),
      notes: "Instructor-only. Excluded from the student package.",
    },
  }),
);
