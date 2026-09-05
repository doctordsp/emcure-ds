import { describe, expect, it } from "vitest";
import { readySlot } from "./progress";

describe("readySlot", () => {
  it("is green when this field is filled", () => {
    expect(readySlot(true, false)).toBe(true);
    expect(readySlot(true, true)).toBe(true);
  });

  it("is red when the group is still missing and this field is empty", () => {
    expect(readySlot(false, false)).toBe(false);
  });

  it("is optional when the group is already satisfied and this field is empty", () => {
    expect(readySlot(false, true)).toBeUndefined();
  });
});
