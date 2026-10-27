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
  Info,
  Check,
  Star,
  MapPin,
  Image as ImageIcon,
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

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [artistSlug, setArtistSlug] = useState("");
  const [artistName, setArtistName] = useState("");
  const [movement, setMovement] = useState("Post-Impressionism");
  const [image, setImage] = useState("");
  const [orientation, setOrientation] = useState<FrameOrientation>("horizontal");
  const [priceFrom, setPriceFrom] = useState<number>(35000);
  const [discountPercent, setDiscountPercent] = useState<number>(50);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number>(70);
  const [year, setYear] = useState("1889");
  const [medium, setMedium] = useState("Oil on canvas");
  const [location, setLocation] = useState("Museum of Modern Art, New York");
  const [dimensions, setDimensions] = useState("73.7 cm × 92.1 cm");
  const [bestseller, setBestseller] = useState(true);
  const [featured, setFeatured] = useState(true);

  // Dynamic Repeaters
  const [detailImages, setDetailImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&q=80",
  ]);

  const [descriptions, setDescriptions] = useState<string[]>([
    "Painted during a period of intense artistic expression, this celebrated masterpiece embodies the pinnacle of Western art...",
    "The composition features expressive impasto brushstrokes, layered tones, and striking contrasts that transform any residential or commercial interior...",
  ]);

  const [customerFeedbacks, setCustomerFeedbacks] = useState<CustomerFeedback[]>([
    {
      customer_name: "Tanvir Rahman",
      customer_img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
      customer_product: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
      feedback: "The canvas print resolution and rich textured finish on this piece are breathtaking! The Gold frame has a regal weight.",
      rating: 5,
      customer_location: "Gulshan-2, Dhaka",
    },
  ]);

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
      }
    } catch (e) {
      console.error(e);
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
    }
  };

  // Calculated Sizes from Orientation and Base Price
  const calculatedSizes: SizeOption[] = useMemo(() => {
    return getSizesForPainting(orientation, priceFrom);
  }, [orientation, priceFrom]);

  // Calculated strike-through priceWas
  const calculatedPriceWas = useMemo(() => {
    if (!discountPercent || discountPercent <= 0) return undefined;
    return Math.round(priceFrom / (1 - discountPercent / 100));
  }, [priceFrom, discountPercent]);

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
        artistName,
        movement,
        image: image || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80",
        orientation,
        priceFrom: Number(priceFrom),
        priceWas: calculatedPriceWas,
        discountPercent: Number(discountPercent) || 0,
        freeDelivery,
        deliveryFee: freeDelivery ? 0 : Number(deliveryFee) || 70,
        currency: "BDT" as const,
        year,
        medium,
        location,
        dimensions,
        bestseller,
        featured,
        sizes: calculatedSizes,
        description: descriptions[0] || "",
        descriptions,
        descriptionImage: detailImages.filter((img) => img.trim() !== ""),
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
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/paintings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
        <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Auto-Calculation Engine: Active
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#a8844a]">
            NEW MASTERPIECE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] mt-0.5">
            Add Artwork to Gallery
          </h1>
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
          {/* Card 1: Core Details */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)] border-b border-[#eee6da] pb-2">
              1. Primary Artwork Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-neutral-700">Artwork Title *</label>
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
                <label className="text-xs font-bold text-neutral-700">URL Slug (Auto-generated)</label>
                <input
                  type="text"
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
                  value={movement}
                  onChange={(e) => setMovement(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Year of Original</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Original Medium</label>
                <input
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Original Museum Dimensions</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-neutral-700">Current Museum Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Pricing, Canvas Orientation & Delivery */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)] border-b border-[#eee6da] pb-2">
              2. Sizing, Pricing & Delivery (BDT ৳)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Canvas Orientation *</label>
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
                <label className="text-xs font-bold text-neutral-700">Base Price (1 Feet) in BDT *</label>
                <input
                  type="number"
                  required
                  min={100}
                  step={10}
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Discount Badge (%)</label>
                <input
                  type="number"
                  min={0}
                  max={90}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-mono font-bold text-amber-600 focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>
            </div>

            {/* Auto-Calculated Multiplier Sizes Info Table */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8dfd1] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#a8844a]">
                <span>Automatic Sizing Multipliers ({orientation}):</span>
                <span>Auto-computed</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {calculatedSizes.map((s, idx) => (
                  <div key={s.id} className="p-2 rounded-lg bg-white border border-[#eee6da]">
                    <div className="font-bold text-[var(--color-ink)]">{s.feetLabel}</div>
                    <div className="text-[10px] text-[var(--color-muted)] font-mono">{s.dimensions}</div>
                    <div className="font-bold text-[#a8844a] mt-1">৳{(s.price || 0).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Charge Toggle & Fee */}
            <div className="pt-2 border-t border-[#eee6da] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-800">
                <input
                  type="checkbox"
                  checked={freeDelivery}
                  onChange={(e) => setFreeDelivery(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ceab51] focus:ring-0 cursor-pointer"
                />
                <span>Free Delivery Across Bangladesh (৳0)</span>
              </label>

              {!freeDelivery && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-700">Delivery Fee (BDT):</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-24 px-2 py-1.5 rounded-lg border border-[#d9d0c1] text-xs font-mono font-bold"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Images & Detail Close-ups */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)] border-b border-[#eee6da] pb-2">
              3. Artwork Imagery & Detail Close-ups
            </h2>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700">Primary Artwork Image URL *</label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-mono"
              />
            </div>

            {/* descriptionImage repeater */}
            <div className="space-y-2 pt-2 border-t border-[#eee6da]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-700">
                    Artwork Detail Close-ups (`descriptionImage: []`)
                  </span>
                  <p className="text-[11px] text-[var(--color-muted)]">
                    Appears inline under story paragraphs and in studio textures.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailImages([...detailImages, ""])}
                  className="text-xs font-bold text-[#a8844a] hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Image</span>
                </button>
              </div>

              {detailImages.map((imgUrl, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder={`Detail Image #${idx + 1} URL`}
                    value={imgUrl}
                    onChange={(e) => {
                      const updated = [...detailImages];
                      updated[idx] = e.target.value;
                      setDetailImages(updated);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#d9d0c1] text-xs font-mono"
                  />
                  {detailImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setDetailImages(detailImages.filter((_, i) => i !== idx))}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Story Paragraphs Repeater */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee6da] pb-2">
              <h2 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                4. Artwork Story & Curatorial Narrative (`descriptions: []`)
              </h2>
              <button
                type="button"
                onClick={() => setDescriptions([...descriptions, ""])}
                className="text-xs font-bold text-[#a8844a] hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Paragraph</span>
              </button>
            </div>

            {descriptions.map((desc, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Paragraph #{idx + 1}</span>
                  {descriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setDescriptions(descriptions.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:underline inline-flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => {
                    const updated = [...descriptions];
                    updated[idx] = e.target.value;
                    setDescriptions(updated);
                  }}
                  placeholder="Write history, style, brushwork, or museum significance..."
                  className="w-full px-3 py-2 rounded-xl border border-[#d9d0c1] text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                />
              </div>
            ))}
          </div>

          {/* Card 5: Customer Feedbacks Repeater (6 fields) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee6da] pb-2">
              <div>
                <h2 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                  5. Customer Feedbacks & Collector Reviews
                </h2>
                <p className="text-[11px] text-[var(--color-muted)]">
                  Feeds into the interactive feedback slider above FAQ on the product page.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setCustomerFeedbacks([
                    ...customerFeedbacks,
                    {
                      customer_name: "",
                      customer_img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop",
                      customer_product: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
                      feedback: "",
                      rating: 5,
                      customer_location: "Dhanmondi, Dhaka",
                    },
                  ])
                }
                className="text-xs font-bold text-[#a8844a] hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Review</span>
              </button>
            </div>

            {customerFeedbacks.map((fb, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8dfd1] space-y-3 relative"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#a8844a]">
                  <span>Review #{idx + 1}</span>
                  {customerFeedbacks.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setCustomerFeedbacks(customerFeedbacks.filter((_, i) => i !== idx))
                      }
                      className="text-red-500 hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-0.5">Customer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tanvir Rahman"
                      value={fb.customer_name}
                      onChange={(e) => {
                        const updated = [...customerFeedbacks];
                        updated[idx].customer_name = e.target.value;
                        setCustomerFeedbacks(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d0c1] bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-0.5">Location in Bangladesh</label>
                    <input
                      type="text"
                      placeholder="e.g. Gulshan-2, Dhaka"
                      value={fb.customer_location}
                      onChange={(e) => {
                        const updated = [...customerFeedbacks];
                        updated[idx].customer_location = e.target.value;
                        setCustomerFeedbacks(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d0c1] bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-0.5">Customer Avatar Image URL</label>
                    <input
                      type="url"
                      value={fb.customer_img}
                      onChange={(e) => {
                        const updated = [...customerFeedbacks];
                        updated[idx].customer_img = e.target.value;
                        setCustomerFeedbacks(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d0c1] bg-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-0.5">Customer Wall/Room Photo URL (`customer_product`)</label>
                    <input
                      type="url"
                      value={fb.customer_product || ""}
                      onChange={(e) => {
                        const updated = [...customerFeedbacks];
                        updated[idx].customer_product = e.target.value;
                        setCustomerFeedbacks(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d0c1] bg-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-0.5">Star Rating (1-5)</label>
                    <select
                      value={fb.rating}
                      onChange={(e) => {
                        const updated = [...customerFeedbacks];
                        updated[idx].rating = Number(e.target.value);
                        setCustomerFeedbacks(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d0c1] bg-white"
                    >
                      <option value={5}>5 Stars (★★★★★)</option>
                      <option value={4.8}>4.8 Stars</option>
                      <option value={4.5}>4.5 Stars</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-neutral-700 block mb-0.5">Feedback Quote</label>
                    <textarea
                      rows={2}
                      value={fb.feedback}
                      onChange={(e) => {
                        const updated = [...customerFeedbacks];
                        updated[idx].feedback = e.target.value;
                        setCustomerFeedbacks(updated);
                      }}
                      placeholder="e.g. The canvas print resolution and rich textured finish on this piece are breathtaking..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#d9d0c1] bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#ceab51] hover:bg-[#b8953c] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? "Publishing Artwork..." : "Publish Artwork to Catalog"}
            </button>
            <Link
              href="/admin/paintings"
              className="px-5 py-3 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Right Column: Live E-Commerce Card Preview (Col 5) */}
        <aside className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#e8dfd1] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#eee6da]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#a8844a] font-mono">
                LIVE STORE PREVIEW
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                Interactive
              </span>
            </div>

            {/* Framed Canvas Mockup */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-neutral-900 border-4 border-[#caa142] shadow-md flex items-center justify-center p-4">
              {image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={title || "Preview"}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="text-center text-neutral-500 text-xs">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span>Enter image URL to preview framed artwork</span>
                </div>
              )}
            </div>

            {/* Title & Artist */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a8844a] font-sans block">
                {movement || "Movement"}
              </span>
              <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)] leading-snug">
                {title || "Artwork Title"}
              </h3>
              <p className="text-xs text-[var(--color-muted)] font-serif italic">
                By {artistName || "Artist Name"} ({year})
              </p>
            </div>

            {/* Price Preview */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#eee6da] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-muted)]">Base Price (1 Feet):</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold font-serif text-[var(--color-ink)]">
                    ৳{(priceFrom || 0).toLocaleString()}
                  </span>
                  {calculatedPriceWas && (
                    <span className="text-xs text-[var(--color-muted)] line-through">
                      ৳{calculatedPriceWas.toLocaleString()}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-[#eee6da] flex items-center justify-between text-[11px] text-[var(--color-muted)]">
                <span>Delivery:</span>
                <span className={freeDelivery ? "text-emerald-600 font-bold" : "text-neutral-700 font-medium"}>
                  {freeDelivery ? "Free Delivery (৳0)" : `৳${deliveryFee || 70}`}
                </span>
              </div>
            </div>

            {/* Sizes computed preview */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block">
                Auto-assigned sizes ({orientation}):
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                {calculatedSizes.map((s) => (
                  <div key={s.id} className="p-1.5 rounded-lg border border-[#e8dfd1] bg-white">
                    <div className="font-bold">{s.feetLabel}</div>
                    <div className="text-[9px] text-neutral-500">{s.dimensions}</div>
                    <div className="font-bold text-[#a8844a]">৳{(s.price || 0).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
