import { createId, nowIso } from "./ids";
import { SCHEMA_VERSION } from "./types";
import type {
  Activity,
  CourseProfile,
  EmcureDesign,
  Phase,
} from "./types";

const STARTER_PHASE_TITLES = [
  "Understand the situation",
  "Engage stakeholders",
  "Define need, opportunity, and impact",
  "Define success",
  "Prioritize uncertainties and select the Big Red X",
  "Plan the investigation",
  "Generate evidence, interpret, and decide",
  "Communicate and reflect",
];

export function emptyCourseProfile(): CourseProfile {
  return {
    title: "",
    code: "",
    discipline: "",
    level: "",
    meetingPattern: "",
    prerequisites: "",
    autonomyLevel: "guided",
    technicalObjectives: "",
  };
}

export function starterPhases(): Phase[] {
  return STARTER_PHASE_TITLES.map((title, order) => ({
    id: createId(),
    title,
    order,
    activities: [],
  }));
}

export function createActivity(partial?: Partial<Activity>): Activity {
  return {
    id: createId(),
    title: "",
    instructions: "",
    discoveryMode: "mixed",
    grouping: "team",
    linkedObjectIds: [],
    ...partial,
  };
}

export function createEmptyDesign(title = "Untitled EMCURE"): EmcureDesign {
  const timestamp = nowIso();
  const profile = emptyCourseProfile();
  profile.title = title;
  return {
    schemaVersion: SCHEMA_VERSION,
    id: createId(),
    title,
    status: "draft",
    frameworkMode: "both",
    frameworkSelections: [],
    courseProfile: profile,
    projectSituation: "",
    stakeholders: [],
    needs: [],
    opportunities: [],
    intendedImpacts: [],
    successCriteria: [],
    uncertainties: [],
    phases: starterPhases(),
    findings: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function cloneDesign(source: EmcureDesign, title?: string): EmcureDesign {
  const timestamp = nowIso();
  const copy = structuredClone(source);
  copy.id = createId();
  copy.title = title ?? `${source.title} (copy)`;
  copy.courseProfile = { ...copy.courseProfile, title: copy.title };
  copy.status = "draft";
  copy.createdAt = timestamp;
  copy.updatedAt = timestamp;
  delete copy.archivedAt;
  return copy;
}

export function allActivities(design: EmcureDesign): Activity[] {
  return design.phases.flatMap((phase) => phase.activities);
}

export function primaryBigRedX(design: EmcureDesign) {
  return (
    design.uncertainties.find((item) => item.id === design.currentBigRedXId) ??
    design.uncertainties.find((item) => item.designation === "primary_big_red_x")
  );
}

export function displayTitle(design: EmcureDesign): string {
  return design.courseProfile.title.trim() || design.title.trim() || "Untitled EMCURE";
}
