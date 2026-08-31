"use client";

import { Suspense } from "react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";

function SaleInner() {
  return (
    <div>
      {/* Promo banner */}
      <div className="bg-[#B83434] text-white px-8 py-3 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase font-medium">
          Sale · Ends soon
        </span>
        <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-white/70">
          Wholesale discounts on selected lines
        </span>
      </div>

      <BrowseLayout
        crumbs={[{ label: "Sale" }]}
        title="Sale & clearance"
        saleOnly
        showDiscountPct
      />
    </div>
  );
}

export default function SalePage() {
  return (
    <Suspense>
      <SaleInner />
    </Suspense>
  );
}
