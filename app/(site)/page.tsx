"use client";
/* eslint-disable @next/next/no-img-element -- managed image URLs are runtime values and include responsive picture sources */

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Send, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useProducts, type Product } from "@/hooks/useProducts";
import { imageVariant } from "@/lib/imageVariants";
import { useSiteConfig, type HomepageItem, type HomepageSection } from "@/context/SiteConfigContext";

const CatalogFlipbook = dynamic(() => import("@/components/catalog/CatalogFlipbook"), { ssr: false });

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
  const slides = section.items.filter((item) => item.kind === "slide" && item.desktop_image_url);
  const carouselSlides = slides.map((item) => ({ image: item.desktop_image_url, mobileImage: item.mobile_image_url, alt: item.alt_text, href: item.link_url }));
  // Without dedicated mobile art, keep the banner's own ratio so its text isn't cropped off on phones.
  const hasMobileArt = carouselSlides.length > 0 && carouselSlides.every((slide) => slide.mobileImage);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (carouselSlides.length < 2) return;
    const interval = typeof section.settings.interval_ms === "number" ? section.settings.interval_ms : 5000;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % carouselSlides.length), interval);
    return () => window.clearInterval(timer);
  }, [carouselSlides.length, section.settings.interval_ms]);
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
  return (
    <section className="relative overflow-hidden border-b border-brand-line bg-brand-navy" aria-label="Featured promotions">
      <div className={`relative aspect-[1920/622] w-full ${hasMobileArt ? "min-h-[210px] sm:min-h-0" : ""}`}>
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
          const className = `absolute inset-0 transition-opacity duration-700 ${active === index ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`;
          return slide.href
            ? <Link key={slide.image} href={slide.href} aria-hidden={active !== index} className={className}>{image}</Link>
            : <div key={slide.image} aria-hidden={active !== index} className={className}>{image}</div>;
        })}
        {carouselSlides.length > 1 && <><button type="button" onClick={() => move(-1)} aria-label="Previous promotion" className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-white shadow-md transition hover:bg-primary"><ChevronLeft size={24} /></button>
        <button type="button" onClick={() => move(1)} aria-label="Next promotion" className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-white shadow-md transition hover:bg-primary"><ChevronRight size={24} /></button></>}
      </div>
    </section>
  );
}

function ImageHeading({ image, title }: { image?: string; title: string }) {
  if (!image) return <h2 className="sr-only">{title}</h2>;
  // The art is a 32:1 strip with the title centred in ~30% of its width. A fixed height per breakpoint keeps the
  // title fully inside the viewport on phones/tablets (object-cover crops only the decorative sides).
  // Because of that crop the image is drawn wider than the box (36px × 32 ≈ 1150px on a phone, 133vw at lg+).
  return <div className="relative mt-6 h-9 w-full overflow-hidden bg-brand-navy sm:h-12 md:h-14 lg:aspect-[24/1] lg:h-auto"><Image src={image} alt={title} fill sizes="(max-width: 1023px) 1920px, 134vw" loading="lazy" className="object-cover" /><h2 className="sr-only">{title}</h2></div>;
}

