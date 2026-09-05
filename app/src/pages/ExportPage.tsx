import { useMemo, useState } from "react";
import { designToHtml, designToMarkdown } from "../domain/export";
import { displayTitle } from "../domain/createDesign";
import { downloadDesignJson, downloadTextFile } from "../persistence/storage";
import { CardEditor } from "../ui/CardEditor";
import { RubricDeveloper } from "../ui/RubricDeveloper";
import { StudentDocumentsPanel } from "../ui/StudentDocumentsPanel";
import { useDesign } from "../ui/DesignContext";

type PackageTab = "faculty" | "card" | "students" | "rubric";
type Preview = "markdown" | "html" | "json";

export function ExportPage() {
  const { design } = useDesign();
  const [tab, setTab] = useState<PackageTab>("faculty");
  const [preview, setPreview] = useState<Preview>("markdown");
  const markdown = useMemo(() => designToMarkdown(design), [design]);
  const html = useMemo(() => designToHtml(design), [design]);
  const json = useMemo(() => JSON.stringify(design, null, 2), [design]);
  const slug = displayTitle(design).replace(/[^\w]+/g, "-").toLowerCase() || "emcure";

  return (
    <div className="stack">
      <h1>Export</h1>
      <p className="lede">
        Choose an EM-CURE specification, a public page, a student document, or a rubric
        aligned to this EM-CURE. Hidden discovery content is labeled in the specification and
        withheld from the student document.
      </p>
      <div className="pill-row export-tabs" role="tablist" aria-label="Export package">
        {(
          [
            ["faculty", "EM-CURE specification"],
            ["card", "Public page"],
            ["students", "Student document"],
            ["rubric", "Rubric developer"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "faculty" ? (
        <>
          <div className="export-download-row">
            <span className="export-format-label" id="spec-format-label">
              Format:
            </span>
            <div className="pill-row" role="tablist" aria-labelledby="spec-format-label">
              {(
                [
                  ["markdown", "Markdown"],
                  ["html", "HTML"],
                  ["json", "JSON"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={preview === id}
                  className={preview === id ? "btn btn-primary" : "btn btn-secondary"}
                  onClick={() => setPreview(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-gold"
              onClick={() => {
                if (preview === "markdown") {
                  downloadTextFile(`${slug}.md`, markdown, "text/markdown");
                } else if (preview === "html") {
                  downloadTextFile(`${slug}.html`, html, "text/html");
                } else {
                  downloadDesignJson(design);
                }
              }}
            >
              Download
            </button>
          </div>
          <pre className="preview" tabIndex={0}>
            {preview === "markdown" ? markdown : preview === "html" ? html : json}
          </pre>
        </>
      ) : null}

      {tab === "card" ? <CardEditor onOpenStudentDocuments={() => setTab("students")} /> : null}
      {tab === "students" ? <StudentDocumentsPanel /> : null}
      {tab === "rubric" ? <RubricDeveloper /> : null}
    </div>
  );
}
