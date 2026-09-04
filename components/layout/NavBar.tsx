"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCategories, type Category } from "@/hooks/useCategories";

const NAV_GROUPS = [
  { label: "Cigar", keywords: ["cigar"] },
  { label: "C-Store", keywords: ["general", "battery", "detox", "synthetic", "incense"] },
  { label: "Flower / Wax / Oil", keywords: ["flower", "wax", "oil", "cbd", "hemp"] },
  { label: "Glass", keywords: ["glass", "bong", "pipe", "ceramic"] },
  { label: "Hookah", keywords: ["hookah"] },
  { label: "Kratom", keywords: ["kratom"] },
  { label: "Vape Shop", keywords: ["vape", "disposable", "e-liquid", "nicotine", "pod"] },
  { label: "7-Hydroxymitragynine", keywords: ["hydroxy", "alkaloid"] },
  { label: "Tobacco", keywords: ["tobacco", "wrap", "leaf"] },
  { label: "Roll Your Own", keywords: ["rolling", "paper", "filter", "grinder", "cone"] },
  { label: "Torch It", keywords: ["torch", "lighter", "butane"] },
  { label: "Whip Cream", keywords: ["whip", "cream", "charger"] },
] as const;

function matches(category: Category, keywords: readonly string[]) {
  const value = `${category.name} ${category.slug}`.toLowerCase();
  return keywords.some((keyword) => value.includes(keyword));
}
function categoryItems(category: Category) {
  return category.children && category.children.length > 0 ? category.children : [category];
}

export function NavBar() {
  const { data: categories = [] } = useCategories();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const groups = useMemo(
    () =>
      NAV_GROUPS.map((group, index) => {
        const matched = categories.filter((category) => matches(category, group.keywords));
        const fallback = categories[index] ? [categories[index]] : [];
        const roots = matched.length > 0 ? matched : fallback;
        return {
          ...group,
          items: roots.flatMap(categoryItems).slice(0, 18),
          href: roots[0] ? `/category/${roots[0].id}` : "/shop",
        };
      }),
    [categories]
  );

  const activeMobileGroup = groups.find((group) => group.label === mobileSection);

  return (
    <nav className="sticky top-0 z-40 border-b-[3px] border-brand-orange bg-brand-navy text-white shadow-[0_4px_14px_rgba(11,31,58,0.18)]">
      <div className="mx-auto hidden max-w-[1600px] items-stretch justify-center xl:flex">
        {groups.map((group) => (
          <div key={group.label} className="static" onMouseEnter={() => setOpenMenu(group.label)} onMouseLeave={() => setOpenMenu(null)}>
            <button type="button" onClick={() => setOpenMenu((value) => (value === group.label ? null : group.label))} onFocus={() => setOpenMenu(group.label)} className="flex h-full items-center gap-1 border-b-2 border-transparent px-2.5 py-3 text-[10px] font-extrabold uppercase tracking-[0.02em] transition-colors hover:border-brand-orange hover:bg-brand-blue-deep" aria-expanded={openMenu === group.label}>
              {group.label}<ChevronDown size={12} />
            </button>
            {openMenu === group.label && (
              <div className="absolute left-1/2 top-full w-[min(1120px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-none border border-t-0 border-brand-blue bg-white text-brand-ink shadow-2xl">
                <div className="grid grid-cols-[1fr_220px]">
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between border-b border-brand-blue/25 pb-3">
                      <h2 className="text-sm font-black uppercase tracking-[0.12em] text-brand-blue">{group.label}</h2>
                      <Link href={group.href} onClick={() => setOpenMenu(null)} className="text-xs font-bold text-brand-blue hover:text-brand-blue-deep">View all</Link>
                    </div>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                      {group.items.length > 0 ? group.items.map((category) => (
                        <Link key={category.id} href={`/category/${category.id}`} onClick={() => setOpenMenu(null)} className="flex min-h-12 items-center gap-3 rounded-none px-2 py-2 text-sm font-medium text-brand-ink no-underline hover:bg-brand-bg-alt hover:text-brand-blue">
                          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-none border border-brand-line bg-brand-bg">
                            {category.image ? <Image src={category.image} alt="" fill sizes="36px" className="object-contain" unoptimized /> : <span className="flex h-full items-center justify-center text-xs font-black text-brand-blue">{category.name.slice(0, 1)}</span>}
                          </span>
                          <span>{category.name}</span>
                        </Link>
                      )) : <p className="col-span-3 py-8 text-sm text-brand-muted">Categories are loading…</p>}
                    </div>
                  </div>
                  <Link href={group.href} onClick={() => setOpenMenu(null)} className="flex flex-col justify-end bg-gradient-to-br from-brand-bg-alt via-white to-brand-orange-soft p-6 no-underline">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-orange">Featured</span>
                    <span className="mt-2 text-2xl font-black uppercase leading-tight text-brand-navy">{group.label}</span>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase text-brand-blue">Shop now <ChevronRight size={14} /></span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}

        <Link href="/sale" className="flex items-center border-b-2 border-transparent px-2.5 py-3 text-[10px] font-black uppercase tracking-[0.02em] text-brand-orange no-underline hover:border-brand-orange hover:bg-brand-blue-deep hover:text-white">On Sale</Link>
      </div>

      <div className="flex items-center justify-between bg-brand-navy px-4 py-3 text-white xl:hidden">
        <button type="button" onClick={() => setMobileOpen(true)} className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider" aria-label="Open category menu"><Menu size={22} /> Menu</button>
        <Link href="/sale" className="text-xs font-black uppercase tracking-wider text-brand-orange no-underline">Clearance</Link>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-brand-navy shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              {mobileSection ? (
                <button type="button" onClick={() => setMobileSection(null)} className="text-xs font-bold uppercase tracking-wider text-white/70">← Back</button>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider text-white/70">Categories</span>
              )}
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {activeMobileGroup ? (
                <>
                  <Link href={activeMobileGroup.href} onClick={() => setMobileOpen(false)} className="block border-b border-white/10 px-5 py-4 text-sm font-black uppercase text-white no-underline">Shop all {activeMobileGroup.label}</Link>
                  {activeMobileGroup.items.map((category) => (
                    <Link key={category.id} href={`/category/${category.id}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 border-b border-white/10 px-5 py-3 text-sm text-white/85 no-underline">
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-none bg-white/10">{category.image && <Image src={category.image} alt="" fill sizes="36px" className="object-contain" unoptimized />}</span>{category.name}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {groups.map((group) => <button key={group.label} type="button" onClick={() => setMobileSection(group.label)} className="flex w-full items-center justify-between border-b border-white/10 px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">{group.label}<ChevronRight size={17} className="text-white/50" /></button>)}
                  <Link href="/brands" onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-sm font-bold uppercase text-white no-underline">Shop By Brand<ChevronRight size={17} /></Link>
                  <Link href="/sale" onClick={() => setMobileOpen(false)} className="block border-b border-white/10 px-5 py-4 text-sm font-black uppercase text-red-300 no-underline">Clearance</Link>
                  <Link href="/shop" onClick={() => setMobileOpen(false)} className="block px-5 py-4 text-sm font-black uppercase text-white no-underline">Shop All</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
