"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/lib/store/currency";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import type { HeroSlide, Review } from "@/types";

interface HeroSectionProps {
  slides?: HeroSlide[];
  review?: Review;
  trustBullets?: string[];
}

const STATIC_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    tag: "MUSEUM MASTERPIECE",
    linkLabel: "The Night Watch by Rembrandt →",
    linkHref: "/painting/the-night-watch",
    image: "/images/hero/hero-gallery-1.jpg",
    product: {
      title: "The Night Watch",
      artist: "Rembrandt van Rijn",
      priceFrom: 38280,
      priceWas: 76560,
      thumb: "/images/hero/hero-gallery-1.jpg",
      href: "/painting/the-night-watch",
    },
  },
  {
    id: "slide-2",
    tag: "CURATOR'S CHOICE",
    linkLabel: "Classical European Grand Salon →",
    linkHref: "/collections/top-100",
    image: "/images/hero/hero-gallery-2.jpg",
    product: {
      title: "Grand Classical Salon",
      artist: "Atelier Masterpiece",
      priceFrom: 42500,
      priceWas: 85000,
      thumb: "/images/hero/hero-gallery-2.jpg",
      href: "/collections/top-100",
    },
  },
  {
    id: "slide-3",
    tag: "GOLDEN SECESSION",
    linkLabel: "The Kiss by Gustav Klimt →",
    linkHref: "/painting/the-kiss",
    image: "/images/hero/hero-gallery-3.jpg",
    product: {
      title: "The Kiss",
      artist: "Gustav Klimt",
      priceFrom: 41880,
      priceWas: 83760,
      thumb: "/images/hero/hero-gallery-3.jpg",
      href: "/painting/the-kiss",
    },
  },
  {
    id: "slide-4",
    tag: "IMPRESSIONIST TRANQUILITY",
    linkLabel: "Water Lilies by Claude Monet →",
    linkHref: "/painting/water-lilies",
    image: "/images/hero/hero-gallery-4.jpg",
    product: {
      title: "Water Lilies",
      artist: "Claude Monet",
      priceFrom: 34680,
      priceWas: 69360,
      thumb: "/images/hero/hero-gallery-4.jpg",
      href: "/painting/water-lilies",
    },
  },
];

// Story slide duration in milliseconds (2 seconds)
const STORY_DURATION = 2000;

