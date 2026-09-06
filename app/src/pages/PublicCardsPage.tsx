import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { YEAR_LEVELS } from "../domain/card";
import {
  affiliationSearchParams,
  filterGalleryRows,
  galleryFilterOptions,
  nextAffiliationFilters,
  parseAffiliationSearch,
} from "../domain/galleryFilters";
import { publishedCardSharePath, type PublishedCardRow } from "../domain/publish";
import { listPublicCards, publishedImageSrc } from "../persistence/publish";
import { isSupabaseConfigured } from "../persistence/supabase";
import { SelectField } from "../ui/fields";

export function PublicCardsPage() {
  const configured = isSupabaseConfigured();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseAffiliationSearch(searchParams);
  const [rows, setRows] = useState<PublishedCardRow[]>([]);
  const [error, setError] = useState<string | null>(
    configured ? null : "The public gallery is not connected to a database.",
  );
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    void listPublicCards()
      .then((found) => {
        if (cancelled) return;
        setRows(found);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        setError(caught instanceof Error ? caught.message : "Could not load public EM-CUREs.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [configured]);

  const options = useMemo(() => galleryFilterOptions(rows, filters), [rows, filters]);
  const visible = useMemo(() => filterGalleryRows(rows, filters), [rows, filters]);
  const hasFilters = Boolean(filters.institution || filters.department || filters.instructor);

  function setFilter(change: Parameters<typeof nextAffiliationFilters>[1]) {
    const next = nextAffiliationFilters(filters, change, rows);
    setSearchParams(affiliationSearchParams(next), { replace: true });
  }

  return (
    <div className="dashboard">
      <header className="app-header">
        <h1 className="site-title">Public EM-CUREs</h1>
        <div className="header-tools">
          <div className="header-actions">
            <Link className="btn btn-secondary" to="/">
              EM-CURE Design Studio
            </Link>
          </div>
        </div>
      </header>
      <main id="main">
        <p className="lede">
          Student-facing EM-CUREs that faculty have listed as public. Studio designs stay private.
        </p>
        {rows.length > 0 ? (
          <div className="gallery-filters">
            <SelectField
              id="filter-institution"
              label="Institution"
              value={filters.institution}
              onChange={(institution) => setFilter({ institution })}
              options={[
                { value: "", label: "All institutions" },
                ...options.institutions.map((value) => ({ value, label: value })),
              ]}
            />
            <SelectField
              id="filter-department"
              label="Department"
              value={filters.department}
              onChange={(department) => setFilter({ department })}
              options={[
                { value: "", label: "All departments" },
                ...options.departments.map((value) => ({ value, label: value })),
              ]}
            />
            <SelectField
              id="filter-instructor"
              label="Instructor"
              value={filters.instructor}
              onChange={(instructor) => setFilter({ instructor })}
              options={[
                { value: "", label: "All instructors" },
                ...options.instructors.map((value) => ({ value, label: value })),
              ]}
            />
          </div>
        ) : null}
        {loading ? <p>Loading public EM-CUREs…</p> : null}
        {error ? (
          <p className="callout callout-warn" role="alert">
            {error}
          </p>
        ) : null}
        {!loading && !error && rows.length === 0 ? (
          <div className="card">
            <h2>Nothing public yet</h2>
            <p>
              When a faculty author checks Public EM-CURE on an owned design in the library, it
              appears here.
            </p>
          </div>
        ) : null}
        {!loading && !error && rows.length > 0 && visible.length === 0 ? (
          <div className="card">
            <h2>No EM-CUREs match these filters</h2>
            <p>Try All institutions, or a broader department or instructor.</p>
            {hasFilters ? (
              <button type="button" className="btn btn-secondary" onClick={() => setSearchParams({})}>
                Clear filters
              </button>
            ) : null}
          </div>
        ) : null}
        {visible.length > 0 ? (
          <div className="card-grid">
            {visible.map((row) => {
              const year =
                YEAR_LEVELS.find((item) => item.id === row.card.yearLevel)?.label ||
                row.card.yearLevel;
              const image = publishedImageSrc(row);
              const affiliation = [row.card.institution, row.card.department, row.card.instructor]
                .filter(Boolean)
                .join(" · ");
              return (
                <article className="card" key={row.id}>
                  {image ? (
                    <img className="gallery-card-image" src={image} alt="" />
                  ) : null}
                  <h3>
                    <Link className="card-link" to={publishedCardSharePath(row.slug)}>
                      {row.card.title || "EM-CURE"}
                    </Link>
                  </h3>
                  {row.card.instructor ? <p className="muted">by {row.card.instructor}</p> : null}
                  {affiliation ? <p className="muted">{affiliation}</p> : null}
                  <p className="muted">
                    {[year, row.card.course].filter(Boolean).join(" · ") || "-"}
                  </p>
                  <div className="card-actions">
                    <Link className="btn btn-primary" to={publishedCardSharePath(row.slug)}>
                      View EM-CURE
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </main>
    </div>
  );
}
