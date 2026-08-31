import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  products_count?: number;
  children?: Category[];
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () =>
      api
        .get<{ data: Category[] }>("/categories")
        .then((r) => (Array.isArray(r.data) ? r.data : r.data.data)),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategory(id: number | string) {
  return useQuery<Category>({
    queryKey: ["category", id],
    queryFn: () => api.get<Category>(`/categories/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}
