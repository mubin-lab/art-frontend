import React from "react";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "@/components/icons";

export function UtilityStrip() {
  return (
    <div className="bg-[var(--color-bg-strip)] border-b border-[#e8e4dc] hidden md:block">
      <div className="max-w-[1280px] mx-auto h-10 px-4 sm:px-6 flex items-center justify-between text-[11px] font-sans font-normal tracking-[0.06em] uppercase text-[var(--color-muted)]">
        {/* Left Links */}
        <div className="flex items-center gap-2.5">
          <Link href="/about" className="hover:text-[var(--color-ink)] transition-colors">
            ABOUT US
          </Link>
          <span className="text-[#bbb5ac]">•</span>
          <Link href="/account" className="hover:text-[var(--color-ink)] transition-colors">
            MY ACCOUNT
          </Link>
          <span className="text-[#bbb5ac]">•</span>
          <Link href="/wishlist" className="hover:text-[var(--color-ink)] transition-colors">
            WISHLIST
          </Link>
          <span className="text-[#bbb5ac]">•</span>
          <Link href="/account" className="hover:text-[var(--color-ink)] transition-colors">
            TRACK MY ORDER
          </Link>
        </div>

        {/* Right Social Icons */}
        <div className="flex items-center gap-4 text-[#8a837c]">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-[var(--color-ink)] transition-colors"
          >
            <FacebookIcon className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-[var(--color-ink)] transition-colors"
          >
            <TwitterIcon className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-[var(--color-ink)] transition-colors"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-[var(--color-ink)] transition-colors"
          >
            <YoutubeIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}