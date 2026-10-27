"use client";

import React, { useState, useEffect } from "react";

interface AnnouncementBarProps {
  announcements?: string[];
}

export function AnnouncementBar({
  announcements = [
    "Sales: +1 (646) 296-0579",
    "Special Autumn Promotion: 50% Off All Framed Reproductions",
    "Free Worldwide Shipping & 90-Day Money-Back Guarantee",
  ],
}: AnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="bg-[var(--color-ink)] text-[#c9a96a] h-10 flex items-center justify-center px-4 text-xs sm:text-[13px] font-sans font-medium tracking-wide relative z-20 overflow-hidden">
      <div className="transition-all duration-500 ease-in-out text-center">
        {announcements[currentIndex]}
      </div>
    </div>
  );
}
