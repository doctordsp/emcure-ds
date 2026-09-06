const STORAGE_KEY = "emcure.auth.set-password";

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
