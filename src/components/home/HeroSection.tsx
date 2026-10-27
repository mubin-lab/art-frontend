"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/lib/store/currency";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import type { HeroSlide, Review } from "@/types";

interface HeroSectionProps {
  slides: HeroSlide[];
  review?: Review;
  trustBullets?: string[];
}

export function HeroSection({
  slides = [],
  review,
  trustBullets = [
    "Free shipping worldwide",
    "90-day money-back guarantee",
    "Real studio photos before shipping",
  ],
}: HeroSectionProps) {
  const { currency, convert } = useCurrencyStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentSlide] || slides[0];

  return (
    <section className="bg-[var(--color-bg)] pt-6 pb-10 sm:pt-12 sm:pb-16 overflow-hidden">
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (Copy ~36-38%) */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[46px] leading-[1.1] font-normal text-[var(--color-ink)] tracking-tight">
              Museum-Quality Framed Canvas Art
            </h1>

            <p className="text-sm sm:text-lg text-[var(--color-muted)] font-sans">
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

            {/* Trustpilot Quote Card */}
            {review && (
              <div className="bg-[var(--color-card-soft)] border-l-4 border-[#ceab51] p-3.5 sm:p-4 rounded-xl shadow-2xs space-y-1.5 sm:space-y-2">
                <Rating rating={review.rating} />
                <p className="font-serif italic text-xs sm:text-sm text-[var(--color-ink)] leading-snug">
                  "{review.text}"
                </p>
                <div className="text-[11px] sm:text-xs text-[var(--color-muted)] font-sans">
                  <span>{review.author}, on </span>
                  <span className="font-bold underline text-[var(--color-ink)]">
                    Trustpilot
                  </span>
                </div>
              </div>
            )}

            {/* Trust Bullets */}
            {/* <div className="pt-1 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-[13px] text-[var(--color-ink)] font-medium font-sans">
              {trustBullets.map((bullet, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#00b67a]/15 text-[#00b67a] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                  </span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div> */}
          </div>

          {/* Right Column: HeroSlideshow (~62-64%) */}
          <div
            className="lg:col-span-7"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {activeSlide && (
              <div className="relative aspect-[1.15/1] sm:aspect-[1.28/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-black/5 bg-[#1a1715] group select-none">
                {/* Background image */}
                <Image
                  src={activeSlide.image}
                  alt={activeSlide.product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

                {/* Top Segmented Progress Bars */}
                <div className="absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 flex items-center gap-1.5 sm:gap-2 z-20">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className="flex-1 h-[2.5px] sm:h-[3px] bg-white/30 rounded-full overflow-hidden cursor-pointer"
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      <div
                        className={`h-full bg-white transition-all duration-300 ${
                          currentSlide === idx
                            ? "w-full animate-[progress_6s_linear]"
                            : currentSlide > idx
                            ? "w-full"
                            : "w-0"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Top-Left Pill Tag & Underlined Link */}
                <div className="absolute top-8 sm:top-12 left-3 sm:left-6 z-20 space-y-1">
                  <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[11px] font-bold tracking-[0.14em] uppercase">
                    {activeSlide.tag}
                  </span>
                  <div>
                    <Link
                      href={activeSlide.linkHref}
                      className="text-white text-xs sm:text-sm font-semibold underline underline-offset-4 hover:text-[#ceab51] transition-colors inline-block"
                    >
                      {activeSlide.linkLabel}
                    </Link>
                  </div>
                </div>

                {/* Bottom Product Pill */}
                <div className="absolute bottom-3 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-sm z-20">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3.5 border border-white/50">
                    <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
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
                      className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[var(--color-ink)] hover:bg-black text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase transition-colors flex-shrink-0"
                    >
                      Shop
                    </Link>
                  </div>
                </div>

                {/* Bottom-Right "OWN IT." Tag */}
                <div className="absolute bottom-7 right-7 z-20 hidden md:block">
                  <span className="text-white font-bold text-sm tracking-[0.2em] uppercase font-sans drop-shadow-md">
                    OWN IT.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}