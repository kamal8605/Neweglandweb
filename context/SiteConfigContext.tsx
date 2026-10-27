"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { API_BASE, homepageApiPath, parseHomepagePayload } from "@/lib/homepage";

export interface SiteSettings {
  site_name?: string;
  logo_url?: string | null;
  phone?: string;
  email?: string;
  address?: string;
  search_placeholder?: string;
  login_text?: string;
  register_text?: string;
  sale_label?: string;
  sale_url?: string;
  newsletter_enabled?: boolean;
  newsletter_title?: string;
  newsletter_placeholder?: string;
  newsletter_button_text?: string;
  seo_title?: string;
  seo_description?: string;
  homepage_heading?: string;
  catalog_background_logo_url?: string | null;
  footer_copyright?: string;
  footer_legal_notice?: string;
  business_hours_title?: string;
  /** Always sent by current backends (null = not set). Undefined only from a backend that predates the setting. */
  nicotine_warning?: string | null;
  app_store_url?: string | null;
  play_store_url?: string | null;
  nav_groups?: { label: string; keywords: string[]; url?: string }[];
  footer_columns?: { title: string; links: { label: string; url: string }[] }[];
  business_hours?: string[];
}

export interface HomepageItem {
  id: number;
  kind: "content" | "heading" | "slide" | "brand" | "catalog";
  title: string | null;
  /** null when the item has neither an uploaded image nor an external URL. */
  desktop_image_url: string | null;
  mobile_image_url: string | null;
  pdf_url: string | null;
  alt_text: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface HomepageSection {
  id: number;
  type: "featured_category" | "banner" | "hero" | "product_carousel" | "brand_showcase" | "catalog_showcase";
  title: string;
  settings: Record<string, unknown>;
  data: { product_ids?: number[] } | null;
  items: HomepageItem[];
  sort_order: number;
  is_active: boolean;
}

export interface HomepagePayload {
  client: string;
  label: string;
  site: SiteSettings;
  sections: HomepageSection[];
}

interface SiteConfigValue {
  homepage: HomepagePayload | null;
  site: SiteSettings;
  loaded: boolean;
  error: string | null;
  reload: () => void;
}

const SiteConfigContext = createContext<SiteConfigValue>({ homepage: null, site: {}, loaded: false, error: null, reload: () => undefined });

export function SiteConfigProvider({ children, initialHomepage = null }: { children: ReactNode; initialHomepage?: HomepagePayload | null }) {
  // The server passes the payload it already fetched, so the first render (and the HTML) has the real content.
  const [homepage, setHomepage] = useState<HomepagePayload | null>(initialHomepage);
  const [loaded, setLoaded] = useState(initialHomepage !== null);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const reload = useCallback(() => {
    setLoaded(false);
    setError(null);
    setRequestVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    if (requestVersion === 0 && initialHomepage) return;
    const controller = new AbortController();
    fetch(`${API_BASE}${homepageApiPath()}`, { headers: { Accept: "application/json" }, signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Homepage API returned ${response.status}`);
        const payload = parseHomepagePayload(await response.json());
        if (!payload) throw new Error("Homepage API returned an unexpected response");
        return payload;
      })
      .then((payload) => setHomepage(payload))
      .catch((error: unknown) => {
        if ((error as Error)?.name === "AbortError") return;
        setHomepage(null);
        setError((error as Error)?.message || "Homepage configuration could not be loaded.");
        if (process.env.NODE_ENV === "development") console.error("Site configuration could not be loaded", error);
      })
      .finally(() => setLoaded(true));
    return () => controller.abort();
  }, [initialHomepage, requestVersion]);

  // Title and description are rendered on the server (app/layout.tsx and per-page metadata);
  // overwriting document.title here used to give every page the same title.


  const value = useMemo(() => ({ homepage, site: homepage?.site ?? {}, loaded, error, reload }), [error, homepage, loaded, reload]);
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
