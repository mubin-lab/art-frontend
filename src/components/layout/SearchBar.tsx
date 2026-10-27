"use client";

import { getPaintingUrl } from "@/lib/utils/paintingUrl";
import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/lib/store/currency";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { searchArt } from "@/lib/api";
import type { Painting, Artist } from "@/types";

export interface SearchBarProps {
  onFocusChange?: (focused: boolean) => void;
  className?: string;
}

export function SearchBar({ onFocusChange, className = "" }: SearchBarProps = {}) {
  const [query, setQuery] = useState("");
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { currency, convert } = useCurrencyStore();

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setPaintings([]);
      setArtists([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchArt(query);
        setPaintings(results.paintings.slice(0, 5));
        setArtists(results.artists.slice(0, 3));
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      onFocusChange?.(false);
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-[540px] ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
            onFocusChange?.(true);
          }}
          onBlur={() => {
            onFocusChange?.(false);
          }}
          placeholder="What are you looking for?"
          className="w-full h-[46px] pl-5 pr-28 rounded-full border border-[#d9d5cc] bg-white text-sm font-sans placeholder:text-[#8c857d] focus:outline-none focus:ring-1 focus:ring-[#ceab51] focus:border-[#ceab51] shadow-2xs"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 px-6 rounded-full bg-[var(--color-ink-soft)] hover:bg-black text-white text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
          <span>SEARCH</span>
        </button>
      </form>

      {/* Autosuggest Dropdown */}
      {isOpen && (paintings.length > 0 || artists.length > 0) && (
        <div className="absolute left-0 right-0 top-[52px] bg-white rounded-2xl shadow-xl border border-[#e5e0d8] p-4 z-50 max-h-[420px] overflow-y-auto">
          {artists.length > 0 && (
            <div className="mb-4">
              <span className="text-[10px] uppercase font-semibold tracking-[0.15em] text-[#a8844a] block mb-2 px-2">
                Artists
              </span>
              <div className="space-y-1">
                {artists.map((artist) => (
                  <Link
                    key={artist.slug}
                    href={`/artists/${artist.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      onFocusChange?.(false);
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f8f6f0] transition-colors"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={artist.avatar}
                        alt={artist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-ink)]">
                        {artist.name}
                      </h4>
                      <span className="text-[11px] text-[var(--color-muted)]">
                        {artist.artworkCount} artworks
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {paintings.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-[0.15em] text-[#a8844a] block mb-2 px-2">
                Paintings
              </span>
              <div className="space-y-1">
                {paintings.map((painting) => (
                  <Link
                    key={painting.slug}
                    href={getPaintingUrl(painting)}
                    onClick={() => {
                      setIsOpen(false);
                      onFocusChange?.(false);
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f8f6f0] transition-colors"
                  >
                    <div className="relative w-12 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={painting.image}
                        alt={painting.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-serif truncate text-[var(--color-ink)]">
                        {painting.title}
                      </h4>
                      <p className="text-[11px] text-[var(--color-muted)] truncate">
                        {painting.artistName} · From {formatPrice(convert(painting.priceFrom, painting.currency || "BDT"), currency)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}