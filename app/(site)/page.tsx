"use client";
/* eslint-disable @next/next/no-img-element -- managed image URLs are runtime values and include responsive picture sources */

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Lock, Package, Send, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useProducts, type Product } from "@/hooks/useProducts";
import { imageVariant } from "@/lib/imageVariants";
import { useSiteConfig, type HomepageItem, type HomepageSection } from "@/context/SiteConfigContext";
import { MobileAppButton } from "@/components/layout/AppDownload";
import { BackToTop } from "@/components/layout/BackToTop";
import api from "@/lib/axios";
import { productRowBadge } from "@/lib/homepage";
import { subscribeToNewsletter, type NewsletterResult } from "@/lib/newsletter";

type ImageItem = HomepageItem & { desktop_image_url: string };
/** Items without an image (the API sends null) cannot be drawn and are skipped. */
const hasImage = (item: HomepageItem): item is ImageItem => typeof item.desktop_image_url === "string" && item.desktop_image_url !== "";

const CatalogFlipbook = dynamic(() => import("@/components/catalog/Catalog3DFlipbook"), { ssr: false });

/** Round prev/next control shared by the hero, category and product carousels. */
const ARROW_CLASS = "grid h-11 w-11 place-items-center rounded-full border border-border bg-card/95 text-foreground shadow-md transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-primary";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** True when the visitor asked for reduced motion (and during server rendering, so nothing auto-advances before hydration). */
function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
}

function ResponsiveManagedImage({
  desktopSrc,
  mobileSrc,
  alt,
  width,
  height,
  sizes,
  loading = "lazy",
  fetchPriority = "auto",
  className,
}: {
  desktopSrc: string;
  mobileSrc?: string | null;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  className: string;
}) {
  const common = { alt, width, height, sizes, loading, fetchPriority };
  const { props: desktopProps } = getImageProps({ ...common, src: desktopSrc });

  if (!mobileSrc) return <img {...desktopProps} alt={alt} className={className} />;

  const { props: { srcSet: mobileSrcSet } } = getImageProps({ ...common, src: mobileSrc });
  return (
    <picture>
      <source media="(max-width: 640px)" srcSet={mobileSrcSet} sizes={sizes} />
      <img {...desktopProps} alt={alt} className={className} />
    </picture>
  );
}

function subscribeWindowLoad(onChange: () => void) {
  window.addEventListener("load", onChange);
  return () => window.removeEventListener("load", onChange);
}

