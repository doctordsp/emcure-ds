import type {
  EvidenceStatus,
  Need,
  Stakeholder,
  StakeholderArena,
  StakeholderPriority,
} from "../domain/types";
import { createId } from "../domain/ids";
import { replaceById } from "../domain/replaceById";
import {
  LENS_FIELDS,
  STAKEHOLDER_ARENAS,
  STAKEHOLDER_PRIORITIES,
  patchLens,
  stakeholderTypeLabel,
} from "../domain/stakeholders";
import { ChoicePills, Checklist, SelectField, TextArea, TextInput } from "../ui/fields";
import { useDesign } from "../ui/DesignContext";

const ROLES = [
  "need-holder",
  "beneficiary",
  "decision-maker",
  "implementer",
  "funder",
  "expert",
  "partner",
  "affected party",
];

const EVIDENCE: { value: EvidenceStatus; label: string }[] = [
  { value: "assumption", label: "Assumption — not yet checked with them" },
  { value: "anecdotal", label: "Anecdotal — informal or secondhand" },
  { value: "supported", label: "Supported — documented contact or record" },
  { value: "validated", label: "Validated — they have confirmed this" },
];

function emptyStakeholder(): Stakeholder {
  return {
    id: createId(),
    name: "",
    roles: [],
    evidenceStatus: "assumption",
  };
}

function emptyNeed(): Need {
  return {
    id: createId(),
    statement: "",
    context: "",
    stakeholderIds: [],
    currentCondition: "",
    evidenceNotes: "",
    evidenceStatus: "assumption",
  };
}

