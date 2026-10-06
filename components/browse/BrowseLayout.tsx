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
    <div className="bg-brand-bg min-h-screen pb-28 md:pb-20">
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
        <div className="px-4 md:px-6 lg:px-8 py-3 border-b border-brand-line bg-brand-white flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setParam("sub_cat", null)}
            className={`px-3 py-1 text-[11.5px] border rounded-[var(--brand-radius)] transition-colors ${
              !subCatId
                ? "bg-brand-ink text-white border-brand-ink"
                : "bg-brand-white text-brand-ink border-brand-line hover:border-brand-ink"
            }`}
          >
            All
          </button>
          {subCategories.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setParam("sub_cat", String(sc.id))}
              className={`px-3 py-1 text-[11.5px] border rounded-[var(--brand-radius)] transition-colors inline-flex items-center gap-1.5 ${
                subCatId === sc.id
                  ? "bg-brand-ink text-white border-brand-ink"
                  : "bg-brand-white text-brand-ink border-brand-line hover:border-brand-ink"
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
          className={`fixed inset-y-0 left-0 z-[60] w-[min(86vw,320px)] overflow-y-auto bg-brand-white p-5 text-[12.5px] shadow-2xl transition-transform duration-200 lg:static lg:z-auto lg:w-[220px] lg:shrink-0 lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none ${
            filtersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-brand-ink mb-3">
            <span className="font-mono text-[10px] tracking-[0.08em] uppercase flex items-center gap-1.5">
              <SlidersHorizontal size={11} />
              FILTERS{activeFilterCount > 0 && ` · ${activeFilterCount}`}
            </span>
            <div className="flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[11px] text-brand-orange hover:text-brand-ink transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1 text-brand-ink lg:hidden"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* In stock */}
          <div className="mb-4 pb-4 border-b border-brand-line">
            <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-brand-ink mb-2">
              Stock
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setParam("in_stock", e.target.checked ? "true" : null)}
                className="w-4 h-4 accent-brand-blue"
              />
              <span>In stock now</span>
            </label>
          </div>

          {/* Brand filter */}
          {!brandId && (
            <div className="mb-4 pb-4 border-b border-brand-line">
              <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-brand-ink mb-2 flex justify-between">
                <span>Brand</span>
                {activeBrandIds.length > 0 && (
                  <span className="text-brand-muted">{activeBrandIds.length} selected</span>
                )}
              </div>
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands…"
                className="w-full h-7 px-2 mb-2 border border-brand-line text-[11.5px] bg-brand-white focus:outline-none focus:border-brand-blue rounded-[var(--brand-radius)] placeholder:text-brand-muted"
              />
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredBrands.length === 0 ? (
                  <p className="text-[11.5px] text-brand-muted">No brands found</p>
                ) : (
                  filteredBrands.map((b) => (
                    <label key={b.id} className="flex min-h-7 items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeBrandIds.includes(b.id)}
                        onChange={() => toggleBrand(b.id)}
                        className="w-4 h-4 accent-brand-blue shrink-0"
                      />
                      <span className="text-[12px] text-brand-ink truncate">{b.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Category filter — hidden on fixed category pages */}
          {!categoryId && (
            <div className="mb-4 pb-4 border-b border-brand-line">
              <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-brand-ink mb-2">
                Category
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {(allCategories ?? []).slice().sort((a, b) => a.name.localeCompare(b.name)).map((cat) => (
                  <label key={cat.id} className="flex min-h-7 items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catId === cat.id}
                      onChange={() => toggleCategory(cat.id)}
                      className="w-4 h-4 accent-brand-blue shrink-0"
                    />
                    <span className="text-[12px] text-brand-ink truncate">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sub-category filter — shown when parent has children */}
          {sidebarSubCats.length > 0 && (
            <div className="mb-4 pb-4 border-b border-brand-line">
              <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-brand-ink mb-2">
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
                      className="w-4 h-4 accent-brand-blue shrink-0"
                    />
                    <span className="text-[12px] text-brand-ink truncate">{sc.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

        </aside>

        {/* ── Main: toolbar + table + pagination ─────────── */}
        {/* The page already has a <main> (SiteLayout); this is the product results region. */}
        <section aria-label="Products" className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-y-2 py-2.5 border-b border-brand-ink mb-0">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-brand-muted uppercase flex-wrap">
              {meta && (
                <span>
                  <span className="text-brand-ink">{meta.total.toLocaleString()} SKUs</span>
                  {meta.from && meta.to && ` · ${meta.from}–${meta.to}`}
                </span>
              )}
              {search && (
                <button
                  onClick={() => setParam("search", null)}
                  aria-label={`Clear search “${search}”`}
                  className="flex max-w-[16rem] items-center gap-1 px-2 py-0.5 border border-brand-line bg-brand-white text-brand-ink text-[10.5px] normal-case tracking-normal rounded-[var(--brand-radius)] hover:border-brand-ink"
                >
                  <span className="truncate">Search: {search}</span> <X size={10} className="shrink-0" />
                </button>
              )}
              {inStock && (
                <button
                  onClick={() => setParam("in_stock", null)}
                  className="flex items-center gap-1 px-2 py-0.5 border border-brand-line bg-brand-white text-brand-ink text-[10.5px] normal-case tracking-normal rounded-[var(--brand-radius)] hover:border-brand-ink"
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
                    className="flex items-center gap-1 px-2 py-0.5 border border-brand-line bg-brand-white text-brand-ink text-[10.5px] normal-case tracking-normal rounded-[var(--brand-radius)] hover:border-brand-ink"
                  >
                    {brand?.name ?? bid} <X size={10} />
                  </button>
                );
              })}
              {!categoryId && catId && (
                <button
                  onClick={() => toggleCategory(catId)}
                  className="flex items-center gap-1 px-2 py-0.5 border border-brand-line bg-brand-white text-brand-ink text-[10.5px] normal-case tracking-normal rounded-[var(--brand-radius)] hover:border-brand-ink"
                >
                  {activeCatName ?? catId} <X size={10} />
                </button>
              )}
              {subCatId && (
                <button
                  onClick={() => setParam("sub_cat", null)}
                  className="flex items-center gap-1 px-2 py-0.5 border border-brand-line bg-brand-white text-brand-ink text-[10.5px] normal-case tracking-normal rounded-[var(--brand-radius)] hover:border-brand-ink"
                >
                  {activeSubCatName ?? subCatId} <X size={10} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex h-9 items-center gap-1.5 border border-brand-line bg-brand-white px-3 font-mono text-[10.5px] uppercase tracking-[0.06em] text-brand-ink hover:border-brand-ink lg:hidden"
              >
                <SlidersHorizontal size={13} />
                Filters{activeFilterCount > 0 && ` · ${activeFilterCount}`}
              </button>
              <div className="flex items-center border border-brand-line rounded-[var(--brand-radius)] overflow-hidden">
                <button
                  onClick={() => switchView("list")}
                  title="List view"
                  className={`px-2.5 py-2 lg:px-2 lg:py-1.5 transition-colors ${
                    view === "list"
                      ? "bg-brand-ink text-white"
                      : "bg-brand-white text-brand-muted hover:text-brand-ink"
                  }`}
                >
                  <LayoutList size={13} />
                </button>
                <button
                  onClick={() => switchView("grid")}
                  title="Grid view"
                  className={`px-2.5 py-2 lg:px-2 lg:py-1.5 transition-colors border-l border-brand-line ${
                    view === "grid"
                      ? "bg-brand-ink text-white"
                      : "bg-brand-white text-brand-muted hover:text-brand-ink"
                  }`}
                >
                  <LayoutGrid size={13} />
                </button>
              </div>

              <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-brand-muted">
                SORT
              </span>
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="h-9 lg:h-7 px-2 border border-brand-line text-[11.5px] bg-brand-white rounded-[var(--brand-radius)] focus:outline-none focus:border-brand-blue"
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
