import type { SuccessCriterion } from "../domain/types";
import { createId } from "../domain/ids";
import { replaceById } from "../domain/replaceById";
import { Checklist, TextArea, TextInput } from "../ui/fields";
import { useDesign } from "../ui/DesignContext";

function emptyCriterion(): SuccessCriterion {
  return {
    id: createId(),
    statement: "",
    linkedObjectIds: [],
  };
}

export function SuccessPage() {
  const { design, update } = useDesign();
  const linkItems = [
    ...design.opportunities.map((item) => ({
      id: item.id,
      label: `Opportunity: ${item.statement || "untitled"}`,
    })),
    ...design.intendedImpacts.map((item) => ({
      id: item.id,
      label: `Impact: ${item.statement || "untitled"}`,
    })),
    ...design.stakeholders.map((item) => ({
      id: item.id,
      label: `Stakeholder: ${item.name || "unnamed"}`,
    })),
  ];

  return (
    <div className="stack">
      <h1>Success criteria</h1>
      <p className="lede">
        Make success measurable enough that evidence can inform a decision. Vague
        criteria will appear in alignment review.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() =>
          update((current) => ({
            ...current,
            successCriteria: [...current.successCriteria, emptyCriterion()],
          }))
        }
      >
        Add success criterion
      </button>
      {design.successCriteria.map((criterion, index) => (
        <article className="item-card" key={criterion.id}>
          <h2>Criterion {index + 1}</h2>
          <TextArea
            id={`sc-${criterion.id}`}
            label="Statement"
            value={criterion.statement}
            onChange={(statement) =>
              update((current) => ({
                ...current,
                successCriteria: replaceById(current.successCriteria, criterion.id, {
                  statement,
                }),
              }))
            }
            wide
          />
          <TextInput
            id={`sc-metric-${criterion.id}`}
            label="Metric"
            value={criterion.metric ?? ""}
            onChange={(metric) =>
              update((current) => ({
                ...current,
                successCriteria: replaceById(current.successCriteria, criterion.id, { metric }),
              }))
            }
          />
          <TextInput
            id={`sc-base-${criterion.id}`}
            label="Baseline (if known)"
            value={criterion.baseline ?? ""}
            onChange={(baseline) =>
              update((current) => ({
                ...current,
                successCriteria: replaceById(current.successCriteria, criterion.id, { baseline }),
              }))
            }
          />
          <TextInput
            id={`sc-target-${criterion.id}`}
            label="Target or decision threshold"
            value={criterion.targetOrThreshold ?? ""}
            onChange={(targetOrThreshold) =>
              update((current) => ({
                ...current,
                successCriteria: replaceById(current.successCriteria, criterion.id, {
                  targetOrThreshold,
                }),
              }))
            }
          />
          <TextInput
            id={`sc-unit-${criterion.id}`}
            label="Unit"
            value={criterion.unit ?? ""}
            onChange={(unit) =>
              update((current) => ({
                ...current,
                successCriteria: replaceById(current.successCriteria, criterion.id, { unit }),
              }))
            }
          />
          <TextArea
            id={`sc-ev-${criterion.id}`}
            label="Evidence source"
            value={criterion.evidenceSource ?? ""}
            onChange={(evidenceSource) =>
              update((current) => ({
                ...current,
                successCriteria: replaceById(current.successCriteria, criterion.id, {
                  evidenceSource,
                }),
              }))
            }
          />
          <Checklist
            legend="Linked objects"
            items={linkItems}
            selected={criterion.linkedObjectIds}
            onChange={(linkedObjectIds) =>
              update((current) => ({
                ...current,
                successCriteria: replaceById(current.successCriteria, criterion.id, {
                  linkedObjectIds,
                }),
              }))
            }
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() =>
              update((current) => ({
                ...current,
                successCriteria: current.successCriteria.filter(
                  (item) => item.id !== criterion.id,
                ),
              }))
            }
          >
            Remove criterion
          </button>
        </article>
      ))}
    </div>
  );
}
