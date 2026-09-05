# Dedicated Supabase project (Free tier)

EM-CURE uses a **second Free-tier project** so schema and RLS stay isolated from any other app. Limits that matter: 2 active projects, 500 MB database, 1 GB file storage, pause after ~7 days of low activity.

## Create the project

1. In the [Supabase dashboard](https://supabase.com/dashboard), create a new project (this is the second Free slot).
2. Authentication → Providers → enable **Email**. Magic links are enough; Google is optional.
3. Authentication → URL Configuration:
   - Site URL: `http://localhost:5173` for local work, then the GCS origin for production.
   - Redirect URLs: `http://localhost:5173/**` and `https://storage.googleapis.com/ai-app-directory/emcure-design-studio/**`.
4. SQL Editor → paste and run [`schema.sql`](schema.sql). That creates `designs`, `published_cards`, the unlisted-by-slug RPC, and Storage buckets `design-assets` (private) and `card-images` (public read).

## App env

In `app/.env.local` (never commit the anon key if you treat it as sensitive, it ships in the SPA by design, RLS is the boundary):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Rebuild or restart Vite. Without these variables the studio keeps using `localStorage`.

Do **not** put Anthropic or OpenAI keys in Supabase or in `VITE_*`. The AI proxy stays on Cloud Run.

## After a pause

Free projects pause after a week of inactivity. Restore from the dashboard. Faculty designs come back. Live `/c/:slug` links fail until restore. Upload pause-proof HTML with `scripts/upload-published-card.sh` if a share link must stay up.
