"use client";
/* eslint-disable @next/next/no-img-element -- managed image URLs are runtime values and include responsive picture sources */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Send, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useProducts, type Product } from "@/hooks/useProducts";
import { useSiteConfig, type HomepageItem, type HomepageSection } from "@/context/SiteConfigContext";

const CatalogFlipbook = dynamic(() => import("@/components/catalog/CatalogFlipbook"), { ssr: false });

function HeroCarousel({ section }: { section: HomepageSection }) {
  const slides = section.items.filter((item) => item.kind === "slide" && item.desktop_image_url);
  const carouselSlides = slides.map((item) => ({ image: item.desktop_image_url, mobileImage: item.mobile_image_url, alt: item.alt_text, href: item.link_url }));
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (carouselSlides.length < 2) return;
    const interval = typeof section.settings.interval_ms === "number" ? section.settings.interval_ms : 5000;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % carouselSlides.length), interval);
    return () => window.clearInterval(timer);
  }, [carouselSlides.length, section.settings.interval_ms]);
  const move = (direction: number) => setActive((value) => (value + direction + carouselSlides.length) % carouselSlides.length);

  if (carouselSlides.length === 0) return null;
  return (
    <section className="relative overflow-hidden border-b border-brand-line bg-brand-navy" aria-label="Featured promotions">
      <div className="relative aspect-[1920/622] min-h-[210px] w-full sm:min-h-0">
        {carouselSlides.map((slide, index) => (
          slide.href ? <Link key={slide.image} href={slide.href} aria-hidden={active !== index} className={`absolute inset-0 transition-opacity duration-700 ${active === index ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}>
            <picture>
              {slide.mobileImage && <source media="(max-width: 640px)" srcSet={slide.mobileImage} />}
              <img src={slide.image} alt={slide.alt} loading={index === 0 ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover" />
            </picture>
          </Link> : <div key={slide.image} aria-hidden={active !== index} className={`absolute inset-0 transition-opacity duration-700 ${active === index ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}><picture>{slide.mobileImage && <source media="(max-width: 640px)" srcSet={slide.mobileImage} />}<img src={slide.image} alt={slide.alt} loading={index === 0 ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover" /></picture></div>
        ))}
        {carouselSlides.length > 1 && <><button type="button" onClick={() => move(-1)} aria-label="Previous promotion" className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center bg-black/55 text-white transition hover:bg-brand-orange"><ChevronLeft size={24} /></button>
        <button type="button" onClick={() => move(1)} aria-label="Next promotion" className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center bg-black/55 text-white transition hover:bg-brand-orange"><ChevronRight size={24} /></button></>}
      </div>
    </section>
  );
}

function ImageHeading({ image, title }: { image?: string; title: string }) {
  if (!image) return <h2 className="sr-only">{title}</h2>;
  return <div className="relative mt-6 aspect-[24/1] min-h-12 overflow-hidden bg-brand-navy"><img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" /><h2 className="sr-only">{title}</h2></div>;
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
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior });
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
    if (categories.length <= 7) return;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [categories.length, move]);
  if (!categories.length) return null;
  const hasCarousel = categories.length > 7;
  return <section className="bg-white pb-8"><ImageHeading image={headingImage} title={section.title} /><div className="relative mx-auto max-w-[1600px] px-10"><div ref={trackRef} className="category-track flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth">{categories.map((category) => { const image = <div className="relative aspect-square overflow-hidden bg-brand-bg-alt"><img src={category.image} alt={category.alt} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /></div>; const className = "group w-[calc((100%-12px)/2)] shrink-0 snap-start bg-white p-2 no-underline lg:w-[calc((100%-72px)/7)]"; return category.href ? <Link key={category.key} href={category.href} aria-label={category.name || undefined} className={className}>{image}</Link> : <div key={category.key} className={className}>{image}</div>; })}</div></div>{hasCarousel && <div className="mt-4 flex justify-center gap-1.5">{categories.map((category, index) => <button key={category.key} type="button" onClick={() => goToCategory(index)} aria-label={`Show category ${index + 1}`} aria-current={index === active ? "true" : undefined} className={`h-1.5 rounded-full transition-all hover:bg-brand-orange ${index === active ? "w-6 bg-brand-orange" : "w-1.5 bg-brand-line"}`} />)}</div>}</section>;
}

