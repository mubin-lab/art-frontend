"use client";

import { getPaintingUrl } from "@/lib/utils/paintingUrl";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "./WishlistButton";
import { AudioBadge } from "./AudioBadge";
import { Price } from "@/components/ui/Price";
import type { Painting } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  painting: Painting;
  className?: string;
}

export function ProductCard({ painting, className }: ProductCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 sm:hover:-translate-y-1.5 border border-[#ece7df]",
        className
      )}
    >
      {/* Top Image Container with blurred background */}
      <Link
        href={getPaintingUrl(painting)}
        className="relative w-full h-[180px] sm:h-[220px] md:h-[250px] rounded-xl overflow-hidden block bg-[#181615]"
      >
        {/* Blurred backdrop image */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-lg brightness-75 scale-125 transition-transform duration-500 group-hover:scale-130"
          style={{ backgroundImage: `url(${painting.image})` }}
        />

        {/* Crisp foreground painting */}
        <div className="absolute inset-2 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={painting.image}
              alt={painting.title}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
              className="object-contain drop-shadow-md group-hover:scale-[1.03] transition-transform duration-300"
            />
          </div>
        </div>

        {/* Top-Right Wishlist Button */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10">
          <WishlistButton painting={painting} className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        {/* Bottom-Left Audio Indicator Badge */}
        {painting.hasAudio && (
          <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 z-10">
            <AudioBadge type={painting.audioIcon} className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        )}
      </Link>

      {/* Info Block */}
      <div className="pt-2.5 sm:pt-3.5 pb-1 px-0.5 sm:px-1 flex flex-col flex-1 justify-between">
        <div>
          <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] text-[#a8844a] font-sans truncate">
            {painting.movement}
          </span>
          <span className="block text-[11px] sm:text-xs text-[var(--color-muted)] font-sans truncate mt-0.5">
            {painting.artistName}
          </span>
          <Link
            href={getPaintingUrl(painting)}
            className="block mt-1 group-hover:text-[#a8844a] transition-colors"
          >
            <h3 className="font-serif text-sm sm:text-base md:text-lg leading-snug font-normal text-[var(--color-ink)] line-clamp-1">
              {painting.title}
            </h3>
          </Link>
        </div>

        {/* Price & Action Button */}
        <div className="mt-2.5 sm:mt-3.5 space-y-2">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <Price
              priceFrom={painting.priceFrom}
              priceWas={painting.priceWas}
              currency={painting.currency}
              size="sm"
            />
            {painting.freeDelivery !== false ? (
              <span className="text-[10px] font-bold text-[#00b67a] font-sans">
                Free Delivery
              </span>
            ) : (
              <span className="text-[10px] font-medium text-gray-500 font-sans">
                + Delivery Fee
              </span>
            )}
          </div>

          <Link
            href={getPaintingUrl(painting)}
            className="w-full h-8 sm:h-9 rounded-full bg-[var(--color-ink-soft)] hover:bg-black text-white text-[9px] sm:text-[11px] font-semibold tracking-[0.08em] uppercase flex items-center justify-center gap-1 transition-colors select-none shadow-2xs font-sans"
          >
            <span className="truncate">CHOOSE SIZE & FRAME</span>
            <span className="text-xs">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}