export function HeroSection({
  slides = STATIC_HERO_SLIDES,
  review,
  trustBullets = [
    "Nationwide safe delivery in Bangladesh",
    "90-day money-back guarantee",
    "Handcrafted solid wood frames",
  ],
}: HeroSectionProps) {
  const { currency, convert } = useCurrencyStore();
  const effectiveSlides = slides && slides.length > 0 ? slides : STATIC_HERO_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % effectiveSlides.length);
    setAnimKey((k) => k + 1);
  }, [effectiveSlides.length]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + effectiveSlides.length) % effectiveSlides.length);
    setAnimKey((k) => k + 1);
  }, [effectiveSlides.length]);

  const handleSelectSlide = useCallback((idx: number) => {
    setCurrentSlide(idx);
    setAnimKey((k) => k + 1);
  }, []);

  const activeSlide = effectiveSlides[currentSlide] || effectiveSlides[0];

  return (
    <section className="bg-[var(--color-bg)] pt-6 pb-10 sm:pt-12 sm:pb-16 overflow-hidden">
      {/* Keyframe animation for smooth story progress */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes storyProgress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `
      }} />

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (Copy ~36-38%) */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[46px] leading-[1.1] font-normal text-[var(--color-ink)] tracking-tight">
              Museum-Quality Framed Canvas Art
            </h1>

            <p className="text-sm sm:text-base italic text-[var(--color-muted)] font-sans">
              World-famous{" "}
              <span className="text-[var(--color-ink)] font-semibold underline decoration-[#ceab51] underline-offset-4">
                masterpieces
              </span>
              , expertly framed on{" "}
              <span className="text-[var(--color-ink)] font-semibold underline decoration-[#ceab51] underline-offset-4">
                premium canvas
              </span>{" "}
              in your size.
            </p>

            {/* CTAs */}
            <div className="space-y-2.5 sm:space-y-3 pt-1">
              <Button
                href="/shop"
                variant="primary"
                size="lg"
                className="w-full text-xs sm:text-sm font-semibold tracking-wider uppercase font-sans py-3.5 sm:py-4"
              >
                Shop paintings
              </Button>

              <Button
                href="/photo-to-painting"
                variant="outline"
                size="lg"
                className="w-full text-xs sm:text-sm font-semibold tracking-wider font-sans py-3.5 sm:py-4"
              >
                Turn your photo into a painting
              </Button>
            </div>

            {/* Trust Bullets */}
            <div className="pt-1 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-[13px] text-[var(--color-ink)] font-medium font-sans">
              {trustBullets.map((bullet, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#00b67a]/15 text-[#00b67a] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                  </span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Instagram/Story Slideshow (~62-64%) */}
          <div className="lg:col-span-7">
            {activeSlide && (
              <div
                onClick={handleNextSlide}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                title="Click anywhere to see next story"
                className="relative aspect-[1.15/1] sm:aspect-[1.28/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-black/5 bg-[#1a1715] group select-none cursor-pointer"
              >
                {/* Background images with crossfade */}
                {effectiveSlides.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.product?.title || slide.tag || "Hero banner"}
                      fill
                      priority={idx <= 1}
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                ))}

                {/* Dark Gradient Overlay for optimal contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/50 pointer-events-none z-15" />

                {/* Top Segmented Story Progress Bars */}
                <div
                  className="absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 flex items-center gap-1.5 sm:gap-2 z-25 drop-shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {effectiveSlides.map((_, idx) => {
                    const isCompleted = idx < currentSlide;
                    const isActive = idx === currentSlide;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSlide(idx);
                        }}
                        className="flex-1 h-[2.5px] sm:h-[3.5px] bg-white/30 hover:bg-white/50 rounded-full overflow-hidden cursor-pointer transition-colors relative"
                        aria-label={`Jump to story ${idx + 1}`}
                      >
                        {isCompleted && (
                          <div className="w-full h-full bg-white rounded-full" />
                        )}
                        {isActive && (
                          <div
                            key={`story-bar-${currentSlide}-${animKey}`}
                            className="h-full bg-white rounded-full origin-left"
                            style={{
                              animation: `storyProgress ${STORY_DURATION}ms linear forwards`,
                              animationPlayState: isPaused ? "paused" : "running",
                            }}
                            onAnimationEnd={handleNextSlide}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Subtle Left / Right Navigation Chevrons on Desktop Hover */}
                {/* <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevSlide();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-25 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-90 transition-opacity backdrop-blur-xs cursor-pointer"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextSlide();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-25 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-90 transition-opacity backdrop-blur-xs cursor-pointer"
                  aria-label="Next story"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button> */}

                {/* Bottom Product Pill */}
                {activeSlide.product && (
                  <div
                    className="absolute bottom-3 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-sm z-30 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3.5 border border-white/50 transition-all duration-300">
                      <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        <Image
                          src={activeSlide.product.thumb}
                          alt={activeSlide.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 pr-1 flex-1">
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-[var(--color-ink)] truncate">
                          {activeSlide.product.title}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-[var(--color-muted)] truncate font-sans">
                          From{" "}
                          <span className="font-bold text-[var(--color-ink)]">
                            {formatPrice(convert(activeSlide.product.priceFrom, "BDT"), currency)}
                          </span>{" "}
                          <span className="line-through">
                            {formatPrice(convert(activeSlide.product.priceWas, "BDT"), currency)}
                          </span>{" "}
                          · {activeSlide.product.artist}
                        </p>
                      </div>
                      <Link
                        href={activeSlide.product.href}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[var(--color-ink)] hover:bg-[#ceab51] text-white hover:text-black text-[9px] sm:text-[10px] font-bold tracking-wider uppercase transition-colors flex-shrink-0 font-sans shadow-xs cursor-pointer"
                      >
                        Shop
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
