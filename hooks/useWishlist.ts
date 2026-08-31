import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  image: string | null;
  in_stock: boolean;
  stock_quantity: number | null;
  added_at: string;
}

export function useWishlist() {
  return useQuery<WishlistItem[]>({
    queryKey: ["wishlist"],
    queryFn: () =>
      api
        .get<{ data: { id: number; added_at: string; product: { id: number; name: string; sku: string; image: string | null; in_stock: boolean; stock_quantity?: number | null } }[] }>("/wishlist")
        .then((r) =>
          (r.data.data ?? []).map((entry) => ({
            id: entry.id,
            product_id: entry.product.id,
            name: entry.product.name,
            sku: entry.product.sku,
            image: entry.product.image,
            in_stock: entry.product.in_stock,
            stock_quantity: entry.product.stock_quantity ?? null,
            added_at: entry.added_at,
          }))
        ),
    staleTime: 2 * 60 * 1000,
  });
}

export function useWishlistIds() {
  const { data } = useWishlist();
  return new Set((data ?? []).map((i) => i.product_id));
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  const { data: items = [] } = useWishlist();

  const addMutation = useMutation({
    mutationFn: (productId: number) =>
      api.post("/wishlist", { product_id: productId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) =>
      api.delete(`/wishlist/${productId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  return (productId: number) => {
    const isWishlisted = items.some((i) => i.product_id === productId);
    if (isWishlisted) {
      return removeMutation.mutateAsync(productId);
    } else {
      return addMutation.mutateAsync(productId);
    }
  };
}
