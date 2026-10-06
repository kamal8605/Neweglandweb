import type { MetadataRoute } from "next";
import { SITE_URL, fetchApi } from "@/lib/site";

// Pages, categories and brands. Products are in /product/sitemap/<n>.xml (see robots.ts).
export const revalidate = 86400;

interface CategoryNode { id: number; children?: CategoryNode[] }
interface BrandRow { id: number }

function flatten(nodes: CategoryNode[]): number[] {
  return nodes.flatMap((node) => [node.id, ...flatten(node.children ?? [])]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, brands] = await Promise.all([
    fetchApi<CategoryNode[] | { data: CategoryNode[] }>("/categories", revalidate),
    fetchApi<BrandRow[] | { data: BrandRow[] }>("/brands", revalidate),
  ]);
  const categoryList = Array.isArray(categories) ? categories : categories?.data ?? [];
  const brandList = Array.isArray(brands) ? brands : brands?.data ?? [];

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/new`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/sale`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/brands`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${SITE_URL}/register`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticPages,
    ...[...new Set(flatten(categoryList))].map((id) => ({ url: `${SITE_URL}/category/${id}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...brandList.map((brand) => ({ url: `${SITE_URL}/brand/${brand.id}`, changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}
