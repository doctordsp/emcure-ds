import { useState } from "react";
import {
  dismissLocalImport,
  importLocalDesignsToCloud,
  localDesignsPendingImport,
} from "../persistence/importLocal";
import { useAuth } from "./AuthContext";

export function LocalImportBanner({ onImported }: { onImported: () => void }) {
  const { user } = useAuth();
  const [pending] = useState(() => localDesignsPendingImport());
  const [visible, setVisible] = useState(pending.length > 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || !visible || pending.length === 0) return null;

  return (
    <div className="callout" role="status">
      <p>
        This browser has {pending.length} EM-CURE{pending.length === 1 ? "" : "s"} saved locally.
        Import them into your cloud library? Existing ids are kept.
      </p>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="card-actions" style={{ marginTop: 8 }}>
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            setError(null);
            void importLocalDesignsToCloud()
              .then(() => {
                setVisible(false);
                onImported();
              })
              .catch((caught: unknown) => {
                setError(caught instanceof Error ? caught.message : "Import failed.");
              })
              .finally(() => setBusy(false));
          }}
        >
          {busy ? "Importing…" : "Import from this browser"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={busy}
          onClick={() => {
            dismissLocalImport();
            setVisible(false);
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
