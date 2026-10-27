import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getArtists } from "@/lib/api";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata = {
  title: "A-Z Directory of Master Artists | YourMuseum",
  description: "Explore famous artists from the Renaissance to Post-Impressionism with museum-quality framed canvas reproductions of their masterpieces.",
};

export default async function ArtistsDirectoryPage() {
  const artists = await getArtists();

  return (
    <div className="bg-[var(--color-bg)] py-8 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-14">
          <Eyebrow className="mb-2">MASTERS DIRECTORY</Eyebrow>
          <h1 className="font-serif text-2xl sm:text-5xl font-semibold text-[var(--color-ink)]">
            Explore Great Artists
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans mt-2 sm:mt-3">
            From the Flemish primitives and Italian Renaissance to the French Impressionists and Vienna Secession.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-8">
          {artists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="bg-white rounded-2xl p-3.5 sm:p-6 border border-[#e5e0d8] shadow-xs hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center group"
            >
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#d9d5cc] group-hover:border-[#ceab51] mb-3 sm:mb-4 bg-gray-100">
                <Image
                  src={artist.avatar}
                  alt={artist.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h2 className="font-serif text-sm sm:text-lg font-bold text-[var(--color-ink)] group-hover:text-[#a8844a] transition-colors leading-snug">
                {artist.name}
              </h2>
              <span className="text-[11px] sm:text-xs text-[var(--color-muted)] font-sans mt-0.5 sm:mt-1">
                {artist.movement}
              </span>
              <p className="text-[11px] sm:text-xs text-[#78716a] font-sans line-clamp-2 mt-2 sm:mt-3 leading-relaxed hidden xs:block sm:block">
                {artist.bio}
              </p>
              <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-gray-100 w-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#a8844a]">
                {artist.artworkCount} ARTWORKS
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}