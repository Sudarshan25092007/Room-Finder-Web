import { createBrowserClient } from "@supabase/ssr";

// Client component / browser usage (uses the logged-in user's session in the browser).
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  return createBrowserClient(url, key);
}


