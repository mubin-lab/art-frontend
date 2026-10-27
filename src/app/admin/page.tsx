"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Palette,
  PlusCircle,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Truck,
  Eye,
} from "lucide-react";
import { getDashboardStats, updateOrderStatus } from "@/lib/api/admin";
import type { DashboardStats, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadStats();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Framing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Cancelled":
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#a8844a]">
            OVERVIEW
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] mt-1">
            Studio Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans mt-0.5">
            Real-time business performance, orders, and museum catalog metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/paintings/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ceab51] hover:bg-[#b8953c] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Painting</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#e8dfd1] hover:bg-neutral-50 text-[var(--color-ink)] font-sans font-semibold text-xs transition-all shadow-2xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#a8844a]" />
            <span>View All Orders</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Sales */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-muted)] font-sans">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#a8844a] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-[var(--color-ink)]">
              {loading ? "..." : `৳${(stats?.totalRevenueBDT || 0).toLocaleString()}`}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold font-sans mt-0.5 inline-flex items-center gap-1">
              <span>● Active Currency: BDT</span>
            </span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-muted)] font-sans">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-[var(--color-ink)]">
              {loading ? "..." : `${stats?.totalOrders || 0} Orders`}
            </div>
            <span className="text-[11px] text-[var(--color-muted)] font-sans">
              Processed through store
            </span>
          </div>
        </div>

        {/* Card 3: Pending Action */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-muted)] font-sans">
              Pending Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-[var(--color-ink)]">
              {loading ? "..." : `${stats?.pendingOrders || 0} Pending`}
            </div>
            <span className="text-[11px] text-rose-600 font-semibold font-sans">
              Requires phone confirmation
            </span>
          </div>
        </div>

        {/* Card 4: Masterpieces in Catalog */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-muted)] font-sans">
              Active Catalog Artworks
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-[var(--color-ink)]">
              {loading ? "..." : `${stats?.totalArtworks || 0} Masterpieces`}
            </div>
            <span className="text-[11px] text-[var(--color-muted)] font-sans">
              Live in online museum
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-[#e8dfd1] shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e8dfd1] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-[var(--color-muted)] font-sans">
              Latest incoming artwork purchases across Bangladesh
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#a8844a] hover:underline inline-flex items-center gap-1 font-sans"
          >
            <span>View All ({stats?.totalOrders || 0})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-[var(--color-muted)]">
            Loading recent orders from API...
          </div>
        ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--color-muted)]">
            No orders found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#faf8f5] text-[11px] font-mono uppercase text-[var(--color-muted)] border-b border-[#e8dfd1]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">City / Area</th>
                  <th className="py-3 px-4">Artwork Item</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee6da]">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#faf9f6] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--color-ink)]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[var(--color-ink)] font-sans">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-[var(--color-muted)] font-mono">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-muted)] font-sans">
                      {order.city}
                    </td>
                    <td className="py-3.5 px-4">
                      {order.items && order.items[0] ? (
                        <div className="max-w-[180px]">
                          <span className="font-semibold text-[var(--color-ink)] truncate block">
                            {order.items[0].paintingTitle}
                          </span>
                          <span className="text-[10px] text-[#a8844a]">
                            {order.items[0].sizeLabel} · {order.items[0].frameName} Frame
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[var(--color-ink)] font-sans">
                      ৳{(order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleQuickStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="text-[11px] bg-white border border-[#d9d0c1] rounded-lg px-2 py-1 text-neutral-800 font-sans cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#ceab51]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Framing">Framing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Launch & Documentation Banner */}
      <div className="p-6 rounded-2xl bg-[#141210] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ceab51]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#ceab51] font-mono">
              Auto-Calculator & Formulas Active
            </span>
          </div>
          <h3 className="font-serif text-lg font-normal text-white">
            Need to add new framed canvas artworks?
          </h3>
          <p className="text-xs text-neutral-400 font-sans">
            The system automatically calculates 1 Feet, 2 Feet, 3 Feet prices, discount badges, and wood frames.
          </p>
        </div>

        <Link
          href="/admin/paintings/new"
          className="px-5 py-2.5 rounded-full bg-[#ceab51] hover:bg-[#b8953c] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <span>Create New Artwork</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
