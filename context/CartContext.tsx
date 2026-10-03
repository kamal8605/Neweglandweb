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
import {
  MAX_CART_QUANTITY,
  fromServerCart,
  mergeCarts,
  sanitizeCart,
  type CartItem,
  type ServerCartResponse,
} from "@/lib/cart";
export type { CartItem } from "@/lib/cart";

/**
 * Cart state.
 *
 * - Guests: the cart lives in this browser only (localStorage `fastweb_cart_guest`).
 * - Signed-in users: the account cart on the server (`/api/cart`) is the source of truth, so the same cart
 *   appears on every device/browser. Nothing account-specific is written to localStorage.
 * - On sign-in, any guest cart in this browser is merged into the account cart once, then removed locally.
 * - Changes are applied optimistically and sent one at a time; the server's validated cart (current prices,
 *   stock caps, removed products) replaces local state once no other change is in flight.
 * - The cart is re-fetched when the tab becomes visible again, so edits made on another device show up.
 */
interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, qty: number) => void;
  updateQty: (product_id: number, qty: number) => void;
  removeItem: (product_id: number) => void;
  clearCart: () => void;
  /** True once the cart for the current guest/account has been loaded (avoids flashing an empty cart). */
  isLoaded: boolean;
  /** Messages from the server, e.g. "quantity limited to 4" or "product removed". */
  notices: string[];
  dismissNotices: () => void;
  /** Re-fetch the account cart from the server (latest prices, stock and edits from other devices). */
  refreshCart: () => Promise<void>;
  /** @deprecated kept for existing callers; same as `!isLoaded` / `refreshCart`. */
  isSyncingPrices: boolean;
  refreshPrices: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const LEGACY_STORAGE_KEY = "fastweb_cart";
const GUEST_STORAGE_KEY = "fastweb_cart_guest";
/** Old per-account browser carts (before carts were stored on the server); migrated once on sign-in. */
const LEGACY_USER_KEY = (userId: number) => `fastweb_cart_user_${userId}`;
/** Id of a guest-cart merge that has been sent but not confirmed; reused on retry so it is applied once. */
const MERGE_ID_KEY = "fastweb_cart_merge_id";
const RESYNC_MIN_INTERVAL_MS = 15_000;

function readCart(key: string): CartItem[] {
  try {
    return sanitizeCart(JSON.parse(localStorage.getItem(key) ?? "[]"));
  } catch {
    return [];
  }
}

function clampQty(qty: number, max = MAX_CART_QUANTITY) {
  return Math.min(max, MAX_CART_QUANTITY, Math.floor(qty));
}

function errorCart(error: unknown): ServerCartResponse | null {
  const data = (error as { response?: { data?: ServerCartResponse } })?.response?.data;
  return data && Array.isArray(data.data?.items) ? data : null;
}

