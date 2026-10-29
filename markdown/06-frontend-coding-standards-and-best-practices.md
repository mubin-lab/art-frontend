# 06 - Frontend Coding Standards & Agent Best Practices

This document establishes the coding conventions, TypeScript standards, and step-by-step implementation procedures for developers and AI agents working on the frontend codebase.

---

## 1. TypeScript Strictness & Type Safety

1. **Import Types from Central Store**:
   Always import domain entities from `@/types`:
   ```ts
   import type { Painting, Artist, Order, OrderStatus } from "@/types";
   ```
2. **Strict Props Interfaces**:
   Every component must explicitly declare its prop types. Never use untyped `props` or generic `any`:
   ```tsx
   interface ProductCardProps {
     painting: Painting;
     priority?: boolean;
     onQuickView?: (id: string) => void;
   }

   export function ProductCard({ painting, priority = false, onQuickView }: ProductCardProps) {
     // ...
   }
   ```
3. **Always Validate Builds**:
   Before completing any task, run TypeScript verification in WSL:
   ```bash
   cd /home/mubin/betopia/personal/personal/art-web/frontend
   npx tsc --noEmit
   ```

---

## 2. Client vs Server Component Boundaries

1. **Keep Pages as Server Components**:
   - Storefront pages (`src/app/**/page.tsx`) should remain Server Components to allow fast server-side HTML streaming and optimal SEO.
   - Fetch data at the page level and pass it down as props to client sections.
2. **Isolate `"use client"` to Interactive Leaves**:
   - Only add `"use client"` to components that consume React hooks (`useState`, `useEffect`), browser events (`onClick`, `onScroll`), or Zustand stores (`useCartStore`, `useWishlistStore`).
3. **Prevent Hydration Mismatches**:
   - Any UI element reading `localStorage` (cart badge count, active currency) MUST be rendered after mounting (`useEffect`).

---

## 3. Next.js Image Optimization (`next/image`)

All image displays must use Next.js `<Image />` for automatic WebP conversion and responsive sizing:

```tsx
import Image from "next/image";

// When parent has a fixed aspect ratio container:
<div className="relative aspect-[3/4] w-full overflow-hidden rounded bg-[#eae7e1]">
  <Image
    src={painting.image}
    alt={painting.title}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    className="object-cover transition-transform duration-500 group-hover:scale-105"
    priority={priority}
  />
</div>
```

- Allowed remote image hosts are whitelisted in `next.config.ts`:
  - `upload.wikimedia.org`
  - `images.unsplash.com`
  - `plus.unsplash.com`

---

## 4. Navigation & Link Standards

- Always use `next/link` for internal page transitions:
  ```tsx
  import Link from "next/link";
  
  <Link href={`/painting/${painting.slug}`} className="hover:underline">
    {painting.title}
  </Link>
  ```
- Use `paintingUrl.ts` utility when constructing URLs to ensure consistency:
  ```ts
  import { getPaintingUrl } from "@/lib/utils/paintingUrl";
  const url = getPaintingUrl(painting); // e.g. /painting/the-starry-night-10001
  ```

---

## 5. Step-by-Step Feature Implementation Protocol for AI Agents

Whenever implementing or modifying a frontend feature, strictly follow these 5 steps:

1. **Step 1 - Review Domain Types**:
   Check `src/types/index.ts` to verify data properties. If adding new fields, update the interface first.
2. **Step 2 - Check Design Tokens**:
   Refer to `02-frontend-design-system-and-tokens.md` and `src/app/globals.css`. Never introduce arbitrary raw colors (e.g. `bg-red-500` or `text-blue-600`); always use tokenized classes (`bg-[#c83838]`, `text-ink`).
3. **Step 3 - Verify Business Constraints**:
   Refer to `04-frontend-business-rules-and-constraints.md`. Ensure pricing is formatted in BDT (৳), dimensions display in Feet/cm, and no false "oil painting" claims are made.
4. **Step 4 - Build & Test Component**:
   Write the component under `src/components/`, ensuring small modular subcomponents.
5. **Step 5 - Run Typecheck**:
   Execute `npx tsc --noEmit`. Ensure 0 errors before reporting completion.
