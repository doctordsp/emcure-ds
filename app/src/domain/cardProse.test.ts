import { describe, expect, it } from "vitest";
import { EXAMPLE_DESIGN } from "../data/exampleDesign";
import { cardEmCommentsFromDesign, cardFieldsToHtml, draftCardFromDesign } from "./card";
import { cardProseToHtml, parseCardProseBlock, splitCardProse } from "./cardProse";
import { MVRC_LABEL } from "./mvrc";
import { qrModules, qrSvg } from "./qrSvg";

describe("card EM comments", () => {
  it("omits Local interpretation and separates each habit", () => {
    const comments = cardEmCommentsFromDesign(EXAMPLE_DESIGN);
    expect(comments).not.toMatch(/Local interpretation/i);
    expect(comments).toContain("Opportunity Seeking (primary)");
    expect(comments).toContain("\n\n");
    expect(comments).toContain("municipal offering");
  });
});

describe("card prose", () => {
  it("bolds the EM element name and drops Local interpretation", () => {
    const html = cardProseToHtml(
      "Experimentation (primary) Local interpretation: Coupons are the experiment.",
    );
    expect(html).toContain("<strong>Experimentation</strong> (primary)");
    expect(html).toContain("Coupons are the experiment.");
    expect(html).not.toMatch(/Local interpretation/i);
  });

  it("bolds the MVRC label", () => {
    const parsed = parseCardProseBlock(
      `${MVRC_LABEL}: Students produce a bounded evidence packet.`,
    );
    expect(parsed.name).toBe(MVRC_LABEL);
    expect(parsed.body).toContain("bounded evidence packet");
    expect(cardProseToHtml(`${MVRC_LABEL}: a packet`)).toContain(`<strong>${MVRC_LABEL}</strong>`);
  });

  it("keeps space between EM paragraphs", () => {
    expect(splitCardProse("One (primary)\nA.\n\nTwo (supporting)\nB.")).toHaveLength(2);
  });
});

describe("card QR", () => {
  it("embeds a QR code in pause-proof HTML when a share URL is provided", () => {
    const html = cardFieldsToHtml(
      draftCardFromDesign(EXAMPLE_DESIGN),
      "12345",
      undefined,
      "https://example.test/c/demo",
    );
    expect(html).toContain("QR code for https://example.test/c/demo");
    expect(html).toContain("<svg");
    expect(html).toContain("<strong>Opportunity Seeking</strong>");
    expect(html).toContain(`<strong>${MVRC_LABEL}</strong>`);
  });
});

describe("qrSvg", () => {
  it("encodes a URL as a module matrix", () => {
    const modules = qrModules("https://example.test/c/demo");
    expect(modules.length).toBeGreaterThan(10);
    expect(modules[0]?.length).toBe(modules.length);
    expect(qrSvg("https://example.test/c/demo")).toContain("<rect");
  });
});
