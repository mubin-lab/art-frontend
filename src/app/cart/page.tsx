"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useCurrencyStore } from "@/lib/store/currency";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, deliveryFee } = useCartStore();
  const { currency, convert, country } = useCurrencyStore();

  const subtotalVal = convert(subtotal());
  const deliveryVal = deliveryFee() > 0 ? convert(deliveryFee(), "BDT") : 0;
  const total = subtotalVal + deliveryVal;

  return (
    <div className="bg-[var(--color-bg)] py-8 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-[var(--color-ink)] mb-6 sm:mb-8">
          Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-16 text-center border border-[#e5e0d8] shadow-sm max-w-xl mx-auto space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-[var(--color-ink)]">
              Your bag is empty
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans">
              Discover world-famous masterworks framed on museum-quality canvas.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 rounded-full bg-[var(--color-ink)] text-white text-xs font-bold tracking-wider uppercase"
            >
              Shop Paintings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
            <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#e5e0d8] shadow-sm divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="py-4 sm:py-6 first:pt-0 last:pb-0 flex gap-3 sm:gap-6">
                  <div className="relative w-20 h-24 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <Image
                      src={item.painting.image}
                      alt={item.painting.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-sm sm:text-lg font-bold text-[var(--color-ink)] leading-snug line-clamp-1">
                          {item.painting.title}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 p-1 cursor-pointer flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[var(--color-muted)] font-sans truncate">
                        {item.painting.artistName}
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#a8844a] font-medium font-sans mt-0.5 flex items-center gap-2 truncate">
                        <span>{(item.size.feetLabel || item.size.label.replace(/hat/gi, "Feet"))} · {item.frame.name}
                           {/* solid wood frame */}
                           </span>
                        <span className="text-gray-300">•</span>
                        {item.painting.freeDelivery !== false ? (
                          <span className="text-[#00b67a] font-bold">Delivery: {formatPrice(0, currency)}</span>
                        ) : (
                          <span className="text-[#a8844a] font-bold">
                            Delivery: {formatPrice(convert(item.painting.deliveryFee || 70, "BDT"), currency)}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 sm:mt-4">
                      <div className="flex items-center border border-gray-300 rounded-full px-2 sm:px-3 py-0.5 sm:py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-1.5 sm:px-2 text-xs text-gray-600 hover:text-black cursor-pointer"
                        >
                          −
                        </button>
                        <span className="px-2 sm:px-3 text-xs font-bold font-sans">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-1.5 sm:px-2 text-xs text-gray-600 hover:text-black cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm sm:text-base font-bold text-[var(--color-ink)] font-sans">
                        {formatPrice(convert(item.size.price * item.quantity), currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#e5e0d8] shadow-sm space-y-5 sm:space-y-6 font-sans">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-ink)] border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              <div className="flex items-center justify-between text-xs bg-[#faf8f5] px-3.5 py-2.5 rounded-xl border border-[#eeebe3]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base leading-none flex-shrink-0">{country?.flag || "🇧🇩"}</span>
                  <span className="text-xs text-gray-700 font-sans truncate">
                    Delivering to: <strong className="text-[var(--color-ink)]">{country?.name || "Bangladesh"}</strong>
                  </span>
                </div>
                <span className="text-[var(--color-ink)] font-semibold text-xs flex-shrink-0">{deliveryVal > 0 ? `+${formatPrice(deliveryVal, currency)}` : formatPrice(0, currency)}</span>
              </div>

              <div className="space-y-2.5 sm:space-y-3 text-sm">
                <div className="flex justify-between text-[var(--color-muted)] text-xs sm:text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--color-ink)]">
                    {formatPrice(subtotalVal, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--color-muted)] text-xs sm:text-sm">
                  <span>Delivery Charge</span>
                  {deliveryVal > 0 ? (
                    <span className="font-bold text-[var(--color-ink)]">
                      +{formatPrice(deliveryVal, currency)}
                    </span>
                  ) : (
                    <span className="font-bold text-[var(--color-ink)]">
                      {formatPrice(0, currency)}
                    </span>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-sm sm:text-base font-bold text-[var(--color-ink)]">
                  <span>Total</span>
                  <span>{formatPrice(total, currency)}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3.5 sm:py-4 rounded-full bg-[var(--color-ink)] hover:bg-black text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Checkout With Secure Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-2 pt-2 text-[11px] sm:text-xs text-[var(--color-muted)] border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ceab51]" />
                  <span>Museum Quality & Solid Wood Framing Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ceab51]" />
                  <span>Free insured tracked worldwide delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ceab51]" />
                  <span>90-day hassle-free money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}