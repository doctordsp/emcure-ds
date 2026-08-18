import { describe, expect, it } from "vitest";
import { EXAMPLE_DESIGN } from "../data/exampleDesign";
import { patchLens, stakeholderTypeLabel } from "./stakeholders";

describe("stakeholder classification", () => {
  it("labels primary external stakeholders", () => {
    const residents = EXAMPLE_DESIGN.stakeholders.find((item) => item.id === "stk-residents");
    expect(stakeholderTypeLabel(residents!)).toBe("Primary · External");
  });

  it("returns empty when type is unset", () => {
    expect(stakeholderTypeLabel({ id: "x", name: "x", roles: [], evidenceStatus: "assumption" })).toBe(
      "",
    );
  });

  it("patches one lens field without dropping others", () => {
    const next = patchLens({ statedInterests: "Keep", powerOver: "Old" }, "powerOver", "New");
    expect(next.statedInterests).toBe("Keep");
    expect(next.powerOver).toBe("New");
  });
});
