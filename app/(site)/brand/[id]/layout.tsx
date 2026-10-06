import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { apiSaysNotFound, excerpt, fetchApi } from "@/lib/site";

interface PublicBrand {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const brand = /^\d+$/.test(id) ? await fetchApi<PublicBrand>(`/brands/${id}`) : null;
  if (!brand) return { title: "Brand not found", robots: { index: false } };

  const description = excerpt(brand.description) ?? `Shop ${brand.name} products wholesale.`;
  return {
    title: brand.name,
    description,
    alternates: { canonical: `/brand/${brand.id}` },
    openGraph: { title: brand.name, description, url: `/brand/${brand.id}`, images: brand.image ? [{ url: brand.image, alt: brand.name }] : undefined },
  };
}

// A missing/disabled brand answers with a real 404 status (not a "soft 404" page with status 200).
export default async function BrandLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9]+$/.test(id) || (await apiSaysNotFound(`/brands/${id}`))) notFound();
  return children;
}
