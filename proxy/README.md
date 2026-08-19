# EM-CURE AI proxy

Small Cloud Run service that holds Anthropic/OpenAI keys and checks a time-limited passcode (same CODE+MMDD / letter-date rules as cmapalyzer). The static SPA never receives a provider key.

## Endpoints

- `GET /v1/health` — `{ "ok": true }`, no secrets
- `POST /v1/complete` — `{ passcode, provider, model, messages }` → `{ text }` or 401/429

Allowlisted models: `claude-sonnet-5`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`, `gpt-5.5`, `gpt-5.4-mini`, `gpt-4o`. Responses cap `max_tokens` at 1024.

## Local

```bash
cd proxy
cp .env.example .env
# fill keys and ACCESS_CODES
node --env-file=.env server.mjs
npm test
```

## Cloud Run

From `proxy/`, in the same Google Cloud project as bucket `ai-app-directory`:

```bash
gcloud run deploy emcure-ai-proxy \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ACCESS_CODES=EMCURE,ACCESS_VALIDITY_DAYS=7,CORS_ORIGINS=https://storage.googleapis.com \
  --set-secrets ANTHROPIC_API_KEY=anthropic-api-key:latest,OPENAI_API_KEY=openai-api-key:latest
```

`--allow-unauthenticated` is required so the browser can call the proxy; the passcode is the gate.

Then set `VITE_AI_PROXY_URL` to the Cloud Run URL (no trailing slash) and rebuild the SPA.
