import React from "react";
import { Truck, RotateCcw, Palette, CheckCircle2 } from "lucide-react";

export function TrustStrip() {
  const perks = [
    { icon: Truck, label: "Safe Delivery in Bangladesh", color: "text-[#ceab51]" },
    { icon: RotateCcw, label: "90-Day Money-Back Guarantee", color: "text-[#00b67a]" },
    { icon: Palette, label: "Museum-Grade Canvas Art", color: "text-[#ceab51]" },
    { icon: CheckCircle2, label: "Unlimited Revisions", color: "text-[#00b67a]" },
  ];

  return (
    <div className="bg-white border-y border-[#ece7df] py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div key={idx} className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f8f6f0] flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5 h-5 ${perk.color}`} />
                </div>
                <span className="font-sans font-semibold text-xs sm:text-sm text-[var(--color-ink)]">
                  {perk.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}