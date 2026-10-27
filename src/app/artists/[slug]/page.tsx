import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArtistBySlug, getPaintings } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface ArtistPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) return { title: "Artist Not Found" };
  return {
    title: `${artist.name} Paintings | Museum-Quality Framed Canvas Art`,
    description: `Shop museum-quality framed canvas reproductions of ${artist.name}'s greatest works on canvas. ${artist.bio}`,
  };
}

export default async function ArtistDetailPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  const allPaintings = await getPaintings();
  const artistPaintings = allPaintings.filter((p) => p.artistSlug === artist.slug);

  return (
    <div className="bg-[var(--color-bg)] py-8 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-12 border border-[#e5e0d8] shadow-sm mb-8 sm:mb-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="relative w-24 h-24 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-[#ceab51] shadow-lg flex-shrink-0 bg-gray-100">
            <Image
              src={artist.avatar}
              alt={artist.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-2 sm:space-y-3 text-center md:text-left flex-1">
            <Eyebrow>{artist.movement}</Eyebrow>
            <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-[var(--color-ink)]">
              {artist.name}
            </h1>
            <p className="text-xs sm:text-base text-[var(--color-muted)] font-sans max-w-2xl leading-relaxed">
              {artist.bio}
            </p>
            <div className="pt-1 sm:pt-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#a8844a]">
              {artistPaintings.length} paintings available in framed canvas
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--color-ink)] mb-4 sm:mb-6">
            Masterpieces by {artist.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {artistPaintings.map((p) => (
              <ProductCard key={p.id} painting={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}