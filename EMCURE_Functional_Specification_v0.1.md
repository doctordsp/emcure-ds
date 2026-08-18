# EMCURE Design Studio
## Functional Specification — Version 0.1

**Status:** Working specification for prototype and MVP development  
**Primary audience:** Product team, faculty design partners, UX designers, and AI-assisted software developers  
**Product type:** Faculty-facing HTML/CSS/JavaScript web application  
**Prepared:** August 18, 2026  

---

## 1. Executive summary

EMCURE Design Studio helps engineering faculty convert an authentic research context into a coherent, teachable, and assessable entrepreneurially minded course-based undergraduate research experience (EMCURE).

The product's distinctive purpose is to preserve a visible line of sight from **stakeholder need** to **opportunity**, **intended impact**, **definition of success**, **Big Red X**, **research activity**, **evidence**, and **decision or next action**. It also connects selected **Habits of Entrepreneurial Mindset (EM)** and/or **Observable Behaviors of EM** to learning objectives, student activities, deliverables, evidence, and assessment.

The application is a guided course-design studio. It is not intended to replace a learning management system, electronic research notebook, statistical package, or faculty judgment.

### Core product promise

> Help faculty design an undergraduate research experience in which students can see—and demonstrate—how technical work connects to opportunity and impact.

### Primary differentiator

The application maintains an interactive **Opportunity-to-Impact Thread** and checks it for missing, weak, or contradictory links:

```text
Situation → Need → Opportunity → Intended Impact → Success → Big Red X
          → Research Question → Investigation → Evidence → Decision → Next Impact Step
```

The product succeeds when a faculty member can move from an early project idea to an exportable EMCURE implementation package with substantially less design effort and greater confidence in alignment.

---

## 2. Product principles

1. **Opportunity and impact are structural.** They recur throughout the experience rather than appearing only in an introduction or final reflection.
2. **Technical work needs a reason.** Every major investigation should connect to a consequential uncertainty and a decision it can inform.
3. **The Big Red X is consequential, not merely difficult.** It is the uncertainty, barrier, or assumption whose resolution most affects whether an opportunity can produce intended impact.
4. **Habits and behaviors are different objects.** Habits describe broader patterns of thinking and practice; observable behaviors describe actions through which students can demonstrate those habits.
5. **Faculty retain authorship.** The system prompts, checks, drafts, and suggests. It does not silently make pedagogical or research decisions.
6. **Authenticity requires bounded ambiguity.** The product should help preserve genuine uncertainty while making the work feasible for undergraduates.
7. **Assessment should use authentic evidence.** Student products and decisions should supplement reflection and self-report.
8. **Claims about impact must be bounded.** The interface must distinguish research output, research outcome, potential impact, and demonstrated impact.
9. **The first release should solve one coherent problem.** The MVP centers on faculty course design and export, not full course delivery.
10. **Accessibility is a core requirement.** Color, typography, keyboard behavior, and generated materials must meet WCAG 2.2 AA expectations.

---

## 3. Goals and success measures

### 3.1 Product goals

- Guide faculty through the intellectual and operational design of an EMCURE.
- Make opportunity and impact explicit, revisitable, and traceable.
- Allow selection of Habits of EM, Observable Behaviors of EM, both, or a local framework.
- Translate framework selections into learning objectives, practice opportunities, evidence, and assessment.
- Help faculty identify and justify a Big Red X.
- Detect missing alignment and unrealistic scope before course launch.
- Generate editable materials for faculty, students, stakeholders, and assessment partners.
- Preserve course designs for reuse, revision, and sharing.

### 3.2 MVP success measures

- At least 80% of pilot faculty complete an initial course design without product-team intervention.
- Median time to produce a first complete EMCURE design is reduced relative to an unassisted baseline established during discovery.
- At least 80% of exported designs contain a complete need-to-decision trace.
- At least 80% of selected EM items connect to a student activity and an evidence source.
- Faculty rate the alignment review as useful and understandable, target mean ≥ 4 on a 5-point scale.
- At least 70% of pilot faculty report that the app helped them see a design gap they would otherwise have missed.
- No critical accessibility failures appear in automated and manual MVP audits.

### 3.3 Non-goals for MVP

- Replacing the institution's LMS.
- Hosting laboratory data or serving as an electronic lab notebook.
- Performing statistical analysis, simulation, or computer-aided design.
- Automatically grading nuanced student work.
- Managing large external stakeholder databases.
- Providing authoritative safety, IRB, intellectual-property, or legal approval.
- Proving that long-term impact occurred.
- Supporting student accounts and real-time course delivery in the first release.

---

## 4. Users and roles

### 4.1 Primary persona: faculty designer

An engineering faculty member who knows the disciplinary content but may have limited experience designing CUREs, entrepreneurially minded learning, stakeholder engagement, or aligned assessment.

**Needs:**

- A clear design path.
- Examples without losing control of the course.
- Help limiting scope.
- Reusable language and templates.
- Confidence that technical and EM objectives align.
- A way to explain the design to collaborators, reviewers, and students.

### 4.2 Secondary personas

**EMCURE coach or instructional designer** — reviews designs, comments, and supports faculty development.

**Project/stakeholder liaison** — helps clarify project context, stakeholder availability, constraints, and communication expectations.

**Assessment or SoTL partner** — reviews learning objectives, evidence, instruments, and course-level evaluation plans.

**Program administrator** — views portfolio-level status and aggregate metadata in a later release.

### 4.3 Roles and permissions

| Role | MVP permissions |
|---|---|
| Owner | Create, edit, archive, duplicate, export, invite reviewers |
| Editor | Edit all design content and resolve review findings |
| Reviewer | Read, comment, and suggest; cannot overwrite owner content |
| Viewer | Read-only access and export if allowed by owner |
| Student or student team | View released project content; complete assigned activities; maintain evidence and decisions; receive feedback; cannot see faculty-only notes, hidden discovery content, or other teams' private work |

The recommended product model is one system with two role-based experiences: a **Faculty Design Studio** and a **Student Project Workspace**. An authenticated student workspace is out of scope for the minimum faculty-design MVP, but a generated, student-facing companion HTML package is in scope. The shared data model must support a later interactive workspace without rebuilding the course design.

---

## 5. End-to-end faculty workflow

### 5.1 Create a design

The faculty member creates an EMCURE and provides a minimal course profile. The system saves a draft immediately and shows the design roadmap.

