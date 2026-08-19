# EM-CURE Design Studio

A faculty tool for designing an entrepreneurially minded course-based undergraduate research experience (EM-CURE).

This is a **draft**. Designs save in this browser; there is no backend database. Optional AI (Claude or ChatGPT) can be enabled on **Setup AI API** via a time-limited passcode and a small Cloud Run proxy — provider keys never ship in the JavaScript.

## Run

```bash
cd app
npm install
npm run dev
```

See `app/README.md` for tests, export, and usage. The optional AI proxy (keys stay off the static site) is in `proxy/`.

License: MIT (Copyright 2026 doctordsp)
