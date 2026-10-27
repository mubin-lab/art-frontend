"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { NavItem } from "@/types";

interface MegaMenuProps {
  item: NavItem;
  onClose?: () => void;
}

export function MegaMenu({ item, onClose }: MegaMenuProps) {
  if (!item.columns && !item.featured) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full w-full bg-white shadow-2xl border-t border-[#eeebe3] border-b border-[#e5e0d8] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sub Columns */}
          {item.columns?.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#a8844a] border-b border-[#f0ece4] pb-2 font-sans">
                {col.category}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-center justify-between text-xs text-[var(--color-ink)] hover:text-[#a8844a] font-sans py-1 transition-colors"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.label}
                      </span>
                      {link.count && (
                        <span className="text-[10px] text-[#999289] font-normal">
                          ({link.count})
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Featured Card */}
          {item.featured && (
            <div className="col-span-1 rounded-2xl overflow-hidden bg-[#faf8f5] border border-[#e8e4dc] p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#a8844a] block mb-2 font-sans">
                  FEATURED STORY
                </span>
                <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-3">
                  <Image
                    src={item.featured.image}
                    alt={item.featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h5 className="font-serif text-sm font-semibold text-[var(--color-ink)] line-clamp-2">
                  {item.featured.title}
                </h5>
              </div>
              <Link
                href={item.featured.href}
                onClick={onClose}
                className="mt-4 text-[11px] font-semibold tracking-wider uppercase text-[var(--color-ink)] hover:text-[#a8844a] inline-flex items-center gap-1 transition-colors font-sans"
              >
                Read Art Guide →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}