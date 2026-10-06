import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sale & Clearance",
  description: "Discounted wholesale products and clearance lines.",
  alternates: { canonical: "/sale" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
