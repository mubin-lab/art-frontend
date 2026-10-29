import React from "react";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PaletteIcon, EyeIcon, FrameIcon, PainterIcon } from "@/components/icons";
import { ShieldCheck, Award } from "lucide-react";
import type { HomeData } from "@/types";

interface WhyChooseSectionProps {
  items?: HomeData["whyChoose"];
}

export function WhyChooseSection({
  items = [
    {
      icon: "palette",
      title: "Museum-Quality Archival Canvas",
      description: "Ultra-high-definition archival art printing on premium heavyweight textured canvas, capturing every historical brushstroke with lifelike gallery fidelity.",
    },
    {
      icon: "frame",
      title: "Handcrafted Solid Wood Framing",
      description: "Custom-crafted in solid wood Gold, Silver-White, and Classic Silver frames with pre-installed hanging hardware, ready to hang straight out of the box.",
    },
    {
      icon: "eye",
      title: "Faithful to the Original Masterpiece",
      description: "Every canvas is calibrated against high-resolution museum scans to ensure 100% accurate color fidelity, tone contrast, and compositional geometry.",
    },
    {
      icon: "painter",
      title: "100+ Years Fade Resistance",
      description: "Archival pigment inks on premium cotton-linen woven canvas ensure your artwork maintains vibrant colors and deep tones for generations without fading.",
    },
  ],
}: WhyChooseSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "palette":
        return <PaletteIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" />;
      case "eye":
        return <EyeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" />;
      case "frame":
        return <FrameIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" />;
      case "painter":
      default:
        return <PainterIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" />;
    }
  };

  return (
    <section className="bg-[#181513] text-white relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[660px]">
        {/* Left Column (Copy & 4 rows, Col 7) */}
        <div className="lg:col-span-7 px-4 py-12 sm:p-14 lg:p-20 flex flex-col justify-center">
          <div className="max-w-xl mx-auto lg:mx-0">
            <Eyebrow className="text-[#ceab51] mb-2 sm:mb-3">OUR PROMISE</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-[42px] leading-tight font-semibold text-white mb-8 sm:mb-10">
              Why Choose YourMuseum?
            </h2>

            <div className="space-y-6 sm:space-y-8">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 sm:gap-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 border border-[#d4af37]/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                    {getIcon(item.icon)}
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-sm sm:text-base lg:text-lg text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#b5afa6] leading-relaxed mt-1 font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Artisan Craftsman Framing Workshop (Col 5) */}
        <div className="lg:col-span-5 relative min-h-[360px] sm:min-h-[460px] lg:min-h-full bg-[#120f0e] overflow-hidden">
          <Image
            src="/images/craftsmanship/master-framing-craftsman.jpg"
            alt="Master art framing craftsman hand-gilding solid wood baroque museum frame in workshop studio"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          {/* Subtle vignette and gradient blending into left column */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#181513] via-black/20 to-transparent pointer-events-none" />

          {/* Floating Artisan Authenticity Badge */}
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <div className="bg-black/80 backdrop-blur-md border border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 text-white shadow-2xl flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center flex-shrink-0 text-[#d4af37]">
                <Award className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#d4af37] block font-sans">
                  AUTHENTIC STUDIO WORKMANSHIP
                </span>
                <p className="text-xs sm:text-sm font-serif font-medium text-white/95 mt-0.5">
                  Handcrafted solid wood frames & museum-grade archival canvas prints
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
