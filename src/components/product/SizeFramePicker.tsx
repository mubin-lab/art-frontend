"use client";

import React, { useState } from "react";
import { Check, ShoppingBag, ShieldCheck, Truck, RotateCcw, Ruler, X } from "lucide-react";
import type { Painting, FrameOption, SizeOption, FrameOrientation } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/lib/store/currency";
import { useCartStore } from "@/lib/store/cart";
import { getVariantInfo, getSizesForPainting } from "@/lib/sizes";

export interface SizeFramePickerProps {
  painting: Painting;
  selectedFrame?: FrameOption;
  onSelectFrame?: (frame: FrameOption) => void;
  selectedSize?: SizeOption;
  onSelectSize?: (size: SizeOption) => void;
}

export function SizeFramePicker({
  painting,
  selectedFrame: selectedFrameProp,
  onSelectFrame: onSelectFrameProp,
  selectedSize: selectedSizeProp,
  onSelectSize: onSelectSizeProp,
}: SizeFramePickerProps) {
  const orientation: FrameOrientation = painting.orientation || "horizontal";
  const variant = getVariantInfo(orientation);

  // Fallback to orientation-based 3 sizes if painting.sizes is missing or empty
  const availableSizes: SizeOption[] =
    painting.sizes && painting.sizes.length === 3
      ? painting.sizes
      : getSizesForPainting(orientation, painting.priceFrom);

  const [internalFrame, setInternalFrame] = useState<FrameOption>(
    painting.frames[0] || { id: "gold", name: "Gold", swatch: "#d4af37" }
  );
  const selectedFrame = selectedFrameProp || internalFrame;
  const setSelectedFrame = (frame: FrameOption) => {
    setInternalFrame(frame);
    onSelectFrameProp?.(frame);
  };

  const [internalSize, setInternalSize] = useState<SizeOption>(availableSizes[0]);
  const selectedSize = selectedSizeProp || internalSize;
  const setSelectedSize = (size: SizeOption) => {
    setInternalSize(size);
    onSelectSizeProp?.(size);
  };

  const [showGuide, setShowGuide] = useState(false);
  const [added, setAdded] = useState(false);

  const { currency, convert } = useCurrencyStore();
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(painting, selectedFrame, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Dynamic discount calculation from admin panel (painting.discountPercent)
  const discountPercent =
    typeof painting.discountPercent === "number"
      ? painting.discountPercent
      : painting.priceWas && painting.priceFrom && painting.priceWas > painting.priceFrom
      ? Math.round(((painting.priceWas - painting.priceFrom) / painting.priceWas) * 100)
      : 0;

  // Convert price cleanly (supports base currency USD or BDT from future admin panel)
  const convertedPrice = convert(selectedSize.price, painting.currency || "BDT");

  // Dynamic wasPrice calculated from admin discount percentage or priceWas ratio
  const wasPrice =
    discountPercent > 0 && discountPercent < 100
      ? convert(Math.round(selectedSize.price / (1 - discountPercent / 100)), painting.currency || "BDT")
      : painting.priceWas && painting.priceFrom && painting.priceWas > painting.priceFrom
      ? convert(Math.round(selectedSize.price * (painting.priceWas / painting.priceFrom)), painting.currency || "BDT")
      : null;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-8 border border-[#e5e0d8] shadow-sm space-y-5 sm:space-y-6">
      {/* Price block */}
      <div className="space-y-1.5 pb-3 sm:pb-4 border-b border-[#f0ece4]">
        <div className="flex items-baseline gap-2.5 sm:gap-3">
          <span className="text-2xl sm:text-3xl font-bold font-sans text-[var(--color-ink)]">
            {formatPrice(convertedPrice, currency)}
          </span>
          {wasPrice && wasPrice > convertedPrice && (
            <span className="text-sm sm:text-base line-through text-[var(--color-muted)]">
              {formatPrice(wasPrice, currency)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#ceab51]/15 text-[#a8844a]">
              {discountPercent}% OFF
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
          {/* <div className="flex items-center gap-1.5 text-[#00b67a] font-semibold">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Complete with Solid Frame · Ready to Hang</span>
          </div> */}
          {painting.freeDelivery !== false ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00b67a]/10 text-[#00b67a] font-bold text-[11px]">
              <Truck className="w-3 h-3" />
              <span>Free Delivery</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#a8844a]/15 text-[#a8844a] font-bold text-[11px]">
              <Truck className="w-3 h-3" />
              <span>Delivery Charge: {formatPrice(convert(painting.deliveryFee || 70, "BDT"), currency)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Frame Variant Indicator Banner */}
      <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e5e0d8] flex items-center justify-between gap-3 font-sans">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#d6d2c9] flex items-center justify-center flex-shrink-0 shadow-2xs">
            {orientation === "horizontal" && (
              <div className="w-5 h-3.5 border-2 border-[var(--color-ink)] rounded-xs bg-[#ceab51]/10" />
            )}
            {orientation === "vertical" && (
              <div className="w-3.5 h-5 border-2 border-[var(--color-ink)] rounded-xs bg-[#ceab51]/10" />
            )}
            {orientation === "square" && (
              <div className="w-4 h-4 border-2 border-[var(--color-ink)] rounded-xs bg-[#ceab51]/10" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider truncate">
                {variant.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#ceab51]/15 text-[#a8844a] font-bold font-mono">
                {variant.aspectRatio}
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-muted)] truncate">
              {variant.subtitle} · {variant.tagline}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="text-[11px] text-[#a8844a] hover:underline font-semibold flex items-center gap-1 flex-shrink-0 cursor-pointer"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">Size Guide</span>
        </button>
      </div>

      {/* Canvas Size Selection (Layout matching image: label left, selected dimension right, 3 centered cards) */}
      <div className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-ink)]">
            CANVAS SIZE:
          </label>
          <span className="text-xs sm:text-sm font-semibold text-[#a8844a] font-sans">
            {selectedSize.feetLabel || (selectedSize.label.includes("(") ? selectedSize.label.split("(")[0].trim() : selectedSize.label)}{" "}
            ({selectedSize.dimensions || (selectedSize.label.includes("(") ? selectedSize.label.split("(")[1].replace(")", "") : "")})
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {availableSizes.map((size) => {
            const isSelected = selectedSize.id === size.id;
            const feetText =
              size.feetLabel ||
              size.hatLabel ||
              (size.label.includes("(") ? size.label.split("(")[0].trim() : size.label);
            const dimText =
              size.dimensions ||
              (size.label.includes("(") ? size.label.split("(")[1].replace(")", "") : "");

            return (
              <button
                key={size.id}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`py-3 sm:py-3.5 px-2 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? "border-2 border-[#ceab51] bg-[#faf8f3] text-[var(--color-ink)] shadow-xs"
                    : "border border-[#e5e0d8] hover:border-gray-400 bg-white text-[var(--color-ink)]"
                }`}
              >
                <span className="text-xs sm:text-sm font-bold font-sans">
                  {feetText}
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-[var(--color-muted)] mt-0.5">
                  {dimText}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame Selection (Circular swatches matching image) */}
      <div className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-ink)]">
            FRAME:
          </label>
          <span className="text-xs font-bold text-[#a8844a] font-sans uppercase">
            {selectedFrame.name}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-3.5 pt-0.5">
          {painting.frames.map((frame) => {
            const isSelected = selectedFrame.id === frame.id;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => setSelectedFrame(frame)}
                title={frame.name}
                aria-label={frame.name}
                className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? "ring-2 ring-offset-2 ring-[#a8844a] shadow-sm scale-105"
                    : "border border-black/15 hover:scale-105 opacity-90 hover:opacity-100"
                }`}
                style={{ backgroundColor: frame.swatch }}
              >
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 stroke-[3] ${
                      frame.id === "white" || frame.name.toLowerCase().includes("white")
                        ? "text-black"
                        : "text-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add To Cart CTA Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full py-3.5 sm:py-4 rounded-full bg-[var(--color-gold)] hover:bg-[#b8953c] text-[var(--color-ink)] font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>{added ? "✓ ADDED TO SHOPPING BAG" : "OWN THIS MASTERPIECE"}</span>
      </button>

      {/* High-Trust Guarantee strip (Concise & Direct) */}
      {/* <div className="pt-3 sm:pt-4 border-t border-[#f0ece4] space-y-2 text-[11px] sm:text-xs text-[var(--color-muted)] font-sans">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ceab51] flex-shrink-0" />
          <span>Museum-Quality Canvas Art & Solid Wood Framing</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ceab51] flex-shrink-0" />
          <span>Safe delivery in heavy-duty art crate (100% Breakage-Free Guarantee)</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ceab51] flex-shrink-0" />
          <span>90-Day Money-Back Guarantee & preview approval before shipping</span>
        </div>
      </div> */}

      {/* Comprehensive Size Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-4 shadow-2xl border border-[#e5e0d8] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#ceab51]" />
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-ink)]">
                  Complete Size Chart 
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[var(--color-muted)] font-sans leading-relaxed">
              Every painting belongs to one of three frame aspect ratios (Horizontal, Vertical, or Square). Based on its format, 3 traditional hand-measured sizes are handcrafted:
            </p>

            {/* Comprehensive Table */}
            <div className="overflow-hidden rounded-2xl border border-[#e5e0d8] font-sans text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#faf8f5] text-[var(--color-ink)] border-b border-[#e5e0d8]">
                  <tr>
                    <th className="p-3 font-bold">Frame Format</th>
                    <th className="p-3 font-bold text-center">1 Feet</th>
                    <th className="p-3 font-bold text-center">2 Feet</th>
                    <th className="p-3 font-bold text-center">3 Feet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className={orientation === "horizontal" ? "bg-[#faf8f3] font-semibold" : ""}>
                    <td className="p-3">
                      <div className="font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                        <span>Horizontal</span>
                        {orientation === "horizontal" && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-[#ceab51] text-white rounded-md">This Art</span>
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--color-muted)]">Landscape </div>
                      <div className="text-[10px] text-[var(--color-muted)]"> Width &gt; Height (3:2)</div>
                    </td>
                    <td className="p-2 text-center font-mono">18×12″</td>
                    <td className="p-2 text-center font-mono">36×24″</td>
                    <td className="p-2 text-center font-mono">54×36″</td>
                  </tr>
                  <tr className={orientation === "vertical" ? "bg-[#faf8f3] font-semibold" : ""}>
                    <td className="p-2">
                      <div className="font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                        <span>Vertical</span>
                        {orientation === "vertical" && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-[#ceab51] text-white rounded-md">This Art</span>
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--color-muted)]">Portrait · Height &gt; Width (2:3)</div>
                    </td>
                    <td className="p-2 text-center font-mono">12×18″</td>
                    <td className="p-2 text-center font-mono">24×36″</td>
                    <td className="p-2 text-center font-mono">36×54″</td>
                  </tr>
                  <tr className={orientation === "square" ? "bg-[#faf8f3] font-semibold" : ""}>
                    <td className="p-2">
                      <div className="font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                        <span>Square</span>
                        {orientation === "square" && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-[#ceab51] text-white rounded-md">This Art</span>
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--color-muted)]">Square · Width = Height (1:1)</div>
                    </td>
                    <td className="p-2 text-center font-mono">18×18″</td>
                    <td className="p-2 text-center font-mono">36×36″</td>
                    <td className="p-2 text-center font-mono">54×54″</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="px-6 py-2 rounded-full bg-[var(--color-ink)] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
              >
                Close Size Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}