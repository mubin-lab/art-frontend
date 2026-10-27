import React from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function AccountPage() {
  return (
    <div className="bg-[var(--color-bg)] py-8 sm:py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-[#e5e0d8] shadow-sm space-y-5 sm:space-y-6">
          <div className="text-center">
            <Eyebrow className="mb-2">CUSTOMER ATELIER</Eyebrow>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)]">
              Track My Order
            </h1>
            <p className="text-xs text-[var(--color-muted)] font-sans mt-2">
              Enter your Order Number and email to see studio painting progress and tracking.
            </p>
          </div>

          <form className="space-y-4 font-sans text-xs">
            <div>
              <label className="font-bold text-[var(--color-ink)] block mb-1">
                ORDER NUMBER:
              </label>
              <input
                type="text"
                placeholder="e.g. YM-89421"
                className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
              />
            </div>
            <div>
              <label className="font-bold text-[var(--color-ink)] block mb-1">
                EMAIL ADDRESS:
              </label>
              <input
                type="email"
                placeholder="you@domain.com"
                className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
              />
            </div>
            <button
              type="button"
              className="w-full py-3 sm:py-3.5 rounded-full bg-[var(--color-ink)] text-white font-bold tracking-wider uppercase mt-2 cursor-pointer"
            >
              Track Studio Progress
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}