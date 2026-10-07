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
        background: "repeating-linear-gradient(135deg, var(--muted) 0 14px, var(--border) 14px 28px)",
      }}
    >
      <span className="rounded-md bg-background/90 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
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
      // Same boxes as the loaded header (breadcrumb, then image + fact sheet stacked on phones) so the
      // products below don't jump when the brand arrives.
      <div className="animate-pulse" aria-hidden="true">
        <div className="h-[53px] border-b border-border bg-card" />
        <div className="grid grid-cols-1 border-b border-border md:[grid-template-columns:1.2fr_1fr]">
          <div className="min-h-[220px] bg-muted md:min-h-[280px]" />
          <div className="h-[253px] bg-card md:h-auto" />
        </div>
      </div>
    );
  }

  if (!brand) return null;

  return (
    <>
      {/* Breadcrumb */}
      <div className="px-4 md:px-8 py-3.5 border-b border-border bg-card">
        <Breadcrumb
          items={[
            { label: "Brands", href: "/brands" },
            { label: brand.name },
          ]}
        />
      </div>

      {/* Hero — two-column */}
      <div
        className="grid grid-cols-1 border-b border-border md:[grid-template-columns:1.2fr_1fr]"
      >
        {/* Left: image with gradient overlay */}
        <div className="relative min-h-[220px] md:min-h-[280px] overflow-hidden">
          {brand.image ? (
            <Image src={brand.image} alt={brand.name} fill sizes="(max-width: 767px) 100vw, 55vw" loading="eager" fetchPriority="high" className="object-cover" />
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
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-8 md:right-8 text-white">
            <div className="text-[10.5px] font-medium tracking-[0.12em] uppercase text-white/80 mb-2">
              {brand.location ?? "USA"}
              {brand.founded_year ? ` · EST. ${brand.founded_year}` : ""}
            </div>
            <h1 className="text-[34px] md:text-[44px] lg:text-[52px] leading-[1] font-semibold tracking-tight m-0">
              {brand.name}
            </h1>
          </div>
        </div>

        {/* Right: buyer fact sheet */}
        <div className="bg-card px-4 md:px-7 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-1">
            <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-foreground">
              Buyer fact sheet
            </span>
            <span className="text-[10px] text-muted-foreground">
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
              <div key={s.l} className="py-3 border-b border-border">
                <div className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-0.5">
                  {s.l}
                </div>
                <div className="text-[15px] font-semibold text-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          {brand.description && (
            <blockquote className="mt-4 pl-3 border-l-2 border-primary">
              <p className="text-[13px] text-muted-foreground leading-relaxed italic">
                {brand.description}
              </p>
            </blockquote>
          )}

          <div className="mt-5 flex items-center gap-4">
            <Link
              href={`/brand/${id}#products`}
              className="inline-flex min-h-6 items-center text-[11px] font-medium tracking-[0.06em] uppercase text-primary hover:text-primary/80 transition-colors"
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
      <div className="px-4 md:px-8 pt-0 border-b border-border bg-card flex items-center gap-0 overflow-x-auto">
        {(Object.entries(TAB_CONFIG) as [Tab, (typeof TAB_CONFIG)[Tab]][]).map(
          ([key, cfg]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-3.5 text-[11px] font-medium tracking-[0.08em] uppercase border-b-2 transition-colors ${
                tab === key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
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
    <div className="min-h-screen bg-muted/30">
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
