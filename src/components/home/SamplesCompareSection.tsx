"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SampleCompare } from "@/types";

interface SamplesCompareSectionProps {
  samples: SampleCompare[];
}

export function SamplesCompareSection({ samples = [] }: SamplesCompareSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const activeSample = samples[currentIdx] || samples[0];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + samples.length) % samples.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % samples.length);
  };

  if (!activeSample) return null;

  return (
    <section id="samples" className="py-12 sm:py-20 bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="REPRODUCTION SAMPLES"
          title="See a Real Canvas Next to the Original"
          subtitle="Compare museum originals side-by-side with our premium framed canvas art."
          align="center"
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Side by Side Framed Paintings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 items-center">
            {/* The Original */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-3">
              <div className="relative w-full aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden border-[4px] sm:border-[6px] border-[#d4af37] shadow-xl bg-black">
                <Image
                  src={activeSample.originalImage}
                  alt={`${activeSample.title} - The Original`}
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase font-sans">
                  THE ORIGINAL
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-[var(--color-muted)] font-medium font-sans text-center">
                Museum scan archival reference
              </span>
            </div>

            {/* Our Canvas */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-3">
              <div className="relative w-full aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden border-[4px] sm:border-[6px] border-[#d4af37] shadow-xl bg-black">
                <Image
                  src={activeSample.canvasImage}
                  alt={`${activeSample.title} - Our Framed Canvas Art`}
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[var(--color-ink)] text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase font-sans">
                  OUR CANVAS
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-[var(--color-muted)] font-medium font-sans text-center">
                Real raised oil brushstrokes on linen
              </span>
            </div>
          </div>

          {/* Bottom Title & Pager */}
          <div className="mt-6 sm:mt-8 flex items-center justify-between text-center pt-4 border-t border-[#e5e0d8] gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous sample"
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[var(--color-gold)] transition-colors cursor-pointer flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="font-serif text-sm sm:text-lg font-medium text-[var(--color-ink)] truncate flex-1 px-2">
              {activeSample.title} · {activeSample.artist}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next sample"
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[var(--color-gold)] transition-colors cursor-pointer flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}