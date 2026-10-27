"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Heart, ShoppingBag, Menu, Search } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { CurrencySelect } from "./CurrencySelect";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { MobileDrawer } from "./MobileDrawer";
import { MobileSearchModal } from "./MobileSearchModal";

export function Header() {
  const { totalCount, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const cartCount = totalCount();
  const wishlistCount = wishlistItems.length;

  return (
    <header className="bg-white border-b border-[#eeebe3] sticky top-0 lg:static z-40 transition-shadow">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 sm:h-20 lg:h-[100px] flex items-center justify-between gap-3 sm:gap-8">
        {/* Mobile Hamburger (< lg) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden md:p-1.5 text-gray-700 hover:text-black cursor-pointer"
          aria-label="Open mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3.5 flex-shrink-0 group">
          <div className="flex flex-col">
            <span className="font-serif text-2xl sm:text-2xl lg:text-[30px] font-semibold leading-none tracking-tight text-[var(--color-ink)]">
              EmptyBD
            </span>
            <span className="font-serif italic text-[9px] sm:text-[11px] text-[#78716a] tracking-wider mt-0.5 sm:mt-1 ">
              Masterpieces Recreated by Hand
            </span>
          </div>
        </Link>

        {/* Center Search Bar (Desktop only: lg and above) */}
        <div className="hidden lg:flex flex-1 justify-center px-4">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-5 flex-shrink-0">
          <div className="hidden sm:block">
            <CurrencySelect />
          </div>

          <Link
            href="/account"
            aria-label="Account"
            className="hidden sm:flex text-[var(--color-ink)] hover:text-[#a8844a] p-1.5 transition-colors"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Mobile Search Trigger Button (< lg) */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Search masterpieces"
            className="lg:hidden text-[var(--color-ink)] hover:text-[#a8844a] p-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative text-[var(--color-ink)] hover:text-[#a8844a] p-1.5 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[var(--color-gold)] text-[var(--color-ink)] text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Bag */}
          <button
            type="button"
            onClick={openCart}
            aria-label="Shopping Cart"
            className="relative text-[var(--color-ink)] hover:text-[#a8844a] p-1.5 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[var(--color-ink)] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-75">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Menu) */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSearch={() => setMobileSearchOpen(true)}
      />

      {/* Mobile Dedicated Search Modal */}
      <MobileSearchModal
        isOpen={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </header>
  );
}
