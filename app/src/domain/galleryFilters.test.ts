import { describe, expect, it } from "vitest";
import { emptyCard } from "./card";
import {
  affiliationSearchParams,
  filterGalleryRows,
  galleryFilterOptions,
  nextAffiliationFilters,
  parseAffiliationSearch,
} from "./galleryFilters";
import type { EmcureCard } from "./types";

function row(id: string, patch: Partial<EmcureCard>) {
  return { id, card: { ...emptyCard(), ...patch } };
}

const rows = [
  row("storm", {
    institution: "Riverside State University",
    department: "Civil engineering",
    instructor: "Jordan Hale",
  }),
  row("ortho", {
    institution: "Riverside State University",
    department: "Biomedical engineering",
    instructor: "Amina Ortiz",
  }),
  row("other", {
    institution: "North Shore College",
    department: "Civil engineering",
    instructor: "Sam Lee",
  }),
];

describe("galleryFilterOptions", () => {
  it("lists all institutions, then departments in the selected institution", () => {
    const all = galleryFilterOptions(rows, {
      institution: "",
      department: "",
      instructor: "",
    });
    expect(all.institutions).toEqual(["North Shore College", "Riverside State University"]);
    expect(all.departments).toEqual(["Biomedical engineering", "Civil engineering"]);

    const riverside = galleryFilterOptions(rows, {
      institution: "Riverside State University",
      department: "",
      instructor: "",
    });
    expect(riverside.departments).toEqual(["Biomedical engineering", "Civil engineering"]);
    expect(riverside.instructors).toEqual(["Amina Ortiz", "Jordan Hale"]);
  });

  it("limits instructors to the selected department", () => {
    const options = galleryFilterOptions(rows, {
      institution: "Riverside State University",
      department: "Civil engineering",
      instructor: "",
    });
    expect(options.instructors).toEqual(["Jordan Hale"]);
  });
});

describe("filterGalleryRows", () => {
  it("ANDs affiliation filters and ignores missing snapshot fields", () => {
    expect(
      filterGalleryRows(rows, {
        institution: "Riverside State University",
        department: "",
        instructor: "",
      }).map((item) => item.id),
    ).toEqual(["storm", "ortho"]);
    expect(
      filterGalleryRows(rows, {
        institution: "",
        department: "Civil engineering",
        instructor: "",
      }).map((item) => item.id),
    ).toEqual(["storm", "other"]);
    expect(
      filterGalleryRows([row("old", {})], {
        institution: "Riverside State University",
        department: "",
        instructor: "",
      }),
    ).toEqual([]);
  });
});

describe("nextAffiliationFilters", () => {
  it("clears child filters when the parent changes", () => {
    const next = nextAffiliationFilters(
      {
        institution: "Riverside State University",
        department: "Civil engineering",
        instructor: "Jordan Hale",
      },
      { institution: "North Shore College" },
      rows,
    );
    expect(next).toEqual({
      institution: "North Shore College",
      department: "",
      instructor: "",
    });
  });
});

describe("affiliation search params", () => {
  it("round-trips populated filters and omits empty ones", () => {
    const params = affiliationSearchParams({
      institution: "Riverside State University",
      department: "",
      instructor: "Jordan Hale",
    });
    expect(params.get("institution")).toBe("Riverside State University");
    expect(params.has("department")).toBe(false);
    expect(parseAffiliationSearch(params)).toEqual({
      institution: "Riverside State University",
      department: "",
      instructor: "Jordan Hale",
    });
  });
});
