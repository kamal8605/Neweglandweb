export const MAX_CART_QUANTITY = 999;

export interface CartItem {
  product_id: number;
  name: string;
  sku: string;
  image: string | null;
  price: number;
  quantity: number;
  parent_id?: number | null;
  parent_name?: string | null;
}

export function sanitizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Partial<CartItem>;
    const productId = Number(item.product_id);
    const quantity = Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(Number(item.quantity))));
    const price = Number(item.price);
    if (!Number.isInteger(productId) || productId <= 0 || !Number.isFinite(quantity)) return [];

    return [{
      product_id: productId,
      name: typeof item.name === "string" ? item.name : "Product",
      sku: typeof item.sku === "string" ? item.sku : "",
      image: typeof item.image === "string" ? item.image : null,
      price: Number.isFinite(price) && price >= 0 ? price : 0,
      quantity,
      parent_id: typeof item.parent_id === "number" ? item.parent_id : null,
      parent_name: typeof item.parent_name === "string" ? item.parent_name : null,
    }];
  });
}

export function mergeCarts(primary: CartItem[], incoming: CartItem[]) {
  const merged = new Map(primary.map((item) => [item.product_id, item]));
  incoming.forEach((item) => {
    const existing = merged.get(item.product_id);
    merged.set(item.product_id, existing
      ? { ...existing, quantity: Math.min(MAX_CART_QUANTITY, existing.quantity + item.quantity) }
      : item);
  });
  return Array.from(merged.values());
}
