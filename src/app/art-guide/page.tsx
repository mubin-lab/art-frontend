import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { api } from "@/lib/api/client";
import type { Article } from "@/types";

export const metadata = {
  title: "Art Guide & Masterpiece Analysis | YourMuseum Editorial",
  description: "In-depth historical analyses, composition breakdowns, and curatorial stories behind the world's most famous paintings.",
};

export default async function ArtGuideIndexPage() {
  const articles = await api<Article[]>("/articles");

  return (
    <div className="bg-[var(--color-bg)] py-12 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <Eyebrow className="mb-2">EDITORIAL ESSAYS & PROVENANCE</Eyebrow>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[var(--color-ink)]">
            YourMuseum Art Guide
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-muted)] font-sans mt-3">
            Explore deep curatorial breakdowns of composition, brushwork, pigment history, and the turbulent lives of the masters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art) => (
            <Link
              key={art.slug}
              href={`/art-guide/${art.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-[#e5e0d8] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 w-full bg-black overflow-hidden">
                <Image
                  src={art.blocks.find((b) => b.type === "figure")?.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"}
                  alt={art.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a8844a] font-sans block">
                    {art.artist} · {art.movement}
                  </span>
                  <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)] group-hover:text-[#a8844a] transition-colors leading-snug">
                    {art.title}
                  </h2>
                  <p className="text-xs text-[var(--color-muted)] font-serif italic">
                    {art.date} · {art.medium} · {art.location}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f0ece4] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] font-sans">
                  <span>Read Article</span>
                  <span className="text-[#a8844a] group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}