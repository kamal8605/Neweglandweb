import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isValidOrderId } from "@/lib/orderId";

// A malformed order id (e.g. "..%2Fusers%2Fme") answers with a real 404 before any client code runs.
export default async function OrderLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidOrderId(id)) notFound();
  return children;
}