function CategoryGrid({ section }: { section: HomepageSection }) {
  const headingImage = section.items.find((item) => item.kind === "heading")?.desktop_image_url;
  const categories = section.items.filter((item) => item.kind === "content" && item.desktop_image_url).map((item) => ({ key: String(item.id), name: item.title || item.alt_text, alt: item.alt_text, image: item.desktop_image_url, href: item.link_url }));
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
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
  useEffect(() => {
    if (categories.length <= 7) return;    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [categories.length, move]);
  if (!categories.length) return null;
  const hasCarousel = categories.length > 7;
  return <section className="bg-background pb-8"><ImageHeading image={headingImage} title={section.title} /><div className="relative mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-10"><div ref={trackRef} className="category-track flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth py-1">{categories.map((category) => { const image = <div className="relative aspect-square overflow-hidden rounded-md bg-muted"><Image src={category.image} alt={category.alt} fill sizes="(max-width: 767px) 50vw, (max-width: 1023px) 25vw, (max-width: 1279px) 20vw, 15vw" className="object-cover transition duration-300 group-hover:scale-105" /></div>; const className = "group w-[calc((100%-12px)/2)] shrink-0 snap-start rounded-lg border border-border bg-card p-2 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:w-[calc((100%-36px)/4)] lg:w-[calc((100%-48px)/5)] xl:w-[calc((100%-72px)/7)]"; return category.href ? <Link key={category.key} href={category.href} aria-label={category.name || undefined} className={className}>{image}</Link> : <div key={category.key} className={className}>{image}</div>; })}</div></div>{hasCarousel && <div className="mt-2 flex flex-wrap justify-center">{categories.map((category, index) => <button key={category.key} type="button" onClick={() => goToCategory(index)} aria-label={`Show category ${index + 1}`} aria-current={index === active ? "true" : undefined} className="group grid min-h-6 min-w-6 place-items-center px-0.5">{/* small dot, 24px tap area */}<span className={`block h-1.5 rounded-full transition-all group-hover:bg-primary ${index === active ? "w-6 bg-primary" : "w-1.5 bg-border"}`} /></button>)}</div>}</section>;
}

function ManagedBanners({ sections }: { sections: HomepageSection[] }) {
  const banners = sections.flatMap((section) => section.items
    .filter((item) => item.kind !== "heading")
    .map((item) => ({ ...item, sectionTitle: section.title })));
  if (banners.length === 0) return null;
  return (
    <section className="w-full bg-background py-4">
      <div className="mx-auto grid w-full max-w-[1513px] grid-cols-1 gap-3 px-2 md:grid-cols-2 md:px-0">
      {banners.map((banner) => {
        const image = <ResponsiveManagedImage desktopSrc={banner.desktop_image_url} mobileSrc={banner.mobile_image_url} alt={banner.alt_text} width={956} height={170} sizes="(max-width: 767px) 100vw, 50vw" className="block h-full w-full object-cover" />;
        return (
          <div key={banner.id} className="relative aspect-[956/170] w-full overflow-hidden rounded-lg border border-border bg-muted shadow-sm">
            {banner.link_url ? <Link href={banner.link_url} aria-label={banner.alt_text} className="block h-full w-full">{image}</Link> : image}
          </div>
        );
      })}
      </div>
    </section>
  );
}

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

function ProductCard({ product }: { product: Product }) {
  const { isAuthenticated, isApproved } = useAuth();
  const { addItem } = useCart();
  const image = product.image ?? product.images?.find((item) => item.is_primary)?.url;
  const price = product.current_price ?? product.sale_price ?? product.regular_price;
  const canShowPrice = isAuthenticated && isApproved && product.prices_visible && price !== null;
  const canAdd = canShowPrice && price > 0 && product.type === "simple" && product.in_stock;
  function addToCart() {
    if (!canAdd || price === null) return;
    addItem({ product_id: product.id, name: product.name, sku: product.sku, image: image ?? null, price, parent_id: product.parent_id }, 1);
  }
  return (
    <article className="product-card relative min-h-[390px] rounded-lg border border-border bg-card shadow-sm">
      <div className="group relative z-0 flex min-h-[390px] flex-col rounded-lg bg-card px-3 pb-4 pt-4 transition-all duration-200 hover:z-10 hover:-translate-y-0.5 hover:shadow-md 2xl:px-4">
        <Link href={`/product/${product.id}`} className="no-underline">
          <div className="mb-2 min-h-[30px] text-[11px] font-medium uppercase leading-tight text-muted-foreground 2xl:min-h-[34px] 2xl:text-[12px]">{product.category?.name ?? "Wholesale"}</div>
          <h3 title={product.name} className="line-clamp-4 h-[4.72em] text-[13px] font-semibold uppercase leading-[1.18] text-foreground transition-colors group-hover:text-primary sm:text-[14px] xl:text-[12.5px] 2xl:text-[15px]">{product.name}</h3>
        </Link>
        <Link href={`/product/${product.id}`} className="relative mt-2 block h-[185px] overflow-hidden rounded-md bg-card" aria-label={`View ${product.name}`}>
          {image ? <Image src={imageVariant(image, product.image ? product.image_variants : null, 512)!} alt={product.name} fill sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 15vw" className="object-contain" /> : <div className="grid h-full place-items-center bg-muted text-xs font-bold uppercase text-foreground/70">Product image</div>}
        </Link>
        <div className="mt-auto flex min-h-[70px] items-end justify-between gap-3 border-b border-transparent pb-3 pt-4 transition-colors group-hover:border-brand-line">
          {!isAuthenticated ? (
            <Link href="/login" className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-[14px] font-semibold text-primary-foreground no-underline shadow-sm transition hover:bg-primary/90">Login to Buy</Link>
          ) : !canShowPrice ? (
            <span className="inline-flex min-h-11 w-full items-center justify-center bg-brand-bg-alt px-4 py-2.5 text-center text-[12px] font-bold uppercase text-brand-muted">Pending Price Approval</span>
          ) : (
            <>
              <span className="inline-flex flex-col"><span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-primary">Wholesale</span><span className="mt-1 text-[20px] font-medium leading-none text-foreground xl:text-[18px] 2xl:text-[22px]">{money(price)}</span></span>
              {canAdd ? <button type="button" onClick={addToCart} aria-label={`Add ${product.name} to cart`} className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90"><ShoppingCart size={20} /></button> : <Link href={`/product/${product.id}`} aria-label={`View ${product.name}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground no-underline transition group-hover:bg-primary group-hover:text-primary-foreground"><ArrowRight size={20} /></Link>}
            </>
          )}
        </div>
        {!product.in_stock && <span className="absolute left-2 top-2 rounded-md bg-destructive px-2 py-1 text-[13px] font-bold text-white shadow-sm">Sold Out</span>}
      </div>
    </article>
  );
}

function ProductSection({ section, products, placeholders = 0 }: { section: HomepageSection; products: Product[]; placeholders?: number }) {
  const art = section.items.find((item) => item.kind === "heading")?.desktop_image_url;
  const promos = section.items.filter((item) => item.kind === "content" && item.desktop_image_url).slice(0, 2);
  return (
    <section className="bg-background">
      <ImageHeading image={art} title={section.title} />
      <div className="mx-auto grid max-w-[1513px] grid-cols-2 gap-3 px-3 pb-4 md:grid-cols-3 md:px-6 lg:grid-cols-4 xl:grid-cols-7">
        {products.map((product) => <ProductCard key={`${section.id}-${product.id}`} product={product} />)}
        {/* Same height as a card while the products load, so the sections below don't jump. */}
        {products.length === 0 && Array.from({ length: placeholders }, (_, index) => <div key={index} aria-hidden="true" className="min-h-[390px] animate-pulse rounded-lg border border-border bg-muted" />)}
      </div>
      {promos.length > 0 && (
        <div className="mx-auto grid w-full max-w-[1513px] grid-cols-1 gap-3 bg-background px-3 py-4 md:grid-cols-2 md:px-6">
          {promos.map((promo) => {
            const image = <ResponsiveManagedImage desktopSrc={promo.desktop_image_url} mobileSrc={promo.mobile_image_url} alt={promo.alt_text} width={956} height={170} sizes="(max-width: 767px) 100vw, 50vw" className="block h-full w-full object-cover" />;
            return <div key={promo.id} className="relative aspect-[956/170] w-full overflow-hidden rounded-lg border border-border bg-muted shadow-sm">{promo.link_url ? <Link href={promo.link_url} aria-label={promo.alt_text} className="block h-full w-full">{image}</Link> : image}</div>;
          })}
        </div>
      )}
    </section>
  );
}

function BrandStrip({ section }: { section: HomepageSection }) {
  const headingImage = section.items.find((item) => item.kind === "heading")?.desktop_image_url;
  const brandImages = section.items.filter((item) => item.kind === "brand" && item.desktop_image_url).slice(0, 14);
  if (brandImages.length === 0) return null;
  return (
    <section className="bg-background pb-10">
      <ImageHeading image={headingImage} title={section.title} />
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-2 rounded-xl bg-muted px-4 py-5 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {brandImages.map((item) => (
          item.link_url ? <Link key={item.id} href={item.link_url} className="group flex h-24 items-center justify-center rounded-lg border border-transparent bg-card p-3 no-underline transition hover:border-border hover:shadow-sm"><span className="relative block h-full w-full"><Image src={item.desktop_image_url} alt={item.alt_text} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, (max-width: 1279px) 20vw, 15vw" className="object-contain transition group-hover:-translate-y-0.5" /></span></Link> : <div key={item.id} className="flex h-24 items-center justify-center rounded-lg bg-card p-3"><span className="relative block h-full w-full"><Image src={item.desktop_image_url} alt={item.alt_text} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, (max-width: 1279px) 20vw, 15vw" className="object-contain" /></span></div>
        ))}
      </div>
    </section>
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
  const catalogs = section.items.filter((item) => item.kind === "catalog" && item.desktop_image_url && item.pdf_url);
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
    <section className="bg-background px-2 py-6 sm:px-4 lg:px-6 lg:py-10">
      <div className="relative isolate overflow-hidden rounded-xl border border-border bg-brand-navy px-5 py-10 shadow-lg md:px-8 md:py-14 lg:px-12 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-chart-2" />
        {backgroundImage && <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055]" style={{ backgroundImage: tileBackground(backgroundImage, 220), backgroundPosition: "center", backgroundRepeat: "repeat", backgroundSize: "220px 220px" }} />}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand-blue-deep/25 via-transparent to-black/25" />
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 items-center gap-x-4 gap-y-8 sm:gap-x-8 lg:grid-cols-3 lg:gap-10 xl:gap-16">
        <div className="col-span-2 max-w-xl text-white lg:col-span-1 lg:pr-4">
          {typeof section.settings.eyebrow === "string" && section.settings.eyebrow && <span className="mb-4 inline-block border-l-4 border-chart-2 pl-3 text-xs font-bold tracking-[0.12em] text-chart-2">{section.settings.eyebrow}</span>}
          <h2 className="flex min-h-16 items-center text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl">
            <span className="typing-cursor">{phrases.length > 0 ? typedText : section.title}</span>
          </h2>
          {typeof section.settings.description === "string" && section.settings.description && <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 md:text-base">{section.settings.description}</p>}
          <div aria-hidden="true" className="mt-7 h-px w-24 bg-chart-2" />
        </div>
        {catalogs.map((catalog) => (
          <button key={catalog.id} type="button" onClick={() => setOpenCatalog(catalog)} aria-label={`Open ${catalog.title || catalog.alt_text}`} className="catalog-book group mx-auto block w-full max-w-[350px] text-left focus-visible:outline-2 focus-visible:outline-chart-2">
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
      {openCatalog?.pdf_url && <CatalogFlipbook file={openCatalog.pdf_url} title={openCatalog.title || openCatalog.alt_text} onClose={() => setOpenCatalog(null)} />}
    </section>
  );
}

function NewsletterSection({ title, placeholder, buttonText }: { title?: string; placeholder?: string; buttonText?: string }) {
  if (!title) return null;
  return (
    <section className="border-y border-border bg-muted px-5 py-5 md:px-10">
      <div className="mx-auto flex max-w-[1513px] flex-col items-center gap-4 md:flex-row md:justify-between md:gap-10">
        <div className="flex shrink-0 items-center gap-3 text-foreground">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary"><Send size={19} strokeWidth={2} /></span>
          <h2 className="text-base font-bold md:text-lg">{title}</h2>
        </div>
        <form className="flex min-h-14 w-full max-w-2xl overflow-hidden rounded-lg border border-input bg-card shadow-sm transition focus-within:border-primary focus-within:ring-3 focus-within:ring-ring/30" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input id="newsletter-email" name="email" type="email" required placeholder={placeholder} className="min-w-0 flex-1 bg-card px-7 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground" />
          <button type="submit" className="min-w-28 shrink-0 bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">{buttonText}</button>
        </form>
      </div>
    </section>
  );
}

function ManagedSection({ section, products, productsLoading, catalogBackground }: { section: HomepageSection; products: Product[]; productsLoading: boolean; catalogBackground?: string | null }) {
  switch (section.type) {
    case "hero":
      return <HeroCarousel section={section} />;
    case "banner":
      return <ManagedBanners sections={[section]} />;
    case "featured_category":
      return <CategoryGrid section={section} />;
    case "product_carousel": {
      const ids = section.data?.product_ids ?? [];
      const byId = new Map(products.map((product) => [product.id, product]));
      const selected = ids.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product));
      const limit = typeof section.settings.limit === "number" ? section.settings.limit : 14;
      return <ProductSection section={section} products={selected.slice(0, limit)} placeholders={productsLoading ? Math.min(ids.length, limit) : 0} />;
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
  const { data } = useProducts({ ids: selectedProductIds, per_page: Math.max(selectedProductIds.length, 1) });
  const products = data?.data ?? [];
  const productsLoading = data === undefined && selectedProductIds.length > 0;
  return (
    <main className="bg-background">
      {site.homepage_heading && <h1 className="sr-only">{site.homepage_heading}</h1>}
      {!homepageLoaded && <div className="h-48 animate-pulse bg-brand-bg-alt" aria-label="Loading homepage" />}
      {homepageLoaded && error && <section className="grid min-h-[420px] place-items-center bg-muted px-5 py-16"><div className="max-w-lg rounded-xl border border-border bg-card p-8 text-center shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-destructive">Connection unavailable</p><h1 className="mt-3 text-2xl font-semibold text-foreground">Storefront content could not be loaded</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Please check the configured API URL or try again in a moment.</p><button type="button" onClick={reload} className="mt-6 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">Try again</button></div></section>}
      {sections.map((section) => <ManagedSection key={section.id} section={section} products={products} productsLoading={productsLoading} catalogBackground={site.catalog_background_logo_url} />)}
      {site.newsletter_enabled && <NewsletterSection title={site.newsletter_title} placeholder={site.newsletter_placeholder} buttonText={site.newsletter_button_text} />}
    </main>
  );
}
