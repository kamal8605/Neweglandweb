"use client";

import { useState, Fragment, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight } from "lucide-react";
import { StockDot } from "./StockDot";
import { QtyStepper } from "./QtyStepper";
import { PriceGate } from "./PriceGate";
import { type Product } from "@/hooks/useProducts";
import { imageVariant } from "@/lib/imageVariants";

export type { Product };

interface ProductTableProps {
  products: Product[];
  showBrand?: boolean;
  /** Show extra "Off %" column — used on sale page */
  showDiscountPct?: boolean;
  loading?: boolean;
  /** Called when quantities change; receives map of product_id → qty */
  onQtyChange?: (qtyMap: Record<number, number>) => void;
}

function ImagePlaceholder({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background:
          "repeating-linear-gradient(135deg, var(--muted) 0 7px, var(--border) 7px 14px)",
        flexShrink: 0,
      }}
    />
  );
}

function SkeletonRow({ showBrand }: { showBrand: boolean }) {
  return (
    <tr className="border-b border-border">
      {[...Array(showBrand ? 8 : 7)].map((_, i) => (
        <td key={i} className="px-2.5 py-2">
          <div className="h-4 animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  );
}

const TH = "whitespace-nowrap border-b border-border bg-muted/60 px-1.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:px-2.5";
const TD = "border-b border-border px-1.5 py-2 align-middle text-[12.5px] text-foreground sm:px-2.5";

export function ProductTable({
  products,
  showBrand = true,
  showDiscountPct = false,
  loading = false,
  onQtyChange,
}: ProductTableProps) {
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function setQty(productId: number, qty: number) {
    const next = { ...qtyMap, [productId]: qty };
    setQtyMap(next);
    onQtyChange?.(next);
  }

  function toggleExpand(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderPriceCell(p: Product) {
    return (
      <PriceGate pricesVisible={p.prices_visible}>
        {p.on_sale && p.sale_price !== null ? (
          <span className="flex flex-col leading-snug font-mono">
            <span className="font-semibold text-destructive">${p.sale_price.toFixed(2)}</span>
            <span className="text-[11px] text-muted-foreground line-through">${p.regular_price?.toFixed(2)}</span>
          </span>
        ) : (
          <span className="font-mono font-semibold">
            {p.current_price !== null ? `$${p.current_price.toFixed(2)}` : "—"}
          </span>
        )}
      </PriceGate>
    );
  }

  function renderDiscountPct(p: Product) {
    if (!p.prices_visible || !p.on_sale || !p.sale_price || !p.regular_price) return <span className="text-muted-foreground">—</span>;
    const pct = Math.round((1 - p.sale_price / p.regular_price) * 100);
    return <span className="font-mono font-semibold text-destructive">{pct}%</span>;
  }

  function renderRow(p: Product, isChild = false): ReactNode {
    const isGrouped = p.type === "grouped" && p.children && p.children.length > 0;
    const isOpen = expanded.has(p.id);

    return (
      <Fragment key={p.id}>
        <tr
          className={`border-b border-border transition-colors hover:bg-muted/40 ${isChild ? "bg-muted/25" : ""}`}
        >
          {/* Expand toggle / indent for children */}
          <td className={`${TD} w-5 sm:w-7`}>
            {isGrouped ? (
              <button
                onClick={() => toggleExpand(p.id)}
                className="rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label={isOpen ? "Collapse variants" : "Expand variants"}
              >
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : isChild ? (
              <span className="ml-2 block h-px w-3 bg-border" />
            ) : null}
          </td>

          {/* Image */}
          <td className={`${TD} w-14 hidden sm:table-cell`}>
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              {p.image ? (
                <Image
                  src={imageVariant(p.image, p.image_variants, 64)!}
                  alt={p.name}
                  width={36}
                  height={36}
                  sizes="36px"
                  className="object-cover w-full h-full"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
          </td>

          {/* SKU */}
          <td className={`${TD} w-24 hidden md:table-cell`}>
            <span className="font-mono text-[11px] text-muted-foreground">{p.sku}</span>
          </td>

          {/* Product name */}
          <td className={TD}>
            <div className="flex items-center gap-2">
              <Link
                href={`/product/${p.id}`}
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                {p.name}
              </Link>
              {p.on_sale && (
                <span className="shrink-0 rounded-sm bg-destructive px-1.5 py-0.5 font-mono text-[9px] leading-none tracking-[0.06em] text-destructive-foreground">
                  SALE
                </span>
              )}
              {isGrouped && (
                <span className="font-mono text-[10px] text-muted-foreground">
                  · {p.children!.length} variants
                </span>
              )}
            </div>
          </td>

          {/* Brand */}
          {showBrand && (
            <td className={`${TD} w-32 hidden lg:table-cell`}>
              {p.brand?.id ? (
                <Link
                  href={`/brand/${p.brand.id}`}
                  className="text-[12px] text-primary transition-colors hover:text-primary/80"
                >
                  {p.brand.name}
                </Link>
              ) : (
                <span className="text-[12px] text-muted-foreground">{p.brand?.name}</span>
              )}
            </td>
          )}

          {/* Price */}
          <td className={`${TD} w-20 sm:w-24 text-right`}>{renderPriceCell(p)}</td>

          {/* Off % — sale page only */}
          {showDiscountPct && (
            <td className={`${TD} w-16 text-right`}>{renderDiscountPct(p)}</td>
          )}

          {/* Stock */}
          <td className={`${TD} w-28 hidden sm:table-cell`}>
            <StockDot inStock={p.in_stock} stockQuantity={p.stock_quantity} />
          </td>

          {/* Qty stepper */}
          <td className={`${TD} w-24 sm:w-28 text-right whitespace-nowrap`}>
            {isGrouped ? (
              <span className="font-mono text-[11px] text-muted-foreground">— expand —</span>
            ) : (
              <QtyStepper
                value={qtyMap[p.id] ?? 0}
                onChange={(n) => setQty(p.id, n)}
                disabled={!p.in_stock}
              />
            )}
          </td>
        </tr>

        {/* Expanded children rows */}
        {isGrouped && isOpen && p.children!.map((child) => renderRow(child, true))}
      </Fragment>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="w-full border-collapse bg-card text-sm">
        <thead>
          <tr>
            <th className={`${TH} w-5 sm:w-7`} />
            <th className={`${TH} w-14 hidden sm:table-cell`}>Img</th>
            <th className={`${TH} w-24 hidden md:table-cell`}>SKU</th>
            <th className={TH}>Product</th>
            {showBrand && <th className={`${TH} w-32 hidden lg:table-cell`}>Brand</th>}
            <th className={`${TH} w-24 text-right`}>Price</th>
            {showDiscountPct && <th className={`${TH} w-16 text-right`}>Off</th>}
            <th className={`${TH} w-28 hidden sm:table-cell`}>Stock</th>
            <th className={`${TH} w-28 text-right`}>Qty</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} showBrand={showBrand} />
            ))
          ) : products.length === 0 ? (
            <tr>
              <td
                colSpan={showBrand ? 9 : 8}
                className="px-4 py-12 text-center text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground"
              >
                No products found
              </td>
            </tr>
          ) : (
            products.map((p) => renderRow(p))
          )}
        </tbody>
      </table>
    </div>
  );
}
