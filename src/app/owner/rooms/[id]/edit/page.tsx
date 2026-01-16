import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Room } from "@/lib/types";
import { OwnerRoomForm } from "@/app/components/OwnerRoomForm";

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
        {error.message}
      </div>
    );
  }
  if (!data) notFound();

  const room = data as Room;

  async function deleteRoom() {
    "use server";
    const supabaseServer = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();
    if (!user) redirect("/auth/login");

    await supabaseServer
      .from("rooms")
      .delete()
      .eq("id", id)
      .eq("owner_id", user.id);

    redirect("/owner/rooms");
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Edit room
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Update details and images.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/owner/rooms"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:hover:bg-slate-800"
          >
            Back
          </Link>
          <form action={deleteRoom}>
            <button
              type="submit"
              className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <OwnerRoomForm mode="edit" initialRoom={room} />
      </div>
    </div>
  );
}
