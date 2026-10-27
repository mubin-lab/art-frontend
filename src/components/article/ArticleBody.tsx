import React from "react";
import Image from "next/image";
import type { ArticleBlock } from "@/types";

interface ArticleBodyProps {
  blocks: ArticleBlock[];
}

export function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="space-y-6 text-[var(--color-ink)] font-sans leading-relaxed">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={idx}
                id={block.id}
                className="font-serif text-2xl sm:text-[26px] font-bold text-[var(--color-ink)] pt-6 scroll-mt-24"
              >
                {block.content}
              </h2>
            );
          case "p":
            return (
              <p
                key={idx}
                className="text-[15px] sm:text-[16px] leading-[1.8] text-[#292624]"
              >
                {block.content}
              </p>
            );
          case "quote":
            return (
              <blockquote
                key={idx}
                className="my-6 pl-5 border-l-2 border-[#ceab51] space-y-2 py-1"
              >
                <p className="font-serif italic text-xl sm:text-[24px] text-[var(--color-ink)] leading-[1.35]">
                  "{block.quote}"
                </p>
                {block.attribution && (
                  <footer className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a8844a] font-sans">
                    — {block.attribution}
                  </footer>
                )}
              </blockquote>
            );
          case "figure":
            return (
              <figure key={idx} className="my-8 space-y-2">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-[#e5e0d8] bg-black">
                  <Image
                    src={block.image}
                    alt={block.caption}
                    fill
                    className="object-contain"
                  />
                </div>
                <figcaption className="text-center text-[11px] text-[var(--color-muted)] italic font-serif max-w-lg mx-auto">
                  {block.caption}
                </figcaption>
              </figure>
            );
          case "divider":
            return (
              <hr
                key={idx}
                className="border-t border-[#e5e0d8] my-8"
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}