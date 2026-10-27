import React from "react";
import { getPaintings, getArtists } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

interface ShopPageProps {
  searchParams: Promise<{
    artist?: string;
    movement?: string;
    collection?: string;
    sort?: string;
    q?: string;
  }>;
}

export const metadata = {
  title: "Shop All Framed Canvas Art | YourMuseum",
  description:
    "Browse our complete collection of museum-quality framed canvas art. Filter by artist, art movement, and size with custom solid wood framing.",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const allPaintings = await getPaintings();
  const artists = await getArtists();

  let filtered = [...allPaintings];

  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.artistName.toLowerCase().includes(q) ||
        p.movement.toLowerCase().includes(q)
    );
  }

  if (params.artist) {
    filtered = filtered.filter((p) => p.artistSlug === params.artist);
  }

  if (params.movement) {
    filtered = filtered.filter(
      (p) => p.movement.toLowerCase() === params.movement?.toLowerCase()
    );
  }

  if (params.collection === "top-100") {
    filtered = filtered
      .filter((p) => p.top100Rank !== undefined)
      .sort((a, b) => (a.top100Rank || 999) - (b.top100Rank || 999));
  }

  if (params.sort === "price-asc") {
    filtered.sort((a, b) => a.priceFrom - b.priceFrom);
  } else if (params.sort === "price-desc") {
    filtered.sort((a, b) => b.priceFrom - a.priceFrom);
  } else if (params.sort === "name") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  const movements = Array.from(new Set(allPaintings.map((p) => p.movement)));
  const hasActiveFilters = Boolean(params.artist || params.movement || params.collection || params.sort || params.q);

  return (
    <div className="bg-[var(--color-bg)] py-8 sm:py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <Eyebrow className="mb-2">CATALOGUE</Eyebrow>
          <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-[var(--color-ink)]">
            {params.collection === "top-100"
              ? "Top 100 Ranked Masterpieces"
              : params.artist
              ? `Paintings by ${filtered[0]?.artistName || "Artist"}`
              : params.movement
              ? `${params.movement} Paintings`
              : "Shop All Canvas Art"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans mt-2">
            Showing {filtered.length} museum-quality framed canvas masterpieces.
          </p>

          {hasActiveFilters && (
            <div className="mt-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-xs text-[#a8844a] font-semibold underline"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Sidebar Filters (Accordion on mobile, sticky sidebar on desktop) */}
          <aside className="lg:col-span-3 bg-white rounded-2xl p-5 sm:p-6 border border-[#e5e0d8] shadow-xs space-y-6 font-sans">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#a8844a] border-b border-[#f0ece4] pb-2 mb-3">
                ART MOVEMENTS
              </h3>
              <ul className="flex flex-wrap lg:flex-col gap-1.5 text-xs">
                <li>
                  <Link
                    href="/shop"
                    className={`px-3 py-1 rounded-full border lg:border-0 lg:p-0 block hover:text-[#a8844a] transition-colors ${
                      !params.movement
                        ? "font-bold text-[var(--color-ink)] bg-[#faf8f3] lg:bg-transparent border-[#ceab51]"
                        : "text-[var(--color-muted)] border-gray-200"
                    }`}
                  >
                    All Movements
                  </Link>
                </li>
                {movements.map((m) => (
                  <li key={m}>
                    <Link
                      href={`/shop?movement=${encodeURIComponent(m)}`}
                      className={`px-3 py-1 rounded-full border lg:border-0 lg:p-0 block hover:text-[#a8844a] transition-colors ${
                        params.movement === m
                          ? "font-bold text-[var(--color-ink)] bg-[#faf8f3] lg:bg-transparent border-[#ceab51]"
                          : "text-[var(--color-muted)] border-gray-200"
                      }`}
                    >
                      {m}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#a8844a] border-b border-[#f0ece4] pb-2 mb-3">
                ARTISTS
              </h3>
              <ul className="flex flex-wrap lg:flex-col gap-1.5 text-xs max-h-48 overflow-y-auto">
                <li>
                  <Link
                    href="/shop"
                    className={`px-3 py-1 rounded-full border lg:border-0 lg:p-0 block hover:text-[#a8844a] transition-colors ${
                      !params.artist
                        ? "font-bold text-[var(--color-ink)] bg-[#faf8f3] lg:bg-transparent border-[#ceab51]"
                        : "text-[var(--color-muted)] border-gray-200"
                    }`}
                  >
                    All Artists
                  </Link>
                </li>
                {artists.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/shop?artist=${a.slug}`}
                      className={`px-3 py-1 rounded-full border lg:border-0 lg:p-0 block hover:text-[#a8844a] transition-colors ${
                        params.artist === a.slug
                          ? "font-bold text-[var(--color-ink)] bg-[#faf8f3] lg:bg-transparent border-[#ceab51]"
                          : "text-[var(--color-muted)] border-gray-200"
                      }`}
                    >
                      {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#a8844a] border-b border-[#f0ece4] pb-2 mb-3">
                SORT BY
              </h3>
              <ul className="flex flex-wrap lg:flex-col gap-1.5 text-xs">
                <li>
                  <Link
                    href="/shop"
                    className={`px-3 py-1 rounded-full border lg:border-0 lg:p-0 block hover:text-[#a8844a] ${
                      !params.sort
                        ? "font-bold text-[var(--color-ink)] bg-[#faf8f3] lg:bg-transparent border-[#ceab51]"
                        : "text-[var(--color-muted)] border-gray-200"
                    }`}
                  >
                    Featured / Default
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?sort=price-asc"
                    className={`px-3 py-1 rounded-full border lg:border-0 lg:p-0 block hover:text-[#a8844a] ${
                      params.sort === "price-asc"
                        ? "font-bold text-[var(--color-ink)] bg-[#faf8f3] lg:bg-transparent border-[#ceab51]"
                        : "text-[var(--color-muted)] border-gray-200"
                    }`}
                  >
                    Price: Low to High
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?sort=price-desc"
                    className={`px-3 py-1 rounded-full border lg:border-0 lg:p-0 block hover:text-[#a8844a] ${
                      params.sort === "price-desc"
                        ? "font-bold text-[var(--color-ink)] bg-[#faf8f3] lg:bg-transparent border-[#ceab51]"
                        : "text-[var(--color-muted)] border-gray-200"
                    }`}
                  >
                    Price: High to Low
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?sort=name"
                    className={`px-3 py-1 rounded-full border lg:border-0 lg:p-0 block hover:text-[#a8844a] ${
                      params.sort === "name"
                        ? "font-bold text-[var(--color-ink)] bg-[#faf8f3] lg:bg-transparent border-[#ceab51]"
                        : "text-[var(--color-muted)] border-gray-200"
                    }`}
                  >
                    Title: A to Z
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Paintings Grid (2-up on mobile, 3-up on desktop) */}
          <main className="lg:col-span-9">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 sm:p-12 text-center border border-[#e5e0d8] space-y-3">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[var(--color-ink)]">
                  No paintings match your current filter
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans">
                  Try clearing some filter criteria to discover more masterpieces.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-2.5 rounded-full bg-[var(--color-ink)] text-white text-xs font-semibold uppercase tracking-wider mt-4"
                >
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {filtered.map((painting) => (
                  <ProductCard key={painting.id} painting={painting} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}