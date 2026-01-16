"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Room } from "@/lib/types";
import { useToast } from "@/app/components/ui/ToastProvider";

type Props = {
  initialRooms: Room[];
};

export function RoomsListClient({ initialRooms }: Props) {
  const [rooms, setRooms] = useState(initialRooms);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();
  const { showToast } = useToast();

  async function handleDelete(roomId: string) {
    if (!confirm("Are you sure you want to delete this room?")) return;

    setDeletingId(roomId);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        showToast("You must be logged in to delete rooms.", "error");
        return;
      }

      const { error } = await supabase
        .from("rooms")
        .delete()
        .eq("id", roomId)
        .eq("owner_id", user.id);

      if (error) {
        showToast("Failed to delete room. Please try again.", "error");
        return;
      }

      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      showToast("Room deleted.", "success");
    } catch {
      showToast("Failed to delete room. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-slate-800 dark:bg-slate-900 dark:text-zinc-400">
        You have no rooms yet. Click{" "}
        <span className="font-medium">“Add new room”</span> to create your first
        listing.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((r) => (
        <div
          key={r.id}
          className="flex h-full flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {r.title}
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {r.location}
            </div>
            <div className="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              ₹{r.rent}/mo
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              href={`/owner/rooms/${r.id}/edit`}
              className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-center text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:hover:bg-slate-800"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(r.id)}
              disabled={deletingId === r.id}
              className="flex-1 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              {deletingId === r.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
