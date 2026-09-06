import type { EmcureCard } from "./types";

const SLUG_MAX = 48;

export type PublishedVisibility = "unlisted" | "public";

export interface PublishedCardRow {
  id: string;
  owner_id: string;
  design_id: string;
  slug: string;
  visibility: PublishedVisibility;
  published_at: string;
  card: EmcureCard;
  image_path: string | null;
}

/** Student-safe snapshot: card fields only, no inline data URLs. */
export function studentSafeCard(card: EmcureCard): EmcureCard {
  const { featuredImageDataUrl: _inline, ...rest } = card;
  return { ...rest };
}

export function cardSlug(title: string, designId: string): string {
  const base =
    title
      .toLowerCase()
      .replace(/[^\w]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, SLUG_MAX) || "emcure";
  const suffix = designId.replace(/-/g, "").slice(0, 8);
  return `${base}-${suffix}`;
}

export function publicAppUrl(path = ""): string {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const base = import.meta.env.BASE_URL || "/";
  const trimmedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${trimmedBase}${trimmedPath}`;
}

// GCS serves index.html and nothing else, so the slug rides in the query string.
// A /c/<slug> path has no object behind it and returns NoSuchKey.
export function publishedCardSharePath(slug: string): string {
  return `/index.html?c=${encodeURIComponent(slug)}`;
}

export function publishedCardShareUrl(slug: string): string {
  return publicAppUrl(publishedCardSharePath(slug));
}
