"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Room } from "@/lib/types";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  initialRoom?: Room;
};

function extractStoragePathFromPublicUrl(publicUrl: string) {
  const marker = "/room-images/";
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

export function OwnerRoomForm({ mode, initialRoom }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [title, setTitle] = useState(initialRoom?.title ?? "");
  const [description, setDescription] = useState(initialRoom?.description ?? "");
  const [location, setLocation] = useState(initialRoom?.location ?? "");
  const [rent, setRent] = useState(String(initialRoom?.rent ?? ""));
  const [propertyType, setPropertyType] = useState(
    initialRoom?.property_type ?? "Apartment",
  );
  const [tenantPreference, setTenantPreference] = useState(
    initialRoom?.tenant_preference ?? "Anyone",
  );
  const [contactNumber, setContactNumber] = useState(
    initialRoom?.contact_number ?? "",
  );
  const [newImages, setNewImages] = useState<FileList | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function uploadImages(files: FileList, ownerId: string) {
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file || file.size === 0) continue;

      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !["jpg", "jpeg", "png", "webp"].includes(ext)) {
        console.warn("Skipping unsupported file:", file.name);
        continue;
      }

      const path = `${ownerId}/${crypto.randomUUID()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("room-images")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("room-images").getPublicUrl(path);

      urls.push(publicUrl);
    }

    return urls;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const rentNumber = Number(rent);
    if (!title.trim() || !location.trim() || !contactNumber.trim()) {
      setError("Please fill all required fields.");
      return;
    }
    if (Number.isNaN(rentNumber) || rentNumber <= 0) {
      setError("Rent must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Not logged in.");

      const uploaded = newImages ? await uploadImages(newImages, user.id) : [];
      const mergedImages = [
        ...(initialRoom?.images ?? []),
        ...uploaded,
      ].filter(Boolean);

      if (mode === "create") {
        const { error: insertError } = await supabase.from("rooms").insert({
          title: title.trim(),
          description: description.trim() || null,
          location: location.trim(),
          rent: rentNumber,
          property_type: propertyType,
          tenant_preference: tenantPreference,
          contact_number: contactNumber.trim(),
          images: mergedImages,
          owner_id: user.id,
        });
        if (insertError) throw insertError;

        setSuccess("Room created.");
        router.push("/owner/rooms");
        router.refresh();
      } else {
        const roomId = initialRoom?.id;
        if (!roomId) throw new Error("Missing room id.");

        const { error: updateError } = await supabase
          .from("rooms")
          .update({
            title: title.trim(),
            description: description.trim() || null,
            location: location.trim(),
            rent: rentNumber,
            property_type: propertyType,
            tenant_preference: tenantPreference,
            contact_number: contactNumber.trim(),
            images: mergedImages,
          })
          .eq("id", roomId);
        if (updateError) throw updateError;

        setSuccess("Room updated.");
        router.push("/owner/rooms");
        router.refresh();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function removeExistingImage(url: string) {
    if (!initialRoom) return;

    const remaining = (initialRoom.images ?? []).filter((u) => u !== url);
    const { error: updateError } = await supabase
      .from("rooms")
      .update({ images: remaining })
      .eq("id", initialRoom.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    const path = extractStoragePathFromPublicUrl(url);
    if (path) {
      await supabase.storage.from("room-images").remove([path]);
    }

    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
          {success}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Title *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            placeholder="3BHK near metro"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Description
          </label>
          <textarea
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            rows={4}
            placeholder="Add key details (deposit, amenities, nearby places, etc.)"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Location *
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            placeholder="Electronic City, Bengaluru"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Rent *
          </label>
          <input
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            required
            inputMode="numeric"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            placeholder="7000"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Property type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
          >
            <option value="Apartment">Apartment</option>
            <option value="Independent House">Independent House</option>
            <option value="PG">PG</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Tenant preference
          </label>
          <select
            value={tenantPreference}
            onChange={(e) => setTenantPreference(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
          >
            <option value="Anyone">Anyone</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Family">Family</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Contact number *
          </label>
          <input
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            placeholder="+91 9XXXXXXXXX"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Images (you can select multiple / no HEIC files)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewImages(e.target.files)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-zinc-800 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:file:bg-zinc-100 dark:file:text-slate-900 dark:hover:file:bg-white"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Uploads go to Supabase Storage bucket{" "}
            <span className="font-medium">room-images</span>.
          </p>
        </div>
      </div>

      {mode === "edit" && (initialRoom?.images?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Existing images
          </div>
          <div className="flex flex-wrap gap-2">
            {(initialRoom?.images ?? []).map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => removeExistingImage(url)}
                className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-800 hover:bg-zinc-50 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:hover:bg-slate-800"
              >
                Remove image
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Removing an image updates the listing immediately and also tries to
            delete the file from Storage.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-slate-900 dark:hover:bg-white"
      >
        {loading ? "Saving..." : mode === "create" ? "Create room" : "Save changes"}
      </button>
    </form>
  );
}
