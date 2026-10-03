import { useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

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

interface WishlistApiEntry {
  id: number;
  added_at: string;
  product: { id: number; name: string; sku: string; image: string | null; in_stock: boolean; stock_quantity?: number | null };
}

/** Query key scoped to the account, so one user's cached wishlist can never be shown to another. */
export const wishlistKey = (userId: number | null | undefined) => ["wishlist", userId ?? "guest"] as const;

/**
 * The signed-in user's wishlist, stored on the server (shared by all their devices).
 * Re-fetched when the window regains focus so additions from another device appear.
 */
export function useWishlist() {
  const { user } = useAuth();
  return useQuery<WishlistItem[]>({
    queryKey: wishlistKey(user?.id),
    enabled: !!user,
    queryFn: () =>
      api.get<{ data: WishlistApiEntry[] }>("/wishlist").then((r) =>
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
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useWishlistIds() {
  const { data } = useWishlist();
  return new Set((data ?? []).map((i) => i.product_id));
}

export function useWishlistCount() {
  const { data } = useWishlist();
  return data?.length ?? 0;
}

/**
 * Add/remove a product. The UI updates immediately (optimistic), repeated clicks on a product that is
 * still saving are ignored, and the list is re-read from the server afterwards so it stays authoritative.
 */
export function useToggleWishlist() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const inFlight = useRef(new Set<number>());

  return useCallback(
    async (productId: number, meta?: Partial<Pick<WishlistItem, "name" | "sku" | "image" | "in_stock">>) => {
      if (!user || inFlight.current.has(productId)) return;
      const key = wishlistKey(user.id);
      const previous = qc.getQueryData<WishlistItem[]>(key) ?? [];
      const isWishlisted = previous.some((i) => i.product_id === productId);

      inFlight.current.add(productId);
      await qc.cancelQueries({ queryKey: key });
      qc.setQueryData<WishlistItem[]>(key, isWishlisted
        ? previous.filter((i) => i.product_id !== productId)
        : [{
            id: -productId,
            product_id: productId,
            name: meta?.name ?? "",
            sku: meta?.sku ?? "",
            image: meta?.image ?? null,
            in_stock: meta?.in_stock ?? true,
            stock_quantity: null,
            added_at: new Date().toISOString(),
          }, ...previous]);

      try {
        if (isWishlisted) {
          await api.delete(`/wishlist/product/${productId}`).catch((error) => {
            // Already removed (e.g. on another device) is the state we wanted.
            if (error?.response?.status !== 404) throw error;
          });
        } else {
          await api.post("/wishlist", { product_id: productId });
        }
      } catch (error) {
        qc.setQueryData(key, previous);
        throw error;
      } finally {
        inFlight.current.delete(productId);
        void qc.invalidateQueries({ queryKey: key });
      }
    },
    [qc, user]
  );
}
