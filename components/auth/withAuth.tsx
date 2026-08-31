"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Redirects unauthenticated users to /login.
 * Call at the top of any page that requires auth.
 * Returns `isLoading` so the page can show a skeleton until resolved.
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isLoading, isAuthenticated };
}

/**
 * Redirects to /login if not authenticated, or back to / if authenticated
 * but not yet approved. Use for checkout and orders pages.
 */
export function useRequireApproved() {
  const { isAuthenticated, isApproved, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!isApproved) {
      router.replace("/");
    }
  }, [isAuthenticated, isApproved, isLoading, router]);

  return { isLoading, isAuthenticated, isApproved };
}
