import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { imageVariant, type ImageVariants } from "@/lib/imageVariants";
import { preloadFillImage } from "@/lib/preloadImage";
import { apiSaysNotFound, excerpt, fetchApi } from "@/lib/site";

interface PublicProduct {
  id: number;
  name: string;
  sku: string | null;
  image: string | null;
  image_variants?: ImageVariants | null;
  images?: { url: string; is_primary: boolean; variants?: ImageVariants | null }[];
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

// Rendered on first request, then served from the cache and refreshed every 5 minutes (ISR) instead of
// being rendered on every request. The HTML holds no per-user content: prices and auth load in the browser.
export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

// A missing/disabled product answers with a real 404 status (not a "soft 404" page with status 200).
export default async function ProductLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9]+$/.test(id) || (await apiSaysNotFound(`/products/${id}`))) notFound();
  // Start the main gallery image (the LCP) with the HTML instead of after the client fetches the product.
  const product = await fetchApi<PublicProduct>(`/products/${id}`);
  const images = product?.images ?? (product?.image ? [{ url: product.image, is_primary: true, variants: product.image_variants }] : []);
  const main = images.find((image) => image.is_primary) ?? images[0];
  // Same source and sizes as the gallery's main <Image> (page.tsx), so the preload is the request it uses.
  const mainSrc = main ? imageVariant(main.url, main.variants, 1024) : null;
  if (mainSrc) preloadFillImage(mainSrc, "(max-width: 767px) 100vw, 50vw");
  return children;
}
