import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "../persistence/supabase";
import {
  capturePasswordSetupFromUrl,
  clearPasswordSetup,
  isPasswordSetupPending,
  markPasswordSetupPending,
} from "./passwordSetup";

type AuthContextValue = {
  configured: boolean;
  ready: boolean;
  session: Session | null;
  user: User | null;
  recovering: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const GCS_HOST = "storage.googleapis.com";

function redirectTo(): string {
  const base = import.meta.env.BASE_URL || "/";
  const path = base.endsWith("/") ? base : `${base}/`;
  const url = `${window.location.origin}${path}`;
  // GCS object URLs do not serve index.html for a trailing slash, so invite
  // and recovery emails must land on the file or the window is blank.
  if (window.location.hostname === GCS_HOST && !url.endsWith("index.html")) {
    return `${url}index.html`;
  }
  return url;
}

if (typeof window !== "undefined") {
  capturePasswordSetupFromUrl();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [ready, setReady] = useState(!configured);
  const [session, setSession] = useState<Session | null>(null);
  const [recovering, setRecovering] = useState(() => isPasswordSetupPending());

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setReady(true);
      return;
    }
    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      if (isPasswordSetupPending()) setRecovering(true);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, next) => {
        if (event === "PASSWORD_RECOVERY") {
          markPasswordSetupPending();
          setRecovering(true);
        }
        if (event === "SIGNED_IN" && isPasswordSetupPending()) {
          setRecovering(true);
        }
        setSession(next);
        setReady(true);
      },
    );
    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Cloud save is not configured.");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
  }, []);

  const resetPasswordForEmail = useCallback(async (email: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Cloud save is not configured.");
    markPasswordSetupPending();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectTo(),
    });
    if (error) throw error;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Cloud save is not configured.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    clearPasswordSetup();
    setRecovering(false);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    clearPasswordSetup();
    setRecovering(false);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured,
      ready,
      session,
      user: session?.user ?? null,
      recovering,
      signInWithPassword,
      resetPasswordForEmail,
      updatePassword,
      signOut,
    }),
    [
      configured,
      ready,
      session,
      recovering,
      signInWithPassword,
      resetPasswordForEmail,
      updatePassword,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
