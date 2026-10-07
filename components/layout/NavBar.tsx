"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCategories, type Category } from "@/hooks/useCategories";
import { useSiteConfig } from "@/context/SiteConfigContext";

function matches(category: Category, keywords: readonly string[]) {
  const value = `${category.name} ${category.slug}`.toLowerCase();
  return keywords.some((keyword) => value.includes(keyword));
}
function categoryItems(category: Category) {
  return category.children && category.children.length > 0 ? category.children : [category];
}

export function NavBar() {
  const { data: categories = [] } = useCategories();
  const { site } = useSiteConfig();
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
      (site.nav_groups ?? []).map((group, index) => {
        const matched = categories.filter((category) => matches(category, group.keywords));
        const fallback = categories[index] ? [categories[index]] : [];
        const roots = matched.length > 0 ? matched : fallback;
        return {
          ...group,
          items: roots.flatMap(categoryItems).slice(0, 18),
          href: group.url || (roots[0] ? `/category/${roots[0].id}` : "/shop"),
        };
      }),
    [categories, site.nav_groups]
  );

  const activeMobileGroup = groups.find((group) => group.label === mobileSection);

  return (
    <nav className="sticky top-0 z-40 border-b border-background/15 bg-foreground text-background shadow-sm">
      <div className="mx-auto hidden max-w-[1600px] items-stretch justify-center xl:flex">
        {groups.map((group) => (
          <div key={group.label} className="static" onMouseEnter={() => setOpenMenu(group.label)} onMouseLeave={() => setOpenMenu(null)}>
            <button type="button" onClick={() => setOpenMenu((value) => (value === group.label ? null : group.label))} onFocus={() => setOpenMenu(group.label)} className="flex h-full items-center gap-1 border-b-2 border-transparent px-2.5 py-3 text-[10px] font-semibold uppercase tracking-[0.04em] transition-colors hover:border-primary hover:bg-background/10" aria-expanded={openMenu === group.label}>
              {group.label}<ChevronDown size={12} />
            </button>
            {openMenu === group.label && (
              <div className="absolute left-1/2 top-full w-[min(1120px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-b-lg border border-t-0 border-border bg-popover text-popover-foreground shadow-lg">
                <div className="grid grid-cols-[1fr_220px]">
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                      <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.1em] text-foreground">{group.label}</h2>
                      <Link href={group.href} onClick={() => setOpenMenu(null)} className="text-xs font-semibold text-primary transition-colors hover:text-primary/80">View all</Link>
                    </div>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                      {group.items.length > 0 ? group.items.map((category) => (
                        <Link key={category.id} href={`/category/${category.id}`} onClick={() => setOpenMenu(null)} className="flex min-h-12 items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-foreground no-underline transition-colors hover:bg-accent hover:text-accent-foreground">
                          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                            {category.image ? <Image src={category.image} alt="" fill sizes="36px" className="object-contain" /> : <span className="flex h-full items-center justify-center text-xs font-semibold text-primary">{category.name.slice(0, 1)}</span>}
                          </span>
                          <span>{category.name}</span>
                        </Link>
                      )) : <p className="col-span-3 py-8 text-sm text-muted-foreground">Categories are loading…</p>}
                    </div>
                  </div>
                  <Link href={group.href} onClick={() => setOpenMenu(null)} className="flex flex-col justify-end border-l border-border bg-muted p-6 no-underline transition-colors hover:bg-accent">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Featured</span>
                    <span className="mt-2 font-heading text-2xl font-semibold uppercase leading-tight text-foreground">{group.label}</span>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase text-primary">Shop now <ChevronRight size={14} /></span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}

        {site.sale_label && <Link href={site.sale_url || "/sale"} className="my-1.5 flex items-center rounded-md bg-primary px-3 text-[10px] font-semibold uppercase tracking-[0.04em] text-primary-foreground no-underline transition-colors hover:bg-primary/90">{site.sale_label}</Link>}
      </div>

      <div className="flex items-center justify-between bg-foreground px-4 py-0.5 text-background xl:hidden">
        <button type="button" onClick={() => setMobileOpen(true)} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-wider" aria-label="Open category menu"><Menu size={22} /> Menu</button>
        {site.sale_label && <Link href={site.sale_url || "/sale"} className="inline-flex min-h-9 items-center rounded-md bg-primary px-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground no-underline">{site.sale_label}</Link>}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-foreground text-background shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-background/15 px-5">
              {mobileSection ? (
                <button type="button" onClick={() => setMobileSection(null)} className="text-xs font-semibold uppercase tracking-wider text-background/70">← Back</button>
              ) : (
                <span className="text-xs font-semibold uppercase tracking-wider text-background/70">Categories</span>
              )}
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {activeMobileGroup ? (
                <>
                  <Link href={activeMobileGroup.href} onClick={() => setMobileOpen(false)} className="block border-b border-background/15 px-5 py-4 text-sm font-semibold uppercase text-background no-underline">Shop all {activeMobileGroup.label}</Link>
                  {activeMobileGroup.items.map((category) => (
                    <Link key={category.id} href={`/category/${category.id}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 border-b border-background/15 px-5 py-3 text-sm text-background/85 no-underline transition-colors hover:bg-background/10">
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-background/10">{category.image && <Image src={category.image} alt="" fill sizes="36px" className="object-contain" />}</span>{category.name}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {groups.map((group) => <button key={group.label} type="button" onClick={() => setMobileSection(group.label)} className="flex w-full items-center justify-between border-b border-background/15 px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-background/10">{group.label}<ChevronRight size={17} className="text-background/50" /></button>)}
                  <Link href="/brands" onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-background/15 px-5 py-4 text-sm font-semibold uppercase text-background no-underline transition-colors hover:bg-background/10">Shop By Brand<ChevronRight size={17} /></Link>
                  {site.sale_label && <Link href={site.sale_url || "/sale"} onClick={() => setMobileOpen(false)} className="block border-b border-background/15 px-5 py-4 text-sm font-semibold uppercase text-blue-400 no-underline transition-colors hover:bg-background/10">{site.sale_label}</Link>}
                  <Link href="/shop" onClick={() => setMobileOpen(false)} className="block px-5 py-4 text-sm font-semibold uppercase text-background no-underline transition-colors hover:bg-background/10">Shop All</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
