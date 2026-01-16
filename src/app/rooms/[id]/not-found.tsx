import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-slate-950">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Room not found
        </h1>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
          The room you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/rooms"
          className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Browse all rooms
        </Link>
      </div>
    </main>
  );
}
