import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Artist } from "@/types";

interface ArtistsRowProps {
  artists: Artist[];
}

export function ArtistsRow({ artists = [] }: ArtistsRowProps) {
  return (
    <section className="py-16 sm:py-20 bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="LEGENDARY MASTERS"
          title="Artists"
          subtitle="Explore museum canvas reproductions catalogued by the world's greatest painters."
          align="center"
        />

        <div className="flex items-center justify-start lg:justify-center gap-6 sm:gap-10 overflow-x-auto pb-4 scrollbar-none">
          {artists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="flex flex-col items-center group flex-shrink-0"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#d9d5cc] group-hover:border-[#ceab51] shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-gray-200">
                <Image
                  src={artist.avatar}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>

              <span className="font-sans font-bold text-xs sm:text-[13px] text-[var(--color-ink)] group-hover:text-[#a8844a] transition-colors mt-3 text-center">
                {artist.name}
              </span>
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)] mt-0.5">
                {artist.artworkCount} ARTWORKS
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}