function HeroCarousel({ section }: { section: HomepageSection }) {
  const slides = section.items.filter(hasImage).filter((item) => item.kind === "slide");
  const carouselSlides = slides.map((item) => ({ image: item.desktop_image_url, mobileImage: item.mobile_image_url, alt: item.alt_text, href: item.link_url }));
  // Without dedicated mobile art, keep the banner's own ratio so its text isn't cropped off on phones.
  const hasMobileArt = carouselSlides.length > 0 && carouselSlides.every((slide) => slide.mobileImage);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    if (carouselSlides.length < 2 || paused || reducedMotion) return;
    const interval = typeof section.settings.interval_ms === "number" ? section.settings.interval_ms : 5000;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % carouselSlides.length), interval);
    return () => window.clearInterval(timer);
  }, [carouselSlides.length, paused, reducedMotion, section.settings.interval_ms]);
  const move = (direction: number) => setActive((value) => (value + direction + carouselSlides.length) % carouselSlides.length);

  const pageLoaded = useSyncExternalStore(subscribeWindowLoad, () => document.readyState === "complete", () => false);

  if (carouselSlides.length === 0) return null;
  // Only the visible slide and its neighbours are mounted (so the next/previous fade has no blank frame);
  // the neighbours wait for the page load so they don't compete with the first slide (the LCP image).
  const mountedIndexes = new Set(pageLoaded ? [
    active,
    (active - 1 + carouselSlides.length) % carouselSlides.length,
    (active + 1) % carouselSlides.length,
  ] : [active]);
  const many = carouselSlides.length > 8;
  return (
    <section className="relative overflow-hidden border-b border-brand-line bg-muted" aria-roledescription="carousel" aria-label="Featured promotions">
      <div
        className={`relative aspect-[1920/622] w-full ${hasMobileArt ? "min-h-[210px] sm:min-h-0" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {carouselSlides.map((slide, index) => {
          if (!mountedIndexes.has(index)) return null;
          const image = (
            <ResponsiveManagedImage
              desktopSrc={slide.image}
              mobileSrc={slide.mobileImage}
              alt={slide.alt}
              width={1920}
              height={622}
              sizes="100vw"
              loading={index === active ? "eager" : "lazy"}
              fetchPriority={index === active ? "high" : "low"}
              className="absolute inset-0 h-full w-full object-cover"
            />
          );
          const className = `absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${active === index ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`;
          return slide.href
            ? <Link key={slide.image} href={slide.href} aria-hidden={active !== index} tabIndex={active === index ? undefined : -1} className={className}>{image}</Link>
            : <div key={slide.image} aria-hidden={active !== index} className={className}>{image}</div>;
        })}
        {carouselSlides.length > 1 && (
          <>
            <button type="button" onClick={() => move(-1)} aria-label="Previous promotion" className={`${ARROW_CLASS} absolute left-2 top-1/2 z-20 h-9! w-9! -translate-y-1/2 sm:left-4 sm:h-11! sm:w-11!`}><ChevronLeft size={22} /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next promotion" className={`${ARROW_CLASS} absolute right-2 top-1/2 z-20 h-9! w-9! -translate-y-1/2 sm:right-4 sm:h-11! sm:w-11!`}><ChevronRight size={22} /></button>
            {!many && (
              <div className="absolute inset-x-0 bottom-1 z-20 flex justify-center sm:bottom-3">
                {carouselSlides.map((slide, index) => (
                  <button key={slide.image} type="button" onClick={() => setActive(index)} aria-label={`Show promotion ${index + 1}`} aria-current={index === active ? "true" : undefined} className="grid min-h-6 min-w-6 place-items-center">
                    <span className={`block h-1.5 rounded-full shadow transition-all ${index === active ? "w-6 bg-white" : "w-1.5 bg-white/60"}`} />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/**
 * Section title. The managed heading art is a 32:1 strip with the title centred in ~30% of its width; a fixed height per
 * breakpoint keeps that title inside the viewport (32px tall = ~310px of title, which fits a 360px phone) while
 * object-cover crops only the decorative ends. Without art, plain text.
 */
function SectionHeading({ id, image, title }: { id: string; image?: string | null; title: string }) {
  // Without art: a quiet typographic header (accent bar, title, hairline), so a section never needs a decorative banner.
  if (!image) {
    return (
      <div className="site-container mb-3 mt-5 flex items-center gap-3 sm:mt-6">
        <span aria-hidden="true" className="h-6 w-1 shrink-0 rounded-full bg-primary" />
        <h2 id={id} className="shrink-0 text-lg font-bold uppercase tracking-tight text-foreground md:text-xl">{title}</h2>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
    );
  }
  // Full-width strip as on the original homepage; from lg the art is drawn wider than the box (133vw) so it fills 24:1.
  return (
    <div className="relative mb-3 mt-5 h-8 w-full overflow-hidden bg-muted sm:mt-6 sm:h-12 md:h-14 lg:aspect-[24/1] lg:h-auto">
      <Image src={image} alt="" fill sizes="(max-width: 1023px) 1920px, 134vw" loading="lazy" className="object-cover" />
      <h2 id={id} className="sr-only">{title}</h2>
    </div>
  );
}

/** Text link from a homepage block to the full listing it samples. */
function AllLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={`group inline-flex min-h-8 items-center gap-1 text-[13px] font-semibold text-primary no-underline transition-colors hover:text-primary/80 ${className}`}>{children}<ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" /></Link>;
}

/** A homepage block: its heading strip across the full width, then its content in the shared container. */
function HomeSection({ id, headingImage, title, children }: { id: string; headingImage?: string | null; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="pb-4">
      <SectionHeading id={id} image={headingImage} title={title} />
      <div className="site-container">{children}</div>
    </section>
  );
}

function CategoryGrid({ section }: { section: HomepageSection }) {
  const headingId = `home-section-${section.id}`;
  const headingImage = section.items.find((item) => item.kind === "heading")?.desktop_image_url;
  const categories = section.items.filter(hasImage).filter((item) => item.kind === "content").map((item) => ({ key: String(item.id), name: item.title || item.alt_text, alt: item.alt_text, image: item.desktop_image_url, href: item.link_url }));
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const scrollToPhysicalIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    const card = track?.children.item(index) as HTMLElement | null;
    if (!track || !card) return;
    // Align to the card's start (matches snap-start) so no half-cut card shows on narrow screens.
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior });
  }, []);
  const goToCategory = useCallback((index: number) => {
    if (!categories.length) return;
    scrollToPhysicalIndex(index);
    setActive(index);
  }, [categories.length, scrollToPhysicalIndex]);
  const move = useCallback((direction: number) => {
    if (!categories.length) return;
    setActive((current) => {
      const next = (current + direction + categories.length) % categories.length;
      scrollToPhysicalIndex(next);
      return next;
    });
  }, [categories.length, scrollToPhysicalIndex]);
  // Autoplay pauses while the pointer or keyboard focus is inside the carousel, and is off for reduced motion.
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (categories.length <= 7 || paused || reducedMotion) return;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [categories.length, move, paused, reducedMotion]);
  if (!categories.length) return null;
  const hasCarousel = categories.length > 7;
  return (
    <HomeSection id={headingId} headingImage={headingImage} title={section.title}>
      <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        {hasCarousel && (
          <>
            <button type="button" onClick={() => move(-1)} aria-label="Previous categories" className={`${ARROW_CLASS} absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 md:grid xl:-left-5`}><ChevronLeft size={22} /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next categories" className={`${ARROW_CLASS} absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:grid xl:-right-5`}><ChevronRight size={22} /></button>
          </>
        )}
        <div ref={trackRef} className="category-track flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth py-1 motion-reduce:scroll-auto">
          {categories.map((category) => {
            const image = <div className="relative aspect-square overflow-hidden rounded-md bg-muted"><Image src={category.image} alt={category.alt} fill sizes="(max-width: 767px) 50vw, (max-width: 1023px) 25vw, (max-width: 1279px) 20vw, 200px" className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none" /></div>;
            const className = "group w-[calc((100%-12px)/2)] shrink-0 snap-start rounded-lg border border-border bg-card p-2 no-underline shadow-sm transition hover:border-primary/40 hover:shadow-md sm:w-[calc((100%-24px)/3)] md:w-[calc((100%-36px)/4)] lg:w-[calc((100%-60px)/6)] xl:w-[calc((100%-72px)/7)]";
            return category.href
              ? <Link key={category.key} href={category.href} aria-label={category.name || undefined} className={className}>{image}</Link>
              : <div key={category.key} className={className}>{image}</div>;
          })}
        </div>
      </div>
      <div className="relative mt-2 flex min-h-6 flex-col items-center gap-1 md:block">
        {hasCarousel && (
          <div className="flex flex-wrap justify-center">
            {categories.map((category, index) => (
              <button key={category.key} type="button" onClick={() => goToCategory(index)} aria-label={`Show category ${index + 1}`} aria-current={index === active ? "true" : undefined} className="group grid min-h-6 min-w-6 place-items-center px-0.5">
                {/* small dot, 24px tap area */}
                <span className={`block h-1.5 rounded-full transition-all group-hover:bg-primary ${index === active ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
              </button>
            ))}
          </div>
        )}
        <AllLink href="/shop" className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">Shop all products</AllLink>
      </div>
    </HomeSection>
  );
}

