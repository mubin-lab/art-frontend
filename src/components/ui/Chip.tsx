"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, selected = false, onToggle, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle || onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-all border cursor-pointer select-none",
        selected
          ? "bg-[#ceab51] text-black border-[#ceab51] font-semibold"
          : "bg-white/10 text-white/80 border-white/20 hover:border-white/50",
        className
      )}
    >
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          selected ? "bg-black" : "border border-white/60"
        )}
      />
      {label}
    </button>
  );
}