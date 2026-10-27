"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Painting } from "@/types";

interface WishlistStore {
  items: Painting[];
  toggleWishlist: (painting: Painting) => void;
  isInWishlist: (slug: string) => boolean;
  removeItem: (slug: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (painting) => {
        set((state) => {
          const exists = state.items.some((i) => i.slug === painting.slug);
          if (exists) {
            return { items: state.items.filter((i) => i.slug !== painting.slug) };
          }
          return { items: [...state.items, painting] };
        });
      },
      isInWishlist: (slug) => get().items.some((i) => i.slug === slug),
      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((i) => i.slug !== slug),
        })),
    }),
    {
      name: "yourmuseum-wishlist",
    }
  )
);