function errorMessage(error: unknown) {
  return (error as { response?: { data?: { message?: string } } })?.response?.data?.message
    ?? "Your cart could not be updated. Please try again.";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoading: authLoading, user } = useAuth();
  const userId = user?.id ?? null;

  const [items, setItems] = useState<CartItem[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [notices, setNotices] = useState<string[]>([]);

  const scope = userId ? `user:${userId}` : "guest";
  const scopeRef = useRef(scope);
  const pendingRef = useRef(0);
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());
  const lastSyncRef = useRef(0);

  const isLoaded = !authLoading && loadedFor === scope;

  const addNotices = useCallback((next: string[] | undefined) => {
    if (next && next.length > 0) setNotices((prev) => Array.from(new Set([...prev, ...next])));
  }, []);

  /** Apply a server cart, unless the account changed meanwhile or newer local changes are still in flight. */
  const applyServerCart = useCallback(
    (forScope: string, response: ServerCartResponse) => {
      if (scopeRef.current !== forScope) return;
      addNotices(response.notices);
      lastSyncRef.current = Date.now();
      if (pendingRef.current === 0) setItems(fromServerCart(response.data.items));
    },
    [addNotices]
  );

  // ── Load the cart whenever the guest/account scope changes ────────────────
  useEffect(() => {
    if (authLoading) return;
    scopeRef.current = scope;
    pendingRef.current = 0;
    queueRef.current = Promise.resolve();
    let cancelled = false;

    if (!userId) {
      // Guest (or just signed out): only this browser's guest cart is shown, never a previous account's.
      const timer = window.setTimeout(() => {
        let guest = readCart(GUEST_STORAGE_KEY);
        if (guest.length === 0) {
          guest = readCart(LEGACY_STORAGE_KEY);
          if (guest.length > 0) localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
        setItems(guest);
        setNotices([]);
        setLoadedFor("guest");
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const forScope = scope;
    const local = mergeCarts(
      mergeCarts(readCart(GUEST_STORAGE_KEY), readCart(LEGACY_STORAGE_KEY)),
      readCart(LEGACY_USER_KEY(userId))
    );

    const load = async () => {
      setNotices([]);
      try {
        let response: ServerCartResponse;
        if (local.length > 0) {
          let mergeId = localStorage.getItem(MERGE_ID_KEY);
          if (!mergeId) {
            mergeId = `${userId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
            localStorage.setItem(MERGE_ID_KEY, mergeId);
          }
          response = (await api.post<ServerCartResponse>("/cart/merge", {
            merge_id: mergeId,
            items: local.map(({ product_id, quantity }) => ({ product_id, quantity })),
          })).data;
          // Merged into the account: the browser copies are no longer needed.
          [GUEST_STORAGE_KEY, LEGACY_STORAGE_KEY, LEGACY_USER_KEY(userId), MERGE_ID_KEY].forEach((key) =>
            localStorage.removeItem(key)
          );
        } else {
          response = (await api.get<ServerCartResponse>("/cart")).data;
        }
        if (cancelled) return;
        applyServerCart(forScope, response);
      } catch (error) {
        if (cancelled || scopeRef.current !== forScope) return;
        // Keep showing what this browser had so nothing disappears; the merge is retried on the next load.
        setItems(local);
        addNotices([errorMessage(error)]);
      } finally {
        if (!cancelled && scopeRef.current === forScope) setLoadedFor(forScope);
      }
    };
    void load();

    return () => {
      cancelled = true;
    };
  }, [addNotices, applyServerCart, authLoading, scope, userId]);

  // Persist the guest cart only (account carts live on the server).
  useEffect(() => {
    if (!userId && loadedFor === "guest") {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loadedFor, userId]);

  /** Queue a server change for the signed-in account; requests run one after another. */
  const sendChange = useCallback(
    (request: () => Promise<{ data: ServerCartResponse }>) => {
      const forScope = scopeRef.current;
      pendingRef.current += 1;
      queueRef.current = queueRef.current.then(async () => {
        if (scopeRef.current !== forScope) return;
        let response: ServerCartResponse | null = null;
        try {
          response = (await request()).data;
        } catch (error) {
          if (scopeRef.current !== forScope) return;
          addNotices([errorMessage(error)]);
          response = errorCart(error);
          if (!response) {
            try {
              response = (await api.get<ServerCartResponse>("/cart")).data;
            } catch {
              response = null;
            }
          }
        } finally {
          if (scopeRef.current === forScope) pendingRef.current = Math.max(0, pendingRef.current - 1);
        }
        if (response) applyServerCart(forScope, response);
      });
    },
    [addNotices, applyServerCart]
  );

  const refreshCart = useCallback(async () => {
    const forScope = scopeRef.current;
    if (!userId || pendingRef.current > 0) return;
    try {
      const response = (await api.get<ServerCartResponse>("/cart")).data;
      if (pendingRef.current === 0) applyServerCart(forScope, response);
    } catch {
      // keep the current state; the next sync will try again
    }
  }, [applyServerCart, userId]);

  // Pick up edits made on other devices when the user comes back to this tab.
  useEffect(() => {
    if (!userId || loadedFor !== scope) return;
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastSyncRef.current < RESYNC_MIN_INTERVAL_MS) return;
      lastSyncRef.current = Date.now();
      void refreshCart();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [loadedFor, refreshCart, scope, userId]);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, qty: number) => {
      const safeQty = Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(qty)));
      if (!Number.isFinite(safeQty)) return;
      setItems((prev) => {
        const existing = prev.find((i) => i.product_id === item.product_id);
        if (existing) {
          return prev.map((i) =>
            i.product_id === item.product_id
              ? { ...i, ...item, quantity: clampQty(i.quantity + safeQty, i.max_quantity) }
              : i
          );
        }
        return [...prev, { ...item, quantity: safeQty }];
      });
      if (userId) {
        sendChange(() => api.post<ServerCartResponse>("/cart/items", { product_id: item.product_id, quantity: safeQty }));
      }
    },
    [sendChange, userId]
  );

  const updateQty = useCallback(
    (product_id: number, qty: number) => {
      const safeQty = Math.floor(qty);
      if (!Number.isFinite(safeQty)) return;
      if (safeQty <= 0) {
        setItems((prev) => prev.filter((i) => i.product_id !== product_id));
      } else {
        setItems((prev) =>
          prev.map((i) => (i.product_id === product_id ? { ...i, quantity: clampQty(safeQty, i.max_quantity) } : i))
        );
      }
      if (userId) {
        sendChange(() =>
          api.patch<ServerCartResponse>(`/cart/items/${product_id}`, { quantity: Math.max(0, clampQty(safeQty)) })
        );
      }
    },
    [sendChange, userId]
  );

  const removeItem = useCallback(
    (product_id: number) => {
      setItems((prev) => prev.filter((i) => i.product_id !== product_id));
      if (userId) sendChange(() => api.delete<ServerCartResponse>(`/cart/items/${product_id}`));
    },
    [sendChange, userId]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (userId) sendChange(() => api.delete<ServerCartResponse>("/cart"));
  }, [sendChange, userId]);

  const dismissNotices = useCallback(() => setNotices([]), []);

  // Never show a cart that belongs to another scope (e.g. right after sign-out or an account switch).
  // The only exception is guest -> sign-in: the guest items are about to be merged, so keep them visible
  // instead of flashing an empty cart while the account cart loads.
  const visibleItems = loadedFor === scope || (loadedFor === "guest" && userId !== null) ? items : [];

  const itemCount = visibleItems.reduce((sum, i) => sum + i.quantity, 0);
  // Out-of-stock lines stay visible but are not part of the payable subtotal.
  const subtotal = visibleItems.reduce((sum, i) => (i.in_stock === false ? sum : sum + i.price * i.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items: visibleItems,
        itemCount,
        subtotal,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        isLoaded,
        notices,
        dismissNotices,
        refreshCart,
        isSyncingPrices: !isLoaded,
        refreshPrices: refreshCart,
      }}
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
