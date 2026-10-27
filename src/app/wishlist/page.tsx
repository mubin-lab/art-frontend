"use client";

import React from "react";
import Link from "next/link";
import { useWishlistStore } from "@/lib/store/wishlist";
import { ProductCard } from "@/components/product/ProductCard";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="bg-[var(--color-bg)] py-8 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <Eyebrow className="mb-2">SAVED ARTWORKS</Eyebrow>
          <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-[var(--color-ink)]">
            My Wishlist ({items.length})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-16 text-center border border-[#e5e0d8] shadow-sm max-w-xl mx-auto space-y-4">
            <h2 className="font-serif text-lg sm:text-xl font-medium text-[var(--color-ink)]">
              No saved paintings yet
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans">
              Click the heart icon on any painting to save it to your wishlist.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 rounded-full bg-[var(--color-ink)] text-white text-xs font-bold tracking-wider uppercase cursor-pointer"
            >
              Explore Paintings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {items.map((p) => (
              <ProductCard key={p.id} painting={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}