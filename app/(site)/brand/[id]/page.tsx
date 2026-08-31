"use client";

import { use, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBrand } from "@/hooks/useBrands";
import { useProducts } from "@/hooks/useProducts";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

interface Props {
  params: Promise<{ id: string }>;
}

type Tab = "catalog" | "new" | "sale";

function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: "repeating-linear-gradient(135deg, #E5DFD0 0 14px, #D9D3C5 14px 28px)",
      }}
    >
      <span className="font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-1 text-brand-muted bg-brand-bg/90">
        {label}
      </span>
    </div>
  );
}

function BrandHero({ id }: { id: string }) {
  const { data: brand, isLoading: brandLoading } = useBrand(id);
  // Fetch all brand products for stat block
  const { data: productsData } = useProducts({ brand_id: id, per_page: 100 });

  const products = productsData?.data ?? [];
  const total = productsData?.meta?.total ?? products.length;
  const inStockCount = products.filter((p) => p.in_stock).length;
  const prices = products
    .map((p) => p.current_price ?? p.sale_price)
    .filter((p): p is number => p !== null);
  const lowestPrice = prices.length ? Math.min(...prices) : null;

  if (brandLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[280px] bg-brand-bg-alt" />
      </div>
    );
  }

  if (!brand) return null;

  return (
    <>
      {/* Breadcrumb */}
      <div className="px-8 py-3.5 border-b border-brand-line bg-brand-white">
        <Breadcrumb
          items={[
            { label: "Brands", href: "/brands" },
            { label: brand.name },
          ]}
        />
      </div>

      {/* Hero — two-column */}
      <div
        className="grid border-b border-brand-line"
        style={{ gridTemplateColumns: "1.2fr 1fr" }}
      >
        {/* Left: image with gradient overlay */}
        <div className="relative min-h-[280px] overflow-hidden">
          {brand.image ? (
            <Image src={brand.image} alt={brand.name} fill className="object-cover" />
          ) : (
            <Placeholder label={`${brand.name} · studio`} />
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,31,58,0.0) 40%, rgba(11,31,58,0.75) 100%)",
            }}
          />
          {/* Brand name overlay */}
          <div className="absolute bottom-6 left-8 right-8 text-white">
            <div className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-brand-orange mb-2">
              {brand.location ?? "USA"}
              {brand.founded_year ? ` · EST. ${brand.founded_year}` : ""}
            </div>
            <h1 className="font-serif text-[52px] leading-[0.95] font-normal tracking-tight m-0">
              {brand.name}
            </h1>
          </div>
        </div>

        {/* Right: buyer fact sheet */}
        <div className="bg-brand-white px-7 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-brand-ink mb-1">
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-brand-ink">
              Buyer fact sheet
            </span>
            <span className="font-mono text-[10px] text-brand-muted">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            {[
              { l: "SKUs", v: total ? String(total) : "—" },
              { l: "In stock", v: inStockCount ? String(inStockCount) : "—" },
              {
                l: "Wholesale from",
                v: lowestPrice !== null ? `$${lowestPrice.toFixed(2)}` : "—",
              },
              { l: "Terms", v: "Net-60" },
            ].map((s) => (
              <div key={s.l} className="py-3 border-b border-brand-line">
                <div className="font-mono text-[10px] tracking-[0.06em] uppercase text-brand-muted mb-0.5">
                  {s.l}
                </div>
                <div className="font-mono text-[15px] font-medium text-brand-ink">
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          {brand.description && (
            <blockquote className="mt-4 pl-3 border-l-2 border-brand-orange">
              <p className="text-[13px] text-brand-muted leading-relaxed italic">
                {brand.description}
              </p>
            </blockquote>
          )}

          <div className="mt-5 flex items-center gap-4">
            <Link
              href={`/brand/${id}#products`}
              className="font-mono text-[11px] tracking-[0.06em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors"
            >
              → Shop all products
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function BrandProducts({ id, brandName }: { id: string; brandName: string }) {
  const [tab, setTab] = useState<Tab>("catalog");

  const TAB_CONFIG: Record<Tab, { label: string; sort?: "newest"; saleOnly?: boolean }> = {
    catalog: { label: "Catalog" },
    new: { label: "New", sort: "newest" },
    sale: { label: "Sale", saleOnly: true },
  };

  return (
    <div id="products">
      {/* Tab bar */}
      <div className="px-8 pt-0 border-b border-brand-line bg-brand-white flex items-center gap-0">
        {(Object.entries(TAB_CONFIG) as [Tab, (typeof TAB_CONFIG)[Tab]][]).map(
          ([key, cfg]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-3.5 font-mono text-[11px] tracking-[0.08em] uppercase border-b-2 transition-colors ${
                tab === key
                  ? "border-brand-orange text-brand-ink"
                  : "border-transparent text-brand-muted hover:text-brand-ink"
              }`}
            >
              {cfg.label}
            </button>
          )
        )}
      </div>

      {/* BrowseLayout handles filters/table/pagination */}
      <BrowseLayout
        key={tab}
        brandId={Number(id)}
        title={brandName}
        crumbs={[
          { label: "Brands", href: "/brands" },
          { label: brandName },
        ]}
        defaultSort={TAB_CONFIG[tab].sort}
        saleOnly={TAB_CONFIG[tab].saleOnly}
      />
    </div>
  );
}

function BrandPageInner({ id }: { id: string }) {
  const { data: brand } = useBrand(id);

  return (
    <div className="bg-brand-bg min-h-screen">
      <BrandHero id={id} />
      <BrandProducts id={id} brandName={brand?.name ?? ""} />
    </div>
  );
}

export default function BrandPage({ params }: Props) {
  const { id } = use(params);
  return (
    <Suspense>
      <BrandPageInner id={id} />
    </Suspense>
  );
}
