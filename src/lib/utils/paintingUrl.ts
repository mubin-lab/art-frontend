import type { Painting } from "@/types";

/**
 * Returns SEO-friendly URL for a painting: /painting/{id}-{slug}
 * Example: /painting/10001-the-starry-night
 */
export function getPaintingUrl(painting: { id?: string; slug?: string } | null | undefined): string {
  if (!painting) return "/shop";
  const id = painting.id?.trim();
  const slug = painting.slug?.trim();

  if (id && slug) {
    return `/painting/${id}-${slug}`;
  }
  if (id) {
    return `/painting/${id}`;
  }
  if (slug) {
    return `/painting/${slug}`;
  }
  return "/shop";
}

/**
 * Parses route param like "10001-the-starry-night", "10001", or legacy "the-starry-night"
 * Returns the extracted id and/or slug for resilient lookup.
 */
export function parsePaintingParam(param: string): { id?: string; slug?: string } {
  if (!param) return {};
  const decoded = decodeURIComponent(param).trim();

  // Pattern 1: {id}-{slug} where id is 4 to 8 digits, or "p" followed by digits
  // Example: "10001-the-starry-night" or "p1-the-starry-night"
  const dashIndex = decoded.indexOf("-");
  if (dashIndex > 0) {
    const prefix = decoded.substring(0, dashIndex);
    const suffix = decoded.substring(dashIndex + 1);

    if (/^\d{4,8}$/.test(prefix) || /^p\d+$/i.test(prefix)) {
      return { id: prefix, slug: suffix };
    }
  }

  // Pattern 2: Pure ID (e.g. "10001" or "p1")
  if (/^\d{4,8}$/.test(decoded) || /^p\d+$/i.test(decoded)) {
    return { id: decoded };
  }

  // Pattern 3: Legacy or fallback slug (e.g. "the-starry-night")
  return { slug: decoded };
}

/**
 * Returns URL for the artwork story / blog page: /painting/{id}-{slug}/story
 */
export function getPaintingStoryUrl(painting: { id?: string; slug?: string } | null | undefined): string {
  const base = getPaintingUrl(painting);
  return `${base}/story`;
}
