"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { buildNavGroups } from "@/lib/navGroups";

/** Hover intent: a short delay before opening/switching and before closing, so a diagonal move into the open menu never flickers. */
const OPEN_DELAY = 60;
const SWITCH_DELAY = 140;
const CLOSE_DELAY = 200;
/** Keeps an open menu this far from the viewport edge. */
const EDGE = 16;

/** Up to 6 categories in one column, up to 12 in two, more in three. Columns are as wide as their longest name and filled top to bottom, so they stay balanced. */
function menuColumns(count: number) {
  return count > 12 ? 3 : count > 6 ? 2 : 1;
}

const LABEL = "flex h-full items-center gap-1 whitespace-nowrap border-b-2 px-1.5 pt-0.5 text-[13px] font-medium no-underline transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-background";

export function NavBar() {
  const { data: categories = [], isPending: categoriesLoading, isError: categoriesFailed } = useCategories();
  const { site } = useSiteConfig();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuOffset, setMenuOffset] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusFirstLink = useRef(false);
  /** A click on a label whose menu the pointer just opened keeps it open instead of toggling it shut. */
  const openedByHover = useRef(false);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);

  const groups = useMemo(() => buildNavGroups(site.nav_groups ?? [], categories), [categories, site.nav_groups]);
  const saleHref = site.sale_url || "/sale";
  // The department of the page being viewed: its own landing page or one of its categories.
  const activeGroup = groups.find((group) => group.href === pathname || group.items.some((category) => `/category/${category.id}` === pathname))?.label;
  const activeMobileGroup = groups.find((group) => group.label === mobileSection);

  const schedule = (action: () => void, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(action, delay);
  };
  const cancelTimer = () => window.clearTimeout(timer.current);
  const closeMenu = () => {
    cancelTimer();
    setOpenMenu(null);
  };
  const openNow = (label: string, byHover = false) => {
    cancelTimer();
    openedByHover.current = byHover;
    setMenuOffset(0);
    setOpenMenu(label);
  };
  const onLabelClick = (label: string) => {
    if (openMenu !== label) openNow(label);
    else if (openedByHover.current) openedByHover.current = false;
    else closeMenu();
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Under its label, but never past the viewport edge (the right-hand departments shift left as far as needed).
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!openMenu || !panel) return;
    const overflow = panel.getBoundingClientRect().right - (window.innerWidth - EDGE);
    if (overflow > 0) setMenuOffset((offset) => offset - overflow);
  }, [openMenu]);

  useEffect(() => {
    if (!openMenu) return;
    if (focusFirstLink.current) {
      focusFirstLink.current = false;
      panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    }
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!(event.target as Element).closest("[data-nav-department]")) setOpenMenu(null);
    };
    // Escape closes a menu the pointer opened too (the panel and label handle it when they have focus).
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !(document.activeElement as Element | null)?.closest("[data-nav-department]")) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openMenu]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    mobileCloseRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>, label: string) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusFirstLink.current = true;
      if (openMenu === label) panelRef.current?.querySelector<HTMLElement>("a")?.focus();
      else openNow(label);
    } else if (event.key === "Escape" && openMenu) {
      closeMenu();
    }
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>, label: string) => {
    const links = [...event.currentTarget.querySelectorAll<HTMLElement>("a")];
    const index = links.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      buttonRefs.current.get(label)?.focus();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = event.key === "ArrowDown" ? Math.min(index + 1, links.length - 1) : index - 1;
      if (next < 0) buttonRefs.current.get(label)?.focus();
      else links[next]?.focus();
    }
  };

  // Tabbing out of a department closes its menu.
  const onDepartmentBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeMenu();
  };

  return (
    // While the drawer is open the nav is lifted above the page's floating buttons (z-40), which it would otherwise sit under.
    <nav aria-label="Departments" className={`sticky top-0 ${mobileOpen ? "z-50" : "z-40"} border-b border-background/15 bg-foreground text-background shadow-sm`}>
      <div className="site-container hidden h-11 items-stretch justify-between xl:flex">
        {groups.map((group) => {
          const isOpen = openMenu === group.label;
          const isActive = activeGroup === group.label;
          const tone = isOpen ? "border-primary bg-background/10 text-background" : isActive ? "border-primary text-background" : "border-transparent text-background/80 hover:text-background";

          // A department without categories (once they have loaded) is a plain link to its page.
          if (!categoriesLoading && group.items.length === 0) {
            return <Link key={group.label} href={group.href} aria-current={isActive ? "page" : undefined} className={`${LABEL} ${tone}`}>{group.label}</Link>;
          }

          const columns = menuColumns(group.items.length);
          const panelId = `nav-menu-${group.label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
          return (
            <div
              key={group.label}
              data-nav-department=""
              className="relative"
              onMouseEnter={() => (isOpen ? cancelTimer() : schedule(() => openNow(group.label, true), openMenu ? SWITCH_DELAY : OPEN_DELAY))}
              onMouseLeave={() => schedule(() => setOpenMenu(null), CLOSE_DELAY)}
              onBlur={onDepartmentBlur}
            >
              <button
                ref={(element) => {
                  if (element) buttonRefs.current.set(group.label, element);
                  else buttonRefs.current.delete(group.label);
                }}
                type="button"
                onClick={() => onLabelClick(group.label)}
                onKeyDown={(event) => onButtonKeyDown(event, group.label)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-current={isActive ? "page" : undefined}
                className={`${LABEL} ${tone}`}
              >
                {group.label}
                {/* Chevrons only where they fit: at 1280–1399px the twelve departments need that room to stay evenly spaced. */}
                <ChevronDown size={12} aria-hidden="true" className={`hidden opacity-70 transition-transform motion-reduce:transition-none min-[1400px]:block ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div
                  ref={panelRef}
                  id={panelId}
                  onKeyDown={(event) => onPanelKeyDown(event, group.label)}
                  style={{ left: menuOffset }}
                  className="absolute top-full z-50 w-max max-w-[calc(100vw-32px)] rounded-b-md border border-t-0 border-border bg-background text-foreground shadow-lg"
                >
                  <div className="flex items-center justify-between gap-6 border-b border-border px-4 py-2">
                    <span className="text-[13px] font-semibold">{group.label}</span>
                    <Link href={group.href} onClick={closeMenu} className="inline-flex items-center gap-0.5 text-[13px] font-medium text-primary no-underline hover:underline">
                      View all<ChevronRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                  {group.items.length > 0 ? (
                    <ul
                      className="grid min-w-44 grid-flow-col gap-x-4 px-2 py-1.5"
                      style={{ gridTemplateColumns: `repeat(${columns}, max-content)`, gridTemplateRows: `repeat(${Math.ceil(group.items.length / columns)}, auto)` }}
                    >
                      {group.items.map((category) => {
                        const href = `/category/${category.id}`;
                        return (
                          <li key={category.id}>
                            <Link
                              href={href}
                              onClick={closeMenu}
                              aria-current={pathname === href ? "page" : undefined}
                              className={`block whitespace-nowrap rounded px-2.5 py-1 text-[13px] leading-5 no-underline transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary ${pathname === href ? "font-medium text-primary" : "text-foreground/85"}`}
                            >
                              {category.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="w-60 px-4 py-4 text-sm text-muted-foreground">{categoriesFailed ? "Categories could not be loaded. Use “View all” to browse." : "Categories are loading…"}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <Link href="/shop" aria-current={pathname === "/shop" ? "page" : undefined} className={`${LABEL} ${pathname === "/shop" ? "border-primary text-background" : "border-transparent text-background/80 hover:text-background"}`}>Shop</Link>
        {site.sale_label && (
          <Link href={saleHref} aria-current={pathname === saleHref ? "page" : undefined} className={`flex h-7 items-center self-center whitespace-nowrap rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background ${pathname === saleHref ? "ring-2 ring-background/60" : ""}`}>{site.sale_label}</Link>
        )}
      </div>

      <div className="site-container flex h-11 items-center justify-between bg-foreground text-background xl:hidden">
        <button type="button" onClick={() => setMobileOpen(true)} className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 text-sm font-medium" aria-label="Open category menu" aria-expanded={mobileOpen}><Menu size={20} aria-hidden="true" /> Categories</button>
        <div className="flex items-center gap-1">
          <Link href="/shop" aria-current={pathname === "/shop" ? "page" : undefined} className="inline-flex min-h-9 items-center px-3 text-sm font-medium text-background no-underline transition-colors hover:text-background/80">Shop</Link>
          {site.sale_label && <Link href={saleHref} className="inline-flex h-7 items-center rounded-md bg-primary px-3 text-[13px] font-semibold text-primary-foreground no-underline">{site.sale_label}</Link>}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label="Categories">
          <button type="button" tabIndex={-1} className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-foreground text-background shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-background/15 px-5">
              {mobileSection ? (
                <button type="button" onClick={() => setMobileSection(null)} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-background/80 hover:text-background"><ChevronRight size={16} aria-hidden="true" className="rotate-180" /> All categories</button>
              ) : (
                <span className="text-sm font-semibold">Categories</span>
              )}
              <button ref={mobileCloseRef} type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center -mr-3"><X size={22} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeMobileGroup ? (
                <>
                  <Link href={activeMobileGroup.href} onClick={() => setMobileOpen(false)} className="block border-b border-background/15 px-5 py-3.5 text-[15px] font-semibold text-background no-underline">Shop all {activeMobileGroup.label}</Link>
                  {activeMobileGroup.items.map((category) => (
                    <Link key={category.id} href={`/category/${category.id}`} onClick={() => setMobileOpen(false)} aria-current={pathname === `/category/${category.id}` ? "page" : undefined} className={`block border-b border-background/10 px-5 py-3 text-[15px] no-underline transition-colors hover:bg-background/10 ${pathname === `/category/${category.id}` ? "text-blue-400" : "text-background/85"}`}>
                      {category.name}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {groups.map((group) => group.items.length > 0 || categoriesLoading ? (
                    <button key={group.label} type="button" onClick={() => setMobileSection(group.label)} className={`flex w-full items-center justify-between border-b border-background/10 px-5 py-3.5 text-left text-[15px] font-medium transition-colors hover:bg-background/10 ${activeGroup === group.label ? "text-blue-400" : ""}`}>{group.label}<ChevronRight size={17} aria-hidden="true" className="text-background/50" /></button>
                  ) : (
                    <Link key={group.label} href={group.href} onClick={() => setMobileOpen(false)} className="block border-b border-background/10 px-5 py-3.5 text-[15px] font-medium text-background no-underline transition-colors hover:bg-background/10">{group.label}</Link>
                  ))}
                  <Link href="/brands" onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-background/10 px-5 py-3.5 text-[15px] font-medium text-background no-underline transition-colors hover:bg-background/10">Shop by Brand<ChevronRight size={17} aria-hidden="true" className="text-background/50" /></Link>
                  {site.sale_label && <Link href={saleHref} onClick={() => setMobileOpen(false)} className="block border-b border-background/10 px-5 py-3.5 text-[15px] font-semibold text-blue-400 no-underline transition-colors hover:bg-background/10">{site.sale_label}</Link>}
                  <Link href="/shop" onClick={() => setMobileOpen(false)} className="block px-5 py-3.5 text-[15px] font-medium text-background no-underline transition-colors hover:bg-background/10">Shop all products</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
