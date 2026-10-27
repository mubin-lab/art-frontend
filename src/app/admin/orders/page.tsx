"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/types";
import { getOrders, updateOrderStatus } from "@/lib/api/admin";

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All Orders", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Framing", value: "Framing" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
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
      showToast(`Order #${orderId} status changed to ${newStatus}`);
    } catch (err) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

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
            Orders
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans mt-0.5">
            Manage customer purchases, update order stages, and print invoices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition shadow-2xs cursor-pointer"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#e8dfd1] shadow-2xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#e8dfd1] shadow-2xs">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Action</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{tabCounts["Pending"] || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#e8dfd1] shadow-2xs">
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Framing & Courier</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {(tabCounts["Framing"] || 0) + (tabCounts["Shipped"] || 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#e8dfd1] shadow-2xs">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Total Revenue</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">৳{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Tab Navigation */}
      <div className="bg-white rounded-2xl border border-[#e8dfd1] shadow-2xs p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer name, phone, or city..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#ceab51] bg-[#faf8f5]"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-[#141210] text-white shadow-xs font-semibold"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
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
        <div className="bg-white rounded-2xl border border-[#e8dfd1] p-12 text-center text-xs text-gray-500">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8dfd1] p-12 text-center text-xs text-gray-500">
          No orders match your filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#e8dfd1] hover:border-gray-300 transition shadow-2xs overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-[#faf8f5] border-b border-[#eee6da] px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                      #{order.id}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-gray-300 hidden sm:inline">•</span>
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-mono">
                      {order.paymentMethod}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <select
                      disabled={isUpdating}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="text-xs font-bold rounded-lg px-2.5 py-1 border border-gray-200 bg-white cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {isUpdating && (
                      <span className="animate-spin rounded-full h-3 w-3 border-2 border-[#ceab51] border-t-transparent" />
                    )}
                  </div>
                </div>

                {/* Order Main Content */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Customer Information (col 4) */}
                  <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4 space-y-1.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Customer</p>
                    <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                    <div className="text-xs">
                      <a href={`tel:${order.customerPhone}`} className="font-mono text-blue-600 hover:underline">
                        {order.customerPhone}
                      </a>
                    </div>
                    {order.customerEmail && (
                      <div className="text-xs text-gray-500 truncate">{order.customerEmail}</div>
                    )}
                    <div className="mt-2 text-xs text-gray-600 bg-[#faf8f5] p-2 rounded-lg border border-[#eee6da]">
                      <span className="font-semibold block text-gray-700">Delivery Address:</span>
                      {order.deliveryAddress}, {order.city}
                    </div>
                  </div>

                  {/* Items list (col 5) */}
                  <div className="md:col-span-5 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                      Artwork Items ({order.items.length})
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 rounded-xl bg-[#faf8f5] border border-[#eee6da]">
                          <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                            <img
                              src={item.paintingImage || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200"}
                              alt={item.paintingTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{item.paintingTitle}</p>
                            <p className="text-[11px] text-gray-500">
                              Frame: {item.frameName} · Size: {item.sizeLabel}
                            </p>
                            <div className="flex items-center justify-between text-xs mt-0.5">
                              <span className="text-gray-500">Qty: {item.quantity}</span>
                              <span className="font-bold text-gray-900 font-mono">
                                ৳{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Actions (col 3) */}
                  <div className="md:col-span-3 bg-[#faf8f5] p-3.5 rounded-xl border border-[#eee6da] space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Summary</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span className="font-mono">৳{(order.totalAmount - (order.deliveryFee || 0)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Fee:</span>
                        <span className="font-mono">{order.deliveryFee ? `৳${order.deliveryFee}` : "Free"}</span>
                      </div>
                      <div className="pt-2 border-t border-[#eee6da] flex justify-between font-bold text-sm text-gray-900">
                        <span>Total:</span>
                        <span className="font-mono text-[#a8844a]">৳{order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full py-1.5 px-3 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-2xs transition"
                    >
                      View Invoice Slip
                    </button>
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
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Invoice Header */}
            <div className="border-b border-gray-200 pb-5 mb-5 flex justify-between items-start">
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-gray-900">YOUR MUSEUM</span>
                <p className="text-xs text-gray-500 mt-0.5">Museum-Quality Framed Canvas Art • Dhaka, Bangladesh</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                  #{selectedOrder.id}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Date: {new Date(selectedOrder.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-bold text-gray-700 uppercase mb-1">Customer Details:</p>
                <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-gray-600 font-mono">{selectedOrder.customerPhone}</p>
                <p className="text-gray-600 mt-1">{selectedOrder.deliveryAddress}, {selectedOrder.city}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-bold text-gray-700 uppercase mb-1">Payment & Stage:</p>
                <p className="font-semibold text-gray-900">{selectedOrder.paymentMethod}</p>
                <p className="text-amber-800 font-bold mt-1">Status: {selectedOrder.status}</p>
              </div>
            </div>

            {/* Invoice Items Table */}
            <table className="w-full text-left text-xs mb-6">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Size & Frame</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedOrder.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-bold text-gray-900">{it.paintingTitle}</td>
                    <td className="py-2.5 text-gray-600">
                      {it.frameName} · {it.sizeLabel}
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
            <div className="border-t border-gray-200 pt-3 space-y-1 text-xs text-right">
              <div className="flex justify-end gap-6 text-gray-600">
                <span>Subtotal:</span>
                <span className="font-mono w-24">৳{(selectedOrder.totalAmount - (selectedOrder.deliveryFee || 0)).toLocaleString()}</span>
              </div>
              <div className="flex justify-end gap-6 text-gray-600">
                <span>Delivery:</span>
                <span className="font-mono w-24">{selectedOrder.deliveryFee ? `৳${selectedOrder.deliveryFee}` : "Free"}</span>
              </div>
              <div className="flex justify-end gap-6 font-bold text-base text-gray-900 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span className="font-mono text-[#a8844a] w-24">৳{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-black transition"
              >
                Print Slip
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
