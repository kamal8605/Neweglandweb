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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-brand-white">
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-brand-line">
                {Array.from({ length: 5 }).map((__, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-brand-bg-alt rounded animate-pulse" />
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
      <div className="flex flex-col items-center justify-center h-52 gap-4">
        <Heart size={32} className="text-brand-muted" />
        <p className="font-mono text-[12px] text-brand-muted">Your wishlist is empty.</p>
        <Link
          href="/shop"
          className="font-mono text-[11px] text-brand-blue hover:text-brand-blue-deep transition-colors"
        >
          → Browse products to save items
        </Link>
      </div>
    );
  }

  const TH = "px-4 py-2.5 font-mono text-[10px] tracking-[0.08em] uppercase text-brand-muted border-b border-brand-ink text-left bg-brand-bg-alt";
  const TD = "px-4 py-3 text-[12.5px] text-brand-ink border-b border-brand-line align-middle";

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-brand-white">
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
            <tr key={item.id} className="hover:bg-brand-bg transition-colors">
              {/* Image */}
              <td className={TD}>
                <div className="w-10 h-10 relative overflow-hidden border border-brand-line bg-brand-bg-alt shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background:
                          "repeating-linear-gradient(135deg, #E5DFD0 0 5px, #D9D3C5 5px 10px)",
                      }}
                    />
                  )}
                </div>
              </td>

              {/* Name */}
              <td className={TD}>
                <Link
                  href={`/product/${item.product_id}`}
                  className="font-medium text-brand-ink hover:text-brand-blue transition-colors"
                >
                  {item.name}
                </Link>
              </td>

              {/* SKU */}
              <td className={`${TD} font-mono text-[11.5px] text-brand-muted`}>
                {item.sku}
              </td>

              {/* Stock */}
              <td className={TD}>
                <StockDot inStock={item.in_stock} stockQuantity={item.stock_quantity} />
              </td>

              {/* Added date */}
              <td className={`${TD} font-mono text-[11.5px] text-brand-muted`}>
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
                  className="font-mono text-[10.5px] tracking-[0.06em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors"
                >
                  See price →
                </Link>
              </td>

              {/* Remove */}
              <td className={`${TD} text-center`}>
                <button
                  onClick={() => toggle(item.product_id)}
                  className="text-brand-muted hover:text-[#B83434] transition-colors"
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
    <div className="bg-brand-bg min-h-screen pb-20">
      <PageHeader
        crumbs={[{ label: "Wishlist" }]}
        title="Wishlist"
      />
      <div className="px-8 py-6 max-w-5xl mx-auto">
        <Suspense>
          <WishlistTable />
        </Suspense>
      </div>
    </div>
  );
}
