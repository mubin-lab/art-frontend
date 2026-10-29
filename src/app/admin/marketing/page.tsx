"use client";

import { useEffect, useState } from "react";
import { getHomeData, updateHeroSlides, getSiteConfig, updateSiteConfig } from "@/lib/api/admin";
import type { HeroSlide } from "@/types";


export default function AdminMarketingPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingSlides, setSavingSlides] = useState(false);
  const [savingAnnouncements, setSavingAnnouncements] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [home, config] = await Promise.all([getHomeData(), getSiteConfig()]);
        setSlides(home.heroSlides || []);
        setAnnouncements(config.announcements || []);
      } catch (err) {
        console.error("Failed to load marketing data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleUpdateSlide = (index: number, field: string, value: any) => {
    setSlides((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSaveSlides = async () => {
    try {
      setSavingSlides(true);
      await updateHeroSlides(slides);
      showToast("হিরো ব্যানার স্লাইডার সফলভাবে আপডেট হয়েছে!");
    } catch (err) {
      alert("স্লাইডার সংরক্ষণ করতে সমস্যা হয়েছে।");
    } finally {
      setSavingSlides(false);
    }
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    setAnnouncements((prev) => [...prev, newAnnouncement.trim()]);
    setNewAnnouncement("");
  };

  const handleRemoveAnnouncement = (index: number) => {
    setAnnouncements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAnnouncements = async () => {
    try {
      setSavingAnnouncements(true);
      await updateSiteConfig({ announcements });
      showToast("টপবার অ্যানাউন্সমেন্ট সফলভাবে আপডেট হয়েছে!");
    } catch (err) {
      alert("অ্যানাউন্সমেন্ট সংরক্ষণ করতে সমস্যা হয়েছে।");
    } finally {
      setSavingAnnouncements(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#d4af37] mb-3"></div>
        <p className="text-sm text-gray-500 font-medium">মার্কেটিং সেটিংস লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#d4af37]/40 flex items-center gap-3 animate-slide-up">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
          মার্কেটিং ও হোমপেজ ব্যানার (Marketing CMS)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          হোমপেজের হিরো স্লাইডার, বিশেষ অফার এবং হেডার টপবার অ্যানাউন্সমেন্ট টিক্সট পরিচালনা করুন
        </p>
      </div>

      {/* Section 1: Announcement Bar Manager */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
              টপবার অ্যানাউন্সমেন্ট ব্যানার (Header Top Bar Ticker)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              ওয়েবসাইটের একেবারে উপরে কালো বারটিতে এই মেসেজগুলো পর্যায়ক্রমে ঘুরে ঘুরে দেখায়
            </p>
          </div>
          <button
            onClick={handleSaveAnnouncements}
            disabled={savingAnnouncements}
            className="px-4 py-2 bg-[#d4af37] text-white rounded-lg text-xs font-bold hover:bg-[#b8972e] transition shadow-sm disabled:opacity-60 flex items-center gap-2 self-start sm:self-auto"
          >
            {savingAnnouncements && <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />}
            অ্যানাউন্সমেন্ট সেভ করুন
          </button>
        </div>

        {/* List of current announcements */}
        <div className="space-y-3">
          {announcements.map((text, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium text-gray-800">{text}</span>
              </div>
              <button
                onClick={() => handleRemoveAnnouncement(idx)}
                className="text-rose-500 hover:text-rose-700 text-xs font-semibold px-2 py-1 rounded hover:bg-rose-50 transition"
              >
                মুছে ফেলুন
              </button>
            </div>
          ))}
        </div>

        {/* Add new announcement input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddAnnouncement()}
            placeholder="নতুন অফার মেসেজ লিখুন (যেমন: ঢাকা ও সারাদেশে ফ্রি হোম ডেলিভারি)..."
            className="flex-1 px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          />
          <button
            onClick={handleAddAnnouncement}
            type="button"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition"
          >
            যোগ করুন
          </button>
        </div>
      </div>

      {/* Section 2: Hero Slides Manager */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
              হোমপেজ হিরো স্লাইডার (Hero Carousel Banner)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              হোমপেজের মূল আকর্ষণীয় স্লাইডসমূহ ({slides.length} টি স্লাইড সক্রিয়)
            </p>
          </div>
          <button
            onClick={handleSaveSlides}
            disabled={savingSlides}
            className="px-4 py-2 bg-[#d4af37] text-white rounded-lg text-xs font-bold hover:bg-[#b8972e] transition shadow-sm disabled:opacity-60 flex items-center gap-2 self-start sm:self-auto"
          >
            {savingSlides && <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />}
            স্লাইডার সেভ করুন
          </button>
        </div>

        <div className="space-y-6">
          {slides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className="p-5 rounded-xl border border-gray-200/90 bg-gray-50/50 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-white px-2.5 py-1 rounded border border-gray-200">
                  স্লাইড #{idx + 1}
                </span>
                {slide.product?.title && (
                  <span className="text-xs font-bold text-gray-800">
                    আর্টওয়ার্ক: {slide.product.title} ({slide.product.artist})
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* Slide Preview Image (col 4) */}
                <div className="md:col-span-4 aspect-16/10 rounded-lg overflow-hidden bg-gray-200 border border-gray-300 relative group">
                  <img
                    src={slide.image}
                    alt={slide.tag}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {slide.tag || "FEATURED"}
                  </div>
                </div>

                {/* Form fields (col 8) */}
                <div className="md:col-span-8 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                        ব্যানার ট্যাগ ব্যাজ (Tag Badge)
                      </label>
                      <input
                        type="text"
                        value={slide.tag}
                        onChange={(e) => handleUpdateSlide(idx, "tag", e.target.value)}
                        placeholder="CURATOR'S CHOICE"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                        লিংক লেবেল (Button Text)
                      </label>
                      <input
                        type="text"
                        value={slide.linkLabel}
                        onChange={(e) => handleUpdateSlide(idx, "linkLabel", e.target.value)}
                        placeholder="Explore Collection →"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                      ছবি ইউআরএল (Banner Image URL)
                    </label>
                    <input
                      type="url"
                      value={slide.image}
                      onChange={(e) => handleUpdateSlide(idx, "image", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono text-gray-600 focus:ring-2 focus:ring-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                      টার্গেট লিংক (Link URL)
                    </label>
                    <input
                      type="text"
                      value={slide.linkHref}
                      onChange={(e) => handleUpdateSlide(idx, "linkHref", e.target.value)}
                      placeholder="/shop বা /painting/slug"
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono text-gray-600 focus:ring-2 focus:ring-[#d4af37]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
