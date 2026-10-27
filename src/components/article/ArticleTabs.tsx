"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Article } from "@/types";

interface ArticleTabsProps {
  article: Article;
}

export function ArticleTabs({ article }: ArticleTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "ART GUIDE", sub: "Analysis", href: "#" },
    { label: "ARTIST", sub: article.artist, href: `/artists/${article.artistSlug}` },
    { label: "PAINTING", sub: "Provenance", href: `/painting/${article.paintingSlug}` },
    { label: "SHOP", sub: "Framed Oil", href: `/painting/${article.paintingSlug}` },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-none pb-1 my-3 sm:my-4">
      <div className="bg-[#efede6] p-1 rounded-2xl border border-[#e5e0d8] inline-flex min-w-[360px] sm:w-full sm:max-w-2xl font-sans">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <Link
              key={idx}
              href={tab.href}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 py-2 px-2.5 sm:px-3 text-center rounded-xl transition-all ${
                isActive
                  ? "bg-white shadow-xs text-[var(--color-ink)]"
                  : "text-[var(--color-muted)] hover:text-black"
              }`}
            >
              <span className="block text-[8px] sm:text-[9px] font-bold tracking-[0.16em] uppercase text-[#a8844a]">
                {tab.label}
              </span>
              <span className="block text-[11px] sm:text-xs font-semibold truncate mt-0.5">
                {tab.sub}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}