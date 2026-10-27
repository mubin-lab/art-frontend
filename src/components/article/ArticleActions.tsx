"use client";

import React, { useState } from "react";
import { Heart, Bookmark, Share2 } from "lucide-react";

export function ArticleActions() {
  const [likes, setLikes] = useState(1);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-3 pt-2 font-sans">
      <button
        type="button"
        onClick={handleLike}
        className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          liked
            ? "border-red-500 text-red-500 bg-red-50"
            : "border-[#d6d2c9] hover:border-black text-[var(--color-ink)] bg-white"
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
        <span>{likes}</span>
      </button>

      <button
        type="button"
        onClick={() => setSaved(!saved)}
        className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          saved
            ? "border-[#ceab51] text-[#ceab51] bg-[#faf8f3]"
            : "border-[#d6d2c9] hover:border-black text-[var(--color-ink)] bg-white"
        }`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="px-4 py-2 rounded-full border border-[#d6d2c9] hover:border-black text-[var(--color-ink)] bg-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>{copied ? "Copied Link!" : "Share"}</span>
      </button>
    </div>
  );
}