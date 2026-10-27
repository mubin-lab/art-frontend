# AGENT INSTRUCTIONS: Next.js Art-Reproduction Store (ByMuseum-style)

You are building a production-quality Next.js storefront + art-editorial site from scratch.
The design reference is a screen recording of the original site (oil-painting reproduction store with an
"Art Guide" editorial section). Match **layout, spacing, typography and colour** as closely as possible.

> Rules
> 1. Everything is built from **small, reusable components**. Pages only compose sections; sections only compose components.
> 2. **No hard-coded content in components.** All data comes through the API layer (`/src/lib/api`). For now the API layer reads **fake JSON** from `/src/mocks`, but it must be swappable for a real REST API by changing one env variable.
> 3. Use your own brand name/logo placeholder ("YourMuseum") and royalty-free / public-domain images (e.g. Wikimedia Commons paintings, Unsplash room photos). Do not copy the original's logo, copy text or proprietary photography.
> 4. Pixel details below were sampled from a compressed video at a ~1918px-wide viewport. Treat them as a **strong starting point** and fine-tune side-by-side in DevTools.

---

## 1. Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14+ (App Router), TypeScript (strict) |
| Styling | Tailwind CSS + CSS variables for tokens (`globals.css`) |
| Fonts | `next/font/google`: **Playfair Display** (headings, product titles, quotes), **Jost** (body/UI). Weights: Playfair 400/500/600/italic 400; Jost 300/400/500/600 |
| Data fetching | Server Components + `fetch` through `/src/lib/api`; React Query only for client-side interactions (wishlist, cart) |
| State | Zustand (cart, wishlist, currency) persisted to localStorage |
| Carousels | Embla Carousel (`embla-carousel-react`) |
| Icons | `lucide-react` + a few custom SVGs in `/src/components/icons` |
| Forms | `react-hook-form` + `zod` |
| Images | `next/image`, remote patterns configured |
| Mock API | Next Route Handlers (`/src/app/api/**`) serving `/src/mocks/*.json` |
| Lint/format | ESLint, Prettier, Husky optional |

