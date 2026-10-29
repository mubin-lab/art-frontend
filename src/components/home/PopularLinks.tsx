import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface PopularLinksProps {
  links?: { label: string; href: string }[];
}

export function PopularLinks({
  links = [
    { label: "Vincent van Gogh", href: "/artists/vincent-van-gogh" },
    { label: "Claude Monet", href: "/artists/claude-monet" },
    { label: "Gustav Klimt", href: "/artists/gustav-klimt" },
    { label: "Leonardo da Vinci", href: "/artists/leonardo-da-vinci" },
    { label: "Impressionism", href: "/art-movements/impressionism" },
    { label: "Baroque Masters", href: "/art-movements/baroque" },
    { label: "Top 100 Famous Masterpieces", href: "/collections/top-100" },
  ],
}: PopularLinksProps) {
  return (
    <div className="max-w-[1250px] mx-auto px-4 sm:px-6 -mt-2 mb-10">
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-sans">
        <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-[#ceab51] bg-[#181513] px-3 py-1.5 rounded-full shadow-2xs">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          TRENDING COLLECTIONS:
        </span>
        {links.map((link, idx) => {
          const isTop100 = link.label.toLowerCase().includes("top 100");
          return (
            <Link
              key={idx}
              href={link.href}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border shadow-2xs ${
                isTop100
                  ? "bg-[#ceab51] text-black font-semibold border-[#d4af37] hover:bg-[#b8953c]"
                  : "bg-white/80 hover:bg-white text-[var(--color-ink)] hover:text-[#ceab51] border-[#e8dfd1] hover:border-[#ceab51]/60"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
