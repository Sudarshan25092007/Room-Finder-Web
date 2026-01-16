import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function signOut() {
    "use server";
    const supabaseServer = await createSupabaseServerClient();
    await supabaseServer.auth.signOut();
  }

  return (
    <NavbarClient
      isLoggedIn={!!user}
      onLogout={async () => {
        "use server";
        await signOut();
      }}
    />
  );
}