Env:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api   # switch to the real API later
```

---

## 2. Design tokens (put in `globals.css` and `tailwind.config.ts`)

### 2.1 Colours (sampled)
```css
:root {
  --color-ink:        #161616; /* top announcement bar, headings, primary text */
  --color-ink-soft:   #221e1f; /* dark buttons (search, Art Guide, pill buttons) */
  --color-btn-dark:   #181713; /* primary CTA */
  --color-footer-bg:  #1d1916; /* footer + dark sections (warm black) */
  --color-bg:         #f5f2ed; /* page background (warm cream) */
  --color-bg-strip:   #f3f1e8; /* utility strip under announcement bar */
  --color-surface:    #ffffff; /* header, cards, nav bar */
  --color-card-soft:  #f9f9f7; /* review card on cream */
  --color-gold:       #ceab51; /* gold CTA buttons ("Subscribe", "Own this masterpiece") */
  --color-gold-text:  #a8844a; /* gold eyebrows, quote rule, link accents (approx.; tune) */
  --color-muted:      #6b6560; /* secondary text */
  --color-border:     #e5e0d8; /* hairlines, FAQ dividers */
  --color-trust-green:#00b67a; /* Trustpilot stars */
  --color-footer-link:#d9d4c8; /* footer links on dark */
}
```

### 2.2 Typography (desktop 1918px reference, `rem` based)
| Token | Font | Size / line-height | Weight | Extra |
|---|---|---|---|---|
| `display-hero` (h1) | Playfair | 44px / 1.08 | 400-500 | colour ink |
| `h2-section` | Playfair | 38-40px / 1.15 | 500-600 | centered |
| `h3-article` | Playfair | 24px / 1.25 | 600 | |
| `card-title` | Playfair | 20px / 1.2 | 400 | |
| `pull-quote` | Playfair italic | 26-28px / 1.35 | 400 | gold left rule 2px |
| `eyebrow` | Jost | 11px / 1 | 600 | uppercase, tracking .2em, gold-text |
| `body` | Jost | 15-16px / 1.6 | 400 | |
| `body-sm` | Jost | 13px / 1.5 | 400 | muted |
| `nav` | Jost (or Inter) | 12px | 600 | uppercase, tracking .12em |
| `button` | Jost | 12-13px | 600 | uppercase for small pills, tracking .1em; sentence case for hero buttons |
| `utility` | Jost | 10-11px | 400 | uppercase, tracking .06em, muted |

### 2.3 Shape, spacing, effects
- Buttons: fully rounded pills (`rounded-full`), height 44-52px (hero) / 36-40px (card, section).
- Cards: `rounded-2xl` (16-20px), white, soft shadow `0 10px 30px rgba(0,0,0,.08)`.
- Big media panels (hero slideshow, dark review slider): `rounded-3xl` (~28px).
- Max content width: `1280px` for most sections, hero container ~`1250px`; article reading column ~`680px` with a 220px right sidebar.
- Section vertical padding: 72-96px desktop, 48px mobile.
- Breakpoints: 640 / 768 / 1024 / 1280. Mobile: nav collapses to drawer, carousels become swipeable, footer columns stack.

---

## 3. Project structure

```
src/
  app/
    layout.tsx                      # fonts, <Header/>, <Footer/>, providers
    page.tsx                        # Home
    shop/page.tsx
    painting/[slug]/page.tsx        # product detail (choose size & frame)
    artists/page.tsx
    artists/[slug]/page.tsx
    art-movements/[slug]/page.tsx
    collections/[slug]/page.tsx
    photo-to-painting/page.tsx
    art-guide/page.tsx
    art-guide/[artist]/[painting]/page.tsx   # long-form article (Starry Night style)
    audio-stories/page.tsx
    cart/page.tsx  wishlist/page.tsx  account/page.tsx  contact/page.tsx
    api/                            # mock route handlers (see §5)
  components/
    ui/            Button, IconButton, Badge, Eyebrow, SectionHeading, Rating, Price,
                   Accordion, Chip, Input, Carousel, ProgressBars, Tabs, Breadcrumb
    layout/        AnnouncementBar, UtilityStrip, Header, SearchBar, CurrencySelect,
                   HeaderActions, MainNav, MegaMenu, MobileDrawer, Footer, FooterColumn,
                   PaymentIcons, ScrollTopButton
    home/          HeroSection, HeroCopy, TrustpilotQuote, TrustBullets, HeroSlideshow,
                   PopularLinks, BestsellersSection, ShopTheLookSection,
                   FamousPaintingsSection, ReviewSlider, AudioStoriesSection,
                   SamplesCompareSection, WhyChooseSection, ArtistsRow,
                   NewsletterSection, PhotoToPaintingSection, BeforeAfterSlider,
                   TrustStrip, SeoFaqSection
    product/       ProductCard, ProductCarousel, AudioBadge, WishlistButton,
                   PriceBlock, SizeFramePicker, FrameSwatches
    article/       ArticleHeader, ArticleTabs, ArticleMeta, ArticleActions, ArticleBody,
                   ArticleTOC, PaintingDetailsCard, SeriesList, PullQuote, ArticleFigure,
                   InlineBuyCard, SamplesPromo, AuthorCard, ReadingProgress, FloatingActions
  lib/
    api/           client.ts, paintings.ts, artists.ts, home.ts, articles.ts, reviews.ts, ...
    utils/         cn.ts, formatPrice.ts, slugify.ts
    store/         cart.ts, wishlist.ts, currency.ts
  mocks/           *.json (see §5)
  types/           domain types (Painting, Artist, Review, ...)
public/images/     placeholders
```

Naming: one component per file, `PascalCase.tsx`, co-located `index.ts` barrels per folder. Components receive **props only**; data fetching happens in the page/section server component.

---

## 4. Global layout (every page)

### 4.1 `AnnouncementBar`
- Full-width, bg `--color-ink`, height ~40px, centered text in gold (`#c9a96a`-ish, 13px): "Sales: +1 (646) 296-0579".
- Data: `siteConfig.announcements[]` (rotating, optional).

