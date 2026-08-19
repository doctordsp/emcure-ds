import { useState } from "react";
import { Link } from "react-router-dom";
import { complete } from "../ai/client";
import { normalizeRewrite } from "../ai/cardRewrite";
import { rubricDeveloperEnabled } from "../ai/featureFlags";
import { rubricDraftPrompt } from "../ai/rubricDraft";
import { displayTitle } from "../domain/createDesign";
import {
  canDraftRubric,
  collectRubricSources,
  draftRubricFromDesign,
  facultyRubricMarkdown,
  resolvedRubric,
  rubricToHtml,
} from "../domain/rubric";
import type { EmcureRubric, RubricAudience, RubricKind } from "../domain/types";
import { downloadTextFile } from "../persistence/storage";
import { useDesign } from "./DesignContext";
import { SelectField, TextArea, TextInput } from "./fields";

export function RubricDeveloper() {
  const { design, update } = useDesign();
  const rubric = resolvedRubric(design);
  const sources = collectRubricSources(design);
  const connected = rubricDeveloperEnabled();
  const slug = displayTitle(design).replace(/[^\w]+/g, "-").toLowerCase() || "emcure";
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patch(partial: Partial<EmcureRubric>) {
    update((current) => ({
      ...current,
      rubric: { ...resolvedRubric(current), ...partial },
    }));
  }

  function showSuggestion(text: string) {
    setError(null);
    setSuggestion(text);
  }

  function onDraftFromDesign() {
    if (!canDraftRubric(design)) {
      setError("Add success criteria, EM selections, an MVRC, or technical objectives first.");
      return;
    }
    showSuggestion(draftRubricFromDesign(design, rubric));
  }

  async function onSuggestAi() {
    setError(null);
    if (!canDraftRubric(design)) {
      setError("Add success criteria, EM selections, an MVRC, or technical objectives first.");
      return;
    }
    setBusy(true);
    try {
      const raw = await complete([{ role: "user", content: rubricDraftPrompt(design) }]);
      showSuggestion(normalizeRewrite(raw));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Rubric draft failed.");
    } finally {
      setBusy(false);
    }
  }

  const downloadTitle = rubric.title.trim() || `Assessment rubric — ${displayTitle(design)}`;
  const studentCopy = rubric.audience === "faculty" ? null : rubric.body.trim();
  const facultyCopy = facultyRubricMarkdown(design);

  return (
    <div className="stack">
      <p>
        Draft a rubric aligned to this EM-CURE: student performance, entrepreneurial mindset, and
        course evaluation. Deterministic <strong>Draft from design</strong> always works.{" "}
        <strong>Suggest with AI</strong> needs Setup AI API. Suggestions never overwrite the saved
        rubric until you accept.
      </p>

      {!connected ? (
        <p className="callout">
          AI suggest is off.{" "}
          <Link to="/setup-ai">Setup AI API</Link> to connect a model, or draft from the design
          without AI.
        </p>
      ) : null}

      <TextInput
        id="rubric-title"
        label="Rubric title"
        value={rubric.title}
        onChange={(title) => patch({ title })}
        wide
      />
      <SelectField
        id="rubric-kind"
        label="Use"
        value={rubric.kind}
        onChange={(kind) => patch({ kind: kind as RubricKind })}
        options={[
          { value: "both", label: "Formative and summative" },
          { value: "formative", label: "Formative only" },
          { value: "summative", label: "Summative only" },
        ]}
      />
      <SelectField
        id="rubric-audience"
        label="Audience"
        hint="Faculty notes are never included in the student copy."
        value={rubric.audience}
        onChange={(audience) => patch({ audience: audience as RubricAudience })}
        options={[
          { value: "students", label: "Students" },
          { value: "both", label: "Students and faculty" },
          { value: "faculty", label: "Faculty only" },
        ]}
      />

      <section className="eu-section">
        <h2>Sources in this design</h2>
        <ul className="inventory-list">
          <li>
            <strong>Technical objectives</strong>
            <span className="muted">
              {" "}
              {sources.technicalObjectives || "None yet — add them on Course profile."}
            </span>
          </li>
          <li>
            <strong>Success criteria</strong>
            <span className="muted"> {sources.successCriteria.length || "None yet"}</span>
          </li>
          <li>
            <strong>EM items</strong>
            <span className="muted">
              {" "}
              {sources.emItems.length
                ? sources.emItems.map((item) => item.name).join("; ")
                : "None selected"}
            </span>
          </li>
          <li>
            <strong>Big Red X</strong>
            <span className="muted"> {sources.bigRedX || "Not designated"}</span>
          </li>
          <li>
            <strong>MVRC</strong>
            <span className="muted"> {sources.mvrc || "None yet"}</span>
          </li>
        </ul>
      </section>

      <div className="card-actions">
        <button type="button" className="btn btn-primary" onClick={onDraftFromDesign} disabled={busy}>
          Draft from design
        </button>
        {connected ? (
          <button type="button" className="btn btn-gold" onClick={() => void onSuggestAi()} disabled={busy}>
            {busy ? "Drafting…" : "Suggest with AI"}
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}

      {suggestion !== null ? (
        <div className="ai-suggestion ai-suggestion-wide" role="region" aria-label="Suggested rubric">
          <p className="muted">
            Suggested rubric. Accept, edit, or dismiss — the saved rubric stays as-is until you
            accept.
          </p>
          <textarea
            rows={16}
            value={suggestion}
            onChange={(event) => setSuggestion(event.target.value)}
            aria-label="Edit suggested rubric"
          />
          <div className="card-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                patch({ body: suggestion });
                setSuggestion(null);
                setError(null);
              }}
            >
              Accept
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSuggestion(null);
                setError(null);
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <TextArea
        id="rubric-body"
        label="Rubric"
        hint="Markdown. Tables work in the printable HTML download."
        value={rubric.body}
        onChange={(body) => patch({ body })}
        rows={16}
        wide
      />
      <TextArea
        id="rubric-notes"
        label="Faculty notes"
        hint="Stays off the student copy."
        value={rubric.facultyNotes}
        onChange={(facultyNotes) => patch({ facultyNotes })}
        rows={4}
        wide
      />

      <div className="card-actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!studentCopy}
          onClick={() =>
            downloadTextFile(`${slug}-rubric.md`, studentCopy ?? "", "text/markdown")
          }
        >
          Download student Markdown
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!rubric.body.trim()}
          onClick={() =>
            downloadTextFile(
              `${slug}-rubric-faculty.html`,
              rubricToHtml(downloadTitle, facultyCopy),
              "text/html",
            )
          }
        >
          Download faculty HTML
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!studentCopy}
          onClick={() =>
            downloadTextFile(
              `${slug}-rubric.html`,
              rubricToHtml(downloadTitle, studentCopy ?? ""),
              "text/html",
            )
          }
        >
          Download student HTML
        </button>
      </div>
    </div>
  );
}
