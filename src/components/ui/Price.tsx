"use client";

import React from "react";
import { cn, formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/lib/store/currency";

interface PriceProps {
  priceFrom: number;
  priceWas?: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  priceClassName?: string;
}

export function Price({
  priceFrom,
  priceWas,
  currency: currencyProp,
  size = "md",
  className,
  priceClassName,
}: PriceProps) {
  const { currency, convert } = useCurrencyStore();
  const activeCurrency = currencyProp || currency;

  const currentConverted = convert(priceFrom);
  const wasConverted = priceWas ? convert(priceWas) : null;

  // Detect if caller provided a custom text color class (e.g. text-white, text-[#ceab51], text-emerald-600)
  const hasCustomTextColor = className
    ? /\btext-(?!xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|left|right|center|justify)\S+/.test(className)
    : false;

  return (
    <div className={cn("flex items-baseline gap-2 font-sans", className)}>
      <span
        className={cn(
          "text-xs font-normal",
          hasCustomTextColor ? "text-current opacity-70" : "text-[var(--color-muted)]"
        )}
      >
        From
      </span>
      <span
        className={cn(
          "font-semibold",
          hasCustomTextColor ? "text-current" : "text-[var(--color-ink)]",
          size === "sm" && "text-sm",
          size === "md" && "text-base font-bold",
          size === "lg" && "text-2xl font-bold",
          priceClassName
        )}
      >
        {formatPrice(currentConverted, activeCurrency)}
      </span>
      {wasConverted && (
        <span
          className={cn(
            "text-xs sm:text-sm line-through",
            hasCustomTextColor ? "text-current opacity-60" : "text-[var(--color-muted)]"
          )}
        >
          {formatPrice(wasConverted, activeCurrency)}
        </span>
      )}
    </div>
  );
}
