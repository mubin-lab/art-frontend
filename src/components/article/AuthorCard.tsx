import React from "react";

interface AuthorCardProps {
  author: {
    name: string;
    role: string;
    bio: string;
    avatarInitials?: string;
  };
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="bg-[#f0ece4] rounded-2xl p-6 sm:p-8 border border-[#e5e0d8] flex items-start gap-4 sm:gap-6 mt-12">
      <div className="w-12 h-12 rounded-full bg-[var(--color-ink)] text-white flex items-center justify-center font-bold text-base font-serif flex-shrink-0 shadow-xs">
        {author.avatarInitials || "BM"}
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a8844a] font-sans block">
          {author.role}
        </span>
        <h4 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
          {author.name}
        </h4>
        <p className="text-xs sm:text-[13px] text-[var(--color-muted)] font-sans leading-relaxed pt-1">
          {author.bio}
        </p>
      </div>
    </div>
  );
}