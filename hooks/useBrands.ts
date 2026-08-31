import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  location?: string;
  founded_year?: number;
  products_count?: number;
}

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: () =>
      api
        .get<{ data: Brand[] }>("/brands")
        .then((r) => (Array.isArray(r.data) ? r.data : r.data.data)),
    staleTime: 10 * 60 * 1000,
  });
}

export function useBrand(id: number | string) {
  return useQuery<Brand>({
    queryKey: ["brand", id],
    queryFn: () => api.get<Brand>(`/brands/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}
