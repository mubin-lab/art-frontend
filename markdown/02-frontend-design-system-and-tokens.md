# 02 - Frontend Design System & Tokens

This document details the typography, sampled color palette, CSS variables, and core UI component specifications for the **YourMuseum** platform.

---

## 1. Typography System

The site relies on two complementary Google Fonts loaded via `next/font/google`:

| Font Family | Usage | Weights | Class / Style |
|---|---|---|---|
| **Playfair Display** | Editorial headings, artwork titles, quotes, section titles | 400, 500, 600, Italic 400 | `font-serif` or `font-playfair` |
| **Jost** | Body text, UI labels, buttons, navigation, price tags | 300, 400, 500, 600 | `font-sans` or `font-jost` |

### Scale Conventions
- Hero Headline: `text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-ink`
- Section Heading: `text-2xl md:text-3xl font-serif font-medium text-ink`
- Eyebrow / Movement: `text-xs uppercase tracking-widest text-[#767676] font-medium`
- Product Card Title: `text-sm sm:text-base font-serif font-medium text-ink line-clamp-1`
- Price Tag: `text-base sm:text-lg font-sans font-semibold text-ink`
- Body Text: `text-sm md:text-base font-sans text-[#4a4a4a] leading-relaxed`

---

## 2. Color Palette & CSS Variables

Defined in `src/app/globals.css`:

```css
:root {
  /* Brand Inks & Backgrounds */
  --color-ink:          #161616; /* Top announcement bar, primary headings */
  --color-ink-soft:     #221e1f; /* Secondary dark elements, pill buttons */
  --color-btn-dark:     #181713; /* Primary CTA button */
  --color-footer-bg:    #1d1916; /* Warm black footer */
  --color-bg:           #f5f2ed; /* Warm cream page background */
  --color-bg-strip:     #f3f1e8; /* Utility strip below header */
  --color-surface:      #ffffff; /* Header, cards, modals */
  --color-card-soft:    #f9f9f7; /* Review cards on cream background */

  /* Accents & Highlights */
  --color-accent-gold:  #b38b4d; /* Gold accent badges, stars */
  --color-accent-red:   #c83838; /* Discount badges (-20% OFF) */
  --color-accent-green: #2d8a4e; /* Free delivery badges, stock indicators */
  --color-border:       #e5e0d8; /* Card & divider borders */
}
```

---

## 3. Frame Swatches & Color Codes

Every painting offers 3 standard museum-grade wooden frame options:

| Frame Name | Swatch Hex | Border Visual |
|---|---|---|
| **Gold** | `#d4af37` | Classic antique gold gilded finish |
| **Silver white** | `#f4f4f4` | Sleek Nordic off-white minimalist wooden frame |
| **Silver** | `#c0c0c0` | Brushed contemporary silver metallic frame |

---

## 4. Reusable Badges & Chips

### 1. Discount Badge
```tsx
<span className="bg-[#c83838] text-white text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase">
  {discountPercent}% OFF
</span>
```

### 2. Free Delivery Badge
```tsx
<span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2d8a4e] bg-[#eef7f1] px-2 py-0.5 rounded border border-[#c6e7d1]">
  <Truck className="w-3 h-3" /> Free Delivery
</span>
```

### 3. Bestseller / Top 100 Pill
```tsx
<span className="bg-ink text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">
  Top 100 #{rank}
</span>
```

---

## 5. Standard Component Styling

### Primary Button
```tsx
className="w-full bg-[#181713] hover:bg-black text-white font-medium py-3 px-6 rounded-md transition-all duration-200 text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm hover:shadow"
```

### Secondary Button
```tsx
className="w-full border border-ink/20 hover:border-ink bg-transparent hover:bg-white text-ink font-medium py-3 px-6 rounded-md transition-all duration-200 text-sm tracking-wider uppercase"
```