### 5.2 Choose the EM framework

The user selects:

- Habits of EM only;
- Observable Behaviors of EM only;
- both Habits and Observable Behaviors; or
- a custom/institutional framework.

The user then chooses a deliberately limited set of priorities. The system warns about excessive coverage but does not block progress.

### 5.3 Describe the project context

The user documents the situation, known stakeholders, current solutions, constraints, resources, and uncertainty. The system identifies unanswered questions and project-readiness risks.

### 5.4 Build the Opportunity-to-Impact Thread

The user develops the need, opportunity, intended impact, success criteria, critical assumptions, and line-of-sight statement.

### 5.5 Prioritize the Big Red X

The user records candidate uncertainties, compares them using explicit criteria, selects a primary Big Red X, and states which decision could change if it is resolved.

### 5.6 Design the student journey

The user creates phases, activities, milestones, deliverables, feedback points, stakeholder touchpoints, and assessments. Each can be connected to technical objectives, EM habits or behaviors, opportunity, impact, and the Big Red X.

### 5.7 Review alignment and feasibility

The system presents findings with evidence, severity, and suggested next actions. The user resolves, dismisses with a reason, or defers each finding.

### 5.8 Export an implementation package

The user previews and exports selected materials in Markdown, DOCX, PDF, JSON, and printable HTML where supported.

### 5.9 Revisit after implementation

In a later release, the user records what happened, compares planned and observed results, and creates the next course version.

### 5.10 Release to students

The faculty member chooses which course version and content are released. For the initial release, the system generates a responsive companion HTML package containing the project brief, visible roadmap, activities, templates, and opportunity–impact prompts. In a later release, students or teams use an authenticated workspace to submit evidence, revise claims, record decisions, and receive feedback. Publication must never reveal faculty-only notes or content intentionally reserved for student discovery.

---

## 6. Information architecture and navigation

### 6.1 Primary navigation

```text
Home / EMCURE Dashboard
├── My EMCUREs
├── Templates and Examples
├── EM Framework Library
└── Settings

EMCURE Workspace
├── 1. Course Profile
├── 2. EM Framework
├── 3. Project Context
├── 4. Stakeholders and Need
├── 5. Opportunity and Impact
├── 6. Success Criteria
├── 7. Big Red X
├── 8. Student Journey
├── 9. Operations
├── 10. Assessment
├── 11. Alignment Review
└── 12. Export
```

### 6.2 Persistent workspace elements

- EMCURE title and status.
- Save status and last-saved time.
- Overall readiness indicator.
- Opportunity-to-Impact Thread.
- Section completion states.
- Open alignment findings.
- Comments/review activity.
- Contextual help and examples.

### 6.3 Progress behavior

Progress is based on required decisions and connected data, not on page visits. A section may be:

- Not started.
- In progress.
- Ready for review.
- Has unresolved findings.
- Complete.

The app must allow non-linear navigation; faculty often discover information out of sequence.

---

## 7. Functional requirements

### 7.1 Authentication and workspace

**FR-AUTH-001** The system shall allow a user to create an account, sign in, sign out, and reset credentials.  
**FR-AUTH-002** The system shall support institution-managed single sign-on in a post-MVP release.  
**FR-AUTH-003** The system shall enforce role-based access at both UI and API/data-policy levels.  
**FR-WS-001** The system shall allow owners to create, rename, duplicate, archive, and restore an EMCURE design.  
**FR-WS-002** The system shall autosave material edits and display save state.  
**FR-WS-003** The system shall retain revision history for at least named versions in MVP.  
**FR-WS-004** The system shall provide an onboarding tour that can be skipped and reopened.

### 7.2 Course profile

**FR-COURSE-001** The system shall capture course title, code, discipline, level, enrollment, team size, duration, meeting pattern, and prerequisites.  
**FR-COURSE-002** The system shall capture technical learning objectives.  
**FR-COURSE-003** The system shall capture available facilities, equipment, software, data, partner access, and staffing.  
**FR-COURSE-004** The system shall capture safety, ethics, accessibility, IP, data, and scheduling constraints.  
**FR-COURSE-005** The system shall capture desired student-autonomy level.  
**FR-COURSE-006** The system shall flag incomplete constraints needed for feasibility review.

### 7.3 EM framework library and selection

**FR-EM-001** The system shall allow a design to use Habits, Observable Behaviors, both, or a custom framework.  
**FR-EM-002** The system shall provide searchable and filterable libraries.  
**FR-EM-003** Every framework record shall retain name, definition, examples, type, source, provenance, and version.  
**FR-EM-004** The system shall support many-to-many relationships between habits and observable behaviors.  
**FR-EM-005** The system shall permit selection at course, phase, project, activity, and assessment levels.  
**FR-EM-006** The system shall distinguish canonical content from local customization.  
**FR-EM-007** Users shall be able to create a local behavior without altering the source framework.  
**FR-EM-008** The system shall allow authorized administrators to import versioned framework records from structured JSON or CSV.  
**FR-EM-009** The system shall warn when the number of selected priorities appears infeasible for the course duration.  
**FR-EM-010** The system shall show whether each selected item is introduced, practiced, evidenced, and assessed.  
**FR-EM-011** AI suggestions shall use the framework version selected by the user and identify the framework items informing the suggestion.  
**FR-EM-012** The system shall preserve the selected framework version when an EMCURE is duplicated or exported.  
**FR-EM-013** The system shall permit deliberate framework upgrades through a comparison-and-confirmation workflow; it shall not silently replace terminology.  
**FR-EM-014** The system shall filter framework items by opportunity, impact, course phase, activity type, and selected/unselected status when those metadata are available.

### 7.4 Project context and readiness

**FR-PROJ-001** The system shall capture the problem situation, project source, current evidence, existing solutions, limitations, resources, and constraints.  
**FR-PROJ-002** The system shall capture what is known, assumed, uncertain, and intentionally left for students to discover.  
**FR-PROJ-003** The system shall evaluate project readiness across authenticity, technical fit, opportunity visibility, impact visibility, stakeholder access, undergraduate feasibility, semester feasibility, safety, ethics, and resource access.  
**FR-PROJ-004** Readiness findings shall be advisory and shall show their basis.  
**FR-PROJ-005** Users shall be able to resolve, dismiss with rationale, or defer a readiness finding.

### 7.5 Stakeholders and need