### 4.2 `UtilityStrip`
- bg `--color-bg-strip`, height ~40px, container max-width 1280.
- Left: text links `ABOUT US · MY ACCOUNT · WISHLIST · TRACK MY ORDER` (utility style, dot separators).
- Right: social icons (Facebook, X, Instagram, Pinterest, YouTube), 12px, muted.

### 4.3 `Header` (white, height ~110px)
- Left: logo (icon box + wordmark in Playfair ~30px + tagline "Masterpieces Recreated by Hand" in 11px serif).
- Center: `SearchBar`, pill input (height 46px, 1px border `#d9d5cc`), placeholder "What are you looking for?", attached dark "SEARCH" button on the right, rounded-r-full. Autosuggest dropdown (paintings + artists) from `/api/search?q=`.
- Right: `CurrencySelect` ("USD ⌄"), account icon, wishlist heart with count badge, cart bag with count badge.

### 4.4 `MainNav` (white, hairline top border, height ~66px)
- Left: **Art Guide** dark block button (bg ink-soft, white, 12px bold uppercase, with `···` icon and chevron), width ~300px, flush with container left edge.
- Items (uppercase nav style, chevron on dropdowns): `ARTISTS ⌄`, `ART MOVEMENTS ⌄`, `COLLECTIONS ⌄`, `PHOTO TO PAINTING` (small gold dot badge at top-right), `SHOP`, `CONTACT US`.
- Each dropdown opens a `MegaMenu` populated from `/api/navigation`.
- Sticky behaviour: on scroll the nav bar sticks; the announcement + utility + header scroll away.

### 4.5 `Footer`
- bg `--color-footer-bg`, top padding ~64px, 5 columns (grid `1.3fr 1fr 1fr 1fr 1fr`).
- Col 1: white logo, description (white 15px, 3 lines), `EMAIL` label (gold-ish 10px caps) + value, `PHONE` label + value, `FOLLOW US` gold caps + icons (Instagram, Facebook, YouTube, Pinterest, TikTok).
- Cols 2-5: gold caps headings (`SHOP`, `HELP`, `YOURMUSEUM`, `ARTISTS`), links in `--color-footer-link` 14px with 14px vertical gap.
- Bottom bar (hairline top border `rgba(255,255,255,.08)`): left copyright + "Powered by …", middle links `Terms · Privacy · Copyright`, right `SECURE PAYMENTS` caps label + payment badge icons (PayPal, Visa, Mastercard, Maestro, Amex).
- Floating `ScrollTopButton` (round, white, bottom-right, appears after 400px scroll).

---

## 5. Mock API layer

All reads go through `src/lib/api/client.ts`:
```ts
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 60 }, ...init });
  if (!res.ok) throw new Error(`API ${res.status} ${path}`);
  return res.json();
}
```
Route handlers in `src/app/api/**/route.ts` simply `return NextResponse.json(require('@/mocks/x.json'))` with optional filtering. Add artificial 150-300ms delay in dev to exercise loading states (`loading.tsx` skeletons for every route).

### Endpoints → mock files
| Endpoint | Mock file | Used by |
|---|---|---|
| `GET /api/site-config` | `site-config.json` | AnnouncementBar, UtilityStrip, Footer, contact info |
| `GET /api/navigation` | `navigation.json` | MainNav, MegaMenu, Footer columns |
| `GET /api/home` | `home.json` | all home sections (hero slides, trust bullets, strip, FAQ, why-choose items, newsletter) |
| `GET /api/paintings?bestseller=true&limit=12` | `paintings.json` | ProductCarousel |
| `GET /api/paintings/:slug` | `paintings.json` | product page |
| `GET /api/paintings/top100` | `paintings.json` | FamousPaintingsSection |
| `GET /api/artists` / `:slug` | `artists.json` | ArtistsRow, artist pages |
| `GET /api/reviews?featured=true` | `reviews.json` | TrustpilotQuote, ReviewSlider |
| `GET /api/audio-stories` | `audio-stories.json` | AudioStoriesSection |
| `GET /api/rooms` | `rooms.json` | ShopTheLookSection |
| `GET /api/samples` | `samples.json` | SamplesCompareSection |
| `GET /api/photo-to-painting` | `photo-to-painting.json` | BeforeAfterSlider |
| `GET /api/articles/:slug` | `articles.json` | article page |
| `POST /api/newsletter` | n/a (returns 200) | NewsletterSection |
| `GET /api/search?q=` | derived | SearchBar |

