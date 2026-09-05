import { useMemo, useState } from "react";
import { displayTitle } from "../domain/createDesign";
import {
  defaultStudentPackageOptions,
  studentPackageHtml,
  studentPackageMarkdown,
} from "../domain/studentPackage";
import { studentPackageDocx } from "../domain/studentPackageDocx";
import { downloadBlob, downloadTextFile } from "../persistence/storage";
import { useDesign } from "./DesignContext";

type HandoutFormat = "html" | "markdown" | "word";

export function StudentDocumentsPanel() {
  const { design } = useDesign();
  const [format, setFormat] = useState<HandoutFormat>("word");
  const slug = displayTitle(design).replace(/[^\w]+/g, "-").toLowerCase() || "emcure";
  const studentDesign = useMemo(
    () => ({ ...design, studentPackageOptions: defaultStudentPackageOptions() }),
    [design],
  );
  const markdown = useMemo(() => studentPackageMarkdown(studentDesign), [studentDesign]);
  const html = useMemo(() => studentPackageHtml(studentDesign), [studentDesign]);

  return (
    <div className="stack">
      <h2>Handouts for students</h2>
      <div className="public-page-intro">
        <p className="muted">
          This draft is generated from this EM-CURE. Use it as a starting point and edit after you
          download. It is not the public page.
        </p>
        <p className="muted">
          Word is a .docx for Microsoft Word or Google Docs. Markdown is a plain-text draft. HTML is
          for printing. Faculty notes and discovery-reserved instructions are not included.
        </p>
      </div>

      <div className="export-download-row">
        <span className="export-format-label" id="handout-format-label">
          Format:
        </span>
        <div className="pill-row" role="tablist" aria-labelledby="handout-format-label">
          {(
            [
              ["word", "Word"],
              ["markdown", "Markdown"],
              ["html", "HTML"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={format === id}
              className={format === id ? "btn btn-primary" : "btn btn-secondary"}
              onClick={() => setFormat(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => {
            if (format === "markdown") {
              downloadTextFile(`${slug}-student-handout.md`, markdown, "text/markdown");
            } else if (format === "html") {
              downloadTextFile(`${slug}-student-handout.html`, html, "text/html");
            } else {
              void studentPackageDocx(studentDesign).then((blob) =>
                downloadBlob(`${slug}-student-handout.docx`, blob),
              );
            }
          }}
        >
          Download
        </button>
      </div>
      <pre className="preview" tabIndex={0}>
        {format === "html" ? html : markdown}
      </pre>
    </div>
  );
}
