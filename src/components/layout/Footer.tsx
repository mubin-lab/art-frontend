"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "@/components/icons";
import { ScrollTopButton } from "./ScrollTopButton";
import type { NavigationData, SiteConfig } from "@/types";

interface FooterProps {
  navigation?: NavigationData;
  siteConfig?: SiteConfig;
}

export function Footer({ navigation, siteConfig }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

  const footerCols = navigation?.footerColumns || [
    {
      title: "SHOP",
      links: [
        { label: "All Canvas Art", href: "/shop" },
        { label: "Top 100 Famous Paintings", href: "/shop?collection=top-100" },
        { label: "Bestsellers", href: "/shop?filter=bestseller" },
        { label: "Custom Photo to Painting", href: "/photo-to-painting" },
        { label: "Museum Quality Framing", href: "/shop" },
      ],
    },
    {
      title: "HELP",
      links: [
        { label: "Track My Order", href: "/account" },
        { label: "Shipping & Delivery", href: "/contact" },
        { label: "90-Day Guarantee", href: "/contact" },
        { label: "Size & Framing Guide", href: "/shop" },
        { label: "FAQs", href: "/#faq" },
      ],
    },
    {
      title: "YOURMUSEUM",
      links: [
        { label: "About Our Atelier", href: "/about" },
        { label: "Our Master Artists", href: "/artists" },
        { label: "Art Guide & Analysis", href: "/art-guide" },
        { label: "Audio Stories", href: "/audio-stories" },
        { label: "Customer Reviews", href: "/#reviews" },
      ],
    },
    {
      title: "ARTISTS",
      links: [
        { label: "Vincent van Gogh", href: "/artists/vincent-van-gogh" },
        { label: "Claude Monet", href: "/artists/claude-monet" },
        { label: "Gustav Klimt", href: "/artists/gustav-klimt" },
        { label: "Johannes Vermeer", href: "/artists/johannes-vermeer" },
        { label: "Leonardo da Vinci", href: "/artists/leonardo-da-vinci" },
      ],
    },
  ];

  return (
    <footer className="bg-[var(--color-footer-bg)] text-[#d9d4c8] pt-12 sm:pt-16 pb-8 relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Atelier Contacts */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-serif font-bold text-lg">
                YM
              </div>
              <span className="font-serif text-2xl font-medium tracking-tight text-white">
                YourMuseum
              </span>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed text-white/80 font-sans">
              Museum-quality framed canvas art. World-famous masterpieces printed on archival canvas and handcrafted in solid wood frames.
            </p>

            <div className="space-y-2 pt-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ceab51] block font-sans">
                  EMAIL
                </span>
                <a
                  href={`mailto:${siteConfig?.email || "curator@yourmuseum.art"}`}
                  className="text-xs text-white hover:text-[#ceab51] transition-colors font-sans"
                >
                  {siteConfig?.email || "curator@yourmuseum.art"}
                </a>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ceab51] block font-sans">
                  PHONE
                </span>
                <a
                  href={`tel:${siteConfig?.phone || "+16462960579"}`}
                  className="text-xs text-white hover:text-[#ceab51] transition-colors font-sans"
                >
                  {siteConfig?.phone || "+1 (646) 296-0579"}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ceab51] block mb-2 font-sans">
                FOLLOW US
              </span>
              <div className="flex items-center gap-3 text-white/70">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition-colors">
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-white transition-colors">
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-white transition-colors">
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Cols 2-5: Nav columns with mobile accordions */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {footerCols.map((col, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div key={idx} className="border-b border-white/10 sm:border-b-0 pb-3 sm:pb-0">
                  {/* Mobile Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between sm:pointer-events-none py-2 sm:py-0 text-left cursor-pointer"
                  >
                    <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#ceab51] font-sans">
                      {col.title}
                    </h4>
                    <ChevronDown
                      className={`w-4 h-4 text-[#ceab51] sm:hidden transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Links List (collapsible on mobile, always visible on sm+) */}
                  <div className={`${isOpen ? "block" : "hidden sm:block"} pt-2 sm:pt-4`}>
                    <ul className="space-y-2.5 sm:space-y-3">
                      {col.links.map((link, lIdx) => (
                        <li key={lIdx}>
                          <Link
                            href={link.href}
                            className="text-xs sm:text-sm text-[#d9d4c8] hover:text-white font-sans transition-colors inline-block"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50 font-sans text-center md:text-left">
          <div>
            © {currentYear} YourMuseum Art Reproductions. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/copyright" className="hover:text-white transition-colors">
              Copyright Notice
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-white/60">
              SECURE PAYMENTS:
            </span>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/10 text-[9px] font-bold text-white tracking-widest">
              <span>VISA</span>
              <span>•</span>
              <span>MC</span>
              <span>•</span>
              <span>AMEX</span>
              <span>•</span>
              <span>PAYPAL</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollTopButton />
    </footer>
  );
}