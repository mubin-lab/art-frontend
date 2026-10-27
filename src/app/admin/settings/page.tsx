"use client";

import { useEffect, useState } from "react";
import { getSiteConfig, updateSiteConfig, SiteConfig } from "@/lib/api/admin";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getSiteConfig();
        // default delivery settings if not present
        if (!data.deliverySettings) {
          data.deliverySettings = {
            insideDhakaFee: 70,
            outsideDhakaFee: 120,
            freeDeliveryThreshold: 15000,
          };
        }
        setConfig(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    try {
      setSaving(true);
      const updated = await updateSiteConfig(config);
      setConfig(updated);
      showToast("স্টোর সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
    } catch (err) {
      alert("সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#d4af37] mb-3"></div>
        <p className="text-sm text-gray-500 font-medium">স্টোর সেটিংস লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
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
          স্টোর সেটিংস ও ডেলিভারি কনফিগ (Settings)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          হটলাইন নম্বর, সাপোর্ট ইমেইল এবং ঢাকা ও দেশব্যাপী হোম ডেলিভারি চার্জ নির্ধারণ করুন
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            যোগাযোগ ও কাস্টমার সাপোর্ট তথ্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                স্টোর ব্র্যান্ড নাম (Store Name)
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                ট্যাগলাইন (Brand Tagline)
              </label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                হটলাইন ফোন নম্বর (Hotline Phone) *
              </label>
              <input
                type="text"
                required
                value={config.phone}
                onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                placeholder="+880 1700-000000"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-[#d4af37]"
              />
              <p className="text-[11px] text-gray-400 mt-1">হেডার টপবার ও অর্ডারে প্রদর্শিত হবে</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                সাপোর্ট ইমেইল (Support Email) *
              </label>
              <input
                type="email"
                required
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                placeholder="support@yourmuseum.art"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rates */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            ডেলিভারি ফি সেটিংস (Delivery Fees in BDT ৳)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                ঢাকার ভেতর ডেলিভারি ফি (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-gray-400 font-bold">৳</span>
                <input
                  type="number"
                  min="0"
                  value={config.deliverySettings?.insideDhakaFee ?? 70}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      deliverySettings: {
                        insideDhakaFee: Number(e.target.value),
                        outsideDhakaFee: config.deliverySettings?.outsideDhakaFee ?? 120,
                        freeDeliveryThreshold: config.deliverySettings?.freeDeliveryThreshold ?? 15000,
                      },
                    })
                  }
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">ডিফল্ট: ৳৭০</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                ঢাকার বাইরে ডেলিভারি ফি (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-gray-400 font-bold">৳</span>
                <input
                  type="number"
                  min="0"
                  value={config.deliverySettings?.outsideDhakaFee ?? 120}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      deliverySettings: {
                        insideDhakaFee: config.deliverySettings?.insideDhakaFee ?? 70,
                        outsideDhakaFee: Number(e.target.value),
                        freeDeliveryThreshold: config.deliverySettings?.freeDeliveryThreshold ?? 15000,
                      },
                    })
                  }
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">ডিফল্ট: ৳১২০</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                ফ্রি ডেলিভারি নূন্যতম অর্ডার (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-gray-400 font-bold">৳</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={config.deliverySettings?.freeDeliveryThreshold ?? 15000}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      deliverySettings: {
                        insideDhakaFee: config.deliverySettings?.insideDhakaFee ?? 70,
                        outsideDhakaFee: config.deliverySettings?.outsideDhakaFee ?? 120,
                        freeDeliveryThreshold: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">এত টাকার বেশি অর্ডারে ফ্রি ডেলিভারি</p>
            </div>
          </div>
        </div>

        {/* Currency & Business Model info */}
        <div className="bg-amber-50/60 rounded-xl border border-amber-200/80 p-5 space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              বিজনেস মডেল ও কারেন্সি ভেরিফিকেশন
            </h3>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            স্টোরটি বাংলাদেশি টাকায় (BDT ৳) পরিচালিত। সমস্ত প্রোডাক্ট <strong>মিউজিয়াম-গ্রেড ক্যানভাস আর্ট ও সলিড উড ফ্রেম (Solid Wood Frame)</strong> হিসেবে তৈরি। সাইটজুড়ে অয়েল পেইন্টিং প্রতিস্থাপন করে প্রিমিয়াম ক্যানভাস আর্ট ব্র্যান্ডিং অক্ষুণ্ণ রয়েছে।
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#d4af37] text-white rounded-lg text-sm font-bold hover:bg-[#b8972e] transition shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
            সেটিংস সংরক্ষণ করুন (Save Settings)
          </button>
        </div>
      </form>
    </div>
  );
}
