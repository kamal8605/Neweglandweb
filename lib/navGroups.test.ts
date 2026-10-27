import { describe, expect, it } from "vitest";
import type { Category } from "@/hooks/useCategories";
import { buildNavGroups } from "./navGroups";

const categories: Category[] = [
  { id: 1, name: "Apparel / Gear", slug: "apparel-gear" },
  { id: 2, name: "Cigars", slug: "cigars", children: [{ id: 21, name: "Premium Cigars", slug: "premium-cigars" }] },
  { id: 3, name: "Hookah", slug: "hookah" },
];

describe("buildNavGroups", () => {
  it("fills a group with the categories its keywords match", () => {
    const [cigar] = buildNavGroups([{ label: "Cigar", keywords: ["cigar"] }], categories);
    expect(cigar.items.map((item) => item.id)).toEqual([21]);
    expect(cigar.href).toBe("/category/2");
  });

  it("never gives a group an unrelated category when nothing matches", () => {
    const groups = buildNavGroups([{ label: "Cigar", keywords: ["cigar"] }, { label: "Whip Cream", keywords: ["whip"] }], categories);
    expect(groups[1].items).toEqual([]);
    expect(groups[1].href).toBe("/shop");
  });

  it("prefers the admin-defined URL", () => {
    const [group] = buildNavGroups([{ label: "Whip Cream", keywords: ["whip"], url: "/category/99" }], categories);
    expect(group.href).toBe("/category/99");
  });

  it("matches keywords case-insensitively", () => {
    const [group] = buildNavGroups([{ label: "Hookah", keywords: ["HOOKAH"] }], categories);
    expect(group.items.map((item) => item.id)).toEqual([3]);
  });
});
