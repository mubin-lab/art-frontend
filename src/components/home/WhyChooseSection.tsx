import React from "react";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PaletteIcon, EyeIcon, FrameIcon, PainterIcon } from "@/components/icons";
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
        return <PaletteIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />;
      case "eye":
        return <EyeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />;
      case "frame":
        return <FrameIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />;
      case "painter":
      default:
        return <PainterIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />;
    }
  };

  return (
    <section className="bg-[#1d1916] text-white relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[640px]">
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
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
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

        {/* Right Column: Photo of Painter (Col 5) */}
        <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[420px] lg:min-h-full bg-[#181513]">
          <Image
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80"
            alt="Master painter in atelier studio"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1d1916] via-transparent to-transparent" />

          {/* Organic paint blob SVG overlapping bottom edge */}
          <div className="absolute -bottom-1 -left-1 w-32 h-32 pointer-events-none hidden lg:block">
            <svg viewBox="0 0 100 100" fill="#f5f2ed" className="w-full h-full">
              <path d="M0,100 C30,90 20,40 50,50 C80,60 90,0 100,0 L0,0 Z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}