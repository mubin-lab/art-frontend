"use client";

import React, { useState } from "react";
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
  Search,
  Bell,
  Sliders,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: "New" },
    { label: "All Paintings", href: "/admin/paintings", icon: Palette },
    { label: "Add Painting", href: "/admin/paintings/new", icon: PlusCircle },
    { label: "Artists", href: "/admin/artists", icon: Users },
    { label: "Marketing / Hero", href: "/admin/marketing", icon: Sparkles },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f2] flex flex-col lg:flex-row font-sans text-neutral-900">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-neutral-900 text-white px-4 py-3 flex items-center justify-between border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-gold)] text-black font-serif font-bold flex items-center justify-center text-sm">
            YM
          </div>
          <span className="font-serif font-semibold text-base tracking-tight text-white">
            YourMuseum <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-[#ceab51] ml-1">ADMIN</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#141210] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10 hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#dfbe64] to-[#a87e1a] text-black font-serif font-bold flex items-center justify-center text-base shadow-md">
                YM
              </div>
              <div>
                <h1 className="font-serif font-medium text-lg leading-tight tracking-tight text-white">
                  YourMuseum
                </h1>
                <span className="text-[10px] uppercase tracking-widest text-[#ceab51] font-mono font-bold block">
                  Studio Admin
                </span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-neutral-400 font-mono">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#ceab51] text-black font-bold shadow-md"
                      : "text-neutral-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        isActive
                          ? "bg-black/20 text-black"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Return to Live Store */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-all font-medium"
          >
            <span>View Live Gallery</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#ceab51]" />
          </Link>

          <div className="flex items-center gap-3 px-2 pt-1">
            <div className="w-8 h-8 rounded-full bg-[#ceab51]/20 border border-[#ceab51]/40 flex items-center justify-center text-xs font-bold text-[#ceab51]">
              AD
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Curator Admin</div>
              <div className="text-[10px] text-neutral-400 truncate">Bangladesh BDT ৳</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Stage */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar for Desktop */}
        <header className="bg-white border-b border-[#e8dfd1] px-6 py-3.5 hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
              CURATION PORTAL
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-semibold text-neutral-700">
              Bangladesh Market (BDT ৳)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/paintings/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--color-ink)] hover:bg-[#2c2825] text-white text-xs font-semibold transition-all shadow-xs"
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

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
