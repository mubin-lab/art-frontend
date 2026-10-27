"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, TrendingUp } from "lucide-react";
import { searchArt } from "@/lib/api";
import { getPaintingUrl } from "@/lib/utils/paintingUrl";
import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/lib/store/currency";
import type { Painting, Artist } from "@/types";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "The Starry Night",
  "Vincent van Gogh",
  "The Kiss",
  "Claude Monet",
  "Water Lilies",
  "Sunflowers",
  "Impressionism",
];

export function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { currency, convert } = useCurrencyStore();

  // Ensure portal only renders client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input and lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setPaintings([]);
      setArtists([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search debounce
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setPaintings([]);
      setArtists([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchArt(query);
        setPaintings(results.paintings || []);
        setArtists(results.artists || []);
      } catch {
        setPaintings([]);
        setArtists([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm flex flex-col justify-start animate-in fade-in duration-200 select-none pt-[max(10px,env(safe-area-inset-top))] px-2.5 sm:px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Search Container Card */}
      <div className="w-full max-w-[620px] mx-auto bg-white rounded-2xl shadow-2xl border border-[#eeebe3] overflow-hidden flex flex-col mt-1 max-h-[88vh]">
        {/* Top Input Bar */}
        <div className="p-3 sm:p-4 border-b border-[#eeebe3] bg-white">
          <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
            {/* Input Box */}
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-[#8a857e] pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                inputMode="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search masterpieces, artists, styles..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#f6f4ee] focus:bg-white rounded-full text-sm text-[var(--color-ink)] placeholder-[#8a857e] border border-transparent focus:border-[#ceab51] focus:outline-none transition-all shadow-inner font-sans [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
              />
              {/* Single custom clear button */}
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2.5 p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-200/60 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 text-sm font-sans font-medium text-gray-600 hover:text-black transition-colors cursor-pointer flex-shrink-0"
            >
              Cancel
            </button>
          </form>
        </div>

        {/* Scrollable Results & Suggestions Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white divide-y divide-gray-100">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-8 text-gray-500 font-sans text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-[#ceab51]" />
              <span>Searching gallery collection...</span>
            </div>
          )}

          {/* Popular Search Suggestions (shown when query is empty) */}
          {!isLoading && !query.trim() && (
            <div className="space-y-3 pt-1 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#a8844a] font-sans">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full text-xs font-sans text-gray-700 bg-[#f6f4ee] hover:bg-[#eae5d8] hover:text-black transition-colors cursor-pointer border border-[#eeebe3]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && query.trim().length >= 2 && (
            <div className="space-y-4 pt-1">
              {/* Paintings Group */}
              {paintings.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-[#a8844a] block mb-2 font-sans">
                    Paintings ({paintings.length})
                  </span>
                  <div className="divide-y divide-gray-100">
                    {paintings.map((painting) => (
                      <Link
                        key={painting.id}
                        href={getPaintingUrl(painting)}
                        onClick={onClose}
                        className="flex items-center gap-3 py-2.5 px-1.5 rounded-xl hover:bg-[#faf8f4] transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-[#eeebe3]">
                          <Image
                            src={painting.image}
                            alt={painting.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-serif truncate text-[var(--color-ink)] font-medium">
                            {painting.title}
                          </h4>
                          <p className="text-xs text-[var(--color-muted)] font-sans truncate">
                            {painting.artistName}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-bold font-sans text-[var(--color-ink)]">
                            {formatPrice(convert(painting.priceFrom, painting.currency || "BDT"), currency)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Artists Group */}
              {artists.length > 0 && (
                <div className="pt-3">
                  <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-[#a8844a] block mb-2 font-sans">
                    Artists ({artists.length})
                  </span>
                  <div className="space-y-1">
                    {artists.map((artist) => (
                      <Link
                        key={artist.slug}
                        href={`/artists/${artist.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#faf8f4] transition-colors"
                      >
                        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-[#eeebe3]">
                          <Image
                            src={artist.avatar}
                            alt={artist.name}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-serif truncate text-[var(--color-ink)]">
                            {artist.name}
                          </h4>
                          <p className="text-xs text-[var(--color-muted)] font-sans">
                            {artist.artworkCount} artworks
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results Message */}
              {paintings.length === 0 && artists.length === 0 && (
                <div className="text-center py-10 space-y-1.5">
                  <p className="font-serif text-base text-[var(--color-ink)] font-medium">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-[var(--color-muted)] font-sans max-w-xs mx-auto">
                    Try searching for artist names like &ldquo;Van Gogh&rdquo;, &ldquo;Monet&rdquo; or art titles like &ldquo;Starry Night&rdquo;.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
