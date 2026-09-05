/** Free-tier cap so jsonb rows and the 1 GB Storage quota stay small. */
export const MAX_ASSET_BYTES = 2_000_000;

export const FEATURED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export function assetTooLargeMessage(kind = "file"): string {
  return `Keep each ${kind} under 2 MB (Supabase Free storage quota).`;
}
