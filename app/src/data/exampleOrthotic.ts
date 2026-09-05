import { applyAlignment } from "../domain/alignment";
import { MVRC_OBJECT_ID, SCHEMA_VERSION, type EmcureDesign } from "../domain/types";
import { withExportSurfaces } from "./exportSurfaces";

const createdAt = "2026-08-01T12:00:00.000Z";

/** Lab reliability specimen: Instron + humidity/soak, no patient contact this term. */
const ORTHOTIC_CORE: EmcureDesign = {
  schemaVersion: SCHEMA_VERSION,
  id: "example-orthotic-emcure",
  title: "3D-printed orthotic materials under wet conditions",
  status: "draft",
  frameworkMode: "both",
  frameworkSelections: [
    {
      id: "sel-exp",
      frameworkItemId: "H-CUR-EXP",
      scopeType: "course",
      scopeId: "example-orthotic-emcure",
      priority: "primary",
      localInterpretation:
        "Experimentation here means a conditioned Instron campaign, not iterating the device on a person. Coupons and one representative geometry are the experiment.",
    },
    {
      id: "sel-rsk",
      frameworkItemId: "H-CON-RSK",
      scopeType: "course",
      scopeId: "example-orthotic-emcure",
      priority: "primary",
      localInterpretation:
        "Risk is mechanical reliability after water uptake, not clinical harm this term. Students name what a wet-weak material would do to a spec, not to a patient's gait.",
    },
    {
      id: "sel-per",
      frameworkItemId: "H-VAL-PER",
      scopeType: "course",
      scopeId: "example-orthotic-emcure",
      priority: "supporting",
      localInterpretation:
        "Failed prints, missed soak intervals, and Instron slip are expected. Persistence is a complete conditioned dataset, not a pretty first print.",
    },
    {
      id: "sel-lff",
      frameworkItemId: "B-LFF",
      scopeType: "course",
      scopeId: "example-orthotic-emcure",
      priority: "primary",
      localInterpretation:
        "A material that loses strength after soak is a successful investigation if the failure is documented well enough to change the spec.",
    },
    {
      id: "sel-gsd",
      frameworkItemId: "B-GSD",
      scopeType: "course",
      scopeId: "example-orthotic-emcure",
      priority: "primary",
      localInterpretation:
        "Supporting and refuting data are dry versus humidity-conditioned versus liquid-soaked Instron curves on the same print settings.",
    },
    {
      id: "sel-int",
      frameworkItemId: "B-INT",
      scopeType: "course",
      scopeId: "example-orthotic-emcure",
      priority: "primary",
      localInterpretation:
        "Students integrate mass-gain, dimensional swell, and modulus/strength retention into one spec recommendation the clinic can accept or reject.",
    },
  ],
  courseProfile: {
    title: "3D-printed orthotic materials under wet conditions",
    code: "BME 422",
    discipline: "Biomedical engineering",
    level: "Senior",
    enrollment: 16,
    teamSize: 2,
    durationWeeks: 10,
    meetingPattern: "Lecture plus one three-hour lab",
    prerequisites: "Mechanics of materials; introductory biomaterials",
    autonomyLevel: "mixed",
    technicalObjectives:
      "Students will condition 3D-printed coupons and a representative orthotic geometry for humidity and liquid water, test them on an Instron, and recommend whether a candidate material and print process belong in the clinic spec.",
  },
  projectSituation:
    "A campus clinic wants to 3D-print custom ankle-foot orthotic shells in-house. The prosthetist has two candidate filaments and a draft geometry. Users will sweat in the device and sometimes get it wet. The clinic will not put student prints on patients this term. The lab has an Instron, a humidity chamber, and a soak bath. The lab manager schedules machine time in pairs.",
  lineOfSightStatement:
    "We are investigating whether water uptake from humidity and liquid water degrades the mechanical reliability of candidate 3D-printed orthotic materials enough to change the clinic's material and process spec. That uncertainty affects whether in-house printed shells can become a clinic offering instead of an outsourced product. The evidence is a conditioned Instron dataset and a spec memo. Patient function and a clinical trial are beyond this module.",
  currentBigRedXId: "brx-water",
  minimumViableResearchContribution: {
    statement:
      "Students produce a conditioned mechanical dataset (dry, humidity, liquid soak) for at least two print materials or orientations, and a spec memo the prosthetist can accept, revise, or reject.",
    deliverables: [
      "Instron curves and mass/dimension change for dry, humidity-conditioned, and liquid-soaked coupons",
      "A one-page spec recommendation that names remaining uncertainty and does not claim patient outcomes",
    ],
    studentFacingStatement:
      "Your pair's minimum contribution is a usable conditioned dataset and a spec memo: does water uptake change these printed materials enough that the clinic should keep, change, or drop them? Gait, comfort, and clinical trials are beyond this course.",
  },
  stakeholders: [
    {
      id: "stk-prosthetist",
      name: "Clinic prosthetist",
      group: "Campus clinic",
      roles: ["decision-maker", "partner", "expert"],
      priority: "primary",
      arena: "external",
      lens: {
        statedInterests: "A material and print process that will not soften or swell when the shell gets damp.",
        underlyingValues: "Do not put an unproven in-house print on a patient.",
        powerOver: "Accepts, revises, or rejects the student spec for in-house printing.",
        powerWith: "Two lab visits and the draft geometry; no patient list will be shared.",
        immediateImpact: "Time to review a memo; risk of treating student data as a cleared device.",
        longerTermImpact: "If the spec is sound, fewer outsourced shells and a documented wet-condition rule.",
      },
      influence: 5,
      interest: 5,
      accessStatus: "Two scheduled visits to the materials lab; email for spec questions. No clinic floor access for students.",
      researchInvolvement:
        "Provides the draft geometry and candidate filaments. Reviews the spec memo. Does not enroll patients in student work.",
      potentialBenefit: "A defensible keep/change/drop decision on in-house filaments.",
      potentialBurden: "Review time; reputational risk if a later patient device is confused with this lab study.",
      evidenceStatus: "supported",
    },
    {
      id: "stk-patient",
      name: "Orthotic users (not enrolled this term)",
      group: "Intended beneficiaries",
      roles: ["beneficiary", "need-holder", "affected party"],
      priority: "secondary",
      arena: "external",
      lens: {
        statedInterests: "A shell that still holds shape after sweat and rain.",
        underlyingValues: "Trust that a custom device will not fail quietly when it gets wet.",
        powerOver: "None in this module. They are not research participants.",
        powerWith: "None this term. No interviews, photos, or on-body tests.",
        immediateImpact: "None. Students do not contact users.",
        longerTermImpact: "If the clinic later adopts a wet-conditioned spec, future users may get a more reliable shell.",
      },
      influence: 1,
      interest: 5,
      accessStatus: "No student contact. Do not recruit, observe, or instrument users this term.",
      researchInvolvement:
        "Not participants. The need is inferred from the prosthetist's description of sweat and incidental wetting.",
      potentialBenefit: "Possible later reliability if the clinic adopts the spec.",
      potentialBurden: "None this term, provided students do not attempt informal on-body tests.",
      evidenceStatus: "anecdotal",
    },
    {
      id: "stk-lab",
      name: "Instron lab manager",
      group: "Teaching labs",
      roles: ["implementer", "expert"],
      priority: "secondary",
      arena: "internal",
      lens: {
        statedInterests: "Safe, scheduled use of the Instron, humidity chamber, and soak bath.",
        underlyingValues: "Machine time is shared; broken fixtures delay every section.",
        powerOver: "Grants or withholds Instron slots and can stop an unsafe soak setup.",
        powerWith: "Knows fixture history and which print orientations have slipped before.",
        immediateImpact: "Training time and fixture wear.",
        longerTermImpact: "A repeatable conditioning protocol other BME modules can reuse.",
      },
      influence: 4,
      interest: 3,
      accessStatus: "Paired lab slots on the posted Instron calendar. Humidity chamber overnight only with a signed log.",
      researchInvolvement:
        "Trains pairs on the Instron, checks soak-bath setup, and logs overnight humidity runs.",
      potentialBenefit: "A written protocol that reduces one-off machine questions.",
      potentialBurden: "After-hours humidity runs and failed-print waste in the lab.",
      evidenceStatus: "supported",
    },
  ],
  needs: [
    {
      id: "need-wet",
      statement:
        "People who would wear the shell need it to stay mechanically reliable when it picks up sweat or gets wet, not only when it is tested dry as printed.",
      context:
        "The prosthetist reports that outsourced shells are specified dry. In-house prints would live in shoes. Users are not available as participants this term, so the need is represented by wet-conditioned mechanical tests, not by wear trials.",
      stakeholderIds: ["stk-patient", "stk-prosthetist"],
      currentCondition:
        "Candidate filaments have vendor dry-property sheets. There is no in-house record of strength or dimension after humidity or liquid soak.",
      evidenceNotes:
        "Prosthetist description of sweat and incidental wetting. No user interviews. Vendor datasheets are dry-only.",
      evidenceStatus: "anecdotal",
    },
    {
      id: "need-spec",
      statement:
        "The clinic needs a keep, change, or drop memo for in-house filaments that a prosthetist can defend: conditioned Instron evidence, swell, and named remaining uncertainty.",
      context:
        "The clinic will not start in-house printing on a vendor PDF. Two candidate filaments and one draft geometry are already chosen. Insurance and a clinical trial are not this module's decision.",
      stakeholderIds: ["stk-prosthetist"],
      currentCondition:
        "Draft geometry and two spools on the bench. No written wet-condition spec. No student-generated mechanical dataset.",
      evidenceNotes:
        "Email confirming two lab visits and that the expected student product is a spec memo, not a fitted device.",
      evidenceStatus: "supported",
    },
  ],
  opportunities: [
    {
      id: "opp-material",
      statement:
        "The clinic could launch an in-house 3D-printed ankle-foot orthotic shell as a new service line, replacing outsourced fabrication, if a print process holds up to sweat and incidental wetting.",
      needIds: ["need-wet", "need-spec"],
      stakeholderIds: ["stk-prosthetist", "stk-patient"],
      valueCreated:
        "Faster turnaround and clinic-controlled geometry at lower cost per shell. A future product patients could receive after a spec exists. This term does not put a student print on a person.",
      evidenceStatus: "assumption",
    },
  ],
  intendedImpacts: [
    {
      id: "imp-dataset",
      statement:
        "The course produces a dry versus humidity versus liquid-soak mechanical dataset for the candidate print settings.",
      category: "technical",
      opportunityIds: ["opp-material"],
      stakeholderIds: ["stk-prosthetist", "stk-lab"],
      mechanism:
        "Pairs condition coupons, run Instron tests, and log mass and dimension change.",
      indicator: "Complete matrix: two materials or orientations, three conditions, Instron plus mass/dimension.",
      timeframe: "This 10-week module.",
      claimLevel: "output",
      claimBoundary:
        "This is a laboratory dataset. It is not evidence of patient function, comfort, or safety in use.",
    },
    {
      id: "imp-spec",
      statement:
        "The prosthetist can keep, change, or drop an in-house filament based on whether water uptake changes reliability enough to matter for the spec.",
      category: "organizational",
      opportunityIds: ["opp-material"],
      stakeholderIds: ["stk-prosthetist"],
      mechanism:
        "The pair delivers a one-page memo that the prosthetist marks accept, revise, or reject in the second lab visit.",
      indicator: "Written keep/change/drop action on the memo.",
      timeframe: "By the last lab meeting of the module.",
      claimLevel: "outcome",
      claimBoundary:
        "The outcome is a clinic spec decision. It is not a claim that patients walk better or that the device is cleared.",
    },
  ],
  successCriteria: [
    {
      id: "sc-retention",
      statement:
        "Mechanical reliability after water uptake is measured clearly enough to inform a keep/change/drop spec decision.",
      metric: "Retention of elastic modulus and peak load versus dry controls after humidity and after liquid soak",
      baseline: "Dry-as-printed coupons from the same print job and orientation",
      targetOrThreshold:
        "A documented retention percentage the prosthetist judges large enough to change the spec, or a clear finding of no meaningful change. Either result counts.",
      unit: "% retention of modulus and peak load",
      evidenceSource: "Instron load-displacement files and a written comparison table",
      linkedObjectIds: ["opp-material", "imp-dataset", "brx-water", "need-wet"],
    },
    {
      id: "sc-swell",
      statement: "Dimensional change after humidity and liquid soak is measured on coupons and on the representative geometry.",
      metric: "Percent change in mass and in critical thickness or length",
      baseline: "As-printed mass and caliper dimensions before conditioning",
      targetOrThreshold:
        "Swell reported with the same conditions as the Instron set, including a note if the geometry warps enough to miss a fixture.",
      unit: "% mass change; % linear change",
      evidenceSource: "Balance and caliper log, photos of the representative geometry",
      linkedObjectIds: ["brx-water", "imp-dataset", "need-wet"],
    },
    {
      id: "sc-memo",
      statement: "The clinic can act on a spec memo that does not claim patient outcomes.",
      metric: "Prosthetist marks accept, revise, or reject and names a next material or process action",
      baseline: "No in-house wet-condition spec exists",
      targetOrThreshold: "Memo includes the conditioned dataset summary, remaining uncertainty, and an explicit non-clinical claim boundary",
      unit: "accept / revise / reject plus recorded next action",
      evidenceSource: "Signed memo from the second clinic visit",
      linkedObjectIds: ["opp-material", "stk-prosthetist", "need-spec", MVRC_OBJECT_ID],
    },
  ],
  uncertainties: [
    {
      id: "brx-water",
      type: "unknown",
      statement:
        "Whether water uptake from humidity and liquid water degrades 3D-printed orthotic materials enough to change the clinic's design spec.",
      scores: {
        influenceOnOpportunity: 5,
        influenceOnImpact: 5,
        uncertainty: 4,
        investigability: 5,
        courseFeasibility: 4,
      },
      linkedImpactIds: ["imp-dataset", "imp-spec"],
      linkedSuccessCriterionIds: ["sc-retention", "sc-swell", "sc-memo"],
      decisionIfResolved:
        "Whether the clinic should keep, change, or drop these filaments for in-house shells.",
      rationale:
        "If wet-conditioned strength and swell are acceptable, an in-house printed-shell service can proceed on that spec. If not, that offering is not viable with these materials. Pairs can test it on the Instron in ten weeks without enrolling patients.",
      designation: "primary_big_red_x",
    },
    {
      id: "unc-orient",
      type: "unknown",
      statement: "Whether print orientation (anisotropy) dominates water-related loss of reliability.",
      scores: {
        influenceOnOpportunity: 3,
        influenceOnImpact: 3,
        uncertainty: 3,
        investigability: 4,
        courseFeasibility: 4,
      },
      linkedImpactIds: ["imp-dataset"],
      linkedSuccessCriterionIds: ["sc-retention"],
      decisionIfResolved:
        "Whether the spec must lock a print orientation or can treat orientation as a later process detail.",
      rationale:
        "Orientation can confound soak results. It is secondary because the clinic's first question is wet versus dry, not which way the layers run.",
      designation: "secondary",
    },
    {
      id: "unc-dry",
      type: "assumption",
      statement: "Vendor datasheets assume dry-as-printed properties represent in-use shells.",
      scores: {
        influenceOnOpportunity: 4,
        influenceOnImpact: 4,
        uncertainty: 4,
        investigability: 5,
        courseFeasibility: 5,
      },
      linkedImpactIds: ["imp-spec"],
      linkedSuccessCriterionIds: ["sc-retention"],
      decisionIfResolved:
        "Whether the team treats the vendor PDF as the spec or as a hypothesis to test after conditioning.",
      rationale:
        "This assumption is why the Big Red X exists. It stays a candidate so students can name it without confusing it with the wet-reliability question.",
      designation: "candidate",
    },
    {
      id: "unc-trial",
      type: "unknown",
      statement: "Whether a wet-conditioned shell would change gait or comfort in a clinical trial, or whether insurers would pay for in-house prints.",
      scores: {
        influenceOnOpportunity: 5,
        influenceOnImpact: 5,
        uncertainty: 5,
        investigability: 1,
        courseFeasibility: 1,
      },
      linkedImpactIds: ["imp-spec"],
      linkedSuccessCriterionIds: [],
      decisionIfResolved: "Not a decision this module can inform.",
      rationale:
        "Consequential, but this course has no IRB protocol, no gait lab, and no billing authority. Out of scope so it does not swallow the Instron campaign.",
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
          id: "act-clinic",
          title: "Prosthetist visit and geometry handoff",
          instructions:
            "Meet the prosthetist in the materials lab, not the clinic floor. Record the two candidate filaments, the draft geometry, and the wet-use story. Confirm that students will not contact users or print for wear this term.",
          discoveryMode: "instructor_provided",
          grouping: "whole_class",
          estimatedMinutes: 90,
          linkedObjectIds: ["H-CON-RSK", "need-spec", "need-wet", "stk-prosthetist"],
        },
      ],
    },
    {
      id: "ph-stakeholders",
      title: "Engage stakeholders",
      order: 1,
      activities: [
        {
          id: "act-lab-train",
          title: "Instron and conditioning training",
          instructions:
            "Complete lab-manager training on the Instron, humidity chamber, and soak bath. Log overnight humidity rules. Do not invent a patient interview protocol.",
          discoveryMode: "instructor_provided",
          grouping: "team",
          estimatedMinutes: 120,
          linkedObjectIds: ["stk-lab", "H-CUR-EXP", "B-GSD"],
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
          title: "Bound the reliability question",
          instructions:
            "Write the wet-reliability need, the spec need, one opportunity (a possible new clinic offering, not the Instron campaign), an output claim for the dataset, and an outcome claim for the clinic decision. State that patient function is out of scope.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 75,
          linkedObjectIds: ["B-INT", "opp-material", "imp-dataset", "imp-spec", "need-wet", "need-spec"],
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
          title: "Write Instron and swell criteria",
          instructions:
            "Define retention of modulus and peak load after humidity and after liquid soak, swell limits you will report, and what makes the spec memo usable. Include dry controls from the same print job.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 60,
          linkedObjectIds: ["sc-retention", "sc-swell", "sc-memo", "opp-material"],
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
          title: "Separate wet reliability from a clinical trial",
          instructions:
            "Score water uptake, print orientation, the dry-datasheet assumption, and a clinical trial. Mark gait, comfort, and reimbursement out of scope. Write why wet reliability is the Big Red X.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 60,
          linkedObjectIds: ["brx-water", "H-CON-RSK", "unc-orient", "unc-dry", "unc-trial"],
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
          title: "Conditioning and Instron protocol",
          instructions:
            "Specify print settings, coupon geometry, humidity versus liquid-soak times, Instron fixture, and what you will do if a soak warps the sample off the fixture. Include a disconfirming plan: no meaningful wet change is a valid result.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 150,
          linkedObjectIds: ["brx-water", "B-GSD", "sc-retention", "sc-swell", MVRC_OBJECT_ID],
        },
        {
          id: "act-run",
          title: "Print, condition, and test",
          instructions:
            "Print coupons and the representative geometry. Run dry, humidity, and liquid-soak legs. Record mass, dimensions, and Instron files. Log failed prints and missed soak intervals.",
          discoveryMode: "mixed",
          grouping: "team",
          estimatedMinutes: 240,
          linkedObjectIds: ["brx-water", "H-CUR-EXP", "H-VAL-PER", "B-LFF", "sc-retention", "sc-swell"],
        },
      ],
    },
    {
      id: "ph-evidence",
      title: "Generate evidence, interpret, and decide",
      order: 6,
      activities: [
        {
          id: "act-read",
          title: "Read the soak-Instron interaction",
          instructions:
            "Decide which failure mode the soak and Instron data actually support: plasticization, swell-driven fixture miss, print-orientation cracking, or no meaningful wet change. Do not upgrade the claim to patient function.",
          discoveryMode: "student_discovered",
          grouping: "team",
          estimatedMinutes: 120,
          linkedObjectIds: [
            "brx-water",
            "opp-material",
            "imp-dataset",
            "B-INT",
            "B-GSD",
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
          id: "act-memo",
          title: "Spec memo with the prosthetist",
          instructions:
            "Deliver a one-page keep/change/drop memo. Separate laboratory evidence from any future clinical question. Ask the prosthetist to mark accept, revise, or reject.",
          discoveryMode: "instructor_provided",
          grouping: "team",
          estimatedMinutes: 60,
          linkedObjectIds: ["B-INT", "stk-prosthetist", "sc-memo", MVRC_OBJECT_ID, "imp-spec"],
        },
        {
          id: "act-reflect",
          title: "Individual failure-and-limit memo",
          instructions:
            "Each student names one failed print or missed interval, what it did to the dataset, and one claim the pair must not make about patients.",
          discoveryMode: "instructor_provided",
          grouping: "individual",
          estimatedMinutes: 40,
          linkedObjectIds: ["B-LFF", "H-VAL-PER", "brx-water"],
        },
      ],
    },
  ],
  findings: [],
  createdAt,
  updatedAt: createdAt,
};

