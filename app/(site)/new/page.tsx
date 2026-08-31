"use client";

import { Suspense } from "react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { useCategories } from "@/hooks/useCategories";

function NewArrivalsInner() {
  const { data: categories } = useCategories();

  return (
    <BrowseLayout
      crumbs={[{ label: "New Arrivals" }]}
      title="New arrivals · this month"
      defaultSort="newest"
      subCategories={categories ?? []}
    />
  );
}

export default function NewArrivalsPage() {
  return (
    <Suspense>
      <NewArrivalsInner />
    </Suspense>
  );
}
