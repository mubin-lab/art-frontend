import React from "react";
import Link from "next/link";
import { Eyebrow } from "./Eyebrow";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  actionText,
  actionHref,
  align = "center",
  theme = "light",
  className,
}: SectionHeadingProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "mb-10 sm:mb-14",
        align === "center" ? "text-center mx-auto max-w-2xl" : "text-left",
        className
      )}
    >
      {eyebrow && <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "font-serif text-3xl sm:text-4xl md:text-[40px] leading-[1.15] font-semibold tracking-tight",
          isDark ? "text-white" : "text-[var(--color-ink)]"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-3 text-sm sm:text-base font-sans font-normal",
            isDark ? "text-[#a39e99]" : "text-[var(--color-muted)]"
          )}
        >
          {subtitle}
        </p>
      )}
      {actionText && actionHref && (
        <div className="mt-5">
          <Link
            href={actionHref}
            className="inline-flex items-center text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--color-ink)] bg-white/80 hover:bg-white border border-[#d6d2c9] px-6 py-2.5 rounded-full transition-all shadow-xs"
          >
            {actionText}
          </Link>
        </div>
      )}
    </div>
  );
}