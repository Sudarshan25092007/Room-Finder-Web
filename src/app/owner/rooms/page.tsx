// src/app/owner/rooms/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Room } from "@/lib/types";
import { RoomsListClient } from "./RoomsListClient";

export default async function OwnerRoomsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const rooms = (data ?? []) as Room[];

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-6 space-y-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
              My rooms
            </h1>
            <p className="text-sm text-zinc-400">
              Add, edit, or delete your listings.
            </p>
          </div>

          <Link
            href="/owner/rooms/new"
            className="rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white"
          >
            Add new room
          </Link>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-100">
            {error.message}
          </div>
        ) : (
          <RoomsListClient initialRooms={rooms} />
        )}
      </div>
    </main>
  );
}
