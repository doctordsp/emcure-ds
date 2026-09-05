import { useState } from "react";
import { cardFieldsToHtml, cardForPublicOutput, resolvedCard } from "../domain/card";
import { displayTitle } from "../domain/createDesign";
import {
  cardSlug,
  publishedCardShareUrl,
  type PublishedCardRow,
} from "../domain/publish";
import { resolveCardImageSrc } from "../persistence/assets";
import { publishCard, unpublishCard } from "../persistence/publish";
import { downloadTextFile } from "../persistence/storage";
import { useAuth } from "../auth/AuthContext";
import { useDesign } from "./DesignContext";

export function PublishCardPanel({
  published,
  onPublishedChange,
  onResetFields,
}: {
  published: PublishedCardRow | null;
  onPublishedChange: (row: PublishedCardRow | null) => void;
  onResetFields: () => void;
}) {
  const { design } = useDesign();
  const { configured, user } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const resetButton = (
    <button type="button" className="btn btn-secondary" onClick={onResetFields}>
      Reset fields from design
    </button>
  );

  if (!configured) {
    return <div className="card-actions">{resetButton}</div>;
  }

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
        card: cardForPublicOutput(design),
      });
      onPublishedChange(row);
      setStatus(
        row.visibility === "public"
          ? "Published snapshot updated. It stays listed in the Public Gallery until you uncheck Public EM-CURE in the library."
          : "Published an unlisted snapshot. Anyone with the link can view it. Use Public EM-CURE in the library to list it.",
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
      onPublishedChange(null);
      setStatus("Unpublished. The live link no longer resolves.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unpublish failed.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadFallbackHtml() {
    const imageSrc = await resolveCardImageSrc({
      dataUrl: card.featuredImageDataUrl,
      path: card.featuredImagePath,
      publishedPath: published?.image_path,
    });
    const html = cardFieldsToHtml(cardForPublicOutput(design), imageSrc, shareUrl);
    downloadTextFile(`${slug}.html`, html, "text/html");
  }

  if (!user) {
    return (
      <>
        <p className="muted">Sign in to publish a snapshot with a shareable link.</p>
        <div className="card-actions">{resetButton}</div>
      </>
    );
  }

  return (
    <>
      <div className="card-actions">
        {published ? (
          <>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={() => void onPublish()}
            >
              {busy ? "Updating…" : "Update live page"}
            </button>
            {resetButton}
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
        ) : (
          <>
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void onPublish()}>
              {busy ? "Publishing…" : "Publish"}
            </button>
            {resetButton}
          </>
        )}
      </div>
      {published ? (
        <p>
          Live at{" "}
          <a href={shareUrl} target="_blank" rel="noreferrer">
            {shareUrl}
          </a>
          <span className="muted"> · snapshot {new Date(published.published_at).toLocaleString()}</span>
        </p>
      ) : null}
      <details className="publish-fallback">
        <summary>If the live link goes down</summary>
        <p className="muted">
          Free-tier projects pause after a week of inactivity, which takes the live link down.
          Download this page as HTML and upload it to{" "}
          <code>gs://ai-app-directory/emcure-design-studio/c/{slug}/index.html</code> (see{" "}
          <code>scripts/upload-published-card.sh</code>) if the share link must stay up.
        </p>
        <button type="button" className="btn btn-ghost" onClick={() => void downloadFallbackHtml()}>
          Download HTML
        </button>
      </details>
      {status ? <p role="status">{status}</p> : null}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
