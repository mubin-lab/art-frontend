"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, CheckCircle2 } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FRAME_VARIANTS, type FrameOrientation } from "@/lib/sizes";
import { useCurrencyStore } from "@/lib/store/currency";
import { formatPrice } from "@/lib/utils";

export default function PhotoToPaintingPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [style, setStyle] = useState("Classical Realism");
  const [orientation, setOrientation] = useState<FrameOrientation>("horizontal");
  const [feetIndex, setFeetIndex] = useState(0); // 0 = 1 Feet, 1 = 2 Feet, 2 = 3 Feet
  const { currency, convert } = useCurrencyStore();
  const [submitted, setSubmitted] = useState(false);

  const activeVariant = FRAME_VARIANTS[orientation];
  const selectedSize = activeVariant.sizes[feetIndex];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedFile(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[var(--color-bg)] py-8 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <Eyebrow className="mb-2">CUSTOM COMMISSION</Eyebrow>
          <h1 className="font-serif text-2xl sm:text-5xl font-semibold text-[var(--color-ink)]">
            Turn Your Photo Into Museum-Quality Framed Canvas Art
          </h1>
          <p className="text-xs sm:text-base text-[var(--color-muted)] font-sans mt-2 sm:mt-3">
            Commission a portrait artist to hand-paint your family, wedding, children, pets, or vacation memories onto real stretched linen canvas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start max-w-5xl mx-auto">
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#e5e0d8] shadow-sm space-y-5 sm:space-y-6">
            {submitted ? (
              <div className="text-center py-8 sm:py-12 space-y-3 sm:space-y-4">
                <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-[#00b67a] mx-auto" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-ink)]">
                  Commission Request Received!
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans max-w-md mx-auto">
                  Our senior portrait curator will review your photograph and email you an artist recommendation, digital mockup, and quotation within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="border-2 border-dashed border-[#d6d2c9] hover:border-[#ceab51] rounded-2xl p-5 sm:p-8 text-center cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {selectedFile ? (
                    <div className="space-y-3">
                      <div className="relative w-36 h-28 sm:w-40 sm:h-32 mx-auto rounded-lg overflow-hidden">
                        <Image
                          src={selectedFile}
                          alt="Uploaded photo preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs text-[#00b67a] font-semibold block">
                        ✓ Photo uploaded. Click to change.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-[#a8844a] mx-auto" />
                      <div className="text-xs sm:text-sm font-semibold text-[var(--color-ink)]">
                        Drag & drop photograph here, or click to browse
                      </div>
                      <p className="text-[11px] sm:text-xs text-[var(--color-muted)]">
                        Supports JPEG, PNG, HEIC up to 25MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Style */}
                <div className="space-y-2 font-sans">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">
                    Choose Painting Style:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Classical Realism", "French Impressionist", "Warm Renaissance"].map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStyle(st)}
                          className={`p-2.5 sm:p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            style === st
                              ? "border-[#ceab51] bg-[#faf8f3] text-[var(--color-ink)] ring-1 ring-[#ceab51]"
                              : "border-gray-200 text-gray-600 bg-white"
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Frame Orientation Variant (1 of 3) */}
                <div className="space-y-2 font-sans">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">
                    Choose Frame Format:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(["horizontal", "vertical", "square"] as FrameOrientation[]).map((type) => {
                      const v = FRAME_VARIANTS[type];
                      const isSel = orientation === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setOrientation(type)}
                          className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? "border-[#ceab51] bg-[#faf8f3] ring-1 ring-[#ceab51]"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--color-ink)]">{v.name.split(" ")[0]}</span>
                            <span className="text-[10px] font-mono text-[#a8844a] font-bold">{v.aspectRatio}</span>
                          </div>
                          <div className="text-[10px] text-[var(--color-muted)] mt-0.5 truncate">{v.subtitle}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3 Sizes for the Selected Variant */}
                <div className="space-y-2 font-sans">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">
                      Select Canvas Size ({activeVariant.name}):
                    </label>
                    <span className="text-[11px] text-[#a8844a] font-medium">
                      3 sizes available
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {activeVariant.sizes.map((sz, idx) => {
                      const isSel = feetIndex === idx;
                      const baseVal = idx === 0 ? 249 : idx === 1 ? 399 : 599;
                      const priceStr = formatPrice(convert(baseVal, "USD"), currency);
                      return (
                        <button
                          key={sz.id}
                          type="button"
                          onClick={() => setFeetIndex(idx)}
                          className={`p-2 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? "border-[#ceab51] bg-[#faf8f3] ring-1.5 ring-[#ceab51]"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="text-xs font-bold text-[var(--color-ink)]">{sz.feetLabel || sz.hatLabel}</div>
                          <div className="text-[10px] font-mono text-[var(--color-muted)] mt-0.5">{sz.dimensions}</div>
                          <div className="text-xs text-[#a8844a] font-bold mt-1.5">{priceStr}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 rounded-full bg-[var(--color-gold)] hover:bg-[#b8953c] text-[var(--color-ink)] font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors shadow-md cursor-pointer"
                >
                  Request Artist Review & Free Mockup
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#e5e0d8] shadow-sm space-y-3 font-sans">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-ink)]">
                The Portrait Commission Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
                Before your canvas is framed and shipped, our team shares high-resolution preview photos of your finished framed canvas artwork for approval.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#a8844a]">
                ✓ 90-Day Money-Back Guarantee
              </div>
            </div>

            {/* Frame Size Reference Guide Card */}
            <div className="bg-[#faf8f5] rounded-2xl sm:rounded-3xl p-5 border border-[#e5e0d8] space-y-3 font-sans text-xs">
              <h4 className="font-bold text-[var(--color-ink)] uppercase tracking-wider text-xs">
                Hand Measure Size Reference
              </h4>
              <div className="space-y-1.5 text-[11px] text-[var(--color-muted)]">
                <p><strong>Horizontal (3:2):</strong> 18×12″ (1 Feet) · 36×24″ (2 Feet) · 54×36″ (3 Feet)</p>
                <p><strong>Vertical (2:3):</strong> 12×18″ (1 Feet) · 24×36″ (2 Feet) · 36×54″ (3 Feet)</p>
                <p><strong>Square (1:1):</strong> 18×18″ (1 Feet) · 36×36″ (2 Feet) · 54×54″ (3 Feet)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}