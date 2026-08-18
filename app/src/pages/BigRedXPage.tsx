import { BRX_CRITERIA, type Uncertainty, type UncertaintyDesignation, type UncertaintyType } from "../domain/types";
import { createId } from "../domain/ids";
import { replaceById } from "../domain/replaceById";
import { Checklist, NumberInput, SelectField, TextArea } from "../ui/fields";
import { useDesign } from "../ui/DesignContext";

function emptyUncertainty(): Uncertainty {
  return {
    id: createId(),
    type: "unknown",
    statement: "",
    scores: {},
    linkedImpactIds: [],
    linkedSuccessCriterionIds: [],
    designation: "candidate",
  };
}

export function BigRedXPage() {
  const { design, update } = useDesign();

  function selectPrimary(id: string) {
    update((current) => ({
      ...current,
      currentBigRedXId: id,
      uncertainties: current.uncertainties.map((item) => {
        if (item.id === id) return { ...item, designation: "primary_big_red_x" };
        if (item.designation === "primary_big_red_x") {
          return { ...item, designation: "secondary" };
        }
        return item;
      }),
    }));
  }

  return (
    <div className="stack">
      <h1>Big Red X</h1>
      <p className="lede">
        Compare consequential uncertainties, then choose. Comparison scores help you
        think; they do not select the Big Red X.
      </p>
      <p className="callout">
        The Big Red X is the uncertainty, barrier, or assumption whose resolution most
        strongly affects whether the opportunity can produce the intended impact.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() =>
          update((current) => ({
            ...current,
            uncertainties: [...current.uncertainties, emptyUncertainty()],
          }))
        }
      >
        Add candidate
      </button>

      {design.uncertainties.length > 0 ? (
        <div className="table-wrap">
          <table>
            <caption className="sr-only">
              Side-by-side comparison of candidate uncertainties. Scores are 1 (low) to 5
              (high) and do not determine the selection.
            </caption>
            <thead>
              <tr>
                <th>Candidate</th>
                {BRX_CRITERIA.map((criterion) => (
                  <th key={criterion.key} title={criterion.description}>
                    {criterion.label}
                  </th>
                ))}
                <th>Designation</th>
              </tr>
            </thead>
            <tbody>
              {design.uncertainties.map((item) => (
                <tr key={item.id}>
                  <td>{item.statement || "Untitled candidate"}</td>
                  {BRX_CRITERIA.map((criterion) => (
                    <td key={criterion.key}>{item.scores[criterion.key] ?? "—"}</td>
                  ))}
                  <td>
                    {item.designation === "primary_big_red_x" ? (
                      <strong>
                        <span aria-hidden="true" style={{ color: "var(--emcure-danger)" }}>
                          ✕{" "}
                        </span>
                        Primary
                      </strong>
                    ) : (
                      item.designation
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {design.uncertainties.map((item, index) => (
        <article
          className={item.designation === "primary_big_red_x" ? "item-card selected" : "item-card"}
          key={item.id}
        >
          <h2>
            Candidate {index + 1}
            {item.designation === "primary_big_red_x" ? " (primary Big Red X)" : ""}
          </h2>
          <TextArea
            id={`u-${item.id}`}
            label="Uncertainty statement"
            value={item.statement}
            onChange={(statement) =>
              update((current) => ({
                ...current,
                uncertainties: replaceById(current.uncertainties, item.id, { statement }),
              }))
            }
            wide
          />
          <SelectField
            id={`u-type-${item.id}`}
            label="Type"
            value={item.type}
            onChange={(type) =>
              update((current) => ({
                ...current,
                uncertainties: replaceById(current.uncertainties, item.id, {
                  type: type as UncertaintyType,
                }),
              }))
            }
            options={[
              { value: "unknown", label: "Unknown" },
              { value: "assumption", label: "Assumption" },
              { value: "barrier", label: "Barrier" },
              { value: "performance_gap", label: "Performance gap" },
            ]}
          />
          <SelectField
            id={`u-des-${item.id}`}
            label="Designation"
            value={item.designation}
            onChange={(designation) =>
              update((current) => {
                const next = designation as UncertaintyDesignation;
                return {
                  ...current,
                  currentBigRedXId:
                    next === "primary_big_red_x"
                      ? item.id
                      : current.currentBigRedXId === item.id
                        ? undefined
                        : current.currentBigRedXId,
                  uncertainties: current.uncertainties.map((row) => {
                    if (row.id === item.id) return { ...row, designation: next };
                    if (next === "primary_big_red_x" && row.designation === "primary_big_red_x") {
                      return { ...row, designation: "secondary" };
                    }
                    return row;
                  }),
                };
              })
            }
            options={[
              { value: "candidate", label: "Candidate" },
              { value: "primary_big_red_x", label: "Primary Big Red X" },
              { value: "secondary", label: "Secondary" },
              { value: "out_of_scope", label: "Out of scope" },
            ]}
          />
          {BRX_CRITERIA.map((criterion) => (
            <NumberInput
              key={criterion.key}
              id={`${item.id}-${criterion.key}`}
              label={`${criterion.label} (1–5)`}
              hint={criterion.description}
              value={item.scores[criterion.key]}
              onChange={(value) =>
                update((current) => ({
                  ...current,
                  uncertainties: replaceById(current.uncertainties, item.id, (row) => ({
                    ...row,
                    scores: { ...row.scores, [criterion.key]: value },
                  })),
                }))
              }
            />
          ))}
          <TextArea
            id={`u-rat-${item.id}`}
            label="Rationale for designation"
            value={item.rationale ?? ""}
            onChange={(rationale) =>
              update((current) => ({
                ...current,
                uncertainties: replaceById(current.uncertainties, item.id, { rationale }),
              }))
            }
          />
          <TextArea
            id={`u-dec-${item.id}`}
            label="Decision that could change if this is resolved"
            hint="Required for the primary Big Red X."
            value={item.decisionIfResolved ?? ""}
            onChange={(decisionIfResolved) =>
              update((current) => ({
                ...current,
                uncertainties: replaceById(current.uncertainties, item.id, {
                  decisionIfResolved,
                }),
              }))
            }
            wide
          />
          <Checklist
            legend="Linked intended impacts"
            items={design.intendedImpacts.map((impact) => ({
              id: impact.id,
              label: impact.statement || "Untitled impact",
            }))}
            selected={item.linkedImpactIds}
            onChange={(linkedImpactIds) =>
              update((current) => ({
                ...current,
                uncertainties: replaceById(current.uncertainties, item.id, { linkedImpactIds }),
              }))
            }
          />
          <Checklist
            legend="Linked success criteria"
            items={design.successCriteria.map((criterion) => ({
              id: criterion.id,
              label: criterion.statement || "Untitled criterion",
            }))}
            selected={item.linkedSuccessCriterionIds}
            onChange={(linkedSuccessCriterionIds) =>
              update((current) => ({
                ...current,
                uncertainties: replaceById(current.uncertainties, item.id, {
                  linkedSuccessCriterionIds,
                }),
              }))
            }
          />
          <div className="card-actions">
            {item.designation !== "primary_big_red_x" ? (
              <button type="button" className="btn btn-gold" onClick={() => selectPrimary(item.id)}>
                Make this the primary Big Red X
              </button>
            ) : null}
            <button
              type="button"
              className="btn btn-danger"
              onClick={() =>
                update((current) => ({
                  ...current,
                  currentBigRedXId:
                    current.currentBigRedXId === item.id ? undefined : current.currentBigRedXId,
                  uncertainties: current.uncertainties.filter((row) => row.id !== item.id),
                }))
              }
            >
              Remove candidate
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
