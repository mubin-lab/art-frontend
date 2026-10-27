"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Palette,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { getDashboardStats, updateOrderStatus } from "@/lib/api/admin";
import type { DashboardStats, OrderStatus } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      if (stats) {
        setStats({
          ...stats,
          recentOrders: stats.recentOrders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          ),
          pendingOrders:
            newStatus === "Pending"
              ? stats.pendingOrders + 1
              : stats.pendingOrders > 0
              ? stats.pendingOrders - 1
              : 0,
        });
      }
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Confirmed":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Framing":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Shipped":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--color-ink)]">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] font-sans mt-0.5">
            Overview of store orders, revenue, and active catalog inventory.
          </p>
        </div>

        <Link
          href="/admin/paintings/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ceab51] hover:bg-[#b8953c] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Painting</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-muted)] font-sans">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#ceab51] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-serif text-[var(--color-ink)]">
            {loading ? "..." : `৳${(stats?.totalRevenueBDT || 0).toLocaleString()}`}
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-muted)] font-sans">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-serif text-[var(--color-ink)]">
            {loading ? "..." : stats?.totalOrders || 0}
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-muted)] font-sans">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-serif text-[var(--color-ink)]">
            {loading ? "..." : stats?.pendingOrders || 0}
          </div>
        </div>

        {/* Card 4: Catalog Artworks */}
        <div className="p-5 rounded-2xl bg-white border border-[#e8dfd1] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-muted)] font-sans">
              Artworks
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-serif text-[var(--color-ink)]">
            {loading ? "..." : stats?.totalArtworks || 0}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-[#e8dfd1] shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e8dfd1] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-base font-semibold text-[var(--color-ink)]">
              Recent Orders
            </h2>
            <p className="text-xs text-[var(--color-muted)] font-sans">
              Latest incoming purchases
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
            Loading recent orders...
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
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Artwork Item</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee6da]">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#faf9f6] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[var(--color-ink)]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[var(--color-ink)] font-sans">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-[var(--color-muted)] font-mono">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--color-muted)] font-sans">
                      {order.city}
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 font-bold text-[var(--color-ink)] font-sans">
                      ৳{(order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
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
    </div>
  );
}
