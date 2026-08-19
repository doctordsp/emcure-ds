import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * Public path of the built app in GCS:
 * gs://ai-app-directory/emcure-design-studio/
 *
 * Matches https://storage.googleapis.com/ai-app-directory/emcure-design-studio/
 * Local `npm run dev` stays at `/`.
 */
const GCS_PUBLIC_BASE = "/ai-app-directory/emcure-design-studio/";

export default defineConfig(({ mode, isPreview }) => ({
  plugins: [react()],
  base: mode === "production" || isPreview ? GCS_PUBLIC_BASE : "/",
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
}));
