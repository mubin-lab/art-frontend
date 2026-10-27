"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ArticleTOCProps {
  toc: { id: string; label: string }[];
}

export function ArticleTOC({ toc }: ArticleTOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%" }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8] shadow-xs">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a8844a] font-sans mb-3 pb-2 border-b border-[#f0ece4]">
        IN THIS ARTICLE
      </h3>
      <nav className="space-y-1.5 font-sans">
        {toc.map((item) => {
          const isActive = activeId === item.id;
          return (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className={`block text-xs py-1 transition-colors leading-snug ${
                isActive
                  ? "text-[#a8844a] font-bold pl-1 border-l-2 border-[#ceab51]"
                  : "text-[var(--color-muted)] hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}