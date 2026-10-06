import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PRODUCTS_PER_SITEMAP, productTotal } from "@/lib/sitemap";

export const revalidate = 86400;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const productSitemaps = Math.max(1, Math.ceil((await productTotal()) / PRODUCTS_PER_SITEMAP));
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Account-only pages and search/filter permutations of the listing pages.
      disallow: ["/cart", "/checkout", "/orders", "/wishlist", "/account", "/login", "/*?*search=", "/*?*sort="],
    },
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      ...Array.from({ length: productSitemaps }, (_, i) => `${SITE_URL}/product/sitemap/${i}.xml`),
    ],
  };
}
