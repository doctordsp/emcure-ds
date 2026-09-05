import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { AuthBar } from "../auth/AuthBar";
import { countBySeverity } from "../domain/alignment";
import { displayTitle } from "../domain/createDesign";
import { sectionStatuses } from "../domain/progress";
import { DesignProvider, useDesign } from "./DesignContext";

const STATE_LABEL = {
  not_started: "Not started",
  in_progress: "In progress",
  ready: "Ready",
};

function WorkspaceShell() {
  const { design, saveState, storagePlace } = useDesign();
  const sections = sectionStatuses(design);
  const counts = countBySeverity(design);
  const saved = new Date(design.updatedAt).toLocaleString();
  const savedLabel =
    storagePlace === "cloud" ? `Saved to cloud ${saved}` : `Saved locally ${saved}`;

  return (
    <div className="workspace">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <nav className="workspace-nav" aria-label="Design sections">
        <NavLink className="brand" to="/">
          EM-CURE Design Studio
        </NavLink>
        <p className="muted" style={{ color: "#dcebf0" }}>
          {displayTitle(design)}
        </p>
        <ul className="nav-list">
          {sections.map((section) => (
            <li key={section.route}>
              <NavLink
                to={section.route}
                className={({ isActive }) =>
                  `stage-${section.stage}${isActive ? " active" : ""}`
                }
              >
                <span>{section.label}</span>
                <span className="nav-state">{STATE_LABEL[section.state]}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="workspace-main">
        <header className="workspace-header">
          <div>
            <p className="muted" style={{ marginBottom: 4 }}>
              {saveState === "saving" ? "Saving…" : "Faculty workspace"}
            </p>
            <div className="pill-row" aria-live="polite">
              <span className="pill">
                {saveState === "saved"
                  ? savedLabel
                  : saveState === "saving"
                    ? "Saving…"
                    : "Save failed, try export"}
              </span>
              <span className={counts.error ? "pill pill-danger" : "pill pill-ok"}>
                {counts.error} open error{counts.error === 1 ? "" : "s"}
              </span>
              <span className={counts.warning ? "pill pill-warn" : "pill"}>
                {counts.warning} open warning{counts.warning === 1 ? "" : "s"}
              </span>
              <span className="pill">{design.status}</span>
            </div>
          </div>
          <div className="header-tools">
            <AuthBar />
            <div className="header-actions">
              <Link className="btn btn-secondary" to="/">
                Back to roadmap
              </Link>
            </div>
          </div>
        </header>
        <main id="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function WorkspaceLayout() {
  const { designId } = useParams();
  return (
    <DesignProvider key={designId}>
      <WorkspaceShell />
    </DesignProvider>
  );
}
