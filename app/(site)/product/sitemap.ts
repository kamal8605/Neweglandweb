import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PRODUCTS_PER_SITEMAP, productIdsForChunk, productTotal } from "@/lib/sitemap";

// Served as /product/sitemap/<id>.xml and listed in robots.txt.
export const revalidate = 86400;

export async function generateSitemaps() {
  const chunks = Math.max(1, Math.ceil((await productTotal()) / PRODUCTS_PER_SITEMAP));
  return Array.from({ length: chunks }, (_, id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const chunk = Number(await props.id);
  const ids = Number.isInteger(chunk) && chunk >= 0 ? await productIdsForChunk(chunk) : [];
  return ids.map((id) => ({ url: `${SITE_URL}/product/${id}`, changeFrequency: "weekly", priority: 0.6 }));
}
