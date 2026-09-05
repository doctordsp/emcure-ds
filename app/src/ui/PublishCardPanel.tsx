import { useEffect, useState } from "react";
import { cardDisplayId, cardFieldsToHtml, resolvedCard } from "../domain/card";
import { displayTitle } from "../domain/createDesign";
import {
  cardSlug,
  publishedCardShareUrl,
  type PublishedCardRow,
} from "../domain/publish";
import { downloadTextFile } from "../persistence/storage";
import { resolveCardImageSrc } from "../persistence/assets";
import { getPublishedCardForDesign, publishCard, unpublishCard } from "../persistence/publish";
import { useAuth } from "../auth/AuthContext";
import { useDesign } from "./DesignContext";

export function PublishCardPanel() {
  const { design } = useDesign();
  const { configured, user } = useAuth();
  const [published, setPublished] = useState<PublishedCardRow | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!configured || !user) {
      setPublished(null);
      return;
    }
    let cancelled = false;
    void getPublishedCardForDesign(design.id)
      .then((row) => {
        if (!cancelled) setPublished(row);
      })
      .catch(() => {
        if (!cancelled) setPublished(null);
      });
    return () => {
      cancelled = true;
    };
  }, [configured, user, design.id]);

  if (!configured) return null;

  const card = resolvedCard(design);
  const slug = published?.slug ?? cardSlug(card.title || displayTitle(design), design.id);
  const shareUrl = publishedCardShareUrl(slug);

  async function onPublish() {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const row = await publishCard({
        designId: design.id,
        slug,
        card,
      });
      setPublished(row);
      setStatus(
        row.visibility === "public"
          ? "Published snapshot updated. It stays listed in Public cards until you uncheck Public card in the library."
          : "Published an unlisted snapshot. Anyone with the link can view it. Use Public card in the library to list it.",
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Publish failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onUnpublish() {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      await unpublishCard(design.id);
      setPublished(null);
      setStatus("Unpublished. The live link no longer resolves. Pause-proof HTML you already uploaded to GCS is unchanged.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unpublish failed.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadPauseProofHtml() {
    const imageSrc = await resolveCardImageSrc({
      dataUrl: card.featuredImageDataUrl,
      path: card.featuredImagePath,
      publishedPath: published?.image_path,
    });
    const html = cardFieldsToHtml(card, cardDisplayId(design.id), imageSrc);
    downloadTextFile(`${slug}-card.html`, html, "text/html");
  }

  if (!user) {
    return (
      <div className="eu-section">
        <h2>Publish card</h2>
        <p className="muted">Sign in to publish a snapshot with a shareable link.</p>
      </div>
    );
  }

  return (
    <div className="eu-section">
      <h2>Publish card</h2>
      <p className="field-hint">
        Publishing copies the card as it stands now. Later studio edits do not change the live
        page until you update the published copy. Faculty specification, rubric notes, and
        discovery-reserved text are not included. Gallery listing is the Public card checkbox in
        the library, not this panel.
      </p>
      {published ? (
        <p>
          Live at{" "}
          <a href={shareUrl} target="_blank" rel="noreferrer">
            {shareUrl}
          </a>
          <span className="muted"> · snapshot {new Date(published.published_at).toLocaleString()}</span>
        </p>
      ) : (
        <p className="muted">Not published yet.</p>
      )}
      {published?.visibility === "public" ? (
        <p className="muted">
          Listed in Public cards. Uncheck Public card in the library to keep the link only.
        </p>
      ) : (
        <p className="muted">
          Share link only. Check Public card in the library to list this in Public cards. The
          studio design stays private.
        </p>
      )}
      <div className="card-actions" style={{ marginTop: 0 }}>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void onPublish()}>
          {published ? (busy ? "Updating…" : "Update published copy") : busy ? "Publishing…" : "Publish"}
        </button>
        {published ? (
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                void navigator.clipboard.writeText(shareUrl).then(() => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              }}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={busy}
              onClick={() => void onUnpublish()}
            >
              Unpublish
            </button>
          </>
        ) : null}
        <button type="button" className="btn btn-ghost" onClick={() => void downloadPauseProofHtml()}>
          Download pause-proof HTML
        </button>
      </div>
      <p className="muted">
        Free-tier projects pause after a week of inactivity, which takes the live link down. Upload
        the pause-proof HTML to{" "}
        <code>gs://ai-app-directory/emcure-design-studio/c/{slug}/index.html</code> (see{" "}
        <code>scripts/upload-published-card.sh</code>) if the share link must stay up.
      </p>
      {status ? <p role="status">{status}</p> : null}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
