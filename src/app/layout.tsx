import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { UtilityStrip } from "@/components/layout/UtilityStrip";
import { Header } from "@/components/layout/Header";
import { MainNav } from "@/components/layout/MainNav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { getNavigation, getSiteConfig } from "@/lib/api";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YourMuseum | Museum-Quality Framed Canvas Art & Masterpieces",
  description:
    "Discover museum-quality framed canvas art of famous masterpieces. Premium archival canvas prints expertly stretched and custom-framed in handcrafted solid wood with safe delivery across Bangladesh.",
  keywords: [
    "canvas art",
    "framed canvas paintings",
    "museum quality canvas art",
    "wall art bangladesh",
    "van gogh starry night",
    "custom portraits from photo",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navigation, siteConfig] = await Promise.all([
    getNavigation(),
    getSiteConfig(),
  ]);

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jost.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] font-sans flex flex-col selection:bg-[var(--color-gold)] selection:text-white">
        <AnnouncementBar announcements={siteConfig.announcements} />
        <UtilityStrip />
        <Header />
        <MainNav navItems={navigation.mainNav} />
        <main className="flex-1">{children}</main>
        <Footer navigation={navigation} siteConfig={siteConfig} />
        <CartDrawer />
      </body>
    </html>
  );
}