### Core types (`src/types`)
```ts
type Painting = {
  id: string; slug: string; title: string; artistSlug: string; artistName: string;
  movement: string;            // eyebrow, e.g. "Post-Impressionism"
  image: string; year: string; medium: string; location: string; dimensions: string;
  priceFrom: number; priceWas?: number; currency: 'USD';
  hasAudio?: boolean; audioIcon?: 'play'|'headphones'|'book';
  frames: { id: string; name: 'Gold'|'Silver white'|'Silver'; swatch: string }[];
  sizes: { id: string; label: string; price: number }[];
};
type Artist = { slug: string; name: string; avatar: string; artworkCount: number; bio?: string };
type Review = { id: string; author: string; rating: 1|2|3|4|5; text: string; source: 'Trustpilot';
                paintingSlug?: string; frameLabel?: string; photographer?: string };
type HeroSlide = { id: string; tag: string; linkLabel: string; linkHref: string; image: string;
                   product: { title: string; priceFrom: number; priceWas: number; artist: string; thumb: string; href: string } };
type Article = { slug: string; title: string; artist: string; date: string; medium: string; dimensions: string;
                 location: string; movement: string; toc: {id:string;label:string}[];
                 blocks: Array<{type:'h2'|'p'|'quote'|'figure'|'cta'|'divider'; ...}>;
                 series: {title:string; date:string; thumb:string; href:string}[]; author: {name:string; role:string; bio:string} };
```
Seed at least: 24 paintings, 8 artists, 5 reviews, 6 audio stories, 3 rooms, 3 samples, 3 before/after pairs, 1 full article (Starry Night-style, 7 sections), nav with 8-10 items per dropdown.

---

## 6. Home page, section by section (in order)

### 6.1 `HeroSection` (bg cream, container ~1250px, 2 columns: copy ~36%, slideshow ~64%)
**Left (`HeroCopy`)**
- h1 "Hand-Painted Oil Painting Reproductions" (display-hero, 3 lines, left aligned).
- Sub: "Real oil paintings, painted by hand in your size." (15px, muted, "oil paintings" and "by hand" underlined/gold).
- Button 1 `Button variant=primary size=lg` full column width, "Shop paintings".
- Button 2 `variant=outline` (transparent, 1px border `#d6d2c9`), "Turn your photo into a painting".
- `TrustpilotQuote` card: bg `--color-card-soft`, `rounded-xl`, 3px left border tan, 5 green star squares, Playfair italic 15px quote, "Laura, on Trustpilot" 12px (Trustpilot underlined).
- `TrustBullets`: 3 inline items with check icon: "Free shipping", "90-day guarantee", "Real studio photos" (13px).

**Right (`HeroSlideshow`)**
- `rounded-3xl` image panel, aspect ~ 1.13:1 (≈ 810×500), full-bleed photo, dark gradient overlay.
- Top: segmented `ProgressBars` (5 white 3px bars, active one animates 0→100% over 6s, autoplay with pause on hover).
- Top-left: pill tag (translucent dark, white caps 11px, e.g. "FOR HALLOWEEN") + underlined white link below ("The Haunted Gallery →").
- Bottom-left: white `rounded-2xl` product pill: 44px thumb, title (Playfair 15px), "From **$299** ~~$599~~ · Artist", black "Shop" pill button.
- Bottom-right: "OWN IT." white bold caps 14px.
- Data: `home.heroSlides[]`.

### 6.2 `PopularLinks`
Small line under hero: "Popular: Van Gogh, Monet, Klimt, Da Vinci, Impressionism, Top 100 famous paintings" (12px muted, links).

