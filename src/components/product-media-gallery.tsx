"use client";

import { useMemo, useRef, useState } from "react";
import { isVideoUrl } from "@/lib/media";

type MediaItem = {
  id: number;
  url: string;
  alt?: string | null;
};

export default function ProductMediaGallery({
  media,
  productName,
}: {
  media: MediaItem[];
  productName: string;
}) {
  const normalized = useMemo(() => {
    if (media.length > 0) return media;
    return [{ id: 0, url: "/placeholder.svg", alt: productName }];
  }, [media, productName]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const selected = normalized[selectedIndex] ?? normalized[0];

  const scrollStrip = (direction: "left" | "right") => {
    if (!stripRef.current) return;
    const offset = direction === "left" ? -260 : 260;
    stripRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/60">
        {isVideoUrl(selected.url) ? (
          <video
            src={selected.url}
            controls
            playsInline
            className="h-[460px] w-full object-cover"
          />
        ) : (
          <img
            src={selected.url}
            alt={selected.alt ?? productName}
            className="h-[460px] w-full object-cover"
          />
        )}
      </div>

      {normalized.length > 1 ? (
        <div className="rounded-2xl border border-white/60 bg-white/70 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
              Media
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollStrip("left")}
                className="h-8 w-8 rounded-full border border-[rgba(90,70,52,0.3)] text-sm"
                aria-label="Scroll thumbnails left"
              >
                {"<"}
              </button>
              <button
                type="button"
                onClick={() => scrollStrip("right")}
                className="h-8 w-8 rounded-full border border-[rgba(90,70,52,0.3)] text-sm"
                aria-label="Scroll thumbnails right"
              >
                {">"}
              </button>
            </div>
          </div>
          <div ref={stripRef} className="flex gap-3 overflow-x-auto pb-1">
            {normalized.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`shrink-0 overflow-hidden rounded-xl border transition ${
                  selectedIndex === index
                    ? "border-[var(--ink)] ring-2 ring-[var(--ink)]/20"
                    : "border-white/60"
                }`}
              >
                {isVideoUrl(item.url) ? (
                  <video
                    src={item.url}
                    muted
                    playsInline
                    className="h-20 w-28 object-cover md:h-24 md:w-36"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.alt ?? productName}
                    className="h-20 w-28 object-cover md:h-24 md:w-36"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
