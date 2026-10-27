"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/types";
import { getOrders, updateOrderStatus } from "@/lib/api/admin";

const STATUS_TABS: { label: string; value: string; color: string }[] = [
  { label: "সব অর্ডার (All)", value: "All", color: "bg-gray-100 text-gray-800" },
  { label: "নতুন পেন্ডিং (Pending)", value: "Pending", color: "bg-amber-100 text-amber-800" },
  { label: "কনফার্মড (Confirmed)", value: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { label: "ফ্রেমিং চলছে (Framing)", value: "Framing", color: "bg-purple-100 text-purple-800" },
  { label: "শিপড / কুরিয়ার (Shipped)", value: "Shipped", color: "bg-indigo-100 text-indigo-800" },
  { label: "ডেলিভার্ড (Delivered)", value: "Delivered", color: "bg-emerald-100 text-emerald-800" },
  { label: "বাতিল (Cancelled)", value: "Cancelled", color: "bg-rose-100 text-rose-800" },
];

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Framing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: updated.status } : null));
      }
      showToast(`অর্ডার #${orderId} এর স্ট্যাটাস '${newStatus}' এ পরিবর্তন হয়েছে!`);
    } catch (err) {
      alert("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchTab = activeTab === "All" || order.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        (order.orderNumber && order.orderNumber.toLowerCase().includes(q)) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q) ||
        order.city.toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }, [orders, activeTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { All: orders.length };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [orders]);

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

      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            অর্ডার ম্যানেজমেন্ট (Order Center)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            গ্রাহকের সব ক্যানভাস আর্ট অর্ডার ট্র্যাকিং, স্ট্যাটাস পরিবর্তন এবং ইনভয়েস স্লিপ
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm"
          >
            <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            রিফ্রেশ
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">মোট অর্ডার</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">সব সফল ও পেন্ডিং বুকিং</p>
        </div>
        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 shadow-sm">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">পেন্ডিং অ্যাকশন</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{tabCounts["Pending"] || 0}</p>
          <p className="text-xs text-amber-600 mt-0.5">কল করে কনফার্ম করা জরুরি</p>
        </div>
        <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200/80 shadow-sm">
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">ফ্রেমিং ও কুরিয়ার</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {(tabCounts["Framing"] || 0) + (tabCounts["Shipped"] || 0)}
          </p>
          <p className="text-xs text-purple-600 mt-0.5">প্রোডাকশন ও ডেলিভারি পথে</p>
        </div>
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 shadow-sm">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">মোট অর্ডার ভ্যালু</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">৳{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-0.5">সফল অর্ডারের বিক্রয়মূল্য</p>
        </div>
      </div>

      {/* Search and Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার আইডি (যেমন: ORD-84920), গ্রাহকের নাম, ফোন নম্বর বা এলাকা দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-600"
            >
              মুছে ফেলুন
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const count = tabCounts[tab.value] || 0;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-[#121212] text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List / Cards */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#d4af37] mb-3"></div>
          <p className="text-sm text-gray-500 font-medium">অর্ডার লোড হচ্ছে...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-gray-800">কোনো অর্ডার পাওয়া যায়নি</p>
          <p className="text-xs text-gray-500 mt-1">
            {searchQuery
              ? `"${searchQuery}" এর জন্য কোনো ফলাফল নেই।`
              : "এই ক্যাটাগরিতে বর্তমানে কোনো অর্ডার জমা হয়নি।"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-200/90 hover:border-gray-300 transition shadow-sm overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-gray-50/70 border-b border-gray-100 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-gray-900 bg-white px-2.5 py-1 rounded border border-gray-200 shadow-2xs">
                      #{order.id}
                    </span>
                    <span className="text-xs text-gray-500">
                      তারিখ: {new Date(order.createdAt).toLocaleDateString("bn-BD", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:inline">•</span>
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      পেমেন্ট: {order.paymentMethod}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">স্ট্যাটাস:</span>
                    <div className="relative inline-block">
                      <select
                        disabled={isUpdating}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold rounded-lg px-3 py-1.5 border appearance-none pr-7 cursor-pointer transition ${
                          order.status === "Pending"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : order.status === "Confirmed"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : order.status === "Framing"
                            ? "bg-purple-50 text-purple-800 border-purple-300"
                            : order.status === "Shipped"
                            ? "bg-indigo-50 text-indigo-800 border-indigo-300"
                            : order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-rose-50 text-rose-800 border-rose-300"
                        }`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {isUpdating && (
                      <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-[#d4af37] border-t-transparent" />
                    )}
                  </div>
                </div>

                {/* Order Main Content */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Customer Information (col 4) */}
                  <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">গ্রাহকের তথ্য</p>
                    <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <svg className="w-3.5 h-3.5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${order.customerPhone}`} className="font-mono text-blue-600 hover:underline">
                        {order.customerPhone}
                      </a>
                    </div>
                    {order.customerEmail && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{order.customerEmail}</span>
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1">
                      <p className="font-semibold text-gray-700">ডেলিভারি ঠিকানা:</p>
                      <p className="text-gray-600 leading-relaxed bg-gray-50 p-2 rounded border border-gray-100">
                        {order.deliveryAddress}, {order.city}
                      </p>
                    </div>
                  </div>

                  {/* Items list (col 5) */}
                  <div className="md:col-span-5 space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      আর্টওয়ার্ক আইটেম ({order.items.length})
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50/60 border border-gray-100">
                          <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                            <img
                              src={item.paintingImage || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200"}
                              alt={item.paintingTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{item.paintingTitle}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              ফ্রেম: <span className="font-medium text-gray-700">{item.frameName}</span> • সাইজ:{" "}
                              <span className="font-medium text-gray-700">{item.sizeLabel}</span>
                            </p>
                            <div className="flex items-center justify-between mt-1 text-xs">
                              <span className="text-gray-500">পরিমাণ: {item.quantity} টি</span>
                              <span className="font-bold text-gray-800">৳{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial & Actions (col 3) */}
                  <div className="md:col-span-3 bg-gray-50/90 p-3.5 rounded-xl border border-gray-100 flex flex-col justify-between h-full space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">হিসাব বিবরণী</p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-gray-600">
                          <span>সাবটোটাল:</span>
                          <span className="font-mono">৳{(order.totalAmount - (order.deliveryFee || 0)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>ডেলিভারি ফি:</span>
                          <span className="font-mono">{order.deliveryFee ? `৳${order.deliveryFee}` : "ফ্রি"}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
                          <span>সর্বমোট:</span>
                          <span className="font-mono text-[#d4af37] text-base">৳{order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200/80 flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full py-2 px-3 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        ইনভয়েস স্লিপ দেখুন
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Printable Invoice Header */}
            <div className="border-b border-gray-200 pb-5 mb-5 flex justify-between items-start">
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-gray-900">YOUR MUSEUM</span>
                <p className="text-xs text-gray-500 mt-0.5">Museum-Quality Framed Canvas Art • Dhaka, Bangladesh</p>
                <p className="text-xs text-gray-500">হটলাইন: +880 1700-000000</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-base font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                  #{selectedOrder.id}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  তারিখ: {new Date(selectedOrder.createdAt).toLocaleDateString("bn-BD")}
                </p>
                <span className="inline-block mt-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-bold text-gray-700 uppercase mb-1">গ্রাহকের নাম ও ঠিকানা:</p>
                <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-gray-600">{selectedOrder.customerPhone}</p>
                <p className="text-gray-600 mt-1">{selectedOrder.deliveryAddress}, {selectedOrder.city}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-bold text-gray-700 uppercase mb-1">পেমেন্ট মেথড:</p>
                <p className="font-semibold text-gray-900">
                  {selectedOrder.paymentMethod}
                </p>
                <p className="text-gray-500 mt-1">পণ্য হাতে পেয়ে চেক করে সম্পূর্ণ মূল্য পরিশোধ করুন।</p>
              </div>
            </div>

            {/* Invoice Items Table */}
            <table className="w-full text-left text-xs mb-6">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase">
                  <th className="py-2">আর্টওয়ার্ক বিবরণ</th>
                  <th className="py-2">সাইজ ও ফ্রেম</th>
                  <th className="py-2 text-center">পরিমাণ</th>
                  <th className="py-2 text-right">মূল্য</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedOrder.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-bold text-gray-900">{it.paintingTitle}</td>
                    <td className="py-2.5 text-gray-600">
                      {it.frameName} • {it.sizeLabel}
                    </td>
                    <td className="py-2.5 text-center text-gray-800">{it.quantity}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-gray-900">
                      ৳{(it.price * it.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-3 space-y-1.5 text-xs text-right">
              <div className="flex justify-end gap-6 text-gray-600">
                <span>সাবটোটাল:</span>
                <span className="font-mono w-24">৳{(selectedOrder.totalAmount - (selectedOrder.deliveryFee || 0)).toLocaleString()}</span>
              </div>
              <div className="flex justify-end gap-6 text-gray-600">
                <span>ডেলিভারি ফি:</span>
                <span className="font-mono w-24">{selectedOrder.deliveryFee ? `৳${selectedOrder.deliveryFee}` : "ফ্রি"}</span>
              </div>
              <div className="flex justify-end gap-6 font-bold text-base text-gray-900 pt-2 border-t border-gray-200">
                <span>সর্বমোট দেয়:</span>
                <span className="font-mono text-[#d4af37] w-24">৳{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-black transition flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                প্রিন্ট স্লিপ (Print Slip)
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
