import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "All Brands",
  description: "Browse every brand in our wholesale catalog.",
  alternates: { canonical: "/brands" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
