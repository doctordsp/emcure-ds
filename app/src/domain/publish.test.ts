import { describe, expect, it } from "vitest";
import { cardFieldsToMarkdown, cardToMarkdown } from "./card";
import { EXAMPLE_DESIGN } from "../data/exampleDesign";
import { cardSlug, publishedCardSharePath, studentSafeCard } from "./publish";
import { emptyCard } from "./card";

describe("studentSafeCard", () => {
  it("drops inline data URLs and keeps student-facing card fields", () => {
    const card = {
      ...emptyCard(),
      title: "Stormwater",
      featuredImageDataUrl: "data:image/png;base64,abc",
      featuredImagePath: "user/design/card/x.png",
    };
    const snapshot = studentSafeCard(card);
    expect(snapshot.featuredImageDataUrl).toBeUndefined();
    expect(snapshot.featuredImagePath).toBe("user/design/card/x.png");
    expect(snapshot.title).toBe("Stormwater");
  });
});

describe("cardSlug", () => {
  it("builds a stable unlisted slug from the title and design id", () => {
    expect(cardSlug("Stormwater EM-CURE!", "a1b2c3d4-e5f6-7890-abcd-ef1234567890")).toBe(
      "stormwater-em-cure-a1b2c3d4",
    );
  });

  it("falls back when the title is empty", () => {
    expect(cardSlug("   ", "zzzzzzzz-1111-2222-3333-444444444444")).toBe("emcure-zzzzzzzz");
  });
});

describe("publishedCardSharePath", () => {
  // A /c/<slug> path returns NoSuchKey on GCS, which serves index.html and nothing else.
  it("keeps the slug in the query so the link resolves on a static bucket", () => {
    expect(publishedCardSharePath("stormwater-a1b2c3d4")).toBe(
      "/index.html?c=stormwater-a1b2c3d4",
    );
  });

  it("escapes slugs so they cannot break out of the query string", () => {
    expect(publishedCardSharePath("a&b=c")).toBe("/index.html?c=a%26b%3Dc");
  });
});

describe("published card text", () => {
  it("does not include the faculty Big Red X on the public snapshot", () => {
    const markdown = cardFieldsToMarkdown({
        ...emptyCard(),
        title: "Public card",
        problemNeed: "Flooding",
      });
    expect(markdown).toContain("Public card");
    expect(markdown).not.toMatch(/Big Red X/i);
    expect(markdown).not.toMatch(/Card ID/i);
  });

  it("includes a student-facing rubric snapshot when Include rubric is on", () => {
    const markdown = cardFieldsToMarkdown({
      ...emptyCard(),
      title: "Public card",
      includeRubric: true,
      rubricMarkdown: "## Student performance\n\n| Criterion | Beginning |\n| --- | --- |\n| Packet | Little evidence. |",
    });
    expect(markdown).toContain("Assessment rubric");
    expect(markdown).toContain("Student performance");
    expect(markdown).toContain("| Criterion | Beginning |");
  });

  it("still includes the Big Red X on the faculty card export", () => {
    const markdown = cardToMarkdown(EXAMPLE_DESIGN);
    expect(markdown).toMatch(/Big Red X/i);
  });
});
