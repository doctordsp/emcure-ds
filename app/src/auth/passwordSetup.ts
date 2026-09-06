const STORAGE_KEY = "emcure.auth.set-password";

export type AuthLinkError = { code: string; message: string };

export function urlLooksLikePasswordSetup(href: string): boolean {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
  const blob = `${url.search}&${hash}`;
  if (/[?&#]type=(recovery|invite|signup|magiclink)\b/i.test(`?${blob}`)) return true;
  const search = url.searchParams;
  const hashParams = new URLSearchParams(hash);
  if (search.get("code") || hashParams.get("code")) return true;
  return false;
}

export function capturePasswordSetupFromUrl(href = typeof window === "undefined" ? "" : window.location.href): boolean {
  if (typeof window === "undefined") return false;
  if (urlLooksLikePasswordSetup(href)) {
    sessionStorage.setItem(STORAGE_KEY, "1");
    return true;
  }
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

export function markPasswordSetupPending(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, "1");
}

export function isPasswordSetupPending(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "1" || urlLooksLikePasswordSetup(window.location.href);
}

export function clearPasswordSetup(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function authLinkErrorFromUrl(href: string): AuthLinkError | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
  const hashParams = new URLSearchParams(hash);
  const read = (key: string) => url.searchParams.get(key) ?? hashParams.get(key);
  const code = read("error_code") ?? read("error");
  if (!code) return null;
  return { code, message: authLinkErrorMessage(code, read("error_description")) };
}

function authLinkErrorMessage(code: string, description: string | null): string {
  if (code === "otp_expired" || code === "access_denied") {
    return "That link has expired or was already used. Send yourself a new one below.";
  }
  return description || "That link could not be opened. Send yourself a new one below.";
}

// Supabase puts recovery tokens (and link errors) in the URL, and both the router
// and supabase-js rewrite the URL once React mounts. Read them at import time,
// before anything else runs, or the reset lands on a plain sign-in form.
let capturedLinkError: AuthLinkError | null = null;

if (typeof window !== "undefined") {
  capturedLinkError = authLinkErrorFromUrl(window.location.href);
  if (capturedLinkError) {
    clearPasswordSetup();
  } else {
    capturePasswordSetupFromUrl();
  }
}

export function passwordSetupLinkError(): AuthLinkError | null {
  return capturedLinkError;
}
