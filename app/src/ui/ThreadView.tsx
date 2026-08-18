import { useNavigate, useParams } from "react-router-dom";
import { threadNodes } from "../domain/thread";
import type { EmcureDesign } from "../domain/types";

export function ThreadView({
  design,
  compact = false,
}: {
  design: EmcureDesign;
  compact?: boolean;
}) {
  const navigate = useNavigate();
  const { designId } = useParams();
  const nodes = threadNodes(design);

  return (
    <aside className="thread" aria-labelledby="thread-heading">
      <h2 id="thread-heading">{compact ? "Thread" : "Opportunity-to-Impact Thread"}</h2>
      {!compact ? (
        <p className="muted">
          Solid connectors are supported links. Dashed connectors mark gaps. Selecting a
          node opens its editor.
        </p>
      ) : null}
      <ol>
        {nodes.map((node, index) => {
          const previous = nodes[index - 1];
          const connected = Boolean(previous?.filled && node.filled);
          return (
            <li key={node.key}>
              {index > 0 ? (
                <div
                  className={connected ? "thread-connector" : "thread-connector dashed"}
                  aria-hidden="true"
                />
              ) : null}
              <button
                type="button"
                className={`thread-node ${node.filled ? "filled" : "gap"} ${node.key}`}
                onClick={() => navigate(`/designs/${designId}/${node.route}`)}
              >
                <span className="thread-marker" aria-hidden="true" />
                <span>
                  <strong>
                    {node.label}
                    {node.key === "brx" ? <span aria-hidden="true"> ✕</span> : null}
                  </strong>
                  <span className="sr-only">
                    {node.filled ? ", complete" : ", gap"}
                  </span>
                  <br />
                  <span className="muted">
                    {node.filled ? node.summary : node.gap}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
