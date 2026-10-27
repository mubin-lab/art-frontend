import React from "react";
import { getPaintings } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface MovementPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MovementPage({ params }: MovementPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).replace(/-/g, " ");
  const all = await getPaintings();
  const filtered = all.filter((p) =>
    p.movement.toLowerCase().includes(decodedSlug.toLowerCase())
  );

  return (
    <div className="bg-[var(--color-bg)] py-8 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <Eyebrow className="mb-2">ART MOVEMENT</Eyebrow>
          <h1 className="font-serif text-2xl sm:text-5xl font-semibold text-[var(--color-ink)] capitalize">
            {decodedSlug}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans mt-2 sm:mt-3">
            Explore museum-quality framed canvas reproductions from this transformative historical movement.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} painting={p} />
          ))}
        </div>
      </div>
    </div>
  );
}