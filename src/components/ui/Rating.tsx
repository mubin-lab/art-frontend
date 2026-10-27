import React from "react";
import { TrustpilotStar } from "@/components/icons";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating?: number;
  max?: number;
  className?: string;
}

export function Rating({ rating = 5, max = 5, className }: RatingProps) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <TrustpilotStar key={i} filled={i < rating} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      ))}
    </div>
  );
}