/** Admin-managed promotional strip (956:170 art), drawn the same way wherever it appears on the page. */
function PromoBanner({ item }: { item: ImageItem }) {
  const image = <ResponsiveManagedImage desktopSrc={item.desktop_image_url} mobileSrc={item.mobile_image_url} alt={item.alt_text} width={956} height={170} sizes="(max-width: 767px) 100vw, 700px" className="block h-full w-full object-cover" />;
  return (
    <div className="relative aspect-[956/170] w-full overflow-hidden rounded-lg border border-border bg-muted shadow-sm transition hover:shadow-md">
      {item.link_url ? <Link href={item.link_url} aria-label={item.alt_text} className="block h-full w-full">{image}</Link> : image}
    </div>
  );
}

function PromoGrid({ items }: { items: ImageItem[] }) {
  if (items.length === 0) return null;
  return <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">{items.map((item) => <PromoBanner key={item.id} item={item} />)}</div>;
}

function ManagedBanners({ section }: { section: HomepageSection }) {
  const banners = section.items.filter(hasImage).filter((item) => item.kind !== "heading");
  if (banners.length === 0) return null;
  return <section aria-label={section.title || "Promotions"} className="py-4"><div className="site-container"><PromoGrid items={banners} /></div></section>;
}

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

/**
 * Product photo, or a neutral "no image" panel when the catalogue has none or the file cannot be loaded. A failed load is
 * retried once after a pause: the ERP image host is slow when cold, and the optimizer's first fetch can time out.
 */
