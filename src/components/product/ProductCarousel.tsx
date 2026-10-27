"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Painting } from "@/types";

interface ProductCarouselProps {
  paintings: Painting[];
}

export function ProductCarousel({ paintings }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative group">
      {/* Viewport - Shows exactly 2.3 cards on mobile (43.5% width) */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-3 sm:-ml-4 py-2">
          {paintings.map((painting) => (
            <div
              key={painting.id}
              className="flex-[0_0_58.5%] sm:flex-[0_0_36%] md:flex-[0_0_28%] lg:flex-[0_0_20%] xl:flex-[0_0_16.666%] pl-3 sm:pl-4 min-w-0"
            >
              <ProductCard painting={painting} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows (Desktop / Tablet) */}
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        aria-label="Previous slide"
        className={`hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 rounded-full bg-white shadow-xl border border-[#e5e0d8] items-center justify-center text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-black transition-all duration-200 z-20 cursor-pointer disabled:opacity-0 disabled:pointer-events-none opacity-0 group-hover:opacity-100`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        aria-label="Next slide"
        className={`hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 rounded-full bg-white shadow-xl border border-[#e5e0d8] items-center justify-center text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-black transition-all duration-200 z-20 cursor-pointer disabled:opacity-0 disabled:pointer-events-none opacity-0 group-hover:opacity-100`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}