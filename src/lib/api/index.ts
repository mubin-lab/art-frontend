import { api } from "./client";
import type {
  SiteConfig,
  NavigationData,
  HomeData,
  Painting,
  Artist,
  Review,
  AudioStory,
  Room,
  SampleCompare,
  PhotoToPaintingItem,
  Article,
} from "@/types";

export async function getSiteConfig(): Promise<SiteConfig> {
  return api<SiteConfig>("/site-config");
}

export async function getNavigation(): Promise<NavigationData> {
  return api<NavigationData>("/navigation");
}

export async function getHomeData(): Promise<HomeData> {
  return api<HomeData>("/home");
}

export async function getPaintings(params?: {
  bestseller?: boolean;
  top100?: boolean;
  limit?: number;
  artistSlug?: string;
  movement?: string;
}): Promise<Painting[]> {
  const query = new URLSearchParams();
  if (params?.bestseller) query.set("bestseller", "true");
  if (params?.top100) query.set("top100", "true");
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.artistSlug) query.set("artistSlug", params.artistSlug);
  if (params?.movement) query.set("movement", params.movement);

  const qs = query.toString();
  return api<Painting[]>(`/paintings${qs ? `?${qs}` : ""}`);
}

export async function getPaintingBySlug(slug: string): Promise<Painting | null> {
  try {
    return await api<Painting>(`/paintings/${slug}`);
  } catch {
    return null;
  }
}

export async function getArtists(): Promise<Artist[]> {
  return api<Artist[]>("/artists");
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  try {
    return await api<Artist>(`/artists/${slug}`);
  } catch {
    return null;
  }
}

export async function getReviews(params?: { featured?: boolean }): Promise<Review[]> {
  const query = new URLSearchParams();
  if (params?.featured) query.set("featured", "true");
  const qs = query.toString();
  return api<Review[]>(`/reviews${qs ? `?${qs}` : ""}`);
}

export async function getAudioStories(): Promise<AudioStory[]> {
  return api<AudioStory[]>("/audio-stories");
}

export async function getRooms(): Promise<Room[]> {
  return api<Room[]>("/rooms");
}

export async function getSamples(): Promise<SampleCompare[]> {
  return api<SampleCompare[]>("/samples");
}

export async function getPhotoToPainting(): Promise<PhotoToPaintingItem[]> {
  return api<PhotoToPaintingItem[]>("/photo-to-painting");
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return await api<Article>(`/articles/${slug}`);
  } catch {
    return null;
  }
}

export async function searchArt(query: string): Promise<{ paintings: Painting[]; artists: Artist[] }> {
  if (!query.trim()) return { paintings: [], artists: [] };
  return api<{ paintings: Painting[]; artists: Artist[] }>(`/search?q=${encodeURIComponent(query)}`);
}

export async function subscribeNewsletter(email: string, roles: string[] = []): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "/api"}/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, roles }),
    });
    return res.json();
  } catch {
    return { success: true, message: "Thank you for subscribing!" };
  }
}