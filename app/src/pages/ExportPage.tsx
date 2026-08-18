import { useMemo, useState } from "react";
import { designToHtml, designToMarkdown } from "../domain/export";
import { displayTitle } from "../domain/createDesign";
import { downloadDesignJson, downloadTextFile } from "../persistence/storage";
import { ThreadView } from "../ui/ThreadView";
import { useDesign } from "../ui/DesignContext";

type Preview = "markdown" | "html" | "json";

export function ExportPage() {
  const { design } = useDesign();
  const [preview, setPreview] = useState<Preview>("markdown");
  const markdown = useMemo(() => designToMarkdown(design), [design]);
  const html = useMemo(() => designToHtml(design), [design]);
  const json = useMemo(() => JSON.stringify(design, null, 2), [design]);
  const slug = displayTitle(design).replace(/[^\w]+/g, "-").toLowerCase() || "emcure";

  return (
    <div className="layout-split">
      <div className="stack">
        <h1>Export</h1>
        <p className="lede">
          Faculty specification preview. JSON is the backup format and matches the
          Firestore-shaped document used later. Hidden student-discovery content is
          labeled in the faculty export; this prototype does not generate a student package.
        </p>
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
          <button
            type="button"
            className="btn btn-gold"
            onClick={() => downloadDesignJson(design)}
          >
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
      </div>
      <ThreadView design={design} compact />
    </div>
  );
}
