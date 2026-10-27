import React from "react";
import Image from "next/image";
import Link from "next/link";

interface SeriesListProps {
  series: { title: string; date: string; thumb: string; href: string }[];
}

export function SeriesList({ series }: SeriesListProps) {
  if (!series || series.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e5e0d8] shadow-xs space-y-3 font-sans">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a8844a] border-b border-[#f0ece4] pb-2">
        OTHER PAINTINGS IN SERIES
      </h3>
      <div className="space-y-3">
        {series.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
              <Image
                src={item.thumb}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-serif text-xs font-semibold text-[var(--color-ink)] group-hover:text-[#a8844a] transition-colors truncate">
                {item.title}
              </h4>
              <span className="text-[10px] text-[var(--color-muted)]">
                {item.date}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}