"use client";

import { getPaintingUrl } from "@/lib/utils/paintingUrl";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useCurrencyStore } from "@/lib/store/currency";
import { formatPrice } from "@/lib/utils";
import type { Painting, FrameOption, SizeOption, FrameOrientation } from "@/types";
import { getVariantInfo, getSizesForPainting } from "@/lib/sizes";

interface InlineBuyCardProps {
  painting: Painting;
}

export function InlineBuyCard({ painting }: InlineBuyCardProps) {
  const orientation: FrameOrientation = painting.orientation || "horizontal";
  const variant = getVariantInfo(orientation);

  const availableSizes: SizeOption[] =
    painting.sizes && painting.sizes.length === 3
      ? painting.sizes
      : getSizesForPainting(orientation, painting.priceFrom);

  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(
    painting.frames[0] || { id: "gold", name: "Gold", swatch: "#d4af37" }
  );
  const [selectedSize, setSelectedSize] = useState<SizeOption>(availableSizes[0]);

  const { addItem } = useCartStore();
  const { currency, convert } = useCurrencyStore();
  const [added, setAdded] = useState(false);

  const discountPercent =
    typeof painting.discountPercent === "number"
      ? painting.discountPercent
      : painting.priceWas && painting.priceFrom && painting.priceWas > painting.priceFrom
      ? Math.round(((painting.priceWas - painting.priceFrom) / painting.priceWas) * 100)
      : 0;

  const priceUSD = selectedSize.price;
  const converted = convert(priceUSD, painting.currency || "BDT");
  const wasConverted =
    discountPercent > 0 && discountPercent < 100
      ? convert(Math.round(priceUSD / (1 - discountPercent / 100)), painting.currency || "BDT")
      : painting.priceWas && painting.priceFrom && painting.priceWas > painting.priceFrom
      ? convert(Math.round(priceUSD * (painting.priceWas / painting.priceFrom)), painting.currency || "BDT")
      : null;

  const handleOwn = () => {
    addItem(painting, selectedFrame, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-[var(--color-ink-soft)] text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-white/10 space-y-4 sm:space-y-5">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="relative w-18 h-22 sm:w-20 sm:h-24 rounded-lg overflow-hidden border border-white/20 bg-black flex-shrink-0">
          <Image
            src={painting.image}
            alt={painting.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ceab51] block font-sans">
              OWN IT.
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/10 text-white/80 font-mono">
              {variant.aspectRatio}
            </span>
          </div>
          <h4 className="font-serif text-base sm:text-lg font-semibold text-white leading-tight mt-0.5 line-clamp-1">
            {painting.title}
          </h4>
          <p className="text-xs text-white/60 mt-0.5 font-sans truncate">
            {variant.name} ({variant.subtitle})
          </p>
        </div>
      </div>

      {/* Price row */}
      <div className="flex items-baseline gap-2.5 sm:gap-3 pt-1">
        <span className="text-xl sm:text-2xl font-bold font-sans text-white">
          {formatPrice(converted, currency)}
        </span>
        {wasConverted && wasConverted > converted && (
          <span className="text-xs sm:text-sm line-through text-white/40">
            {formatPrice(wasConverted, currency)}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ceab51]/20 text-[#ceab51]">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* 3 Size Selector Pills */}
      <div className="space-y-1.5 font-sans">
        <div className="flex items-center justify-between text-[11px] text-white/80">
          <span className="font-bold uppercase tracking-wider text-[10px]">
            Canvas Size:
          </span>
          <span className="text-[#ceab51] font-medium text-[11px]">
            {selectedSize.label}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map((sz) => {
            const isSelected = selectedSize.id === sz.id;
            const feetText = sz.feetLabel || sz.hatLabel || (sz.label.includes("(") ? sz.label.split("(")[0].trim() : sz.label);
            const dimText = sz.dimensions || (sz.label.includes("(") ? sz.label.split("(")[1]?.replace(")", "") : sz.label);

            return (
              <button
                key={sz.id}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#ceab51] bg-[#ceab51]/20 text-white ring-1 ring-[#ceab51]"
                    : "border-white/15 hover:border-white/40 bg-white/5 text-white/70"
                }`}
              >
                <div className="text-[11px] font-bold">
                  {feetText}
                </div>
                <div className="text-[10px] font-mono opacity-70">
                  {dimText}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame swatches */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
          Frame: {selectedFrame.name}
        </span>
        <div className="flex items-center gap-2">
          {painting.frames.map((frame) => {
            const isSelected = selectedFrame.id === frame.id;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => setSelectedFrame(frame)}
                className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                  isSelected ? "border-[#ceab51] scale-110 shadow-md" : "border-white/30"
                }`}
                style={{ backgroundColor: frame.swatch }}
                title={frame.name}
              />
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={handleOwn}
        className="w-full py-3 sm:py-3.5 rounded-full bg-[var(--color-gold)] hover:bg-[#b8953c] text-[var(--color-ink)] font-bold text-xs tracking-wider uppercase transition-colors shadow-md cursor-pointer"
      >
        {added ? "✓ ADDED TO SHOPPING BAG" : "Own this masterpiece"}
      </button>

      {/* <div className="text-center">
        <Link
          href={getPaintingUrl(painting)}
          className="text-xs text-[#ceab51] hover:underline font-medium"
        >
          See full painting details & frame picker →
        </Link>
      </div> */}

      {/* Benefits */}
      {/* <div className="pt-3 border-t border-white/10 space-y-2 text-[11px] text-white/70 font-sans">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ceab51]" />
          <span>Painted by hand in oil on linen canvas</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-[#ceab51]" />
          <span>Free shipping worldwide, fully insured</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5 text-[#ceab51]" />
          <span>90-day money-back guarantee</span>
        </div>
      </div> */}
    </div>
  );
}