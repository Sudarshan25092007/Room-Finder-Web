"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type FilterState = {
  location: string;
  minRent: string;
  maxRent: string;
  propertyType: string;
  tenantPreference: string;
};

export function FilterBar() {
  const router = useRouter();
  const sp = useSearchParams();

  const initial = useMemo<FilterState>(
    () => ({
      location: sp.get("location") ?? "",
      minRent: sp.get("minRent") ?? "",
      maxRent: sp.get("maxRent") ?? "",
      propertyType: sp.get("propertyType") ?? "",
      tenantPreference: sp.get("tenantPreference") ?? "",
    }),
    [sp],
  );

  const [state, setState] = useState<FilterState>(initial);

  function applyFilters() {
    const params = new URLSearchParams();
    if (state.location.trim()) params.set("location", state.location.trim());
    if (state.minRent.trim()) params.set("minRent", state.minRent.trim());
    if (state.maxRent.trim()) params.set("maxRent", state.maxRent.trim());
    if (state.propertyType) params.set("propertyType", state.propertyType);
    if (state.tenantPreference) {
      params.set("tenantPreference", state.tenantPreference);
    }

    const qs = params.toString();
    router.push(qs ? `/rooms?${qs}` : "/rooms");
  }

  function clearFilters() {
    setState({
      location: "",
      minRent: "",
      maxRent: "",
      propertyType: "",
      tenantPreference: "",
    });
    router.push("/rooms");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
        <div className="sm:col-span-2 md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Location
          </label>
          <input
            value={state.location}
            onChange={(e) =>
              setState((s) => ({ ...s, location: e.target.value }))
            }
            placeholder="e.g. Koramangala"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Min rent
          </label>
          <input
            value={state.minRent}
            onChange={(e) =>
              setState((s) => ({ ...s, minRent: e.target.value }))
            }
            inputMode="numeric"
            placeholder="0"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Max rent
          </label>
          <input
            value={state.maxRent}
            onChange={(e) =>
              setState((s) => ({ ...s, maxRent: e.target.value }))
            }
            inputMode="numeric"
            placeholder="50000"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Property type
          </label>
          <select
            value={state.propertyType}
            onChange={(e) =>
              setState((s) => ({ ...s, propertyType: e.target.value }))
            }
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
          >
            <option value="">Any</option>
            <option value="Apartment">Apartment</option>
            <option value="Independent House">Independent House</option>
            <option value="PG">PG</option>
          </select>
        </div>

        <div className="sm:col-span-2 md:col-span-1">
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Tenant preference
          </label>
          <select
            value={state.tenantPreference}
            onChange={(e) =>
              setState((s) => ({ ...s, tenantPreference: e.target.value }))
            }
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
          >
            <option value="">Any</option>
            <option value="Anyone">Anyone</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Family">Family</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={applyFilters}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:hover:bg-slate-800"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
