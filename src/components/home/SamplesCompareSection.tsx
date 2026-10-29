"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SampleCompare } from "@/types";

interface SamplesCompareSectionProps {
  samples?: SampleCompare[];
}

const STATIC_SAMPLES: SampleCompare[] = [
  {
    id: "sample-1",
    title: "The Starry Night (Canvas Impasto Detail)",
    artist: "Vincent van Gogh",
    originalImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    canvasImage: "/images/samples/canvas-impasto-macro.jpg",
  },
  {
    id: "sample-2",
    title: "The Kiss (Gold Leaf Conservator Detail)",
    artist: "Gustav Klimt",
    originalImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/800px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
    canvasImage: "/images/samples/gold-leaf-detail.jpg",
  },
  {
    id: "sample-3",
    title: "Girl with a Pearl Earring (Glaze & Texture)",
    artist: "Johannes Vermeer",
    originalImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg",
    canvasImage: "/images/samples/canvas-impasto-macro.jpg",
  },
];

export function SamplesCompareSection({ samples = STATIC_SAMPLES }: SamplesCompareSectionProps) {
  const effectiveSamples = samples && samples.length > 0 ? samples : STATIC_SAMPLES;
  const [currentIdx, setCurrentIdx] = useState(0);
  const activeSample = effectiveSamples[currentIdx] || effectiveSamples[0];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + effectiveSamples.length) % effectiveSamples.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % effectiveSamples.length);
  };

  if (!activeSample) return null;

  return (
    <section id="samples" className="py-12 sm:py-20 bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="REPRODUCTION SAMPLES"
          title="See a Real Canvas Next to the Original"
          subtitle="Compare museum originals side-by-side with our authentic heavyweight canvas reproductions."
          align="center"
        />

        <div className="relative max-w-4xl mx-auto mt-8 sm:mt-12">
          {/* Side by Side Framed Paintings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* The Original */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border-4 sm:border-6 border-[#d4af37] shadow-xl bg-black group">
                <Image
                  src={activeSample.originalImage}
                  alt={`${activeSample.title} - The Original`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 450px"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase font-sans">
                  MUSEUM SCAN ORIGINAL
                </span>
              </div>
              <span className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider font-sans">
                The Historical Masterpiece
              </span>
            </div>

            {/* Our Canvas Texture Macro */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border-4 sm:border-6 border-[#d4af37] shadow-xl bg-black group">
                <Image
                  src={activeSample.canvasImage}
                  alt={`${activeSample.title} - Macro Canvas Texture`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 450px"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#ceab51] text-black text-[10px] font-bold tracking-widest uppercase font-sans shadow-md flex items-center gap-1.5">
                  <ZoomIn className="w-3 h-3" />
                  OUR ARCHIVAL CANVAS TEXTURE
                </span>
              </div>
              <span className="text-xs font-semibold text-[#ceab51] uppercase tracking-wider font-sans">
                Authentic 3D Impasto & Woven Texture
              </span>
            </div>
          </div>

          {/* Sample Title / Artist / Navigation */}
          <div className="text-center mt-8">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-ink)]">
              {activeSample.title}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans mt-0.5">
              By {activeSample.artist}
            </p>

            {/* Nav Arrows */}
            <div className="flex items-center justify-center gap-4 mt-5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous sample"
                className="w-10 h-10 rounded-full border border-[#ece7df] hover:border-[var(--color-ink)] bg-white text-[var(--color-ink)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-sans text-[var(--color-muted)] font-semibold">
                {currentIdx + 1} / {effectiveSamples.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next sample"
                className="w-10 h-10 rounded-full border border-[#ece7df] hover:border-[var(--color-ink)] bg-white text-[var(--color-ink)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
