import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "due" | "paid" | "refunded";

export interface OrderAddress {
  name: string;
  company?: string | null;
  address_1: string;
  address_2?: string | null;
  city: string;
  state?: string | null;
  postcode: string;
  country: string;
  email?: string | null;
  phone?: string | null;
}

export interface OrderLine {
  id: number;
  name: string;
  sku?: string | null;
  quantity: number;
  unit_price: number;
  unit_tax: number;
  total: number;
}

export interface Order {
  id: number;
  invoice_no: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  customer_note?: string | null;
  line_total: number;
  discount_total?: number;
  shipping_total?: number | null;
  total_tax?: number | null;
  total: number;
  created_at: string;
  billing?: OrderAddress;
  shipping?: OrderAddress;
  items?: OrderLine[];
}

export interface OrdersMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export interface OrdersResponse {
  data: Order[];
  meta: OrdersMeta;
}

const n = (v: unknown) => parseFloat(String(v ?? 0)) || 0;

function parseOrder(raw: Record<string, unknown>): Order {
  const items = (raw.items as Record<string, unknown>[] | undefined)?.map((line) => ({
    ...(line as object),
    unit_price: n(line.unit_price),
    unit_tax: n(line.unit_tax),
    total: n(line.total),
  })) as OrderLine[] | undefined;

  return {
    ...(raw as unknown as Order),
    line_total: n(raw.line_total),
    discount_total: n(raw.discount_total),
    shipping_total: raw.shipping_total != null ? n(raw.shipping_total) : null,
    total_tax: raw.total_tax != null ? n(raw.total_tax) : null,
    total: n(raw.total),
    items,
  };
}

export function useOrders(page = 1) {
  return useQuery<OrdersResponse>({
    queryKey: ["orders", page],
    queryFn: () =>
      api
        .get<{ data: Record<string, unknown>[]; meta: OrdersMeta }>("/orders", {
          params: { page, per_page: 15 },
        })
        .then((r) => ({ data: r.data.data.map(parseOrder), meta: r.data.meta })),
    staleTime: 2 * 60 * 1000,
  });
}

export function useOrder(id: number | string) {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () =>
      api
        .get<Record<string, unknown>>(`/orders/${id}`)
        .then((r) => parseOrder(r.data)),
    enabled: !!id,
  });
}
