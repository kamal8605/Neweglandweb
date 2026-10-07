"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/components/auth/withAuth";

// ─── Step Indicator ────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Cart", "Checkout", "Confirmation"];
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : done
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {done ? "✓" : n}
              </span>
              <span
                className={`text-[10.5px] font-medium tracking-[0.06em] uppercase ${
                  active ? "text-foreground" : "sr-only text-muted-foreground sm:not-sr-only"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-border text-[12px] select-none">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Image Placeholder ────────────────────────────────────────────────────

function ImagePlaceholder({ size = 48 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "repeating-linear-gradient(135deg, var(--muted) 0 7px, var(--border) 7px 14px)",
        flexShrink: 0,
      }}
    />
  );
}

// ─── Qty Stepper ──────────────────────────────────────────────────────────

function QtyStepper({
  value,
  onChange,
  max,
  canIncrease = true,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
  canIncrease?: boolean;
}) {
  const atMax = !canIncrease || (max !== undefined && value >= max);
  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-input bg-background shadow-xs">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        aria-label="Decrease quantity"
        className="w-7 h-7 flex items-center justify-center text-[14px] text-foreground hover:bg-muted transition-colors"
      >
        −
      </button>
      <span className="w-9 text-center text-[12px] text-foreground border-x border-border h-7 flex items-center justify-center">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        disabled={atMax}
        aria-label="Increase quantity"
        title={atMax && canIncrease ? "Maximum available quantity" : undefined}
        className="w-7 h-7 flex items-center justify-center text-[14px] text-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

// ─── Cart Page ────────────────────────────────────────────────────────────

export default function CartPage() {
  const { isLoading } = useRequireAuth();
  const { isApproved } = useAuth();
  const { items, itemCount, subtotal, updateQty, removeItem, isLoaded, notices, dismissNotices } = useCart();
  const unavailableCount = items.filter((i) => i.in_stock === false).length;

  // Only the first load shows a loader; later background syncs update the cart in place (no flicker).
  if (isLoading || !isLoaded) {
    return (
      <div className="flex items-center justify-center h-60 text-[11px] font-medium text-muted-foreground tracking-widest uppercase">
        Loading cart…
      </div>
    );
  }

  // Group items: if parent_id is set, group under the parent; otherwise standalone
  type Group = {
    parentId: number | null | undefined;
    parentName: string | null | undefined;
    items: typeof items;
  };

  const groupMap = new Map<string, Group>();

  items.forEach((item) => {
    const key = item.parent_id ? String(item.parent_id) : `simple-${item.product_id}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        parentId: item.parent_id ?? item.product_id,
        parentName: item.parent_name ?? item.name,
        items: [],
      });
    }
    groupMap.get(key)!.items.push(item);
  });

  const groups = Array.from(groupMap.values());

  const totalVariants = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalProducts = groups.length;

  const TD = "px-2 sm:px-3 py-2.5 text-[12.5px] text-foreground border-b border-border align-middle";
  const TH = "px-2 sm:px-3 py-2 text-[10px] font-medium tracking-[0.08em] uppercase text-muted-foreground border-b border-border text-left bg-muted/60";

  return (
    <div className="min-h-screen bg-muted/30 pb-28 md:pb-20">
      {/* Page header */}
      <div className="border-b border-border bg-card px-4 py-5 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[26px] sm:text-[32px] lg:text-[36px] font-semibold text-foreground tracking-tight leading-tight">
              Cart · draft P.O.
            </h1>
            <div className="mt-2 text-[11px] font-medium text-muted-foreground tracking-[0.06em] uppercase">
              {itemCount > 0
                ? `${totalProducts} product${totalProducts !== 1 ? "s" : ""} · ${totalVariants} line${totalVariants !== 1 ? "s" : ""}`
                : "Your cart is empty"}
            </div>
          </div>
          <div className="max-w-full overflow-x-auto"><StepIndicator step={1} /></div>
        </div>
      </div>

      {/* Messages from the server: quantities capped to stock, products removed, failed updates */}
      {notices.length > 0 && (
        <div role="status" className="mx-auto mt-4 max-w-[1400px] px-4 sm:px-8">
          <div className="flex items-start justify-between gap-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 shadow-sm">
            <ul className="space-y-1 text-[11.5px] text-foreground">
              {notices.map((notice) => <li key={notice}>{notice}</li>)}
            </ul>
            <button onClick={dismissNotices} aria-label="Dismiss cart messages" className="shrink-0 rounded-md text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-4">
          <ShoppingCart size={32} className="text-muted-foreground" />
          <p className="text-[12px] text-muted-foreground">No items in your cart yet.</p>
          <Link
            href="/shop"
            className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
          >
            → Browse products
          </Link>
        </div>
      ) : (
        <div className="mx-auto flex max-w-[1400px] flex-col items-stretch gap-6 px-4 py-6 sm:px-8 lg:flex-row lg:items-start">
          {/* Left — Cart groups */}
          <div className="flex-1 min-w-0 space-y-6">
            {groups.map((group) => {
              const groupTotal = group.items.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
              );
              const firstItem = group.items[0];
              const productId = group.parentId ?? firstItem.product_id;
              const productName = group.parentName ?? firstItem.name;

              return (
                <div
                  key={String(productId)}
                  className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
                >
                  {/* Group header */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 border-b border-border">
                    {firstItem.image ? (
                      <div className="w-12 h-12 relative overflow-hidden shrink-0 rounded-md border border-border bg-muted">
                        <Image
                          src={firstItem.image}
                          alt={productName ?? ""}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <ImagePlaceholder size={48} />
                    )}
                    <div className="flex-1 min-w-[140px]">
                      <Link
                        href={`/product/${productId}`}
                        className="font-medium text-[13px] text-foreground hover:text-primary transition-colors block truncate py-1 lg:py-0"
                      >
                        {productName}
                      </Link>
                      <div className="text-[10.5px] text-muted-foreground mt-0.5">
                        {group.items.length} line{group.items.length !== 1 ? "s" : ""}
                        {" · "}
                        <span className="text-foreground">${groupTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/product/${productId}`}
                        className="inline-flex min-h-10 lg:min-h-0 items-center text-[10px] font-medium tracking-[0.06em] uppercase text-primary hover:text-primary/80 transition-colors"
                      >
                        + Add variant
                      </Link>
                      <button
                        onClick={() => group.items.forEach((i) => removeItem(i.product_id))}
                        className="inline-flex min-h-10 lg:min-h-0 items-center text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Remove group
                      </button>
                    </div>
                  </div>

                  {/* Variant rows */}
                  <div className="overflow-x-auto">
                  <table className="w-full sm:min-w-[560px] md:min-w-[640px]">
                    <thead>
                      <tr>
                        <th className={`${TH} hidden md:table-cell`}>SKU</th>
                        <th className={TH}>Variant</th>
                        <th className={`${TH} hidden sm:table-cell text-right`}>Unit price</th>
                        <th className={`${TH} text-right`}>Qty</th>
                        <th className={`${TH} hidden sm:table-cell text-right`}>Line total</th>
                        <th className={`${TH} w-8`} />
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item) => (
                        <tr key={item.product_id} className="hover:bg-muted/40 transition-colors">
                          <td className={`${TD} hidden md:table-cell text-[11px] text-muted-foreground w-28`}>
                            {item.sku}
                          </td>
                          <td className={TD}>
                            <span className={item.in_stock === false ? "text-muted-foreground line-through" : "text-foreground"}>{item.name}</span>
                            {item.in_stock === false && (
                              <span className="ml-2 inline-block rounded-sm bg-destructive px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] text-destructive-foreground">
                                Out of stock
                              </span>
                            )}
                          </td>
                          <td className={`${TD} hidden sm:table-cell text-right`}>
                            ${item.price.toFixed(2)}
                          </td>
                          <td className={`${TD} text-right`}>
                            <QtyStepper
                              value={item.quantity}
                              max={item.max_quantity}
                              canIncrease={item.in_stock !== false}
                              onChange={(n) => updateQty(item.product_id, n)}
                            />
                          </td>
                          <td className={`${TD} hidden sm:table-cell text-right font-semibold`}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className={`${TD} text-center w-8`}>
                            <button
                              onClick={() => removeItem(item.product_id)}
                              className="-m-2 inline-grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors lg:m-0 lg:h-auto lg:w-auto"
                              aria-label="Remove item"
                            >
                              <X size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right — Order summary */}
          <div className="w-full shrink-0 rounded-lg border border-border bg-card shadow-sm lg:w-[300px]">
            <div className="px-5 py-4 border-b border-border">
              <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-foreground">
                Order summary
              </span>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between text-[12.5px]">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[12.5px]">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">TBD</span>
              </div>
              <div className="flex justify-between text-[12.5px]">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-muted-foreground">Net of tax</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-[13.5px]">
                <span className="text-foreground font-semibold">Total</span>
                <span className="text-foreground font-semibold">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="px-5 pb-5">
              {isApproved && unavailableCount > 0 ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-center">
                  <p className="text-[11px] text-destructive">
                    Remove {unavailableCount === 1 ? "the out-of-stock item" : `${unavailableCount} out-of-stock items`} to continue.
                  </p>
                </div>
              ) : isApproved ? (
                <Link
                  href="/checkout"
                  className="block w-full rounded-md bg-primary px-5 py-3 text-center text-[11px] font-medium tracking-[0.08em] uppercase text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                >
                  Continue to checkout →
                </Link>
              ) : (
                <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-center">
                  <p className="text-[11px] text-muted-foreground">
                    Account pending approval
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    You&apos;ll be notified when your account is approved.
                  </p>
                </div>
              )}

              <Link
                href="/shop"
                className="block mt-3 py-2 lg:py-0 text-center text-[10.5px] font-medium tracking-[0.06em] uppercase text-primary hover:text-primary/80 transition-colors"
              >
                ← Continue shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
