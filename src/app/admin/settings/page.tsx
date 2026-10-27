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
      showToast("Store settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#d4af37] mb-3" />
        <p className="text-sm text-gray-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#d4af37]/40 flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)]">
          Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans mt-0.5">
          Manage hotline phone, support email, and delivery fee rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-[#e8dfd1] p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
            Store Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#ceab51]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#ceab51]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Hotline Phone *
              </label>
              <input
                type="text"
                required
                value={config.phone}
                onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                placeholder="+880 1700-000000"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-mono focus:ring-1 focus:ring-[#ceab51]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Support Email *
              </label>
              <input
                type="email"
                required
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                placeholder="support@yourmuseum.art"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-mono focus:ring-1 focus:ring-[#ceab51]"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rates */}
        <div className="bg-white rounded-2xl border border-[#e8dfd1] p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
            Delivery Fees (BDT ৳)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Inside Dhaka (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-gray-400 font-bold">৳</span>
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
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Outside Dhaka (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-gray-400 font-bold">৳</span>
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
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Free Delivery Above (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-gray-400 font-bold">৳</span>
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
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#ceab51] hover:bg-[#b8953c] text-black rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-black border-t-transparent" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
