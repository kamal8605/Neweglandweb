"use client";

import { use, Suspense } from "react";
import Link from "next/link";
import { useOrder, type OrderStatus } from "@/hooks/useOrders";
import { useRequireApproved } from "@/components/auth/withAuth";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_STEPS: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  processing: "bg-primary/10 text-primary",
  shipped: "bg-orange-100 text-orange-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-destructive/10 text-destructive",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block text-[10px] tracking-[0.06em] uppercase px-2 py-0.5 rounded-md ${STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}

function StatusTracker({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-[11px] text-destructive">
        <span className="w-2 h-2 rounded-full bg-destructive" />
        Order cancelled
      </div>
    );
  }

  const activeIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0 overflow-x-auto max-w-full">
      {STATUS_STEPS.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1 px-4">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  done
                    ? "bg-primary/15 text-primary"
                    : active
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`text-[9.5px] tracking-[0.06em] uppercase ${
                  active ? "text-foreground" : done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <span
                className={`w-8 h-px ${
                  i < activeIndex ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AddressBlock({ label, fields }: { label: string; fields: (string | null | undefined)[] }) {
  const lines = fields.filter(Boolean) as string[];
  if (lines.length === 0) return null;

  return (
    <div>
      <div className="text-[10px] tracking-[0.08em] uppercase text-muted-foreground mb-1.5">
        {label}
      </div>
      <div className="text-[12.5px] text-foreground leading-relaxed">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

function OrderDetail({ id }: { id: string }) {
  useRequireApproved();
  const { data: order, isLoading, isError } = useOrder(id);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-8">
        <div className="h-6 bg-muted rounded-md w-1/4" />
        <div className="h-4 bg-muted rounded-md w-1/3" />
        <div className="h-32 bg-muted rounded-md" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-4">
        <p className="text-[12px] text-muted-foreground">Order not found.</p>
        <Link href="/orders" className="inline-flex min-h-6 items-center text-[11px] text-primary hover:text-primary/80">
          ← Back to orders
        </Link>
      </div>
    );
  }

  const TH = "px-4 py-2.5 text-[10px] tracking-[0.08em] uppercase text-muted-foreground border-b border-border text-left bg-muted";
  const TD = "px-4 py-3 text-[12.5px] text-foreground border-b border-border align-middle";

  return (
    <div className="bg-background min-h-screen pb-28 md:pb-20">
      {/* Breadcrumb */}
      <div className="px-4 md:px-8 py-3.5 border-b border-border bg-card">
        <Breadcrumb
          items={[
            { label: "Orders", href: "/orders" },
            { label: order.invoice_no },
          ]}
        />
      </div>

      {/* Order header */}
      <div className="px-4 md:px-8 py-6 border-b border-border bg-card flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-[28px] md:text-[36px] font-normal text-foreground leading-none">
            {order.invoice_no}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-[11px] text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <StatusTracker status={order.status} />
      </div>

      <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto space-y-6">
        {/* Addresses */}
        <div className="bg-card border border-border p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AddressBlock
            label="Billing address"
            fields={[
              order.billing?.name,
              order.billing?.company,
              order.billing?.address_1,
              order.billing?.address_2,
              [order.billing?.city, order.billing?.state, order.billing?.postcode].filter(Boolean).join(", "),
              order.billing?.country,
            ]}
          />
          <AddressBlock
            label="Shipping address"
            fields={[
              order.shipping?.name,
              order.shipping?.company,
              order.shipping?.address_1,
              order.shipping?.address_2,
              [order.shipping?.city, order.shipping?.state, order.shipping?.postcode].filter(Boolean).join(", "),
              order.shipping?.country,
            ]}
          />
        </div>

        {/* Line items */}
        <div className="bg-card border border-border">
          <div className="px-5 py-3 border-b border-border">
            <span className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground">
              Line items
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className={TH}>Product</th>
                <th className={`${TH} text-right w-16`}>Qty</th>
                <th className={`${TH} text-right w-24`}>Unit price</th>
                <th className={`${TH} text-right w-24`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.items ?? []).map((line) => (
                <tr key={line.id} className="hover:bg-muted/30 transition-colors">
                  <td className={TD}>
                    <div className="text-foreground">{line.name}</div>
                    <div className="font-mono text-[10.5px] text-muted-foreground">{line.sku}</div>
                  </td>
                  <td className={`${TD} text-right `}>{line.quantity}</td>
                  <td className={`${TD} text-right `}>${line.unit_price.toFixed(2)}</td>
                  <td className={`${TD} text-right font-semibold`}>
                    ${line.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="px-5 py-4 border-t border-border space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-[12.5px]">
              <span className="text-muted-foreground">Line total</span>
              <span className="text-foreground">${order.line_total.toFixed(2)}</span>
            </div>
            {order.shipping_total != null && (
              <div className="flex justify-between text-[12.5px]">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">${order.shipping_total.toFixed(2)}</span>
              </div>
            )}
            {order.total_tax != null && (
              <div className="flex justify-between text-[12.5px]">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">${order.total_tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[13.5px] border-t border-border pt-2">
              <span className="text-foreground font-semibold">Total</span>
              <span className="text-foreground font-semibold">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer note */}
        {order.customer_note && (
          <div className="bg-card border border-border p-5">
            <div className="text-[10px] tracking-[0.08em] uppercase text-muted-foreground mb-2">
              Order note
            </div>
            <p className="text-[13px] text-foreground leading-relaxed italic">
              {order.customer_note}
            </p>
          </div>
        )}

        <Link
          href="/orders"
          className="inline-flex min-h-6 items-center text-[11px] tracking-[0.06em] uppercase text-primary hover:text-primary/80 transition-colors"
        >
          ← Back to orders
        </Link>
      </div>
    </div>
  );
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  return (
    <Suspense>
      <OrderDetail id={id} />
    </Suspense>
  );
}
