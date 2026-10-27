import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "outline" | "ghost" | "dark-pill" | "cream-pill";
  size?: "sm" | "md" | "lg" | "icon";
  href?: string;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ceab51] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

    const variantStyles = {
      primary:
        "bg-[var(--color-ink)] hover:bg-black text-white rounded-full shadow-sm active:scale-[0.98]",
      gold:
        "bg-[var(--color-gold)] hover:bg-[#b8953c] text-[var(--color-ink)] font-semibold rounded-full shadow-sm active:scale-[0.98]",
      outline:
        "bg-transparent border border-[#d6d2c9] hover:border-[var(--color-ink)] text-[var(--color-ink)] rounded-full active:scale-[0.98]",
      ghost:
        "bg-transparent hover:bg-black/5 text-[var(--color-ink)] rounded-full",
      "dark-pill":
        "bg-[var(--color-ink-soft)] hover:bg-black text-white text-[11px] font-semibold tracking-[0.1em] uppercase rounded-full px-5 py-2.5 active:scale-[0.98]",
      "cream-pill":
        "bg-[#f0ece4] hover:bg-[#e4dfd5] text-[var(--color-ink)] text-[11px] font-semibold tracking-[0.1em] uppercase rounded-full px-5 py-2.5 active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "h-9 px-4 text-xs tracking-wider uppercase font-semibold",
      md: "h-11 px-6 text-sm",
      lg: "h-13 px-8 text-base font-semibold",
      icon: "h-10 w-10 p-0 rounded-full",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";