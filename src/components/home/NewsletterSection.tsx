"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Chip } from "@/components/ui/Chip";
import { subscribeNewsletter } from "@/lib/api";

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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/400px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg", top: "10%", left: "5%" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/400px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg", top: "60%", left: "8%" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/400px-1665_Girl_with_a_Pearl_Earring.jpg", top: "15%", right: "6%" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/400px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg", top: "65%", right: "8%" },
  ];

  return (
    <section className="bg-[#1d1a1c] text-white py-12 sm:py-16 relative overflow-hidden min-h-[360px] flex items-center justify-center">
      {/* Drifting Floating Framed Thumbnails */}
      {floatingThumbs.map((thumb, idx) => (
        <div
          key={idx}
          style={{ top: thumb.top, left: thumb.left, right: thumb.right }}
          className="absolute w-20 h-16 sm:w-28 sm:h-20 rounded-lg overflow-hidden border-2 border-[#d4af37] shadow-2xl opacity-20 hover:opacity-80 transition-opacity duration-500 pointer-events-none hidden md:block"
        >
          <Image src={thumb.src} alt="Art thumbnail" fill className="object-cover" />
        </div>
      ))}

      <div className="max-w-xl mx-auto px-4 text-center z-10 space-y-4 sm:space-y-5">
        <h3 className="font-serif text-2xl sm:text-[28px] text-white font-medium">
          New Art, Stories & Offers
        </h3>
        <p className="text-xs sm:text-[13px] text-[#b3ada6] font-sans">
          Receive curator notes on famous artworks, studio restoration secrets, and private collector promotions.
        </p>

        {/* Roles Select */}
        <div className="space-y-2">
          <label className="text-[11px] font-sans text-white/70 tracking-wider">
            I am a… (select all that apply)
          </label>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {["Art Lover", "Collector", "Interior Designer"].map((role) => (
              <Chip
                key={role}
                label={role}
                selected={roles.includes(role)}
                onToggle={() => toggleRole(role)}
              />
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto items-center relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email address"
            className="w-full h-11 sm:h-12 pl-4 sm:pl-5 pr-28 sm:pr-32 rounded-full bg-white/10 border border-[#3a3536] text-white placeholder:text-white/40 text-xs sm:text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="absolute right-1 top-1 bottom-1 px-4 sm:px-6 rounded-full bg-[#ceab51] hover:bg-[#b8953c] text-[var(--color-ink)] text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
          >
            {status === "loading" ? "..." : "SUBSCRIBE"}
          </button>
        </form>

        {status === "success" && (
          <p className="text-xs text-[#00b67a] font-semibold animate-in fade-in">
            ✓ Welcome to our art society! We sent a confirmation to your inbox.
          </p>
        )}
      </div>
    </section>
  );
}