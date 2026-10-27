import { afterEach, describe, expect, it, vi } from "vitest";
import { appStoreLinks, homepageApiPath, nicotineWarning, parseHomepagePayload, productRowBadge } from "./homepage";
import { LEGACY_APP_STORE_URL, LEGACY_NICOTINE_WARNING, LEGACY_PLAY_STORE_URL } from "./legacyContent";

// Shapes copied from a live GET /api/homepage?client=new-england response.
const productSection = {
  id: 3,
  type: "product_carousel",
  title: "New Arrivals",
  sort_order: 2,
  is_active: true,
  settings: { limit: 14, product_ids: [52142, 51266] },
  data: { product_ids: [52142, 51266] },
  items: [{ id: 4, kind: "heading", title: "new Arrivals", desktop_image_url: "https://api.example.com/storage/homepage/new-england/3/a.webp", mobile_image_url: null, pdf_url: null, alt_text: "banner", link_url: null, sort_order: 0, is_active: true }],
};
const brandSection = {
  id: 9,
  type: "brand_showcase",
  title: "Top Brands",
  sort_order: 8,
  is_active: true,
  settings: {},
  data: null,
  items: [{ id: 12, kind: "brand", title: "Elysian Logo 300X300", desktop_image_url: "https://api.example.com/storage/homepage/new-england/4/brands/b.webp", mobile_image_url: null, pdf_url: null, alt_text: "Elysian Logo 300X300", link_url: "/brands", sort_order: 1, is_active: true }],
};
const livePayload = {
  client: "new-england",
  label: "New England",
  site: { site_name: "New England Distribution", newsletter_enabled: "1", nav_groups: [{ label: "Cigar", keywords: ["cigar"] }], footer_columns: [{ title: "Useful Links", links: [{ label: "Home", url: "/" }] }], business_hours: ["Sunday: Closed"] },
  sections: [productSection, brandSection],
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("parseHomepagePayload", () => {
  it("passes the admin-managed content through unchanged", () => {
    const payload = parseHomepagePayload(livePayload)!;
    expect(payload.sections.map((section) => [section.id, section.type, section.title])).toEqual([[3, "product_carousel", "New Arrivals"], [9, "brand_showcase", "Top Brands"]]);
    expect(payload.sections[0].data?.product_ids).toEqual([52142, 51266]);
    expect(payload.sections[0].items[0]).toEqual(productSection.items[0]);
    expect(payload.sections[1].items[0].link_url).toBe("/brands");
    expect(payload.site.site_name).toBe("New England Distribution");
    expect(payload.site.footer_columns).toEqual(livePayload.site.footer_columns);
    expect(payload.site.business_hours).toEqual(["Sunday: Closed"]);
  });

  it("adds no content of its own", () => {
    const payload = parseHomepagePayload({ sections: [] })!;
    expect(payload.sections).toEqual([]);
    expect(payload.site.nav_groups).toEqual([]);
    expect(payload.site.footer_columns).toEqual([]);
    expect(payload.site.business_hours).toEqual([]);
    expect(payload.site.site_name).toBeUndefined();
  });

  it("reads the seeded string flag and the admin's boolean the same way", () => {
    expect(parseHomepagePayload({ ...livePayload, site: { newsletter_enabled: "1" } })!.site.newsletter_enabled).toBe(true);
    expect(parseHomepagePayload({ ...livePayload, site: { newsletter_enabled: "0" } })!.site.newsletter_enabled).toBe(false);
    expect(parseHomepagePayload({ ...livePayload, site: { newsletter_enabled: false } })!.site.newsletter_enabled).toBe(false);
  });

  it("keeps items whose image is missing as null instead of inventing one", () => {
    const item = { ...brandSection.items[0], desktop_image_url: null };
    const payload = parseHomepagePayload({ sections: [{ ...brandSection, items: [item] }] })!;
    expect(payload.sections[0].items[0].desktop_image_url).toBeNull();
  });

  it("drops malformed sections and items rather than failing the whole page", () => {
    const payload = parseHomepagePayload({
      sections: [
        null,
        { ...productSection, type: "unknown_widget" },
        { ...productSection, id: "3" },
        { ...productSection, items: "not-an-array", data: { product_ids: [1, "2", 3.5, 4] }, settings: null },
        { ...brandSection, items: [{ id: 1, kind: "video" }, brandSection.items[0]] },
      ],
    })!;
    expect(payload.sections.map((section) => section.id)).toEqual([3, 9]);
    expect(payload.sections[0].items).toEqual([]);
    expect(payload.sections[0].settings).toEqual({});
    expect(payload.sections[0].data?.product_ids).toEqual([1, 4]);
    expect(payload.sections[1].items.map((item) => item.id)).toEqual([12]);
  });

  it.each([null, undefined, "error", [], { message: "Homepage config not found." }, { sections: {} }])("returns null for a response that is not a homepage payload (%j)", (value) => {
    expect(parseHomepagePayload(value)).toBeNull();
  });
});

describe("homepage request", () => {
  it("targets the gateway's /api/homepage for the configured client", () => {
    vi.stubEnv("NEXT_PUBLIC_HOMEPAGE_CLIENT", "new-england");
    expect(homepageApiPath()).toBe("/homepage?client=new-england");
    expect(homepageApiPath("a b")).toBe("/homepage?client=a%20b");
  });
});

describe("admin-managed content settings", () => {
  const site = (extra: Record<string, unknown>) => parseHomepagePayload({ sections: [], site: extra })!.site;

  it("uses the admin's warning text, and none when the admin cleared it", () => {
    expect(nicotineWarning(site({ nicotine_warning: "WARNING: Contains nicotine." }))).toBe("WARNING: Contains nicotine.");
    expect(nicotineWarning(site({ nicotine_warning: null }))).toBeNull();
    expect(nicotineWarning(site({ nicotine_warning: "  " }))).toBeNull();
  });

  it("uses only valid https store links on the store's own host", () => {
    const links = appStoreLinks(site({ app_store_url: "https://apps.apple.com/us/app/x/id1", play_store_url: "https://evil.example/?play.google.com" }));
    expect(links).toEqual({ appStore: "https://apps.apple.com/us/app/x/id1", playStore: null });
    expect(appStoreLinks(site({ app_store_url: "http://apps.apple.com/x", play_store_url: null }))).toEqual({ appStore: null, playStore: null });
  });

  it("uses the row's badge setting, and none when it is null", () => {
    expect(productRowBadge({ title: "Top Cigar", settings: { badge: "Hot" } })).toBe("Hot");
    expect(productRowBadge({ title: "New Arrivals", settings: { badge: null } })).toBeNull();
    expect(productRowBadge({ title: "New Arrivals", settings: { badge: "" } })).toBeNull();
  });

  it("falls back to the previous storefront content only for a backend that does not send the keys", () => {
    const old = site({ site_name: "Store" });
    expect(old.nicotine_warning).toBeUndefined();
    expect(nicotineWarning(old)).toBe(LEGACY_NICOTINE_WARNING);
    expect(appStoreLinks(old)).toEqual({ appStore: LEGACY_APP_STORE_URL, playStore: LEGACY_PLAY_STORE_URL });
    expect(productRowBadge({ title: "New Arrivals", settings: {} })).toBe("New");
    expect(productRowBadge({ title: "Top Cigar", settings: {} })).toBeNull();
  });
});
