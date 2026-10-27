import React from "react";
import { Play, Headphones, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioBadgeProps {
  type?: "play" | "headphones" | "book";
  className?: string;
}

export function AudioBadge({ type = "play", className }: AudioBadgeProps) {
  return (
    <div
      className={cn(
        "w-7 h-7 rounded-full bg-[var(--color-ink-soft)]/90 backdrop-blur-xs text-white flex items-center justify-center shadow-md",
        className
      )}
      title="Audio story available"
    >
      {type === "headphones" ? (
        <Headphones className="w-3.5 h-3.5" />
      ) : type === "book" ? (
        <BookOpen className="w-3.5 h-3.5" />
      ) : (
        <Play className="w-3 h-3 fill-current ml-0.5" />
      )}
    </div>
  );
}