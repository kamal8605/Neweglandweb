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
        background: "repeating-linear-gradient(135deg, #E5DFD0 0 14px, #D9D3C5 14px 28px)",
      }}
    >
      <span className="font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-1 text-brand-muted bg-brand-bg/90 rounded-[2px]">
        {label}
      </span>
    </div>
  );
}

export default function BrandsPage() {
  const { data: brands, isLoading } = useBrands();

  return (
    <div className="bg-brand-bg min-h-screen">
      <PageHeader
        crumbs={[{ label: "Brands" }]}
        title="All Brands"
        meta={brands ? `${brands.length} brands` : undefined}
      />

      <div className="px-8 py-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-brand-white border border-brand-line animate-pulse">
                <div className="aspect-[4/3] bg-brand-bg-alt" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-brand-bg-alt rounded w-3/4" />
                  <div className="h-3 bg-brand-bg-alt rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !brands?.length ? (
          <div className="flex items-center justify-center h-40 font-mono text-[11px] text-brand-muted tracking-widest uppercase">
            No brands found
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.id}`}
                className="bg-brand-white border border-brand-line hover:border-brand-blue transition-colors no-underline group block"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  {brand.image ? (
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Placeholder label={brand.name} />
                  )}
                </div>
                <div className="px-4 pt-4 pb-5">
                  {brand.location && (
                    <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-brand-muted mb-1">
                      {brand.location}
                    </div>
                  )}
                  <div className="font-serif text-[20px] text-brand-ink font-normal leading-tight">
                    {brand.name}
                  </div>
                  {brand.description && (
                    <p className="text-[12px] text-brand-muted leading-relaxed mt-1.5 line-clamp-2">
                      {brand.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    {brand.products_count !== undefined && (
                      <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-brand-muted">
                        {brand.products_count} SKUs
                      </span>
                    )}
                    <ArrowRight size={14} className="text-brand-blue ml-auto" />
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
