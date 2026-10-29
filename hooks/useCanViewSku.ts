"use client";

import { useAuth } from "@/context/AuthContext";

/**
 * SKUs are wholesale information: only signed-in, approved customers see them (guests and pending accounts do not).
 * This only hides them in the UI — the public product API still returns `sku` (a backend concern).
 */
export function useCanViewSku(): boolean {
  const { isAuthenticated, isApproved } = useAuth();
  return isAuthenticated && isApproved;
}
