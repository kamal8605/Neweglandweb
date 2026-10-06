/**
 * Server-side helpers for metadata, robots and sitemaps (no browser APIs, no auth).
 * Catalogue responses fetched here are public and cached by Next for `revalidate` seconds.
 */
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "") + "/api";

/**
 * Public origin of the storefront, used for canonical URLs, sitemaps and Open Graph.
 * Set NEXT_PUBLIC_SITE_URL to the production domain; Vercel's production URL is the fallback.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export async function fetchApi<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/**
 * fetchApi with retries for build/background jobs (sitemaps): a transient failure from the API host
 * (timeout, 429, 5xx) is retried with a short back-off instead of silently producing an empty list.
 */
export async function fetchApiWithRetry<T>(path: string, revalidate = 300, attempts = 3): Promise<T | null> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const result = await fetchApi<T>(path, revalidate);
    if (result !== null) return result;
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 750 * attempt));
  }
  return null;
}

/** True only when the API positively says the resource does not exist (not on network/server errors). */
export async function apiSaysNotFound(path: string, revalidate = 300): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}${path}`, { headers: { Accept: "application/json" }, next: { revalidate } });
    return response.status === 404;
  } catch {
    return false;
  }
}

export interface PublicSiteSettings {
  site_name?: string;
  seo_title?: string;
  seo_description?: string;
  logo_url?: string | null;
}

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  const client = process.env.NEXT_PUBLIC_HOMEPAGE_CLIENT || "new-england";
  const payload = await fetchApi<{ site?: PublicSiteSettings }>(`/homepage?client=${encodeURIComponent(client)}`);
  return payload?.site ?? {};
}

/** Plain-text excerpt for meta descriptions (strips tags, collapses whitespace). */
export function excerpt(value: string | null | undefined, max = 160): string | undefined {
  if (!value) return undefined;
  const text = value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return undefined;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** Pages behind login: never indexed, links not followed. */
export const PRIVATE_PAGE_ROBOTS = { index: false, follow: false } as const;
