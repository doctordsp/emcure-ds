import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { testConnection } from "../ai/client";
import {
  clearAiSetup,
  emptyAiSetup,
  isAiConnected,
  proxyUrl,
  readAiSetup,
  writeAiSetup,
  type AiSetup,
} from "../ai/config";
import { AI_MODEL_OPTIONS, findAiModel } from "../ai/models";
import { SelectField } from "../ui/fields";

const CAPABILITIES = [
  {
    id: "test",
    name: "Connection test",
    status: "ready" as const,
    detail: "Sends a one-line prompt through the proxy to confirm the passcode and model.",
  },
  {
    id: "card-rewrite",
    name: "Card rewrite",
    status: "ready" as const,
    detail:
      "Suggests a rewrite of Description, Problem / Need, and Summary. You accept, edit, or dismiss — the card is never overwritten on arrival.",
  },
  {
    id: "rubric",
    name: "EM-CURE Rubric developer",
    status: "ready" as const,
    detail:
      "Drafts a formative/summative rubric from this EM-CURE (student performance, EM, course evaluation). You accept, edit, or dismiss — the saved rubric is never overwritten on arrival.",
  },
  {
    id: "drafts",
    name: "Studio drafts",
    status: "planned" as const,
    detail:
      "Not built yet. Line of sight, Big Red X rationale, and similar studio fields.",
  },
];

export function AiSetupPage() {
  const [setup, setSetup] = useState<AiSetup>(() => readAiSetup());
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const connected = isAiConnected();
  const proxy = proxyUrl();
  const option = useMemo(() => findAiModel(setup.selection), [setup.selection]);

  function persist(next: AiSetup) {
    writeAiSetup(next);
    setSetup(next);
  }

  function onSave() {
    setError(null);
    if (option.provider === "none") {
      persist({ ...setup, verified: false });
      setStatus("Saved. No AI API for this tab.");
      return;
    }
    persist(setup);
    setStatus(
      setup.verified
        ? "Saved for this tab. Card rewrite stays on."
        : "Saved for this tab. Test connection to enable card rewrite.",
    );
  }

  async function onTest() {
    setError(null);
    setStatus(null);
    const next = { ...setup, verified: false };
    persist(next);
    if (option.provider === "none") {
      setError("Choose a Claude or ChatGPT model first.");
      return;
    }
    if (!setup.passcode.trim()) {
      setError("Enter the time-limited passcode.");
      return;
    }
    if (!proxy) {
      setError("This build has no AI proxy URL (VITE_AI_PROXY_URL).");
      return;
    }
    setBusy(true);
    try {
      const reply = await testConnection(next);
      persist({ ...next, verified: true });
      setStatus(`Connected. Model replied: ${reply}`);
    } catch (caught) {
      persist({ ...next, verified: false });
      setError(caught instanceof Error ? caught.message : "Connection failed.");
    } finally {
      setBusy(false);
    }
  }

  function onDisconnect() {
    clearAiSetup();
    setSetup(emptyAiSetup());
    setStatus("AI API disconnected for this tab.");
    setError(null);
  }

  return (
    <div className="dashboard">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="app-header">
        <div>
          <p className="muted" style={{ marginBottom: 4 }}>
            Faculty Design Studio
          </p>
          <h1>AI API setup</h1>
        </div>
        <Link className="btn btn-secondary" to="/">
          Back to roadmap
        </Link>
      </header>
      <main id="main" className="stack" style={{ maxWidth: "46rem" }}>
        <p className="lede">
          Default is no AI. A passcode unlocks a proxy that calls Claude or ChatGPT. Provider
          keys stay on the server; they are not stored in this browser or in the downloaded
          JavaScript.
        </p>

        <p className={connected ? "pill pill-ok" : "pill"}>
          {connected
            ? `Connected: ${option.label}`
            : "No AI API connected"}
        </p>

        <SelectField
          id="ai-model"
          label="Model"
          hint="No AI API is the default. Choose a model only when you have a current passcode."
          value={setup.selection}
          onChange={(selection) => persist({ ...setup, selection, verified: false })}
          options={AI_MODEL_OPTIONS.map((item) => ({ value: item.value, label: item.label }))}
        />

        <div className="field">
          <div className="field-label-row">
            <label htmlFor="ai-passcode">Passcode</label>
          </div>
          <input
            id="ai-passcode"
            type="password"
            autoComplete="off"
            value={setup.passcode}
            onChange={(event) =>
              persist({ ...setup, passcode: event.target.value, verified: false })
            }
          />
        </div>

        <div className="card-actions">
          <button type="button" className="btn btn-primary" onClick={onTest} disabled={busy}>
            {busy ? "Testing…" : "Test connection"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onSave} disabled={busy}>
            Save
          </button>
          <button type="button" className="btn btn-ghost" onClick={onDisconnect} disabled={busy}>
            Disconnect
          </button>
        </div>
        {error ? (
          <p className="callout callout-warn" role="alert">
            {error}
          </p>
        ) : null}
        {status ? (
          <p className="callout" role="status">
            {status}
          </p>
        ) : null}
        {!proxy ? (
          <p className="muted">
            Proxy URL is empty in this build. Set <code>VITE_AI_PROXY_URL</code> when you
            deploy the Cloud Run proxy, then rebuild.
          </p>
        ) : (
          <p className="muted">Proxy: {proxy}</p>
        )}

        <section>
          <h2>Capabilities when configured</h2>
          <ul className="inventory-list">
            {CAPABILITIES.map((item) => {
              const on = item.status === "ready" && connected;
              return (
                <li key={item.id}>
                  <strong>
                    {item.name}
                    {item.status === "planned" ? " (planned)" : on ? " — on" : " — off until connected"}
                  </strong>
                  <span className="muted"> {item.detail}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
