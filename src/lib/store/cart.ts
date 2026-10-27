"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FrameOption, SizeOption, Painting } from "@/types";

export interface CartItem {
  id: string; // unique cart item id (painting slug + frame id + size id)
  painting: Painting;
  frame: FrameOption;
  size: SizeOption;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (painting: Painting, frame: FrameOption, size: SizeOption, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: () => number;
  subtotal: () => number;
  deliveryFee: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (painting, frame, size, quantity = 1) => {
        const id = `${painting.slug}-${frame.id}-${size.id}`;
        set((state) => {
          const existing = state.items.find((item) => item.id === id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + quantity } : item
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { id, painting, frame, size, quantity }],
            isOpen: true,
          };
        });
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id ? { ...item, quantity } : item
                ),
        })),
      clearCart: () => set({ items: [] }),
      totalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.size.price * item.quantity, 0),
      deliveryFee: () => {
        const items = get().items;
        if (items.length === 0) return 0;

        // Filter items that have delivery charge
        const paidItems = items.filter(
          (item) => item.painting.freeDelivery === false || (item.painting.deliveryFee !== undefined && item.painting.deliveryFee > 0)
        );

        // If all items have free delivery, charge is 0
        if (paidItems.length === 0) return 0;

        // If only 1 product has delivery charge, show that item's charge directly
        if (paidItems.length === 1) {
          const item = paidItems[0];
          return item.painting.deliveryFee !== undefined && item.painting.deliveryFee > 0
            ? item.painting.deliveryFee
            : 70;
        }

        // If multiple products have separate delivery charges, average them (sum / count)
        const totalSum = paidItems.reduce((acc, item) => {
          const fee =
            item.painting.deliveryFee !== undefined && item.painting.deliveryFee > 0
              ? item.painting.deliveryFee
              : 70;
          return acc + fee;
        }, 0);

        return totalSum / paidItems.length;
      },
    }),
    {
      name: "yourmuseum-cart",
    }
  )
);