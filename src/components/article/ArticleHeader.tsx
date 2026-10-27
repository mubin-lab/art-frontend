import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArticleActions } from "./ArticleActions";
import type { Article } from "@/types";

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <div className="space-y-4 pb-6 border-b border-[#e5e0d8]">
      <Eyebrow>
        {article.artist.toUpperCase()} · {article.movement}
      </Eyebrow>

      <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] leading-[1.12] font-semibold text-[var(--color-ink)]">
        {article.title}
      </h1>

      <p className="text-xs sm:text-sm text-[var(--color-muted)] font-serif italic">
        {article.date} · {article.medium} · {article.location}
      </p>

      {/* Explore the Artist mini row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2.5">
          {article.artistAvatar && (
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={article.artistAvatar}
                alt={article.artist}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a8844a]">
            EXPLORE THE ARTIST:
          </span>
          <Link
            href={`/artists/${article.artistSlug}`}
            className="text-xs font-bold text-[var(--color-ink)] underline hover:text-[#a8844a] transition-colors"
          >
            {article.artist}
          </Link>
        </div>

        <ArticleActions />
      </div>
    </div>
  );
}