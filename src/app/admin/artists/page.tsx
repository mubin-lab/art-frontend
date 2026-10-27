"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Artist } from "@/types";
import { getAdminArtists, createArtist } from "@/lib/api/admin";

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New artist form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    movement: "",
    avatar: "",
    bio: "",
  });

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const data = await getAdminArtists();
      setArtists(data);
    } catch (err) {
      console.error("Failed to load artists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("অনুগ্রহ করে শিল্পীর নাম লিখুন।");
      return;
    }

    try {
      setSaving(true);
      const newArtist = await createArtist({
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        movement: formData.movement || "Master Artist",
        avatar:
          formData.avatar ||
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
        bio: formData.bio || "",
        artworkCount: 0,
      });

      setArtists((prev) => [...prev, newArtist]);
      setIsModalOpen(false);
      setFormData({ name: "", slug: "", movement: "", avatar: "", bio: "" });
      showToast(`শিল্পী "${newArtist.name}" সফলভাবে যুক্ত করা হয়েছে!`);
    } catch (err) {
      alert("শিল্পী যুক্ত করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  };

  const filteredArtists = useMemo(() => {
    if (!search.trim()) return artists;
    const q = search.toLowerCase().trim();
    return artists.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.movement && a.movement.toLowerCase().includes(q)) ||
        (a.bio && a.bio.toLowerCase().includes(q))
    );
  }, [artists, search]);

  return (
    <div className="space-y-6">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            শিল্পী ব্যবস্থাপনা (Artists Manager)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            আর্ট কালেকশনের কিংবদন্তি শিল্পীদের প্রোফাইল, বায়ো ও আর্ট মুভমেন্ট
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d4af37] text-white rounded-lg text-sm font-semibold hover:bg-[#b8972e] transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            নতুন শিল্পী যোগ করুন
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="শিল্পীর নাম বা মুভমেন্ট দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="text-xs text-gray-500 font-medium">
          মোট শিল্পী: <span className="font-bold text-gray-900">{artists.length} জন</span>
        </div>
      </div>

      {/* Artists Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#d4af37] mb-3"></div>
          <p className="text-sm text-gray-500 font-medium">শিল্পী তালিকা লোড হচ্ছে...</p>
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-base font-semibold text-gray-800">কোনো শিল্পী পাওয়া যায়নি</p>
          <p className="text-xs text-gray-500 mt-1">
            নতুন শিল্পী তৈরি করতে &quot;নতুন শিল্পী যোগ করুন&quot; বাটনে চাপুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div
              key={artist.slug}
              className="bg-white rounded-xl border border-gray-200/90 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0 border-2 border-[#d4af37]/30 shadow-xs">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 truncate">{artist.name}</h3>
                    {artist.movement && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {artist.movement}
                      </span>
                    )}
                    <p className="text-xs text-gray-400 font-mono mt-1">/artists/{artist.slug}</p>
                  </div>
                </div>

                {artist.bio && (
                  <p className="text-xs text-gray-600 mt-4 line-clamp-3 leading-relaxed">
                    {artist.bio}
                  </p>
                )}
              </div>

              <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">
                  আর্টওয়ার্ক: <strong className="text-gray-800">{artist.artworkCount || 0} টি</strong>
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/artists/${artist.slug}`}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                  >
                    লাইভ পেজ
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Artist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-serif font-bold text-gray-900 mb-1">নতুন শিল্পী যোগ করুন</h2>
            <p className="text-xs text-gray-500 mb-6">
              শিল্পী যোগ করার পর আপনি সরাসরি পেইন্টিং তৈরির সময় এই শিল্পীকে নির্বাচন করতে পারবেন।
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  শিল্পীর নাম (Artist Name) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="যেমন: Zainul Abedin বা Claude Monet"
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  ইউআরএল স্লাগ (Slug)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="zainul-abedin"
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm font-mono text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  আর্ট মুভমেন্ট বা ঘরানা (Art Movement)
                </label>
                <input
                  type="text"
                  value={formData.movement}
                  onChange={(e) => setFormData((prev) => ({ ...prev, movement: e.target.value }))}
                  placeholder="যেমন: Bengal Modernism, Post-Impressionism, Renaissance"
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  পোর্ট্রেট ছবি ইউআরএল (Avatar Image URL)
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm font-mono text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  সংক্ষিপ্ত জীবনী (Biography)
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="শিল্পীর জীবন ও আর্ট দর্শন সম্পর্কে ২-৩ লাইন লিখুন..."
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#d4af37] text-white rounded-lg text-xs font-bold hover:bg-[#b8972e] transition shadow-sm disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />}
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