### 6.3 `BestsellersSection`
- `SectionHeading` (eyebrow `BESTSELLERS` gold, h2 "Popular Oil Painting Reproductions", sub "Our best-sellers, hand-painted to order.", dark pill button "VIEW ALL PAINTINGS →").
- `ProductCarousel` (Embla, 6 visible desktop, 2.3 mobile, free-drag, prev/next circular buttons appear on hover, hovered card lifts -6px and its image scales 1.03).
- `ProductCard` (white `rounded-2xl`, shadow, width ~190px):
  - Image area ~250px high on a **blurred, darkened copy of the painting as background** (`blur(18px) brightness(.7) scale(1.2)`), the painting centred with contain-fit, small drop shadow.
  - Top-right white round heart `WishlistButton`; bottom-left small round black badge icon (`play` / `headphones` / `book`) = audio story indicator.
  - Eyebrow movement (gold 10px caps), artist (12px muted), title (Playfair 20px), price row "From **$299** ~~$599~~" (bold 15px + 11px line-through muted), full-width black pill "CHOOSE SIZE & FRAME ›" (11px caps, height 36px).

### 6.4 `ShopTheLookSection`
- Eyebrow `SHOP THE LOOK`, heading "Visualise it in your room" (use your own words).
- Large white `rounded-2xl` bordered card: left half = lifestyle room photo (green sofa, framed gallery wall) with hotspots; right half = dark product mini-card that updates with the active hotspot (movement caps, artist, title, "From $299", cream "CHOOSE SIZE & FRAME ›" button) and 3 pagination dots. Circular prev/next arrows overlap the left & right edges.
- Data: `rooms[]` each with image + hotspots `{x,y,paintingSlug}`.

### 6.5 `FamousPaintingsSection`
- Eyebrow `THE RANKED MASTERPIECE`, h2 "Explore the 100 Most Famous Paintings", sub "The most famous paintings, ranked.", dark pill "VIEW FULL RANKING →".
- `ReviewSlider` panel (bg `#201c1d`, `rounded-3xl`, height ~270px): left = 5 green stars, Playfair 22px white quote, author (bold 12px) + "Product review · Trustpilot · Excerpt" (10px muted); right = framed painting preview (gold frame, drop shadow) with caption "The Magic Circle / Gold & black frame preview / Studio photograph: …". Bottom bar: hairline, "Selected review excerpts. Studio photos of the featured paintings." and `‹ 1/5 ›` pager.

### 6.6 `SamplesCompareSection`
- Eyebrow `REPRODUCTION SAMPLES`, h2 "See a real canvas next to the original".
- Side by side: two gold-framed paintings with white pill labels `THE ORIGINAL` / `OUR CANVAS`, soft shadow below; carousel across 3 samples.

### 6.7 `AudioStoriesSection` (bg cream)
- Eyebrow `YOURMUSEUM AUDIO STORIES`, h2 "Listen to the Story Behind the Painting", sub "Every painting story, read aloud.", dark pill "BROWSE ALL AUDIO →".
- Carousel of large cards (~265×260, `rounded-2xl`, blurred-painting background like ProductCard, painting centred, black round play button bottom-left). Click plays/pauses an `<audio>` (mock mp3), with a mini sticky player bar.

### 6.8 `WhyChooseSection` (dark, 2 columns, full-bleed)
- Left (bg `#1d1916`): eyebrow `OUR PROMISE` gold, h2 white "Why Choose YourMuseum?", 4 rows each = 56px white line-icon (palette, eye, frame, painter) + bold white 16px title + 13px muted-light description:
  1. 100% Hand-Painted Oil on Canvas
  2. Museum Quality
  3. Faithful to the Original
  4. Master Artists Behind Every Piece
- Right: full-height photo of a painter holding a palette; a large white organic "paint blob" shape overlaps the bottom edge between the columns (SVG).

### 6.9 `ArtistsRow`
- Heading "Artists" (eyebrow + h2), horizontal row of 6+ round avatars (~120px, thin border), name (13px bold) and `407 ARTWORKS` (10px caps muted). Links to `/artists/[slug]`.

