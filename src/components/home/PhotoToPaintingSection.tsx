"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/lib/store/currency";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Check, ArrowRight } from "lucide-react";
import type { PhotoToPaintingItem } from "@/types";

interface PhotoToPaintingSectionProps {
  items: PhotoToPaintingItem[];
}

function BeforeAfterCard({ item }: { item: PhotoToPaintingItem }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerMove={handlePointerMove}
      style={{ touchAction: "none" }}
      className="relative w-full aspect-[360/430] rounded-2xl overflow-hidden shadow-xl border border-[#e5e0d8] bg-black select-none cursor-ew-resize group"
    >
      {/* Painting Result (Full background) */}
      <Image
        src={item.paintingResult}
        alt={`${item.title} - Painting Result`}
        fill
        className="object-cover pointer-events-none"
      />
      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase font-sans z-10 pointer-events-none">
        OUR PAINTING
      </span>

      {/* Original Photo (Clipped overlay) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative w-full h-full min-w-full">
          <Image
            src={item.originalPhoto}
            alt={`${item.title} - Original Photo`}
            fill
            className="object-cover pointer-events-none"
          />
        </div>
        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase font-sans z-10 pointer-events-none">
          ORIGINAL PHOTO
        </span>
      </div>

      {/* Draggable Divider Handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none z-20 shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--color-ink)] border-2 border-white text-white flex items-center justify-center text-xs font-bold shadow-xl pointer-events-none">
          ‹›
        </div>
      </div>
    </div>
  );
}

export function PhotoToPaintingSection({ items = [] }: PhotoToPaintingSectionProps) {
  const { currency, convert } = useCurrencyStore();
  return (
    <section className="py-12 sm:py-20 bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <Eyebrow className="mb-2">PHOTO TO PAINTING</Eyebrow>
          <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-[var(--color-ink)]">
            Custom Portraits From Your Photos
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-2">
            Transform your personal photograph into museum-grade framed canvas art.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-[var(--color-ink)] font-medium font-sans">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#00b67a]" /> Museum-quality canvas
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#00b67a]" /> From {formatPrice(convert(249, "USD"), currency)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#00b67a]" /> Free shipping
            </span>
          </div>

          <div className="mt-5 sm:mt-6">
            <Link
              href="/photo-to-painting"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[var(--color-ink)] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm font-sans"
            >
              <span>CREATE YOUR CUSTOM PAINTING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Grid of 3 BeforeAfterCards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <BeforeAfterCard item={item} />
              <div className="text-center pt-2">
                <h4 className="font-serif text-sm font-semibold text-[var(--color-ink)]">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}