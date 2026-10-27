"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Trash2,
  ExternalLink,
  Edit,
  Filter,
  Palette,
  AlertCircle,
  Truck,
} from "lucide-react";
import { getAdminPaintings, deletePainting } from "@/lib/api/admin";
import type { Painting } from "@/types";

export default function AdminPaintingsPage() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrientation, setSelectedOrientation] = useState<string>("all");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminPaintings();
      setPaintings(data);
    } catch (err: any) {
      setError("Failed to load paintings from API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the store catalog?`)) {
      return;
    }
    try {
      setDeletingSlug(slug);
      await deletePainting(slug);
      setPaintings((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err: any) {
      alert("Failed to delete painting. Please try again.");
    } finally {
      setDeletingSlug(null);
    }
  };

  const filteredPaintings = useMemo(() => {
    return paintings.filter((p) => {
      const matchSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.artistName.toLowerCase().includes(search.toLowerCase());

      const matchOrientation =
        selectedOrientation === "all" || p.orientation === selectedOrientation;

      return matchSearch && matchOrientation;
    });
  }, [paintings, search, selectedOrientation]);

  return (
    <div className="space-y-6">
      {/* Top Banner and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#a87e1a] uppercase">
            CATALOG INVENTORY
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] mt-1">
            All Paintings & Masterpieces
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans mt-0.5">
            Manage your framed canvas artwork collection, base pricing, and collector details.
          </p>
        </div>

        <Link
          href="/admin/paintings/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ceab51] hover:bg-[#b8953c] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Painting</span>
        </Link>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8dfd1] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#e8dfd1] text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[var(--color-muted)] font-sans hidden sm:inline">
            Orientation:
          </span>
          <select
            value={selectedOrientation}
            onChange={(e) => setSelectedOrientation(e.target.value)}
            className="w-full sm:w-auto text-xs px-3 py-2 rounded-xl border border-[#e8dfd1] bg-white text-neutral-800 font-sans cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
          >
            <option value="all">All Orientations</option>
            <option value="horizontal">Horizontal (3:2)</option>
            <option value="vertical">Vertical (2:3)</option>
            <option value="square">Square (1:1)</option>
          </select>

          <span className="text-xs font-mono font-bold text-[var(--color-muted)] px-2">
            {filteredPaintings.length} items
          </span>
        </div>
      </div>

      {/* Paintings Table */}
      <div className="bg-white rounded-2xl border border-[#e8dfd1] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-sm text-[var(--color-muted)] font-sans">
            Loading catalog artworks from API...
          </div>
        ) : filteredPaintings.length === 0 ? (
          <div className="p-16 text-center text-sm text-[var(--color-muted)] font-sans">
            No artworks match your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#faf8f5] text-[11px] font-mono uppercase text-[var(--color-muted)] border-b border-[#e8dfd1]">
                  <th className="py-3 px-4">Artwork</th>
                  <th className="py-3 px-4">Artist</th>
                  <th className="py-3 px-4">Aspect</th>
                  <th className="py-3 px-4">Base Price (1 Ft)</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Delivery</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee6da]">
                {filteredPaintings.map((p) => (
                  <tr key={p.id} className="hover:bg-[#faf9f6] transition-colors">
                    {/* Artwork Thumb & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 border border-[#e8dfd1] flex-shrink-0">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-[220px]">
                          <span className="font-serif font-semibold text-sm text-[var(--color-ink)] truncate block">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-[var(--color-muted)] font-mono block">
                            ID: {p.id} · {p.year}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Artist */}
                    <td className="py-3 px-4 font-sans font-medium text-[var(--color-ink)]">
                      {p.artistName}
                    </td>

                    {/* Aspect / Orientation */}
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                        {p.orientation || "horizontal"}
                      </span>
                    </td>

                    {/* Base Price */}
                    <td className="py-3 px-4 font-bold font-sans text-sm text-[var(--color-ink)]">
                      ৳{(p.priceFrom || 0).toLocaleString()}
                    </td>

                    {/* Discount */}
                    <td className="py-3 px-4">
                      {p.discountPercent ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {p.discountPercent}% OFF
                        </span>
                      ) : (
                        <span className="text-[var(--color-muted)]">—</span>
                      )}
                    </td>

                    {/* Delivery Fee */}
                    <td className="py-3 px-4">
                      {p.freeDelivery ? (
                        <span className="text-emerald-600 font-bold text-[11px]">Free</span>
                      ) : (
                        <span className="text-[11px] font-medium text-[var(--color-muted)]">
                          ৳{p.deliveryFee || 70}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/paintings/${p.slug}/edit`}
                          title="Edit artwork"
                          className="p-1.5 rounded-lg border border-[#e8dfd1] hover:bg-amber-50 text-[#a87e1a] transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/painting/${p.slug}`}
                          target="_blank"
                          title="View on live website"
                          className="p-1.5 rounded-lg border border-[#e8dfd1] hover:bg-neutral-100 text-neutral-600 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.slug, p.title)}
                          disabled={deletingSlug === p.slug}
                          title="Delete from catalog"
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
