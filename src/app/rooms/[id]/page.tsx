import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Room } from "@/lib/types";
import { ImageCarousel } from "@/app/components/ImageCarousel";

export default async function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const room = data as Room;
  const images = room.images ?? [];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {/* Top slideshow */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-zinc-200 shadow-lg dark:bg-slate-800 sm:mb-8">
          <div className="relative aspect-21/9 w-full">
            {images.length > 0 ? (
              <ImageCarousel
                images={images}
                autoPlay
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-500 dark:bg-slate-800 dark:text-zinc-400">
                <span className="text-sm sm:text-base">No image available</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Left: Main Details */}
          <div className="space-y-6">
            {/* Title and Location */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                {room.title}
              </h1>
              <div className="flex items-center gap-2 text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{room.location}</span>
              </div>
            </div>

            {/* Rent */}
            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 dark:bg-emerald-500/10">
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300 sm:text-xl">
                ₹{room.rent}
              </span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                /month
              </span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:bg-slate-800 dark:text-zinc-200">
                {room.property_type}
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:bg-slate-800 dark:text-zinc-200">
                {room.tenant_preference}
              </span>
            </div>

            {/* Description */}
            {room.description && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Description
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                  {room.description}
                </p>
              </div>
            )}
          </div>

          {/* Right: Contact */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Contact Owner
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Call the owner directly
                  </p>
                  <a
                    href={`tel:${room.contact_number}`}
                    className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{room.contact_number}</span>
                  </a>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Tap to call • Available 24/7
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
