import React from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Accordion } from "@/components/ui/Accordion";
import type { HomeData } from "@/types";

interface SeoFaqSectionProps {
  faqs?: HomeData["faqs"];
}

export function SeoFaqSection({ faqs = [] }: SeoFaqSectionProps) {
  // Generate JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[var(--color-bg)]">
      {/* Injected FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-[650px] mx-auto px-4 sm:px-6 text-center">
        <Eyebrow className="mb-2">FRAMED CANVAS ART</Eyebrow>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] leading-snug">
          Museum-Quality Framed Canvas Art of Famous Paintings
        </h2>

        <div className="mt-4 space-y-3 text-xs sm:text-[13px] text-[var(--color-muted)] font-sans leading-relaxed text-left">
          <p>
            At YourMuseum, we recreate timeless fine art masterpieces using traditional 19th-century academic methods. From the emotional nightscapes of{" "}
            <Link href="/artists/vincent-van-gogh" className="text-[#a8844a] font-semibold underline">
              Vincent van Gogh
            </Link>{" "}
            to the luminous water gardens of{" "}
            <Link href="/artists/claude-monet" className="text-[#a8844a] font-semibold underline">
              Claude Monet
            </Link>{" "}
            and the radiant gold leaf portraits of{" "}
            <Link href="/artists/gustav-klimt" className="text-[#a8844a] font-semibold underline">
              Gustav Klimt
            </Link>
            , our museum-calibrated reproductions bring history alive in your home.
          </p>
          <p>
            Each canvas is executed on heavy archival linen, custom-stretched and framed in solid handcrafted mouldings. Explore our FAQ below to learn how each piece is painted and delivered.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-8 text-left">
          <Accordion items={faqs} />
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center px-7 py-3 rounded-full bg-[var(--color-ink)] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm font-sans"
          >
            SHOP ALL REPRODUCTIONS →
          </Link>
        </div>
      </div>
    </section>
  );
}