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

export interface CartItem {
  product_id: number;
  name: string;
  sku: string;
  image: string | null;
  price: number;
  quantity: number;
  parent_id?: number | null;
  parent_name?: string | null;
}

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

const STORAGE_KEY = "fastweb_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isSyncingPrices, setIsSyncingPrices] = useState(false);
  const itemsRef = useRef<CartItem[]>([]);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setItems(JSON.parse(stored));
      } catch {
        // Ignore corrupt storage and start with an empty cart.
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Persist to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
    itemsRef.current = items;
  }, [items, hydrated]);

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
    if (!hydrated || !isAuthenticated) return;
    const timer = window.setTimeout(() => void refreshPrices(), 0);
    return () => window.clearTimeout(timer);
  }, [hydrated, isAuthenticated, refreshPrices]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, qty: number) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product_id === item.product_id);
        if (existing) {
          return prev.map((i) =>
            i.product_id === item.product_id
              ? { ...i, ...item, quantity: i.quantity + qty }
              : i
          );
        }
        return [...prev, { ...item, quantity: qty }];
      });
    },
    []
  );

  const updateQty = useCallback((product_id: number, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product_id !== product_id));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product_id === product_id ? { ...i, quantity: qty } : i
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
