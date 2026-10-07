"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useBrands } from "@/hooks/useBrands";
import { PageHeader } from "@/components/shared/PageHeader";

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

export default function BrandsPage() {
  const { data: brands, isLoading } = useBrands();

  return (
    <div className="min-h-screen bg-muted/30">
      <PageHeader
        crumbs={[{ label: "Brands" }]}
        title="All Brands"
        meta={brands ? `${brands.length} brands` : undefined}
      />

      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !brands?.length ? (
          <div className="flex items-center justify-center h-40 text-[11px] font-medium text-muted-foreground tracking-widest uppercase">
            No brands found
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.id}`}
                className="group block overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm no-underline transition-colors hover:border-primary/50"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  {brand.image ? (
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Placeholder label={brand.name} />
                  )}
                </div>
                <div className="px-4 pt-4 pb-5">
                  {brand.location && (
                    <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-muted-foreground mb-1">
                      {brand.location}
                    </div>
                  )}
                  <div className="text-[20px] text-foreground font-semibold leading-tight tracking-tight">
                    {brand.name}
                  </div>
                  {brand.description && (
                    <p className="text-[12px] text-muted-foreground leading-relaxed mt-1.5 line-clamp-2">
                      {brand.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    {brand.products_count !== undefined && (
                      <span className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground">
                        {brand.products_count} SKUs
                      </span>
                    )}
                    <ArrowRight size={14} className="text-primary ml-auto" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
