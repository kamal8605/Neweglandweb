import { describe, expect, it } from "vitest";
import { MAX_CART_QUANTITY, mergeCarts, sanitizeCart, type CartItem } from "./cart";

const item = (id: number, quantity: number): CartItem => ({
  product_id: id,
  name: `Product ${id}`,
  sku: `SKU-${id}`,
  image: null,
  price: 10,
  quantity,
});

describe("sanitizeCart", () => {
  it("rejects malformed entries and clamps unsafe quantities", () => {
    const result = sanitizeCart([
      item(1, MAX_CART_QUANTITY + 50),
      { ...item(2, 1), price: -10 },
      { product_id: "invalid", quantity: 2 },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].quantity).toBe(MAX_CART_QUANTITY);
    expect(result[1].price).toBe(0);
  });
});

describe("mergeCarts", () => {
  it("merges matching products without exceeding the quantity limit", () => {
    const result = mergeCarts([item(1, 900)], [item(1, 200), item(2, 3)]);
    expect(result).toHaveLength(2);
    expect(result.find((entry) => entry.product_id === 1)?.quantity).toBe(MAX_CART_QUANTITY);
    expect(result.find((entry) => entry.product_id === 2)?.quantity).toBe(3);
  });
});
