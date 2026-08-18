import { useRef, useState } from "react";
import { displayTitle } from "../domain/createDesign";
import { createId } from "../domain/ids";
import {
  emptyHandout,
  resolvedStudentPackageOptions,
  studentFacingDocuments,
  studentPackageHtml,
  studentPackageInventory,
  studentPackageMarkdown,
} from "../domain/studentPackage";
import { MVRC_LABEL } from "../domain/mvrc";
import type { DistributionDocument, DocumentAudience } from "../domain/types";
import { downloadTextFile } from "../persistence/storage";
import { useDesign } from "./DesignContext";
import { SelectField, TextArea, TextInput } from "./fields";

const MAX_ASSET_BYTES = 1_500_000;

export function StudentDocumentsPanel() {
  const { design, update } = useDesign();
  const options = resolvedStudentPackageOptions(design);
  const documents = design.distributionDocuments ?? [];
  const inventory = studentPackageInventory(design);
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(emptyHandout);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadAudience, setUploadAudience] = useState<DocumentAudience>("students");
  const slug = displayTitle(design).replace(/[^\w]+/g, "-").toLowerCase() || "emcure";

  function patchOptions(partial: Partial<typeof options>) {
    update((current) => ({
      ...current,
      studentPackageOptions: { ...resolvedStudentPackageOptions(current), ...partial },
    }));
  }

  function setDocuments(next: DistributionDocument[]) {
    update((current) => ({ ...current, distributionDocuments: next }));
  }

  function addHandout() {
    const title = draft.title.trim() || "Student handout";
    const filename =
      draft.filename.trim() ||
      `${title.replace(/[^\w]+/g, "-").toLowerCase() || "student-handout"}.md`;
    setDocuments([
      ...documents,
      {
        ...draft,
        id: createId(),
        title,
        filename,
        body: draft.body,
      },
    ]);
    setDraft(emptyHandout());
  }

  function onUpload(file: File | undefined) {
    setUploadError(null);
    if (!file) return;
    if (file.size > MAX_ASSET_BYTES) {
      setUploadError("Keep uploaded files under 1.5 MB so this local prototype can save them.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDocuments([
        ...documents,
        {
          id: createId(),
          title: file.name.replace(/\.[^.]+$/, ""),
          audience: uploadAudience,
          kind: "uploaded",
          body: "",
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          dataUrl: String(reader.result),
        },
      ]);
    };
    reader.readAsDataURL(file);
  }

  function downloadAttachment(doc: DistributionDocument) {
    if (doc.dataUrl) {
      const anchor = document.createElement("a");
      anchor.href = doc.dataUrl;
      anchor.download = doc.filename;
      anchor.click();
      return;
    }
    downloadTextFile(doc.filename, doc.body, doc.mimeType || "text/plain");
  }

  const included = inventory.filter((item) => item.included);
  const excluded = inventory.filter((item) => !item.included);

  return (
    <div className="stack">
      <p>
        Build a student package that omits faculty-only notes and instructions marked for student
        discovery. Add handouts or upload files for distribution.
      </p>
      <div className="card-actions" style={{ marginTop: 0 }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            downloadTextFile(`${slug}-student-companion.html`, studentPackageHtml(design), "text/html")
          }
        >
          Download student companion HTML
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            downloadTextFile(`${slug}-student-companion.md`, studentPackageMarkdown(design), "text/markdown")
          }
        >
          Download student companion Markdown
        </button>
      </div>

      <fieldset className="eu-section">
        <legend className="legend">Include in the student companion</legend>
        <label className="inline-check">
          <input
            type="checkbox"
            checked={options.includeBrief}
            onChange={(event) => patchOptions({ includeBrief: event.target.checked })}
          />
          <span>Project brief (need, opportunity, impact, line of sight)</span>
        </label>
        <label className="inline-check">
          <input
            type="checkbox"
            checked={options.includeMvrc}
            onChange={(event) => patchOptions({ includeMvrc: event.target.checked })}
          />
          <span>{MVRC_LABEL}</span>
        </label>
        <label className="inline-check">
          <input
            type="checkbox"
            checked={options.includeSuccessCriteria}
            onChange={(event) => patchOptions({ includeSuccessCriteria: event.target.checked })}
          />
          <span>Success criteria</span>
        </label>
        <label className="inline-check">
          <input
            type="checkbox"
            checked={options.includeActivities}
            onChange={(event) => patchOptions({ includeActivities: event.target.checked })}
          />
          <span>Activity instructions (discovery-reserved items stay hidden)</span>
        </label>
      </fieldset>

      <div className="layout-split" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <section>
          <h2>Included ({included.length})</h2>
          <ul className="inventory-list">
            {included.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span className="muted"> {item.reason}</span>
              </li>
            ))}
            {included.length === 0 ? <li className="muted">Nothing selected yet.</li> : null}
          </ul>
        </section>
        <section>
          <h2>Excluded or reserved ({excluded.length})</h2>
          <ul className="inventory-list">
            {excluded.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span className="muted"> {item.reason}</span>
              </li>
            ))}
            {excluded.length === 0 ? <li className="muted">Nothing withheld.</li> : null}
          </ul>
        </section>
      </div>

      <div className="eu-section">
        <h2>Create a document</h2>
        <p className="field-hint">
          Write a handout, template, or other file for students. Faculty-only documents stay out of
          the companion.
        </p>
        <TextInput
          id="doc-title"
          label="Title"
          value={draft.title}
          onChange={(title) => setDraft((current) => ({ ...current, title }))}
          wide
        />
        <SelectField
          id="doc-audience"
          label="Audience"
          value={draft.audience}
          onChange={(audience) =>
            setDraft((current) => ({ ...current, audience: audience as DocumentAudience }))
          }
          options={[
            { value: "students", label: "Students" },
            { value: "both", label: "Students and faculty" },
            { value: "faculty", label: "Faculty only" },
          ]}
        />
        <TextArea
          id="doc-body"
          label="Document body"
          value={draft.body}
          onChange={(body) => setDraft((current) => ({ ...current, body }))}
          rows={8}
          wide
        />
        <button type="button" className="btn btn-primary" onClick={addHandout}>
          Save document
        </button>
      </div>

      <div className="eu-section">
        <h2>Resources</h2>
        <p className="field-hint">
          Upload assets for distribution (PDF, images, or text). Files stay in this browser; keep
          each under 1.5 MB.
        </p>
        <SelectField
          id="upload-audience"
          label="Upload audience"
          value={uploadAudience}
          onChange={(value) => setUploadAudience(value as DocumentAudience)}
          options={[
            { value: "students", label: "Students" },
            { value: "both", label: "Students and faculty" },
            { value: "faculty", label: "Faculty only" },
          ]}
        />
        <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
          + Upload assets
        </button>
        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={(event) => {
            onUpload(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        {uploadError ? <p className="field-error">{uploadError}</p> : null}
      </div>

      {documents.length > 0 ? (
        <div className="eu-section">
          <h2>Saved documents</h2>
          <ul className="inventory-list">
            {documents.map((doc) => (
              <li key={doc.id} className="document-row">
                <div>
                  <strong>{doc.title || doc.filename}</strong>
                  <span className="muted">
                    {" "}
                    · {doc.audience} · {doc.filename}
                  </span>
                </div>
                <div className="card-actions" style={{ marginTop: 0 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => downloadAttachment(doc)}>
                    Download
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setDocuments(documents.filter((item) => item.id !== doc.id))}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="muted">
        {studentFacingDocuments(design).length} document
        {studentFacingDocuments(design).length === 1 ? "" : "s"} will go to students.
      </p>
    </div>
  );
}
