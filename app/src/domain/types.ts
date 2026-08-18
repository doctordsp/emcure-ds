export const SCHEMA_VERSION = "0.1.0" as const;

export type FrameworkMode = "habits" | "behaviors" | "both";
export type FrameworkItemType = "habit" | "observable_behavior";
export type EvidenceStatus =
  | "assumption"
  | "anecdotal"
  | "supported"
  | "validated";
export type ImpactClaimLevel =
  | "output"
  | "outcome"
  | "potential_impact"
  | "demonstrated_impact";
export type FindingStatus = "open" | "resolved" | "dismissed" | "deferred";
export type FindingSeverity = "error" | "warning" | "consideration";
export type DesignStatus = "draft" | "review" | "ready" | "archived";
export type UncertaintyType =
  | "assumption"
  | "barrier"
  | "performance_gap"
  | "unknown";
export type UncertaintyDesignation =
  | "candidate"
  | "primary_big_red_x"
  | "secondary"
  | "out_of_scope";
export type DiscoveryMode =
  | "instructor_provided"
  | "student_discovered"
  | "mixed";
export type Grouping = "individual" | "team" | "whole_class";
export type Priority = "primary" | "supporting";
export type ScopeType = "course" | "phase" | "project" | "activity" | "assessment";
export type AutonomyLevel = "low" | "guided" | "mixed" | "high";
export type WorkspaceRoute =
  | "course"
  | "framework"
  | "stakeholders"
  | "opportunity-impact"
  | "success"
  | "big-red-x"
  | "journey"
  | "review"
  | "export";

export const BRX_CRITERIA = [
  {
    key: "influenceOnOpportunity",
    label: "Influence on opportunity",
    description: "How much resolving this would change the opportunity.",
  },
  {
    key: "influenceOnImpact",
    label: "Influence on impact",
    description: "How much resolving this would change intended impact.",
  },
  {
    key: "uncertainty",
    label: "Uncertainty",
    description: "How unknown or contested this currently is.",
  },
  {
    key: "investigability",
    label: "Investigability",
    description: "Whether undergraduates can generate useful evidence.",
  },
  {
    key: "courseFeasibility",
    label: "Course feasibility",
    description: "Whether this fits the time, resources, and safety envelope.",
  },
] as const;

export type BrxCriterionKey = (typeof BRX_CRITERIA)[number]["key"];

export interface CourseProfile {
  title: string;
  code: string;
  discipline: string;
  level: string;
  enrollment?: number;
  teamSize?: number;
  durationWeeks?: number;
  meetingPattern: string;
  prerequisites: string;
  autonomyLevel: AutonomyLevel;
  technicalObjectives: string;
}

export interface FrameworkSelection {
  id: string;
  frameworkItemId: string;
  scopeType: ScopeType;
  scopeId: string;
  priority: Priority;
  localInterpretation?: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  group?: string;
  roles: string[];
  influence?: number;
  interest?: number;
  accessStatus?: string;
  potentialBenefit?: string;
  potentialBurden?: string;
  evidenceStatus: EvidenceStatus;
}

export interface Need {
  id: string;
  statement: string;
  context: string;
  stakeholderIds: string[];
  currentCondition: string;
  evidenceNotes: string;
  evidenceStatus: EvidenceStatus;
}

export interface Opportunity {
  id: string;
  statement: string;
  needIds: string[];
  stakeholderIds: string[];
  valueCreated: string;
  evidenceStatus: EvidenceStatus;
}

export interface IntendedImpact {
  id: string;
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

export interface SuccessCriterion {
  id: string;
  statement: string;
  metric?: string;
  baseline?: string;
  targetOrThreshold?: string;
  unit?: string;
  evidenceSource?: string;
  linkedObjectIds: string[];
}

export interface Uncertainty {
  id: string;
  type: UncertaintyType;
  statement: string;
  scores: Partial<Record<BrxCriterionKey, number>>;
  linkedImpactIds: string[];
  linkedSuccessCriterionIds: string[];
  decisionIfResolved?: string;
  rationale?: string;
  designation: UncertaintyDesignation;
}

export interface Activity {
  id: string;
  title: string;
  instructions: string;
  discoveryMode: DiscoveryMode;
  grouping: Grouping;
  estimatedMinutes?: number;
  linkedObjectIds: string[];
}

export interface Phase {
  id: string;
  title: string;
  order: number;
  activities: Activity[];
}

export interface AlignmentFinding {
  id: string;
  ruleId: string;
  severity: FindingSeverity;
  title: string;
  explanation: string;
  affectedObjectIds: string[];
  suggestedAction?: string;
  status: FindingStatus;
  resolutionNote?: string;
  route: WorkspaceRoute;
}

/** One design = one Firestore-shaped document (`designs/{id}`). */
export interface EmcureDesign {
  schemaVersion: typeof SCHEMA_VERSION;
  id: string;
  title: string;
  status: DesignStatus;
  frameworkMode: FrameworkMode;
  frameworkSelections: FrameworkSelection[];
  courseProfile: CourseProfile;
  projectSituation: string;
  lineOfSightStatement?: string;
  currentBigRedXId?: string;
  stakeholders: Stakeholder[];
  needs: Need[];
  opportunities: Opportunity[];
  intendedImpacts: IntendedImpact[];
  successCriteria: SuccessCriterion[];
  uncertainties: Uncertainty[];
  phases: Phase[];
  findings: AlignmentFinding[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface FrameworkRecord {
  schemaVersion: string;
  framework: {
    id: string;
    name: string;
    publisher: string;
    version: string;
    sourceUrl?: string;
    licenseNotes: string;
    provenance: string;
  };
  items: FrameworkItemRecord[];
}

export interface FrameworkItemRecord {
  id: string;
  externalId: string;
  type: FrameworkItemType;
  name: string;
  definition: string;
  group: string;
  examples: string[];
  canonical: boolean;
}
