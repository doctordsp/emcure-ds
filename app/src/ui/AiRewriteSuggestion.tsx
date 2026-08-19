import { useState, type ReactNode } from "react";
import { complete } from "../ai/client";
import {
  cardRewriteLabel,
  cardRewritePrompt,
  normalizeRewrite,
  type CardRewriteField,
} from "../ai/cardRewrite";
import { cardAiRewriteEnabled } from "../ai/featureFlags";
import { TextArea } from "./fields";

export function AiRewriteSuggestion({
  field,
  fillAction,
  id,
  label,
  hint,
  value,
  onChange,
  rows,
  wide,
}: {
  field: CardRewriteField;
  fillAction: ReactNode;
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  wide?: boolean;
}) {
  const enabled = cardAiRewriteEnabled();
  const [draft, setDraft] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function suggest() {
    setError(null);
    if (!value.trim()) {
      setError(`Write or fill ${cardRewriteLabel(field)} first, then suggest a rewrite.`);
      return;
    }
    setBusy(true);
    try {
      const raw = await complete([{ role: "user", content: cardRewritePrompt(field, value) }]);
      setDraft(normalizeRewrite(raw));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Rewrite failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rewrite-field">
      <TextArea
        id={id}
        label={label}
        hint={hint}
        value={value}
        onChange={onChange}
        rows={rows}
        wide={wide}
        action={
          <span className="field-actions">
            {fillAction}
            {enabled ? (
              <button
                type="button"
                className="btn-fill"
                disabled={busy}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void suggest();
                }}
              >
                {busy ? "Rewriting…" : "Suggest rewrite"}
              </button>
            ) : null}
          </span>
        }
      />
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      {draft !== null ? (
        <div
          className="ai-suggestion"
          role="region"
          aria-label={`Suggested rewrite for ${cardRewriteLabel(field)}`}
        >
          <p className="muted">
            Suggested rewrite. Accept, edit, or dismiss — the card field stays as-is until you
            accept.
          </p>
          <textarea
            rows={Math.max(4, rows ?? 4)}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label={`Edit suggested ${cardRewriteLabel(field)}`}
          />
          <div className="card-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onChange(draft);
                setDraft(null);
                setError(null);
              }}
            >
              Accept
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setDraft(null);
                setError(null);
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
