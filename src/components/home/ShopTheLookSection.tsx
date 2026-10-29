"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { getPaintingUrl } from "@/lib/utils/paintingUrl";
import { useCurrencyStore } from "@/lib/store/currency";
import { Eyebrow } from "@/components/ui/Eyebrow";
import defaultPaintings from "@/mocks/paintings.json";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  Shuffle,
  Check,
} from "lucide-react";
import type { Painting } from "@/types";

interface RoomConfig {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  image: string;
  nativeFrameId: string;
  frameBox: {
    left: number; // percentage
    top: number; // percentage
    width: number; // percentage
    height: number; // percentage
  };
  clipPath?: string;
}

const ROOM_CONFIGS: RoomConfig[] = [
  {
    id: "room-1",
    title: "Modern Minimalist Salon",
    shortTitle: "Modern Salon",
    subtitle: "Neutral limestone wall with soft daylight",
    image: "/images/rooms/modern-minimalist-salon.jpg",
    nativeFrameId: "black",
    frameBox: {
      left: 40.70,
      top: 14.58,
      width: 18.31,
      height: 35.55,
    },
  },
  {
    id: "room-2",
    title: "Classical Parisian Living Room",
    shortTitle: "Parisian Living",
    subtitle: "Ornate moulding above marble fireplace",
    image: "/images/rooms/parisian-luxury-living.jpg",
    nativeFrameId: "gold",
    frameBox: {
      left: 65.55,
      top: 28.26,
      width: 9.81,
      height: 23.05,
    },
    clipPath: "polygon(0% 10.7%, 100% 0%, 100% 100%, 0% 100%)",
  },
  {
    id: "room-3",
    title: "Scandinavian Contemporary Study",
    shortTitle: "Scandi Study",
    subtitle: "Warm white oak shelving & reading lounge",
    image: "/images/rooms/scandinavian-study.jpg",
    nativeFrameId: "oak",
    frameBox: {
      left: 34.38,
      top: 29.30,
      width: 8.07,
      height: 18.88,
    },
  },
];

interface FrameStyle {
  id: string;
  name: string;
  shortName: string;
  swatch: string;
  borderColor: string;
}

const FRAME_FINISHES: FrameStyle[] = [
  {
    id: "gold",
    name: "Solid Antique Gold",
    shortName: "Gold",
    swatch: "#d4af37",
    borderColor: "#c99a2c",
  },
  // {
  //   id: "black",
  //   name: "Modern Matte Black",
  //   shortName: "Black",
  //   swatch: "#1f1f1f",
  //   borderColor: "#181818",
  // },
  // {
  //   id: "oak",
  //   name: "Natural Gallery Oak",
  //   shortName: "Oak",
  //   swatch: "#c8a47e",
  //   borderColor: "#b68f65",
  // },
  {
    id: "white",
    name: "Silver White Mat",
    shortName: "White",
    swatch: "#f3f3f3",
    borderColor: "#e5e1da",
  },
  {
    id: "silver",
    name: "Classic Silver",
    shortName: "Silver",
    swatch: "#a8a8a8",
    borderColor: "#8f9499",
  },
  // {
  //   id: "frameless",
  //   name: "Gallery Wrap (Frameless)",
  //   shortName: "Wrap",
  //   swatch: "#e8dfd1",
  //   borderColor: "transparent",
  // },
];

interface ShopTheLookSectionProps {
  paintings?: Painting[];
}

