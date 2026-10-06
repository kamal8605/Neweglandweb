import { fetchApiWithRetry } from "@/lib/site";

/** Products per sitemap file (Google allows 50,000; smaller files keep each build request quick). */
export const PRODUCTS_PER_SITEMAP = 5000;
const API_PAGE_SIZE = 100; // max per_page accepted by /api/products
const SITEMAP_REVALIDATE = 60 * 60 * 24;
const CONCURRENT_PAGES = 5; // be gentle with the API host

interface ProductPage {
  data: { id: number }[];
  meta: { total: number; last_page: number };
}

export async function productTotal(): Promise<number> {
  const page = await fetchApiWithRetry<ProductPage>("/products?per_page=1", SITEMAP_REVALIDATE);
  return page?.meta.total ?? 0;
}

/**
 * Product ids for one sitemap chunk, fetched page by page. A page that still fails after retries is
 * skipped (not treated as the end of the catalogue), so one bad response cannot drop thousands of URLs.
 */
export async function productIdsForChunk(chunk: number): Promise<number[]> {
  const total = await productTotal();
  const lastPage = Math.ceil(total / API_PAGE_SIZE);
  const pagesPerChunk = PRODUCTS_PER_SITEMAP / API_PAGE_SIZE;
  const firstPage = chunk * pagesPerChunk + 1;
  const pages = Array.from({ length: pagesPerChunk }, (_, i) => firstPage + i).filter((page) => page <= lastPage);

  const ids: number[] = [];
  for (let i = 0; i < pages.length; i += CONCURRENT_PAGES) {
    const batch = await Promise.all(
      pages.slice(i, i + CONCURRENT_PAGES).map((page) =>
        fetchApiWithRetry<ProductPage>(`/products?per_page=${API_PAGE_SIZE}&page=${page}&sort=newest`, SITEMAP_REVALIDATE)
      )
    );
    for (const result of batch) ids.push(...(result?.data ?? []).map((product) => product.id));
  }
  return [...new Set(ids)];
}
