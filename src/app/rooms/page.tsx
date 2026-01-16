import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Room } from "@/lib/types";
import { FilterBar } from "@/app/components/FilterBar";
import { RoomCard } from "@/app/components/RoomCard";

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const location = first(sp.location)?.trim() ?? "";
  const minRent = Number(first(sp.minRent) ?? "");
  const maxRent = Number(first(sp.maxRent) ?? "");
  const propertyType = first(sp.propertyType) ?? "";
  const tenantPreference = first(sp.tenantPreference) ?? "";

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (location) query = query.ilike("location", `%${location}%`);
  if (!Number.isNaN(minRent) && minRent > 0) query = query.gte("rent", minRent);
  if (!Number.isNaN(maxRent) && maxRent > 0) query = query.lte("rent", maxRent);
  if (propertyType) query = query.eq("property_type", propertyType);
  if (tenantPreference) {
    query = query.eq("tenant_preference", tenantPreference);
  }

  const { data, error } = await query;
  const rooms = (data ?? []) as Room[];

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Browse rooms
          </h1>
          <p className="text-sm text-zinc-400 sm:text-base">
            Use filters to narrow down results. Location usually matters most.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm sm:p-6">
          <FilterBar />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-100 sm:p-6">
            {error.message}
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-sm sm:p-12">
            <p className="text-sm text-zinc-200 sm:text-base">
              No rooms found. Try clearing filters or widening your search.
            </p>
          </div>
        ) : (
          <section className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
