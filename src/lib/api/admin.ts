import type { Painting, Artist, Order, OrderStatus, DashboardStats } from "@/types";

const BASE = "/api";

export async function getAdminPaintings(): Promise<Painting[]> {
  const res = await fetch(`${BASE}/paintings`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch paintings");
  return res.json();
}

export async function getAdminPainting(slug: string): Promise<Painting> {
  const res = await fetch(`${BASE}/paintings/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch painting");
  return res.json();
}

export async function createPainting(data: Partial<Painting>): Promise<Painting> {
  const res = await fetch(`${BASE}/paintings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create painting");
  }
  return res.json();
}

export async function updatePainting(slug: string, data: Partial<Painting>): Promise<Painting> {
  const res = await fetch(`${BASE}/paintings/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update painting");
  return res.json();
}

export async function deletePainting(slug: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE}/paintings/${slug}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete painting");
  return res.json();
}

export async function getAdminArtists(): Promise<Artist[]> {
  const res = await fetch(`${BASE}/artists`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch artists");
  return res.json();
}

export async function createArtist(data: Partial<Artist>): Promise<Artist> {
  const res = await fetch(`${BASE}/artists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create artist");
  return res.json();
}

export async function getOrders(status?: string): Promise<Order[]> {
  const query = status && status !== "All" ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(`${BASE}/orders${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const res = await fetch(`${BASE}/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${BASE}/dashboard/stats`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}

export interface SiteConfig {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  announcements: string[];
  deliverySettings?: {
    insideDhakaFee: number;
    outsideDhakaFee: number;
    freeDeliveryThreshold: number;
  };
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const res = await fetch(`${BASE}/site-config`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch site config");
  return res.json();
}

export async function updateSiteConfig(data: Partial<SiteConfig>): Promise<SiteConfig> {
  const res = await fetch(`${BASE}/site-config`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update site config");
  return res.json();
}

export async function getHomeData(): Promise<any> {
  const res = await fetch(`${BASE}/home`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch home data");
  return res.json();
}

export async function updateHeroSlides(heroSlides: any[]): Promise<any> {
  const res = await fetch(`${BASE}/home`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ heroSlides }),
  });
  if (!res.ok) throw new Error("Failed to update hero slides");
  return res.json();
}
