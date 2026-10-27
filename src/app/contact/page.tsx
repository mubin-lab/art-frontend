import React from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Mail, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-[var(--color-bg)] py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <Eyebrow className="mb-2">GET IN TOUCH</Eyebrow>
          <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-[var(--color-ink)]">
            Contact Our Atelier Curators
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans mt-2">
            Have questions about dimensions, custom framing, or custom oil portrait commissions?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#e5e0d8] shadow-sm space-y-5 sm:space-y-6 font-sans">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-ink)]">
              Send us a Message
            </h3>
            <form className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[var(--color-ink)] block mb-1">NAME</label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>
              <div>
                <label className="font-bold text-[var(--color-ink)] block mb-1">EMAIL</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>
              <div>
                <label className="font-bold text-[var(--color-ink)] block mb-1">MESSAGE</label>
                <textarea
                  rows={4}
                  placeholder="How can we assist you with your art commission?"
                  className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>
              <button
                type="button"
                className="w-full py-3 sm:py-3.5 rounded-full bg-[var(--color-ink)] text-white font-bold tracking-wider uppercase cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#e5e0d8] shadow-sm space-y-4 font-sans text-xs">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-ink)]">
                Direct Atelier Contacts
              </h3>
              <div className="flex items-center gap-3 text-[var(--color-muted)]">
                <Phone className="w-5 h-5 text-[#ceab51] flex-shrink-0" />
                <span>+1 (646) 296-0579 (Mon - Fri, 9am - 6pm EST)</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--color-muted)]">
                <Mail className="w-5 h-5 text-[#ceab51] flex-shrink-0" />
                <span>curator@yourmuseum.art</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--color-muted)]">
                <Clock className="w-5 h-5 text-[#ceab51] flex-shrink-0" />
                <span>Studio response time: within 2 hours</span>
              </div>
            </div>

            <div className="bg-[#1d1916] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl space-y-2 font-sans text-xs">
              <h4 className="font-bold text-[#ceab51] uppercase tracking-wider text-xs sm:text-sm">
                90-Day Money-Back Guarantee
              </h4>
              <p className="text-white/80 leading-relaxed text-xs">
                We take immense pride in our museum-calibrated canvas fidelity. If you are not delighted with your painting upon unboxing, return it within 90 days for a prompt and courteous full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}