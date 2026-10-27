"use client";

import { useEffect, useState, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  getAdminPainting,
  updatePainting,
  getAdminArtists,
} from "@/lib/api/admin";
import type { Artist, CustomerFeedback, Painting } from "@/types";

export default function AdminEditPaintingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form Fields
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [artistSlug, setArtistSlug] = useState("");
  const [movement, setMovement] = useState("");
  const [year, setYear] = useState("");
  const [medium, setMedium] = useState("Canvas Print on Solid Wood Frame");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [orientation, setOrientation] = useState<"horizontal" | "vertical" | "square">("horizontal");
  const [bestseller, setBestseller] = useState(false);
  const [featured, setFeatured] = useState(false);

  // Pricing & Delivery
  const [priceFrom, setPriceFrom] = useState(35000);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(70);

  // Dynamic Content
  const [descriptionImages, setDescriptionImages] = useState<string[]>([]);
  const [newDescImage, setNewDescImage] = useState("");

  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [newDescParagraph, setNewDescParagraph] = useState("");

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
    async function loadData() {
      try {
        setLoading(true);
        const [painting, artistList] = await Promise.all([
          getAdminPainting(resolvedParams.slug),
          getAdminArtists(),
        ]);

        setArtists(artistList);

        setId(painting.id);
        setTitle(painting.title);
        setSlug(painting.slug);
        setArtistSlug(painting.artistSlug);
        setMovement(painting.movement || "");
        setYear(painting.year || "");
        setMedium(painting.medium || "Canvas Print on Solid Wood Frame");
        setLocation(painting.location || "");
        setImage(painting.image);
        setOrientation(painting.orientation || "horizontal");
        setBestseller(painting.bestseller || false);
        setFeatured(painting.featured || false);
        setPriceFrom(painting.priceFrom || 35000);
        setDiscountPercent(painting.discountPercent || 0);
        setFreeDelivery(painting.freeDelivery || false);
        setDeliveryFee(painting.deliveryFee || 70);
        setDescriptionImages(painting.descriptionImage || []);
        setDescriptions(painting.descriptions || []);
        setCustomerFeedbacks(painting.customerFeedbacks || []);
      } catch (err) {
        console.error("Failed to load painting:", err);
        setStatusMsg({ type: "error", text: "Failed to load artwork details." });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [resolvedParams.slug]);

  const selectedArtist = useMemo(
    () => artists.find((a) => a.slug === artistSlug),
    [artists, artistSlug]
  );

  const priceWas = useMemo(() => {
    if (!discountPercent || discountPercent <= 0) return 0;
    return Math.round(priceFrom / (1 - discountPercent / 100));
  }, [priceFrom, discountPercent]);

  const sizePricingPreview = useMemo(() => {
    const base = Number(priceFrom) || 0;
    if (orientation === "horizontal") {
      return [
        { size: '1.0 × 1.5 Ft (12" × 18")', price: Math.round(base * 1.0) },
        { size: '1.5 × 2.0 Ft (18" × 24")', price: Math.round(base * 1.35) },
        { size: '2.0 × 3.0 Ft (24" × 36")', price: Math.round(base * 1.95) },
        { size: '2.5 × 3.5 Ft (30" × 42")', price: Math.round(base * 2.55) },
        { size: '3.0 × 4.0 Ft (36" × 48")', price: Math.round(base * 3.25) },
      ];
    } else if (orientation === "vertical") {
      return [
        { size: '1.5 × 1.0 Ft (18" × 12")', price: Math.round(base * 1.0) },
        { size: '2.0 × 1.5 Ft (24" × 18")', price: Math.round(base * 1.35) },
        { size: '3.0 × 2.0 Ft (36" × 24")', price: Math.round(base * 1.95) },
        { size: '3.5 × 2.5 Ft (42" × 30")', price: Math.round(base * 2.55) },
        { size: '4.0 × 3.0 Ft (48" × 36")', price: Math.round(base * 3.25) },
      ];
    } else {
      return [
        { size: '1.0 × 1.0 Ft (12" × 12")', price: Math.round(base * 1.0) },
        { size: '1.5 × 1.5 Ft (18" × 18")', price: Math.round(base * 1.3) },
        { size: '2.0 × 2.0 Ft (24" × 24")', price: Math.round(base * 1.8) },
        { size: '2.5 × 2.5 Ft (30" × 30")', price: Math.round(base * 2.4) },
        { size: '3.0 × 3.0 Ft (36" × 36")', price: Math.round(base * 3.0) },
      ];
    }
  }, [priceFrom, orientation]);

  const handleAddDescriptionImage = () => {
    if (!newDescImage.trim()) return;
    setDescriptionImages((prev) => [...prev, newDescImage.trim()]);
    setNewDescImage("");
  };

  const handleRemoveDescriptionImage = (idx: number) => {
    setDescriptionImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddFeedback = () => {
    if (!newFeedback.customer_name || !newFeedback.feedback) {
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

  const handleRemoveFeedback = (idx: number) => {
    setCustomerFeedbacks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceFrom) {
      setStatusMsg({ type: "error", text: "Title and base price are required." });
      return;
    }

    try {
      setSaving(true);
      setStatusMsg(null);

      const payload: Partial<Painting> = {
        title,
        slug,
        artistSlug,
        artistName: selectedArtist?.name || "Master Artist",
        movement,
        year,
        medium,
        location,
        image,
        orientation,
        priceFrom: Number(priceFrom),
        priceWas: priceWas > 0 ? priceWas : undefined,
        discountPercent: Number(discountPercent),
        freeDelivery,
        deliveryFee: freeDelivery ? 0 : Number(deliveryFee),
        bestseller,
        featured,
        descriptionImage: descriptionImages,
        descriptions: descriptions.length > 0 ? descriptions : [title],
        customerFeedbacks,
      };

      await updatePainting(resolvedParams.slug, payload);

      setStatusMsg({
        type: "success",
        text: `"${title}" updated successfully!`,
      });

      setTimeout(() => {
        router.push("/admin/paintings");
      }, 1000);
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to update artwork.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8dfd1] p-16 text-center text-xs text-neutral-500">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ceab51] border-t-transparent mb-3" />
        <p>Loading artwork details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/paintings"
            className="p-2 rounded-xl bg-white border border-[#e8dfd1] text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)]">
              Edit Artwork
            </h1>
            <p className="text-xs text-[var(--color-muted)] font-sans mt-0.5">
              Update details, pricing, and customer reviews.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/painting/${slug}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View on Site</span>
          </Link>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
            statusMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form Controls (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Card 1: Core Details */}
          <div className="bg-white p-6 rounded-2xl border border-[#e8dfd1] shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)] border-b border-[#eee6da] pb-3">
              1. Artwork Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e8dfd1] text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Artist *
                </label>
                <select
                  value={artistSlug}
                  onChange={(e) => setArtistSlug(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e8dfd1] text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-white cursor-pointer"
                >
                  {artists.map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Orientation *
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e8dfd1] text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-white cursor-pointer"
                >
                  <option value="horizontal">Horizontal (3:2)</option>
                  <option value="vertical">Vertical (2:3)</option>
                  <option value="square">Square (1:1)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e8dfd1] text-xs font-mono text-neutral-600 focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Art Movement
                </label>
                <input
                  type="text"
                  value={movement}
                  onChange={(e) => setMovement(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e8dfd1] text-xs font-sans bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e8dfd1] text-xs font-sans bg-[#faf8f5]"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Pricing */}
          <div className="bg-white p-6 rounded-2xl border border-[#e8dfd1] shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)] border-b border-[#eee6da] pb-3">
              2. Pricing & Delivery (BDT ৳)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Base Price (1 Ft) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-[#e8dfd1] text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Discount %
                </label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e8dfd1] text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Was Price
                </label>
                <div className="py-2 px-3.5 rounded-xl border border-[#e8dfd1] bg-neutral-50 text-xs font-mono">
                  {priceWas > 0 ? (
                    <span className="line-through text-neutral-500 font-bold">
                      ৳{priceWas.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-neutral-400">No discount</span>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Switch */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#eee6da]">
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
                    className="w-20 px-2 py-1 rounded-lg border border-[#e8dfd1] text-xs font-mono font-bold text-center"
                  />
                  <span className="text-xs text-neutral-500 font-mono">৳</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Detail Close-up Images */}
          <div className="bg-white p-6 rounded-2xl border border-[#e8dfd1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee6da] pb-3">
              <h2 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                3. Detail Close-up Images
              </h2>
              <span className="text-xs font-mono text-neutral-500">
                ({descriptionImages.length} images)
              </span>
            </div>

            <div className="space-y-2">
              {descriptionImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 rounded-xl border border-[#e8dfd1] bg-[#faf8f5]"
                >
                  <img
                    src={imgUrl}
                    alt="Detail"
                    className="w-10 h-10 rounded-lg object-cover border border-[#e8dfd1] shrink-0"
                  />
                  <span className="text-xs font-mono text-neutral-600 truncate flex-1">
                    {imgUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDescriptionImage(idx)}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <input
                  type="url"
                  placeholder="https://... image URL"
                  value={newDescImage}
                  onChange={(e) => setNewDescImage(e.target.value)}
                  className="flex-1 px-3.5 py-1.5 rounded-xl border border-[#e8dfd1] text-xs font-mono focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
                />
                <button
                  type="button"
                  onClick={handleAddDescriptionImage}
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Customer Feedbacks */}
          <div className="bg-white p-6 rounded-2xl border border-[#e8dfd1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee6da] pb-3">
              <h2 className="font-serif text-base font-semibold text-[var(--color-ink)]">
                4. Customer Feedbacks
              </h2>
              <span className="text-xs font-mono text-neutral-500">
                ({customerFeedbacks.length} reviews)
              </span>
            </div>

            <div className="space-y-3">
              {customerFeedbacks.map((fb, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[#e8dfd1] bg-[#faf8f5] flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-neutral-900">
                        {fb.customer_name} ({fb.customer_location})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeedback(idx)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 italic">
                      &quot;{fb.feedback}&quot;
                    </p>
                  </div>
                </div>
              ))}

              {/* Add Feedback Box */}
              <div className="p-3.5 rounded-xl border border-dashed border-[#d9d0c1] bg-[#faf8f5] space-y-2">
                <span className="text-xs font-bold text-neutral-700 block">
                  + Add Customer Review:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={newFeedback.customer_name}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, customer_name: e.target.value })
                    }
                    className="px-2.5 py-1.5 rounded-lg border border-[#e8dfd1] text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Gulshan, Dhaka)"
                    value={newFeedback.customer_location}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, customer_location: e.target.value })
                    }
                    className="px-2.5 py-1.5 rounded-lg border border-[#e8dfd1] text-xs bg-white"
                  />
                  <input
                    type="url"
                    placeholder="Customer Avatar URL"
                    value={newFeedback.customer_img}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, customer_img: e.target.value })
                    }
                    className="px-2.5 py-1.5 rounded-lg border border-[#e8dfd1] text-xs font-mono bg-white"
                  />
                  <input
                    type="url"
                    placeholder="Customer Product Photo URL"
                    value={newFeedback.customer_product}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, customer_product: e.target.value })
                    }
                    className="px-2.5 py-1.5 rounded-lg border border-[#e8dfd1] text-xs font-mono bg-white"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Feedback comment..."
                  value={newFeedback.feedback}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, feedback: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#e8dfd1] text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddFeedback}
                  className="px-3 py-1.5 bg-[#ceab51] hover:bg-[#b8953c] text-black text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Add Review
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Link
              href="/admin/paintings"
              className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#ceab51] hover:bg-[#b8953c] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Right: Live Interactive Store Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <div className="bg-white p-5 rounded-2xl border border-[#e8dfd1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee6da] pb-3">
              <span className="font-serif text-sm font-semibold text-[var(--color-ink)] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#ceab51]" />
                Live Card Preview
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 uppercase font-bold">
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
                  <img
                    src={image}
                    alt={title || "Preview"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-mono">
                    No image
                  </div>
                )}

                {discountPercent > 0 && (
                  <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    {discountPercent}% OFF
                  </div>
                )}

                {freeDelivery && (
                  <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    FREE DELIVERY
                  </div>
                )}
              </div>

              <div className="p-4 space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-mono block">
                  {selectedArtist?.name || "Artist"}
                </span>
                <h3 className="font-serif text-sm font-semibold text-[var(--color-ink)] truncate">
                  {title || "Artwork Title"}
                </h3>

                <div className="pt-2 flex items-baseline gap-2 border-t border-[#eee6da]">
                  <span className="text-base font-bold text-[var(--color-ink)] font-mono">
                    ৳{priceFrom.toLocaleString()}
                  </span>
                  {priceWas > 0 && (
                    <span className="text-xs text-[var(--color-muted)] line-through font-mono">
                      ৳{priceWas.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[10px] text-neutral-400 ml-auto font-mono">
                    Base 1 Ft
                  </span>
                </div>
              </div>
            </div>

            {/* Calculated Sizes List */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">
                Calculated Size Options:
              </span>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {sizePricingPreview.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2.5 py-1 rounded bg-[#faf8f5] border border-[#eee6da] text-[11px]"
                  >
                    <span className="font-sans text-neutral-700">{s.size}</span>
                    <span className="font-mono font-bold text-[var(--color-ink)]">
                      ৳{s.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