export function ShopTheLookSection({ paintings = [] }: ShopTheLookSectionProps) {
  const { currency, convert } = useCurrencyStore();
  const allPaintings = (paintings && paintings.length > 0 ? paintings : (defaultPaintings as unknown as Painting[]));

  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const currentRoom = ROOM_CONFIGS[activeRoomIdx] || ROOM_CONFIGS[0];

  // Currently selected painting on the wall
  const [selectedPaintingSlug, setSelectedPaintingSlug] = useState<string>(
    allPaintings[0]?.slug || "the-starry-night"
  );

  // Selected frame style (defaults to current room's native finish)
  const [activeFrameId, setActiveFrameId] = useState<string>(currentRoom.nativeFrameId || "black");
  const activeFrame = FRAME_FINISHES.find((f) => f.id === activeFrameId) || FRAME_FINISHES[0];

  // Active painting object
  const activePainting =
    allPaintings.find((p) => p.slug === selectedPaintingSlug) || allPaintings[0];

  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const switchRoom = (idx: number) => {
    setActiveRoomIdx(idx);
    const room = ROOM_CONFIGS[idx];
    if (room?.nativeFrameId) {
      setActiveFrameId(room.nativeFrameId);
    }
  };

  const handlePrevRoom = () => {
    const nextIdx = (activeRoomIdx - 1 + ROOM_CONFIGS.length) % ROOM_CONFIGS.length;
    switchRoom(nextIdx);
  };

  const handleNextRoom = () => {
    const nextIdx = (activeRoomIdx + 1) % ROOM_CONFIGS.length;
    switchRoom(nextIdx);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNextRoom();
      } else {
        handlePrevRoom();
      }
    }
    touchStartXRef.current = null;
  };

  const handleSurpriseMe = () => {
    const remaining = allPaintings.filter((p) => p.slug !== selectedPaintingSlug);
    if (remaining.length > 0) {
      const randomIndex = Math.floor(Math.random() * remaining.length);
      setSelectedPaintingSlug(remaining[randomIndex].slug);
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const offset = direction === "left" ? -240 : 240;
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if (!activePainting) return null;

  const isCustomFrameFinish =
    activeFrame.id !== currentRoom.nativeFrameId && activeFrame.id !== "frameless";

  return (
    <section className="py-8 sm:py-16 lg:py-20 bg-[var(--color-bg)] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-8">
          <Eyebrow className="mb-1.5 sm:mb-2 text-[10px] sm:text-xs">ROOM ART VISUALISER</Eyebrow>
          <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-semibold text-[var(--color-ink)]">
            Visualise Any Art in Your Room
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1.5 sm:mt-2 font-sans px-2">
            Select any museum masterpiece or switch frame finishes to see how it transforms your wall.
          </p>

          {/* Room Selection Tabs (Horizontal Scrollable on Mobile) */}
          {/* <div className="mt-4 sm:mt-5 flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 font-sans overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {ROOM_CONFIGS.map((room, idx) => (
              <button
                key={room.id}
                type="button"
                onClick={() => switchRoom(idx)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap flex-shrink-0 ${
                  activeRoomIdx === idx
                    ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)] shadow-xs"
                    : "bg-white hover:bg-[#faf7f2] text-[var(--color-muted)] hover:text-[var(--color-ink)] border-[#e8dfd1]"
                }`}
              >
                <span className="sm:hidden">{room.shortTitle}</span>
                <span className="hidden sm:inline">{room.title}</span>
              </button>
            ))}
          </div> */}
        </div>

        {/* Room Stage & Frame Canvas */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-[16/9] max-w-5xl mx-auto rounded-xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-[#e5dfd5] bg-[#1a1715] select-none group"
        >
          {/* Base Room Background Image */}
          <Image
            src={currentRoom.image}
            alt={currentRoom.title}
            fill
            priority
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 1280px) 100vw, 1100px"
          />

          {/* DYNAMIC WALL ART FRAME - PRECISE PIXEL ALIGNMENT */}
          <div
            style={{
              left: `${currentRoom.frameBox.left}%`,
              top: `${currentRoom.frameBox.top}%`,
              width: `${currentRoom.frameBox.width}%`,
              height: `${currentRoom.frameBox.height}%`,
              clipPath: currentRoom.clipPath || "none",
            }}
            className="absolute z-10 overflow-hidden transition-all duration-300 group/frame cursor-pointer"
            onClick={handleSurpriseMe}
            title="Click or tap to preview another artwork"
          >
            {/* The Selected Artwork Inside Frame */}
            <Image
              src={activePainting.image}
              alt={`${activePainting.title} displayed in ${currentRoom.title}`}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover/frame:scale-105"
              sizes="(max-width: 1024px) 25vw, 300px"
            />

            {/* Optional Custom Frame Finish Liner (when user changes finish) */}
            {isCustomFrameFinish && (
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  border: `3px solid ${activeFrame.borderColor}`,
                  boxShadow: "inset 0 0 6px rgba(0,0,0,0.6)",
                }}
              />
            )}

            {/* Realistic Inset Canvas Depth Shading */}
            <div className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(0,0,0,0.45)] pointer-events-none" />

            {/* Soft varnish lighting sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/10 pointer-events-none mix-blend-overlay" />

            {/* Hover Action Badge on Frame (Desktop only) */}
            <div className="hidden sm:flex absolute inset-0 bg-black/0 group-hover/frame:bg-black/35 transition-colors items-center justify-center opacity-0 group-hover/frame:opacity-100 pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-black/85 text-white text-[9px] font-sans font-bold tracking-wider uppercase backdrop-blur-xs flex items-center gap-1.5 border border-white/30 shadow-lg">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                CLICK TO SHUFFLE
              </span>
            </div>
          </div>

          {/* Top-Left: Active Room Badge */}
          {/* <div className="absolute top-2.5 left-2.5 sm:top-5 sm:left-5 z-20 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[9px] sm:text-xs font-semibold tracking-wider font-sans border border-white/20">
              <span className="sm:hidden">{currentRoom.shortTitle}</span>
              <span className="hidden sm:inline">{currentRoom.title}</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#d4af37] text-xs font-semibold tracking-wider font-sans border border-[#d4af37]/40">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/40"
                style={{ backgroundColor: activeFrame.swatch }}
              />
              {activeFrame.name}
            </span>
          </div> */}

          {/* Top-Right: Frame Finishes Selector Tool (Desktop view inside stage) */}
          {/* <div className="hidden sm:flex absolute top-5 right-5 z-20 bg-black/75 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20 items-center gap-1.5">
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider font-sans mr-1">
              Frame:
            </span>
            {FRAME_FINISHES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFrameId(f.id)}
                title={f.name}
                aria-label={f.name}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                  activeFrameId === f.id
                    ? "scale-115 ring-2 ring-[#d4af37] ring-offset-1 ring-offset-black"
                    : "opacity-80 hover:opacity-100 hover:scale-105"
                }`}
                style={{ backgroundColor: f.swatch }}
              >
                {activeFrameId === f.id && (
                  <Check className={`w-3 h-3 ${f.id === "white" || f.id === "frameless" ? "text-black" : "text-white"}`} />
                )}
              </button>
            ))}
          </div> */}

          {/* Desktop Only: Floating In-Stage Product Card */}
          <div className="hidden sm:block absolute bottom-5 left-5 max-w-md z-20">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex items-center gap-3.5 border border-[#e8dfd1] animate-in fade-in duration-200">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-[#e8dfd1] shadow-2xs">
                <Image
                  src={activePainting.image}
                  alt={activePainting.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-widest text-[#a8844a] font-bold font-sans">
                    ON THE WALL
                  </span>
                  <span className="text-[9px] text-[var(--color-muted)] font-mono">
                    · {activeFrame.name}
                  </span>
                </div>
                <h4 className="font-serif text-sm font-bold text-[var(--color-ink)] truncate">
                  {activePainting.title}
                </h4>
                <p className="text-[11px] text-[var(--color-muted)] truncate font-sans">
                  {activePainting.artistName}
                </p>
                <p className="text-xs font-bold text-[var(--color-ink)] mt-0.5 font-sans">
                  From {formatPrice(convert(activePainting.priceFrom, "BDT"), currency)}
                </p>
              </div>
              <Link
                href={getPaintingUrl(activePainting)}
                className="px-4 py-2.5 rounded-full bg-[var(--color-ink)] hover:bg-[#ceab51] text-white hover:text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 flex-shrink-0 font-sans shadow-xs cursor-pointer"
              >
                <span>SHOP</span>
                <Eye className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Room Nav Arrows */}
          <button
            type="button"
            onClick={handlePrevRoom}
            aria-label="Previous room"
            className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 w-7 h-7 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow-lg z-20 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={handleNextRoom}
            aria-label="Next room"
            className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 w-7 h-7 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow-lg z-20 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          {/* Room Pagination Indicator Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:hidden bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full">
            {ROOM_CONFIGS.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeRoomIdx === idx ? "bg-[#d4af37] w-3" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* MOBILE CONTROLS STRIP (Placed below stage so stage stays completely visible) */}
        <div className="sm:hidden mt-3 space-y-2.5 max-w-5xl mx-auto">
          {/* Mobile Frame Selector Tool */}
          <div className="flex items-center justify-start gap-2">
            {/* <span className="text-[10px] font-bold text-[var(--color-ink)] uppercase tracking-wider font-sans flex items-center gap-1 flex-shrink-0">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/30"
                style={{ backgroundColor: activeFrame.swatch }}
              />
              Frame:
            </span> */}
                {/* {FRAME_FINISHES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFrameId(f.id)}
                title={f.name}
                aria-label={f.name}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                  activeFrameId === f.id
                    ? "scale-115 ring-2 ring-[#d4af37] ring-offset-1 ring-offset-black"
                    : "opacity-80 hover:opacity-100 hover:scale-105"
                }`}
                style={{ backgroundColor: f.swatch }}
              >
                {activeFrameId === f.id && (
                  <Check className={`w-3 h-3 ${f.id === "white" || f.id === "frameless" ? "text-black" : "text-white"}`} />
                )}
              </button>
              ))}  */}
          </div>

          {/* Mobile Dedicated Product Card */}
          <div className="bg-white rounded-xl p-3 flex items-center gap-3">
            <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
              <Image
                src={activePainting.image}
                alt={activePainting.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-widest text-[#a8844a] font-bold font-sans">
                  ON THE WALL
                </span>
                <span className="text-[9px] text-[var(--color-muted)] font-mono">
                  · {activeFrame.shortName}
                </span>
              </div>
              <h4 className="font-serif text-xs font-bold text-[var(--color-ink)] truncate">
                {activePainting.title}
              </h4>
              <p className="text-[10px] text-[var(--color-muted)] truncate font-sans">
                {activePainting.artistName}
              </p>
              <p className="text-xs font-bold text-[var(--color-ink)] mt-0.5 font-sans">
                From {formatPrice(convert(activePainting.priceFrom, "BDT"), currency)}
              </p>
            </div>
            <Link
              href={getPaintingUrl(activePainting)}
              className="px-3 py-2 rounded-full bg-[var(--color-ink)] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 flex-shrink-0 font-sans shadow-xs cursor-pointer active:scale-95 transition-transform"
            >
              <span>SHOP</span>
              <Eye className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* ARTWORK SELECTION STRIP / CAROUSEL */}
        <div className="mt-6 sm:mt-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3 px-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d4af37]" />
              <span className="font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[var(--color-ink)]">
                SELECT ARTWORK:
              </span>
              <span className="text-[10px] sm:text-xs text-[var(--color-muted)] font-sans">
                ({allPaintings.length})
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white hover:bg-[#faf7f2] border border-[#e8dfd1] text-[10px] sm:text-xs font-semibold text-[var(--color-ink)] transition-colors cursor-pointer shadow-2xs font-sans active:scale-95"
              >
                <Shuffle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#a8844a]" />
                <span>Shuffle</span>
              </button>

              <div className="hidden sm:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollCarousel("left")}
                  aria-label="Scroll artworks left"
                  className="w-7 h-7 rounded-full bg-white hover:bg-[#faf7f2] border border-[#e8dfd1] text-[var(--color-ink)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel("right")}
                  aria-label="Scroll artworks right"
                  className="w-7 h-7 rounded-full bg-white hover:bg-[#faf7f2] border border-[#e8dfd1] text-[var(--color-ink)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Artwork Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-1 scroll-smooth no-scrollbar select-none"
            style={{ scrollbarWidth: "none" }}
          >
            {allPaintings.map((painting) => {
              const isSelected = painting.slug === selectedPaintingSlug;
              return (
                <button
                  key={painting.id || painting.slug}
                  type="button"
                  onClick={() => setSelectedPaintingSlug(painting.slug)}
                  className={`flex-shrink-0 flex items-center gap-2.5 p-2 rounded-xl transition-all text-left cursor-pointer border ${
                    isSelected
                      ? "bg-[#fdfaf5] border-[#d4af37] ring-2 ring-[#d4af37]/40 shadow-md scale-102"
                      : "bg-white hover:bg-[#faf7f2] border-[#e8dfd1] hover:border-[#d4af37]/50 shadow-2xs"
                  }`}
                  style={{ width: "190px" }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-11 h-13 sm:w-12 sm:h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-[#e8dfd1]">
                    <Image
                      src={painting.image}
                      alt={painting.title}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#d4af37]/25 flex items-center justify-center">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#d4af37] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h5
                      className={`text-[11px] sm:text-xs font-serif font-bold truncate ${
                        isSelected ? "text-[var(--color-ink)]" : "text-[var(--color-ink)]"
                      }`}
                    >
                      {painting.title}
                    </h5>
                    <p className="text-[9px] sm:text-[10px] text-[var(--color-muted)] truncate font-sans">
                      {painting.artistName}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold text-[var(--color-ink)] mt-0.5 font-sans">
                      From {formatPrice(convert(painting.priceFrom, "BDT"), currency)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