**FR-STK-001** The system shall allow creation of stakeholder records and stakeholder groups.  
**FR-STK-002** Each stakeholder may be marked as need-holder, beneficiary, decision-maker, implementer, funder, expert, partner, affected party, or another user-defined role.  
**FR-STK-003** The system shall capture influence, interest, access, engagement method, expected contribution, and possible burden or unintended consequence.  
**FR-STK-004** The system shall support a need statement with evidence, context, affected population, and current-condition fields.  
**FR-STK-005** The system shall distinguish evidence from faculty or student assumptions.  
**FR-STK-006** The system shall support stakeholder-engagement plans and expected touchpoints.

### 7.6 Opportunity and impact

**FR-OI-001** The system shall support one or more opportunity statements linked to needs and stakeholders.  
**FR-OI-002** The system shall support one or more intended impacts linked to opportunities and stakeholders.  
**FR-OI-003** Impact records shall be categorized as technical, human, economic, environmental, organizational, scientific, educational, societal, or custom.  
**FR-OI-004** Impact records shall distinguish output, outcome, potential impact, and demonstrated impact.  
**FR-OI-005** The system shall capture beneficiaries, potentially burdened groups, timeframe, mechanism, indicator, evidence status, and claim boundary.  
**FR-OI-006** The system shall help the user construct and edit a line-of-sight statement.  
**FR-OI-007** The system shall visualize connections among need, opportunity, impact, success, Big Red X, investigation, evidence, and decision.  
**FR-OI-008** The system shall warn when an impact claim lacks a stakeholder, mechanism, indicator, or appropriate claim boundary.  
**FR-OI-009** The system shall allow opportunity and impact to be revised while preserving change history.

### 7.7 Definition of success

**FR-SUCCESS-001** The system shall allow measurable success criteria to be linked to needs, opportunities, impacts, and stakeholders.  
**FR-SUCCESS-002** Each criterion shall include metric, target or decision threshold, current baseline if known, unit, evidence source, timeframe, and constraint/tradeoff notes.  
**FR-SUCCESS-003** The system shall distinguish technical performance requirements from broader value and impact criteria.  
**FR-SUCCESS-004** The system shall flag criteria that are vague, non-measurable, or unsupported by a planned evidence source.

### 7.8 Assumptions, uncertainties, and Big Red X

**FR-BRX-001** The system shall allow users to record assumptions, barriers, performance gaps, and unknowns.  
**FR-BRX-002** Candidate uncertainties shall be scored or comparatively ranked using influence on opportunity, influence on impact, uncertainty, consequence of error, stakeholder importance, investigability, and course feasibility.  
**FR-BRX-003** Users shall be able to customize criteria and weights while preserving the original values.  
**FR-BRX-004** The system shall support selection of a primary Big Red X and secondary uncertainties.  
**FR-BRX-005** Selection shall require a written rationale and a statement of the decision that could change.  
**FR-BRX-006** The system shall support different Big Red X assignments for different teams under one course design.  
**FR-BRX-007** The system shall show which success criteria and intended impacts depend on each candidate.  
**FR-BRX-008** Changing the primary Big Red X shall trigger an alignment recheck without deleting existing research plans.  
**FR-BRX-009** The system shall record the reason and date for a Big Red X change.

### 7.9 Student journey and research activities

**FR-JOURNEY-001** The system shall support ordered phases, milestones, activities, deliverables, and feedback gates.  
**FR-JOURNEY-002** The system shall include an editable starter sequence: understand situation, engage stakeholders, study current solutions, define need, articulate opportunity, define impact, define success, prioritize uncertainties, select Big Red X, plan investigation, generate evidence, interpret, decide, communicate, and reflect.  
**FR-JOURNEY-003** Each activity shall include instructions, learner grouping, estimated effort, schedule, inputs, outputs, feedback source, and visibility.  
**FR-JOURNEY-004** Each activity may link to technical objectives, habits, behaviors, opportunities, impacts, success criteria, uncertainties, and assessments.  
**FR-JOURNEY-005** The system shall support instructor-provided, student-discovered, and mixed-discovery fields.  
**FR-JOURNEY-006** The system shall display a calendar/timeline and detect overloaded periods.  
**FR-JOURNEY-007** The system shall allow templates to be inserted and edited without overwriting local content.  
**FR-JOURNEY-008** The system shall support stakeholder feedback points and faculty approval gates.

### 7.9A Student companion and workspace

**FR-STUDENT-001** The system shall generate a responsive, accessible student companion HTML experience from a released course-design version.  
**FR-STUDENT-002** Faculty shall preview the student experience before release and see a clear inventory of included, excluded, and hidden content.  
**FR-STUDENT-003** The student home view shall explain the project purpose, stakeholder need, opportunity, intended impact, current Big Red X or faculty-approved framing, milestones, and next action in student-appropriate language.  
**FR-STUDENT-004** Faculty shall configure each field as visible, hidden, revealed on a date or milestone, or intended for student discovery.  
**FR-STUDENT-005** The student experience shall preserve a visible line of sight from each activity to the uncertainty being reduced, the relevant opportunity and impact, the evidence expected, and the decision that evidence may inform.  
**FR-STUDENT-006** The generated companion shall include activity instructions, downloadable templates, reflection prompts, rubrics released to students, stakeholder-engagement guidance, and safety or access requirements.  
**FR-STUDENT-007** The static companion shall work as ordinary hosted HTML/CSS/JavaScript and provide a print-friendly view; it shall not claim to save submissions when no backend is configured.  
**FR-STUDENT-008** In the authenticated workspace, students or teams shall submit evidence, maintain an evidence-and-decision log, revise opportunity and impact claims, request feedback, and view faculty feedback.  
**FR-STUDENT-009** The authenticated workspace shall support individual and team attribution, milestone status, revision history, and faculty-configured team privacy.  
**FR-STUDENT-010** Faculty shall be able to release, revise, pause, and archive a student experience while retaining the exact course-design version from which it was produced.  
**FR-STUDENT-011** Student-visible terminology and guidance shall use framework-approved text where required and distinguish provided content from student-authored interpretation.  
**FR-STUDENT-012** The student experience shall meet the same accessibility, responsive-design, security, and privacy requirements as the faculty experience.

### 7.10 Operations

