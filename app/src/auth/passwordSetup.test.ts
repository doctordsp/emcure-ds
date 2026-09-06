import { describe, expect, it } from "vitest";
import { authLinkErrorFromUrl, urlLooksLikePasswordSetup } from "./passwordSetup";

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

  it("does not treat an expired link as a pending setup", () => {
    expect(
      urlLooksLikePasswordSetup(
        "https://example.com/index.html#error=access_denied&error_code=otp_expired",
      ),
    ).toBe(false);
  });
});

describe("authLinkErrorFromUrl", () => {
  it("reads an expired recovery link from the hash", () => {
    const found = authLinkErrorFromUrl(
      "https://storage.googleapis.com/ai-app-directory/emcure-design-studio/index.html#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired",
    );
    expect(found?.code).toBe("otp_expired");
    expect(found?.message).toMatch(/expired or was already used/);
  });

  it("reads an error from the query string", () => {
    const found = authLinkErrorFromUrl(
      "https://example.com/index.html?error=server_error&error_description=Unexpected+failure",
    );
    expect(found?.code).toBe("server_error");
    expect(found?.message).toBe("Unexpected failure");
  });

  it("returns null for a clean recovery landing", () => {
    expect(
      authLinkErrorFromUrl("https://example.com/index.html#access_token=tok&type=recovery"),
    ).toBeNull();
  });

  it("returns null for a normal studio URL", () => {
    expect(authLinkErrorFromUrl("https://example.com/index.html")).toBeNull();
  });
});
