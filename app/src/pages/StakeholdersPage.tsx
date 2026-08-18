import type { EvidenceStatus, Need, Stakeholder } from "../domain/types";
import { createId } from "../domain/ids";
import { replaceById } from "../domain/replaceById";
import { Checklist, SelectField, TextArea, TextInput } from "../ui/fields";
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
  { value: "assumption", label: "Assumption" },
  { value: "anecdotal", label: "Anecdotal" },
  { value: "supported", label: "Supported" },
  { value: "validated", label: "Validated" },
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
          <h2>Stakeholder {index + 1}</h2>
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
          <Checklist
            legend="Roles"
            items={ROLES.map((role) => ({ id: role, label: role }))}
            selected={stk.roles}
            onChange={(roles) =>
              update((current) => ({
                ...current,
                stakeholders: replaceById(current.stakeholders, stk.id, { roles }),
              }))
            }
          />
          <TextInput
            id={`stk-access-${stk.id}`}
            label="Access this semester"
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
            value={stk.potentialBurden ?? ""}
            onChange={(potentialBurden) =>
              update((current) => ({
                ...current,
                stakeholders: replaceById(current.stakeholders, stk.id, { potentialBurden }),
              }))
            }
          />
          <SelectField
            id={`stk-ev-${stk.id}`}
            label="Evidence status"
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
          <SelectField
            id={`need-status-${need.id}`}
            label="Evidence status"
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
        </article>
      ))}
    </div>
  );
}
