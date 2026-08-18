import type {
  Stakeholder,
  StakeholderArena,
  StakeholderLens,
  StakeholderPriority,
} from "./types";

export const STAKEHOLDER_PRIORITIES: {
  id: StakeholderPriority;
  label: string;
}[] = [
  { id: "primary", label: "Primary" },
  { id: "secondary", label: "Secondary" },
];

export const STAKEHOLDER_ARENAS: { id: StakeholderArena; label: string }[] = [
  { id: "internal", label: "Internal" },
  { id: "external", label: "External" },
];

export const LENS_FIELDS: {
  key: keyof StakeholderLens;
  column: "Interest" | "Influence" | "Impact";
  label: string;
  hint: string;
}[] = [
  {
    key: "statedInterests",
    column: "Interest",
    label: "Stated interests",
    hint: "What they say they want.",
  },
  {
    key: "underlyingValues",
    column: "Interest",
    label: "Values and norms",
    hint: "Beliefs underneath the request.",
  },
  {
    key: "powerOver",
    column: "Influence",
    label: "Formal authority",
    hint: "Hierarchical power over.",
  },
  {
    key: "powerWith",
    column: "Influence",
    label: "Relational influence",
    hint: "Informal power with.",
  },
  {
    key: "immediateImpact",
    column: "Impact",
    label: "Immediate",
    hint: "Near-term benefit or harm from engagement.",
  },
  {
    key: "longerTermImpact",
    column: "Impact",
    label: "Longer-term",
    hint: "Lasting benefit or harm.",
  },
];

export function stakeholderTypeLabel(stk: Stakeholder): string {
  const priority = STAKEHOLDER_PRIORITIES.find((item) => item.id === stk.priority)?.label;
  const arena = STAKEHOLDER_ARENAS.find((item) => item.id === stk.arena)?.label;
  return [priority, arena].filter(Boolean).join(" · ");
}

export function patchLens(
  lens: StakeholderLens | undefined,
  key: keyof StakeholderLens,
  value: string,
): StakeholderLens {
  return { ...lens, [key]: value };
}
