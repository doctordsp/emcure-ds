# EMCURE Design Studio

Local-first faculty prototype for designing an entrepreneurially minded course-based undergraduate research experience (EMCURE). Designs save in the browser as JSON. There is no login.

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

1. Start from scratch, or start from the stormwater example.
2. Select a few Habits of EM and/or Observable Behaviors.
3. Build need → opportunity → intended impact.
4. Compare uncertainties and justify a Big Red X.
5. Link an investigation activity to that Big Red X.
6. Review alignment findings and export Markdown, HTML, JSON, a public card, or a student companion.

**Create a Card** prefills from the design. Use **Fill from design** on a field to refresh that field only. **Reset fields from design** rewrites the whole card except author and image.

AI rewrite (Claude) of Description, Problem / Need, and Summary is deferred (`CARD_AI_REWRITE_ENABLED` in `src/ai/featureFlags.ts`). Deterministic fill works without a model.

JSON documents are shaped for a later Firestore `designs/{id}` document.