**FR-OPS-001** The system shall capture team formation, role strategy, role rotation, accountability method, and labor expectations.  
**FR-OPS-002** The system shall capture stakeholder engagement cadence, communication owner, and contingency plan.  
**FR-OPS-003** The system shall capture equipment, space, data, purchasing, training, safety, and access dependencies.  
**FR-OPS-004** The system shall maintain a risk register with likelihood, consequence, mitigation, owner, and status.  
**FR-OPS-005** The system shall display unresolved operational dependencies in readiness review.

### 7.11 Assessment

**FR-ASMT-001** The system shall distinguish student performance, EM learning, and course/SoTL evaluation.  
**FR-ASMT-002** The system shall allow rubric criteria to link to technical objectives, habits, behaviors, activities, and evidence.  
**FR-ASMT-003** The system shall show whether selected EM items are introduced, practiced, evidenced, and assessed.  
**FR-ASMT-004** The system shall warn when an EM item is assessed only through self-report.  
**FR-ASMT-005** The system shall support individual and team evidence.  
**FR-ASMT-006** The system shall support formative and summative assessment.  
**FR-ASMT-007** The system shall capture stakeholder feedback without automatically converting it to a grade.  
**FR-ASMT-008** The system shall permit rubric and prompt export.

### 7.12 Alignment review

**FR-ALIGN-001** The system shall run deterministic alignment rules whenever connected design data change.  
**FR-ALIGN-002** Findings shall include identifier, severity, explanation, affected objects, evidence, and suggested action.  
**FR-ALIGN-003** Findings shall distinguish error, warning, and consideration.  
**FR-ALIGN-004** Users shall be able to navigate from a finding to the affected field.  
**FR-ALIGN-005** Users shall be able to resolve, dismiss with rationale, or defer findings.  
**FR-ALIGN-006** The system shall not reduce the design to a single opaque quality score.  
**FR-ALIGN-007** The system shall generate a human-readable readiness report.  
**FR-ALIGN-008** The review shall include framework coverage, opportunity-impact traceability, research alignment, feasibility, assessment, stakeholder engagement, operations, and claim boundaries.

### 7.13 Collaboration

**FR-COLLAB-001** Owners shall be able to invite editors, reviewers, and viewers.  
**FR-COLLAB-002** Reviewers shall be able to attach comments to specific objects or sections.  
**FR-COLLAB-003** Comments shall support open/resolved status and replies.  
**FR-COLLAB-004** The system shall show recent material changes.  
**FR-COLLAB-005** A later release may support approval workflows and organization-level templates.

### 7.14 Export and interchange

**FR-EXP-001** The system shall produce an export preview before file generation.  
**FR-EXP-002** The system shall export a complete faculty design specification in Markdown and printable HTML in MVP.  
**FR-EXP-003** The system should export DOCX and PDF when the server-side document service is available.  
**FR-EXP-004** The system shall export structured JSON for backup, migration, and AI-assisted development/testing.  
**FR-EXP-005** Users shall choose which student-facing and stakeholder-facing materials to include.  
**FR-EXP-006** Exports shall include framework provenance and versions.  
**FR-EXP-007** Exports shall distinguish canonical framework language from local adaptations.  
**FR-EXP-008** Generated student materials shall exclude faculty-only notes and hidden discovery content.  
**FR-EXP-009** The system shall provide an exportable alignment matrix and open-findings report.

---

## 8. Alignment rule catalog for MVP

Deterministic rules should run before generative AI critique. Each rule must explain the data that triggered it.

| Rule ID | Trigger | Severity | Example message |
|---|---|---|---|
| AL-001 | Selected EM item has no activity | Warning | “Prioritizes consequential uncertainty is selected but never practiced.” |
| AL-002 | Selected EM item has no evidence | Warning | “No student evidence demonstrates this behavior.” |
| AL-003 | Selected EM item is assessed only by self-report | Consideration | “Add authentic performance evidence if feasible.” |
| AL-004 | Activity has no objective or purpose link | Warning | “This activity is not connected to a technical or EM objective.” |
| AL-005 | Investigation has no Big Red X link | Error | “The planned experiment does not address the selected critical uncertainty.” |
| AL-006 | Big Red X has no decision statement | Error | “State what decision could change if this uncertainty is resolved.” |
| AL-007 | Opportunity has no need or stakeholder | Error | “The opportunity lacks a supported need-holder.” |
| AL-008 | Intended impact has no mechanism or indicator | Warning | “Explain how this work could contribute to the intended change.” |
| AL-009 | Impact language exceeds evidence status | Warning | “The course can support potential impact, not demonstrated impact.” |
| AL-010 | Success criterion is not measurable | Warning | “Add a metric, threshold, or decision rule.” |
| AL-011 | Stakeholder feedback is required but not scheduled | Warning | “Add engagement timing or revise the activity.” |
| AL-012 | Student workload exceeds configured capacity | Warning | “Estimated work is concentrated in week 6.” |
| AL-013 | Too many selected EM priorities | Consideration | “Nine priorities may limit depth in a four-week experience.” |
| AL-014 | Opportunity is not revisited after evidence generation | Warning | “Add an activity that updates the opportunity using results.” |
| AL-015 | Impact is not revisited after evidence generation | Warning | “Ask students to revise the impact pathway or claim boundary.” |
| AL-016 | Team-only evidence is used for individual grade | Warning | “Individual learning may be difficult to distinguish.” |
| AL-017 | Student discovery item is exposed in project brief | Warning | “This content is marked for student discovery but is included in the export.” |
| AL-018 | Project requires unavailable resource | Error | “This investigation depends on equipment marked unavailable.” |

---

## 9. AI-assisted capabilities

### 9.1 Appropriate AI functions

- Ask targeted follow-up questions when a design field is vague or incomplete.
- Draft alternative need, opportunity, impact, and line-of-sight statements from user-provided information.
- Suggest measurable success criteria for faculty review.
- Suggest overlooked stakeholder categories as hypotheses, not facts.
- Surface possible assumptions and uncertainties.
- Critique whether a proposed Big Red X is consequential and investigable.
- Suggest scaffolding matched to course level, duration, and selected EM items.
- Draft student instructions, reflection prompts, and rubric language.
- Summarize deterministic alignment findings.
- Produce audience-specific exports from approved design data.

### 9.2 Prohibited or guarded AI functions

- Do not invent stakeholder research, needs, quotations, evidence, or citations.
- Do not independently select or change the Big Red X.
- Do not state that impact occurred without supplied evidence.
- Do not overwrite canonical framework language.
- Do not silently modify user content.
- Do not make safety, IRB, legal, or IP approval decisions.
- Do not provide final student grades in MVP.
- Do not train on private course or stakeholder content without explicit institutional authorization.

