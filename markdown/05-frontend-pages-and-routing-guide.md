# 05 - Frontend Pages & Routing Guide

This document provides a comprehensive route-by-route reference for all pages in the **YourMuseum** application.

---

## 1. Storefront Routes

### 1.1 Homepage (`/`)
- **Route File**: `src/app/page.tsx`
- **Sections Flow**:
  1. `AnnouncementBar`: Rotating promotional messages & hotline.
  2. `Header`: Search bar, currency toggle, cart & wishlist triggers.
  3. `NavigationBar`: Mega-menu categories (Artists, Movements, Collections).
  4. `HeroSlider`: Full-width canvas banner with primary CTA.
  5. `TrustStrip`: Features 4 core assurances (Museum-Quality Canvas, Solid Wood Frames, 90-Day Guarantee, Fast Dhaka Delivery).
  6. `BestsellersSection`: Carousel of top-selling canvas prints.
  7. `CuratedThemes`: Grid of room styles (Living Room, Office, Bedroom).
  8. `WhyChooseSection`: Value proposition and framing details.
  9. `CustomerFeedbackSection`: Real customer reviews with wall-mounted photos.
  10. `RoomPreviewSection`: Interactive visualizer of artworks in modern rooms.
  11. `FAQSection`: Frequently asked questions with accordion expanders.
  12. `Footer`: Newsletter signup, links, and copyright.

### 1.2 Catalog / Shop (`/shop`)
- **Route File**: `src/app/shop/page.tsx`
- **Features**:
  - Filter sidebar by **Art Movement** (Impressionism, Baroque, Renaissance, Modern).
  - Filter by **Orientation** (Horizontal, Vertical, Square).
  - Filter by **Bestsellers** & **Top 100 Masters**.
  - Sort by Price (Low to High, High to Low) and Popularity.
  - Responsive mobile filter drawer.

### 1.3 Painting Detail Page (`/painting/[slug]`)
- **Route File**: `src/app/painting/[slug]/page.tsx`
- **URL Parameter Parsing**: Uses `parsePaintingParam(slug)` from `src/lib/utils/paintingUrl.ts` to cleanly extract both numeric ID and text slug.
- **Components**:
  - `PaintingGallery`: High-resolution canvas viewer with zoom inspector.
  - `AudioGuidePlayer`: Optional spoken museum audio tour.
  - `SizeFramePicker`: Interactive selection of 4 size tiers and 3 frame swatches (Gold, Silver white, Silver) with live price updates.
  - `StoryGallery`: Visual breakdown of artwork details.
  - `CustomerFeedbackSlider`: Verified customer wall reviews.

### 1.4 Artwork Story Mode (`/painting/[slug]/story`)
- **Route File**: `src/app/painting/[slug]/story/page.tsx`
- **UI Requirement**: Text paragraphs alternate directly with corresponding close-up artwork images. All images have `rounded-xs` subtle corners and museum captions.

### 1.5 Artists (`/artists` & `/artists/[slug]`)
- **Route Files**: `src/app/artists/page.tsx` & `src/app/artists/[slug]/page.tsx`
- Lists world masters (Van Gogh, Monet, Klimt, Da Vinci) with portraits, movement affiliation, biography, and their complete artwork catalog.

### 1.6 Shopping Cart & Checkout (`/cart`)
- **Route File**: `src/app/cart/page.tsx` (and `CartDrawer.tsx` modal)
- Live Dhaka vs Outside Dhaka delivery selection.
- Subtotal, delivery fee, and grand total in BDT.
- Direct checkout button creating a real order in the backend.

---

## 2. Admin Panel Routes (`/admin/*`)

> [!IMPORTANT]
> The admin layout (`src/app/admin/layout.tsx`) features a **fixed sticky sidebar** (`sticky top-0 h-screen overflow-y-auto`). When updating admin views, never modify the sidebar's sticky positioning!

### 2.1 Admin Overview (`/admin`)
- Displays live KPI cards: **Total Revenue (৳ BDT)**, **Total Orders**, **Pending Orders**, **Total Artworks**.
- Recent orders table with live status badges.

### 2.2 Paintings Management (`/admin/paintings`)
- Data table listing all 24+ artworks.
- Search by title or artist.
- Direct actions: View, Edit (`/admin/paintings/[slug]/edit`), Delete.
- Create Button (`/admin/paintings/new`): Comprehensive form with image URL, title, movement, price, discount %, and descriptions.

### 2.3 Artists Management (`/admin/artists`)
- Add new artist profiles and manage existing ones.
- Live artwork counter updated relationally.

### 2.4 Orders Management (`/admin/orders`)
- Filter tabs: **All**, **Pending**, **Confirmed**, **Framing**, **Shipped**, **Delivered**, **Cancelled**.
- Status change action updating backend in real-time.
- Shows customer phone, address, and line items.

### 2.5 Marketing & Hero Slides (`/admin/marketing`)
- Manage hero slide banners, headline copy, and promotional links.

### 2.6 Store Settings (`/admin/settings`)
- Configure store phone hotline, email address, announcement bar banner texts.
- Configure Inside Dhaka Delivery Fee (৳70), Outside Dhaka Fee (৳120), and Free Delivery Threshold (৳15,000).
