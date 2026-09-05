import type { EmcureCard } from "./types";

export interface AffiliationFilters {
  institution: string;
  department: string;
  instructor: string;
}

export function emptyAffiliationFilters(): AffiliationFilters {
  return { institution: "", department: "", instructor: "" };
}

export function affiliationOf(card: Pick<EmcureCard, "institution" | "department" | "instructor">): {
  institution: string;
  department: string;
  instructor: string;
} {
  return {
    institution: card.institution?.trim() ?? "",
    department: card.department?.trim() ?? "",
    instructor: card.instructor?.trim() ?? "",
  };
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function galleryFilterOptions<T extends { card: EmcureCard }>(
  rows: T[],
  filters: AffiliationFilters,
): { institutions: string[]; departments: string[]; instructors: string[] } {
  const all = rows.map((row) => affiliationOf(row.card));
  const institutions = uniqueSorted(all.map((item) => item.institution));
  const afterInstitution = filters.institution
    ? all.filter((item) => item.institution === filters.institution)
    : all;
  const departments = uniqueSorted(afterInstitution.map((item) => item.department));
  const afterDepartment = filters.department
    ? afterInstitution.filter((item) => item.department === filters.department)
    : afterInstitution;
  const instructors = uniqueSorted(afterDepartment.map((item) => item.instructor));
  return { institutions, departments, instructors };
}

export function filterGalleryRows<T extends { card: EmcureCard }>(
  rows: T[],
  filters: AffiliationFilters,
): T[] {
  return rows.filter((row) => {
    const item = affiliationOf(row.card);
    if (filters.institution && item.institution !== filters.institution) return false;
    if (filters.department && item.department !== filters.department) return false;
    if (filters.instructor && item.instructor !== filters.instructor) return false;
    return true;
  });
}

export function parseAffiliationSearch(params: URLSearchParams): AffiliationFilters {
  return {
    institution: params.get("institution")?.trim() ?? "",
    department: params.get("department")?.trim() ?? "",
    instructor: params.get("instructor")?.trim() ?? "",
  };
}

export function affiliationSearchParams(filters: AffiliationFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.institution) params.set("institution", filters.institution);
  if (filters.department) params.set("department", filters.department);
  if (filters.instructor) params.set("instructor", filters.instructor);
  return params;
}

/** Apply a parent change and drop child values that no longer exist in the slice. */
export function nextAffiliationFilters<T extends { card: EmcureCard }>(
  current: AffiliationFilters,
  change: Partial<AffiliationFilters>,
  rows: T[],
): AffiliationFilters {
  const next: AffiliationFilters = { ...current, ...change };
  if (change.institution !== undefined) {
    next.department = change.department ?? "";
    next.instructor = change.instructor ?? "";
  } else if (change.department !== undefined) {
    next.instructor = change.instructor ?? "";
  }
  const options = galleryFilterOptions(rows, next);
  if (next.department && !options.departments.includes(next.department)) next.department = "";
  if (next.instructor && !options.instructors.includes(next.instructor)) next.instructor = "";
  return next;
}