export const ORTHOTIC_EXAMPLE: EmcureDesign = applyAlignment(
  withExportSurfaces(ORTHOTIC_CORE, {
    cardAuthor: "Amina Ortiz, Department of Biomedical Engineering",
    cardAcknowledgments:
      "Campus clinic prosthetist who provided geometry and filaments. Orthotic users are not named and were not enrolled. Lab manager who scheduled the Instron.",
    cardSubCategory: "Biomaterials / additive manufacturing",
    cardReferences:
      "Vendor dry-property sheets (internal); clinic draft geometry; ASTM-inspired coupon notes used in the teaching lab (not a full standard method).",
    rubricTitle: "Orthotic materials EM-CURE rubric",
    rubricFacultyNotes:
      "Do not grade clinic satisfaction. A finding of no meaningful wet degradation can still be Exemplary if the conditioned dataset is complete and bounded. Never grade imagined patient outcomes.",
    facultyHandout: {
      id: "doc-orthotic-faculty",
      title: "Faculty lab and clinic notes",
      filename: "faculty-orthotic-lab-notes.md",
      body: [
        "# Faculty notes (not for the student companion)",
        "",
        "Students do not enter the clinic floor and do not contact users.",
        "The prosthetist visits the materials lab twice. Soak/Instron interpretation stays discovery-reserved.",
      ].join("\n"),
      notes: "Instructor-only. Excluded from the student package.",
    },
  }),
);
