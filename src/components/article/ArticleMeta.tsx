import React from "react";
import type { Article } from "@/types";

interface ArticleMetaProps {
  article: Article;
}

export function ArticleMeta({ article }: ArticleMetaProps) {
  const facts = [
    { label: "ARTIST", value: article.artist },
    { label: "DATE", value: article.date },
    { label: "MEDIUM", value: article.medium },
    { label: "DIMENSIONS", value: article.dimensions },
    { label: "LOCATION", value: article.location },
    { label: "MOVEMENT", value: article.movement },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#e5e0d8] my-6 font-sans">
      {facts.map((fact, idx) => (
        <div key={idx} className="space-y-0.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#a8844a] block">
            {fact.label}
          </span>
          <span className="text-xs font-semibold text-[var(--color-ink)] block truncate">
            {fact.value}
          </span>
        </div>
      ))}
    </div>
  );
}