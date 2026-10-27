"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { MegaMenu } from "./MegaMenu";
import type { NavItem } from "@/types";

interface MainNavProps {
  navItems?: NavItem[];
}

export function MainNav({ navItems = [] }: MainNavProps) {
  const [activeItem, setActiveItem] = useState<NavItem | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (item: NavItem) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (item.columns?.length || item.featured) {
      setActiveItem(item);
    } else {
      setActiveItem(null);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveItem(null);
    }, 120);
  };

  const handleMenuEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <nav
      onMouseLeave={handleMouseLeave}
      className="relative bg-white border-t border-[#eeebe3] border-b border-[#e5e0d8] sticky top-0 z-30 hidden lg:block"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[66px] flex items-center justify-between">
        {/* Left: Art Guide Dark Block Button */}
        <Link
          href="/art-guide"
          onMouseEnter={() => setActiveItem(null)}
          className="h-[66px] w-[280px] lg:w-[300px] -ml-4 sm:-ml-6 bg-[var(--color-ink-soft)] hover:bg-black text-white px-6 flex items-center justify-between transition-colors group select-none flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <MoreHorizontal className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-xs font-bold tracking-[0.14em] uppercase font-sans">
              Art Guide
            </span>
          </div>
          <span className="text-gray-400 group-hover:text-white transition-colors text-xs">
            ›
          </span>
        </Link>

        {/* Center / Right: Nav items */}
        <ul className="flex items-center gap-1 lg:gap-2 flex-1 justify-end">
          {navItems.map((item) => {
            const hasDropdown = Boolean(item.columns?.length || item.featured);
            const isHovered = activeItem?.label === item.label;

            return (
              <li
                key={item.label}
                onMouseEnter={() => handleMouseEnter(item)}
              >
                <Link
                  href={item.href}
                  className={`h-[66px] px-3.5 lg:px-4.5 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] uppercase font-sans transition-colors relative ${
                    isHovered
                      ? "text-[#a8844a]"
                      : "text-[var(--color-ink)] hover:text-[#a8844a]"
                  }`}
                >
                  <span>{item.label}</span>
                  {hasDropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                        isHovered ? "rotate-180 text-[#a8844a]" : ""
                      }`}
                    />
                  )}
                  {item.badge && (
                    <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] absolute top-4 right-2 ring-2 ring-white" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Full-width MegaMenu Modal anchored to the entire navbar */}
      {activeItem && (activeItem.columns?.length || activeItem.featured) && (
        <div onMouseEnter={handleMenuEnter}>
          <MegaMenu item={activeItem} onClose={() => setActiveItem(null)} />
        </div>
      )}
    </nav>
  );
}