### 6.10 `NewsletterSection` (dark `#1d1a1c`, height ~370px, centred)
- Background: 7-8 small floating framed painting thumbnails positioned absolutely at edges, slowly drifting (CSS keyframes, 12-20s).
- Content: h3 "New Art, Stories & Offers" (Playfair 26px white), sub (12px muted), label "I am a… (select all that apply)", 3 chip checkboxes (`Art Lover`, `Collector`, `Interior Designer`) as dark rounded pills with radio dot, email pill input (dark, border `#3a3536`) + gold `SUBSCRIBE` pill button (`#ceab51`, dark text). POST to `/api/newsletter`, success toast.

### 6.11 `PhotoToPaintingSection`
- Eyebrow `PHOTO TO PAINTING`, h2 "Custom Portraits From Your Photos", sub "Your photo, hand-painted in oil.", row of 3 icon+text perks ("100% hand-painted, no prints, no filters", "Starting from $249, any subject or size", "Free worldwide shipping, fully tracked"), dark pill "CREATE YOUR CUSTOM PAINTING →".
- `BeforeAfterSlider` carousel: 3 tall cards (~360×430, `rounded-2xl`), each with a draggable vertical divider (white 1px line + dark circular handle with `‹›`), labels `ORIGINAL PHOTO` (bottom-left) and `OUR PAINTING` (bottom-right) in white caps 10px. Slider value controlled by pointer events + keyboard arrows (a11y). Dots below.

### 6.12 `TrustStrip`
One row, 4 items, each a coloured mini-illustration icon + 15px label: Free Worldwide Shipping · 90-Day Money-Back Guarantee · Hand-Painted by Artists · Unlimited Revisions. Top/bottom spacing 40px, bg white.

### 6.13 `SeoFaqSection` (cream, centred narrow column ~650px)
- Eyebrow `OIL PAINTING REPRODUCTIONS`, h2 "Hand-painted oil painting reproductions of famous paintings", 2 small paragraphs (13px, with gold inline links), then `Accordion` (5 items: Playfair 16px question, `+` gold icon right, hairline separators, rotates to `−` when open), then dark pill "SHOP ALL REPRODUCTIONS →".
- JSON-LD `FAQPage` schema from the same data.

---

## 7. Art Guide article page (`/art-guide/[artist]/[painting]`)

Layout (desktop): top region is full header; then breadcrumb; then 4-tab strip; then title; then 2-column body (article column ~680px, sticky sidebar ~230px).

- `Breadcrumb`: `Home / Painting Analysis / The Starry Night by Van Gogh: …` (12px muted).
- `ArticleTabs`: 4 equal tabs in one rounded bordered strip (bg `#efede6`, active tab white): each tab has gold caps micro-label (`ART GUIDE`, `ARTIST`, `PAINTING`, `SHOP`) over a 11px text.
- `ArticleHeader`: eyebrow "VINCENT VAN GOGH · POST-IMPRESSIONISM", h1 Playfair 38px, line "June 1889 · Oil on canvas · Museum of Modern Art, New York".
- `ArticleMeta` (grid row of 5 facts: Artist, Date, Medium, Dimensions, Location, Movement; label gold caps 9px, value 12px).
- `ArticleActions`: three outline pills `♡ 1`, `Save`, `Share`.
- "EXPLORE THE ARTIST" small block: 24px avatar + gold caps label + underlined artist link.
- `ArticleBody` renders `blocks[]`: `h2` (Playfair 22px, bold), paragraphs (14-15px/1.75, ink), `PullQuote` (gold left rule, Playfair italic 26px, caps attribution 10px gold), `ArticleFigure` (centred image, 11px muted centred caption), hairline `divider` between major sections.
- Sidebar (sticky top 24px): `ArticleTOC` "IN THIS ARTICLE" with numbered items `01 …` (active item highlighted via IntersectionObserver), `PaintingDetailsCard` (Year / Medium / Location rows), `SeriesList` "OTHER PAINTINGS IN SERIES" (thumb + title + date).
- `InlineBuyCard` (dark `rounded-2xl`): left framed painting thumb, "OWN IT." tag top-right, Playfair 20px white title "The Starry Night, painted by hand", subtitle muted, price `$299.00` bold 28px + strikethrough + gold "50% off" chip, 3 `FrameSwatches` (Gold / Silver white / Silver), gold full-width button "Own this masterpiece", link "See sizes and frames", benefits row with 3 small icons (Painted by hand in oil / Free shipping worldwide / 90-day guarantee), and nested `SamplesPromo` panel ("REAL PAINTINGS, REAL BRUSHWORK / See what arrives at your door / BROWSE ALL SAMPLES →").
- Closing: "Enjoyed this story?" row with like/save/share, `AuthorCard` (bg cream, avatar initials "BM", "Editorial" name, gold caps role, 11px bio).
- `ReadingProgress`: 3px pink/gold bar fixed at top of viewport driven by scroll.
- `FloatingActions`: two round white buttons bottom-right (bookmark, back-to-top).
- SEO: `generateMetadata`, `Article` JSON-LD, OG image.

