import { useMemo, useState } from "react";
import { designToHtml, designToMarkdown } from "../domain/export";
import { displayTitle } from "../domain/createDesign";
import { downloadDesignJson, downloadTextFile } from "../persistence/storage";
import { CardEditor } from "../ui/CardEditor";
import { StudentDocumentsPanel } from "../ui/StudentDocumentsPanel";
import { ThreadView } from "../ui/ThreadView";
import { useDesign } from "../ui/DesignContext";

type PackageTab = "faculty" | "card" | "students";
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
    <div className={tab === "faculty" ? "layout-split" : "stack"}>
      <div className="stack">
        <h1>Export</h1>
        <p className="lede">
          Choose a faculty specification, a public card, or student-facing documents. Hidden
          discovery content is labeled in the faculty export and withheld from the student package.
        </p>
        <div className="pill-row" role="tablist" aria-label="Export package">
          {(
            [
              ["faculty", "Faculty specification"],
              ["card", "Create a Card"],
              ["students", "Student documents"],
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
            <div className="card-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => downloadTextFile(`${slug}.md`, markdown, "text/markdown")}
              >
                Download Markdown
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => downloadTextFile(`${slug}.html`, html, "text/html")}
              >
                Download printable HTML
              </button>
              <button type="button" className="btn btn-gold" onClick={() => downloadDesignJson(design)}>
                Download JSON
              </button>
            </div>
            <div className="pill-row" role="tablist" aria-label="Preview format">
              {(["markdown", "html", "json"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={preview === item}
                  className={preview === item ? "btn btn-primary" : "btn btn-secondary"}
                  onClick={() => setPreview(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <pre className="preview" tabIndex={0}>
              {preview === "markdown" ? markdown : preview === "html" ? html : json}
            </pre>
          </>
        ) : null}

        {tab === "card" ? <CardEditor onOpenStudentDocuments={() => setTab("students")} /> : null}
        {tab === "students" ? <StudentDocumentsPanel /> : null}
      </div>
      {tab === "faculty" ? <ThreadView design={design} compact /> : null}
    </div>
  );
}
