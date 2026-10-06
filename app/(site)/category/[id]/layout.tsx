import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { apiSaysNotFound, excerpt, fetchApi } from "@/lib/site";

interface PublicCategory {
  id: number;
  name: string;
  description: string | null;
  parent: { name: string } | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const category = /^\d+$/.test(id) ? await fetchApi<PublicCategory>(`/categories/${id}`) : null;
  if (!category) return { title: "Category not found", robots: { index: false } };

  const title = category.parent ? `${category.name} – ${category.parent.name}` : category.name;
  const description = excerpt(category.description) ?? `Shop wholesale ${category.name}${category.parent ? ` in ${category.parent.name}` : ""}.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${category.id}` },
    openGraph: { title, description, url: `/category/${category.id}` },
  };
}

// A missing/disabled category answers with a real 404 status (not a "soft 404" page with status 200).
export default async function CategoryLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9]+$/.test(id) || (await apiSaysNotFound(`/categories/${id}`))) notFound();
  return children;
}