### 9.3 AI interaction contract

Every AI suggestion must:

- Identify the source fields used.
- Label inferred content as a suggestion.
- Preserve the user's original text until accepted.
- Offer accept, edit, and dismiss actions.
- Name relevant selected habits or behaviors when applicable.
- Avoid citing framework items not enabled for the design.
- Record accepted material as user-approved content in revision history.

### 9.4 Prompt context construction

The AI service should receive only the minimum necessary context:

```json
{
  "task": "critique_big_red_x",
  "courseConstraints": {},
  "need": {},
  "opportunities": [],
  "intendedImpacts": [],
  "successCriteria": [],
  "candidateUncertainties": [],
  "selectedFrameworkItems": [],
  "requestedOutputSchema": {}
}
```

Structured outputs should be validated before display or persistence.

---

## 10. Conceptual data model

The implementation may use TypeScript interfaces and a relational or document database. IDs should be opaque UUIDs. All major records should include `createdAt`, `updatedAt`, `createdBy`, and optional `archivedAt` fields.

```ts
type FrameworkMode = "habits" | "behaviors" | "both" | "custom";
type FrameworkItemType = "habit" | "observable_behavior" | "custom";
type EvidenceStatus = "assumption" | "anecdotal" | "supported" | "validated";
type ImpactClaimLevel = "output" | "outcome" | "potential_impact" | "demonstrated_impact";
type FindingStatus = "open" | "resolved" | "dismissed" | "deferred";

interface EmcureDesign {
  id: string;
  title: string;
  status: "draft" | "review" | "ready" | "archived";
  ownerId: string;
  courseProfileId: string;
  frameworkMode: FrameworkMode;
  frameworkSelections: FrameworkSelection[];
  projectContextId?: string;
  lineOfSightStatement?: string;
  phases: Phase[];
  currentBigRedXId?: string;
  versionLabel?: string;
}

interface Framework {
  id: string;
  name: string;
  publisher: string;
  version: string;
  sourceUrl?: string;
  licenseNotes?: string;
  effectiveDate?: string;
  items: FrameworkItem[];
}

interface FrameworkItem {
  id: string;
  frameworkId: string;
  type: FrameworkItemType;
  name: string;
  definition: string;
  examples: string[];
  opportunityTags: string[];
  impactTags: string[];
  relatedItemIds: string[];
  canonical: boolean;
}

interface FrameworkSelection {
  id: string;
  designId: string;
  frameworkItemId: string;
  scopeType: "course" | "phase" | "project" | "activity" | "assessment";
  scopeId: string;
  priority: "primary" | "supporting";
  localInterpretation?: string;
}

interface Stakeholder {
  id: string;
  designId: string;
  name: string;
  group?: string;
  roles: string[];
  needs: string[];
  influence?: number;
  interest?: number;
  accessStatus?: string;
  potentialBenefit?: string;
  potentialBurden?: string;
  evidenceStatus: EvidenceStatus;
}

interface Need {
  id: string;
  designId: string;
  statement: string;
  context: string;
  stakeholderIds: string[];
  evidenceRefs: EvidenceReference[];
  currentSolutions: CurrentSolution[];
}

interface Opportunity {
  id: string;
  designId: string;
  statement: string;
  needIds: string[];
  stakeholderIds: string[];
  valueCreated: string;
  evidenceStatus: EvidenceStatus;
}

interface IntendedImpact {
  id: string;
  designId: string;
  statement: string;
  category: string;
  opportunityIds: string[];
  stakeholderIds: string[];
  mechanism: string;
  indicator?: string;
  timeframe?: string;
  claimLevel: ImpactClaimLevel;
  claimBoundary?: string;
}

interface SuccessCriterion {
  id: string;
  designId: string;
  statement: string;
  metric?: string;
  baseline?: string;
  targetOrThreshold?: string;
  unit?: string;
  evidenceSource?: string;
  linkedObjectIds: string[];
}

interface Uncertainty {
  id: string;
  designId: string;
  type: "assumption" | "barrier" | "performance_gap" | "unknown";
  statement: string;
  scores: Record<string, number>;
  linkedImpactIds: string[];
  linkedSuccessCriterionIds: string[];
  decisionIfResolved?: string;
  designation: "candidate" | "primary_big_red_x" | "secondary" | "out_of_scope";
}

interface Phase {
  id: string;
  designId: string;
  title: string;
  order: number;
  activities: Activity[];
}

interface Activity {
  id: string;
  phaseId: string;
  title: string;
  instructions: string;
  discoveryMode: "instructor_provided" | "student_discovered" | "mixed";
  grouping: "individual" | "team" | "whole_class";
  estimatedMinutes?: number;
  dueOffsetDays?: number;
  linkedObjectIds: string[];
  deliverableIds: string[];
  assessmentIds: string[];
}

interface AlignmentFinding {
  id: string;
  designId: string;
  ruleId: string;
  severity: "error" | "warning" | "consideration";
  title: string;
  explanation: string;
  affectedObjectIds: string[];
  suggestedAction?: string;
  status: FindingStatus;
  resolutionNote?: string;
}
```

### 10.1 Relationship notes

- Frameworks and framework items are versioned reference data.
- Local customizations are separate records that reference their source when applicable.
- Most alignment is many-to-many; use explicit link records rather than comma-separated IDs in a production relational schema.
- Deleting an object should use soft deletion and show the links that will be affected.
- Exports should carry a stable schema version.

---

## 11. Screen specifications

### 11.1 Dashboard

**Purpose:** Find, create, duplicate, and resume designs.

**Components:**

- “Create EMCURE” primary action.
- Design cards/list with course, owner, last edited, readiness, and open findings.
- Filters for status, discipline, owner, and framework.
- Template and example entry points.
- Archive access.

**Empty state:** Explain the product promise and offer “Start from scratch” and “Start from example.”

### 11.2 Course Profile

**Purpose:** Establish feasibility constraints and technical intentions.

**Behavior:** Progressive sections, autosave, examples, and conditional fields. Show scope signals after duration, enrollment, autonomy, and resources are known.

### 11.3 EM Framework

**Purpose:** Select the habits and/or behaviors the EMCURE will deliberately cultivate.

**Components:**

