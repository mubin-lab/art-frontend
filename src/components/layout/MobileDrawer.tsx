"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ChevronRight, ChevronDown, Heart, ShoppingBag, Search } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { CurrencySelect } from "./CurrencySelect";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

export function MobileDrawer({ isOpen, onClose, onOpenSearch }: MobileDrawerProps) {
  const { totalCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) return null;

  const popularArtists = [
    { label: "Vincent van Gogh", href: "/artists/vincent-van-gogh" },
    { label: "Claude Monet", href: "/artists/claude-monet" },
    { label: "Gustav Klimt", href: "/artists/gustav-klimt" },
    { label: "Johannes Vermeer", href: "/artists/johannes-vermeer" },
    { label: "Leonardo da Vinci", href: "/artists/leonardo-da-vinci" },
    { label: "All Artists →", href: "/artists" },
  ];

  const popularMovements = [
    { label: "Post-Impressionism", href: "/art-movements/post-impressionism" },
    { label: "Impressionism", href: "/art-movements/impressionism" },
    { label: "Art Nouveau", href: "/art-movements/art-nouveau" },
    { label: "High Renaissance", href: "/art-movements/renaissance" },
    { label: "All Movements →", href: "/shop" },
  ];

  const popularCollections = [
    { label: "Top 100 Ranked Masterpieces", href: "/collections/top-100" },
    { label: "Living Room Statement Pieces", href: "/collections/living-room" },
    { label: "Gold Framed Classics", href: "/collections/gold-frames" },
    { label: "All Collections →", href: "/shop" },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col z-50">
        {/* Header */}
        <div className="p-4 border-b border-[#eeebe3] flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex flex-col">
            <span className="font-serif text-xl font-medium leading-none tracking-tight text-[var(--color-ink)]">
              EmptyBD
            </span>
            <span className="font-serif italic text-[10px] text-[#78716a] tracking-wider mt-0.5">
              Masterpieces Recreated by Hand
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
          {/* Search Shortcut */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#f6f4ee] hover:bg-[#eae5d8] text-xs font-sans text-gray-600 border border-[#eeebe3] transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#8a857e]" />
              <span>Search paintings, artists...</span>
            </button>
          )}

          {/* Art Guide Primary CTA */}
          <Link
            href="/art-guide"
            onClick={onClose}
            className="w-full bg-[var(--color-ink-soft)] text-white p-3.5 rounded-xl flex items-center justify-between font-bold text-xs uppercase tracking-wider shadow-sm"
          >
            <span>Art Guide & Analysis</span>
            <ChevronRight className="w-4 h-4 text-[#ceab51]" />
          </Link>

          {/* Collapsible Accordion: Artists */}
          <div className="border-b border-gray-100 pb-1">
            <button
              type="button"
              onClick={() => toggleSection("artists")}
              className="w-full flex items-center justify-between p-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] hover:text-[#a8844a]"
            >
              <span>Artists</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  expandedSection === "artists" ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection === "artists" && (
              <div className="pl-4 pr-2 pb-2 space-y-1.5 pt-1 text-xs text-[var(--color-muted)]">
                {popularArtists.map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    onClick={onClose}
                    className="block py-1 hover:text-[#a8844a] transition-colors"
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Collapsible Accordion: Movements */}
          <div className="border-b border-gray-100 pb-1">
            <button
              type="button"
              onClick={() => toggleSection("movements")}
              className="w-full flex items-center justify-between p-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] hover:text-[#a8844a]"
            >
              <span>Art Movements</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  expandedSection === "movements" ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection === "movements" && (
              <div className="pl-4 pr-2 pb-2 space-y-1.5 pt-1 text-xs text-[var(--color-muted)]">
                {popularMovements.map((m) => (
                  <Link
                    key={m.label}
                    href={m.href}
                    onClick={onClose}
                    className="block py-1 hover:text-[#a8844a] transition-colors"
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Collapsible Accordion: Collections */}
          <div className="border-b border-gray-100 pb-1">
            <button
              type="button"
              onClick={() => toggleSection("collections")}
              className="w-full flex items-center justify-between p-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] hover:text-[#a8844a]"
            >
              <span>Collections</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  expandedSection === "collections" ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection === "collections" && (
              <div className="pl-4 pr-2 pb-2 space-y-1.5 pt-1 text-xs text-[var(--color-muted)]">
                {popularCollections.map((c) => (
                  <Link
                    key={c.label}
                    href={c.href}
                    onClick={onClose}
                    className="block py-1 hover:text-[#a8844a] transition-colors"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Standalone Links */}
          <Link
            href="/photo-to-painting"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] hover:text-[#a8844a] border-b border-gray-100"
          >
            <div className="flex items-center gap-2">
              <span>Photo to Painting</span>
              <span className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            href="/shop"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] hover:text-[#a8844a] border-b border-gray-100"
          >
            <span>Shop All Paintings</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            href="/audio-stories"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] hover:text-[#a8844a] border-b border-gray-100"
          >
            <span>Audio Stories</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            href="/contact"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] hover:text-[#a8844a]"
          >
            <span>Contact Us</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>

        {/* Footer info & buttons */}
        <div className="p-4 border-t border-[#eeebe3] bg-[#faf8f5] space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
              Currency
            </span>
            <CurrencySelect direction="up" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-[var(--color-ink)]"
            >
              <Heart className="w-3.5 h-3.5 text-red-500" />
              <span>Wishlist ({wishlistItems.length})</span>
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[var(--color-ink)] text-white text-xs font-semibold"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#ceab51]" />
              <span>Cart ({totalCount()})</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
