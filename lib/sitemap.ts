import { fetchApi } from "@/lib/site";

/** Products per sitemap file (Google allows 50,000; smaller files keep each build request quick). */
export const PRODUCTS_PER_SITEMAP = 5000;
const API_PAGE_SIZE = 100; // max per_page accepted by /api/products
const SITEMAP_REVALIDATE = 60 * 60 * 24;

interface ProductPage {
  data: { id: number }[];
  meta: { total: number; last_page: number };
}

export async function productTotal(): Promise<number> {
  const page = await fetchApi<ProductPage>("/products?per_page=1", SITEMAP_REVALIDATE);
  return page?.meta.total ?? 0;
}

/** Product ids for one sitemap chunk, fetched page by page (a few requests at a time). */
export async function productIdsForChunk(chunk: number): Promise<number[]> {
  const pagesPerChunk = PRODUCTS_PER_SITEMAP / API_PAGE_SIZE;
  const firstPage = chunk * pagesPerChunk + 1;
  const pages = Array.from({ length: pagesPerChunk }, (_, i) => firstPage + i);
  const ids: number[] = [];
  for (let i = 0; i < pages.length; i += 10) {
    const batch = await Promise.all(
      pages.slice(i, i + 10).map((page) => fetchApi<ProductPage>(`/products?per_page=${API_PAGE_SIZE}&page=${page}&sort=newest`, SITEMAP_REVALIDATE))
    );
    for (const result of batch) ids.push(...(result?.data ?? []).map((product) => product.id));
    if (batch.some((result) => !result || result.data.length < API_PAGE_SIZE)) break; // reached the end
  }
  return ids;
}
