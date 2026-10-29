# 01 - Frontend Architecture & Directory Structure

This document outlines the architectural blueprint, folder organization, and component hierarchy of the **YourMuseum** Next.js frontend storefront and admin panel.

---

## 1. Architectural Principles

1. **Separation of Concerns**:
   - **Pages (`src/app/**/page.tsx`)**: Only assemble high-level sections and layout wrappers. Never embed raw API calls or heavy business logic directly inside page JSX.
   - **Sections (`src/components/home/*`, `src/components/product/*`, etc.)**: Domain-focused compositions that group smaller UI components together.
   - **UI Components (`src/components/ui/*`)**: Pure, reusable presentation components (buttons, badges, modals, drawers, rating stars, inputs).
2. **Atomic Component Decomposition**:
   - Components must remain focused and single-purpose (< 250 lines). If a component exceeds this, break it down into sub-components.
3. **No Hard-Coded Business Data**:
   - Every product, price, artist name, review, and announcement must flow through the API layer (`src/lib/api/`).
4. **App Router Conventions**:
   - Use Server Components by default for fast initial page load and SEO.
   - Mark interactive components explicitly with `"use client"` at the very top of the file.

---

## 2. Directory Tree Blueprint

```
frontend/
├── public/                 # Static assets (fonts, icons, fallback images)
├── src/
│   ├── app/                # Next.js App Router (Layouts, Pages, Routes)
│   │   ├── (storefront)/   # Customer-facing storefront
│   │   │   ├── account/
│   │   │   ├── art-guide/
│   │   │   ├── art-movements/
│   │   │   ├── artists/
│   │   │   ├── audio-stories/
│   │   │   ├── cart/
│   │   │   ├── collections/
│   │   │   ├── contact/
│   │   │   ├── painting/   # Painting detail & story gallery
│   │   │   ├── photo-to-painting/
│   │   │   ├── shop/       # Filterable catalog
│   │   │   ├── wishlist/
│   │   │   ├── layout.tsx  # Root storefront layout (Header, Nav, Footer, Modals)
│   │   │   └── page.tsx    # Storefront Homepage
│   │   ├── admin/          # Dedicated Admin Dashboard
│   │   │   ├── artists/    # Manage artist profiles & biography
│   │   │   ├── marketing/  # Hero slides, banner announcements
│   │   │   ├── orders/     # Order tracking & status updates
│   │   │   ├── paintings/  # Artwork CRUD & custom pricing
│   │   │   │   ├── new/    # Add artwork wizard
│   │   │   │   └── [slug]/edit/
│   │   │   ├── settings/   # Hotline, emails, Dhaka delivery fees
│   │   │   ├── layout.tsx  # Sticky fixed sidebar admin layout
│   │   │   └── page.tsx    # Admin KPI dashboard
│   │   ├── globals.css     # CSS variable tokens and Tailwind imports
│   │   └── layout.tsx      # Root HTML layout with Google Fonts
│   ├── components/         # Reusable Component Library
│   │   ├── article/        # Editorial & art guide components
│   │   ├── home/           # Homepage sections (Hero, TrustStrip, CuratedThemes, WhyChoose, Feedbacks)
│   │   ├── icons/          # Custom SVG icon components
│   │   ├── layout/         # Header, NavigationBar, AnnouncementBar, MobileDrawer, Footer
│   │   ├── product/        # ProductCard, SizeFramePicker, CustomerFeedbackSlider, RoomPreview
│   │   └── ui/             # Primitives: Button, Badge, Modal, Price, Spinner
│   ├── lib/
│   │   ├── api/            # API abstraction layer (admin.ts, client.ts)
│   │   ├── store/          # Zustand state stores (cart, wishlist, currency)
│   │   └── utils/          # Helpers (formatPrice, paintingUrl, cn)
│   ├── mocks/              # Offline JSON mocks for local development fallback
│   └── types/              # TypeScript domain types & interfaces
├── .env.local              # Local environment variables
├── next.config.ts          # Image optimization & remote domain whitelist
├── tailwind.config.ts      # Tailwind design system mappings
└── tsconfig.json           # Strict TypeScript rules
```

---

## 3. Component Hierarchy Rules

1. **Pages**:
   ```tsx
   // app/painting/[slug]/page.tsx
   export default async function PaintingDetailPage({ params }: Props) {
     const painting = await getPainting(params.slug);
     return (
       <main className="min-h-screen bg-bg">
         <PaintingHeroSection painting={painting} />
         <SizeFramePickerSection painting={painting} />
         <CustomerFeedbackSlider feedbacks={painting.customerFeedbacks} />
         <RelatedPaintingsSection artistSlug={painting.artistSlug} />
       </main>
     );
   }
   ```
2. **Sections**:
   Sections coordinate child UI components, handle user selections, and trigger cart/wishlist store actions.
3. **UI Elements**:
   Elements accept pure props, emit events via callbacks (`onClick`, `onChange`), and never manipulate global store directly without passing through a section handler.

---

## 4. Layout Rules: Storefront vs Admin

- **Storefront Layout (`src/app/layout.tsx` + `src/components/layout/*`)**:
  - Top announcement bar with store hotline and promotional banner.
  - Sticky header containing search bar, currency selector, wishlist counter, and cart trigger button.
  - Category navigation mega-menu with dropdown columns.
  - Standard container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Admin Layout (`src/app/admin/layout.tsx`)**:
  - **STRICT REQUIREMENT**: The admin sidebar MUST be fixed/sticky (`sticky top-0 h-screen overflow-y-auto w-64`). It must NEVER scroll away when the admin content area is scrolled.
  - Content area occupies `flex-1 min-w-0 bg-[#f9fafb] p-6 lg:p-10`.
  - Admin navigation items display live pending order counters and active route highlights.
