import Link from "next/link";
import type { Room } from "@/lib/types";
import { ImageCarousel } from "@/app/components/ImageCarousel";

export function RoomCard({ room }: { room: Room }) {
  const images = room.images ?? [];

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-16/10 w-full bg-slate-800">
        <ImageCarousel images={images} autoPlay className="h-full w-full" />
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
        <div>
          <div className="line-clamp-1 text-base font-semibold text-zinc-50">
            {room.title}
          </div>
          <div className="text-sm text-zinc-400">{room.location}</div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-emerald-500/10 px-2 py-1 font-semibold text-emerald-300">
            ₹{room.rent}/mo
          </span>
          <span className="rounded-full bg-slate-800 px-2 py-1 text-zinc-200">
            {room.property_type}
          </span>
          <span className="rounded-full bg-slate-800 px-2 py-1 text-zinc-200">
            {room.tenant_preference}
          </span>
        </div>

        <div className="text-sm text-zinc-300">
          Contact:{" "}
          <span className="font-medium text-zinc-50 underline-offset-2">
            {room.contact_number}
          </span>
        </div>
      </div>
    </Link>
  );
}
