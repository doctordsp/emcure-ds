import { useState } from "react";

const DISMISS_KEY = "emcure.draftNotice.dismissed.v1";

export function DraftNoticeBanner() {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) !== "1";
    } catch {
      return true;
    }
  });

  if (!visible) return null;

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode: hide for this visit only */
    }
    setVisible(false);
  }

  return (
    <div className="draft-banner" role="status" aria-labelledby="draft-notice-heading">
      <div>
        <h2 id="draft-notice-heading" className="draft-banner-kicker">
          Draft
        </h2>
        <p>
          This EM-CURE Design Studio is a draft. There is no backend database for
          persistence; designs save in this browser only. Optional AI is off until you
          connect a model on Setup AI API.
        </p>
      </div>
      <button type="button" className="btn btn-secondary" onClick={dismiss}>
        Dismiss
      </button>
    </div>
  );
}
