# 03 - Frontend State Management & Data Flow

This document details client state management (Zustand), API communication layers, hydration safeguards, and data synchronizations.

---

## 1. Client State Architecture (Zustand)

Global client-side states reside in `src/lib/store/` using **Zustand** with the `persist` middleware (storing state in `localStorage`):

```
src/lib/store/
├── cart.ts         # Cart line items, quantities, frame & size selections
├── wishlist.ts     # Saved favorite artwork IDs
└── currency.ts     # Active currency (Default: BDT ৳) and conversion rates
```

### 1.1 Shopping Cart Store (`src/lib/store/cart.ts`)
- **Key**: `museum-cart` in `localStorage`
- **Actions**:
  - `addItem(item: CartItem)`: Adds item or increments quantity if matching `(paintingId, sizeId, frameId)`.
  - `removeItem(itemId: string)`: Removes single line item.
  - `updateQuantity(itemId: string, quantity: number)`: Updates item quantity (removes if <= 0).
  - `clearCart()`: Wipes cart upon checkout completion.
- **Computed Properties**:
  - `subtotal`: `items.reduce((acc, i) => acc + i.price * i.quantity, 0)`
  - `deliveryFee`: Computed dynamically based on customer destination (৳70 inside Dhaka, ৳120 outside Dhaka, or ৳0 if subtotal >= ৳15,000 threshold).
  - `total`: `subtotal + deliveryFee`

### 1.2 Wishlist Store (`src/lib/store/wishlist.ts`)
- **Key**: `museum-wishlist` in `localStorage`
- **Actions**:
  - `toggleWishlist(paintingId: string)`: Adds if absent, removes if present.
  - `isInWishlist(paintingId: string)`: Boolean check for heart icon state.

### 1.3 Currency Store (`src/lib/store/currency.ts`)
- **Key**: `museum-currency` in `localStorage`
- **Default Currency**: **`BDT` (৳ Bangladeshi Taka)**
- **Rules**:
  - Store prices are natively in BDT (৳).
  - When USD is chosen, amounts are calculated using the active conversion multiplier (e.g. 1 USD = 120 BDT).

---

## 2. Preventing SSR Hydration Mismatches

Because `localStorage` is not available on the server during initial HTML generation, directly reading Zustand store state in header badges can cause React Hydration Mismatches (Warning: Text content did not match).

### Standard Solution Pattern:
Always guard client-persisted counters with a mounted check:
```tsx
"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cart";

export function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const itemsCount = useCartStore((state) => state.items.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="opacity-0">0</span>;
  }

  return <span>{itemsCount}</span>;
}
```

---

## 3. API Communication Layer (`src/lib/api/`)

The application decouples UI components from backend endpoints using two dedicated clients:

### 3.1 Client API (`src/lib/api/client.ts`)
Used by the storefront. It features **Dual-Mode Graceful Fallback**:
1. Checks `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:5000/api`).
2. Attempts real HTTP fetch to the NestJS backend.
3. If the backend is temporarily unreachable or offline, it gracefully falls back to local JSON mocks in `src/mocks/` without crashing the customer page!

```ts
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const fullUrl = `${BASE}${path}`;
  try {
    const res = await fetch(fullUrl, { next: { revalidate: 60 }, ...init });
    if (res.ok) return res.json();
  } catch {
    // Graceful fallback to local mock data
  }
  return getLocalMock<T>(path);
}
```

### 3.2 Admin API (`src/lib/api/admin.ts`)
Used by `/admin/*`. Requires live data mutations:
- `getAdminPaintings()`: `GET /api/paintings`
- `createPainting(data)`: `POST /api/paintings`
- `updatePainting(slug, data)`: `PUT /api/paintings/:slug`
- `deletePainting(slug)`: `DELETE /api/paintings/:slug`
- `getOrders(status)`: `GET /api/orders?status=...`
- `updateOrderStatus(id, status)`: `PATCH /api/orders/:id`
- `getDashboardStats()`: `GET /api/dashboard/stats`
- `updateSiteConfig(data)`: `PUT /api/site-config`

---

## 4. Environment Variables

Set in `frontend/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```