- Mode selector: Habits / Behaviors / Both / Custom.
- Framework/version selector.
- Search and category filters.
- Selectable framework cards with definition and examples.
- Selection tray with primary/supporting designation.
- Coverage preview for opportunity and impact.
- “Where used” panel after activities exist.

**Key rule:** Definitions are not editable in place for canonical items. “Adapt for this course” creates a linked local interpretation.

### 11.4 Opportunity–Impact Canvas

**Purpose:** Build the central reasoning chain.

**Layout:** A guided left column for editing and a right-side interactive thread showing connections. On small screens, the thread becomes a collapsible top summary.

**Core actions:** Add need, add opportunity, add intended impact, add stakeholder, define indicator, define claim boundary, generate line-of-sight draft, and view gaps.

### 11.5 Big Red X

**Purpose:** Compare consequential uncertainties.

**Components:**

- Candidate list.
- Criterion definitions and optional weights.
- Comparison matrix.
- Impact/dependency view.
- Primary selection panel.
- Required rationale and decision-if-resolved field.
- History of designation changes.

The UI must not imply that a weighted score mechanically determines the Big Red X.

### 11.6 Student Journey

**Purpose:** Turn the reasoning model into a teachable sequence.

**Views:** Outline, timeline, and alignment matrix.

**Activity editor tabs:** Instructions; inputs/outputs; connections; feedback; assessment; visibility.

Drag-and-drop reordering must also support keyboard controls and move-up/move-down actions.

### 11.6A Student Project Workspace

**Purpose:** Help students understand why the technical work matters and maintain the reasoning chain while the research unfolds.

**Recommended home-page components:**

- Project purpose and current phase.
- Need, opportunity, and intended-impact summary.
- Big Red X or current critical uncertainty, when faculty chooses to reveal it.
- “Why this activity?” line-of-sight panel.
- Next action, upcoming milestone, and required evidence.
- Team evidence-and-decision log.
- Feedback and revision requests.
- Opportunity/impact reflection checkpoints.

**Deployment modes:**

1. **Generated companion HTML:** a publishable, mostly read-only package suitable for a pilot, an LMS link, or institutional hosting.
2. **Authenticated student workspace:** a later interactive mode with teams, submissions, feedback, revision history, and learning evidence.

Both modes shall be generated from the same released course-design version. A separate student-facing visual shell is appropriate, but duplicating the course model or maintaining a disconnected second application is not recommended.

### 11.7 Alignment Review

**Purpose:** Identify actionable design gaps.

**Components:**

- Summary by category.
- Filterable findings list.
- Finding detail with evidence and affected links.
- Resolve, dismiss with rationale, or defer actions.
- “Go to field” action.
- Before/after comparison following fixes.

### 11.8 Export

**Purpose:** Produce useful implementation artifacts.

**Selectable outputs:**

- Faculty design specification.
- Student project brief.
- Opportunity–Impact Canvas.
- Big Red X worksheet.
- Milestone and activity plan.
- Stakeholder engagement guide.
- Assessment alignment matrix.
- Rubrics and reflection prompts.
- Readiness/open-findings report.
- Structured JSON backup.

The preview must clearly label faculty-only and student-visible content.

---

## 12. Visual design system

### 12.1 Brand direction

Use a KEEN/EU-inspired visual language: deep teal for structure and authority, gold for opportunity and high-value actions, generous white space, and rounded but restrained UI components. Before public or externally branded release, the team should confirm current official brand guidance, logo permissions, and font licensing.

### 12.2 Color tokens

```css
:root {
  --emcure-teal-900: #0B3D4C;
  --emcure-teal-700: #125670; /* primary */
  --emcure-teal-600: #176B88;
  --emcure-teal-100: #DCEBF0;
  --emcure-gold-600: #D99A00;
  --emcure-gold-500: #F5B71A; /* opportunity/accent */
  --emcure-gold-100: #FFF3CC;
  --emcure-ink: #18323C;
  --emcure-muted: #5F7078;
  --emcure-surface: #FFFFFF;
  --emcure-surface-alt: #F5F8F9;
  --emcure-border: #CBD8DD;
  --emcure-success: #247A4A;
  --emcure-warning: #9A6500;
  --emcure-danger: #B42318;
  --emcure-info: #176B88;
  --emcure-focus: #7C3AED;
}
```

### 12.3 Semantic color use

- Teal: navigation, headings, selected structure, primary data relationships.
- Gold: opportunity, pivotal prompts, primary call-to-action, and selective highlights.
- Gold must not be used as small body text on white.
- Impact should use teal plus an icon/label rather than color alone.
- Big Red X uses the danger token only for the X marker; the rest of the screen remains neutral.
- Status must always include text or iconography, never color alone.

### 12.4 Typography

Preferred application typeface:

```css
font-family: "Muli", "Mulish", Arial, Helvetica, sans-serif;
```

Implementation note: Muli was renamed to Mulish in common web distribution. If official KEEN/EU materials require Muli, provide a licensed/self-hosted font file or confirm the approved web source. Do not make the application unusable if the font fails to load.

Suggested scale:

- Display: 2rem/1.2, 700.
- H1: 1.625rem/1.25, 700.
- H2: 1.25rem/1.35, 700.
- H3: 1rem/1.4, 700.
- Body: 1rem/1.55, 400.
- Small: 0.875rem/1.45, 400.
- Label: 0.875rem/1.3, 700.

### 12.5 Layout and components

- Maximum reading width: 76rem application canvas; 46rem for long-form fields.
- Base spacing unit: 4px; common spacing 8, 12, 16, 24, 32, and 48px.
- Border radius: 8px controls; 12px cards; pill radius only for compact tags.
- Minimum pointer target: 44 × 44px.
- Shadows: subtle, reserved for overlays and active work surfaces.
- Primary button: teal background with white text.
- Opportunity button or callout: gold fill with dark ink text, subject to contrast verification.
- Focus indicator: 3px visible outline with 2px offset.

### 12.6 Opportunity-to-Impact Thread visual grammar

- Nodes use a consistent shape with text labels and icons.
- Need, Opportunity, Impact, Big Red X, Investigation, Evidence, and Decision have distinct icons.
- Opportunity may use a gold accent; Impact uses teal; Big Red X uses a red X accent.
- Solid connectors indicate supported links.
- Dashed connectors indicate draft or incomplete links.
- Missing connections show a labeled gap rather than an ambiguous blank.
- Selecting a node highlights related objects and opens its editor.

