/**
 * Contract for GET /api/homepage?client=… (gateway HomepageController::show), shared by the server render
 * (lib/site.ts) and the client-side reload (SiteConfigContext). The payload is admin-managed; this module only
 * validates its shape — it never adds content of its own.
 */
import type { HomepageItem, HomepagePayload, HomepageSection, SiteSettings } from "@/context/SiteConfigContext";
import { LEGACY_APP_STORE_URL, LEGACY_NICOTINE_WARNING, LEGACY_PLAY_STORE_URL, legacyBadgeForTitle } from "@/lib/legacyContent";

/** API origin plus `/api`, from NEXT_PUBLIC_API_URL (same fallback as lib/axios.ts). */
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "") + "/api";

export function homepageClientKey(): string {
  return process.env.NEXT_PUBLIC_HOMEPAGE_CLIENT || "new-england";
}

export function homepageApiPath(client = homepageClientKey()): string {
  return `/homepage?client=${encodeURIComponent(client)}`;
}

const SECTION_TYPES = new Set<HomepageSection["type"]>(["featured_category", "banner", "hero", "product_carousel", "brand_showcase", "catalog_showcase"]);
const ITEM_KINDS = new Set<HomepageItem["kind"]>(["content", "heading", "slide", "brand", "catalog"]);

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const optionalString = (value: unknown): string | null => (typeof value === "string" && value.trim() !== "" ? value : null);
const integer = (value: unknown): number | null => (typeof value === "number" && Number.isInteger(value) ? value : null);

/** Seeded configs store the flag as "1"/"0"; configs saved by the admin store a real boolean. */
function flag(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1" || value === "true") return true;
  if (value === 0 || value === "0" || value === "false" || value === "") return false;
  return undefined;
}

function parseItem(value: unknown): HomepageItem | null {
  if (!isRecord(value)) return null;
  const id = integer(value.id);
  if (id === null || !ITEM_KINDS.has(value.kind as HomepageItem["kind"])) return null;
  return {
    id,
    kind: value.kind as HomepageItem["kind"],
    title: optionalString(value.title),
    desktop_image_url: optionalString(value.desktop_image_url),
    mobile_image_url: optionalString(value.mobile_image_url),
    pdf_url: optionalString(value.pdf_url),
    alt_text: typeof value.alt_text === "string" ? value.alt_text : "",
    link_url: optionalString(value.link_url),
    sort_order: integer(value.sort_order) ?? 0,
    is_active: value.is_active !== false,
  };
}

function parseSection(value: unknown): HomepageSection | null {
  if (!isRecord(value)) return null;
  const id = integer(value.id);
  if (id === null || !SECTION_TYPES.has(value.type as HomepageSection["type"])) return null;
  const data = isRecord(value.data) ? value.data : null;
  const productIds = Array.isArray(data?.product_ids) ? data.product_ids.filter((item): item is number => integer(item) !== null) : undefined;
  return {
    id,
    type: value.type as HomepageSection["type"],
    title: typeof value.title === "string" ? value.title : "",
    settings: isRecord(value.settings) ? value.settings : {},
    data: data ? { product_ids: productIds } : null,
    items: (Array.isArray(value.items) ? value.items : []).map(parseItem).filter((item): item is HomepageItem => item !== null),
    sort_order: integer(value.sort_order) ?? 0,
    is_active: value.is_active !== false,
  };
}

/** An absolute https:// URL on exactly `host` (mirrors the backend's HttpsUrlOnHost rule). */
function storeUrl(value: unknown, host: string): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === host && !url.username && !url.password && !url.port ? url.href : null;
  } catch {
    return null;
  }
}

/** Key absent (backend before these settings existed) stays undefined; present-but-empty becomes null. */
const ifPresent = <T>(source: Record<string, unknown>, key: string, read: (value: unknown) => T): T | undefined => (key in source ? read(source[key]) : undefined);

function parseSite(input: unknown): SiteSettings {
  const value: Record<string, unknown> = isRecord(input) ? input : {};
  const site = { ...value } as SiteSettings & Record<string, unknown>;
  site.newsletter_enabled = flag(value.newsletter_enabled);
  site.nicotine_warning = ifPresent(value, "nicotine_warning", optionalString);
  site.app_store_url = ifPresent(value, "app_store_url", (url) => storeUrl(url, "apps.apple.com"));
  site.play_store_url = ifPresent(value, "play_store_url", (url) => storeUrl(url, "play.google.com"));
  site.nav_groups = Array.isArray(value.nav_groups)
    ? value.nav_groups.filter(isRecord).filter((group) => typeof group.label === "string").map((group) => ({
        label: group.label as string,
        keywords: Array.isArray(group.keywords) ? group.keywords.filter((keyword): keyword is string => typeof keyword === "string" && keyword.trim() !== "").map((keyword) => keyword.toLowerCase()) : [],
        url: optionalString(group.url) ?? undefined,
      }))
    : [];
  site.footer_columns = Array.isArray(value.footer_columns)
    ? value.footer_columns.filter(isRecord).filter((column) => typeof column.title === "string").map((column) => ({
        title: column.title as string,
        links: (Array.isArray(column.links) ? column.links : []).filter(isRecord).filter((link) => typeof link.label === "string" && typeof link.url === "string").map((link) => ({ label: link.label as string, url: link.url as string })),
      }))
    : [];
  site.business_hours = Array.isArray(value.business_hours) ? value.business_hours.filter((row): row is string => typeof row === "string") : [];
  return site;
}

/** Validated payload, or null when the response is not a homepage payload at all. Malformed sections/items are dropped. */
export function parseHomepagePayload(value: unknown): HomepagePayload | null {
  if (!isRecord(value) || !Array.isArray(value.sections)) return null;
  return {
    client: typeof value.client === "string" ? value.client : "",
    label: typeof value.label === "string" ? value.label : "",
    site: parseSite(value.site),
    sections: value.sections.map(parseSection).filter((section): section is HomepageSection => section !== null),
  };
}

/** Warning-bar text: the admin's value (null = no bar). Only a backend that predates the setting gets the old text. */
export function nicotineWarning(site: SiteSettings): string | null {
  return site.nicotine_warning === undefined ? LEGACY_NICOTINE_WARNING : site.nicotine_warning;
}

/** App-store listings: the admin's links (null = not offered). Only a backend that predates the settings gets the old links. */
export function appStoreLinks(site: SiteSettings): { appStore: string | null; playStore: string | null } {
  return {
    appStore: site.app_store_url === undefined ? LEGACY_APP_STORE_URL : site.app_store_url,
    playStore: site.play_store_url === undefined ? LEGACY_PLAY_STORE_URL : site.play_store_url,
  };
}

/** Product-row badge from `settings.badge` (null/empty = none). Only a backend that predates the setting gets the title rule. */
export function productRowBadge(section: Pick<HomepageSection, "title" | "settings">): string | null {
  if (!("badge" in section.settings)) return legacyBadgeForTitle(section.title);
  return optionalString(section.settings.badge)?.trim() || null;
}
