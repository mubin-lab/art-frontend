import React from "react";
import Link from "next/link";

interface PopularLinksProps {
  links?: { label: string; href: string }[];
}

export function PopularLinks({
  links = [
    { label: "Van Gogh", href: "/artists/vincent-van-gogh" },
    { label: "Monet", href: "/artists/claude-monet" },
    { label: "Klimt", href: "/artists/gustav-klimt" },
    { label: "Da Vinci", href: "/artists/leonardo-da-vinci" },
    { label: "Impressionism", href: "/art-movements/impressionism" },
    { label: "Top 100 famous paintings", href: "/collections/top-100" },
  ],
}: PopularLinksProps) {
  return (
    <div className="max-w-[1250px] mx-auto px-4 sm:px-6 -mt-4 mb-8">
      <div className="text-xs text-[var(--color-muted)] font-sans flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-semibold text-[var(--color-ink)]">Popular:</span>
        {links.map((link, idx) => (
          <React.Fragment key={idx}>
            <Link
              href={link.href}
              className="hover:text-[var(--color-gold-text)] hover:underline transition-colors"
            >
              {link.label}
            </Link>
            {idx < links.length - 1 && <span className="text-gray-300">•</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}