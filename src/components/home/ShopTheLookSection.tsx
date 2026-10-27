"use client";

import { getPaintingUrl } from "@/lib/utils/paintingUrl";
import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/lib/store/currency";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Room, Painting } from "@/types";

interface ShopTheLookSectionProps {
  rooms: Room[];
  paintings: Painting[];
}

export function ShopTheLookSection({ rooms = [], paintings = [] }: ShopTheLookSectionProps) {
  const { currency, convert } = useCurrencyStore();
  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const currentRoom = rooms[activeRoomIdx] || rooms[0];

  const [activeHotspotId, setActiveHotspotId] = useState<string>(
    currentRoom?.hotspots[0]?.id || ""
  );

  const activeHotspot =
    currentRoom?.hotspots.find((h) => h.id === activeHotspotId) ||
    currentRoom?.hotspots[0];

  const activePainting = paintings.find(
    (p) => p.slug === activeHotspot?.paintingSlug
  ) || paintings[0];

  const handlePrev = () => {
    const nextIdx = (activeRoomIdx - 1 + rooms.length) % rooms.length;
    setActiveRoomIdx(nextIdx);
    setActiveHotspotId(rooms[nextIdx]?.hotspots[0]?.id || "");
  };

  const handleNext = () => {
    const nextIdx = (activeRoomIdx + 1) % rooms.length;
    setActiveRoomIdx(nextIdx);
    setActiveHotspotId(rooms[nextIdx]?.hotspots[0]?.id || "");
  };

  if (!currentRoom) return null;

  return (
    <section className="py-12 sm:py-20 bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <Eyebrow className="mb-2">SHOP THE LOOK</Eyebrow>
          <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-[var(--color-ink)]">
            Visualise It In Your Room
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-2">
            Tap the glowing dots on the gallery walls to explore each framed canvas artwork.
          </p>
        </div>

        {/* Large Bordered Room Card */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-[#e5e0d8] shadow-md sm:shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          {/* Left: Lifestyle Room Photo (Col 8) */}
          <div className="lg:col-span-8 relative min-h-[260px] sm:min-h-[380px] lg:min-h-[520px] bg-black">
            <Image
              src={currentRoom.image}
              alt={currentRoom.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />

            {/* Interactive Hotspots */}
            {currentRoom.hotspots.map((hotspot) => {
              const isActive = activeHotspotId === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => setActiveHotspotId(hotspot.id)}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  aria-label="View painting details"
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer focus:outline-none"
                >
                  <span className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75 ${
                        isActive ? "scale-125" : ""
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white transition-all ${
                        isActive
                          ? "bg-[var(--color-gold)] scale-110 shadow-lg"
                          : "bg-black/70 hover:bg-black"
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Dark Product Mini-Card (Col 4) */}
          <div className="lg:col-span-4 bg-[var(--color-ink-soft)] text-white p-5 sm:p-8 flex flex-col justify-between">
            {activePainting ? (
              <div className="space-y-3 sm:space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ceab51] block font-sans">
                  {activePainting.movement}
                </span>

                <div className="relative w-28 h-20 sm:w-36 sm:h-28 rounded-xl overflow-hidden border border-white/20 bg-black/40">
                  <Image
                    src={activePainting.image}
                    alt={activePainting.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-0.5">
                  <span className="text-xs text-white/60 font-sans">
                    {activePainting.artistName}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal leading-tight text-white">
                    {activePainting.title}
                  </h3>
                </div>

                <div className="pt-1">
                  <span className="text-xs text-white/60">From</span>
                  <div className="text-xl sm:text-2xl font-bold font-sans text-white">
                    {formatPrice(convert(activePainting.priceFrom, activePainting.currency || "BDT"), currency)}
                    {activePainting.priceWas && (
                      <span className="text-sm line-through text-white/40 ml-2 font-normal">
                        {formatPrice(convert(activePainting.priceWas, activePainting.currency || "BDT"), currency)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <Link
                    href={getPaintingUrl(activePainting)}
                    className="w-full py-3 sm:py-3.5 px-6 rounded-full bg-[#f3f1e8] hover:bg-white text-[var(--color-ink)] text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 font-sans"
                  >
                    <span>CHOOSE SIZE & FRAME</span>
                    <span className="text-sm">›</span>
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Pagination Dots + Mobile Arrow Controls */}
            <div className="flex items-center justify-between sm:justify-center gap-3 pt-5 mt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous room"
                className="sm:hidden w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {rooms.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveRoomIdx(idx);
                      setActiveHotspotId(rooms[idx]?.hotspots[0]?.id || "");
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeRoomIdx === idx ? "bg-[#ceab51] w-6" : "bg-white/30 w-2"
                    }`}
                    aria-label={`View room ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next room"
                className="sm:hidden w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Overlapping Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous room"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl text-[var(--color-ink)] items-center justify-center hover:bg-[var(--color-gold)] transition-colors z-20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next room"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl text-[var(--color-ink)] items-center justify-center hover:bg-[var(--color-gold)] transition-colors z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}