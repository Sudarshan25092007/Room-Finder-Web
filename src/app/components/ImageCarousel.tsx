"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  images: string[];
  autoPlay?: boolean;
  className?: string;
};

export function ImageCarousel({ images, autoPlay = true, className }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);

    return () => clearInterval(id);
  }, [autoPlay, images.length]);

  if (!images.length) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-slate-800 text-sm text-zinc-400 ${
          className ?? ""
        }`}
      >
        No image
      </div>
    );
  }

  const current = images[index];

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-slate-800 ${
        className ?? ""
      }`}
    >
      <Image
        src={current}
        alt="Room image"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 w-3 rounded-full ${
                i === index ? "bg-zinc-100" : "bg-zinc-500/50"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
