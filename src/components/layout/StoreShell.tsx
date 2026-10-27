"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { UtilityStrip } from "@/components/layout/UtilityStrip";
import { Header } from "@/components/layout/Header";
import { MainNav } from "@/components/layout/MainNav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import type { NavigationData, SiteConfig } from "@/types";

interface StoreShellProps {
  navigation: NavigationData;
  siteConfig: SiteConfig;
  children: React.ReactNode;
}

export function StoreShell({ navigation, siteConfig, children }: StoreShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar announcements={siteConfig.announcements} />
      <UtilityStrip />
      <Header />
      <MainNav navItems={navigation.mainNav} />
      <main className="flex-1">{children}</main>
      <Footer navigation={navigation} siteConfig={siteConfig} />
      <CartDrawer />
    </>
  );
}
