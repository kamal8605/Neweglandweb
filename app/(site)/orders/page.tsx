"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRequireApproved } from "@/components/auth/withAuth";
import { useOrders, type OrderStatus, type PaymentStatus } from "@/hooks/useOrders";
import { Pagination } from "@/components/shared/Pagination";
import { PageHeader } from "@/components/shared/PageHeader";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  processing: "bg-primary/10 text-primary",
  shipped: "bg-orange-100 text-orange-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-destructive/10 text-destructive",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  due: "text-muted-foreground",
  paid: "text-emerald-700",
  refunded: "text-primary",
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

function OrdersTable() {
  const { isLoading } = useRequireApproved();
  const [page, setPage] = useState(1);
  const { data, isLoading: ordersLoading } = useOrders(page);

  if (isLoading || ordersLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-card">
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-border">
                {Array.from({ length: 5 }).map((__, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-muted rounded-md animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const orders = data?.data ?? [];
  const meta = data?.meta;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3">
        <p className="text-[12px] text-muted-foreground">No orders yet.</p>
        <Link href="/shop" className="text-[11px] text-primary hover:text-primary/80">
          → Browse products
        </Link>
      </div>
    );
  }

  const TH = "px-4 py-2.5 text-[10px] tracking-[0.08em] uppercase text-muted-foreground border-b border-border text-left bg-muted";
  const TD = "px-4 py-3 text-[12.5px] text-foreground border-b border-border align-middle";

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-card">
          <thead>
            <tr>
              <th className={TH}>Invoice #</th>
              <th className={TH}>Date</th>
              <th className={TH}>Status</th>
              <th className={TH}>Payment</th>
              <th className={`${TH} text-right`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                <td className={TD}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-[12px] text-primary hover:text-primary/80 transition-colors"
                  >
                    {order.invoice_no}
                  </Link>
                </td>
                <td className={`${TD} text-[11.5px] text-muted-foreground`}>
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className={TD}>
                  <StatusBadge status={order.status} />
                </td>
                <td className={TD}>
                  <span
                    className={`text-[11.5px] capitalize ${PAYMENT_STYLES[order.payment_status] ?? "text-muted-foreground"}`}
                  >
                    {order.payment_status}
                  </span>
                </td>
                <td className={`${TD} text-right font-semibold`}>
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={setPage}
          />
        </div>
      )}
    </>
  );
}

export default function OrdersPage() {
  return (
    <div className="bg-background min-h-screen pb-28 md:pb-20">
      <PageHeader
        crumbs={[{ label: "Orders" }]}
        title="Your orders"
      />
      <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
        <Suspense>
          <OrdersTable />
        </Suspense>
      </div>
    </div>
  );
}
