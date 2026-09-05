# EM-CURE Design Studio

Faculty prototype for designing an entrepreneurially minded course-based undergraduate research experience (EM-CURE). Designs save in this browser, or in a dedicated Supabase Free project after you sign in with a magic link.

## Run

```bash
cd app
npm install
npm run dev
```

## Test

```bash
npm test
```

Alignment rules live in `src/domain/alignment.ts` and run independently of the UI.

## Use

1. Sign in (optional) so the library follows you across browsers. Import existing browser designs when prompted.
2. Start from scratch, or start from the stormwater example.
3. Select a few Habits of EM and/or Observable Behaviors.
4. Build need → opportunity → intended impact.
5. Compare uncertainties and justify a Big Red X.
6. Link an investigation activity to that Big Red X.
7. Review alignment findings and export Markdown, HTML, JSON, a public card, or a student companion.
8. On **Create a Card**, publish an unlisted snapshot for a shareable `/c/:slug` link. Faculty notes are not included.

**Create a Card** prefills from the design. Use **Fill from design** on a field to refresh that field only. **Reset fields from design** rewrites the whole card except author and image.

AI rewrite of Description, Problem / Need, and Summary is available when an AI API is connected on **Setup AI API**. Suggestions must be accepted, edited, or dismissed; the card is never overwritten on arrival. Deterministic fill works without a model.

**Rubric developer** on Export drafts a student-performance / EM / course-evaluation rubric from the design. **Draft from design** works without a model; **Suggest with AI** uses the proxy. Accept, edit, or dismiss, the saved rubric is never overwritten on arrival.

Copy `app/.env.example` to `app/.env.local` and set:

- `VITE_AI_PROXY_URL`, Cloud Run (or local) proxy URL. Provider keys belong only in `proxy/` environment variables.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, dedicated EM-CURE project. See `supabase/README.md`.

JSON documents are stored as `designs.body` jsonb (owner RLS) or as `localStorage` keys when you are signed out.