function ProductImage({ src }: { src: string | null }) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const retryTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(retryTimer.current), []);
  function handleError() {
    if (attempt === 0) retryTimer.current = window.setTimeout(() => setAttempt(1), 2500);
    else setFailed(true);
  }
  if (!src || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/60 text-muted-foreground">
        <Package size={30} strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[11px] font-medium">Image not available</span>
      </div>
    );
  }
  return <Image key={attempt} src={src} alt="" fill sizes="(max-width: 639px) 45vw, (max-width: 767px) 32vw, (max-width: 1023px) 24vw, (max-width: 1279px) 19vw, 230px" onError={handleError} className="object-contain p-3 transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" />;
}

function ProductCard({ product, badge }: { product: Product; badge?: string }) {
  const { isAuthenticated, isApproved } = useAuth();
  const { addItem } = useCart();
  const image = product.image ?? product.images?.find((item) => item.is_primary)?.url;
  const imageSrc = image ? imageVariant(image, product.image ? product.image_variants : null, 512) ?? null : null;
  const price = product.current_price ?? product.sale_price ?? product.regular_price;
  const canShowPrice = isAuthenticated && isApproved && product.prices_visible && price !== null;
  const canAdd = canShowPrice && price > 0 && product.type === "simple" && product.in_stock;
  const href = `/product/${product.id}`;
  const label = product.brand?.name ?? product.category?.name;
  function addToCart() {
    if (!canAdd || price === null) return;
    addItem({ product_id: product.id, name: product.name, sku: product.sku, image: image ?? null, price, parent_id: product.parent_id }, 1);
  }
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:border-primary/40 hover:shadow-md">
      {/* The name link below carries the accessible name; the photo is a second, mouse-only way in. */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[5/4] border-b border-border bg-white">
        <ProductImage key={imageSrc ?? "none"} src={imageSrc} />
      </Link>
      {(badge || !product.in_stock) && (
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1">
          {badge && <span className="rounded-sm bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">{badge}</span>}
          {!product.in_stock && <span className="rounded-sm bg-foreground/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-background shadow-sm">Out of Stock</span>}
        </div>
      )}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        {label && <p className="truncate text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">{label}</p>}
        <h3 className="mt-1 text-[13px] font-semibold leading-[1.35] text-foreground sm:text-sm">
          <Link href={href} title={product.name} className="line-clamp-3 min-h-[4.05em] no-underline transition-colors hover:text-primary">{product.name}</Link>
        </h3>
        {isAuthenticated && isApproved && product.sku && <p className="mt-1.5 truncate text-[11px] tabular-nums text-muted-foreground">SKU {product.sku}</p>}
        <div className="mt-auto pt-2.5">
          {!isAuthenticated ? (
            <>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><Lock size={11} aria-hidden="true" />Login to see prices</p>
              {/* Soft until hovered: a row of 7 solid buttons would outweigh the products themselves. */}
              <Link href="/login" className="mt-1.5 inline-flex min-h-10 w-full items-center justify-center rounded-md border border-primary/25 bg-primary/[0.07] px-3 text-[13px] font-semibold text-primary no-underline transition hover:border-primary hover:bg-primary hover:text-primary-foreground">Login to Buy</Link>
            </>
          ) : !canShowPrice ? (
            <p className="rounded-md bg-muted px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Pending Price Approval</p>
          ) : (
            <div className="flex items-end justify-between gap-2">
              <span className="flex min-w-0 flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">Wholesale</span>
                <span className="mt-0.5 truncate text-lg font-semibold leading-tight tabular-nums text-foreground">{money(price)}</span>
              </span>
              {canAdd
                ? <button type="button" onClick={addToCart} aria-label={`Add ${product.name} to cart`} className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90"><ShoppingCart size={19} /></button>
                : <Link href={href} aria-label={`View ${product.name}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground no-underline transition hover:bg-primary hover:text-primary-foreground"><ArrowRight size={19} /></Link>}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

type ProductsStatus = "loading" | "error" | "ready";

/**
 * Phones and tablets: one swipeable row (about 2 / 3 / 4 cards in view). From lg: the original multi-row grid, 5 columns
 * and 7 from xl (a 14-product row is two full lines), so desktop shows every product without sideways scrolling.
 */
const ROW_TRACK = "scroll-track grid snap-x snap-mandatory grid-flow-col auto-cols-[44%] gap-3 overflow-x-auto overscroll-x-contain scroll-smooth motion-reduce:scroll-auto sm:auto-cols-[calc((100%-1.5rem)/3)] md:auto-cols-[calc((100%-2.25rem)/4)] lg:snap-none lg:grid-flow-row lg:grid-cols-5 lg:overflow-x-visible xl:grid-cols-7";

function ProductSection({ section, products, status, expected, onRetry }: { section: HomepageSection; products: Product[]; status: ProductsStatus; expected: number; onRetry: () => void }) {
  const headingId = `home-section-${section.id}`;
  const art = section.items.find((item) => item.kind === "heading")?.desktop_image_url;
  const promos = section.items.filter(hasImage).filter((item) => item.kind === "content");
  const badge = productRowBadge(section) ?? undefined;
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  }, []);
  // The observer also fires once on observe, which sets the initial arrow state.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateEdges, status, products.length]);
  const page = (direction: number) => trackRef.current?.scrollBy({ left: direction * trackRef.current.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
  const notice = "flex min-h-32 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground";
  return (
    <HomeSection id={headingId} headingImage={art} title={section.title}>
      {status === "error" ? (
        <div role="alert" className={notice}><span>These products could not be loaded.</span><button type="button" onClick={onRetry} className="min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">Try again</button></div>
      ) : status === "ready" && products.length === 0 ? (
        <p className={notice}>No products to show here right now.</p>
      ) : (
        <div className="relative">
          {/* Only while the row actually scrolls (below lg); the desktop grid has nothing to page through. */}
          {!atStart && <button type="button" onClick={() => page(-1)} aria-label={`Previous ${section.title} products`} className={`${ARROW_CLASS} absolute -left-3 top-[30%] z-10 hidden -translate-y-1/2 md:grid lg:hidden`}><ChevronLeft size={22} /></button>}
          {!atEnd && <button type="button" onClick={() => page(1)} aria-label={`More ${section.title} products`} className={`${ARROW_CLASS} absolute -right-3 top-[30%] z-10 hidden -translate-y-1/2 md:grid lg:hidden`}><ChevronRight size={22} /></button>}
          <ul ref={trackRef} onScroll={updateEdges} data-scroll-track className={ROW_TRACK}>
            {status === "ready" && products.map((product) => <li key={`${section.id}-${product.id}`} className="snap-start"><ProductCard product={product} badge={badge} /></li>)}
            {/* Card-sized placeholders while the products load, so the sections below don't jump. */}
            {status === "loading" && Array.from({ length: expected }, (_, index) => <li key={index} aria-hidden="true" className="aspect-[5/8] animate-pulse rounded-lg border border-border bg-muted" />)}
          </ul>
        </div>
      )}
      {promos.length > 0 && <div className="mt-4"><PromoGrid items={promos} /></div>}
    </HomeSection>
  );
}

function BrandStrip({ section }: { section: HomepageSection }) {
  const headingId = `home-section-${section.id}`;
  const headingImage = section.items.find((item) => item.kind === "heading")?.desktop_image_url;
  const brandImages = section.items.filter(hasImage).filter((item) => item.kind === "brand");
  if (brandImages.length === 0) return null;
  const tile = "flex h-16 items-center justify-center rounded-lg border border-border bg-card p-2.5 sm:h-20 sm:p-3 lg:h-24";
  return (
    <HomeSection id={headingId} headingImage={headingImage} title={section.title}>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7">
        {brandImages.map((item) => {
          const logo = <span className="relative block h-full w-full"><Image src={item.desktop_image_url} alt={item.alt_text} fill sizes="(max-width: 639px) 33vw, (max-width: 1023px) 25vw, 190px" className="object-contain" /></span>;
          return (
            <li key={item.id}>
              {item.link_url
                ? <Link href={item.link_url} className={`${tile} no-underline transition hover:border-primary/40 hover:shadow-sm`}>{logo}</Link>
                : <div className={tile}>{logo}</div>}
            </li>
          );
        })}
      </ul>
      <div className="mt-2 flex justify-center md:justify-end"><AllLink href="/brands">View all brands</AllLink></div>
    </HomeSection>
  );
}

/** CSS background for a small repeated tile, served by the image optimizer at 1x/2x instead of the full-size original. */
function tileBackground(src: string, size: number) {
  const { props } = getImageProps({ src, alt: "", width: size, height: size });
  const quote = (url: string) => `url("${url.replace(/["\\]/g, "")}")`;
  const candidates = (props.srcSet ?? "").split(", ").filter(Boolean).map((entry) => {
    const [url, density] = entry.split(" ");
    return `${quote(url)} ${density}`;
  });
  return candidates.length ? `image-set(${candidates.join(", ")})` : quote(props.src);
}

function CatalogSection({ section, backgroundImage }: { section: HomepageSection; backgroundImage?: string | null }) {
  const catalogs = section.items.filter(hasImage).filter((item) => item.kind === "catalog" && item.pdf_url);
  const phrases = useMemo(() => Array.isArray(section.settings.heading_phrases) ? section.settings.heading_phrases.filter((value): value is string => typeof value === "string" && value.trim().length > 0) : [], [section.settings.heading_phrases]);
  const [wordIndex, setWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [openCatalog, setOpenCatalog] = useState<HomepageItem | null>(null);

  useEffect(() => {
    if (phrases.length === 0) return;
    const word = phrases[wordIndex % phrases.length];
    const isComplete = typedText === word;
    const isEmpty = typedText.length === 0;
    const delay = isComplete && !isDeleting ? 1800 : isDeleting ? 45 : 95;
    const timer = window.setTimeout(() => {
      if (isComplete && !isDeleting) setIsDeleting(true);
      else if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setWordIndex((index) => (index + 1) % phrases.length);
      } else setTypedText(word.slice(0, typedText.length + (isDeleting ? -1 : 1)));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [isDeleting, phrases, typedText, wordIndex]);

  if (catalogs.length === 0) return null;
  return (
    <section className="py-4 lg:py-6">
      <div className="site-container">
      <div className="relative isolate overflow-hidden rounded-xl border border-border bg-brand-navy px-5 py-10 shadow-lg md:px-8 md:py-14 lg:px-12 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-chart-2" />
        {backgroundImage && <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055]" style={{ backgroundImage: tileBackground(backgroundImage, 220), backgroundPosition: "center", backgroundRepeat: "repeat", backgroundSize: "220px 220px" }} />}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand-blue-deep/25 via-transparent to-black/25" />
        <div className="mx-auto grid grid-cols-2 items-center gap-x-4 gap-y-8 sm:gap-x-8 lg:grid-cols-3 lg:gap-10 xl:gap-16">
        <div className="@container col-span-2 max-w-xl text-white lg:col-span-1 lg:pr-4">
          {typeof section.settings.eyebrow === "string" && section.settings.eyebrow && <span className="mb-4 inline-block border-l-4 border-chart-2 pl-3 text-xs font-bold tracking-[0.12em] text-chart-2">{section.settings.eyebrow}</span>}
          {/* Every phrase is laid out invisibly in the same grid cell as the typed text, so the heading has its final size
              from the first render and typing never re-wraps it; the inline caret stays attached to the text. */}
          <h2 className="catalog-heading grid min-h-16 items-center text-3xl font-bold tracking-tight sm:text-4xl" style={{ "--heading-chars": Math.max(section.title.length, ...phrases.map((phrase) => phrase.length)) } as CSSProperties}>
            {phrases.length > 0 ? (
              <>
                {phrases.map((phrase) => <span key={phrase} aria-hidden="true" className="invisible col-start-1 row-start-1"><span className="typing-cursor" style={{ animation: "none" }}>{phrase}</span></span>)}
                <span className="col-start-1 row-start-1"><span className="sr-only">{section.title || phrases[0]}</span><span aria-hidden="true" className="typing-cursor">{typedText}</span></span>
              </>
            ) : <span><span className="typing-cursor">{section.title}</span></span>}
          </h2>
          {typeof section.settings.description === "string" && section.settings.description && <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 md:text-base">{section.settings.description}</p>}
          <div aria-hidden="true" className="mt-7 h-px w-24 bg-chart-2" />
        </div>
        {catalogs.map((catalog) => (
          <button key={catalog.id} type="button" onClick={() => setOpenCatalog(catalog)} aria-label={`View catalog: ${catalog.title || catalog.alt_text}`} className="catalog-book group mx-auto block w-full max-w-[350px] text-left focus-visible:outline-2 focus-visible:outline-chart-2">
            <div className="catalog-book-body relative aspect-[210/297]">
              <div aria-hidden="true" className="catalog-book-pages" />
              <div className="catalog-book-cover">
                <Image src={catalog.desktop_image_url} alt={catalog.alt_text} fill sizes="(max-width: 1023px) 50vw, 350px" className="object-cover" />
                <span className="catalog-book-title absolute inset-x-0 bottom-0 bg-white/95 px-3 py-2 text-center text-[11px] font-medium text-brand-navy">{catalog.title || catalog.alt_text}</span>
              </div>
              <span aria-hidden="true" className="catalog-book-spine" />
            </div>
          </button>
        ))}
        </div>
      </div>
      </div>
      {openCatalog?.pdf_url && <CatalogFlipbook file={openCatalog.pdf_url} title={openCatalog.title || openCatalog.alt_text} onClose={() => setOpenCatalog(null)} />}
    </section>
  );
}

function NewsletterSection({ title, placeholder, buttonText }: { title?: string; placeholder?: string; buttonText?: string }) {
  const [status, setStatus] = useState<{ sending: boolean; result: NewsletterResult | null }>({ sending: false, result: null });
  if (!title) return null;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus({ sending: true, result: null });
    const result = await subscribeToNewsletter((path, body) => api.post(path, body), String(form.get("email") ?? ""), String(form.get("website") ?? ""));
    setStatus({ sending: false, result });
    if (result.ok) (event.target as HTMLFormElement).reset();
  }
  return (
    <section aria-labelledby="newsletter-heading" className="mt-4 border-y border-border bg-muted py-5">
      <div className="site-container">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-10">
          <div className="flex shrink-0 items-center gap-3 text-foreground">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Send size={19} strokeWidth={2} aria-hidden="true" /></span>
            <h2 id="newsletter-heading" className="text-base font-bold md:text-lg">{title}</h2>
          </div>
          <div className="w-full max-w-2xl">
            <form className="relative flex min-h-12 w-full overflow-hidden rounded-lg border border-input bg-card shadow-sm transition focus-within:border-primary focus-within:ring-3 focus-within:ring-ring/30" onSubmit={submit}>
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input id="newsletter-email" name="email" type="email" required maxLength={255} autoComplete="email" placeholder={placeholder} className="min-w-0 flex-1 bg-card px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground sm:px-5" />
              {/* Honeypot: hidden from people, often filled in by bots. */}
              <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-0 top-0 h-px w-px opacity-0" />
              <button type="submit" disabled={status.sending} className="shrink-0 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-70 sm:min-w-32 sm:px-7">{buttonText}</button>
            </form>
            <p role="status" aria-live="polite" className={`mt-2 min-h-5 text-sm ${status.result?.ok === false ? "text-destructive" : "text-muted-foreground"}`}>{status.result?.message}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManagedSection({ section, products, productsStatus, onRetryProducts, catalogBackground }: { section: HomepageSection; products: Product[]; productsStatus: ProductsStatus; onRetryProducts: () => void; catalogBackground?: string | null }) {
  switch (section.type) {
    case "hero":
      return <HeroCarousel section={section} />;
    case "banner":
      return <ManagedBanners section={section} />;
    case "featured_category":
      return <CategoryGrid section={section} />;
    case "product_carousel": {
      // The API already applies the section's limit and drops inactive products (HomepageController::resolveProductCarousel).
      const ids = section.data?.product_ids ?? [];
      const byId = new Map(products.map((product) => [product.id, product]));
      const selected = ids.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product));
      return <ProductSection section={section} products={selected} status={ids.length === 0 ? "ready" : productsStatus} expected={ids.length} onRetry={onRetryProducts} />;
    }
    case "brand_showcase":
      return <BrandStrip section={section} />;
    case "catalog_showcase":
      return <CatalogSection section={section} backgroundImage={catalogBackground} />;
    default:
      return null;
  }
}

export default function HomePage() {
  const { homepage, site, loaded: homepageLoaded, error, reload } = useSiteConfig();
  const sections = useMemo(() => homepage?.sections ?? [], [homepage]);
  const selectedProductIds = useMemo(() => Array.from(new Set(sections.flatMap((section) => section.type === "product_carousel" ? section.data?.product_ids ?? [] : []))), [sections]);
  // One /products?ids=… request for every product row; skipped when no row has products configured.
  const { data, isError, refetch } = useProducts({ ids: selectedProductIds, per_page: Math.max(selectedProductIds.length, 1) }, { enabled: selectedProductIds.length > 0 });
  const products = data?.data ?? [];
  const productsStatus: ProductsStatus = data ? "ready" : isError ? "error" : "loading";
  const retryProducts = useCallback(() => { void refetch(); }, [refetch]);
  // SiteLayout already renders the page's <main>; this is its content.
  return (
    <div className="bg-background">
      {site.homepage_heading && <h1 className="sr-only">{site.homepage_heading}</h1>}
      {!homepageLoaded && <div className="aspect-[1920/622] animate-pulse bg-muted" aria-label="Loading homepage" />}
      {homepageLoaded && error && <section className="grid min-h-[420px] place-items-center bg-muted px-5 py-16"><div className="max-w-lg rounded-xl border border-border bg-card p-8 text-center shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-destructive">Connection unavailable</p><h1 className="mt-3 text-2xl font-semibold text-foreground">Storefront content could not be loaded</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Please check the configured API URL or try again in a moment.</p><button type="button" onClick={reload} className="mt-6 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">Try again</button></div></section>}
      {homepageLoaded && !error && sections.length === 0 && <section className="grid min-h-[320px] place-items-center bg-muted px-5 py-16 text-center"><p className="max-w-md text-sm leading-6 text-muted-foreground">The storefront is being updated. Please check back shortly, or browse the <Link href="/shop" className="font-semibold text-primary">full catalog</Link>.</p></section>}
      {sections.map((section) => <ManagedSection key={section.id} section={section} products={products} productsStatus={productsStatus} onRetryProducts={retryProducts} catalogBackground={site.catalog_background_logo_url} />)}
      {site.newsletter_enabled && <NewsletterSection title={site.newsletter_title} placeholder={site.newsletter_placeholder} buttonText={site.newsletter_button_text} />}
      {/* Homepage only: other pages (product detail) have their own fixed bottom bar. */}
      <MobileAppButton />
      <BackToTop />
    </div>
  );
}
