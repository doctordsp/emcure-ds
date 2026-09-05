import { Table } from "docx";
import { describe, expect, it } from "vitest";
import { EXAMPLE_DESIGN } from "../data/exampleDesign";
import { fileChildrenFromMarkdown, studentPackageDocxBuffer } from "./studentPackageDocx";

describe("studentPackageDocx", () => {
  it("builds a zip-based Word document from the student handout", async () => {
    const bytes = await studentPackageDocxBuffer(EXAMPLE_DESIGN);
    expect(bytes.byteLength).toBeGreaterThan(1000);
    expect(String.fromCharCode(bytes[0], bytes[1])).toBe("PK");
  });

  it("converts a markdown table into a Word table", () => {
    const children = fileChildrenFromMarkdown(
      [
        "# Title",
        "",
        "A paragraph.",
        "",
        "## Student performance",
        "",
        "| Criterion | Beginning |",
        "| --- | --- |",
        "| Stay dry | Little evidence. |",
      ].join("\n"),
    );
    expect(children.some((child) => child instanceof Table)).toBe(true);
  });
});
