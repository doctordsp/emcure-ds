import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decodeLetterDate, validateAccessPassword } from "./passcode.mjs";

describe("decodeLetterDate", () => {
  it("decodes March 15 as CO", () => {
    assert.deepEqual(decodeLetterDate("CO"), { month: 3, day: 15 });
  });
});

describe("validateAccessPassword", () => {
  const today = new Date(2026, 2, 15);

  it("accepts CODE+MMDD within the window", () => {
    assert.equal(validateAccessPassword("EMCURE0315", ["EMCURE"], 7, "", today), true);
  });

  it("rejects expired CODE+MMDD", () => {
    assert.equal(validateAccessPassword("EMCURE0301", ["EMCURE"], 7, "", today), false);
  });

  it("accepts letter-encoded dates", () => {
    assert.equal(validateAccessPassword("EMCURECO", ["EMCURE"], 7, "", today), true);
  });
});
