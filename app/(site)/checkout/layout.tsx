import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PRIVATE_PAGE_ROBOTS } from "@/lib/site";

// Account-only page: keep it out of search results.
export const metadata: Metadata = { title: "Checkout", robots: PRIVATE_PAGE_ROBOTS };

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
