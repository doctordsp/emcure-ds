import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { YEAR_LEVELS } from "../domain/card";
import { publishedCardSharePath, type PublishedCardRow } from "../domain/publish";
import { listPublicCards, publishedImageSrc } from "../persistence/publish";
import { isSupabaseConfigured } from "../persistence/supabase";

export function PublicCardsPage() {
  const configured = isSupabaseConfigured();
  const [rows, setRows] = useState<PublishedCardRow[]>([]);
  const [error, setError] = useState<string | null>(
    configured ? null : "Public cards are not connected to a database.",
  );
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    void listPublicCards()
      .then((found) => {
        if (cancelled) return;
        setRows(found);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        setError(caught instanceof Error ? caught.message : "Could not load public cards.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [configured]);

  return (
    <div className="dashboard">
      <header className="app-header">
        <h1 className="site-title">Public cards</h1>
        <div className="header-tools">
          <div className="header-actions">
            <Link className="btn btn-secondary" to="/">
              EM-CURE Design Studio
            </Link>
          </div>
        </div>
      </header>
      <main id="main">
        <p className="lede">
          Student-facing EM-CURE cards that faculty have listed as public. Studio designs stay
          private.
        </p>
        {loading ? <p>Loading public cards…</p> : null}
        {error ? (
          <p className="callout callout-warn" role="alert">
            {error}
          </p>
        ) : null}
        {!loading && !error && rows.length === 0 ? (
          <div className="card">
            <h2>Nothing public yet</h2>
            <p>
              When a faculty author checks Public card on an owned EM-CURE in the library, it
              appears here.
            </p>
          </div>
        ) : null}
        {rows.length > 0 ? (
          <div className="card-grid">
            {rows.map((row) => {
              const year =
                YEAR_LEVELS.find((item) => item.id === row.card.yearLevel)?.label ||
                row.card.yearLevel;
              const image = publishedImageSrc(row);
              return (
                <article className="card" key={row.id}>
                  {image ? (
                    <img className="gallery-card-image" src={image} alt="" />
                  ) : null}
                  <h3>
                    <Link className="card-link" to={publishedCardSharePath(row.slug)}>
                      {row.card.title || "EM-CURE"}
                    </Link>
                  </h3>
                  {row.card.author ? <p className="muted">by {row.card.author}</p> : null}
                  <p className="muted">
                    {[year, row.card.course].filter(Boolean).join(" · ") || "-"}
                  </p>
                  <div className="card-actions">
                    <Link className="btn btn-primary" to={publishedCardSharePath(row.slug)}>
                      View card
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </main>
    </div>
  );
}
