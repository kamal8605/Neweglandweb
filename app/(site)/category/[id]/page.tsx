"use client";

import { Suspense } from "react";
import { use } from "react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { useCategory } from "@/hooks/useCategories";

interface Props {
  params: Promise<{ id: string }>;
}

function CategoryBrowse({ id }: { id: string }) {
  const { data: category, isLoading } = useCategory(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 font-mono text-[11px] text-brand-muted tracking-widest uppercase">
        Loading…
      </div>
    );
  }

  return (
    <BrowseLayout
      categoryId={Number(id)}
      categoryName={category?.name}
      subCategories={category?.children ?? []}
      crumbs={[
        { label: "Shop", href: "/shop" },
        { label: category?.name ?? "Category" },
      ]}
      title={category?.name ?? "Category"}
    />
  );
}

export default function CategoryPage({ params }: Props) {
  const { id } = use(params);
  return (
    <Suspense>
      <CategoryBrowse id={id} />
    </Suspense>
  );
}
