import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthContext";

export function AuthBar() {
  const {
    configured,
    ready,
    user,
    recovering,
    linkError,
    signInWithPassword,
    resetPasswordForEmail,
    updatePassword,
    cancelPasswordSetup,
    signOut,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await signInWithPassword(email, password);
      setPassword("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function onForgotPassword() {
    setError(null);
    setStatus(null);
    if (!email.trim()) {
      setError("Enter your email first, then choose Forgot password.");
      return;
    }
    setBusy(true);
    try {
      await resetPasswordForEmail(email);
      setStatus("Check your email for a password reset link. It opens this studio.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send the reset email.");
    } finally {
      setBusy(false);
    }
  }

  async function onSetPassword(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setBusy(true);
    try {
      await updatePassword(password);
      setPassword("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the password.");
    } finally {
      setBusy(false);
    }
  }

  if (user && recovering) {
    return (
      <section className="auth-panel" aria-label="Set password">
        <p className="auth-kicker">Set password</p>
        <form className="auth-form" onSubmit={(event) => void onSetPassword(event)}>
          <div className="auth-row">
            <label className="sr-only" htmlFor="auth-new-password">
              New password
            </label>
            <input
              id="auth-new-password"
              className="auth-input"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="submit" className="btn btn-secondary" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </button>
          </div>
          <p className="muted auth-note">
            Choose a password for {user.email ?? "this account"}. You will use it to sign in next time.
          </p>
          {error ? (
            <p className="field-error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </section>
    );
  }

  if (recovering && !user) {
    return (
      <section className="auth-panel" aria-label="Set password">
        <p className="auth-kicker">Set password</p>
        <div className="auth-row">
          <label className="sr-only" htmlFor="auth-recovery-email">
            Email
          </label>
          <input
            id="auth-recovery-email"
            className="auth-input"
            type="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button
            type="button"
            className="btn btn-secondary"
            disabled={busy}
            onClick={() => {
              void onForgotPassword();
            }}
          >
            {busy ? "Sending…" : "Send link"}
          </button>
        </div>
        <p className="muted auth-note">
          {linkError ??
            "This link did not finish signing you in. Send a new one and open it in this browser."}
        </p>
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
        <button type="button" className="auth-forgot" onClick={cancelPasswordSetup}>
          Back to sign in
        </button>
      </section>
    );
  }

  if (user) {
    return (
      <section className="auth-panel" aria-label="Cloud save">
        <p className="auth-kicker">Cloud save</p>
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
    <section className="auth-panel" aria-label="Local save">
      <p className="auth-kicker">Local save</p>
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
        </div>
        <div className="auth-row">
          <label className="sr-only" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            className="auth-input"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit" className="btn btn-secondary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
        <p className="muted auth-note">Sign in for cloud save. Accounts are invite-only.</p>
        <button
          type="button"
          className="auth-forgot"
          disabled={busy}
          onClick={() => {
            void onForgotPassword();
          }}
        >
          Forgot password
        </button>
        {linkError && !status ? (
          <p className="field-error" role="alert">
            {linkError}
          </p>
        ) : null}
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