function ManagedBanners({ sections }: { sections: HomepageSection[] }) {
  const banners = sections.flatMap((section) => section.items
    .filter((item) => item.kind !== "heading")
    .map((item) => ({ ...item, sectionTitle: section.title })));
  if (banners.length === 0) return null;
  return (
    <section className="w-full bg-white py-3">
      <div className="mx-auto grid w-full max-w-[1513px] grid-cols-1 gap-3 px-2 md:grid-cols-2 md:px-0">
      {banners.map((banner) => {
        const image = <picture>
          {banner.mobile_image_url && <source media="(max-width: 640px)" srcSet={banner.mobile_image_url} />}
          <img src={banner.desktop_image_url} alt={banner.alt_text} width={956} height={170} className="block h-full w-full object-cover" />
        </picture>;
        return (
          <div key={banner.id} className="relative aspect-[956/170] w-full overflow-hidden bg-brand-navy">
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
    <article className="product-card relative min-h-[390px] bg-white">
      <div className="group relative z-0 flex min-h-[390px] flex-col bg-white px-4 pb-4 pt-4 transition-shadow duration-200 after:pointer-events-none after:absolute after:bottom-4 after:right-0 after:top-4 after:w-px after:bg-brand-line after:content-[''] hover:z-10 hover:shadow-[0_3px_14px_rgba(0,0,0,0.22)] hover:outline hover:outline-1 hover:outline-brand-line hover:after:opacity-0">
        <Link href={`/product/${product.id}`} className="no-underline">
          <div className="mb-2 min-h-[34px] text-[12px] uppercase leading-tight text-[#7A8DA3]">{product.category?.name ?? "Wholesale"}</div>
          <h3 className="min-h-[72px] text-[15px] font-black uppercase leading-[1.16] text-brand-blue group-hover:text-brand-blue-deep">{product.name}</h3>
        </Link>
        <Link href={`/product/${product.id}`} className="relative mt-2 block h-[185px] overflow-hidden bg-white" aria-label={`View ${product.name}`}>
          {image ? <Image src={image} alt={product.name} fill unoptimized sizes="(max-width: 768px) 50vw, 15vw" className="object-contain" /> : <div className="grid h-full place-items-center bg-brand-bg-alt text-xs font-bold uppercase text-brand-muted">Product image</div>}
        </Link>
        <div className="mt-auto flex min-h-[70px] items-end justify-between gap-3 border-b border-transparent pb-3 pt-4 transition-colors group-hover:border-brand-line">
          {!isAuthenticated ? (
            <Link href="/login" className="inline-flex min-h-11 w-full items-center justify-center border-2 border-brand-navy bg-brand-navy px-4 py-2.5 text-[14px] font-bold text-white no-underline shadow-sm transition hover:border-brand-blue hover:bg-brand-blue">Login to Buy</Link>
          ) : !canShowPrice ? (
            <span className="inline-flex min-h-11 w-full items-center justify-center bg-brand-bg-alt px-4 py-2.5 text-center text-[12px] font-bold uppercase text-brand-muted">Pending Price Approval</span>
          ) : (
            <>
              <span className="inline-flex flex-col"><span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-brand-orange">Wholesale</span><span className="mt-1 text-[22px] font-medium leading-none text-[#374151]">{money(price)}</span></span>
              {canAdd ? <button type="button" onClick={addToCart} aria-label={`Add ${product.name} to cart`} className="grid h-11 w-11 shrink-0 place-items-center border border-brand-navy bg-brand-navy text-white shadow-sm transition hover:border-brand-blue hover:bg-brand-blue"><ShoppingCart size={20} /></button> : <Link href={`/product/${product.id}`} aria-label={`View ${product.name}`} className="grid h-11 w-11 shrink-0 place-items-center bg-[#E7E7E7] text-white no-underline transition group-hover:bg-brand-blue"><ArrowRight size={20} /></Link>}
            </>
          )}
        </div>
        {!product.in_stock && <span className="absolute left-0 top-0 bg-red-600 px-2 py-1 text-[13px] font-black text-white">Sold Out</span>}
      </div>
    </article>
  );
}

function ProductSection({ section, products }: { section: HomepageSection; products: Product[] }) {
  const art = section.items.find((item) => item.kind === "heading")?.desktop_image_url;
  const promos = section.items.filter((item) => item.kind === "content" && item.desktop_image_url).slice(0, 2);
  return (
    <section className="bg-white">
      <ImageHeading image={art} title={section.title} />
      <div className="mx-auto grid max-w-[1513px] grid-cols-2 border-l border-brand-line md:grid-cols-3 lg:grid-cols-7">
        {products.map((product) => <ProductCard key={`${section.id}-${product.id}`} product={product} />)}
      </div>
      {promos.length > 0 && (
        <div className="mx-auto grid w-full max-w-[1513px] grid-cols-1 gap-3 bg-white px-2 py-3 md:grid-cols-2 md:px-0">
          {promos.map((promo) => {
            const image = <picture>{promo.mobile_image_url && <source media="(max-width: 640px)" srcSet={promo.mobile_image_url} />}<img src={promo.desktop_image_url} alt={promo.alt_text} width={956} height={170} loading="lazy" className="block h-full w-full object-cover" /></picture>;
            return <div key={promo.id} className="relative aspect-[956/170] w-full overflow-hidden bg-brand-navy">{promo.link_url ? <Link href={promo.link_url} aria-label={promo.alt_text} className="block h-full w-full">{image}</Link> : image}</div>;
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
    <section className="bg-white pb-10">
      <ImageHeading image={headingImage} title={section.title} />
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 bg-brand-bg-alt px-4 py-5 sm:grid-cols-4 lg:grid-cols-7">
        {brandImages.map((item) => (
          item.link_url ? <Link key={item.id} href={item.link_url} className="group flex h-24 items-center justify-center p-3 no-underline transition hover:bg-white hover:shadow-[0_8px_24px_rgba(11,31,58,0.08)]"><img src={item.desktop_image_url} alt={item.alt_text} loading="lazy" className="max-h-full max-w-full object-contain transition group-hover:-translate-y-0.5" /></Link> : <div key={item.id} className="flex h-24 items-center justify-center p-3"><img src={item.desktop_image_url} alt={item.alt_text} loading="lazy" className="max-h-full max-w-full object-contain" /></div>
        ))}
      </div>
    </section>
  );
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
    <section className="bg-white px-2 py-6 sm:px-4 lg:px-6 lg:py-10">
      <div className="relative isolate overflow-hidden border border-brand-navy/10 bg-brand-navy px-5 py-10 shadow-[0_18px_45px_rgba(11,31,58,0.22)] md:px-8 md:py-14 lg:px-12 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-brand-orange" />
        {backgroundImage && <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055]" style={{ backgroundImage: `url("${backgroundImage.replace(/["\\]/g, "")}")`, backgroundPosition: "center", backgroundRepeat: "repeat", backgroundSize: "220px 220px" }} />}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand-blue-deep/25 via-transparent to-black/25" />
        <div className="mx-auto grid max-w-[1600px] items-center gap-10 lg:grid-cols-3 lg:gap-10 xl:gap-16">
        <div className="max-w-xl text-white lg:pr-4">
          {typeof section.settings.eyebrow === "string" && section.settings.eyebrow && <span className="mb-4 inline-block border-l-4 border-brand-orange pl-3 text-xs font-bold tracking-[0.12em] text-brand-orange">{section.settings.eyebrow}</span>}
          <h2 className="flex min-h-16 items-center text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl">
            <span className="typing-cursor">{phrases.length > 0 ? typedText : section.title}</span>
          </h2>
          {typeof section.settings.description === "string" && section.settings.description && <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 md:text-base">{section.settings.description}</p>}
          <div aria-hidden="true" className="mt-7 h-px w-24 bg-brand-orange" />
        </div>
        {catalogs.map((catalog) => (
          <button key={catalog.id} type="button" onClick={() => setOpenCatalog(catalog)} aria-label={`Open ${catalog.title || catalog.alt_text}`} className="catalog-book group mx-auto block w-full max-w-[350px] text-left focus-visible:outline-2 focus-visible:outline-brand-orange">
            <div className="catalog-book-body relative aspect-[210/297]">
              <div aria-hidden="true" className="catalog-book-pages" />
              <div className="catalog-book-cover">
                <img src={catalog.desktop_image_url} alt={catalog.alt_text} loading="lazy" className="h-full w-full object-cover" />
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
    <section className="border-y border-brand-line bg-gradient-to-r from-brand-bg via-brand-white to-brand-orange-soft px-5 py-5 md:px-10">
      <div className="mx-auto flex max-w-[1513px] flex-col items-center gap-4 md:flex-row md:justify-between md:gap-10">
        <div className="flex shrink-0 items-center gap-3 text-brand-navy">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-orange-soft text-brand-orange"><Send size={19} strokeWidth={2} /></span>
          <h2 className="text-base font-bold md:text-lg">{title}</h2>
        </div>
        <form className="flex min-h-14 w-full max-w-2xl overflow-hidden border border-[#ded2c4] bg-white shadow-[0_8px_24px_rgba(11,31,58,0.10)] transition focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/20" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input id="newsletter-email" name="email" type="email" required placeholder={placeholder} className="min-w-0 flex-1 bg-white px-7 py-3 text-base text-brand-navy outline-none placeholder:text-brand-muted" />
          <button type="submit" className="min-w-28 shrink-0 bg-brand-orange px-7 py-3 text-sm font-extrabold text-white transition hover:bg-brand-navy focus-visible:bg-brand-navy">{buttonText}</button>
        </form>
      </div>
    </section>
  );
}

function ManagedSection({ section, products, catalogBackground }: { section: HomepageSection; products: Product[]; catalogBackground?: string | null }) {
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
      return <ProductSection section={section} products={selected.slice(0, limit)} />;
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
  return (
    <main className="bg-white">
      {site.homepage_heading && <h1 className="sr-only">{site.homepage_heading}</h1>}
      {!homepageLoaded && <div className="h-48 animate-pulse bg-brand-bg-alt" aria-label="Loading homepage" />}
      {homepageLoaded && error && <section className="grid min-h-[420px] place-items-center bg-brand-bg-alt px-5 py-16"><div className="max-w-lg border border-brand-line bg-white p-8 text-center shadow-[0_18px_45px_rgba(11,31,58,0.12)]"><p className="text-xs font-black uppercase tracking-[0.16em] text-brand-orange">Connection unavailable</p><h1 className="mt-3 text-2xl font-bold text-brand-navy">Storefront content could not be loaded</h1><p className="mt-3 text-sm leading-6 text-brand-muted">Please check the configured API URL or try again in a moment.</p><button type="button" onClick={reload} className="mt-6 bg-brand-navy px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-blue">Try again</button></div></section>}
      {sections.map((section) => <ManagedSection key={section.id} section={section} products={products} catalogBackground={site.catalog_background_logo_url} />)}
      {site.newsletter_enabled && <NewsletterSection title={site.newsletter_title} placeholder={site.newsletter_placeholder} buttonText={site.newsletter_button_text} />}
    </main>
  );
}
