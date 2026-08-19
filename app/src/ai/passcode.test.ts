import { describe, expect, it } from "vitest";
import { decodeLetterDate, validateAccessPassword } from "./passcode";

describe("decodeLetterDate", () => {
  it("decodes CMAPCO-style March 15 as C + O", () => {
    expect(decodeLetterDate("CO")).toEqual({ month: 3, day: 15 });
  });
});

describe("validateAccessPassword", () => {
  const today = new Date(2026, 2, 15);

  it("accepts CODE+MMDD within the validity window", () => {
    expect(
      validateAccessPassword("EMCURE0315", ["EMCURE"], 7, "", today),
    ).toBe(true);
  });

  it("rejects an expired CODE+MMDD", () => {
    expect(
      validateAccessPassword("EMCURE0301", ["EMCURE"], 7, "", today),
    ).toBe(false);
  });

  it("accepts the master password", () => {
    expect(validateAccessPassword("secret", ["EMCURE"], 7, "secret", today)).toBe(true);
  });

  it("accepts letter-encoded dates (CMAPCO = March 15)", () => {
    expect(validateAccessPassword("EMCURECO", ["EMCURE"], 7, "", today)).toBe(true);
  });
});
