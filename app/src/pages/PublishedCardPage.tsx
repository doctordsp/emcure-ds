import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CARD_COMPONENTS,
  CARD_EM_OUTCOMES,
  CARD_FORMATS,
  CARD_STAGES,
  YEAR_LEVELS,
  cardDisplayId,
} from "../domain/card";
import { isSupabaseConfigured } from "../persistence/supabase";
import { getPublishedCardBySlug, publishedImageSrc } from "../persistence/publish";
import type { PublishedCardRow } from "../domain/publish";

function labels(
  options: readonly { id: string; label: string }[],
  selected: string[],
): string {
  return options
    .filter((item) => selected.includes(item.id))
    .map((item) => item.label)
    .join(", ");
}

export function PublishedCardPage() {
  const { slug } = useParams();
  const [row, setRow] = useState<PublishedCardRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    if (!isSupabaseConfigured()) {
      setError("This card gallery is not connected to a database.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    void getPublishedCardBySlug(slug)
      .then((found) => {
        if (cancelled) return;
        setRow(found);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        setError(caught instanceof Error ? caught.message : "Could not load this card.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="public-card">
        <p>Loading card…</p>
      </div>
    );
  }

  if (error || !row) {
    return (
      <div className="public-card">
        <h1>Card not found</h1>
        <p className="lede">
          {error ??
            "This unlisted link is missing, unpublished, or the project is paused on the free tier."}
        </p>
        <Link className="btn btn-secondary" to="/">
          EM-CURE Design Studio
        </Link>
      </div>
    );
  }

  const card = row.card;
  const image = publishedImageSrc(row);
  const year = YEAR_LEVELS.find((item) => item.id === card.yearLevel)?.label || card.yearLevel;
  const outcomeGroups = ["Curiosity", "Connections", "Creating Value"] as const;

  return (
    <article className="public-card">
      <p className="muted">EM-CURE card · {cardDisplayId(row.design_id)}</p>
      <h1>{card.title || "EM-CURE"}</h1>
      {card.author ? <p className="lede">by {card.author}</p> : null}
      {image ? <img className="public-card-image" src={image} alt="" /> : null}
      <dl className="public-card-meta">
        {year ? (
          <>
            <dt>Year level</dt>
            <dd>{year}</dd>
          </>
        ) : null}
        {card.course ? (
          <>
            <dt>Course</dt>
            <dd>{card.course}</dd>
          </>
        ) : null}
        {card.category ? (
          <>
            <dt>Category</dt>
            <dd>
              {card.category}
              {card.subCategory ? ` · ${card.subCategory}` : ""}
            </dd>
          </>
        ) : null}
      </dl>
      <Section title="Problem / Need" body={card.problemNeed} />
      <Section title="Description" body={card.description} />
      <Section title="Materials" body={card.materials} />
      <Section title="Entrepreneurial mindset" body={card.emComments} />
      <section>
        <h2>Educational outcomes</h2>
        {outcomeGroups.map((group) => {
          const items = CARD_EM_OUTCOMES.filter(
            (item) => item.group === group && card.emOutcomeIds.includes(item.id),
          );
          if (items.length === 0) return null;
          return (
            <div key={group}>
              <h3>{group}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item.id}>{item.label}</li>
                ))}
              </ul>
            </div>
          );
        })}
        <Section title="Learning objectives" body={card.learningObjectives} asDiv />
      </section>
      <section>
        <h2>Programming</h2>
        <p>Stages: {labels(CARD_STAGES, card.stages) || "-"}</p>
        <p>Components: {labels(CARD_COMPONENTS, card.components) || "-"}</p>
        <p>Format: {labels(CARD_FORMATS, card.formats) || "-"}</p>
      </section>
      <Section title="Assessment" body={card.assessment} />
      <Section title="Summary" body={card.summary} />
      {card.acknowledgments || card.references || card.license ? (
        <section>
          <h2>Authoring details</h2>
          {card.acknowledgments ? <p style={{ whiteSpace: "pre-wrap" }}>{card.acknowledgments}</p> : null}
          {card.references ? <p>References: {card.references}</p> : null}
          {card.license ? <p>License: {card.license}</p> : null}
        </section>
      ) : null}
      <p className="muted">Unlisted snapshot · published {new Date(row.published_at).toLocaleString()}</p>
    </article>
  );
}

function Section({
  title,
  body,
  asDiv,
}: {
  title: string;
  body: string;
  asDiv?: boolean;
}) {
  if (!body.trim()) return null;
  const Heading = asDiv ? "h3" : "h2";
  return (
    <section>
      <Heading>{title}</Heading>
      <p style={{ whiteSpace: "pre-wrap" }}>{body}</p>
    </section>
  );
}
