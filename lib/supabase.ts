import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser (client-side) Supabase client.
 * Safe to use in Client Components — uses public anon key only.
 * Call once per component; do NOT recreate on every render.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
