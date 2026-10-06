import { describe, expect, it } from "vitest";
import { MAX_CART_QUANTITY, fromServerCart, mergeCarts, sanitizeCart, type CartItem } from "./cart";

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

describe("fromServerCart", () => {
  it("maps server lines, keeping stock flags and treating hidden prices as 0", () => {
    const result = fromServerCart([
      { product_id: 5, name: "Red", sku: null, image: null, quantity: 2, price: null, in_stock: false, max_quantity: 3, parent_id: 1, parent_name: "Hoodie" },
    ]);
    expect(result).toEqual([
      { product_id: 5, name: "Red", sku: "", image: null, price: 0, quantity: 2, parent_id: 1, parent_name: "Hoodie", in_stock: false, max_quantity: 3 },
    ]);
  });
});

describe("mergeCarts with variants", () => {
  it("keeps different variants of the same parent as separate lines", () => {
    const red = { ...item(7, 1), parent_id: 6 };
    const blue = { ...item(8, 2), parent_id: 6 };
    expect(mergeCarts([red], [blue, { ...red, quantity: 2 }])).toEqual([{ ...red, quantity: 3 }, blue]);
  });
});
