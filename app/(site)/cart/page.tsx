"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/components/auth/withAuth";
import { StockDot } from "@/components/shared/StockDot";

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
            <div className="flex items-center gap-2 px-4 py-2.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 ${
                  active
                    ? "bg-brand-orange text-white"
                    : done
                    ? "bg-brand-navy text-white"
                    : "bg-brand-bg-alt text-brand-muted border border-brand-line"
                }`}
              >
                {done ? "✓" : n}
              </span>
              <span
                className={`font-mono text-[10.5px] tracking-[0.06em] uppercase ${
                  active ? "text-brand-ink" : "text-brand-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-brand-line font-mono text-[12px] select-none">→</span>
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
        background: "repeating-linear-gradient(135deg, #E5DFD0 0 7px, #D9D3C5 7px 14px)",
        flexShrink: 0,
      }}
    />
  );
}

// ─── Qty Stepper ──────────────────────────────────────────────────────────

function QtyStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="inline-flex items-center border border-brand-line">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-7 h-7 flex items-center justify-center font-mono text-[14px] text-brand-ink hover:bg-brand-bg-alt transition-colors"
      >
        −
      </button>
      <span className="w-9 text-center font-mono text-[12px] text-brand-ink border-x border-brand-line h-7 flex items-center justify-center">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 flex items-center justify-center font-mono text-[14px] text-brand-ink hover:bg-brand-bg-alt transition-colors"
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
  const { items, itemCount, subtotal, updateQty, removeItem } = useCart();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60 font-mono text-[11px] text-brand-muted tracking-widest uppercase">
        Loading…
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

  const TD = "px-3 py-2.5 text-[12.5px] text-brand-ink border-b border-brand-line align-middle";
  const TH = "px-3 py-2 font-mono text-[10px] tracking-[0.08em] uppercase text-brand-muted border-b border-brand-ink text-left bg-brand-bg-alt";

  return (
    <div className="bg-brand-bg min-h-screen pb-20">
      {/* Page header */}
      <div className="px-8 py-5 border-b border-brand-line bg-brand-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-[36px] font-normal text-brand-ink leading-none">
              Cart · draft P.O.
            </h1>
            <div className="mt-2 font-mono text-[11px] text-brand-muted tracking-[0.06em] uppercase">
              {itemCount > 0
                ? `${totalProducts} product${totalProducts !== 1 ? "s" : ""} · ${totalVariants} line${totalVariants !== 1 ? "s" : ""}`
                : "Your cart is empty"}
            </div>
          </div>
          <StepIndicator step={1} />
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-4">
          <ShoppingCart size={32} className="text-brand-muted" />
          <p className="font-mono text-[12px] text-brand-muted">No items in your cart yet.</p>
          <Link
            href="/shop"
            className="font-mono text-[11px] text-brand-blue hover:text-brand-blue-deep transition-colors"
          >
            → Browse products
          </Link>
        </div>
      ) : (
        <div className="px-8 py-6 flex gap-6 max-w-[1400px] mx-auto items-start">
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
                  className="bg-brand-white border border-brand-line"
                >
                  {/* Group header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-line">
                    {firstItem.image ? (
                      <div className="w-12 h-12 relative overflow-hidden shrink-0 border border-brand-line">
                        <Image
                          src={firstItem.image}
                          alt={productName ?? ""}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <ImagePlaceholder size={48} />
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${productId}`}
                        className="font-medium text-[13px] text-brand-ink hover:text-brand-blue transition-colors block truncate"
                      >
                        {productName}
                      </Link>
                      <div className="font-mono text-[10.5px] text-brand-muted mt-0.5">
                        {group.items.length} line{group.items.length !== 1 ? "s" : ""}
                        {" · "}
                        <span className="text-brand-ink">${groupTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/product/${productId}`}
                        className="font-mono text-[10px] tracking-[0.06em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors"
                      >
                        + Add variant
                      </Link>
                      <button
                        onClick={() => group.items.forEach((i) => removeItem(i.product_id))}
                        className="font-mono text-[10px] tracking-[0.06em] uppercase text-brand-muted hover:text-[#B83434] transition-colors"
                      >
                        Remove group
                      </button>
                    </div>
                  </div>

                  {/* Variant rows */}
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className={TH}>SKU</th>
                        <th className={TH}>Variant</th>
                        <th className={`${TH} text-right`}>Unit price</th>
                        <th className={`${TH} text-right`}>Qty</th>
                        <th className={`${TH} text-right`}>Line total</th>
                        <th className={`${TH} w-8`} />
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item) => (
                        <tr key={item.product_id} className="hover:bg-brand-bg/50 transition-colors">
                          <td className={`${TD} font-mono text-[11px] text-brand-muted w-28`}>
                            {item.sku}
                          </td>
                          <td className={TD}>
                            <span className="text-brand-ink">{item.name}</span>
                          </td>
                          <td className={`${TD} text-right font-mono`}>
                            ${item.price.toFixed(2)}
                          </td>
                          <td className={`${TD} text-right`}>
                            <QtyStepper
                              value={item.quantity}
                              onChange={(n) => updateQty(item.product_id, n)}
                            />
                          </td>
                          <td className={`${TD} text-right font-mono font-semibold`}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className={`${TD} text-center w-8`}>
                            <button
                              onClick={() => removeItem(item.product_id)}
                              className="text-brand-muted hover:text-[#B83434] transition-colors"
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
              );
            })}
          </div>

          {/* Right — Order summary */}
          <div className="w-[300px] shrink-0 bg-brand-white border border-brand-line">
            <div className="px-5 py-4 border-b border-brand-ink">
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-brand-muted">
                Order summary
              </span>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between font-mono text-[12.5px]">
                <span className="text-brand-muted">Subtotal</span>
                <span className="text-brand-ink font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-mono text-[12.5px]">
                <span className="text-brand-muted">Shipping</span>
                <span className="text-brand-muted">TBD</span>
              </div>
              <div className="flex justify-between font-mono text-[12.5px]">
                <span className="text-brand-muted">Tax</span>
                <span className="text-brand-muted">Net of tax</span>
              </div>
              <div className="border-t border-brand-line pt-3 flex justify-between font-mono text-[13.5px]">
                <span className="text-brand-ink font-semibold">Total</span>
                <span className="text-brand-ink font-semibold">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="px-5 pb-5">
              {isApproved ? (
                <Link
                  href="/checkout"
                  className="block w-full bg-brand-navy text-white font-mono text-[11px] tracking-[0.08em] uppercase text-center px-5 py-3 hover:bg-brand-navy/90 transition-colors"
                >
                  Continue to checkout →
                </Link>
              ) : (
                <div className="border border-brand-line px-4 py-3 text-center">
                  <p className="font-mono text-[11px] text-brand-muted">
                    Account pending approval
                  </p>
                  <p className="font-mono text-[10px] text-brand-muted mt-1">
                    You&apos;ll be notified when your account is approved.
                  </p>
                </div>
              )}

              <Link
                href="/shop"
                className="block mt-3 text-center font-mono text-[10.5px] tracking-[0.06em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors"
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
