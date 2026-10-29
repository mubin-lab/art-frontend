"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Chip } from "@/components/ui/Chip";
import { subscribeNewsletter } from "@/lib/api";
import { Mail, CheckCircle2 } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<string[]>(["Art Lover"]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const toggleRole = (role: string) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await subscribeNewsletter(email, roles);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const floatingThumbs = [
    { src: "/images/hero/hero-gallery-1.jpg", top: "10%", left: "4%" },
    { src: "/images/hero/hero-gallery-2.jpg", top: "58%", left: "6%" },
    { src: "/images/craftsmanship/master-framing-craftsman.jpg", top: "14%", right: "5%" },
    { src: "/images/samples/canvas-impasto-macro.jpg", top: "60%", right: "6%" },
  ];

  return (
    <section className="bg-[#181513] text-white py-14 sm:py-20 relative overflow-hidden min-h-[400px] flex items-center justify-center border-t border-white/10">
      {/* Drifting Floating Framed Thumbnails with Gold Borders */}
      {floatingThumbs.map((thumb, idx) => (
        <div
          key={idx}
          style={{ top: thumb.top, left: thumb.left, right: thumb.right }}
          className="absolute w-24 h-20 sm:w-36 sm:h-28 rounded-xl overflow-hidden border-2 border-[#d4af37]/60 shadow-2xl opacity-40 hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden md:block"
        >
          <Image src={thumb.src} alt="Art gallery thumbnail" fill className="object-cover" />
        </div>
      ))}

      <div className="max-w-xl mx-auto px-4 text-center z-10 space-y-5 sm:space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ceab51]/15 border border-[#ceab51]/30 text-[#ceab51] text-xs font-semibold uppercase tracking-wider font-sans">
          <Mail className="w-3.5 h-3.5" />
          <span>CURATOR'S CIRCLE</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-4xl text-white font-medium">
          New Art, Stories & Private Offers
        </h3>
        <p className="text-xs sm:text-sm text-[#b3ada6] font-sans max-w-lg mx-auto">
          Receive curator notes on famous artworks, studio restoration secrets, and private collector promotions across Bangladesh.
        </p>

        {/* Roles Select */}
        <div className="space-y-2">
          <label className="text-[11px] font-sans text-white/70 tracking-wider">
            I am a… (select all that apply)
          </label>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["Art Lover", "Collector", "Interior Designer"].map((role) => (
              <Chip
                key={role}
                label={role}
                selected={roles.includes(role)}
                onClick={() => toggleRole(role)}
              />
            ))}
          </div>
        </div>

        {/* Subscribe Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full sm:flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#ceab51] focus:ring-1 focus:ring-[#ceab51] transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#ceab51] hover:bg-[#b8953c] text-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer font-sans shadow-md"
          >
            {status === "loading" ? "..." : "SUBSCRIBE"}
          </button>
        </form>

        {status === "success" && (
          <p className="text-xs text-[#00b67a] font-semibold flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Welcome to our art society! We sent a confirmation to your inbox.
          </p>
        )}
      </div>
    </section>
  );
}
