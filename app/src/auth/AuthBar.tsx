import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthContext";

export function AuthBar() {
  const { configured, ready, user, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!configured) return null;
  if (!ready) {
    return (
      <section className="auth-panel" aria-label="Account">
        <p className="auth-kicker">Account</p>
        <p className="muted" style={{ margin: 0 }}>
          Checking account…
        </p>
      </section>
    );
  }

  async function onSignIn(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setBusy(true);
    try {
      await signInWithEmail(email);
      setStatus("Check your email for a sign-in link. It opens this studio.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send the sign-in link.");
    } finally {
      setBusy(false);
    }
  }

  if (user) {
    return (
      <section className="auth-panel" aria-label="Account">
        <p className="auth-kicker">Account</p>
        <div className="auth-row">
          <p className="auth-email">{user.email ?? "faculty"}</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              void signOut();
            }}
          >
            Sign out
          </button>
        </div>
        <p className="muted auth-note">Designs save in the cloud</p>
      </section>
    );
  }

  return (
    <section className="auth-panel" aria-label="Sign in">
      <p className="auth-kicker">Cloud save</p>
      <form className="auth-form" onSubmit={(event) => void onSignIn(event)}>
        <div className="auth-row">
          <label className="sr-only" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            className="auth-input"
            type="email"
            autoComplete="email"
            required
            placeholder="you@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit" className="btn btn-secondary" disabled={busy}>
            {busy ? "Sending…" : "Sign in"}
          </button>
        </div>
        {status ? (
          <p className="auth-status" role="status">
            {status}
          </p>
        ) : null}
        {error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
