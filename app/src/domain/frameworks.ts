import habits from "../data/frameworks/habits-em.json";
import behaviors from "../data/frameworks/observable-behaviors.json";
import type { FrameworkItemRecord, FrameworkMode, FrameworkRecord } from "./types";

export const HABITS_FRAMEWORK = habits as FrameworkRecord;
export const BEHAVIORS_FRAMEWORK = behaviors as FrameworkRecord;

export const ALL_FRAMEWORKS: FrameworkRecord[] = [
  HABITS_FRAMEWORK,
  BEHAVIORS_FRAMEWORK,
];

const itemIndex = new Map<string, FrameworkItemRecord>();
for (const fw of ALL_FRAMEWORKS) {
  for (const item of fw.items) {
    itemIndex.set(item.id, item);
  }
}

export function getFrameworkItem(id: string): FrameworkItemRecord | undefined {
  return itemIndex.get(id);
}

export function itemsForMode(mode: FrameworkMode): FrameworkItemRecord[] {
  if (mode === "habits") return HABITS_FRAMEWORK.items;
  if (mode === "behaviors") return BEHAVIORS_FRAMEWORK.items;
  return [...HABITS_FRAMEWORK.items, ...BEHAVIORS_FRAMEWORK.items];
}

export function groupItems(items: FrameworkItemRecord[]): [string, FrameworkItemRecord[]][] {
  const groups: [string, FrameworkItemRecord[]][] = [];
  const seen = new Map<string, FrameworkItemRecord[]>();
  for (const item of items) {
    let list = seen.get(item.group);
    if (!list) {
      list = [];
      seen.set(item.group, list);
      groups.push([item.group, list]);
    }
    list.push(item);
  }
  return groups;
}

export function suggestedPriorityLimit(durationWeeks?: number): number {
  if (!durationWeeks) return 6;
  if (durationWeeks <= 4) return 3;
  if (durationWeeks <= 8) return 4;
  if (durationWeeks <= 12) return 6;
  return 8;
}