---

## 13. Accessibility and inclusive design

**NFR-A11Y-001** The application shall target WCAG 2.2 Level AA.  
**NFR-A11Y-002** All functions shall be operable by keyboard.  
**NFR-A11Y-003** Form fields shall have persistent labels, descriptions, and programmatic error associations.  
**NFR-A11Y-004** Color shall not be the only carrier of meaning.  
**NFR-A11Y-005** Text and essential icons shall meet contrast requirements.  
**NFR-A11Y-006** The app shall support 200% zoom without loss of content or function.  
**NFR-A11Y-007** Motion shall respect `prefers-reduced-motion`.  
**NFR-A11Y-008** Graph/thread content shall have an equivalent structured outline or table view.  
**NFR-A11Y-009** Drag-and-drop interactions shall have keyboard alternatives.  
**NFR-A11Y-010** Generated documents shall use headings, real lists, descriptive links, and meaningful table headers.

Use inclusive language and avoid treating entrepreneurship as synonymous with venture creation or commercialization.

---

## 14. Security, privacy, and governance

- Use secure session management and modern password hashing if local accounts are supported.
- Enforce authorization server-side; hiding a button is insufficient.
- Encrypt data in transit and at rest where supported.
- Minimize collection of personal stakeholder data.
- Allow faculty to use stakeholder roles or pseudonyms.
- Do not place sensitive human-subject or proprietary research data in AI prompts by default.
- Provide clear AI data-use disclosure and an organization-level AI disable control.
- Maintain audit records for sharing, role changes, framework imports, exports, and material AI-accepted changes.
- Support design deletion and export according to institutional retention rules.
- Separate canonical framework publishing permissions from ordinary course editing.
- Scan uploaded framework/import files and validate their schema.
- Sanitize all rendered Markdown/HTML to prevent script injection.

---

## 15. Suggested technical architecture

This section is advisory; the development team may choose equivalent technologies.

### 15.1 MVP option

- **Frontend:** semantic HTML5, modern CSS with design tokens, TypeScript, and a component framework such as React, Vue, or Svelte.
- **Application state:** server-backed entities plus local draft state with debounced autosave.
- **Backend:** TypeScript API using a conventional web framework.
- **Database:** PostgreSQL with relational link tables and JSONB for versioned snapshots where useful.
- **Authentication:** managed authentication provider or institution-approved identity platform.
- **File generation:** server-side Markdown/HTML first; DOCX/PDF service as a subsequent capability.
- **AI service:** server-side adapter with structured output validation, prompt logging controls, and provider abstraction.
- **Testing:** unit tests for rules, integration tests for persistence/authorization, and end-to-end tests for core workflows.

### 15.2 Architectural rules

- Keep alignment rules in a testable domain module independent of the UI.
- Store framework data as versioned reference records.
- Do not encode framework definitions directly in UI components or AI prompts.
- Use a stable export schema with migrations.
- Treat AI as an optional service; deterministic design and export must remain usable without it.
- Prefer explicit link objects to hidden inference so traceability is inspectable.
- Use feature flags for AI, collaboration, framework import, and experimental review rules.

### 15.3 Recommended route map

```text
/
/designs
/designs/new
/designs/:designId/course
/designs/:designId/framework
/designs/:designId/context
/designs/:designId/stakeholders
/designs/:designId/opportunity-impact
/designs/:designId/success
/designs/:designId/big-red-x
/designs/:designId/journey
/designs/:designId/operations
/designs/:designId/assessment
/designs/:designId/review
/designs/:designId/export
/designs/:designId/student-preview
/courses/:courseId/student
/courses/:courseId/student/activities/:activityId
/courses/:courseId/student/evidence
/frameworks
/settings
```

---

## 16. MVP definition and phased roadmap

### Phase 0 — Discovery and framework preparation

- Validate terminology and workflow with 5–8 faculty members.
- Obtain authoritative Habits of EM and Observable Behaviors of EM documents.
- Confirm framework permissions, attribution, versioning, and official relationships.
- Convert framework content to the import schema.
- Test low-fidelity Opportunity-to-Impact Thread and Big Red X concepts.
- Establish baseline design time and quality measures.

### Phase 1 — Functional MVP

- Account and workspace basics.
- Course Profile.
- EM Framework selection.
- Project Context.
- Stakeholders and Need.
- Opportunity–Impact Canvas.
- Success Criteria.
- Big Red X comparison and selection.
- Basic Student Journey.
- Student companion preview and generated responsive HTML package.
- Deterministic Alignment Review.
- Markdown, printable HTML, and JSON exports.

### Phase 2 — Faculty pilot

- Comments and reviewer role.
- Expanded activity and rubric templates.
- AI drafting and critique behind a feature flag.
- DOCX/PDF export.
- Usage analytics with privacy controls.
- Course-copy and named-version comparison.

### Phase 3 — Course operation and learning evidence

- LMS integration.
- Authenticated Student Project Workspace.
- Team and milestone tracking.
- Stakeholder interaction records.
- Evidence collection and assessment workflow.
- SoTL/course-improvement reports.

### Phase 4 — Program ecosystem

- Organization libraries and governance.
- Project/stakeholder repository.
- Multi-course portfolio reporting.
- Shared templates and exemplars.
- Cross-institution framework and design exchange, subject to permissions.

---

## 17. MVP acceptance scenarios

### Scenario A: Create a course and select both frameworks

**Given** a signed-in faculty owner with a new design,  
**when** the owner chooses “Both,” selects a framework version, selects two habits and four behaviors, and designates priorities,  
**then** the selections persist, related items are visible, canonical definitions remain unchanged, and the coverage panel shows their current introduce/practice/evidence/assessment state.

### Scenario B: Create an Opportunity-to-Impact Thread

**Given** a need with at least one stakeholder,  
**when** the owner adds an opportunity, an intended impact, a success indicator, and a claim boundary,  
**then** the thread displays supported connections and the system can generate an editable line-of-sight draft using only supplied information.

### Scenario C: Select a Big Red X

**Given** three candidate uncertainties,  
**when** the owner compares them, selects one, and provides a rationale and decision-if-resolved statement,  
**then** it is marked as the primary Big Red X, its dependencies are visible, and related alignment rules rerun.

### Scenario D: Detect a missing research connection

**Given** a planned investigation with no link to the primary Big Red X,  
**when** alignment review runs,  
**then** an error identifies the activity, explains the missing link, and provides navigation to correct it.

