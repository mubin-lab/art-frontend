"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  CheckCircle2,
  Quote,
  Maximize2,
  X,
} from "lucide-react";
import type { CustomerFeedback } from "@/types";

interface CustomerFeedbackSliderProps {
  feedbacks?: CustomerFeedback[];
  className?: string;
}

export function CustomerFeedbackSlider({
  feedbacks = [],
  className = "",
}: CustomerFeedbackSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = feedbacks.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play timer (pauses on hover or when preview modal is open)
  useEffect(() => {
    if (total <= 1 || isPaused || previewImage) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [total, isPaused, previewImage, nextSlide]);

  if (!feedbacks || feedbacks.length === 0) {
    return null;
  }

  const current = feedbacks[currentIndex];

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  // Average rating
  const avgRating = (
    feedbacks.reduce((acc, item) => acc + (item.rating || 5), 0) / total
  ).toFixed(1);

  return (
    <>
      <section
        aria-label="Collector Feedback & Reviews"
        className={`rounded-2xl bg-[#faf8f5] border border-[#e8dfd1] p-4 sm:p-5 shadow-xs transition-all ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header Row: Title & Slider Controls */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e8dfd1]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#a8844a] font-sans">
                Collector Feedback
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#f4ebdb] text-[#8a6829] text-[10px] font-semibold">
                <Star className="w-2.5 h-2.5 fill-[#d4af37] text-[#d4af37]" />
                <span>
                  {avgRating} ({total})
                </span>
              </span>
            </div>
            <h3 className="font-serif text-sm sm:text-base font-semibold text-[var(--color-ink)] mt-0.5">
              Verified Customer Experiences
            </h3>
          </div>

          {/* Prev / Next Buttons */}
          {total > 1 && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[11px] text-[var(--color-muted)] font-mono hidden sm:inline mr-1">
                {currentIndex + 1}/{total}
              </span>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous feedback"
                className="w-7 h-7 rounded-full bg-white border border-[#d9d0c1] hover:border-[#a8844a] hover:bg-[#faf6ee] text-[var(--color-ink)] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next feedback"
                className="w-7 h-7 rounded-full bg-white border border-[#d9d0c1] hover:border-[#a8844a] hover:bg-[#faf6ee] text-[var(--color-ink)] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Active Feedback Card */}
        <div className="relative flex flex-col justify-between">
          {/* Rating Stars & Quote Icon */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < (current.rating || 5)
                      ? "fill-[#d4af37] text-[#d4af37]"
                      : "fill-neutral-200 text-neutral-200"
                  }`}
                />
              ))}
              <span className="text-xs font-semibold text-[var(--color-ink)] ml-1.5">
                {(current.rating || 5).toFixed(1)}
              </span>
            </div>
            <Quote className="w-5 h-5 text-[#d4af37]/40 rotate-180 flex-shrink-0" />
          </div>

          {/* Review Media & Feedback Content Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start my-1.5">
            {/* Customer Product Photo (In-Room / On-Wall) */}
            {current.customer_product && (
              <div
                onClick={() => setPreviewImage(current.customer_product || null)}
                className="group relative w-full sm:w-24 sm:h-24 aspect-16/9 sm:aspect-square rounded-xl overflow-hidden bg-neutral-200/60 border border-[#d9d0c1] hover:border-[#a8844a] flex-shrink-0 cursor-pointer shadow-2xs transition-all"
                title="Click to zoom customer photo"
              >
                <Image
                  src={current.customer_product}
                  alt={`${current.customer_name}'s received painting`}
                  fill
                  sizes="(max-width: 640px) 100vw, 96px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 font-sans">
                    <Maximize2 className="w-2.5 h-2.5" />
                    <span>View</span>
                  </span>
                </div>
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-sans font-bold bg-black/75 text-white tracking-wide">
                  Customer Photo
                </span>
              </div>
            )}

            {/* Feedback Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-[13px] text-[var(--color-ink)]/90 leading-relaxed font-sans italic line-clamp-4">
                &ldquo;{current.feedback}&rdquo;
              </p>
            </div>
          </div>

          {/* Customer Info Row */}
          <div className="flex items-center justify-between gap-3 pt-3 mt-2 border-t border-[#eee6da]">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Customer Avatar */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#e8dfd1] border border-white shadow-2xs flex-shrink-0">
                {current.customer_img ? (
                  <Image
                    src={current.customer_img}
                    alt={current.customer_name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#d4af37] text-white text-[11px] font-bold">
                    {current.customer_name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="text-xs font-bold text-[var(--color-ink)] truncate font-sans">
                  {current.customer_name}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[var(--color-muted)] truncate font-sans">
                  <MapPin className="w-3 h-3 text-[#a8844a] flex-shrink-0" />
                  <span className="truncate">{current.customer_location}</span>
                </div>
              </div>
            </div>

            {/* Verified Badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[10px] font-semibold flex-shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span className="hidden sm:inline">Verified Buyer</span>
              <span className="sm:hidden">Verified</span>
            </div>
          </div>
        </div>

        {/* Pagination Dots (if multiple) */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-3 mt-1">
            {feedbacks.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to feedback ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "w-5 bg-[#a8844a]"
                    : "w-1.5 bg-[#d9d0c1] hover:bg-[#b8953c]"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Enlarged Customer Photo Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-neutral-900 rounded-2xl overflow-hidden border border-white/20 p-2 sm:p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 px-2 border-b border-white/10 text-white">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#ceab51] font-sans block">
                  Customer Display Photo
                </span>
                <p className="text-xs text-neutral-300 font-sans truncate">
                  {current.customer_name} ({current.customer_location})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-4/3 sm:aspect-16/10 w-full mt-3 rounded-lg overflow-hidden bg-neutral-950">
              <Image
                src={previewImage}
                alt={`${current.customer_name}'s photo`}
                fill
                sizes="(max-width: 768px) 95vw, 672px"
                className="object-contain"
              />
            </div>

            <div className="pt-3 px-2 text-center text-[11px] text-neutral-400 font-sans">
              &ldquo;{current.feedback}&rdquo;
            </div>
          </div>
        </div>
      )}
    </>
  );
}
