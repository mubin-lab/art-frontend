import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import type { Painting } from "@/types";

interface BestsellersSectionProps {
  paintings: Painting[];
}

export function BestsellersSection({ paintings }: BestsellersSectionProps) {
  return (
    <section className="py-16 sm:py-20 bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="BESTSELLERS"
          title="Popular Framed Canvas Art"
          subtitle="Our most loved masterpieces, printed on premium canvas and framed in solid wood."
          actionText="VIEW ALL PAINTINGS →"
          actionHref="/shop"
          align="center"
        />

        <ProductCarousel paintings={paintings} />
      </div>
    </section>
  );
}