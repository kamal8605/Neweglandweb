import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { apiSaysNotFound, excerpt, fetchApi } from "@/lib/site";

interface PublicProduct {
  id: number;
  name: string;
  sku: string | null;
  image: string | null;
  short_description: string | null;
  description: string | null;
  brand: { name: string } | null;
  category: { name: string } | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return { title: "Product not found", robots: { index: false } };

  const product = await fetchApi<PublicProduct>(`/products/${id}`);
  if (!product) return { title: "Product not found", robots: { index: false } };

  const context = [product.brand?.name, product.category?.name].filter(Boolean).join(" · ");
  const description =
    excerpt(product.short_description) ??
    excerpt(product.description) ??
    `${product.name}${context ? ` (${context})` : ""} available wholesale. Sign in to a wholesale account to see pricing and order.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      title: product.name,
      description,
      url: `/product/${product.id}`,
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
  };
}

// A missing/disabled product answers with a real 404 status (not a "soft 404" page with status 200).
export default async function ProductLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9]+$/.test(id) || (await apiSaysNotFound(`/products/${id}`))) notFound();
  return children;
}
