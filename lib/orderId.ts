/**
 * Order ids come from the URL (`/orders/[id]`), and Next decodes route params, so a crafted link such as
 * `/orders/..%2Fusers%2Fme` would otherwise reach the API as `/api/users/me` (or inject `?query`/`#fragment`).
 * Only plain digit strings (or safe non-negative integers) are accepted; nothing else ever reaches a request path.
 */
const ORDER_ID = /^\d+$/;

export function isValidOrderId(id: unknown): id is string | number {
  if (typeof id === "number") return Number.isSafeInteger(id) && id >= 0;
  return typeof id === "string" && ORDER_ID.test(id);
}

/** `/orders/<id>` for a valid id, otherwise null. The segment is encoded as defense in depth. */
export function orderApiPath(id: unknown): string | null {
  return isValidOrderId(id) ? `/orders/${encodeURIComponent(String(id))}` : null;
}

/** Calls `get` only for a valid id; an invalid id rejects without making a request. */
export function requestOrder<T>(get: (path: string) => Promise<T>, id: unknown): Promise<T> {
  const path = orderApiPath(id);
  if (!path) return Promise.reject(new Error("Invalid order id"));
  return get(path);
}
