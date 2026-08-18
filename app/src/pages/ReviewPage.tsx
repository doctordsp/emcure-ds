import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FindingSeverity, FindingStatus } from "../domain/types";
import { TextArea } from "../ui/fields";
import { useDesign } from "../ui/DesignContext";

const FILTERS: { value: "all" | FindingSeverity; label: string }[] = [
  { value: "all", label: "All open and resolved" },
  { value: "error", label: "Errors" },
  { value: "warning", label: "Warnings" },
  { value: "consideration", label: "Considerations" },
];

export function ReviewPage() {
  const { design, update } = useDesign();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | FindingSeverity>("all");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const findings = useMemo(
    () =>
      design.findings.filter((finding) => (filter === "all" ? true : finding.severity === filter)),
    [design.findings, filter],
  );

  function setStatus(id: string, status: FindingStatus) {
    update((current) => ({
      ...current,
      findings: current.findings.map((finding) =>
        finding.id === id
          ? { ...finding, status, resolutionNote: notes[id] ?? finding.resolutionNote }
          : finding,
      ),
    }));
  }

  return (
    <div className="stack">
      <h1>Alignment review</h1>
      <p className="lede">
        Deterministic checks run whenever the design changes. There is no single quality
        score. Resolve, dismiss with a reason, or defer each finding.
      </p>
      <label className="field">
        Filter
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as typeof filter)}
        >
          {FILTERS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      {findings.length === 0 ? (
        <p className="card">No findings in this filter. Keep designing, then return here.</p>
      ) : null}
      {findings.map((finding) => (
        <article className={`finding ${finding.severity}`} key={finding.id}>
          <p className="muted" style={{ marginBottom: 4 }}>
            {finding.ruleId} · {finding.severity} · {finding.status}
          </p>
          <h2>{finding.title}</h2>
          <p>{finding.explanation}</p>
          {finding.suggestedAction ? <p>{finding.suggestedAction}</p> : null}
          <TextArea
            id={`note-${finding.id}`}
            label="Resolution note"
            value={notes[finding.id] ?? finding.resolutionNote ?? ""}
            onChange={(value) => setNotes((current) => ({ ...current, [finding.id]: value }))}
          />
          <div className="card-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`/designs/${design.id}/${finding.route}`)}
            >
              Go to field
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStatus(finding.id, "resolved")}
            >
              Resolve
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStatus(finding.id, "dismissed")}
            >
              Dismiss with reason
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStatus(finding.id, "deferred")}
            >
              Defer
            </button>
            {finding.status !== "open" ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStatus(finding.id, "open")}
              >
                Reopen
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
