"use client";

import { useEffect, useState, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ImageIcon,
  MessageSquare,
  Eye,
  Star,
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
  const [movement, setMovement] = useState("POST-IMPRESSIONISM");
  const [year, setYear] = useState("");
  const [medium, setMedium] = useState("Museum-Grade Fine Art Canvas Print");
  const [location, setLocation] = useState("Curated Art Collection");
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
    customer_location: "Dhaka, Bangladesh",
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
        setMovement(painting.movement || "POST-IMPRESSIONISM");
        setYear(painting.year || "");
        setMedium(painting.medium || "Museum-Grade Fine Art Canvas Print");
        setLocation(painting.location || "Curated Art Collection");
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
        setStatusMsg({ type: "error", text: "পেইন্টিং লোড করতে সমস্যা হয়েছে।" });
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
        { size: '1.0 × 1.5 Ft (12" × 18")', multiplier: 1.0, price: Math.round(base * 1.0) },
        { size: '1.5 × 2.0 Ft (18" × 24")', multiplier: 1.35, price: Math.round(base * 1.35) },
        { size: '2.0 × 3.0 Ft (24" × 36")', multiplier: 1.95, price: Math.round(base * 1.95) },
        { size: '2.5 × 3.5 Ft (30" × 42")', multiplier: 2.55, price: Math.round(base * 2.55) },
        { size: '3.0 × 4.0 Ft (36" × 48")', multiplier: 3.25, price: Math.round(base * 3.25) },
      ];
    } else if (orientation === "vertical") {
      return [
        { size: '1.5 × 1.0 Ft (18" × 12")', multiplier: 1.0, price: Math.round(base * 1.0) },
        { size: '2.0 × 1.5 Ft (24" × 18")', multiplier: 1.35, price: Math.round(base * 1.35) },
        { size: '3.0 × 2.0 Ft (36" × 24")', multiplier: 1.95, price: Math.round(base * 1.95) },
        { size: '3.5 × 2.5 Ft (42" × 30")', multiplier: 2.55, price: Math.round(base * 2.55) },
        { size: '4.0 × 3.0 Ft (48" × 36")', multiplier: 3.25, price: Math.round(base * 3.25) },
      ];
    } else {
      return [
        { size: '1.0 × 1.0 Ft (12" × 12")', multiplier: 1.0, price: Math.round(base * 1.0) },
        { size: '1.5 × 1.5 Ft (18" × 18")', multiplier: 1.3, price: Math.round(base * 1.3) },
        { size: '2.0 × 2.0 Ft (24" × 24")', multiplier: 1.8, price: Math.round(base * 1.8) },
        { size: '2.5 × 2.5 Ft (30" × 30")', multiplier: 2.4, price: Math.round(base * 2.4) },
        { size: '3.0 × 3.0 Ft (36" × 36")', multiplier: 3.0, price: Math.round(base * 3.0) },
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

  const handleAddDescription = () => {
    if (!newDescParagraph.trim()) return;
    setDescriptions((prev) => [...prev, newDescParagraph.trim()]);
    setNewDescParagraph("");
  };

  const handleRemoveDescription = (idx: number) => {
    setDescriptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddFeedback = () => {
    if (!newFeedback.customer_name || !newFeedback.feedback) {
      alert("ক্রেতার নাম এবং মন্তব্য আবশ্যক!");
      return;
    }
    setCustomerFeedbacks((prev) => [
      ...prev,
      {
        ...newFeedback,
        customer_img:
          newFeedback.customer_img ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
        customer_product:
          newFeedback.customer_product ||
          image ||
          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400",
      },
    ]);
    setNewFeedback({
      customer_name: "",
      customer_img: "",
      customer_product: "",
      feedback: "",
      rating: 5,
      customer_location: "Dhaka, Bangladesh",
    });
  };

  const handleRemoveFeedback = (idx: number) => {
    setCustomerFeedbacks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceFrom) {
      setStatusMsg({ type: "error", text: "পেইন্টিং টাইটেল এবং বেস প্রাইস আবশ্যক!" });
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
        text: `"${title}" সফলভাবে আপডেট করা হয়েছে!`,
      });

      setTimeout(() => {
        router.push("/admin/paintings");
      }, 1200);
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message || "পেইন্টিং আপডেট করতে সমস্যা হয়েছে।",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8dfd1] p-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ceab51] border-t-transparent mb-3" />
        <p className="text-sm text-neutral-600 font-medium">আর্টওয়ার্ক তথ্য লোড হচ্ছে...</p>
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
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#a87e1a] uppercase">
              ARTWORK EDITOR
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] mt-0.5">
              পেইন্টিং এডিট করুন (Edit Artwork)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/painting/${slug}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>ওয়েবসাইটে দেখুন</span>
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
        {/* Left: Form Controls (8 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Card 1: Core Details */}
          <div className="bg-white p-6 rounded-2xl border border-[#e8dfd1] shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)] border-b border-[#eee6da] pb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ceab51]" />
              ১. মূল আর্টওয়ার্ক তথ্য (Core Artwork Details)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                  পেইন্টিং টাইটেল (Artwork Title) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8dfd1] text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                  শিল্পী নির্বাচন (Artist) *
                </label>
                <select
                  value={artistSlug}
                  onChange={(e) => setArtistSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8dfd1] text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-white cursor-pointer"
                >
                  {artists.map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {a.name} ({a.movement || "Master"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                  ছবি ওিয়েন্টেশন (Aspect Ratio) *
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8dfd1] text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-white cursor-pointer"
                >
                  <option value="horizontal">Horizontal (3:2) — আড়াআড়ি</option>
                  <option value="vertical">Vertical (2:3) — লম্বালম্বি</option>
                  <option value="square">Square (1:1) — সমবর্গীয়</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                  মূল হাই-রেজোলিউশন ইমেজ লিংক (Image URL) *
                </label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8dfd1] text-xs font-mono text-neutral-600 focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                  আর্ট মুভমেন্ট (Movement)
                </label>
                <input
                  type="text"
                  value={movement}
                  onChange={(e) => setMovement(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e8dfd1] text-xs font-sans bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                  তৈরির সাল (Year Created)
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

          {/* Card 2: Pricing & Auto Calculations */}
          <div className="bg-white p-6 rounded-2xl border border-[#e8dfd1] shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)] border-b border-[#eee6da] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ceab51]" />
                ২. মূল্য ও ডেলিভারি সেটিংস (Pricing in BDT ৳)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                অটোমেটিক ৫টি সাইজ ক্যালকুলেশন
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                  বেস প্রাইস / ১ ফুট সাইজের দাম (৳) *
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
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#e8dfd1] text-sm font-mono font-bold text-[var(--color-ink)] focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                  ডিসকাউন্ট শতকরা (%)
                </label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    %
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-[#e8dfd1] text-sm font-mono font-bold text-[var(--color-ink)] focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                  পূর্বের কাটা মূল্য (Price Was)
                </label>
                <div className="py-2.5 px-3.5 rounded-xl border border-[#e8dfd1] bg-neutral-50 text-sm font-mono text-neutral-500">
                  {priceWas > 0 ? (
                    <span className="line-through text-rose-500 font-bold">
                      ৳{priceWas.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-neutral-400 text-xs">কোনো ডিসকাউন্ট নেই</span>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Switch */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#eee6da]">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="freeDelivery"
                  checked={freeDelivery}
                  onChange={(e) => setFreeDelivery(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ceab51] focus:ring-[#ceab51] cursor-pointer"
                />
                <label htmlFor="freeDelivery" className="text-xs font-bold text-neutral-800 cursor-pointer">
                  এই আর্টওয়ার্কে ফ্রি ডেলিভারি প্রযোজ্য (Free Delivery)
                </label>
              </div>

              {!freeDelivery && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-600">ডেলিভারি ফি:</span>
                  <input
                    type="number"
                    min="0"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-[#e8dfd1] text-xs font-mono font-bold text-center bg-[#faf8f5]"
                  />
                  <span className="text-xs text-neutral-500 font-mono">৳</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Story Images */}
          <div className="bg-white p-6 rounded-2xl border border-[#e8dfd1] shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)] border-b border-[#eee6da] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ceab51]" />
                ৩. স্টোরি ডিটেইল ইমেজ (Description Images)
              </span>
              <span className="text-xs font-mono text-neutral-500">
                {descriptionImages.length} টি ছবি
              </span>
            </h2>

            <div className="space-y-3">
              {descriptionImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 rounded-xl border border-[#e8dfd1] bg-[#faf8f5]"
                >
                  <img
                    src={imgUrl}
                    alt="Detail"
                    className="w-12 h-12 rounded-lg object-cover border border-[#e8dfd1] shrink-0"
                  />
                  <span className="text-xs font-mono text-neutral-600 truncate flex-1">
                    {imgUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDescriptionImage(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://... ডিটেইল ক্লোজ-আপ ফ্রেম ছবির লিংক দিন"
                  value={newDescImage}
                  onChange={(e) => setNewDescImage(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#e8dfd1] text-xs font-mono focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
                />
                <button
                  type="button"
                  onClick={handleAddDescriptionImage}
                  className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  যোগ করুন
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Customer Feedbacks */}
          <div className="bg-white p-6 rounded-2xl border border-[#e8dfd1] shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)] border-b border-[#eee6da] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ceab51]" />
                ৪. ক্রেতার রিভিউ ও সন্তুষ্টি (Customer Feedbacks)
              </span>
              <span className="text-xs font-mono text-neutral-500">
                {customerFeedbacks.length} টি রিভিউ
              </span>
            </h2>

            <div className="space-y-4">
              {customerFeedbacks.map((fb, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[#e8dfd1] bg-[#faf8f5] flex items-start gap-4"
                >
                  <img
                    src={fb.customer_img}
                    alt={fb.customer_name}
                    className="w-10 h-10 rounded-full object-cover border border-[#ceab51]/40 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-neutral-900">
                        {fb.customer_name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeedback(idx)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                      >
                        মুছে ফেলুন
                      </button>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono block">
                      {fb.customer_location}
                    </span>
                    <p className="text-xs text-neutral-700 mt-1 italic leading-relaxed">
                      &quot;{fb.feedback}&quot;
                    </p>
                  </div>
                </div>
              ))}

              {/* Add New Feedback Inline Box */}
              <div className="p-4 rounded-xl border border-dashed border-[#ceab51]/60 bg-amber-50/20 space-y-3">
                <span className="text-xs font-bold text-neutral-900 block">
                  + নতুন গ্রাহক রিভিউ যোগ করুন:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="গ্রাহকের নাম (যেমন: তানভীর আহমেদ)"
                    value={newFeedback.customer_name}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, customer_name: e.target.value })
                    }
                    className="px-3 py-1.5 rounded-lg border border-[#e8dfd1] text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="এলাকা (যেমন: গুলশান, ঢাকা)"
                    value={newFeedback.customer_location}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, customer_location: e.target.value })
                    }
                    className="px-3 py-1.5 rounded-lg border border-[#e8dfd1] text-xs bg-white"
                  />
                  <input
                    type="url"
                    placeholder="গ্রাহকের প্রোফাইল ছবি লিংক"
                    value={newFeedback.customer_img}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, customer_img: e.target.value })
                    }
                    className="px-3 py-1.5 rounded-lg border border-[#e8dfd1] text-xs font-mono bg-white"
                  />
                  <input
                    type="url"
                    placeholder="দেয়ালে আর্টের ছবি লিংক (Customer Product)"
                    value={newFeedback.customer_product}
                    onChange={(e) =>
                      setNewFeedback({ ...newFeedback, customer_product: e.target.value })
                    }
                    className="px-3 py-1.5 rounded-lg border border-[#e8dfd1] text-xs font-mono bg-white"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="গ্রাহকের মন্তব্য (Feedback review text)..."
                  value={newFeedback.feedback}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, feedback: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-[#e8dfd1] text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddFeedback}
                  className="px-4 py-2 bg-[#ceab51] hover:bg-[#b8953c] text-black text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  রিভিউ তালিকায় যোগ করুন
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-4">
            <Link
              href="/admin/paintings"
              className="px-5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              বাতিল
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-[#ceab51] hover:bg-[#b8953c] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>আপডেট সংরক্ষণ করুন (Save Changes)</span>
            </button>
          </div>
        </form>

        {/* Right: Live Interactive Store Preview Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6 sticky top-6">
          <div className="bg-white p-5 rounded-2xl border border-[#e8dfd1] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee6da] pb-3">
              <span className="font-serif text-xs font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ceab51]" />
                লাইভ শপ প্রিভিউ (Store Preview)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                {orientation}
              </span>
            </div>

            {/* Simulated Artwork Card */}
            <div className="group rounded-xl overflow-hidden border border-[#e8dfd1] bg-[#faf8f5]">
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
                    ছবি নেই
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

              <div className="p-4 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-mono block">
                  {selectedArtist?.name || "Master Artist"}
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
                    ফ্রম (১ ফুট)
                  </span>
                </div>
              </div>
            </div>

            {/* Calculated Sizes List */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">
                স্বয়ংক্রিয়ভাবে তৈরি ৫টি সাইজের মূল্য:
              </span>
              <div className="space-y-1 max-h-44 overflow-y-auto">
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
