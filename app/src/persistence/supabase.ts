import { createClient, type SupabaseClient } from "@supabase/supabase-js";
// Side effect only: records the recovery token and any link error from the URL,
// which must happen before the client below starts consuming the URL.
import "../auth/passwordSetup";

let client: SupabaseClient | null | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    client = null;
    return client;
  }
  client = createClient(url, anon, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
    },
  });
  return client;
}

// detectSessionInUrl reads window.location when the client is built. Build it at
// import time so the recovery token is claimed before the router rewrites the URL.
if (typeof window !== "undefined") {
  getSupabase();
}

export async function currentUserId(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}
