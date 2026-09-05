import { Link } from "react-router-dom";
import { primaryBigRedX } from "../domain/createDesign";
import { MVRC_DEFINITION, MVRC_LABEL, mvrcOf, patchMvrc } from "../domain/mvrc";
import { filledText } from "../domain/progress";
import { TextArea } from "../ui/fields";
import { useDesign } from "../ui/DesignContext";

export function MvrcPage() {
  const { design, update } = useDesign();
  const brx = primaryBigRedX(design);
  const mvrc = mvrcOf(design);

  return (
    <div className="stack">
      <h1>{MVRC_LABEL}</h1>
      <p className="lede">
        After you choose the Big Red X, name that floor. This is not stakeholder success
        and not the full intended impact. It is the contribution that would inform the
        decision if the uncertainty is resolved.
      </p>
      {brx ? (
        <p className="callout">
          The primary Big Red X is: {brx.statement || "untitled"}.
          {brx.decisionIfResolved ? ` If it is resolved: ${brx.decisionIfResolved}` : ""}{" "}
          <Link to={`/designs/${design.id}/big-red-x`}>Edit on the Big Red X step</Link>.
        </p>
      ) : (
        <p className="callout callout-warn">
          No primary Big Red X yet.{" "}
          <Link to={`/designs/${design.id}/big-red-x`}>Choose it on the Big Red X step</Link>
          , then name the floor here. It is {MVRC_DEFINITION}.
        </p>
      )}
      <TextArea
        id="mvrc-statement"
        label="Minimum contribution"
        hint="What students must produce, at minimum, to count as a research contribution this semester."
        value={mvrc.statement}
        onChange={(statement) => update((current) => patchMvrc(current, { statement }))}
        rows={5}
        wide
        readyOk={filledText(mvrc.statement)}
      />
      <TextArea
        id="mvrc-deliverables"
        label="Deliverables (optional)"
        hint="One student research product per line."
        value={(mvrc.deliverables ?? []).join("\n")}
        onChange={(value) =>
          update((current) => patchMvrc(current, { deliverables: value.split("\n") }))
        }
        rows={4}
        wide
      />
      <TextArea
        id="mvrc-student"
        label="Student-facing wording (optional)"
        hint="Optional wording for a student handout. If blank, they see the minimum contribution statement."
        value={mvrc.studentFacingStatement ?? ""}
        onChange={(studentFacingStatement) =>
          update((current) => patchMvrc(current, { studentFacingStatement }))
        }
        rows={5}
        wide
      />
    </div>
  );
}
