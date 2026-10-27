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
    setTimeout(() => setToastMsg(null), 3000);
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
    if (!formData.name.trim()) {
      alert("Please enter artist name.");
      return;
    }

    try {
      setSaving(true);
      const newArtist = await createArtist({
        name: formData.name.trim(),
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
      showToast(`Artist "${newArtist.name}" added successfully.`);
    } catch (err) {
      alert("Failed to add artist. Please try again.");
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
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#d4af37]/40 flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)]">
            Artists
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans mt-0.5">
            Manage artists, profiles, art movements, and catalog attributions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ceab51] text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#b8953c] transition shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Artist
          </button>
        </div>
      </div>

      {/* Search & Count Bar */}
      <div className="bg-white rounded-2xl border border-[#e8dfd1] p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by artist name or movement..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          Total Artists: <strong className="text-gray-900">{artists.length}</strong>
        </div>
      </div>

      {/* Artists Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#e8dfd1] p-12 text-center text-xs text-gray-500">
          Loading artists...
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8dfd1] p-12 text-center text-xs text-gray-500">
          No artists found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div
              key={artist.slug}
              className="bg-white rounded-2xl border border-[#e8dfd1] shadow-2xs hover:shadow-xs transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{artist.name}</h3>
                    {artist.movement && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {artist.movement}
                      </span>
                    )}
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">/artists/{artist.slug}</p>
                  </div>
                </div>

                {artist.bio && (
                  <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                    {artist.bio}
                  </p>
                )}
              </div>

              <div className="px-5 py-3 bg-[#faf8f5] border-t border-[#eee6da] flex items-center justify-between text-xs">
                <span className="text-gray-500 font-mono">
                  Artworks: <strong className="text-gray-800">{artist.artworkCount || 0}</strong>
                </span>
                <Link
                  href={`/artists/${artist.slug}`}
                  target="_blank"
                  className="text-gray-600 hover:text-black font-semibold flex items-center gap-1"
                >
                  Live Page
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Artist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-gray-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-lg font-serif font-bold text-gray-900 mb-1">Add Artist</h2>
            <p className="text-xs text-gray-500 mb-4">
              Add a new master artist profile to assign artworks in the gallery.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Artist Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Zainul Abedin or Claude Monet"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="zainul-abedin"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono text-gray-600 focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Art Movement
                </label>
                <input
                  type="text"
                  value={formData.movement}
                  onChange={(e) => setFormData((prev) => ({ ...prev, movement: e.target.value }))}
                  placeholder="e.g. Modern Art, Bengal Modernism, Post-Impressionism"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono text-gray-600 focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Biography
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Short artist bio and background..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#ceab51] text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#b8953c] transition shadow-sm disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && <span className="animate-spin rounded-full h-3 w-3 border-2 border-black border-t-transparent" />}
                  Save Artist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
