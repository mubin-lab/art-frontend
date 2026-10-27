import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPaintingBySlug, getPaintings } from "@/lib/api";
import { PaintingDetailView } from "@/components/product/PaintingDetailView";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { CustomerFeedbackSlider } from "@/components/product/CustomerFeedbackSlider";
import { Accordion } from "@/components/ui/Accordion";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface PaintingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PaintingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const painting = await getPaintingBySlug(slug);

  if (!painting) {
    return { title: "Painting Not Found | YourMuseum" };
  }

  return {
    title: `${painting.title} by ${painting.artistName} | Museum-Quality Framed Canvas Art`,
    description: `Own a museum-quality framed canvas reproduction of ${painting.title} by ${painting.artistName}. Handcrafted in your chosen size and solid wood frame with free delivery.`,
  };
}

export default async function PaintingDetailPage({ params }: PaintingPageProps) {
  const { slug } = await params;
  const painting = await getPaintingBySlug(slug);

  if (!painting) {
    notFound();
  }

  const allPaintings = await getPaintings({ limit: 12 });
  const related = allPaintings.filter((p) => p.slug !== painting.slug);

  const accordionItems = [
    {
      question: "About this Artwork & Historical Context",
      answer: `${painting.description || "A celebrated masterpiece from the artist's peak creative period."} Originally executed in ${painting.year} (${painting.medium}), the original now resides in ${painting.location}. Dimensions of the original: ${painting.dimensions}.`,
    },
    {
      question: "Canvas Printing & Handcrafted Framing",
      answer:
        "Every reproduction is printed using ultra-high-definition archival fade-resistant pigments on premium woven textured canvas. Our master framers then expertly stretch each canvas and handcraft solid wood museum frames in Gold, Silver-White, or Classic Silver with pre-installed hanging hardware.",
    },
    {
      question: "Custom Sizing & Museum Framing Options",
      answer:
        "Choose between our handcrafted Gold, Silver-White, and Classic Silver solid wood frames, or order rolled canvas unstretched for your local framer. We can also custom-scale to any non-standard wall dimension.",
    },
    {
      question: "Shipping, Preview Approval & 90-Day Guarantee",
      answer:
        "Before your painting is packed and shipped, we email you high-resolution studio photos of your finished canvas for approval. If you want any adjustments, your artist makes them free of charge. Arrives safely in custom reinforced wooden art crates with our 90-day money-back guarantee.",
    },
  ];

  return (
    <div className="bg-[var(--color-bg)] py-8 sm:py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--color-muted)] font-sans mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black">
            Shop Paintings
          </Link>
          <span>/</span>
          <Link
            href={`/artists/${painting.artistSlug}`}
            className="hover:text-black"
          >
            {painting.artistName}
          </Link>
          <span>/</span>
          <span className="text-[var(--color-ink)] font-semibold truncate">
            {painting.title}
          </span>
        </nav>

        {/* Interactive Live Framed View & Size/Frame Configurator */}
        <PaintingDetailView painting={painting}>
          <div className="space-y-6">
            {/* Customer Feedback Slider directly above FAQ */}
            {painting.customerFeedbacks && painting.customerFeedbacks.length > 0 && (
              <CustomerFeedbackSlider
                feedbacks={painting.customerFeedbacks}
              />
            )}

            {/* Artwork FAQs & Specifications Accordion */}
            <div className="pt-2 border-t border-[#e5e0d8]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] font-sans">
                  Frequently Asked Questions
                </span>
                <span className="text-[11px] text-[var(--color-muted)] font-sans">
                  Artwork & Delivery Specs
                </span>
              </div>
              <Accordion items={accordionItems} />
            </div>
          </div>
        </PaintingDetailView>

        {/* Related Paintings Carousel */}
        <div className="mt-20 pt-12 border-t border-[#e5e0d8]">
          <div className="text-center mb-8">
            <Eyebrow className="mb-2">CURATED SELECTION</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)]">
              You May Also Admire
            </h2>
          </div>
          <ProductCarousel paintings={related} />
        </div>
      </div>
    </div>
  );
}
