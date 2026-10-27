"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ZoomIn, ZoomOut, X, Maximize2 } from "lucide-react";
import type { Painting, FrameOption, SizeOption, FrameOrientation } from "@/types";
import { SizeFramePicker } from "./SizeFramePicker";
import { WishlistButton } from "./WishlistButton";
import { getSizesForPainting } from "@/lib/sizes";
import { getPaintingStoryUrl } from "@/lib/utils/paintingUrl";

interface PaintingDetailViewProps {
  painting: Painting;
  children?: React.ReactNode;
}

export function PaintingDetailView({ painting, children }: PaintingDetailViewProps) {
  const orientation: FrameOrientation = painting.orientation || "horizontal";
  const availableSizes: SizeOption[] =
    painting.sizes && painting.sizes.length === 3
      ? painting.sizes
      : getSizesForPainting(orientation, painting.priceFrom);

  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(
    painting.frames[0] || { id: "gold", name: "Gold", swatch: "#d4af37" }
  );
  const [selectedSize, setSelectedSize] = useState<SizeOption>(availableSizes[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [modalImage, setModalImage] = useState<string>(painting.image);

  // Close modal on Escape key & lock body scroll
  useEffect(() => {
    if (!isModalOpen) {
      setIsZoomed(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  // Clean, realistic frame styles with zero bleeding shadows
  const getFrameStyles = (frame: FrameOption) => {
    const id = frame.id.toLowerCase();
    if (id.includes("gold")) {
      return {
        frameGradient:
          "linear-gradient(135deg, #f3d47d 0%, #caa142 30%, #a87e1a 55%, #dfbe64 80%, #996e12 100%)",
        frameBorderColor: "#caa142",
        matColor: "#faf8f4",
        name: frame.name || "Gold",
      };
    }
    if (id.includes("white")) {
      return {
        frameGradient:
          "linear-gradient(135deg, #ffffff 0%, #f7f6f2 35%, #e9e6dd 70%, #ded9cd 100%)",
        frameBorderColor: "#d9d5cb",
        matColor: "#ffffff",
        name: frame.name || "Silver White",
      };
    }
    if (id.includes("silver")) {
      return {
        frameGradient:
          "linear-gradient(135deg, #ececee 0%, #c8c9cd 30%, #a1a3a8 60%, #e2e3e6 80%, #888b90 100%)",
        frameBorderColor: "#a1a3a8",
        matColor: "#faf9f7",
        name: frame.name || "Silver",
      };
    }
    // Dynamic fallback for any custom frame from admin panel
    return {
      frameGradient: `linear-gradient(135deg, ${frame.swatch} 0%, rgba(0,0,0,0.15) 100%)`,
      frameBorderColor: "#333333",
      matColor: "#faf9f7",
      name: frame.name,
    };
  };

  const currentFrameStyle = getFrameStyles(selectedFrame);

  // Dynamic responsive canvas aspect ratio based on orientation
  const getCanvasAspectClass = () => {
    switch (orientation) {
      case "vertical":
        return "aspect-[2/3] w-[200px] xs:w-[230px] sm:w-[280px] md:w-[320px]";
      case "square":
        return "aspect-[1/1] w-[220px] xs:w-[260px] sm:w-[320px] md:w-[360px]";
      case "horizontal":
      default:
        return "aspect-[3/2] w-[260px] xs:w-[300px] sm:w-[380px] md:w-[440px]";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
      {/* Left Column: Clean Live Frame Visualizer (Col 7) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Artwork Stage - Clean, Zero-Bleed, Dark Gallery Tone (#141211) */}
        <div className="relative rounded-3xl border border-[#2e2a27] bg-[#141211] p-4 sm:p-7 flex flex-col justify-between select-none overflow-hidden min-h-[380px] sm:min-h-[460px]">
          {/* Top Stage Bar: Live Preview Indicator & Wishlist */}
          <div className="relative z-10 flex items-center justify-end mb-3 sm:mb-5">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-[11px] font-sans font-medium">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/40 flex-shrink-0"
                style={{ backgroundColor: selectedFrame.swatch }}
              />
              <span>Live Preview: <strong className="text-white">{selectedFrame.name} Frame</strong></span>
            </div> */}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setModalImage(painting.image); setIsModalOpen(true); }}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Inspect artwork"
                title="Click to view full image & zoom"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <WishlistButton painting={painting} className="w-9 h-9 shadow-xs bg-white/90 hover:bg-white" />
            </div>
          </div>

          {/* Center Stage: Framed Artwork with Real-time Frame Border (Zero heavy shadows) */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-2 sm:my-4">
            <div
              onClick={() => { setModalImage(painting.image); setIsModalOpen(true); }}
              className="relative p-[8px] sm:p-[14px] rounded-xs transition-all duration-300 ease-out flex items-center justify-center cursor-zoom-in group shadow-md hover:shadow-lg border"
              style={{
                background: currentFrameStyle.frameGradient,
                borderColor: currentFrameStyle.frameBorderColor,
              }}
              title="Click to view full image & zoom"
            >
              {/* Inner Museum Mat Board (Passe-partout) */}
              <div
                className="relative p-[5px] sm:p-[8px] rounded-2xs transition-colors duration-300 border border-black/10"
                style={{
                  backgroundColor: currentFrameStyle.matColor,
                }}
              >
                {/* Canvas Painting Image Container */}
                <div
                  className={`relative overflow-hidden transition-all duration-300 max-w-full ${getCanvasAspectClass()} shadow-inner`}
                >
                  <Image
                    src={modalImage || painting.image}
                    alt={painting.title}
                    fill
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 55vw, 40vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />

                  {/* Hover Inspect Pill */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-sans font-medium flex items-center gap-1.5 shadow-sm">
                      <ZoomIn className="w-3.5 h-3.5 text-[#ceab51]" />
                      <span>Click to Zoom</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stage Bar: Clean Frame Swatch Switcher */}
          <div className="relative z-10 flex items-center justify-center sm:justify-start gap-2 pt-3 mt-3 border-t border-white/10">
            <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold font-sans">
              Frame:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {painting.frames.map((frame) => {
                const isCurrent = selectedFrame.id === frame.id;
                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => setSelectedFrame(frame)}
                    className={`px-3 py-1 rounded-full text-xs font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-white text-black font-semibold shadow-md ring-1 ring-white"
                        : "bg-black/50 text-white/80 hover:bg-black/80 hover:text-white border border-white/20"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20 flex-shrink-0"
                      style={{ backgroundColor: frame.swatch }}
                    />
                    <span>{frame.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Micro Museum Caption & Story Link */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-muted)] font-serif italic">
          <span>Original: {painting.year} · {painting.medium} · {painting.location}</span>
          <Link
            href={getPaintingStoryUrl(painting)}
            className="font-sans text-[11px] text-[#a8844a] hover:text-[#c49b5c] not-italic font-medium hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Read Artwork Story & Blog</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Studio Close-ups & Linen Texture Strip (descriptionImage) */}
        {/* {painting.descriptionImage && painting.descriptionImage.length > 0 && (
          <div className="p-3.5 rounded-xl bg-white border border-[#e8dfd1] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a8844a] font-sans">
                Studio Close-ups & Textures ({painting.descriptionImage.length})
              </span>
              <span className="text-[10px] text-[var(--color-muted)] font-sans">
                Click to inspect brushwork
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setModalImage(painting.image);
                  setIsModalOpen(true);
                }}
                className="group relative aspect-4/3 rounded-lg overflow-hidden bg-neutral-100 border border-[#d9d0c1] hover:border-[#a8844a] transition-all cursor-pointer shadow-2xs"
                title="Full Artwork"
              >
                <Image
                  src={painting.image}
                  alt={painting.title}
                  fill
                  sizes="120px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded text-[8px] font-sans font-bold bg-black/75 text-white">
                  Main
                </span>
              </button>
              {painting.descriptionImage.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setModalImage(imgUrl);
                    setIsModalOpen(true);
                  }}
                  className="group relative aspect-4/3 rounded-lg overflow-hidden bg-neutral-100 border border-[#d9d0c1] hover:border-[#a8844a] transition-all cursor-pointer shadow-2xs"
                  title={`Detail ${idx + 1}`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${painting.title} detail ${idx + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )} */}

      </div>

      {/* Right Column: Title, Metadata & SizeFramePicker (Col 5) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-2">
          {/* <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#a8844a] font-sans block">
            {painting.movement}
          </span> */}
          <h1 className="font-serif text-2xl sm:text-4xl font-medium text-[var(--color-ink)] leading-tight">
            {painting.title}
          </h1>
          <p className="text-sm text-[var(--color-muted)] font-serif italic">
            By{" "}
            <Link
              href={`/artists/${painting.artistSlug}`}
              className="text-[var(--color-ink)] font-semibold hover:text-[#a8844a] transition-colors underline underline-offset-4 decoration-[#d9d5cc]"
            >
              {painting.artistName}
            </Link>
          </p>
        </div>

        {/* Controlled SizeFramePicker with Live Preview Binding */}
        <SizeFramePicker
          painting={painting}
          selectedFrame={selectedFrame}
          onSelectFrame={setSelectedFrame}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
        />

        {/* Accordions & Extra Details */}
        {children && <div className="pt-2">{children}</div>}
      </div>

      {/* Museum High-Resolution Lightbox & Controlled Zoom Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 z-10">
            <div className="min-w-0 pr-4">
              <h3 className="text-sm sm:text-base font-serif text-white font-medium truncate">
                {painting.title}
              </h3>
              <p className="text-[11px] text-gray-400 font-sans truncate">
                {painting.artistName} · Frame: {selectedFrame.name}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Controlled 1.75x Zoom Toggle */}
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isZoomed
                    ? "bg-[#ceab51] text-black font-semibold shadow-md"
                    : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                }`}
              >
                {isZoomed ? (
                  <>
                    <ZoomOut className="w-3.5 h-3.5" />
                    <span>Zoom Out (1x)</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom In (1.75x)</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Center Image Stage */}
          <div
            className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <div
              onClick={() => setIsZoomed(!isZoomed)}
              className={`relative transition-all duration-300 ease-out cursor-pointer p-3 sm:p-5 rounded-xs ${
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              style={{
                background: currentFrameStyle.frameGradient,
                transform: isZoomed ? "scale(1.75)" : "scale(1)",
                transformOrigin: "center center",
              }}
            >
              {/* Inner Mat */}
              <div
                className="relative p-2 sm:p-3 rounded-2xs"
                style={{
                  backgroundColor: currentFrameStyle.matColor,
                }}
              >
                {/* Artwork */}
                <div
                  className={`relative ${
                    orientation === "horizontal"
                      ? "w-[280px] h-[187px] sm:w-[540px] sm:h-[360px] md:w-[680px] md:h-[453px]"
                      : orientation === "vertical"
                      ? "w-[187px] h-[280px] sm:w-[360px] sm:h-[540px] md:w-[453px] md:h-[680px]"
                      : "w-[240px] h-[240px] sm:w-[440px] sm:h-[440px] md:w-[520px] md:h-[520px]"
                  } max-w-[85vw] max-h-[70vh]`}
                >
                  <Image
                    src={modalImage || painting.image}
                    alt={painting.title}
                    fill
                    sizes="(max-width: 1024px) 90vw, 70vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="text-center pt-2 border-t border-white/10 z-10 text-[11px] text-gray-400 font-sans">
            Click image or use the button to toggle 1.75x detail zoom · Press <kbd className="px-1.5 py-0.5 rounded-sm bg-white/10 text-white font-mono text-[10px]">Esc</kbd> to exit
          </div>
        </div>
      )}
    </div>
  );
}