import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "dark" | "outline" | "discount";
  className?: string;
}

export function Badge({ children, variant = "gold", className }: BadgeProps) {
  const variants = {
    gold: "bg-[var(--color-gold)] text-[var(--color-ink)] font-semibold",
    dark: "bg-[var(--color-ink-soft)] text-white",
    outline: "border border-[var(--color-border)] text-[var(--color-ink)] bg-white/80",
    discount: "bg-[#ceab51]/15 text-[#a8844a] border border-[#ceab51]/30 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}