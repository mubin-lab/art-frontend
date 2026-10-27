"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Rating } from "@/components/ui/Rating";
import type { Review } from "@/types";

interface FamousPaintingsSectionProps {
  reviews: Review[];
}

export function FamousPaintingsSection({ reviews = [] }: FamousPaintingsSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const activeReview = reviews[currentIdx] || reviews[0];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % reviews.length);
  };

  if (!activeReview) return null;

  return (
    <section className="py-16 sm:py-20 bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="THE RANKED MASTERPIECE"
          title="Explore the 100 Most Famous Paintings"
          subtitle="The most famous paintings in the world, beautifully framed on archival canvas."
          actionText="VIEW FULL RANKING →"
          actionHref="/shop?collection=top-100"
          align="center"
        />

        {/* ReviewSlider Panel (bg #201c1d, rounded-3xl) */}
        <div className="bg-[#201c1d] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-white/5 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[220px]">
            {/* Left: Review Text (Col 7) */}
            <div className="md:col-span-7 space-y-4">
              <Rating rating={activeReview.rating} />
              <blockquote className="font-serif text-xl sm:text-2xl text-white/95 leading-relaxed italic">
                "{activeReview.text}"
              </blockquote>
              <div className="text-xs font-sans text-white/60">
                <span className="font-bold text-white text-sm">
                  {activeReview.author}
                </span>{" "}
                · Product review · Trustpilot · Excerpt
              </div>
            </div>

            {/* Right: Framed Painting Preview (Col 5) */}
            <div className="md:col-span-5 flex items-center justify-center md:justify-end">
              <div className="flex flex-col items-center md:items-end">
                <div className="relative w-48 h-36 sm:w-56 sm:h-40 rounded-xl overflow-hidden border-4 border-[#d4af37] shadow-2xl bg-black">
                  <Image
                    src={activeReview.paintingImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/John_William_Waterhouse_-_The_Magic_Circle_-_Google_Art_Project.jpg/400px-John_William_Waterhouse_-_The_Magic_Circle_-_Google_Art_Project.jpg"}
                    alt={activeReview.paintingTitle || "Preview"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-[11px] text-white/50 text-right mt-2 font-sans">
                  <span className="text-white/80 font-medium">
                    {activeReview.paintingTitle}
                  </span>{" "}
                  / {activeReview.frameLabel}
                  <div className="text-[10px] text-white/40">
                    {activeReview.photographer}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-sans">
            <span className="hidden sm:inline">
              Selected review excerpts. Studio photos of the featured paintings.
            </span>
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous review"
                className="p-1 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-white/80">
                {currentIdx + 1} / {reviews.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next review"
                className="p-1 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}