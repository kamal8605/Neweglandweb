import { Suspense } from "react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";

export const metadata = { title: "Shop — Forge & Co." };

export default function ShopPage() {
  return (
    <Suspense>
      <BrowseLayout
        crumbs={[{ label: "Shop" }]}
        title="All Products"
      />
    </Suspense>
  );
}
