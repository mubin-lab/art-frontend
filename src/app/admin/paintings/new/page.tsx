"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { getAdminArtists, createPainting } from "@/lib/api/admin";
import type { Artist, CustomerFeedback, FrameOrientation, SizeOption } from "@/types";
import { getSizesForPainting } from "@/lib/sizes";

export default function AdminNewPaintingPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields - Clean initial state, no garbage defaults
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [artistSlug, setArtistSlug] = useState("");
  const [artistName, setArtistName] = useState("");
  const [movement, setMovement] = useState("");
  const [image, setImage] = useState("");
  const [orientation, setOrientation] = useState<FrameOrientation>("horizontal");
  const [priceFrom, setPriceFrom] = useState<number>(35000);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number>(70);
  const [year, setYear] = useState("");
  const [medium, setMedium] = useState("Canvas Print on Solid Wood Frame");
  const [location, setLocation] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [featured, setFeatured] = useState(false);

  // Dynamic Repeaters - Clean empty initial states
  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [newDetailInput, setNewDetailInput] = useState("");

  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [newParagraphInput, setNewParagraphInput] = useState("");

  const [customerFeedbacks, setCustomerFeedbacks] = useState<CustomerFeedback[]>([]);
  const [newFeedback, setNewFeedback] = useState<CustomerFeedback>({
    customer_name: "",
    customer_img: "",
    customer_product: "",
    feedback: "",
    rating: 5,
    customer_location: "Dhaka",
  });

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const data = await getAdminArtists();
      setArtists(data);
      if (data.length > 0) {
        setArtistSlug(data[0].slug);
        setArtistName(data[0].name);
        if (data[0].movement) setMovement(data[0].movement);
      }
    } catch (e) {
      console.error("Failed to load artists", e);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(autoSlug);
  };

  const handleArtistSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = e.target.value;
    setArtistSlug(selectedSlug);
    const found = artists.find((a) => a.slug === selectedSlug);
    if (found) {
      setArtistName(found.name);
      if (found.movement && !movement) {
        setMovement(found.movement);
      }
    }
  };

  // Calculated Sizes from Orientation and Base Price
  const calculatedSizes: SizeOption[] = useMemo(() => {
    return getSizesForPainting(orientation, priceFrom || 0);
  }, [orientation, priceFrom]);

  // Calculated strike-through priceWas
  const calculatedPriceWas = useMemo(() => {
    if (!discountPercent || discountPercent <= 0) return undefined;
    return Math.round((priceFrom || 0) / (1 - discountPercent / 100));
  }, [priceFrom, discountPercent]);

  // Handlers for dynamic repeaters
  const handleAddDetailImage = () => {
    if (!newDetailInput.trim()) return;
    setDetailImages((prev) => [...prev, newDetailInput.trim()]);
    setNewDetailInput("");
  };

  const handleRemoveDetailImage = (index: number) => {
    setDetailImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddParagraph = () => {
    if (!newParagraphInput.trim()) return;
    setDescriptions((prev) => [...prev, newParagraphInput.trim()]);
    setNewParagraphInput("");
  };

  const handleRemoveParagraph = (index: number) => {
    setDescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFeedback = () => {
    if (!newFeedback.customer_name.trim() || !newFeedback.feedback.trim()) {
      alert("Customer name and feedback review text are required.");
      return;
    }
    setCustomerFeedbacks((prev) => [
      ...prev,
      {
        ...newFeedback,
        customer_img:
          newFeedback.customer_img ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
        customer_product: newFeedback.customer_product || image,
      },
    ]);
    setNewFeedback({
      customer_name: "",
      customer_img: "",
      customer_product: "",
      feedback: "",
      rating: 5,
      customer_location: "Dhaka",
    });
  };

  const handleRemoveFeedback = (index: number) => {
    setCustomerFeedbacks((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please enter an artwork title");
      return;
    }
    if (!priceFrom || priceFrom <= 0) {
      setErrorMsg("Please enter a valid Base Price (priceFrom) in BDT");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);

      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        artistSlug,
        artistName: artistName || "Master Artist",
        movement: movement || "Masterpiece",
        image: image || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80",
        orientation,
        priceFrom: Number(priceFrom),
        priceWas: calculatedPriceWas,
        discountPercent: Number(discountPercent) || 0,
        freeDelivery,
        deliveryFee: freeDelivery ? 0 : Number(deliveryFee) || 70,
        currency: "BDT" as const,
        year: year || undefined,
        medium,
        location: location || undefined,
        dimensions: dimensions || undefined,
        bestseller,
        featured,
        sizes: calculatedSizes,
        description: descriptions[0] || title,
        descriptions: descriptions.length > 0 ? descriptions : [title],
        descriptionImage: detailImages,
        customerFeedbacks,
        frames: [
          { id: "gold", name: "Gold" as const, swatch: "#d4af37" },
          { id: "white", name: "Silver white" as const, swatch: "#f4f4f4" },
          { id: "silver", name: "Silver" as const, swatch: "#c0c0c0" },
        ],
      };

      await createPainting(payload);
      router.push("/admin/paintings");
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Failed to create artwork.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/paintings"
            className="p-2 rounded-xl bg-white border border-[#e8dfd1] text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
              Add New Painting
            </h1>
            <p className="text-xs text-[var(--color-muted)] font-sans mt-0.5">
              Add artwork to the catalog with automatic size & price calculation.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Core Details */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)] border-b border-[#eee6da] pb-2">
              1. Artwork Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-neutral-700">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Starry Night"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">URL Slug</label>
                <input
                  type="text"
                  placeholder="the-starry-night"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-mono bg-neutral-50 text-neutral-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Artist *</label>
                <select
                  value={artistSlug}
                  onChange={handleArtistSelect}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans bg-white focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                >
                  {artists.map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Art Movement</label>
                <input
                  type="text"
                  placeholder="e.g. Post-Impressionism"
                  value={movement}
                  onChange={(e) => setMovement(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Year</label>
                <input
                  type="text"
                  placeholder="e.g. 1889"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-neutral-700">High-Res Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Orientation *</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as FrameOrientation)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans bg-white focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                >
                  <option value="horizontal">Horizontal (3:2)</option>
                  <option value="vertical">Vertical (2:3)</option>
                  <option value="square">Square (1:1)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Location / Gallery</label>
                <input
                  type="text"
                  placeholder="e.g. Museum of Modern Art"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="pt-2 border-t border-[#eee6da] flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bestseller}
                  onChange={(e) => setBestseller(e.target.checked)}
                  className="rounded text-[#ceab51] focus:ring-[#ceab51]"
                />
                <span>Mark as Bestseller</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-[#ceab51] focus:ring-[#ceab51]"
                />
                <span>Featured on Homepage</span>
              </label>
            </div>
          </div>

          {/* Section 2: Pricing & Delivery */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)] border-b border-[#eee6da] pb-2">
              2. Pricing & Delivery (BDT ৳)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Base Price (1 Ft Size) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">৳</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={priceFrom || ""}
                    onChange={(e) => setPriceFrom(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Discount %</label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={discountPercent || ""}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Original Price (Was)</label>
                <div className="px-3 py-2 rounded-xl border border-[#eee6da] bg-neutral-50 text-xs font-mono">
                  {calculatedPriceWas ? (
                    <span className="text-neutral-500 line-through font-bold">
                      ৳{calculatedPriceWas.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-neutral-400">No discount</span>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="pt-2 border-t border-[#eee6da] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={freeDelivery}
                  onChange={(e) => setFreeDelivery(e.target.checked)}
                  className="rounded text-[#ceab51] focus:ring-[#ceab51]"
                />
                <span>Free Delivery for this artwork</span>
              </label>

              {!freeDelivery && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-600">Delivery Fee:</span>
                  <input
                    type="number"
                    min="0"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-20 px-2 py-1 rounded-lg border border-[#d9d0c1] text-xs font-mono font-bold text-center"
                  />
                  <span className="text-xs text-neutral-500 font-mono">৳</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Detail Close-up Images */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee6da] pb-2">
              <h2 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                3. Detail Close-up Images
              </h2>
              <span className="text-xs text-neutral-400 font-mono">({detailImages.length} images)</span>
            </div>

            <div className="space-y-2">
              {detailImages.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl border border-[#eee6da] bg-neutral-50">
                  <span className="w-5 h-5 rounded-full bg-white border border-neutral-200 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-mono text-neutral-600 truncate flex-1">{img}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDetailImage(idx)}
                    className="p-1 text-red-500 hover:text-red-700 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <input
                  type="url"
                  placeholder="https://... image URL"
                  value={newDetailInput}
                  onChange={(e) => setNewDetailInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-[#d9d0c1] text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddDetailImage}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-black"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Customer Feedbacks */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee6da] pb-2">
              <h2 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                4. Customer Feedbacks
              </h2>
              <span className="text-xs text-neutral-400 font-mono">({customerFeedbacks.length} reviews)</span>
            </div>

            <div className="space-y-3">
              {customerFeedbacks.map((fb, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-[#eee6da] bg-neutral-50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">{fb.customer_name} ({fb.customer_location})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeedback(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-neutral-600 italic">&quot;{fb.feedback}&quot;</p>
                </div>
              ))}

              {/* Add Feedback Box */}
              <div className="p-3 rounded-xl border border-dashed border-[#d9d0c1] bg-[#faf8f5] space-y-2">
                <span className="text-xs font-bold text-neutral-700 block">+ Add Customer Feedback:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={newFeedback.customer_name}
                    onChange={(e) => setNewFeedback({ ...newFeedback, customer_name: e.target.value })}
                    className="px-2.5 py-1.5 rounded-lg border border-[#d9d0c1] text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Gulshan, Dhaka)"
                    value={newFeedback.customer_location}
                    onChange={(e) => setNewFeedback({ ...newFeedback, customer_location: e.target.value })}
                    className="px-2.5 py-1.5 rounded-lg border border-[#d9d0c1] text-xs bg-white"
                  />
                  <input
                    type="url"
                    placeholder="Customer Avatar URL"
                    value={newFeedback.customer_img}
                    onChange={(e) => setNewFeedback({ ...newFeedback, customer_img: e.target.value })}
                    className="px-2.5 py-1.5 rounded-lg border border-[#d9d0c1] text-xs font-mono bg-white"
                  />
                  <input
                    type="url"
                    placeholder="Wall Photo URL (Customer Product)"
                    value={newFeedback.customer_product}
                    onChange={(e) => setNewFeedback({ ...newFeedback, customer_product: e.target.value })}
                    className="px-2.5 py-1.5 rounded-lg border border-[#d9d0c1] text-xs font-mono bg-white"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Feedback comment..."
                  value={newFeedback.feedback}
                  onChange={(e) => setNewFeedback({ ...newFeedback, feedback: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d0c1] text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddFeedback}
                  className="px-3 py-1.5 bg-[#ceab51] text-black rounded-lg text-xs font-bold hover:bg-[#b8953c]"
                >
                  Add Review
                </button>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/admin/paintings"
              className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#ceab51] hover:bg-[#b8953c] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Save Artwork</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Store Preview (Col 5) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee6da] pb-3">
              <span className="font-serif text-sm font-semibold text-[var(--color-ink)] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#ceab51]" />
                Live Card Preview
              </span>
              <span className="text-[10px] font-mono uppercase bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-bold">
                {orientation}
              </span>
            </div>

            {/* Artwork Card */}
            <div className="rounded-xl overflow-hidden border border-[#e8dfd1] bg-[#faf8f5]">
              <div
                className={`relative w-full bg-neutral-200 overflow-hidden ${
                  orientation === "horizontal"
                    ? "aspect-3/2"
                    : orientation === "vertical"
                    ? "aspect-2/3"
                    : "aspect-square"
                }`}
              >
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-mono">
                    Paste Image URL to Preview
                  </div>
                )}

                {discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    {discountPercent}% OFF
                  </div>
                )}

                {freeDelivery && (
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    FREE DELIVERY
                  </div>
                )}
              </div>

              <div className="p-4 space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-mono block">
                  {artistName || "Artist Name"}
                </span>
                <h3 className="font-serif text-sm font-semibold text-[var(--color-ink)] truncate">
                  {title || "Artwork Title"}
                </h3>
                <div className="pt-2 flex items-baseline gap-2 border-t border-[#eee6da]">
                  <span className="text-base font-bold text-[var(--color-ink)] font-mono">
                    ৳{(priceFrom || 0).toLocaleString()}
                  </span>
                  {calculatedPriceWas && (
                    <span className="text-xs text-[var(--color-muted)] line-through font-mono">
                      ৳{calculatedPriceWas.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[10px] text-neutral-400 ml-auto font-mono">Base 1 Ft</span>
                </div>
              </div>
            </div>

            {/* Calculated Sizes List */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">
                Auto Calculated Sizes (5 Options):
              </span>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {calculatedSizes.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2.5 py-1 rounded bg-[#faf8f5] border border-[#eee6da] text-[11px]"
                  >
                    <span className="font-sans text-neutral-700">{s.label}</span>
                    <span className="font-mono font-bold text-[var(--color-ink)]">
                      ৳{(s.price || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
