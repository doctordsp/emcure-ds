import type { EvidenceStatus, ImpactClaimLevel, IntendedImpact, Opportunity } from "../domain/types";
import { createId } from "../domain/ids";
import { draftLineOfSight } from "../domain/thread";
import { replaceById } from "../domain/replaceById";
import { Checklist, SelectField, TextArea } from "../ui/fields";
import { ThreadView } from "../ui/ThreadView";
import { useDesign } from "../ui/DesignContext";

const EVIDENCE: { value: EvidenceStatus; label: string }[] = [
  { value: "assumption", label: "Assumption" },
  { value: "anecdotal", label: "Anecdotal" },
  { value: "supported", label: "Supported" },
  { value: "validated", label: "Validated" },
];

function emptyOpportunity(): Opportunity {
  return {
    id: createId(),
    statement: "",
    needIds: [],
    stakeholderIds: [],
    valueCreated: "",
    evidenceStatus: "assumption",
  };
}

function emptyImpact(): IntendedImpact {
  return {
    id: createId(),
    statement: "",
    category: "human",
    opportunityIds: [],
    stakeholderIds: [],
    mechanism: "",
    claimLevel: "potential_impact",
  };
}

export function OpportunityImpactPage() {
  const { design, update } = useDesign();

  return (
    <div className="layout-split">
      <div className="stack">
        <h1>Opportunity and impact</h1>
        <p className="lede">
          Build the reasoning chain. Claims about impact must stay bounded: distinguish
          output, outcome, potential impact, and demonstrated impact.
        </p>
        <div className="card-actions">
          <button
            type="button"
            className="btn btn-gold"
            onClick={() =>
              update((current) => ({
                ...current,
                opportunities: [...current.opportunities, emptyOpportunity()],
              }))
            }
          >
            Add opportunity
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              update((current) => ({
                ...current,
                intendedImpacts: [...current.intendedImpacts, emptyImpact()],
              }))
            }
          >
            Add intended impact
          </button>
        </div>

        {design.opportunities.map((opp, index) => (
          <article className="item-card" key={opp.id}>
            <h2>Opportunity {index + 1}</h2>
            <TextArea
              id={`opp-${opp.id}`}
              label="Opportunity statement"
              value={opp.statement}
              onChange={(statement) =>
                update((current) => ({
                  ...current,
                  opportunities: replaceById(current.opportunities, opp.id, { statement }),
                }))
              }
              wide
            />
            <TextArea
              id={`opp-val-${opp.id}`}
              label="Value created"
              value={opp.valueCreated}
              onChange={(valueCreated) =>
                update((current) => ({
                  ...current,
                  opportunities: replaceById(current.opportunities, opp.id, { valueCreated }),
                }))
              }
            />
            <Checklist
              legend="Linked needs"
              items={design.needs.map((need) => ({
                id: need.id,
                label: need.statement || "Untitled need",
              }))}
              selected={opp.needIds}
              onChange={(needIds) =>
                update((current) => ({
                  ...current,
                  opportunities: replaceById(current.opportunities, opp.id, { needIds }),
                }))
              }
            />
            <Checklist
              legend="Linked stakeholders"
              items={design.stakeholders.map((stk) => ({
                id: stk.id,
                label: stk.name || "Unnamed stakeholder",
              }))}
              selected={opp.stakeholderIds}
              onChange={(stakeholderIds) =>
                update((current) => ({
                  ...current,
                  opportunities: replaceById(current.opportunities, opp.id, { stakeholderIds }),
                }))
              }
            />
            <SelectField
              id={`opp-ev-${opp.id}`}
              label="Evidence status"
              value={opp.evidenceStatus}
              onChange={(evidenceStatus) =>
                update((current) => ({
                  ...current,
                  opportunities: replaceById(current.opportunities, opp.id, {
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
                  opportunities: current.opportunities.filter((item) => item.id !== opp.id),
                }))
              }
            >
              Remove opportunity
            </button>
          </article>
        ))}

        {design.intendedImpacts.map((impact, index) => (
          <article className="item-card" key={impact.id}>
            <h2>Intended impact {index + 1}</h2>
            <TextArea
              id={`imp-${impact.id}`}
              label="Impact statement"
              value={impact.statement}
              onChange={(statement) =>
                update((current) => ({
                  ...current,
                  intendedImpacts: replaceById(current.intendedImpacts, impact.id, { statement }),
                }))
              }
              wide
            />
            <SelectField
              id={`imp-cat-${impact.id}`}
              label="Category"
              value={impact.category}
              onChange={(category) =>
                update((current) => ({
                  ...current,
                  intendedImpacts: replaceById(current.intendedImpacts, impact.id, { category }),
                }))
              }
              options={[
                "technical",
                "human",
                "economic",
                "environmental",
                "organizational",
                "scientific",
                "educational",
                "societal",
              ].map((value) => ({ value, label: value }))}
            />
            <SelectField
              id={`imp-claim-${impact.id}`}
              label="Claim level"
              hint="A one-semester course usually supports potential impact, not demonstrated impact."
              value={impact.claimLevel}
              onChange={(claimLevel) =>
                update((current) => ({
                  ...current,
                  intendedImpacts: replaceById(current.intendedImpacts, impact.id, {
                    claimLevel: claimLevel as ImpactClaimLevel,
                  }),
                }))
              }
              options={[
                { value: "output", label: "Output (what students produce)" },
                { value: "outcome", label: "Outcome (near-term change in capability or decision)" },
                { value: "potential_impact", label: "Potential impact" },
                { value: "demonstrated_impact", label: "Demonstrated impact" },
              ]}
            />
            <TextArea
              id={`imp-mech-${impact.id}`}
              label="Mechanism"
              value={impact.mechanism}
              onChange={(mechanism) =>
                update((current) => ({
                  ...current,
                  intendedImpacts: replaceById(current.intendedImpacts, impact.id, { mechanism }),
                }))
              }
            />
            <TextArea
              id={`imp-ind-${impact.id}`}
              label="Indicator"
              value={impact.indicator ?? ""}
              onChange={(indicator) =>
                update((current) => ({
                  ...current,
                  intendedImpacts: replaceById(current.intendedImpacts, impact.id, { indicator }),
                }))
              }
            />
            <TextArea
              id={`imp-bound-${impact.id}`}
              label="Claim boundary"
              value={impact.claimBoundary ?? ""}
              onChange={(claimBoundary) =>
                update((current) => ({
                  ...current,
                  intendedImpacts: replaceById(current.intendedImpacts, impact.id, { claimBoundary }),
                }))
              }
            />
            <Checklist
              legend="Linked opportunities"
              items={design.opportunities.map((item) => ({
                id: item.id,
                label: item.statement || "Untitled opportunity",
              }))}
              selected={impact.opportunityIds}
              onChange={(opportunityIds) =>
                update((current) => ({
                  ...current,
                  intendedImpacts: replaceById(current.intendedImpacts, impact.id, {
                    opportunityIds,
                  }),
                }))
              }
            />
            <Checklist
              legend="Linked stakeholders"
              items={design.stakeholders.map((item) => ({
                id: item.id,
                label: item.name || "Unnamed stakeholder",
              }))}
              selected={impact.stakeholderIds}
              onChange={(stakeholderIds) =>
                update((current) => ({
                  ...current,
                  intendedImpacts: replaceById(current.intendedImpacts, impact.id, {
                    stakeholderIds,
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
                  intendedImpacts: current.intendedImpacts.filter((item) => item.id !== impact.id),
                }))
              }
            >
              Remove impact
            </button>
          </article>
        ))}

        <article className="item-card">
          <h2>Line of sight</h2>
          <p className="muted">
            Draft uses only fields you have already supplied. It does not invent
            stakeholders or evidence.
          </p>
          <TextArea
            id="line-of-sight"
            label="Line-of-sight statement"
            value={design.lineOfSightStatement ?? ""}
            onChange={(lineOfSightStatement) =>
              update((current) => ({ ...current, lineOfSightStatement }))
            }
            rows={6}
            wide
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              update((current) => ({
                ...current,
                lineOfSightStatement: draftLineOfSight(current),
              }))
            }
          >
            Insert draft from current fields
          </button>
        </article>
      </div>
      <ThreadView design={design} />
    </div>
  );
}
