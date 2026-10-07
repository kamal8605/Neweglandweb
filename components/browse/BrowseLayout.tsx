"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, SlidersHorizontal, LayoutList, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductTable } from "@/components/shared/ProductTable";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { Pagination } from "@/components/shared/Pagination";
import { CartBar } from "@/components/shared/CartBar";
import { useProducts, type ProductsParams } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { useBrands } from "@/hooks/useBrands";
import { useCategories, type Category } from "@/hooks/useCategories";
import type { BreadcrumbItem } from "@/components/shared/Breadcrumb";

const SORT_OPTIONS = [
  { value: "name_asc", label: "Bestselling" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
] as const;

interface BrowseLayoutProps {
  categoryId?: number;
  categoryName?: string;
  brandId?: number;
  /** Sub-categories passed from category pages (rendered as pills) */
  subCategories?: Category[];
  crumbs?: BreadcrumbItem[];
  title?: string;
  defaultSort?: ProductsParams["sort"];
  saleOnly?: boolean;
  showDiscountPct?: boolean;
}

export function BrowseLayout({
  categoryId,
  categoryName,
  brandId,
  subCategories = [],
  crumbs,
  title,
  defaultSort = "name_asc",
  saleOnly = false,
  showDiscountPct = false,
}: BrowseLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-driven state
  const page = Number(searchParams.get("page") ?? 1);
  const sort = (searchParams.get("sort") as ProductsParams["sort"]) ?? defaultSort;
  const inStock = searchParams.get("in_stock") === "true";
  const activeBrandIds = searchParams.getAll("brand_id").map(Number).filter(Boolean);
  const subCatId = searchParams.get("sub_cat") ? Number(searchParams.get("sub_cat")) : undefined;
  // Sidebar-driven category selection (only used when categoryId prop is not set)
  const catId = searchParams.get("cat") ? Number(searchParams.get("cat")) : undefined;
  // Free-text search from the header search box (?search=...). Empty = full catalogue.
  const search = (searchParams.get("search") ?? "").trim();

  // Local state
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [brandSearch, setBrandSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<"list" | "grid">(() => {
    if (typeof window === "undefined") return "list";
    return (localStorage.getItem("fastweb_view") as "list" | "grid") ?? "list";
  });
  const { addItem } = useCart();

  useEffect(() => {
    if (!filtersOpen) return;
    const previous = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [filtersOpen]);

  function switchView(v: "list" | "grid") {
    setView(v);
    setQtyMap({});
    localStorage.setItem("fastweb_view", v);
  }

  // ── URL helpers ────────────────────────────────────────────────────────────

  function setParam(key: string, value: string | null) {
    const p = new URLSearchParams(searchParams.toString());
    if (value === null) p.delete(key);
    else p.set(key, value);
    if (key !== "page") p.delete("page");
    router.push(`${pathname}?${p.toString()}`);
  }

  function toggleBrand(id: number) {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("brand_id");
    p.delete("page");
    const next = activeBrandIds.includes(id)
      ? activeBrandIds.filter((b) => b !== id)
      : [...activeBrandIds, id];
    next.forEach((b) => p.append("brand_id", String(b)));
    router.push(`${pathname}?${p.toString()}`);
  }

  function toggleCategory(id: number) {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("sub_cat");
    p.delete("page");
    if (catId === id) {
      p.delete("cat");
    } else {
      p.set("cat", String(id));
    }
    router.push(`${pathname}?${p.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  // ── Data ───────────────────────────────────────────────────────────────────

  const { data: allBrands } = useBrands();
  const { data: allCategories } = useCategories();

  const filteredBrands = brandSearch.trim()
    ? (allBrands ?? []).filter((b) =>
        b.name.toLowerCase().includes(brandSearch.toLowerCase().trim())
      )
    : (allBrands ?? []);

  // Sub-categories for the sidebar filter:
  // - On a fixed category page (categoryId prop): children come from subCategories prop
  // - On generic pages: children come from whichever top-level cat is selected via URL
  const activeSidebarCat = !categoryId
    ? (allCategories ?? []).find((c) => c.id === catId)
    : null;
  const sidebarSubCats: Category[] = categoryId
    ? subCategories
    : (activeSidebarCat?.children ?? []);

  const params: ProductsParams = {
    category_id: subCatId ?? catId ?? categoryId,
    brand_id: activeBrandIds.length >= 1 ? activeBrandIds[0] : undefined,
    in_stock: inStock || undefined,
    search: search || undefined,
    sort,
    page,
    per_page: 48,
  };
  if (brandId) params.brand_id = brandId;

  const { data, isLoading } = useProducts(params);

  let products = data?.data ?? [];
  if (saleOnly) products = products.filter((p) => p.on_sale);

  const meta = data?.meta;
  const activeFilterCount =
    (inStock ? 1 : 0) +
    activeBrandIds.length +
    (!categoryId && catId ? 1 : 0) +
    (subCatId ? 1 : 0);

  // ── Cart ───────────────────────────────────────────────────────────────────

  const handleAddToCart = () => {
    products.forEach((p) => {
      const qty = qtyMap[p.id];
      if (qty && qty > 0 && p.in_stock) {
        addItem(
          {
            product_id: p.id,
            name: p.name,
            sku: p.sku,
            image: p.image,
            price: p.current_price ?? p.sale_price ?? 0,
            parent_id: p.parent_id,
            parent_name: null,
          },
          qty
        );
      }
    });
    setQtyMap({});
  };

  const selectedCount = Object.values(qtyMap).filter((q) => q > 0).length;

  const pageTitle = search
    ? `Results for “${search}”`
    : title ?? categoryName ?? (brandId ? "Brand" : "All Products");
  const metaStr = meta
    ? `${meta.total.toLocaleString()} SKUs${meta.from && meta.to ? ` · ${meta.from}–${meta.to}` : ""}`
    : undefined;

  // Chip label helpers
  const activeCatName = !categoryId
    ? (allCategories ?? []).find((c) => c.id === catId)?.name
    : undefined;
  const activeSubCatName = sidebarSubCats.find((sc) => sc.id === subCatId)?.name;

  return (
    <div className="min-h-screen bg-muted/30 pb-28 text-foreground md:pb-20">
      <PageHeader
        crumbs={
          crumbs ?? [
            { label: "Shop", href: "/shop" },
            ...(categoryName ? [{ label: categoryName }] : []),
          ]
        }
        title={pageTitle}
        meta={metaStr}
      />

      {/* Sub-category pills — category pages only */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background px-4 py-3 md:px-6 lg:px-8">
          <button
            onClick={() => setParam("sub_cat", null)}
            className={`rounded-md border px-3 py-1 text-[11.5px] font-medium transition-colors ${
              !subCatId
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-accent"
            }`}
          >
            All
          </button>
          {subCategories.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setParam("sub_cat", String(sc.id))}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-[11.5px] font-medium transition-colors ${
                subCatId === sc.id
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-accent"
              }`}
            >
              {sc.name}
              {sc.products_count !== undefined && (
                <span className="font-mono text-[9.5px] opacity-60">{sc.products_count}</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex px-4 md:px-6 lg:px-8 pt-4 gap-6 max-w-[1600px] mx-auto">
        {filtersOpen && (
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="fixed inset-0 z-[55] bg-black/50 lg:hidden"
          />
        )}
        {/* ── Filters sidebar (drawer below lg) ─────────────── */}
        <aside
          className={`fixed inset-y-0 left-0 z-[60] w-[min(86vw,320px)] overflow-y-auto bg-background p-5 text-[12.5px] transition-transform duration-200 lg:static lg:z-auto lg:w-[220px] lg:shrink-0 lg:translate-x-0 lg:self-start lg:overflow-visible lg:rounded-lg lg:border lg:border-border lg:bg-card lg:p-4 lg:shadow-sm ${
            filtersOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground">
              <SlidersHorizontal size={11} />
              FILTERS{activeFilterCount > 0 && ` · ${activeFilterCount}`}
            </span>
            <div className="flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-md p-1 text-foreground transition-colors hover:bg-accent lg:hidden"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* In stock */}
          <div className="mb-4 border-b border-border pb-4">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground">
              Stock
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setParam("in_stock", e.target.checked ? "true" : null)}
                className="h-4 w-4 accent-primary"
              />
              <span>In stock now</span>
            </label>
          </div>

          {/* Brand filter */}
          {!brandId && (
            <div className="mb-4 border-b border-border pb-4">
              <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground">
                <span>Brand</span>
                {activeBrandIds.length > 0 && (
                  <span className="font-normal text-muted-foreground">{activeBrandIds.length} selected</span>
                )}
              </div>
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands…"
                className="mb-2 h-8 w-full rounded-md border border-input bg-background px-2 text-[11.5px] text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredBrands.length === 0 ? (
                  <p className="text-[11.5px] text-muted-foreground">No brands found</p>
                ) : (
                  filteredBrands.map((b) => (
                    <label key={b.id} className="flex min-h-7 items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeBrandIds.includes(b.id)}
                        onChange={() => toggleBrand(b.id)}
                        className="h-4 w-4 shrink-0 accent-primary"
                      />
                      <span className="truncate text-[12px] text-foreground">{b.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Category filter — hidden on fixed category pages */}
          {!categoryId && (
            <div className="mb-4 border-b border-border pb-4">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground">
                Category
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {(allCategories ?? []).slice().sort((a, b) => a.name.localeCompare(b.name)).map((cat) => (
                  <label key={cat.id} className="flex min-h-7 items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catId === cat.id}
                      onChange={() => toggleCategory(cat.id)}
                      className="h-4 w-4 shrink-0 accent-primary"
                    />
                    <span className="truncate text-[12px] text-foreground">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sub-category filter — shown when parent has children */}
          {sidebarSubCats.length > 0 && (
            <div className="mb-4 border-b border-border pb-4">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground">
                Sub-category
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {sidebarSubCats.map((sc) => (
                  <label key={sc.id} className="flex min-h-7 items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subCatId === sc.id}
                      onChange={() =>
                        setParam("sub_cat", subCatId === sc.id ? null : String(sc.id))
                      }
                      className="h-4 w-4 shrink-0 accent-primary"
                    />
                    <span className="truncate text-[12px] text-foreground">{sc.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

        </aside>

        {/* ── Main: toolbar + table + pagination ─────────── */}
        {/* The page already has a <main> (SiteLayout); this is the product results region. */}
        <section aria-label="Products" className="flex-1 min-w-0">
          <div className="mb-0 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
              {meta && (
                <span>
                  <span className="text-foreground">{meta.total.toLocaleString()} SKUs</span>
                  {meta.from && meta.to && ` · ${meta.from}–${meta.to}`}
                </span>
              )}
              {search && (
                <button
                  onClick={() => setParam("search", null)}
                  aria-label={`Clear search “${search}”`}
                  className="flex max-w-[16rem] items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[10.5px] font-normal normal-case tracking-normal text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  <span className="truncate">Search: {search}</span> <X size={10} className="shrink-0" />
                </button>
              )}
              {inStock && (
                <button
                  onClick={() => setParam("in_stock", null)}
                  className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[10.5px] font-normal normal-case tracking-normal text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  In stock <X size={10} />
                </button>
              )}
              {activeBrandIds.map((bid) => {
                const brand = (allBrands ?? []).find((b) => b.id === bid);
                return (
                  <button
                    key={bid}
                    onClick={() => toggleBrand(bid)}
                    className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[10.5px] font-normal normal-case tracking-normal text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
                  >
                    {brand?.name ?? bid} <X size={10} />
                  </button>
                );
              })}
              {!categoryId && catId && (
                <button
                  onClick={() => toggleCategory(catId)}
                  className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[10.5px] font-normal normal-case tracking-normal text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  {activeCatName ?? catId} <X size={10} />
                </button>
              )}
              {subCatId && (
                <button
                  onClick={() => setParam("sub_cat", null)}
                  className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[10.5px] font-normal normal-case tracking-normal text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  {activeSubCatName ?? subCatId} <X size={10} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-[10.5px] font-medium uppercase tracking-[0.06em] text-foreground transition-colors hover:border-primary/50 hover:bg-accent lg:hidden"
              >
                <SlidersHorizontal size={13} />
                Filters{activeFilterCount > 0 && ` · ${activeFilterCount}`}
              </button>
              <div className="flex items-center overflow-hidden rounded-md border border-border bg-background shadow-xs">
                <button
                  onClick={() => switchView("list")}
                  title="List view"
                  className={`px-2.5 py-2 lg:px-2 lg:py-1.5 transition-colors ${
                    view === "list"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <LayoutList size={13} />
                </button>
                <button
                  onClick={() => switchView("grid")}
                  title="Grid view"
                  className={`border-l border-border px-2.5 py-2 transition-colors lg:px-2 lg:py-1.5 ${
                    view === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <LayoutGrid size={13} />
                </button>
              </div>

              <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                SORT
              </span>
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-2 text-[11.5px] text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 lg:h-7"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {view === "grid" ? (
            <ProductGrid
              products={products}
              showBrand={!brandId}
              showDiscountPct={showDiscountPct}
              loading={isLoading}
              onQtyChange={setQtyMap}
            />
          ) : (
            <ProductTable
              products={products}
              showBrand={!brandId}
              showDiscountPct={showDiscountPct}
              loading={isLoading}
              onQtyChange={setQtyMap}
            />
          )}

          {meta && meta.last_page > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={(p) => setParam("page", String(p))}
              />
            </div>
          )}
        </section>
      </div>

      <CartBar
        onAddToCart={selectedCount > 0 ? handleAddToCart : undefined}
        selectedCount={selectedCount}
      />
    </div>
  );
}