export function StakeholdersPage() {
  const { design, update } = useDesign();

  return (
    <div className="stack">
      <h1>Stakeholders and need</h1>
      <p className="lede">
        Describe the situation and who holds the need. Distinguish evidence from
        assumption. You may use roles or pseudonyms instead of personal names.
      </p>
      <p className="muted">
        Type is who they are to this EM-CURE (primary vs secondary, internal vs external). Roles
        are what they do in the work (beneficiary, decision-maker, and so on). Then consider both
        layers of interest, influence, and impact — stated and underlying, formal and relational,
        immediate and longer-term.
      </p>
      <TextArea
        id="situation"
        label="Project situation"
        hint="What is going on, what is known, and what is still uncertain?"
        value={design.projectSituation}
        onChange={(projectSituation) => update((current) => ({ ...current, projectSituation }))}
        rows={5}
        wide
      />

      <div className="card-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            update((current) => ({
              ...current,
              stakeholders: [...current.stakeholders, emptyStakeholder()],
            }))
          }
        >
          Add stakeholder
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            update((current) => ({
              ...current,
              needs: [...current.needs, emptyNeed()],
            }))
          }
        >
          Add need
        </button>
      </div>

      {design.stakeholders.map((stk, index) => (
        <article className="item-card" key={stk.id}>
          <h2>
            Stakeholder {index + 1}
            {stakeholderTypeLabel(stk) ? (
              <span className="muted"> · {stakeholderTypeLabel(stk)}</span>
            ) : null}
          </h2>
          <TextInput
            id={`stk-name-${stk.id}`}
            label="Name or role label"
            value={stk.name}
            onChange={(name) =>
              update((current) => ({
                ...current,
                stakeholders: replaceById(current.stakeholders, stk.id, { name }),
              }))
            }
          />
          <TextInput
            id={`stk-group-${stk.id}`}
            label="Group"
            value={stk.group ?? ""}
            onChange={(group) =>
              update((current) => ({
                ...current,
                stakeholders: replaceById(current.stakeholders, stk.id, { group }),
              }))
            }
          />
          <div className="classification-row">
            <ChoicePills
              legend="Priority"
              hint="Primary: this EM-CURE is meant to serve them. Secondary: they still shape or constrain the work."
              options={STAKEHOLDER_PRIORITIES}
              value={stk.priority ?? ""}
              onChange={(priority) =>
                update((current) => ({
                  ...current,
                  stakeholders: replaceById(current.stakeholders, stk.id, {
                    priority: (priority || undefined) as StakeholderPriority | undefined,
                  }),
                }))
              }
            />
            <ChoicePills
              legend="Arena"
              hint="Internal to the course or institution, or external partners and community."
              options={STAKEHOLDER_ARENAS}
              value={stk.arena ?? ""}
              onChange={(arena) =>
                update((current) => ({
                  ...current,
                  stakeholders: replaceById(current.stakeholders, stk.id, {
                    arena: (arena || undefined) as StakeholderArena | undefined,
                  }),
                }))
              }
            />
          </div>
          <Checklist
            legend="Roles in the work"
            hint="Who they are in the project — not the same as priority. A primary stakeholder may be a beneficiary, a decision-maker, or both."
            items={ROLES.map((role) => ({ id: role, label: role }))}
            selected={stk.roles}
            onChange={(roles) =>
              update((current) => ({
                ...current,
                stakeholders: replaceById(current.stakeholders, stk.id, { roles }),
              }))
            }
          />
          <details className="eu-section">
            <summary>
              <h3>Consider interest, influence, and impact</h3>
            </summary>
            <p className="field-hint">
              For each column, note the surface layer and the layer underneath. Leave blank if
              unknown — that is useful too.
            </p>
            <div className="lens-grid">
              {(["Interest", "Influence", "Impact"] as const).map((column) => (
                <div className="lens-col" key={column}>
                  <h3>{column}</h3>
                  {LENS_FIELDS.filter((field) => field.column === column).map((field) => (
                    <TextInput
                      key={field.key}
                      id={`stk-${field.key}-${stk.id}`}
                      label={field.label}
                      hint={field.hint}
                      value={stk.lens?.[field.key] ?? ""}
                      onChange={(value) =>
                        update((current) => ({
                          ...current,
                          stakeholders: replaceById(current.stakeholders, stk.id, (item) => ({
                            ...item,
                            lens: patchLens(item.lens, field.key, value),
                          })),
                        }))
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </details>
          <h3 className="card-section-label">In this semester’s research</h3>
          <TextArea
            id={`stk-involve-${stk.id}`}
            label="How they take part"
            hint="Interviewed, provide data or site access, receive a briefing, decide on results, or no direct contact this term."
            value={stk.researchInvolvement ?? ""}
            onChange={(researchInvolvement) =>
              update((current) => ({
                ...current,
                stakeholders: replaceById(current.stakeholders, stk.id, { researchInvolvement }),
              }))
            }
            rows={3}
          />
          <TextInput
            id={`stk-access-${stk.id}`}
            label="How we can reach them"
            hint="Availability, liaison, meeting cadence, or constraints this term."
            value={stk.accessStatus ?? ""}
            onChange={(accessStatus) =>
              update((current) => ({
                ...current,
                stakeholders: replaceById(current.stakeholders, stk.id, { accessStatus }),
              }))
            }
          />
          <TextArea
            id={`stk-benefit-${stk.id}`}
            label="Potential benefit"
            hint="Outcome-level good if the work succeeds. Immediate vs longer-term belongs in the grid above."
            value={stk.potentialBenefit ?? ""}
            onChange={(potentialBenefit) =>
              update((current) => ({
                ...current,
                stakeholders: replaceById(current.stakeholders, stk.id, { potentialBenefit }),
              }))
            }
          />
          <TextArea
            id={`stk-burden-${stk.id}`}
            label="Potential burden or unintended consequence"
            hint="Cost of being involved in student work (time, privacy, reputational risk), distinct from project impact."
            value={stk.potentialBurden ?? ""}
            onChange={(potentialBurden) =>
              update((current) => ({
                ...current,
                stakeholders: replaceById(current.stakeholders, stk.id, { potentialBurden }),
              }))
            }
          />
          <div className="item-card-footer">
            <SelectField
              id={`stk-ev-${stk.id}`}
              label="How well we know this"
              hint="Support for this profile — not how they participate in the research."
              value={stk.evidenceStatus}
              onChange={(evidenceStatus) =>
                update((current) => ({
                  ...current,
                  stakeholders: replaceById(current.stakeholders, stk.id, {
                    evidenceStatus: evidenceStatus as EvidenceStatus,
                  }),
                }))
              }
              options={EVIDENCE}
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={() =>
                update((current) => ({
                  ...current,
                  stakeholders: current.stakeholders.filter((item) => item.id !== stk.id),
                }))
              }
            >
              Remove stakeholder
            </button>
          </div>
        </article>
      ))}

      {design.needs.map((need, index) => (
        <article className="item-card" key={need.id}>
          <h2>Need {index + 1}</h2>
          <TextArea
            id={`need-${need.id}`}
            label="Need statement"
            value={need.statement}
            onChange={(statement) =>
              update((current) => ({
                ...current,
                needs: replaceById(current.needs, need.id, { statement }),
              }))
            }
            wide
          />
          <TextArea
            id={`need-ctx-${need.id}`}
            label="Context"
            value={need.context}
            onChange={(context) =>
              update((current) => ({
                ...current,
                needs: replaceById(current.needs, need.id, { context }),
              }))
            }
            wide
          />
          <TextArea
            id={`need-cur-${need.id}`}
            label="Current condition"
            value={need.currentCondition}
            onChange={(currentCondition) =>
              update((current) => ({
                ...current,
                needs: replaceById(current.needs, need.id, { currentCondition }),
              }))
            }
          />
          <Checklist
            legend="Need-holders / linked stakeholders"
            items={design.stakeholders.map((item) => ({
              id: item.id,
              label: item.name || "Unnamed stakeholder",
            }))}
            selected={need.stakeholderIds}
            onChange={(stakeholderIds) =>
              update((current) => ({
                ...current,
                needs: replaceById(current.needs, need.id, { stakeholderIds }),
              }))
            }
          />
          <TextArea
            id={`need-ev-${need.id}`}
            label="Evidence notes"
            hint="Separate faculty knowledge from what students will collect."
            value={need.evidenceNotes}
            onChange={(evidenceNotes) =>
              update((current) => ({
                ...current,
                needs: replaceById(current.needs, need.id, { evidenceNotes }),
              }))
            }
          />
          <div className="item-card-footer">
            <SelectField
              id={`need-status-${need.id}`}
              label="How well we know this need"
              hint="Support for the need statement — not student discovery of it."
              value={need.evidenceStatus}
              onChange={(evidenceStatus) =>
                update((current) => ({
                  ...current,
                  needs: replaceById(current.needs, need.id, {
                    evidenceStatus: evidenceStatus as EvidenceStatus,
                  }),
                }))
              }
              options={EVIDENCE}
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={() =>
                update((current) => ({
                  ...current,
                  needs: current.needs.filter((item) => item.id !== need.id),
                }))
              }
            >
              Remove need
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
