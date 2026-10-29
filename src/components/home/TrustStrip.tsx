import React from "react";
import { Truck, RotateCcw, Palette, ShieldCheck } from "lucide-react";

export function TrustStrip() {
  const perks = [
    {
      icon: Truck,
      title: "Safe Nationwide Delivery",
      description: "Carefully packaged with corner armor & bubble protection across Bangladesh.",
      accent: "text-[#ceab51]",
      bg: "bg-[#ceab51]/10",
    },
    {
      icon: RotateCcw,
      title: "90-Day Money-Back Guarantee",
      description: "Complete satisfaction or full return without questions asked.",
      accent: "text-[#00b67a]",
      bg: "bg-[#00b67a]/10",
    },
    {
      icon: Palette,
      title: "Museum-Quality Canvas Prints",
      description: "Archival pigment inks on heavyweight textured canvas, 100+ years fade resistance.",
      accent: "text-[#ceab51]",
      bg: "bg-[#ceab51]/10",
    },
    {
      icon: ShieldCheck,
      title: "Handcrafted Solid Wood Frames",
      description: "Custom artisan frames in Gold, Silver-White & Silver with hanging kit included.",
      accent: "text-[#00b67a]",
      bg: "bg-[#00b67a]/10",
    },
  ];

  return (
    <div className="bg-white border-y border-[#ece7df] py-10 sm:py-12 shadow-2xs">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[#faf8f5] transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${perk.bg} flex items-center justify-center flex-shrink-0 border border-black/5`}
                >
                  <Icon className={`w-6 h-6 ${perk.accent}`} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs sm:text-sm text-[var(--color-ink)]">
                    {perk.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-muted)] leading-relaxed mt-0.5 font-sans">
                    {perk.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
