import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const listHref = user ? "/owner/rooms" : "/auth/login";

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%),radial-gradient(circle_at_bottom,rgba(34,197,94,0.18),transparent_60%)]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200 backdrop-blur">
              Live rooms • Verified owners • Instant contact
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Find your{" "}
              <span className="bg-linear-to-r from-emerald-400 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                next room
              </span>
              .
            </h1>
            <p className="max-w-xl text-sm text-zinc-300 sm:text-base">
              Search real rooms from real owners. Compare locations, prices, and
              preferences in seconds, then call the owner directly.
            </p>

            <form
              action={async (formData) => {
                "use server";
                const location = String(formData.get("location") ?? "").trim();
                const qs = location
                  ? `?location=${encodeURIComponent(location)}`
                  : "";
                redirect(`/rooms${qs}`);
              }}
              className="mt-2 flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-2 backdrop-blur sm:flex-row sm:items-center"
            >
              <input
                name="location"
                placeholder="Search by area, landmark, or city"
                className="h-11 flex-1 rounded-xl border border-transparent bg-black/40 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <div className="flex gap-2">
                <Link
                  href="/rooms"
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800 sm:flex-none"
                >
                  Browse rooms
                </Link>
                <Link
                  href={listHref}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-linear-to-r from-emerald-500 to-sky-500 px-4 text-sm font-medium text-black shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-sky-400 sm:flex-none"
                >
                  List your property
                </Link>
              </div>
            </form>

            <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                No brokerage on direct owner listings
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                Works great on mobile
              </div>
            </div>
          </div>

          <div className="grid gap-4 text-sm text-zinc-200 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                1
              </div>
              <h2 className="mb-1 text-sm font-semibold">Search</h2>
              <p className="text-xs text-zinc-400">
                Filter by location, budget, and preferences in one place.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                2
              </div>
              <h2 className="mb-1 text-sm font-semibold">Compare</h2>
              <p className="text-xs text-zinc-400">
                Scroll through photos and details like on your favourite travel
                sites.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-300">
                3
              </div>
              <h2 className="mb-1 text-sm font-semibold">Contact</h2>
              <p className="text-xs text-zinc-400">
                Call the owner directly and close the deal without middlemen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
