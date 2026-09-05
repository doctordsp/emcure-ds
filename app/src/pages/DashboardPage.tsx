import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthBar } from "../auth/AuthBar";
import { LocalImportBanner } from "../auth/LocalImportBanner";
import { useAuth } from "../auth/AuthContext";
import { STARTER_EXAMPLES } from "../data/examples";
import { cloneDesign } from "../domain/createDesign";
import type { WorkspaceRoute } from "../domain/types";
import {
  archiveDesign,
  createAndSaveDesign,
  deleteDesign,
  duplicateDesign,
  getActiveDesignId,
  listDesigns,
  parseImportedDesign,
  restoreDesign,
  saveDesignToCloud,
  saveNewDesign,
  setActiveDesignId,
  type DesignSummary,
} from "../persistence/storage";
import {
  listOwnedPublishedMeta,
  setDesignCardPublic,
} from "../persistence/publish";
import { RoadmapMap, THREAD_LEGEND } from "../ui/RoadmapMap";
import { DraftNoticeBanner } from "../ui/DraftNoticeBanner";

export function DashboardPage() {
  const navigate = useNavigate();
  const { ready, user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [needActive, setNeedActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [designs, setDesigns] = useState<DesignSummary[]>([]);
  const [active, setActive] = useState<DesignSummary | null>(null);
  const [publishedMeta, setPublishedMeta] = useState<
    Record<string, { visibility: "unlisted" | "public"; slug: string }>
  >({});

  async function refresh() {
    try {
      const nextDesigns = await listDesigns();
      setDesigns(nextDesigns);
      const id = getActiveDesignId();
      setActive(nextDesigns.find((item) => item.id === id && !item.archivedAt) ?? null);
      setLibraryOpen((open) => open || nextDesigns.length === 0);
      if (user) {
        try {
          setPublishedMeta(await listOwnedPublishedMeta());
        } catch {
          setPublishedMeta({});
        }
      } else {
        setPublishedMeta({});
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load the library.");
    }
  }

  useEffect(() => {
    if (!ready) return;
    void refresh();
  }, [ready, user?.id]);

  const visible = useMemo(
    () =>
      designs.filter((item) => (showArchived ? Boolean(item.archivedAt) : !item.archivedAt)),
    [designs, showArchived],
  );

  function selectActive(id: string) {
    setActiveDesignId(id);
    setActive(designs.find((item) => item.id === id) ?? null);
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

  async function run(action: () => Promise<void>) {
    setError(null);
    setBusy(true);
    try {
      await action();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "That action failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dashboard">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="app-header">
        <h1 className="site-title">EM-CURE Design Studio</h1>
        <div className="header-tools">
          <AuthBar />
          <div className="header-actions">
            {libraryOpen ? (
              <button type="button" className="btn btn-primary" onClick={showRoadmap}>
                Back to roadmap
              </button>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={showLibrary}>
                My Library of EM-CUREs
              </button>
            )}
            <div className="header-actions-row">
              <Link className="btn btn-secondary" to="/setup-ai">
                Setup AI API
              </Link>
              <Link className="btn btn-secondary" to="/cards">
                Public Gallery
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main id="main">
        <DraftNoticeBanner />
        {user ? <LocalImportBanner onImported={() => void refresh()} /> : null}
        <p className="lede">
          Design an undergraduate research experience in which students can see and
          demonstrate how technical work connects to opportunity and impact.
        </p>

        <div className="active-banner" role="status">
          {active ? (
            <>
              <div>
                <p className="muted" style={{ marginBottom: 4 }}>
                  Active EM-CURE
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
              No active EM-CURE, choose one from the library or start a new design.
            </p>
          )}
        </div>

        {libraryOpen ? (
          <section id="library" className="library-section" aria-labelledby="library-heading">
            <h2 id="library-heading">My Library of EM-CUREs</h2>
            <p className="muted">
              Select one active design. That EM-CURE is what the roadmap and Continue
              button use. Open an EM-CURE when you are ready to edit it.
            </p>
            {needActive && !active ? (
              <p className="callout callout-warn" role="alert">
                Choose or create an EM-CURE here, then return to the roadmap.
              </p>
            ) : null}
            <div className="dashboard-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    const created = await createAndSaveDesign("Untitled EM-CURE");
                    open(created.id);
                  })
                }
              >
                Start from scratch
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={busy}
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
                    void run(async () => {
                      const imported = await parseImportedDesign(JSON.parse(text) as unknown);
                      open(imported.id);
                    });
                  });
                }}
              />
            </div>
            <section className="starter-examples" aria-labelledby="starter-heading">
              <h2 id="starter-heading">Starter examples</h2>
              <p className="muted">
                Complete specimens you can edit. They differ in course envelope, partners, and
                how students generate evidence.
              </p>
              <div className="card-grid starter-grid">
                {STARTER_EXAMPLES.map((starter) => (
                  <article className="card" key={starter.id}>
                    <h3>{starter.title}</h3>
                    <p className="muted">
                      {starter.discipline} · {starter.level}
                    </p>
                    <p>{starter.blurb}</p>
                    <div className="card-actions">
                      <button
                        type="button"
                        className="btn btn-gold"
                        disabled={busy}
                        onClick={() =>
                          void run(async () => {
                            const exists = (await listDesigns()).some(
                              (item) => item.title === starter.title,
                            );
                            const title = exists ? `${starter.title} (copy)` : starter.title;
                            const saved = await saveNewDesign(cloneDesign(starter.design, title));
                            open(saved.id);
                          })
                        }
                      >
                        Start this example
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            {error ? (
              <p className="callout callout-warn" role="alert">
                {error}
              </p>
            ) : null}

            {designs.length === 0 ? (
              <div className="card">
                <h3>No designs yet</h3>
                <p>
                  Start from scratch to draft your own EM-CURE, or start from a starter example
                  to see a complete specimen: needs, success criteria, activities, Big Red X,
                  card, and rubric.
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
                              {isActive ? "Active EM-CURE" : "Make active"}
                            </label>
                          ) : (
                            <p className="muted">Archived, restore to make active</p>
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
                              className={
                                item.storagePlace === "cloud" ? "pill pill-ok" : "pill pill-local"
                              }
                            >
                              {item.storagePlace === "cloud" ? "Cloud" : "Local"}
                            </span>
                            <span
                              className={item.openErrorCount ? "pill pill-danger" : "pill pill-ok"}
                            >
                              {item.openErrorCount} errors
                            </span>
                            <span className={item.openWarningCount ? "pill pill-warn" : "pill"}>
                              {item.openWarningCount} warnings
                            </span>
                          </div>
                          {user ? (
                            <div className="card-public">
                              <label
                                className="inline-check"
                                title="Lists this EM-CURE in the Public Gallery. The studio design stays private."
                              >
                                <input
                                  type="checkbox"
                                  checked={publishedMeta[item.id]?.visibility === "public"}
                                  disabled={busy || item.storagePlace !== "cloud"}
                                  onChange={(event) => {
                                    const next = event.target.checked;
                                    void run(async () => {
                                      await setDesignCardPublic(item.id, next);
                                      await refresh();
                                    });
                                  }}
                                />
                                Public EM-CURE
                              </label>
                              <p className="field-hint">
                                {item.storagePlace === "cloud"
                                  ? "Lists this EM-CURE in the Public Gallery. The studio design stays private."
                                  : "Save to cloud to list a public EM-CURE."}
                              </p>
                            </div>
                          ) : null}
                          <div className="card-actions">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => open(item.id)}
                            >
                              Open
                            </button>
                            {user && item.storagePlace === "local" ? (
                              <button
                                type="button"
                                className="btn btn-gold"
                                disabled={busy}
                                onClick={() =>
                                  void run(async () => {
                                    await saveDesignToCloud(item.id);
                                    await refresh();
                                  })
                                }
                              >
                                Save to cloud
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="btn btn-secondary"
                              disabled={busy}
                              onClick={() =>
                                void run(async () => {
                                  const copy = await duplicateDesign(item.id);
                                  if (copy) {
                                    selectActive(copy.id);
                                    await refresh();
                                  }
                                })
                              }
                            >
                              Duplicate
                            </button>
                            {item.archivedAt ? (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                disabled={busy}
                                onClick={() =>
                                  void run(async () => {
                                    await restoreDesign(item.id);
                                    await refresh();
                                  })
                                }
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                disabled={busy}
                                onClick={() =>
                                  void run(async () => {
                                    await archiveDesign(item.id);
                                    await refresh();
                                  })
                                }
                              >
                                Archive
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-danger"
                              disabled={busy}
                              onClick={() => {
                                if (confirm(`Delete “${item.title}”? This cannot be undone.`)) {
                                  void run(async () => {
                                    await deleteDesign(item.id);
                                    await refresh();
                                  });
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
                drawn on the graphic; use them with the same active EM-CURE.
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
