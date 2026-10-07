"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { StockDot } from "./StockDot";
import { QtyStepper } from "./QtyStepper";
import { PriceGate } from "./PriceGate";
import { type Product } from "@/hooks/useProducts";
import { imageVariant } from "@/lib/imageVariants";

interface ProductGridProps {
  products: Product[];
  showBrand?: boolean;
  showDiscountPct?: boolean;
  loading?: boolean;
  onQtyChange?: (qtyMap: Record<number, number>) => void;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-4 w-4/5 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="mt-3 h-7 rounded bg-muted" />
      </div>
    </div>
  );
}

function ImagePlaceholder() {
  return (
    <div
      className="w-full h-full"
      style={{
        background: "repeating-linear-gradient(135deg, var(--muted) 0 10px, var(--border) 10px 20px)",
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
            <span className="text-[13px] font-semibold text-destructive">
              ${p.sale_price.toFixed(2)}
            </span>
            <span className="text-[11px] text-muted-foreground line-through">
              ${p.regular_price?.toFixed(2)}
            </span>
            {showDiscountPct && p.regular_price && (
              <span className="font-mono text-[10.5px] text-destructive">
                {Math.round((1 - p.sale_price / p.regular_price) * 100)}% off
              </span>
            )}
          </span>
        ) : (
          <span className="font-mono text-[13px] font-semibold text-foreground">
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
      <div className="mt-3 rounded-lg border border-border bg-card py-16 text-center text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground shadow-sm">
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
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-md"
          >
            {/* Image */}
            <Link href={`/product/${p.id}`} className="relative block aspect-square overflow-hidden bg-muted">
              {p.image ? (
                <Image
                  src={imageVariant(p.image, p.image_variants, 512)!}
                  alt={p.name}
                  fill
                  sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw"
                  className="object-contain"
                />
              ) : (
                <ImagePlaceholder />
              )}
              {p.on_sale && (
                <span className="absolute left-2 top-2 rounded-sm bg-destructive px-1.5 py-0.5 font-mono text-[9px] leading-none tracking-[0.06em] text-destructive-foreground shadow-sm">
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
                      className="font-mono text-[10px] uppercase tracking-[0.05em] text-primary transition-colors hover:text-primary/80"
                    >
                      {p.brand.name}
                    </Link>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-muted-foreground">
                      {p.brand.name}
                    </span>
                  )}
                </div>
              )}

              <Link
                href={`/product/${p.id}`}
                className="line-clamp-2 text-[12.5px] font-medium leading-snug text-foreground transition-colors hover:text-primary"
              >
                {p.name}
              </Link>

              <span className="font-mono text-[10.5px] text-muted-foreground">{p.sku}</span>

              <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                {renderPrice(p)}
                <StockDot inStock={p.in_stock} stockQuantity={p.stock_quantity} />
              </div>

              <div className="pt-1">
                {isGrouped ? (
                  <Link
                    href={`/product/${p.id}`}
                    className="block w-full rounded-md border border-border py-1.5 text-center text-[10.5px] font-medium uppercase tracking-[0.06em] text-primary transition-colors hover:border-primary/50 hover:bg-accent"
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
