"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white text-[var(--color-ink)] shadow-xl border border-[#e5e0d8] flex items-center justify-center hover:bg-[var(--color-gold)] hover:text-black hover:border-[var(--color-gold)] transition-all duration-300 animate-in fade-in zoom-in-75 cursor-pointer"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}