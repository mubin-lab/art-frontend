import React from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Eyebrow({ children, className, ...props }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-gold-text)] font-sans",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}