### Scenario E: Protect student discovery content

**Given** a field marked “student discovered,”  
**when** the owner previews a student project brief,  
**then** faculty-only content is omitted and any accidental exposure appears as a review finding.

### Scenario F: Export the design

**Given** a design with open warnings,  
**when** the owner exports a faculty specification,  
**then** the export succeeds, includes framework versions and an open-findings appendix, and excludes content not selected for that audience.

### Scenario G: Work without AI

**Given** AI features are disabled,  
**when** the faculty member completes the design, runs deterministic review, and exports materials,  
**then** all core MVP functions remain available.

---

## 18. Testing requirements

### 18.1 Unit tests

- Every deterministic alignment rule, including positive and negative cases.
- Big Red X comparison calculations and custom weighting.
- Framework version preservation and upgrade comparison.
- Export audience filters.
- Claim-level and discovery-mode validations.

### 18.2 Integration tests

- Autosave and recovery.
- Authorization for owner, editor, reviewer, and viewer.
- Framework import and rollback.
- Soft deletion with dependent links.
- AI structured-output validation and failure fallback.
- Export generation and schema versioning.

### 18.3 End-to-end tests

- Create → framework selection → Opportunity/Impact → Big Red X → activity → review → export.
- Duplicate an existing design while preserving framework version.
- Resolve and dismiss findings.
- Invite and remove a reviewer.
- Keyboard-only completion of core workflow.

### 18.4 Manual quality checks

- Faculty usability test with think-aloud protocol.
- Screen-reader pass on core workflow.
- Keyboard and zoom review.
- Color/contrast review.
- Export inspection in common browsers and document viewers.
- Content review by EM framework owner or designated expert.

---

## 19. Framework document ingestion specification

The forthcoming Habits of EM and Observable Behaviors of EM documents should be treated as authoritative source material, not as runtime instructions.

### 19.1 Required extraction fields

- Framework name.
- Publisher/owner.
- Version and effective date.
- Source citation or URL.
- Usage/license notes.
- Item type.
- Canonical name.
- Canonical definition.
- Examples or indicators.
- Official relationships between habits and behaviors, if any.
- Opportunity and impact associations, only if present in or approved from the source.
- Course level or context notes, if present.

### 19.2 Proposed import shape

```json
{
  "schemaVersion": "1.0",
  "framework": {
    "name": "Framework name",
    "publisher": "Publisher",
    "version": "YYYY or semantic version",
    "sourceUrl": "https://example.org/source",
    "licenseNotes": "Confirm before distribution"
  },
  "items": [
    {
      "externalId": "H-01",
      "type": "habit",
      "name": "Canonical name",
      "definition": "Canonical definition",
      "examples": [],
      "relatedExternalIds": ["B-01", "B-02"]
    }
  ]
}
```

### 19.3 Import acceptance checks

- Every item has a stable external ID, type, name, and definition.
- All relationships resolve to known IDs.
- Duplicate IDs or names require explicit resolution.
- A new version does not overwrite a prior version.
- Canonical text is visually distinguished from local interpretation.
- Source and permission information appear in the framework detail and exports.

---

## 20. Open decisions for the product group

1. Which Habits and Observable Behaviors frameworks are authoritative for the initial release?
2. Are the relationships between habits and behaviors official, inferred, or faculty-configurable?
3. May the source language be reproduced in software and exported materials?
4. Will the first pilot require single sign-on or are invite-based accounts acceptable?
5. Is the MVP single-user with export, or is reviewer collaboration essential?
6. Which export formats are required for the first pilot?
7. Will faculty designs contain sensitive sponsor, research, or human-subject information?
8. Which AI providers and data-retention rules are institutionally acceptable?
9. Should Big Red X comparison use numeric weights by default or qualitative comparison first?
10. What is the smallest number of alignment rules that faculty find genuinely useful?
11. Which official logos, color tokens, and font files may be used?
12. What evidence will define a successful faculty pilot?

---

## 21. Definition of done for MVP

The MVP is ready for a controlled faculty pilot when:

- A faculty owner can complete the end-to-end workflow without developer intervention.
- Habits and/or behaviors can be selected from a versioned library and traced to activities and evidence.
- Opportunity and impact remain visible across the design workflow.
- A Big Red X can be compared, justified, selected, changed, and traced to investigation.
- Deterministic alignment findings are accurate, understandable, and actionable.
- Faculty, student, and structured-data exports protect hidden content and include provenance.
- Core workflows pass authorization, accessibility, and data-recovery tests.
- AI can be disabled without degrading core functionality.
- Pilot data collection and support procedures are documented.

---

## Appendix A. Suggested starter templates

- Course-to-EM alignment worksheet.
- Stakeholder map.
- Evidence-backed need statement.
- Current-solutions comparison.
- Opportunity statement.
- Impact pathway.
- Definition-of-success scorecard.
- Assumption and uncertainty inventory.
- Big Red X comparison.
- Research-question and investigation plan.
- Evidence and decision log.
- Opportunity/impact update reflection.
- Stakeholder briefing.
- Final evidence-based recommendation.

## Appendix B. Standard line-of-sight prompt

> We are investigating **[research question or technical work]** to resolve **[critical uncertainty]**. This uncertainty affects **[opportunity to create value]**, which could contribute to **[intended impact]** for **[stakeholders]**. The evidence will inform **[decision or next action]**.

## Appendix C. Key terminology

**Entrepreneurial Mindset (EM):** A way of thinking and acting that identifies opportunities to create value and considers the impact of engineering work.

**Habit of EM:** A broader recurring pattern of thought or practice associated with entrepreneurial mindset.

**Observable Behavior of EM:** An action through which a learner demonstrates an aspect of entrepreneurial mindset in context.

**Opportunity:** A credible possibility for creating value by improving, enabling, preventing, or better understanding a condition.

**Impact:** A meaningful technical, human, economic, environmental, organizational, scientific, educational, or societal change that could result.

**Big Red X:** The uncertainty, barrier, or assumption whose resolution most strongly affects whether the opportunity can produce the intended impact.

**Line of sight:** The explicit connection from research activity to uncertainty, opportunity, impact, and a decision or next action.

**Potential impact:** A plausible future change supported by a reasoned pathway but not yet demonstrated.

**Demonstrated impact:** An observed change supported by evidence.

---

*End of specification*
