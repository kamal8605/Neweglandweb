"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Redirects unauthenticated users to /login.
 * Call at the top of any page that requires auth.
 * Returns `isLoading` so the page can show a skeleton until resolved.
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return { isLoading, isAuthenticated };
}

/**
 * Redirects to /login if not authenticated, or back to / if authenticated
 * but not yet approved. Use for checkout and orders pages.
 */
export function useRequireApproved() {
  const { isAuthenticated, isApproved, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    } else if (!isApproved) {
      router.replace("/");
    }
  }, [isAuthenticated, isApproved, isLoading, pathname, router]);

  return { isLoading, isAuthenticated, isApproved };
}
