import { describe, expect, it } from "vitest";
import { emptyCard } from "../domain/card";
import { createEmptyDesign } from "../domain/createDesign";
import { stripInlineAssets } from "./assets";

describe("stripInlineAssets", () => {
  it("removes data URLs so jsonb rows stay small", () => {
    const design = createEmptyDesign("Assets");
    design.card = {
      ...emptyCard(),
      featuredImageDataUrl: "data:image/png;base64,abc",
      featuredImagePath: "kept/path.png",
    };
    design.distributionDocuments = [
      {
        id: "doc-1",
        title: "Handout",
        audience: "students",
        kind: "uploaded",
        body: "",
        filename: "a.pdf",
        mimeType: "application/pdf",
        dataUrl: "data:application/pdf;base64,abc",
        storagePath: "kept/a.pdf",
      },
    ];
    const stripped = stripInlineAssets(design);
    expect(stripped.card?.featuredImageDataUrl).toBeUndefined();
    expect(stripped.card?.featuredImagePath).toBe("kept/path.png");
    expect(stripped.distributionDocuments?.[0].dataUrl).toBeUndefined();
    expect(stripped.distributionDocuments?.[0].storagePath).toBe("kept/a.pdf");
    expect(design.card?.featuredImageDataUrl).toBeDefined();
  });
});
