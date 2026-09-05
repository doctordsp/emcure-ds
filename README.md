# EM-CURE Design Studio

A faculty tool for designing an entrepreneurially minded course-based undergraduate research experience (EM-CURE).

This is a **draft**. Designs save in this browser until you sign in to a dedicated **Supabase Free** project. Optional AI (Claude or ChatGPT) can be enabled on **Setup AI API** via a time-limited passcode and a small Cloud Run proxy. Provider keys never ship in the JavaScript.

## Run

```bash
cd app
cp .env.example .env.local
npm install
npm run dev
```

Cloud save and published cards need `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. See [`supabase/README.md`](supabase/README.md) to create the second Free-tier project and run [`supabase/schema.sql`](supabase/schema.sql).

See `app/README.md` for tests, export, and usage. The optional AI proxy (keys stay off the static site) is in `proxy/`. Pause-proof published cards can be uploaded with `scripts/upload-published-card.sh`.

License: MIT (Copyright 2026 doctordsp)
