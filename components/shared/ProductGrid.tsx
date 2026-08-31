"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { StockDot } from "./StockDot";
import { QtyStepper } from "./QtyStepper";
import { PriceGate } from "./PriceGate";
import { type Product } from "@/hooks/useProducts";

interface ProductGridProps {
  products: Product[];
  showBrand?: boolean;
  showDiscountPct?: boolean;
  loading?: boolean;
  onQtyChange?: (qtyMap: Record<number, number>) => void;
}

function SkeletonCard() {
  return (
    <div className="bg-brand-white border border-brand-line flex flex-col animate-pulse">
      <div className="aspect-square bg-brand-bg-alt" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-brand-bg-alt rounded w-1/3" />
        <div className="h-4 bg-brand-bg-alt rounded w-4/5" />
        <div className="h-3 bg-brand-bg-alt rounded w-1/2" />
        <div className="h-7 bg-brand-bg-alt rounded mt-3" />
      </div>
    </div>
  );
}

function ImagePlaceholder() {
  return (
    <div
      className="w-full h-full"
      style={{
        background: "repeating-linear-gradient(135deg, #E5DFD0 0 10px, #D9D3C5 10px 20px)",
      }}
    />
  );
}

export function ProductGrid({
  products,
  showBrand = true,
  showDiscountPct = false,
  loading = false,
  onQtyChange,
}: ProductGridProps) {
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});

  function setQty(productId: number, qty: number) {
    const next = { ...qtyMap, [productId]: qty };
    setQtyMap(next);
    onQtyChange?.(next);
  }

  function renderPrice(p: Product) {
    return (
      <PriceGate pricesVisible={p.prices_visible}>
        {p.on_sale && p.sale_price !== null ? (
          <span className="flex items-baseline gap-1.5 font-mono">
            <span className="text-[#B83434] font-semibold text-[13px]">
              ${p.sale_price.toFixed(2)}
            </span>
            <span className="text-brand-muted line-through text-[11px]">
              ${p.regular_price?.toFixed(2)}
            </span>
            {showDiscountPct && p.regular_price && (
              <span className="text-[#B83434] text-[10.5px] font-mono">
                {Math.round((1 - p.sale_price / p.regular_price) * 100)}% off
              </span>
            )}
          </span>
        ) : (
          <span className="font-mono font-semibold text-[13px] text-brand-ink">
            {p.current_price !== null ? `$${p.current_price.toFixed(2)}` : "—"}
          </span>
        )}
      </PriceGate>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pt-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center font-mono text-[11px] text-brand-muted tracking-[0.06em] uppercase bg-brand-white border border-brand-line mt-3">
        No products found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pt-3">
      {products.map((p) => {
        const isGrouped = p.type === "grouped" && p.children && p.children.length > 0;

        return (
          <div
            key={p.id}
            className="bg-brand-white border border-brand-line flex flex-col hover:border-brand-blue transition-colors"
          >
            {/* Image */}
            <Link href={`/product/${p.id}`} className="block relative aspect-square overflow-hidden bg-brand-bg-alt">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <ImagePlaceholder />
              )}
              {p.on_sale && (
                <span className="absolute top-2 left-2 bg-[#B83434] text-white font-mono text-[9px] tracking-[0.06em] px-1.5 py-0.5 leading-none">
                  SALE
                </span>
              )}
            </Link>

            {/* Body */}
            <div className="p-3 flex flex-col flex-1 gap-1 min-w-0">
              {showBrand && p.brand && (
                <div className="truncate">
                  {p.brand.id ? (
                    <Link
                      href={`/brand/${p.brand.id}`}
                      className="font-mono text-[10px] tracking-[0.05em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors"
                    >
                      {p.brand.name}
                    </Link>
                  ) : (
                    <span className="font-mono text-[10px] tracking-[0.05em] uppercase text-brand-muted">
                      {p.brand.name}
                    </span>
                  )}
                </div>
              )}

              <Link
                href={`/product/${p.id}`}
                className="text-[12.5px] font-medium text-brand-ink hover:text-brand-blue transition-colors leading-snug line-clamp-2"
              >
                {p.name}
              </Link>

              <span className="font-mono text-[10.5px] text-brand-muted">{p.sku}</span>

              <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                {renderPrice(p)}
                <StockDot inStock={p.in_stock} stockQuantity={p.stock_quantity} />
              </div>

              <div className="pt-1">
                {isGrouped ? (
                  <Link
                    href={`/product/${p.id}`}
                    className="block w-full text-center font-mono text-[10.5px] tracking-[0.06em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors py-1.5 border border-brand-line hover:border-brand-blue"
                  >
                    {p.children!.length} variants →
                  </Link>
                ) : (
                  <QtyStepper
                    value={qtyMap[p.id] ?? 0}
                    onChange={(n) => setQty(p.id, n)}
                    disabled={!p.in_stock}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
