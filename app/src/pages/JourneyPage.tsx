import { createActivity, primaryBigRedX } from "../domain/createDesign";
import { getFrameworkItem } from "../domain/frameworks";
import type { Activity, DiscoveryMode, Grouping } from "../domain/types";
import { replaceById } from "../domain/replaceById";
import { Checklist, NumberInput, SelectField, TextArea, TextInput } from "../ui/fields";
import { useDesign } from "../ui/DesignContext";

export function JourneyPage() {
  const { design, update } = useDesign();
  const brx = primaryBigRedX(design);

  const linkItems = [
    ...design.frameworkSelections.map((sel) => ({
      id: sel.frameworkItemId,
      label: `EM: ${getFrameworkItem(sel.frameworkItemId)?.name ?? sel.frameworkItemId}`,
    })),
    ...(brx
      ? [{ id: brx.id, label: `Big Red X: ${brx.statement || "untitled"}` }]
      : []),
    ...design.opportunities.map((item) => ({
      id: item.id,
      label: `Opportunity: ${item.statement || "untitled"}`,
    })),
    ...design.intendedImpacts.map((item) => ({
      id: item.id,
      label: `Impact: ${item.statement || "untitled"}`,
    })),
    ...design.successCriteria.map((item) => ({
      id: item.id,
      label: `Success: ${item.statement || "untitled"}`,
    })),
    ...design.stakeholders.map((item) => ({
      id: item.id,
      label: `Stakeholder: ${item.name || "unnamed"}`,
    })),
    ...design.needs.map((item) => ({
      id: item.id,
      label: `Need: ${item.statement || "untitled"}`,
    })),
  ];

  function moveActivity(phaseId: string, activityId: string, direction: -1 | 1) {
    update((current) => ({
      ...current,
      phases: current.phases.map((phase) => {
        if (phase.id !== phaseId) return phase;
        const index = phase.activities.findIndex((activity) => activity.id === activityId);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= phase.activities.length) return phase;
        const activities = [...phase.activities];
        const [moved] = activities.splice(index, 1);
        activities.splice(nextIndex, 0, moved);
        return { ...phase, activities };
      }),
    }));
  }

  function patchActivity(phaseId: string, activityId: string, patch: Partial<Activity>) {
    update((current) => ({
      ...current,
      phases: current.phases.map((phase) =>
        phase.id === phaseId
          ? { ...phase, activities: replaceById(phase.activities, activityId, patch) }
          : phase,
      ),
    }));
  }

  return (
    <div className="stack">
      <h1>Student journey</h1>
      <p className="lede">
        Turn the reasoning model into a teachable sequence. Link at least one investigation
        to the Big Red X. Use move up/down rather than drag-and-drop so the list stays
        keyboard accessible.
      </p>
      {design.phases.map((phase) => (
        <section className="item-card" key={phase.id}>
          <h2>{phase.title}</h2>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              update((current) => ({
                ...current,
                phases: current.phases.map((row) =>
                  row.id === phase.id
                    ? { ...row, activities: [...row.activities, createActivity()] }
                    : row,
                ),
              }))
            }
          >
            Add activity
          </button>
          {phase.activities.length === 0 ? (
            <p className="muted">No activities in this phase yet.</p>
          ) : null}
          {phase.activities.map((activity, index) => (
            <article className="item-card" key={activity.id} style={{ marginTop: 12 }}>
              <h3>Activity {index + 1}</h3>
              <TextInput
                id={`act-title-${activity.id}`}
                label="Title"
                value={activity.title}
                onChange={(title) => patchActivity(phase.id, activity.id, { title })}
              />
              <TextArea
                id={`act-ins-${activity.id}`}
                label="Instructions"
                value={activity.instructions}
                onChange={(instructions) =>
                  patchActivity(phase.id, activity.id, { instructions })
                }
                wide
              />
              <SelectField
                id={`act-group-${activity.id}`}
                label="Grouping"
                value={activity.grouping}
                onChange={(grouping) =>
                  patchActivity(phase.id, activity.id, { grouping: grouping as Grouping })
                }
                options={[
                  { value: "individual", label: "Individual" },
                  { value: "team", label: "Team" },
                  { value: "whole_class", label: "Whole class" },
                ]}
              />
              <SelectField
                id={`act-disc-${activity.id}`}
                label="Discovery mode"
                hint="Student-discovered content should stay out of student-facing briefs."
                value={activity.discoveryMode}
                onChange={(discoveryMode) =>
                  patchActivity(phase.id, activity.id, {
                    discoveryMode: discoveryMode as DiscoveryMode,
                  })
                }
                options={[
                  { value: "instructor_provided", label: "Instructor provided" },
                  { value: "student_discovered", label: "Student discovered" },
                  { value: "mixed", label: "Mixed" },
                ]}
              />
              <NumberInput
                id={`act-min-${activity.id}`}
                label="Estimated minutes"
                value={activity.estimatedMinutes}
                onChange={(estimatedMinutes) =>
                  patchActivity(phase.id, activity.id, { estimatedMinutes })
                }
              />
              <Checklist
                legend="Connections"
                hint="Link EM items, the Big Red X, opportunity, impact, and evidence."
                items={linkItems}
                selected={activity.linkedObjectIds}
                onChange={(linkedObjectIds) =>
                  patchActivity(phase.id, activity.id, { linkedObjectIds })
                }
              />
              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={index === 0}
                  onClick={() => moveActivity(phase.id, activity.id, -1)}
                >
                  Move up
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={index === phase.activities.length - 1}
                  onClick={() => moveActivity(phase.id, activity.id, 1)}
                >
                  Move down
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    update((current) => ({
                      ...current,
                      phases: current.phases.map((row) =>
                        row.id === phase.id
                          ? {
                              ...row,
                              activities: row.activities.filter((act) => act.id !== activity.id),
                            }
                          : row,
                      ),
                    }))
                  }
                >
                  Remove activity
                </button>
              </div>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
