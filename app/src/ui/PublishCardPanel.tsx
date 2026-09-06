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
  const [reset, setReset] = useState(false);

  const card = resolvedCard(design);
  const slug = published?.slug ?? cardSlug(card.title || displayTitle(design), design.id);
  const shareUrl = publishedCardShareUrl(slug);

  async function downloadCardHtml() {
    const imageSrc = await resolveCardImageSrc({
      dataUrl: card.featuredImageDataUrl,
      path: card.featuredImagePath,
      publishedPath: published?.image_path,
    });
    const html = cardFieldsToHtml(cardForPublicOutput(design), imageSrc, published ? shareUrl : undefined);
    downloadTextFile(`${slug}.html`, html, "text/html");
  }

  const resetButton = (
    <button
      type="button"
      className={`btn btn-secondary${reset ? " is-flashing" : ""}`}
      onClick={() => {
        onResetFields();
        setReset(true);
        window.setTimeout(() => setReset(false), 600);
      }}
    >
      {reset ? "Fields reset" : "Reset fields from design"}
    </button>
  );

  const downloadButton = (
    <button type="button" className="btn btn-secondary" onClick={() => void downloadCardHtml()}>
      Download HTML
    </button>
  );

  if (!configured) {
    return (
      <>
        <div className="card-actions">
          {downloadButton}
          {resetButton}
        </div>
        <p className="muted">
          Download HTML gives you a standalone page you can host anywhere.
        </p>
      </>
    );
  }

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

  if (!user) {
    return (
      <>
        <div className="card-actions">
          {downloadButton}
          {resetButton}
        </div>
        <p className="muted">
          Download HTML gives you a standalone page you can host anywhere. Sign in to publish a
          snapshot with a shareable link instead.
        </p>
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
        {downloadButton}
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
      <p className="muted">
        Publish hosts the page here and gives you a link to share. The link stays up while the
        project is active, so treat it as provisional. Download HTML gives you a standalone copy
        of the same page to host wherever you like, which nothing here can take down.
      </p>
      {status ? <p role="status">{status}</p> : null}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
