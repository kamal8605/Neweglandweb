"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";

// ── Stripe placeholder (matches reference design) ───────────────
function Placeholder({
  label,
  tone = "warm",
  className = "",
}: {
  label?: string;
  tone?: "warm" | "cool" | "orange";
  className?: string;
}) {
  const [a, b] =
    tone === "cool"
      ? ["#D6DEEC", "#C6D0E2"]
      : tone === "orange"
      ? ["#FFD9BD", "#FFC499"]
      : ["#E5DFD0", "#D9D3C5"];
  const fg =
    tone === "cool" ? "#3A4866" : tone === "orange" ? "#7A3B12" : "#5A5751";

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{
        background: `repeating-linear-gradient(135deg, ${a} 0 14px, ${b} 14px 28px)`,
      }}
    >
      {label && (
        <span
          className="font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-1 rounded-[2px]"
          style={{ color: fg, background: "rgba(247,244,238,0.9)" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ── Section A — Hero ─────────────────────────────────────────────
function HeroSection() {
  return (
    <div className="grid border-b border-brand-line" style={{ gridTemplateColumns: "1.1fr 1fr" }}>
      {/* Left — copy */}
      <div className="px-16 py-20 relative">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] uppercase text-brand-orange mb-7">
          <span className="w-6 h-px bg-brand-orange shrink-0" />
          SS26 WHOLESALE PREVIEW · OPEN NOW
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[82px] leading-[0.96] text-brand-ink m-0 tracking-[-0.02em] font-normal">
          The wholesale
          <br />
          <em className="text-brand-blue not-italic">back-of-house</em>
          <br />
          for indie retail.
        </h1>

        {/* Sub-copy */}
        <p className="text-[17px] leading-[1.55] text-brand-muted max-w-[480px] mt-8">
          Six hundred vetted brands. One purchase order. Sixty-day terms.
          Stock your shelves without stocking your spreadsheet.
        </p>

        {/* CTAs */}
        <div className="flex gap-3 mt-9">
          <Link
            href="/register"
            className="flex items-center gap-2.5 bg-brand-ink text-brand-white px-7 py-4 text-[14px] font-medium rounded-[var(--brand-radius)] hover:bg-brand-navy transition-colors no-underline"
          >
            Apply for a buyer account
            <ArrowRight size={14} className="text-brand-orange" />
          </Link>
          <Link
            href="/shop"
            className="flex items-center px-6 py-4 text-[14px] font-medium text-brand-ink border border-brand-ink rounded-[var(--brand-radius)] hover:bg-brand-ink hover:text-brand-white transition-colors no-underline"
          >
            Browse the catalog
          </Link>
        </div>

        {/* Stat strip */}
        <div className="mt-18 pt-7 border-t border-brand-line grid grid-cols-3" style={{ marginTop: "4.5rem" }}>
          {[
            { n: "612", l: "Vetted brands" },
            { n: "12.4k", l: "SKUs in stock" },
            { n: "Net-60", l: "Standard terms" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-serif text-[44px] text-brand-navy leading-none font-normal">
                {s.n}
              </div>
              <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-brand-muted mt-2">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — imagery composition */}
      <div className="bg-brand-bg-alt relative min-h-[680px]">
        <div className="absolute inset-12">
          <Placeholder label="Lifestyle · workshop scene" tone="warm" className="h-full" />
        </div>

        {/* "This week's drop" blue card */}
        <div className="absolute bottom-12 left-12 right-40 bg-brand-blue text-white p-6 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-[0.08em] uppercase opacity-70 mb-1">
              This week&apos;s drop
            </div>
            <div className="text-[18px] font-medium">
              Hudson Falls Pottery — 14 new stoneware pieces
            </div>
          </div>
          <ArrowRight size={20} className="shrink-0 ml-4" />
        </div>

        {/* "Opening order $150" orange badge */}
        <div className="absolute top-12 right-12 w-[140px] h-[140px] bg-brand-orange text-white flex flex-col justify-center p-4 font-mono">
          <div className="text-[10px] tracking-[0.1em] opacity-85">OPENING ORDER</div>
          <div className="font-serif text-[36px] leading-none mt-1.5">$150</div>
          <div className="text-[10px] tracking-[0.06em] mt-1">FOR ALL BRANDS</div>
        </div>
      </div>
    </div>
  );
}

// ── Section B — Category Grid ────────────────────────────────────
const TONES: Array<"warm" | "orange" | "cool"> = [
  "warm", "orange", "cool", "warm", "orange", "cool", "warm", "orange",
];

function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  const topLevel = (categories ?? []).filter((c) => !("parent_id" in c && (c as { parent_id?: number }).parent_id));
  const displayed = topLevel.slice(0, 8);

  return (
    <section className="px-16 py-18" style={{ paddingTop: "4.5rem", paddingBottom: "3.5rem" }}>
      {/* Section header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-brand-muted mb-2">
            SECTION 01 · DEPARTMENTS
          </div>
          <h2 className="font-serif text-[44px] text-brand-ink font-normal tracking-tight m-0">
            Stock the entire store.
          </h2>
        </div>
        <Link
          href="/shop"
          className="font-mono text-[11px] tracking-[0.06em] uppercase text-brand-muted hover:text-brand-ink transition-colors no-underline"
        >
          VIEW ALL DEPARTMENTS →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-brand-white border border-brand-line animate-pulse">
                <div className="aspect-square bg-brand-bg-alt" />
                <div className="p-4">
                  <div className="h-4 bg-brand-bg-alt rounded w-3/4 mb-2" />
                  <div className="h-3 bg-brand-bg-alt rounded w-1/2" />
                </div>
              </div>
            ))
          : displayed.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="bg-brand-white border border-brand-line hover:border-brand-blue transition-colors no-underline group"
              >
                <div className="aspect-square relative overflow-hidden">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Placeholder label={cat.name} tone={TONES[i % TONES.length]} className="h-full" />
                  )}
                  <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.08em] bg-brand-ink text-brand-white px-1.5 py-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="px-4 py-3.5 flex justify-between items-center">
                  <div>
                    <div className="text-[15px] font-medium text-brand-ink">{cat.name}</div>
                    {cat.products_count !== undefined && (
                      <div className="font-mono text-[10px] tracking-[0.06em] text-brand-muted uppercase mt-1">
                        {cat.products_count.toLocaleString()} SKUs
                      </div>
                    )}
                  </div>
                  <ArrowRight size={16} className="text-brand-blue shrink-0" />
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}

// ── Section C — Featured Brands ──────────────────────────────────
function FeaturedBrands() {
  const { data: brands, isLoading } = useBrands();
  const displayed = (brands ?? []).slice(0, 3);

  return (
    <section className="px-16 bg-brand-bg-alt" style={{ paddingTop: "2.5rem", paddingBottom: "4.5rem" }}>
      {/* Section header */}
      <div className="pt-10 mb-8">
        <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-brand-muted mb-2">
          SECTION 02 · MAKERS
        </div>
        <div className="flex justify-between items-end">
          <h2 className="font-serif text-[44px] text-brand-ink font-normal tracking-tight m-0 max-w-[600px]">
            Brands worth introducing your customers to.
          </h2>
          <span className="font-mono text-[11px] tracking-[0.06em] text-brand-muted uppercase">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
          </span>
        </div>
      </div>

      {/* 3-column editorial grid */}
      {isLoading ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: "1.6fr 1fr 1fr" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-brand-white border border-brand-line animate-pulse">
              <div className={i === 0 ? "aspect-[16/11]" : "aspect-[4/3]"} style={{ background: "#E5DFD0" }} />
              <div className="p-6">
                <div className="h-3 bg-brand-bg rounded w-1/3 mb-3" />
                <div className="h-6 bg-brand-bg rounded w-2/3 mb-2" />
                <div className="h-3 bg-brand-bg rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "1.6fr 1fr 1fr" }}>
          {/* Spotlight — first brand */}
          {displayed[0] && (
            <Link
              href={`/brand/${displayed[0].id}`}
              className="bg-brand-white border border-brand-line hover:border-brand-blue transition-colors no-underline group block"
            >
              <div className="aspect-[16/11] relative overflow-hidden">
                {displayed[0].image ? (
                  <Image
                    src={displayed[0].image}
                    alt={displayed[0].name}
                    fill
                    sizes="(max-width: 1440px) 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Placeholder label={`${displayed[0].name} · studio`} tone="cool" className="h-full" />
                )}
                <span className="absolute top-4 left-4 bg-brand-orange text-white font-mono text-[10px] tracking-[0.08em] px-2 py-1">
                  SPOTLIGHT
                </span>
              </div>
              <div className="px-7 pt-6 pb-7">
                <div className="font-mono text-[10px] tracking-[0.08em] text-brand-muted uppercase">
                  {displayed[0].location ?? "USA"}
                </div>
                <div className="font-serif text-[32px] text-brand-ink mt-1.5 font-normal leading-tight">
                  {displayed[0].name}
                </div>
                {displayed[0].description && (
                  <p className="text-[14px] text-brand-muted leading-[1.5] mt-2.5 line-clamp-3 max-w-[480px]">
                    {displayed[0].description}
                  </p>
                )}
                <div className="flex gap-6 mt-4 font-mono text-[11px] tracking-[0.04em] text-brand-ink uppercase">
                  <span className="text-brand-blue">→ SEE PRODUCTS</span>
                  {displayed[0].products_count && (
                    <span className="text-brand-muted">{displayed[0].products_count} SKUs</span>
                  )}
                </div>
              </div>
            </Link>
          )}

          {/* Secondary brands */}
          {displayed.slice(1, 3).map((brand, i) => (
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
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Placeholder
                    label={brand.name}
                    tone={i === 0 ? "orange" : "warm"}
                    className="h-full"
                  />
                )}
              </div>
              <div className="px-5 pt-5 pb-6">
                <div className="font-mono text-[10px] tracking-[0.08em] text-brand-muted uppercase">
                  {brand.location ?? "USA"}
                </div>
                <div className="font-serif text-[24px] text-brand-ink mt-1 font-normal leading-tight">
                  {brand.name}
                </div>
                <div className="flex justify-between items-center mt-3 text-[12px] text-brand-muted">
                  {brand.products_count !== undefined && (
                    <span>{brand.products_count} SKUs</span>
                  )}
                  <ArrowRight size={16} className="text-brand-blue shrink-0" />
                </div>
              </div>
            </Link>
          ))}

          {/* Empty states if API returns fewer than 3 brands */}
          {displayed.length < 2 &&
            Array.from({ length: 2 - Math.max(0, displayed.length - 1) }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-brand-white border border-brand-line">
                <div className="aspect-[4/3]">
                  <Placeholder tone={i === 0 ? "orange" : "warm"} className="h-full" />
                </div>
              </div>
            ))}
        </div>
      )}

      {/* View all brands */}
      <div className="mt-8 text-center">
        <Link
          href="/brands"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase text-brand-muted hover:text-brand-ink transition-colors no-underline"
        >
          VIEW ALL BRANDS <ArrowRight size={12} />
        </Link>
      </div>
    </section>
  );
}

// ── Section D — Value Props ──────────────────────────────────────
const VALUE_PROPS = [
  {
    n: "I.",
    h: "Pay net-60, always.",
    b: "Order today, pay in sixty days. No interest, no factoring fees, no fine print. We carry the float so you carry the inventory.",
  },
  {
    n: "II.",
    h: "Free returns on openers.",
    b: "Didn't sell through? Send it back, full credit, on us. We'd rather buy back the box than burn the relationship.",
  },
  {
    n: "III.",
    h: "No exclusivity nonsense.",
    b: "Stock our brands wherever else you like. We don't police your floor — we just want to be on it.",
  },
];

function ValueProps() {
  return (
    <section className="px-16 py-22 bg-brand-navy text-white" style={{ paddingTop: "5.5rem", paddingBottom: "5.5rem" }}>
      <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-brand-orange mb-2">
        SECTION 03 · THE FORGE PROMISE
      </div>
      <h2 className="font-serif text-[44px] font-normal tracking-tight max-w-[720px] text-white m-0 mb-14">
        Three rules we don&apos;t bend on.
      </h2>

      <div
        className="grid mt-0"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "#1E3358",
        }}
      >
        {VALUE_PROPS.map((r) => (
          <div key={r.n} className="bg-brand-navy px-7 py-8">
            <div className="font-serif text-[56px] text-brand-orange leading-none italic">
              {r.n}
            </div>
            <div className="font-serif text-[26px] mt-4 font-normal leading-[1.15] text-white">
              {r.h}
            </div>
            <p className="text-[14px] leading-[1.6] text-[#9DAAC2] mt-3.5">{r.b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="bg-brand-bg">
      <HeroSection />
      <CategoryGrid />
      <FeaturedBrands />
      <ValueProps />
    </div>
  );
}
