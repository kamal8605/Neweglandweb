"use client";

import { useState, Fragment, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight } from "lucide-react";
import { StockDot } from "./StockDot";
import { QtyStepper } from "./QtyStepper";
import { PriceGate } from "./PriceGate";
import { type Product } from "@/hooks/useProducts";

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
          "repeating-linear-gradient(135deg, #E5DFD0 0 7px, #D9D3C5 7px 14px)",
        flexShrink: 0,
      }}
    />
  );
}

function SkeletonRow({ showBrand }: { showBrand: boolean }) {
  return (
    <tr className="border-b border-brand-line">
      {[...Array(showBrand ? 8 : 7)].map((_, i) => (
        <td key={i} className="px-2.5 py-2">
          <div className="h-4 bg-brand-bg-alt rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

const TH = "px-2.5 py-2.5 text-left font-mono text-[10px] tracking-[0.08em] uppercase text-brand-muted font-medium border-b border-brand-line bg-brand-bg-alt whitespace-nowrap";
const TD = "px-2.5 py-2 text-[12.5px] text-brand-ink border-b border-brand-line align-middle";

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
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function renderPriceCell(p: Product) {
    return (
      <PriceGate pricesVisible={p.prices_visible}>
        {p.on_sale && p.sale_price !== null ? (
          <span className="flex flex-col leading-snug font-mono">
            <span className="text-[#B83434] font-semibold">${p.sale_price.toFixed(2)}</span>
            <span className="text-brand-muted line-through text-[11px]">${p.regular_price?.toFixed(2)}</span>
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
    if (!p.prices_visible || !p.on_sale || !p.sale_price || !p.regular_price) return <span className="text-brand-muted">—</span>;
    const pct = Math.round((1 - p.sale_price / p.regular_price) * 100);
    return <span className="font-mono text-[#B83434] font-semibold">{pct}%</span>;
  }

  function renderRow(p: Product, isChild = false): ReactNode {
    const isGrouped = p.type === "grouped" && p.children && p.children.length > 0;
    const isOpen = expanded.has(p.id);

    return (
      <Fragment key={p.id}>
        <tr
          className={`border-b border-brand-line hover:bg-brand-bg transition-colors ${isChild ? "bg-brand-bg/50" : ""}`}
        >
          {/* Expand toggle / indent for children */}
          <td className={`${TD} w-7`}>
            {isGrouped ? (
              <button
                onClick={() => toggleExpand(p.id)}
                className="text-brand-muted hover:text-brand-ink transition-colors"
                aria-label={isOpen ? "Collapse variants" : "Expand variants"}
              >
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : isChild ? (
              <span className="block w-3 h-px bg-brand-line ml-2" />
            ) : null}
          </td>

          {/* Image */}
          <td className={`${TD} w-14`}>
            <div className="w-9 h-9 overflow-hidden rounded-[var(--brand-radius)] shrink-0">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.name}
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
          </td>

          {/* SKU */}
          <td className={`${TD} w-24`}>
            <span className="font-mono text-[11px] text-brand-muted">{p.sku}</span>
          </td>

          {/* Product name */}
          <td className={TD}>
            <div className="flex items-center gap-2">
              <Link
                href={`/product/${p.id}`}
                className="font-medium text-brand-ink hover:text-brand-blue transition-colors"
              >
                {p.name}
              </Link>
              {p.on_sale && (
                <span className="bg-[#B83434] text-white font-mono text-[9px] tracking-[0.06em] px-1.5 py-0.5 leading-none shrink-0">
                  SALE
                </span>
              )}
              {isGrouped && (
                <span className="text-brand-muted font-mono text-[10px]">
                  · {p.children!.length} variants
                </span>
              )}
            </div>
          </td>

          {/* Brand */}
          {showBrand && (
            <td className={`${TD} w-32`}>
              {p.brand?.id ? (
                <Link
                  href={`/brand/${p.brand.id}`}
                  className="text-brand-blue text-[12px] hover:text-brand-blue-deep transition-colors"
                >
                  {p.brand.name}
                </Link>
              ) : (
                <span className="text-brand-muted text-[12px]">{p.brand?.name}</span>
              )}
            </td>
          )}

          {/* Price */}
          <td className={`${TD} w-24 text-right`}>{renderPriceCell(p)}</td>

          {/* Off % — sale page only */}
          {showDiscountPct && (
            <td className={`${TD} w-16 text-right`}>{renderDiscountPct(p)}</td>
          )}

          {/* Stock */}
          <td className={`${TD} w-28`}>
            <StockDot inStock={p.in_stock} stockQuantity={p.stock_quantity} />
          </td>

          {/* Qty stepper */}
          <td className={`${TD} w-28 text-right`}>
            {isGrouped ? (
              <span className="text-brand-muted font-mono text-[11px]">— expand —</span>
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-brand-white text-sm">
        <thead>
          <tr>
            <th className={`${TH} w-7`} />
            <th className={`${TH} w-14`}>Img</th>
            <th className={`${TH} w-24`}>SKU</th>
            <th className={TH}>Product</th>
            {showBrand && <th className={`${TH} w-32`}>Brand</th>}
            <th className={`${TH} w-24 text-right`}>Price</th>
            {showDiscountPct && <th className={`${TH} w-16 text-right`}>Off</th>}
            <th className={`${TH} w-28`}>Stock</th>
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
                className="px-4 py-12 text-center font-mono text-[11px] text-brand-muted tracking-[0.06em] uppercase"
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
