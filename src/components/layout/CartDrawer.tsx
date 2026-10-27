"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/lib/store/currency";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, deliveryFee } =
    useCartStore();
  const { currency, convert, country } = useCurrencyStore();

  if (!isOpen) return null;

  const totalUSD = subtotal();
  const deliveryUSD = deliveryFee();
  const subtotalVal = convert(totalUSD);
  const deliveryVal = deliveryUSD > 0 ? convert(deliveryUSD) : 0;
  const convertedTotal = subtotalVal + deliveryVal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#e5e0d8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[var(--color-ink)]" />
              <h2 className="font-serif text-lg sm:text-xl font-semibold text-[var(--color-ink)]">
                Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-[#d0cac0] mb-4" />
                <h3 className="font-serif text-lg text-[var(--color-ink)] mb-2">
                  Your bag is currently empty
                </h3>
                <p className="text-sm text-[var(--color-muted)] max-w-xs mb-6">
                  Explore our museum-quality framed canvas art and find your masterpiece.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-[var(--color-ink)] text-white text-xs font-semibold tracking-wider uppercase cursor-pointer"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = convert(item.size.price);
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="relative w-18 h-22 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-[#e5e0d8]">
                      <Image
                        src={item.painting.image}
                        alt={item.painting.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-xs sm:text-sm font-semibold text-[var(--color-ink)] leading-snug line-clamp-1">
                            {item.painting.title}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-600 p-1 cursor-pointer transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-[var(--color-muted)] truncate">
                          {item.painting.artistName}
                        </p>
                        <p className="text-[11px] text-[#8a837c] mt-0.5 flex items-center gap-1.5 truncate font-sans">
                          <span>{(item.size.feetLabel || item.size.label.replace(/hat/gi, "Feet"))} · {item.frame.name} frame</span>
                          <span className="text-gray-300">•</span>
                          {item.painting.freeDelivery !== false ? (
                            <span className="text-[#00b67a] font-semibold">Delivery: {formatPrice(0, currency)}</span>
                          ) : (
                            <span className="text-[#a8844a] font-semibold">
                              +Delivery: {formatPrice(convert(item.painting.deliveryFee || 70, "BDT"), currency)}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 sm:mt-3">
                        <div className="flex items-center border border-[#d6d2c9] rounded-full px-2 py-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-1.5 text-xs text-gray-500 hover:text-black cursor-pointer"
                          >
                            −
                          </button>
                          <span className="px-1.5 sm:px-2 text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-1.5 text-xs text-gray-500 hover:text-black cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[var(--color-ink)]">
                          {formatPrice(itemPrice * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#e5e0d8] bg-[#faf8f5] space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded-xl border border-[#eeebe3]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm leading-none flex-shrink-0">{country?.flag || "🇧🇩"}</span>
                  <span className="text-[11px] text-gray-700 font-sans truncate">
                    Shipping to: <strong className="text-[var(--color-ink)]">{country?.name || "Bangladesh"}</strong>
                  </span>
                </div>
                <span className="text-[var(--color-ink)] font-semibold text-[11px] flex-shrink-0">{deliveryVal > 0 ? `+${formatPrice(deliveryVal, currency)}` : formatPrice(0, currency)}</span>
              </div>

              <div className="space-y-1.5 text-xs font-sans">
                <div className="flex justify-between items-center text-[var(--color-muted)]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--color-ink)]">
                    {formatPrice(subtotalVal, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-muted)]">Delivery Charge</span>
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
                <div className="flex justify-between items-center text-sm sm:text-base font-bold border-t border-gray-200/80 pt-2 text-[var(--color-ink)]">
                  <span>Total</span>
                  <span>{formatPrice(convertedTotal, currency)}</span>
                </div>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[var(--color-muted)] text-center">
                Free tracked worldwide shipping & 90-day returns included.
              </p>
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full py-3 sm:py-3.5 rounded-full bg-[var(--color-ink)] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}