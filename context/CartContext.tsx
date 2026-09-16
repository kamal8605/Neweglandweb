"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { MAX_CART_QUANTITY, mergeCarts, sanitizeCart, type CartItem } from "@/lib/cart";
export type { CartItem } from "@/lib/cart";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, qty: number) => void;
  updateQty: (product_id: number, qty: number) => void;
  removeItem: (product_id: number) => void;
  clearCart: () => void;
  isSyncingPrices: boolean;
  refreshPrices: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const LEGACY_STORAGE_KEY = "fastweb_cart";
const GUEST_STORAGE_KEY = "fastweb_cart_guest";
function readCart(key: string): CartItem[] {
  try {
    return sanitizeCart(JSON.parse(localStorage.getItem(key) ?? "[]"));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);
  const [isSyncingPrices, setIsSyncingPrices] = useState(false);
  const itemsRef = useRef<CartItem[]>([]);
  const userId = user?.id;
  const storageKey = userId ? `fastweb_cart_user_${userId}` : GUEST_STORAGE_KEY;

  // Load a cart scoped to the current guest or authenticated account.
  useEffect(() => {
    if (authLoading) return;
    const timer = window.setTimeout(() => {
      let nextItems = readCart(storageKey);

      if (userId) {
        const guestItems = mergeCarts(readCart(GUEST_STORAGE_KEY), readCart(LEGACY_STORAGE_KEY));
        nextItems = mergeCarts(nextItems, guestItems);
        localStorage.removeItem(GUEST_STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } else if (nextItems.length === 0) {
        nextItems = readCart(LEGACY_STORAGE_KEY);
        if (nextItems.length > 0) localStorage.removeItem(LEGACY_STORAGE_KEY);
      }

      itemsRef.current = nextItems;
      setItems(nextItems);
      setLoadedStorageKey(storageKey);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [authLoading, storageKey, userId]);

  // Persist only after the correct account scope has been loaded.
  useEffect(() => {
    itemsRef.current = items;
    if (loadedStorageKey === storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, loadedStorageKey, storageKey]);

  const refreshPrices = useCallback(async () => {
    const currentItems = itemsRef.current;
    if (!isAuthenticated || currentItems.length === 0) return;

    setIsSyncingPrices(true);
    try {
      const results = await Promise.allSettled(
        currentItems.map((item) => api.get(`/products/${item.product_id}`))
      );

      const freshProducts = new Map<number, Record<string, unknown>>();
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          freshProducts.set(currentItems[index].product_id, result.value.data);
        }
      });

      setItems((previous) =>
        previous.map((item) => {
          const product = freshProducts.get(item.product_id);
          if (!product) return item;

          const rawPrice = product.current_price ?? product.sale_price ?? product.regular_price;
          const freshPrice = rawPrice === null || rawPrice === undefined ? item.price : Number(rawPrice);

          return {
            ...item,
            name: typeof product.name === "string" ? product.name : item.name,
            sku: typeof product.sku === "string" ? product.sku : item.sku,
            image: typeof product.image === "string" ? product.image : item.image,
            price: Number.isFinite(freshPrice) ? freshPrice : item.price,
          };
        })
      );
    } finally {
      setIsSyncingPrices(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (loadedStorageKey !== storageKey || !isAuthenticated) return;
    const timer = window.setTimeout(() => void refreshPrices(), 0);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated, loadedStorageKey, refreshPrices, storageKey]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, qty: number) => {
      const safeQty = Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(qty)));
      setItems((prev) => {
        const existing = prev.find((i) => i.product_id === item.product_id);
        if (existing) {
          return prev.map((i) =>
            i.product_id === item.product_id
              ? { ...i, ...item, quantity: Math.min(MAX_CART_QUANTITY, i.quantity + safeQty) }
              : i
          );
        }
        return [...prev, { ...item, quantity: safeQty }];
      });
    },
    []
  );

  const updateQty = useCallback((product_id: number, qty: number) => {
    const safeQty = Math.min(MAX_CART_QUANTITY, Math.floor(qty));
    if (safeQty <= 0 || !Number.isFinite(safeQty)) {
      setItems((prev) => prev.filter((i) => i.product_id !== product_id));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product_id === product_id ? { ...i, quantity: safeQty } : i
        )
      );
    }
  }, []);

  const removeItem = useCallback((product_id: number) => {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotal, addItem, updateQty, removeItem, clearCart, isSyncingPrices, refreshPrices }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
