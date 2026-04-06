"use client";

import { useEffect, useRef, useState } from "react";

type ProductCardCarouselProps = {
  images: string[];
  name: string;
};

export default function ProductCardCarousel({
  images,
  name,
}: ProductCardCarouselProps) {
  const safeImages = images.length > 0 ? images : ["/placeholder.svg"];
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const isInteracting = useRef(false);

  const showPrev = () => {
    setIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const showNext = () => {
    setIndex((prev) => (prev + 1) % safeImages.length);
  };

  useEffect(() => {
    if (safeImages.length <= 1) return;
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      if (!isInteracting.current) {
        showNext();
      }
    }, 4000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeImages.length]);

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    isInteracting.current = true;
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const endX = event.changedTouches[0]?.clientX ?? null;
    if (touchStartX.current === null || endX === null) {
      isInteracting.current = false;
      return;
    }
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > 30) {
      if (delta > 0) {
        showPrev();
      } else {
        showNext();
      }
    }
    touchStartX.current = null;
    isInteracting.current = false;
  };

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden"
      onMouseEnter={() => {
        isInteracting.current = true;
      }}
      onMouseLeave={() => {
        isInteracting.current = false;
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <img
        src={safeImages[index]}
        alt={name}
        className="h-full w-full object-cover transition duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,15,15,0.3)] via-transparent" />
      {safeImages.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              showPrev();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-xs text-[var(--umber)]"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              showNext();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-xs text-[var(--umber)]"
            aria-label="Next image"
          >
            →
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
            {safeImages.map((_, dotIndex) => (
              <span
                key={`dot-${dotIndex}`}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  dotIndex === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
