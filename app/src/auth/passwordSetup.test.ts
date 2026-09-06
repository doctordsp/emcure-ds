import { describe, expect, it } from "vitest";
import { urlLooksLikePasswordSetup } from "./passwordSetup";

describe("urlLooksLikePasswordSetup", () => {
  it("detects a PKCE code on the GCS index.html landing", () => {
    expect(
      urlLooksLikePasswordSetup(
        "https://storage.googleapis.com/ai-app-directory/emcure-design-studio/index.html?code=abc",
      ),
    ).toBe(true);
  });

  it("detects implicit recovery tokens in the hash", () => {
    expect(
      urlLooksLikePasswordSetup(
        "https://storage.googleapis.com/ai-app-directory/emcure-design-studio/index.html#access_token=tok&type=recovery",
      ),
    ).toBe(true);
  });

  it("detects invite type", () => {
    expect(
      urlLooksLikePasswordSetup("https://example.com/index.html#type=invite&access_token=tok"),
    ).toBe(true);
  });

  it("ignores a normal studio URL", () => {
    expect(
      urlLooksLikePasswordSetup(
        "https://storage.googleapis.com/ai-app-directory/emcure-design-studio/index.html",
      ),
    ).toBe(false);
  });
});
