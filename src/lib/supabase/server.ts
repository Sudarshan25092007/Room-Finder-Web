import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Server component / server action usage (reads/writes auth cookies for SSR).
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Next.js server components can set cookies in server actions / route handlers.
        // This is still safe here; Next will ignore it when not allowed.
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}