---

## 8. Other pages (build after Home + Article)

| Page | Notes |
|---|---|
| `/shop` | Filter sidebar (artist, movement, collection, price, size), sort, paginated grid of `ProductCard` (4-up) |
| `/painting/[slug]` | Gallery, `SizeFramePicker` (size select + frame swatches with live price), add-to-cart, wishlist, accordion for details/shipping, related paintings carousel |
| `/artists`, `/artists/[slug]` | A-Z index; artist hero + paintings grid |
| `/art-movements/[slug]`, `/collections/[slug]` | Hero with description + paintings grid |
| `/photo-to-painting` | Upload form (drag/drop, preview), style/size options, price calc, mock submit |
| `/audio-stories` | Grid of audio cards + persistent mini-player |
| `/cart`, `/wishlist`, `/account`, `/contact` | Standard e-commerce pages with mock data |

---

## 9. Behaviour & quality requirements

- **Responsive**: verify at 375, 768, 1024, 1280, 1918. Mobile header = logo + icons + hamburger; search drops below; hero stacks (copy → slideshow); product carousel shows 2.3 cards; footer columns stack with accordions.
- **Accessibility**: semantic landmarks, focus-visible rings (2px gold), carousels with `aria-roledescription`, accordion with proper `aria-expanded`, slider handle `role="slider"`, `prefers-reduced-motion` disables autoplay/drift animations, colour contrast AA for text.
- **Performance**: `next/image` with `sizes`, LCP image (`priority`) for hero slide 1, lazy-load below the fold, no layout shift (reserve aspect ratios), fonts with `display: swap`.
- **SEO**: metadata per page, `sitemap.ts`, `robots.ts`, JSON-LD (Organization, Product, FAQPage, Article, BreadcrumbList).
- **States**: every data component has loading skeleton, empty state, error boundary.
- **Testing**: Vitest + React Testing Library for ProductCard, Accordion, BeforeAfterSlider, SizeFramePicker; Playwright smoke test for Home and Article.

---

## 10. Build order (follow strictly, commit after each step)

1. Scaffold Next.js + Tailwind + fonts + tokens + `cn` util.
2. `ui/` primitives (Button, Eyebrow, SectionHeading, Price, Accordion, Carousel, Chip, Rating).
3. Mock JSON files + route handlers + `lib/api` + types.
4. Global layout: AnnouncementBar, UtilityStrip, Header, MainNav (+MegaMenu, mobile drawer), Footer.
5. Home sections 6.1 → 6.13, one at a time, each verified against the reference side-by-side.
6. Article page (§7).
7. Shop, product detail, artist/movement/collection pages.
8. Photo-to-painting, audio stories, cart/wishlist/account/contact.
9. Polish: a11y, performance, SEO, tests, README.

## 11. Definition of done
- Home and Article pages visually match the reference (spacing, font sizes, colours, radii) at 1918px and are fully responsive.
- Zero hard-coded product/review/nav content in components; everything flows from `/src/lib/api`.
- Switching `NEXT_PUBLIC_API_BASE_URL` to a real backend requires **no component changes**.
- `npm run build`, `npm run lint`, `npm run test` all pass.