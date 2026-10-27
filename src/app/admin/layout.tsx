"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Palette,
  PlusCircle,
  Users,
  Settings,
  Sparkles,
  ArrowUpRight,
  Menu,
  X,
  Store,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  // Fetch pending orders count dynamically to show real-time alert badge
  useEffect(() => {
    async function loadPendingCount() {
      try {
        const res = await fetch("/api/orders?status=Pending");
        if (res.ok) {
          const data = await res.json();
          setPendingCount(Array.isArray(data) ? data.length : null);
        }
      } catch (err) {
        // silent fallback
      }
    }
    loadPendingCount();
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      badge: pendingCount && pendingCount > 0 ? `${pendingCount}` : undefined,
      badgeColor: "bg-amber-500 text-black",
    },
    { label: "Paintings", href: "/admin/paintings", icon: Palette },
    { label: "Add Painting", href: "/admin/paintings/new", icon: PlusCircle },
    { label: "Artists", href: "/admin/artists", icon: Users },
    { label: "Marketing", href: "/admin/marketing", icon: Sparkles },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // Accurate active link detection
  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/admin") {
      return pathname === "/admin";
    }
    if (href === "/admin/paintings") {
      return (
        pathname === "/admin/paintings" ||
        (pathname.startsWith("/admin/paintings/") && !pathname.startsWith("/admin/paintings/new"))
      );
    }
    if (href === "/admin/paintings/new") {
      return pathname === "/admin/paintings/new";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-neutral-900 relative">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-[#141210] text-white px-4 py-3 flex items-center justify-between border-b border-white/10 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#dfbe64] to-[#a87e1a] text-black font-serif font-bold flex items-center justify-center text-sm shadow-sm">
            YM
          </div>
          <span className="font-serif font-semibold text-sm tracking-tight text-white">
            YourMuseum <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#ceab51]/20 text-[#ceab51] ml-1">ADMIN</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* FIXED Sidebar Navigation: NEVER scrolls with the page */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#141210] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-white/10 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header Section */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#dfbe64] to-[#a87e1a] text-black font-serif font-bold flex items-center justify-center text-base shadow-md">
              YM
            </div>
            <div>
              <h1 className="font-serif font-semibold text-sm leading-tight tracking-tight text-white">
                YourMuseum
              </h1>
              <span className="text-[10px] tracking-wider text-neutral-400 font-mono block">
                Studio Admin
              </span>
            </div>
          </div>

          {/* Close button inside mobile drawer */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav List */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  active
                    ? "bg-[#ceab51] text-black font-bold shadow-md shadow-[#ceab51]/20"
                    : "text-neutral-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      active ? "text-black" : "text-neutral-400 group-hover:text-white"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                      active
                        ? "bg-black text-[#ceab51]"
                        : item.badgeColor || "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Sidebar: Return to Live Store */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#0d0c0a]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-all font-medium group"
          >
            <div className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-[#ceab51]" />
              <span>Live Website</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#ceab51] transition-transform" />
          </Link>

          <div className="flex items-center gap-2 px-2 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-neutral-400 font-mono">Store Active • BDT (৳)</span>
          </div>
        </div>
      </aside>

      {/* Main Content Stage with fixed left padding for the 64 (16rem / 256px) sidebar */}
      <div className="min-h-screen flex flex-col lg:pl-64">
        {/* Sticky Desktop Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#e8dfd1] px-6 py-3 hidden lg:flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Store Admin</span>
            <span className="text-neutral-300">•</span>
            <span className="font-mono text-neutral-500">BDT (৳)</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/paintings/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141210] hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#ceab51]" />
              <span>Add Painting</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <span>Live Website</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-500" />
            </Link>
          </div>
        </header>

        {/* Page Content: Scrolls naturally without moving the sidebar */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
