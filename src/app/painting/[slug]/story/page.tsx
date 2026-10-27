import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Palette,
  Frame,
  Award,
  CheckCircle2,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { getPaintingBySlug, getPaintings } from "@/lib/api";
import { getPaintingUrl } from "@/lib/utils/paintingUrl";
import { Price } from "@/components/ui/Price";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { InlineBuyCard } from "@/components/article/InlineBuyCard";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const painting = await getPaintingBySlug(slug);

  if (!painting) {
    return { title: "Artwork Story Not Found | YourMuseum" };
  }

  return {
    title: `The Story of ${painting.title} by ${painting.artistName} | History & Analysis`,
    description: `Discover the history, artistic technique, and meaning of ${painting.title} by ${painting.artistName}. Own a museum-grade framed canvas reproduction.`,
  };
}

export default async function PaintingStoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const painting = await getPaintingBySlug(slug);

  if (!painting) {
    notFound();
  }

  // Related paintings from the same movement or artist
  const allPaintings = await getPaintings({ limit: 12 });
  const related = allPaintings.filter((p) => p.slug !== painting.slug);

  // Paragraphs come directly from the painting object's descriptions array
  const paragraphs: string[] =
    painting.descriptions && painting.descriptions.length > 0
      ? painting.descriptions
      : painting.description
      ? [painting.description]
      : [
          `'${painting.title}' was created by ${painting.artistName} in ${painting.year}. Originally executed in ${painting.medium}, it remains one of the defining triumphs of the ${painting.movement} movement.`,
          `Today, the original masterpiece is preserved at ${painting.location}. Our studio creates museum-quality framed canvas reproductions, capturing every rich color nuance and brushstroke detail for your home.`,
        ];

  const purchaseUrl = getPaintingUrl(painting);

  return (
    <article className="min-h-screen bg-[var(--color-bg)] pb-24">
      {/* Top Breadcrumb & Return Bar */}
      <nav aria-label="Breadcrumb" className="border-b border-black/5 bg-white/60 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-[var(--color-muted)] font-sans overflow-hidden text-ellipsis whitespace-nowrap">
              <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-black/30 flex-shrink-0" />
              <Link href="/shop" className="hover:text-[var(--color-ink)] transition-colors">
                Paintings
              </Link>
              <ChevronRight className="w-3 h-3 text-black/30 flex-shrink-0" />
              <Link href={purchaseUrl} className="hover:text-[var(--color-ink)] transition-colors max-w-[150px] sm:max-w-xs truncate">
                {painting.title}
              </Link>
              <ChevronRight className="w-3 h-3 text-black/30 flex-shrink-0" />
              <span className="text-[var(--color-ink)] font-medium">Artwork Story</span>
            </div>

            {/* Back to Purchase Link */}
            {/* <Link
              href={purchaseUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b1917] hover:bg-[#2c2825] text-white font-sans text-xs font-medium transition-all shadow-sm hover:shadow"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#ceab51]" />
              <span>Back to Purchase Page & Frames</span>
            </Link> */}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Article Header */}
        <header className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece1] border border-[#a8844a]/20 text-[#8c672b] text-[11px] font-sans font-bold uppercase tracking-wider">
            <BookOpen className="w-3 h-3" />
            <span>Curatorial Essay · {painting.movement}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[var(--color-ink)] font-normal leading-[1.15] tracking-tight">
            The Story Behind <span className="italic">{painting.title}</span>
          </h1>

          <p className="font-sans text-sm sm:text-base text-[var(--color-muted)] max-w-2xl mx-auto">
            By{" "}
            <Link
              href={`/artists/${painting.artistSlug}`}
              className="text-[#a8844a] font-medium hover:underline"
            >
              {painting.artistName}
            </Link>{" "}
            · Executed in {painting.year} · Original in {painting.location}
          </p>
        </header>

        {/* Master Artwork Showcase Banner */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="relative rounded-2xl overflow-hidden bg-[#181614] p-4 sm:p-8 md:p-12 shadow-2xl border border-black/10">
            {/* Subtle Gallery Spotlight Effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.15) 0%, transparent 70%)",
              }}
            />

            <div className="relative mx-auto max-w-2xl flex flex-col items-center">
              {/* Framed Canvas Mockup */}
              <div className="relative p-3 sm:p-4 rounded-lg bg-gradient-to-br from-[#d4af37] via-[#a8844a] to-[#795a24] shadow-2xl border border-[#ffd700]/30">
                <div className="p-1 sm:p-1.5 bg-[#121110] rounded">
                  <div className="relative w-[280px] sm:w-[460px] md:w-[560px] aspect-[4/3] max-w-full overflow-hidden rounded-sm bg-neutral-900">
                    <Image
                      src={painting.image}
                      alt={painting.title}
                      fill
                      priority
                      className="object-contain"
                      sizes="(max-width: 768px) 90vw, 560px"
                    />
                  </div>
                </div>
              </div>

              {/* Museum Label Plaque */}
              <div className="mt-6 text-center text-xs text-white/70 font-serif italic space-y-1">
                <div className="text-white/90 font-medium not-italic tracking-wide">
                  {painting.title} ({painting.year})
                </div>
                <div>
                  {painting.medium} · Original: {painting.dimensions}
                </div>
                <div className="text-white/50 text-[11px]">
                  Preserved at {painting.location}
                </div>
              </div>

              {/* Fast Direct Return CTA in Hero */}
              <div className="mt-6 pt-5 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[11px] uppercase tracking-wider text-[#ceab51] font-sans font-bold block">
                    Own This Masterpiece on Canvas
                  </span>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                    <Price priceFrom={painting.priceFrom} size="sm" className="text-white" />
                    {/* <span className="text-[11px] text-white/60">· 100% Oil on Linen</span> */}
                  </div>
                </div>

                <Link
                  href={purchaseUrl}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[var(--color-gold)] hover:bg-[#b8953c] text-[var(--color-ink)] font-sans font-bold text-xs uppercase tracking-wider transition-colors shadow-md text-center"
                >
                  Choose Size & Frame →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns (Story Narrative + Sticky Purchase Widget) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Main Column: Story & Essay (Col 7) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Story Paragraphs Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-black/5">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-black/5 text-xs font-sans font-semibold text-[#a8844a] uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-[#a8844a]" />
                <span>The Narrative & Historical Context</span>
              </div>

              {/* Paragraphs rendered from painting.descriptions with inline images */}
              <div className="space-y-6 text-[#292524]">
                {paragraphs.map((para, index) => {
                  const inlineImg = painting.descriptionImage?.[index];
                  return (
                    <React.Fragment key={index}>
                      <p
                        className={`font-serif text-sm sm:text-lg leading-[1.8] text-[#292524] ${
                          index === 0
                            ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3.5 first-letter:leading-none first-letter:text-[#a8844a] first-letter:font-serif first-letter:pt-1"
                            : ""
                        }`}
                      >
                        {para}
                      </p>

                      {inlineImg && (
                        <div className="relative w-full aspect-16/10 sm:aspect-16/9 rounded-xs overflow-hidden bg-neutral-100 my-4 shadow-2xs">
                          <Image
                            src={inlineImg}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, 700px"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Decorative Curatorial Divider */}
              <div className="my-8 flex items-center justify-center gap-3 text-[#a8844a]/40">
                <span className="h-px w-16 bg-current" />
                <span className="text-xs">✦ ✦ ✦</span>
                <span className="h-px w-16 bg-current" />
              </div>

              {/* Return to Purchase Button inside article */}
              <div className="mt-8 p-6 rounded-xl bg-[#faf7f2] border border-[#e8dfd1] text-center space-y-3">
                <h3 className="font-serif text-xl text-[var(--color-ink)]">
                  Order Your Framed Canvas Masterpiece
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[var(--color-muted)] max-w-md mx-auto">
                  Bring the timeless soul of {painting.title} into your home. Beautifully printed on archival canvas and handcrafted in solid wood frames.
                </p>
                <div className="pt-2">
                  <Link
                    href={purchaseUrl}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-ink)] hover:bg-[#2c2825] text-white font-sans font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    <span>Return to Purchase Page & Size Options</span>
                    <ChevronRight className="w-4 h-4 text-[#ceab51]" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Museum Specifications & Curatorial Facts */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-black/5">
              <h2 className="font-serif text-xl sm:text-2xl text-[var(--color-ink)] mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#a8844a]" />
                <span>Artwork Specifications & Provenance</span>
              </h2>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs font-sans">
                <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-black/5">
                  <dt className="text-[var(--color-muted)] font-medium">Artist</dt>
                  <dd className="font-semibold text-[var(--color-ink)] mt-1 text-sm">
                    {painting.artistName}
                  </dd>
                </div>

                <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-black/5">
                  <dt className="text-[var(--color-muted)] font-medium">Art Movement</dt>
                  <dd className="font-semibold text-[var(--color-ink)] mt-1 text-sm">
                    {painting.movement}
                  </dd>
                </div>

                <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-black/5">
                  <dt className="text-[var(--color-muted)] font-medium">Creation Year</dt>
                  <dd className="font-semibold text-[var(--color-ink)] mt-1 text-sm">
                    {painting.year}
                  </dd>
                </div>

                <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-black/5">
                  <dt className="text-[var(--color-muted)] font-medium">Original Medium</dt>
                  <dd className="font-semibold text-[var(--color-ink)] mt-1 text-sm">
                    {painting.medium}
                  </dd>
                </div>

                <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-black/5">
                  <dt className="text-[var(--color-muted)] font-medium">Original Dimensions</dt>
                  <dd className="font-semibold text-[var(--color-ink)] mt-1 text-sm">
                    {painting.dimensions}
                  </dd>
                </div>

                <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-black/5">
                  <dt className="text-[var(--color-muted)] font-medium">Museum Location</dt>
                  <dd className="font-semibold text-[var(--color-ink)] mt-1 text-sm">
                    {painting.location}
                  </dd>
                </div>

                <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-black/5 sm:col-span-2">
                  <dt className="text-[var(--color-muted)] font-medium">Reproduction Technique</dt>
                  <dd className="font-semibold text-[var(--color-ink)] mt-1 text-sm">
                    Museum-Grade Archival Canvas Print Stretched on Solid Wood Frame
                  </dd>
                </div>
              </dl>
            </div>

{/* Why Our Framed Canvas Art Stands Out */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl text-[var(--color-ink)]">
                Our Reproduction Artistry
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#f0e7db] space-y-2">
                  <Palette className="w-5 h-5 text-[#a8844a]" />
                  <div className="font-bold text-xs uppercase tracking-wide text-[var(--color-ink)]">
                    Archival Canvas Art
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                    Printed with ultra-high-definition fade-resistant pigments on heavyweight woven textured canvas.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#f0e7db] space-y-2">
                  <Frame className="w-5 h-5 text-[#a8844a]" />
                  <div className="font-bold text-xs uppercase tracking-wide text-[var(--color-ink)]">
                    Solid Wood Framing
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                    Custom-crafted solid wood frames in Gold, Silver-White, and Classic Silver with hanging hardware.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#f0e7db] space-y-2">
                  <ShieldCheck className="w-5 h-5 text-[#a8844a]" />
                  <div className="font-bold text-xs uppercase tracking-wide text-[var(--color-ink)]">
                    90-Day Guarantee
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                    Preview photos sent for your approval before packing. 90-day 100% money-back guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar: Interactive Purchase & Return Box (Col 5) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
            {/* Interactive Buy Card */}
            <div className="bg-neutral-900 rounded-2xl shadow-xl border border-white/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#ceab51] block">
                    Order Framed Canvas Art
                  </span>
                  <h3 className="font-serif text-lg text-white font-normal truncate max-w-[220px]">
                    {painting.title}
                  </h3>
                </div>
                <Link
                  href={purchaseUrl}
                  className="text-xs text-[#ceab51] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <span>Full View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Inline Buy Card */}
              <InlineBuyCard painting={painting} />
            </div>

            {/* Quick Return to Painting Page Banner */}
            {/* <div className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e8dfd1] text-center space-y-2">
              <p className="text-xs text-[var(--color-muted)] font-sans">
                Prefer to view full-resolution closeups and frame switcher?
              </p>
              <Link
                href={purchaseUrl}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-[#a8844a] text-[#a8844a] hover:bg-[#a8844a] hover:text-white font-sans text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to {painting.title} Purchase Page</span>
              </Link>
            </div> */}
          </aside>
        </div>

        {/* Related Artworks Carousel */}
        {related.length > 0 && (
          <section className="mt-10 border-black/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#a8844a] font-sans block mb-1">
                  Discover More Masterpieces
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[var(--color-ink)]">
                  More Art from {painting.movement} & Master Painters
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-medium text-[#a8844a] hover:underline hidden sm:inline-flex items-center gap-1"
              >
                <span>Browse All Paintings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <ProductCarousel paintings={related} />
          </section>
        )}
      </div>

      {/* Mobile Floating Bottom Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#181614]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-neutral-800 border border-white/10">
              <Image
                src={painting.image}
                alt={painting.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-serif text-white truncate font-medium">
                {painting.title}
              </div>
              <Price priceFrom={painting.priceFrom} size="sm" className="text-white" />
            </div>
          </div>

          <Link
            href={purchaseUrl}
            className="flex-shrink-0 px-4 py-2 rounded-full bg-[var(--color-gold)] hover:bg-[#b8953c] text-[var(--color-ink)] font-sans font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            Buy Artwork →
          </Link>
        </div>
      </div>
    </article>
  );
}
