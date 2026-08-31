import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Product {
  id: number;
  name: string;
  sku: string;
  /** Nested brand object as returned by the API */
  brand?: { id: number; name: string; slug: string } | null;
  /** Nested category object as returned by the API */
  category?: { id: number; name: string; slug: string } | null;
  current_price: number | null;
  sale_price: number | null;
  regular_price: number | null;
  on_sale: boolean;
  in_stock: boolean;
  stock_quantity: number | null;
  prices_visible: boolean;
  image: string | null;
  type: "simple" | "grouped";
  parent_id?: number | null;
  children?: Product[];
  description?: string;
  short_description?: string;
  attributes?: Record<string, string>;
  images?: { url: string; is_primary: boolean }[];
}

export interface ProductsMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  from: number;
  to: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: ProductsMeta;
}

export interface ProductsParams {
  category_id?: number | string;
  brand_id?: number | string;
  in_stock?: boolean;
  search?: string;
  sort?: "name_asc" | "price_asc" | "price_desc" | "newest";
  per_page?: number;
  page?: number;
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function normalizeProduct(p: Product): Product {
  return {
    ...p,
    current_price: toNum(p.current_price),
    sale_price: toNum(p.sale_price),
    regular_price: toNum(p.regular_price),
    children: p.children?.map(normalizeProduct),
  };
}

export function useProducts(params: ProductsParams = {}) {
  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: () =>
      api
        .get<ProductsResponse>("/products", {
          params: {
            ...params,
            in_stock: params.in_stock ? true : undefined,
          },
        })
        .then((r) => ({ ...r.data, data: r.data.data.map(normalizeProduct) })),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useProduct(id: number | string) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () =>
      api.get<Product>(`/products/${id}`).then((r) => normalizeProduct(r.data)),
    enabled: !!id,
  });
}
