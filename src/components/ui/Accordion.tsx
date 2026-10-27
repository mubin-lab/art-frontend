"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className={cn("divide-y divide-[var(--color-border)]", className)}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="py-4">
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between text-left focus:outline-none group cursor-pointer"
            >
              <span className="font-serif text-base sm:text-lg text-[var(--color-ink)] group-hover:text-[var(--color-gold-text)] transition-colors pr-4">
                {item.question}
              </span>
              <span
                className={cn(
                  "flex-shrink-0 text-xl font-light text-[var(--color-gold-text)] transition-transform duration-200",
                  isOpen && "rotate-45"
                )}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="pt-3 pb-1 text-sm leading-relaxed text-[var(--color-muted)] font-sans animate-in fade-in duration-200">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}