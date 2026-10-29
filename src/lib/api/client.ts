import { parsePaintingParam } from "@/lib/utils/paintingUrl";
import siteConfigData from "@/mocks/site-config.json";
import navigationData from "@/mocks/navigation.json";
import homeData from "@/mocks/home.json";
import paintingsData from "@/mocks/paintings.json";
import artistsData from "@/mocks/artists.json";
import reviewsData from "@/mocks/reviews.json";
import audioStoriesData from "@/mocks/audio-stories.json";
import roomsData from "@/mocks/rooms.json";
import samplesData from "@/mocks/samples.json";
import photoToPaintingData from "@/mocks/photo-to-painting.json";
import articlesData from "@/mocks/articles.json";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

function getLocalMock<T>(cleanPath: string): T | undefined {
  const [pathname, queryString] = cleanPath.split("?");
  const searchParams = new URLSearchParams(queryString || "");

  if (pathname === "/site-config") {
    return siteConfigData as unknown as T;
  }
  if (pathname === "/navigation") {
    return navigationData as unknown as T;
  }
  if (pathname === "/home") {
    return homeData as unknown as T;
  }
  if (pathname === "/paintings") {
    let list = [...paintingsData];
    if (searchParams.get("bestseller") === "true") {
      list = list.filter((p) => p.bestseller);
    }
    if (searchParams.get("top100") === "true") {
      list = list.filter((p) => p.top100Rank !== undefined).sort((a, b) => (a.top100Rank || 999) - (b.top100Rank || 999));
    }
    const artist = searchParams.get("artistSlug");
    if (artist) {
      list = list.filter((p) => p.artistSlug === artist);
    }
    const movement = searchParams.get("movement");
    if (movement) {
      list = list.filter((p) => p.movement.toLowerCase() === movement.toLowerCase());
    }
    const limit = searchParams.get("limit");
    if (limit) {
      list = list.slice(0, parseInt(limit, 10));
    }
    return list as unknown as T;
  }
  if (pathname.startsWith("/paintings/")) {
    const rawParam = pathname.replace("/paintings/", "");
    const { id, slug } = parsePaintingParam(rawParam);
    const found = paintingsData.find((p) => {
      if (id && p.id.toLowerCase() === id.toLowerCase()) return true;
      if (slug && p.slug.toLowerCase() === slug.toLowerCase()) return true;
      return p.id.toLowerCase() === rawParam.toLowerCase() || p.slug.toLowerCase() === rawParam.toLowerCase();
    });
    return found as unknown as T;
  }
  if (pathname === "/artists") {
    return artistsData as unknown as T;
  }
  if (pathname.startsWith("/artists/")) {
    const slug = pathname.replace("/artists/", "");
    const found = artistsData.find((a) => a.slug === slug);
    return found as unknown as T;
  }
  if (pathname === "/reviews") {
    let list = [...reviewsData];
    if (searchParams.get("featured") === "true") {
      list = list.slice(0, 5);
    }
    return list as unknown as T;
  }
  if (pathname === "/audio-stories") {
    return audioStoriesData as unknown as T;
  }
  if (pathname === "/rooms") {
    return roomsData as unknown as T;
  }
  if (pathname === "/samples") {
    return samplesData as unknown as T;
  }
  if (pathname === "/photo-to-painting") {
    return photoToPaintingData as unknown as T;
  }
  if (pathname.startsWith("/articles/")) {
    const slug = pathname.replace("/articles/", "");
    const found = articlesData.find((a) => a.slug === slug);
    return found as unknown as T;
  }
  if (pathname === "/articles") {
    return articlesData as unknown as T;
  }
  if (pathname === "/search") {
    const q = (searchParams.get("q") || "").toLowerCase().trim();
    if (!q) {
      return { paintings: [], artists: [] } as unknown as T;
    }
    const pResults = paintingsData.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.artistName.toLowerCase().includes(q) ||
        p.movement.toLowerCase().includes(q)
    );
    const aResults = artistsData.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.bio && a.bio.toLowerCase().includes(q))
    );
    return { paintings: pResults, artists: aResults } as unknown as T;
  }

  return undefined;
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = path.startsWith("http") ? path : `${BASE}${cleanPath}`;

  try {
    const res = await fetch(fullUrl, {
      next: { revalidate: 60 },
      ...init,
    });
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 0) {
        try {
          return JSON.parse(text) as T;
        } catch {
          // JSON parse failed on non-empty response, proceed to local fallback
        }
      }
    }
  } catch {
    // Handled by local fallback
  }

  const local = getLocalMock<T>(cleanPath);
  if (local !== undefined) {
    return local;
  }

  throw new Error(`API fetch failed for ${path}`);
}
