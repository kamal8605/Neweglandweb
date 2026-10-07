"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, X } from "lucide-react";
import { useRequireAuth } from "@/components/auth/withAuth";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { StockDot } from "@/components/shared/StockDot";
import { PageHeader } from "@/components/shared/PageHeader";

function WishlistTable() {
  const { isLoading: authLoading } = useRequireAuth();
  const { data: items, isLoading } = useWishlist();
  const toggle = useToggleWishlist();

  if (authLoading || isLoading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
        <table className="w-full border-collapse bg-card">
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border">
                {Array.from({ length: 5 }).map((__, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 gap-4 rounded-lg border border-border bg-card shadow-sm">
        <Heart size={32} className="text-muted-foreground" />
        <p className="text-[12px] text-muted-foreground">Your wishlist is empty.</p>
        <Link
          href="/shop"
          className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
        >
          → Browse products to save items
        </Link>
      </div>
    );
  }

  const TH = "px-4 py-2.5 text-[10px] font-medium tracking-[0.08em] uppercase text-muted-foreground border-b border-border text-left bg-muted/60";
  const TD = "px-4 py-3 text-[12.5px] text-foreground border-b border-border align-middle";

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="w-full border-collapse bg-card">
        <thead>
          <tr>
            <th className={`${TH} w-14`} />
            <th className={TH}>Product</th>
            <th className={TH}>SKU</th>
            <th className={TH}>Stock</th>
            <th className={TH}>Added</th>
            <th className={TH}>Price</th>
            <th className={`${TH} w-10`} />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-muted/40 transition-colors">
              {/* Image */}
              <td className={TD}>
                <div className="w-10 h-10 relative overflow-hidden rounded-md border border-border bg-muted shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background:
                          "repeating-linear-gradient(135deg, var(--muted) 0 5px, var(--border) 5px 10px)",
                      }}
                    />
                  )}
                </div>
              </td>

              {/* Name */}
              <td className={TD}>
                <Link
                  href={`/product/${item.product_id}`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              </td>

              {/* SKU */}
              <td className={`${TD} text-[11.5px] text-muted-foreground`}>
                {item.sku}
              </td>

              {/* Stock */}
              <td className={TD}>
                <StockDot inStock={item.in_stock} stockQuantity={item.stock_quantity} />
              </td>

              {/* Added date */}
              <td className={`${TD} text-[11.5px] text-muted-foreground`}>
                {new Date(item.added_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>

              {/* See price */}
              <td className={TD}>
                <Link
                  href={`/product/${item.product_id}`}
                  className="text-[10.5px] font-medium tracking-[0.06em] uppercase text-primary hover:text-primary/80 transition-colors"
                >
                  See price →
                </Link>
              </td>

              {/* Remove */}
              <td className={`${TD} text-center`}>
                <button
                  onClick={() => void toggle(item.product_id).catch(() => undefined)}
                  className="-m-2 inline-grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <X size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-muted/30 pb-28 md:pb-20">
      <PageHeader
        crumbs={[{ label: "Wishlist" }]}
        title="Wishlist"
      />
      <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
        <Suspense>
          <WishlistTable />
        </Suspense>
      </div>
    </div>
  );
}
