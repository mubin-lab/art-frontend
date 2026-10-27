"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist";
import type { Painting } from "@/types";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  painting: Painting;
  className?: string;
}

export function WishlistButton({ painting, className }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const active = isInWishlist(painting.slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(painting);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "w-8 h-8 rounded-full bg-white/95 hover:bg-white shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90",
        active ? "text-red-500 fill-red-500" : "text-gray-700 hover:text-black",
        className
      )}
    >
      <Heart className={cn("w-4 h-4", active && "fill-current")} />
    </button>
  );
}