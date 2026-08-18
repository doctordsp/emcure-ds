import {
  getFrameworkItem,
  groupItems,
  itemsForMode,
  suggestedPriorityLimit,
} from "../domain/frameworks";
import type { FrameworkMode, Priority } from "../domain/types";
import { createId } from "../domain/ids";
import { SelectField, TextArea } from "../ui/fields";
import { useDesign } from "../ui/DesignContext";

export function FrameworkPage() {
  const { design, update } = useDesign();
  const items = itemsForMode(design.frameworkMode);
  const grouped = groupItems(items);
  const limit = suggestedPriorityLimit(design.courseProfile.durationWeeks);
  const selectedCount = design.frameworkSelections.filter(
    (item) => item.scopeType === "course",
  ).length;

  function toggle(itemId: string) {
    update((current) => {
      const existing = current.frameworkSelections.find(
        (sel) => sel.frameworkItemId === itemId && sel.scopeType === "course",
      );
      if (existing) {
        return {
          ...current,
          frameworkSelections: current.frameworkSelections.filter(
            (sel) => sel.id !== existing.id,
          ),
        };
      }
      return {
        ...current,
        frameworkSelections: [
          ...current.frameworkSelections,
          {
            id: createId(),
            frameworkItemId: itemId,
            scopeType: "course",
            scopeId: current.id,
            priority: selectedCount < 3 ? "primary" : "supporting",
          },
        ],
      };
    });
  }

  return (
    <div className="stack">
      <h1>EM framework</h1>
      <p className="lede">
        Choose a deliberately limited set of habits and/or observable behaviors. Canonical
        definitions stay read-only; you may add a local interpretation for this course.
      </p>
      <SelectField
        id="mode"
        label="Framework mode"
        value={design.frameworkMode}
        onChange={(frameworkMode) =>
          update((current) => ({
            ...current,
            frameworkMode: frameworkMode as FrameworkMode,
            frameworkSelections: current.frameworkSelections.filter((sel) => {
              const item = getFrameworkItem(sel.frameworkItemId);
              if (!item) return false;
              if (frameworkMode === "habits") return item.type === "habit";
              if (frameworkMode === "behaviors") return item.type === "observable_behavior";
              return true;
            }),
          }))
        }
        options={[
          { value: "habits", label: "Habits of EM only" },
          { value: "behaviors", label: "Observable Behaviors only" },
          { value: "both", label: "Both" },
        ]}
      />
      {selectedCount > limit ? (
        <p className="callout callout-warn" role="status">
          {selectedCount} priorities may limit depth in a {design.courseProfile.durationWeeks ?? "short"}-week
          experience. Consider keeping about {limit}. This is a warning, not a block.
        </p>
      ) : null}

      {design.frameworkSelections.length > 0 ? (
        <section className="tray" aria-labelledby="tray-heading">
          <h2 id="tray-heading">Selection tray</h2>
          {design.frameworkSelections.map((sel) => {
            const item = getFrameworkItem(sel.frameworkItemId);
            return (
              <div key={sel.id} className="item-card" style={{ marginTop: 12 }}>
                <h3>{item?.name ?? sel.frameworkItemId}</h3>
                <p className="muted">{item?.definition}</p>
                <SelectField
                  id={`priority-${sel.id}`}
                  label="Priority"
                  value={sel.priority}
                  onChange={(priority) =>
                    update((current) => ({
                      ...current,
                      frameworkSelections: current.frameworkSelections.map((row) =>
                        row.id === sel.id ? { ...row, priority: priority as Priority } : row,
                      ),
                    }))
                  }
                  options={[
                    { value: "primary", label: "Primary" },
                    { value: "supporting", label: "Supporting" },
                  ]}
                />
                <TextArea
                  id={`local-${sel.id}`}
                  label="Adapt for this course (local interpretation)"
                  hint="Does not change canonical framework language."
                  value={sel.localInterpretation ?? ""}
                  onChange={(localInterpretation) =>
                    update((current) => ({
                      ...current,
                      frameworkSelections: current.frameworkSelections.map((row) =>
                        row.id === sel.id ? { ...row, localInterpretation } : row,
                      ),
                    }))
                  }
                />
              </div>
            );
          })}
        </section>
      ) : null}

      {grouped.map(([group, groupItemsList]) => (
        <section key={group}>
          <h2>{group}</h2>
          <div className="framework-grid">
            {groupItemsList.map((item) => {
              const pressed = design.frameworkSelections.some(
                (sel) => sel.frameworkItemId === item.id,
              );
              return (
                <button
                  key={item.id}
                  type="button"
                  className="framework-card"
                  aria-pressed={pressed}
                  onClick={() => toggle(item.id)}
                >
                  <strong>{item.name}</strong>
                  <p className="muted" style={{ margin: "8px 0 0" }}>
                    {item.definition}
                  </p>
                  {item.examples[0] ? (
                    <p className="muted" style={{ margin: "8px 0 0" }}>
                      Example: {item.examples[0]}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
