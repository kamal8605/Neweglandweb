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
  pending: "bg-[#E5DFD0] text-[#6B6045]",
  processing: "bg-[#DBEAFE] text-[#1D4ED8]",
  shipped: "bg-[#FEE9D6] text-brand-orange",
  delivered: "bg-[#D1FAE5] text-[#065F46]",
  cancelled: "bg-[#FEE2E2] text-[#B83434]",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block font-mono text-[10px] tracking-[0.06em] uppercase px-2 py-0.5 rounded-[var(--brand-radius)] ${STATUS_STYLES[status] ?? "bg-brand-bg-alt text-brand-muted"}`}
    >
      {status}
    </span>
  );
}

function StatusTracker({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 font-mono text-[11px] text-[#B83434]">
        <span className="w-2 h-2 rounded-full bg-[#B83434]" />
        Order cancelled
      </div>
    );
  }

  const activeIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1 px-4">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 ${
                  done
                    ? "bg-brand-navy text-white"
                    : active
                    ? "bg-brand-orange text-white"
                    : "bg-brand-bg-alt text-brand-muted border border-brand-line"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`font-mono text-[9.5px] tracking-[0.06em] uppercase ${
                  active ? "text-brand-ink" : done ? "text-brand-ink" : "text-brand-muted"
                }`}
              >
                {step}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <span
                className={`w-8 h-px ${
                  i < activeIndex ? "bg-brand-navy" : "bg-brand-line"
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
      <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-brand-muted mb-1.5">
        {label}
      </div>
      <div className="text-[12.5px] text-brand-ink leading-relaxed">
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
        <div className="h-6 bg-brand-bg-alt rounded w-1/4" />
        <div className="h-4 bg-brand-bg-alt rounded w-1/3" />
        <div className="h-32 bg-brand-bg-alt rounded" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-4">
        <p className="font-mono text-[12px] text-brand-muted">Order not found.</p>
        <Link href="/orders" className="font-mono text-[11px] text-brand-blue hover:text-brand-blue-deep">
          ← Back to orders
        </Link>
      </div>
    );
  }

  const TH = "px-4 py-2.5 font-mono text-[10px] tracking-[0.08em] uppercase text-brand-muted border-b border-brand-ink text-left bg-brand-bg-alt";
  const TD = "px-4 py-3 text-[12.5px] text-brand-ink border-b border-brand-line align-middle";

  return (
    <div className="bg-brand-bg min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="px-8 py-3.5 border-b border-brand-line bg-brand-white">
        <Breadcrumb
          items={[
            { label: "Orders", href: "/orders" },
            { label: order.invoice_no },
          ]}
        />
      </div>

      {/* Order header */}
      <div className="px-8 py-6 border-b border-brand-line bg-brand-white flex items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-[36px] font-normal text-brand-ink leading-none">
            {order.invoice_no}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="font-mono text-[11px] text-brand-muted">
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

      <div className="px-8 py-6 max-w-5xl mx-auto space-y-6">
        {/* Addresses */}
        <div className="bg-brand-white border border-brand-line p-6 grid grid-cols-2 gap-6">
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
        <div className="bg-brand-white border border-brand-line">
          <div className="px-5 py-3 border-b border-brand-ink">
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-brand-muted">
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
                <tr key={line.id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className={TD}>
                    <div className="text-brand-ink">{line.name}</div>
                    <div className="font-mono text-[10.5px] text-brand-muted">{line.sku}</div>
                  </td>
                  <td className={`${TD} text-right font-mono`}>{line.quantity}</td>
                  <td className={`${TD} text-right font-mono`}>${line.unit_price.toFixed(2)}</td>
                  <td className={`${TD} text-right font-mono font-semibold`}>
                    ${line.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="px-5 py-4 border-t border-brand-ink space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between font-mono text-[12.5px]">
              <span className="text-brand-muted">Line total</span>
              <span className="text-brand-ink">${order.line_total.toFixed(2)}</span>
            </div>
            {order.shipping_total != null && (
              <div className="flex justify-between font-mono text-[12.5px]">
                <span className="text-brand-muted">Shipping</span>
                <span className="text-brand-ink">${order.shipping_total.toFixed(2)}</span>
              </div>
            )}
            {order.total_tax != null && (
              <div className="flex justify-between font-mono text-[12.5px]">
                <span className="text-brand-muted">Tax</span>
                <span className="text-brand-ink">${order.total_tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-mono text-[13.5px] border-t border-brand-ink pt-2">
              <span className="text-brand-ink font-semibold">Total</span>
              <span className="text-brand-ink font-semibold">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer note */}
        {order.customer_note && (
          <div className="bg-brand-white border border-brand-line p-5">
            <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-brand-muted mb-2">
              Order note
            </div>
            <p className="text-[13px] text-brand-ink leading-relaxed italic">
              {order.customer_note}
            </p>
          </div>
        )}

        <Link
          href="/orders"
          className="inline-block font-mono text-[11px] tracking-[0.06em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors"
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
