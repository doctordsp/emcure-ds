# Dedicated Supabase project (Free tier)

EM-CURE uses a **second Free-tier project** so schema and RLS stay isolated from any other app. Limits that matter: 2 active projects, 500 MB database, 1 GB file storage, pause after ~7 days of low activity.

## Create the project

1. In the [Supabase dashboard](https://supabase.com/dashboard), create a new project (this is the second Free slot).
2. Authentication → Sign In / Providers → **Email**:
   - Leave **Enable email provider** on. That is email + password. There is no separate toggle with that name. Password length and password-change settings on this screen mean password login is already available.
   - Leave magic-link / OTP settings as they are if you see them. The studio never sends a magic link; it only calls email + password (and Forgot password).
   - **Allow new users to sign up** is not on this Email card. Find it under Authentication settings (sometimes labeled User Signups) and **turn it off**. The studio is invite-only. Strangers must not create accounts with the anon key.
3. Authentication → URL Configuration (invite and password-recovery emails use these):
   - **Site URL** (production): `https://storage.googleapis.com/ai-app-directory/emcure-design-studio/index.html`
     GCS will not load the studio at the folder URL that ends in `/emcure-design-studio/`. Always include `index.html`.
   - **Redirect URLs** (Add each, then Save):
     - `http://localhost:5173`
     - `http://localhost:5173/**`
     - `https://storage.googleapis.com/ai-app-directory/emcure-design-studio/index.html`
     - `https://storage.googleapis.com/ai-app-directory/emcure-design-studio/**`
   After you change Site URL, do not reuse an old invite or recovery email. Send a new one.
4. SQL Editor → paste and run [`schema.sql`](schema.sql). That creates `designs`, `published_cards`, the unlisted-by-slug RPC, and Storage buckets `design-assets` (private) and `card-images` (public read).
5. Authentication → Users → **Invite** each faculty email (or Add user). That list is the allowlist: only those accounts can sign in. The studio has no public Create account.

### Existing magic-link accounts

If you already signed in with a magic link, the user row exists but may have no password. Open the user → **Send password recovery**. Set a password from the studio, then sign in with email + password. Day-to-day sign-in does not send mail and does not hit the magic-link rate limit.

### Set a password from an invite or recovery email

1. Confirm Site URL is the `index.html` URL above, not the folder URL.
2. Authentication → Users: open the faculty user → **Send password recovery** (or Invite if they have no user row yet).
3. Open the new email. The link must contain `/emcure-design-studio/index.html` before any `?` or `#`. If it does not, the window will be blank.
4. After the redirect the studio header shows **Set password** with a password box. The landing URL carries the token in the fragment (`index.html#access_token=...&type=recovery`); the studio uses the implicit flow, so any browser works. Choose a password (at least 6 characters) and Save.
5. Sign out, then sign in with that email and password. Recovery links are single use, so do not click the old email again. An expired or reused link now says so in the header instead of showing a plain sign-in form.

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
