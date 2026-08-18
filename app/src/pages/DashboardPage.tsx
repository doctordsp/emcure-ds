import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EXAMPLE_DESIGN } from "../data/exampleDesign";
import { cloneDesign } from "../domain/createDesign";
import type { WorkspaceRoute } from "../domain/types";
import {
  archiveDesign,
  createAndSaveDesign,
  deleteDesign,
  duplicateDesign,
  getActiveDesignSummary,
  listDesigns,
  parseImportedDesign,
  restoreDesign,
  saveDesign,
  setActiveDesignId,
  type DesignSummary,
} from "../persistence/storage";
import { RoadmapMap, THREAD_LEGEND } from "../ui/RoadmapMap";

export function DashboardPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(() => listDesigns().length === 0);
  const [needActive, setNeedActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [designs, setDesigns] = useState<DesignSummary[]>(() => listDesigns());
  const [active, setActive] = useState<DesignSummary | null>(() => getActiveDesignSummary());

  const visible = useMemo(
    () =>
      designs.filter((item) => (showArchived ? Boolean(item.archivedAt) : !item.archivedAt)),
    [designs, showArchived],
  );

  function refresh() {
    setDesigns(listDesigns());
    setActive(getActiveDesignSummary());
  }

  function selectActive(id: string) {
    setActiveDesignId(id);
    setActive(getActiveDesignSummary());
    setNeedActive(false);
  }

  function open(id: string, route: WorkspaceRoute = "course") {
    selectActive(id);
    navigate(`/designs/${id}/${route}`);
  }

  function hrefFor(route: WorkspaceRoute): string | null {
    return active ? `/designs/${active.id}/${route}` : null;
  }

  function showLibrary() {
    setNeedActive(!active);
    setLibraryOpen(true);
  }

  function showRoadmap() {
    setLibraryOpen(false);
  }

  return (
    <div className="dashboard">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="app-header">
        <div>
          <p className="muted" style={{ marginBottom: 4 }}>
            Faculty Design Studio · local prototype
          </p>
          <h1>EMCURE Design Studio</h1>
        </div>
        {libraryOpen ? (
          <button type="button" className="btn btn-primary" onClick={showRoadmap}>
            Back to roadmap
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={showLibrary}>
            Library of EMCUREs
          </button>
        )}
      </header>
      <main id="main">
        <p className="lede">
          Help faculty design an undergraduate research experience in which students
          can see—and demonstrate—how technical work connects to opportunity and impact.
        </p>

        <div className="active-banner" role="status">
          {active ? (
            <>
              <div>
                <p className="muted" style={{ marginBottom: 4 }}>
                  Active EMCURE
                </p>
                <strong>{active.title}</strong>
              </div>
              <div className="card-actions" style={{ marginTop: 0 }}>
                {libraryOpen ? (
                  <button type="button" className="btn btn-secondary" onClick={showRoadmap}>
                    Use on roadmap
                  </button>
                ) : null}
                <button type="button" className="btn btn-primary" onClick={() => open(active.id)}>
                  Continue
                </button>
              </div>
            </>
          ) : (
            <p style={{ margin: 0 }}>
              No active EMCURE — choose one from the library or start a new design.
            </p>
          )}
        </div>

        {libraryOpen ? (
          <section id="library" className="library-section" aria-labelledby="library-heading">
            <h2 id="library-heading">Library of EMCUREs</h2>
            <p className="muted">
              Select one active design. That EMCURE is what the roadmap and Continue
              button use. Open a card when you are ready to edit it.
            </p>
            {needActive && !active ? (
              <p className="callout callout-warn" role="alert">
                Choose or create an EMCURE here, then return to the roadmap.
              </p>
            ) : null}
            <div className="dashboard-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => open(createAndSaveDesign("Untitled EMCURE").id)}
              >
                Start from scratch
              </button>
              <button
                type="button"
                className="btn btn-gold"
                onClick={() => {
                  const exists = listDesigns().some(
                    (item) => item.title === EXAMPLE_DESIGN.title,
                  );
                  const title = exists
                    ? `${EXAMPLE_DESIGN.title} (copy)`
                    : EXAMPLE_DESIGN.title;
                  open(saveDesign(cloneDesign(EXAMPLE_DESIGN, title)).id);
                }}
              >
                Start from example
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fileRef.current?.click()}
              >
                Import JSON
              </button>
              <input
                ref={fileRef}
                className="sr-only"
                type="file"
                accept="application/json,.json"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  void file.text().then((text) => {
                    try {
                      open(parseImportedDesign(JSON.parse(text) as unknown).id);
                    } catch (caught) {
                      setError(caught instanceof Error ? caught.message : "Import failed.");
                    }
                  });
                }}
              />
            </div>
            {error ? (
              <p className="callout callout-warn" role="alert">
                {error}
              </p>
            ) : null}

            {designs.length === 0 ? (
              <div className="card">
                <h3>No designs yet</h3>
                <p>
                  Start from scratch to draft your own EMCURE, or start from the stormwater
                  example to see a complete Opportunity-to-Impact Thread and Big Red X.
                </p>
              </div>
            ) : (
              <>
                <label className="inline-check" style={{ marginBottom: 16 }}>
                  <input
                    type="checkbox"
                    checked={showArchived}
                    onChange={(event) => setShowArchived(event.target.checked)}
                  />
                  Show archived
                </label>
                {visible.length === 0 ? (
                  <p className="muted">No designs in this view.</p>
                ) : (
                  <div className="card-grid">
                    {visible.map((item) => {
                      const isActive = active?.id === item.id;
                      return (
                        <article
                          className={isActive ? "card is-active" : "card"}
                          key={item.id}
                        >
                          {!item.archivedAt ? (
                            <label className="card-select">
                              <input
                                type="radio"
                                name="active-emcure"
                                checked={isActive}
                                onChange={() => selectActive(item.id)}
                              />
                              {isActive ? "Active EMCURE" : "Make active"}
                            </label>
                          ) : (
                            <p className="muted">Archived — restore to make active</p>
                          )}
                          <h3>
                            <Link
                              className="card-link"
                              to={`/designs/${item.id}/course`}
                              onClick={() => setActiveDesignId(item.id)}
                            >
                              {item.title}
                            </Link>
                          </h3>
                          <p className="muted">
                            {item.status} · updated {new Date(item.updatedAt).toLocaleString()}
                          </p>
                          <div className="pill-row">
                            <span
                              className={item.openErrorCount ? "pill pill-danger" : "pill pill-ok"}
                            >
                              {item.openErrorCount} errors
                            </span>
                            <span className={item.openWarningCount ? "pill pill-warn" : "pill"}>
                              {item.openWarningCount} warnings
                            </span>
                          </div>
                          <div className="card-actions">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => open(item.id)}
                            >
                              Open
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => {
                                const copy = duplicateDesign(item.id);
                                if (copy) {
                                  selectActive(copy.id);
                                  refresh();
                                }
                              }}
                            >
                              Duplicate
                            </button>
                            {item.archivedAt ? (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                  restoreDesign(item.id);
                                  refresh();
                                }}
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                  archiveDesign(item.id);
                                  refresh();
                                }}
                              >
                                Archive
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => {
                                if (confirm(`Delete “${item.title}”? This cannot be undone.`)) {
                                  deleteDesign(item.id);
                                  refresh();
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>
        ) : (
          <>
            <section className="thread-legend" aria-labelledby="legend-heading">
              <h2 id="legend-heading">Opportunity-to-Impact Thread</h2>
              <p>
                These four items complete the Opportunity-to-Impact Thread. They are not
                drawn on the graphic; use them with the same active EMCURE.
              </p>
              <div className="legend-actions">
                {THREAD_LEGEND.map((item) => {
                  const href = hrefFor(item.route);
                  const className = `btn btn-secondary btn-thread tone-${item.tone}`;
                  if (href) {
                    return (
                      <Link key={item.id} className={className} to={href}>
                        {item.label}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={className}
                      onClick={showLibrary}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </section>
            <RoadmapMap hrefFor={hrefFor} onUnavailable={showLibrary} />
          </>
        )}
      </main>
    </div>
  );
}
