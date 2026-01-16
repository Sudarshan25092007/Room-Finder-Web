"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  isLoggedIn: boolean;
  onLogout: () => void;
};

export function NavbarClient({ isLoggedIn, onLogout }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkBase = "text-sm transition-colors hover:text-zinc-100";
  const inactive = "text-zinc-400";
  const active = "text-zinc-50 font-medium underline underline-offset-4";

  const links = [
    { href: "/", label: "Home", active: pathname === "/" },
    { href: "/rooms", label: "Browse Rooms", active: pathname.startsWith("/rooms") },
    { href: "/owner/rooms", label: "My Rooms", active: pathname.startsWith("/owner") },
  ];

  const AuthButton = isLoggedIn ? (
    <button
      type="button"
      onClick={onLogout}
      className="rounded-md bg-zinc-50 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-white"
    >
      Logout
    </button>
  ) : (
    <Link
      href="/auth/login"
      className="rounded-md bg-zinc-50 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-white"
    >
      Login
    </Link>
  );

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="rf-container flex items-center justify-between py-3">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-50"
        >
          RoomFinder
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${linkBase} ${l.active ? active : inactive}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {AuthButton}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-zinc-100 hover:bg-slate-800"
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-4 rounded bg-zinc-100" />
              <span className="block h-0.5 w-4 rounded bg-zinc-100" />
              <span className="block h-0.5 w-4 rounded bg-zinc-100" />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="rf-container pb-4 md:hidden">
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm shadow-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block rounded-md px-3 py-2 ${
                  l.active
                    ? "bg-zinc-50 text-slate-900"
                    : "text-zinc-200 hover:bg-slate-800"
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-1">{AuthButton}</div>
          </div>
        </div>
      )}
    </header>
  );
}
