"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Send, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useProducts, type Product } from "@/hooks/useProducts";

const CatalogFlipbook = dynamic(() => import("@/components/catalog/CatalogFlipbook"), { ssr: false });

const HERO_SLIDES = [
  { image: "/images/banners/tobacco-products-hero.png", alt: "Tobacco Products", href: "/shop" },
  { image: "/images/banners/disposable-vapes-hero.png", alt: "Disposable Vapes", href: "/shop?search=Disposable%20Vapes" },
  { image: "/images/banners/premium-cigars-hero.png", alt: "Premium Cigars", href: "/shop?search=Cigars" },
];

const CATEGORIES = [
  ["Cigars", "/images/categories/cigars.png"], ["Detox & Synthetic", "/images/categories/detox-synthetic.png"],
  ["Disposable Vapes", "/images/categories/disposable-vapes.png"], ["Kratom", "/images/categories/kratom.png"],
  ["Nicotine Pouches", "/images/categories/nicotine-pouches.png"], ["Rolling Paper & Filters", "/images/categories/rolling-paper-filters.png"],
  ["Salt E-Liquid", "/images/categories/salt-e-liquid.png"], ["Tobacco Products", "/images/categories/tobacco-products.png"],
  ["Whip Cream Chargers", "/images/categories/whip-cream-chargers.png"], ["Big Torches", "/images/categories/big-torches.png"],
  ["510 Batteries", "/images/categories/510-batteries.png"], ["Delta Products", "/images/categories/delta-products.png"],
] as const;

const TOP_BRANDS = [
  "Naked 100", "RAZ", "Pod Salt", "Brixz", "Silver Fox", "Geek Bar", "Sora",
  "Starmax", "Space Ultra", "Halo", "7OHMZ", "Crave", "Pod Juice", "Elysian Labs",
] as const;

const CATALOG_WORDS = ["Our Catalogs", "Premium Tobacco"] as const;
const CATALOGS = [
  { title: "Cigar Catalog", image: "/images/catalogs/cigar-catalog.jpg", pdf: "/catalogs/cigar-catalog.pdf" },
  { title: "Product Catalog", image: "/images/catalogs/product-catalog.webp", pdf: "/catalogs/product-catalog.pdf" },
] as const;

function HeroCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % HERO_SLIDES.length), 5000);
    return () => window.clearInterval(timer);
  }, []);
  const move = (direction: number) => setActive((value) => (value + direction + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section className="relative overflow-hidden border-b border-brand-line bg-brand-navy" aria-label="Featured promotions">
      <div className="relative aspect-[1920/622] min-h-[210px] w-full sm:min-h-0">
        {HERO_SLIDES.map((slide, index) => (
          <Link key={slide.image} href={slide.href} aria-hidden={active !== index} className={`absolute inset-0 transition-opacity duration-700 ${active === index ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}>
            <Image src={slide.image} alt={slide.alt} fill priority={index === 0} unoptimized className="object-cover" sizes="100vw" />
          </Link>
        ))}
        <button type="button" onClick={() => move(-1)} aria-label="Previous promotion" className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center bg-black/55 text-white transition hover:bg-brand-orange"><ChevronLeft size={24} /></button>
        <button type="button" onClick={() => move(1)} aria-label="Next promotion" className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center bg-black/55 text-white transition hover:bg-brand-orange"><ChevronRight size={24} /></button>
      </div>
    </section>
  );
}

function ImageHeading({ image, title }: { image?: string; title: string }) {
  if (!image) return <div className="my-6 bg-gradient-to-r from-brand-navy via-brand-blue to-brand-orange px-4 py-3 text-center"><h2 className="text-2xl font-black uppercase italic tracking-wide text-white md:text-4xl">{title}</h2></div>;
  return <div className="relative my-6 aspect-[3/1] max-h-[430px] min-h-[150px] overflow-hidden bg-brand-navy"><Image src={image} alt={title} fill className="object-cover" sizes="100vw" /><h2 className="sr-only">{title}</h2></div>;
}

function CategoryGrid() {
  const trackRef = useRef<HTMLDivElement>(null);
  const physicalIndexRef = useRef<number>(CATEGORIES.length);
  const loopResetRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);

  const scrollToPhysicalIndex = useCallback((physicalIndex: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.children.item(physicalIndex) as HTMLElement | null;
    if (!card) return;

    const centeredLeft = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({ left: centeredLeft, behavior });
    physicalIndexRef.current = physicalIndex;
  }, []);

  const goToCategory = useCallback((index: number) => {
    if (loopResetRef.current !== null) window.clearTimeout(loopResetRef.current);
    scrollToPhysicalIndex(CATEGORIES.length + index);
    setActive(index);
  }, [scrollToPhysicalIndex]);

  const move = useCallback((direction: number) => {
    if (loopResetRef.current !== null) window.clearTimeout(loopResetRef.current);

    const nextPhysical = physicalIndexRef.current + direction;
    const next = ((nextPhysical % CATEGORIES.length) + CATEGORIES.length) % CATEGORIES.length;
    scrollToPhysicalIndex(nextPhysical);
    setActive(next);

    if (nextPhysical < CATEGORIES.length || nextPhysical >= CATEGORIES.length * 2) {
      loopResetRef.current = window.setTimeout(() => {
        scrollToPhysicalIndex(CATEGORIES.length + next, "auto");
      }, 500);
    }
  }, [scrollToPhysicalIndex]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => scrollToPhysicalIndex(CATEGORIES.length, "auto"));
    return () => {
      window.cancelAnimationFrame(frame);
      if (loopResetRef.current !== null) window.clearTimeout(loopResetRef.current);
    };
  }, [scrollToPhysicalIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [move]);

  return (
    <section className="bg-white pb-8">
      <ImageHeading title="Our Categories" />
      <div className="relative mx-auto max-w-[1600px] px-10">
        <div ref={trackRef} className="flex snap-x snap-mandatory gap-3 overflow-x-hidden scroll-smooth">
          {Array.from({ length: 3 }, (_, copyIndex) => CATEGORIES.map(([name, image]) => (
            <Link key={`${copyIndex}-${name}`} href={`/shop?search=${encodeURIComponent(name)}`} aria-hidden={copyIndex !== 1} tabIndex={copyIndex === 1 ? undefined : -1} className="group w-[calc((100%-12px)/2)] shrink-0 snap-start bg-white p-2 text-center no-underline lg:w-[calc((100%-72px)/7)]">
              <div className="relative aspect-square overflow-hidden bg-brand-bg-alt"><Image src={image} alt={name} fill sizes="(max-width: 1024px) 50vw, 14vw" className="object-cover transition duration-300 group-hover:scale-105" /></div>
              <h3 className="mt-3 min-h-8 text-[11px] font-black uppercase leading-4 text-brand-navy group-hover:text-brand-orange">{name}</h3>
            </Link>
          )).flat())}
        </div>
        <button type="button" onClick={() => move(-1)} aria-label="Previous categories" className="absolute left-0 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center bg-brand-navy text-white hover:bg-brand-orange"><ChevronLeft size={20} /></button>
        <button type="button" onClick={() => move(1)} aria-label="Next categories" className="absolute right-0 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center bg-brand-navy text-white hover:bg-brand-orange"><ChevronRight size={20} /></button>
      </div>
      <div className="mt-4 flex justify-center gap-1.5">
        {CATEGORIES.map(([name], index) => (
          <button
            key={name}
            type="button"
            onClick={() => goToCategory(index)}
            aria-label={`Show ${name}`}
            aria-current={index === active ? "true" : undefined}
            className={`h-1.5 rounded-full transition-all hover:bg-brand-orange ${index === active ? "w-6 bg-brand-orange" : "w-1.5 bg-brand-line"}`}
          />
        ))}
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

function ProductSection({ title, art, products }: { title: string; art?: string; products: Product[] }) {
  return (
    <section className="bg-white">
      <ImageHeading image={art} title={title} />
      <div className="mx-auto grid max-w-[1513px] grid-cols-2 border-l border-t border-brand-line md:grid-cols-3 lg:grid-cols-7">
        {products.map((product) => <ProductCard key={`${title}-${product.id}`} product={product} />)}
      </div>
    </section>
  );
}

function BrandStrip() {
  return (
    <section className="bg-white pb-10">
      <ImageHeading title="Top Brands" />
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 bg-brand-bg-alt px-4 py-5 sm:grid-cols-4 lg:grid-cols-7">
        {TOP_BRANDS.map((name) => (
          <Link key={name} href={`/shop?search=${encodeURIComponent(name)}`} className="group flex h-20 items-center justify-center px-3 text-center no-underline transition duration-200 hover:bg-white hover:shadow-[0_8px_24px_rgba(11,31,58,0.08)] md:h-24">
            <span className="relative text-base font-black uppercase italic tracking-tight text-brand-navy transition group-hover:-translate-y-0.5 group-hover:text-brand-orange md:text-xl">
              {name}
              <span className="absolute -bottom-2 left-1/2 h-0.5 w-5 -translate-x-1/2 bg-brand-orange transition-all duration-200 group-hover:w-full" />
            </span>
          </Link>
        ))}
      </div>
      <Link href="/shop" className="hidden">
        <Image src="/images/banners/our-catalogs.png" alt="Our Catalogs — explore our wholesale collections" fill className="object-cover" sizes="(max-width: 1600px) 100vw, 1600px" />
      </Link>
    </section>
  );
}

function CatalogSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [openCatalog, setOpenCatalog] = useState<(typeof CATALOGS)[number] | null>(null);

  useEffect(() => {
    const word = CATALOG_WORDS[wordIndex];
    const isComplete = typedText === word;
    const isEmpty = typedText.length === 0;
    const delay = isComplete && !isDeleting ? 1800 : isDeleting ? 45 : 95;
    const timer = window.setTimeout(() => {
      if (isComplete && !isDeleting) setIsDeleting(true);
      else if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setWordIndex((index) => (index + 1) % CATALOG_WORDS.length);
      } else setTypedText(word.slice(0, typedText.length + (isDeleting ? -1 : 1)));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [isDeleting, typedText, wordIndex]);

  return (
    <section className="bg-gradient-to-br from-brand-navy via-brand-blue-deep to-brand-navy px-5 py-10 md:px-10 md:py-14">
      <div className="mx-auto grid max-w-[1513px] items-center gap-10 lg:grid-cols-[1.35fr_0.7fr_0.7fr] lg:gap-14">
        <div className="text-white">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-brand-orange">Wholesale collections</p>
          <h2 className="flex min-h-16 items-center text-4xl font-black uppercase italic tracking-tight sm:text-5xl">
            <span>{typedText}</span><span aria-hidden="true" className="ml-2 inline-block h-11 w-1 animate-pulse bg-brand-orange" />
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 md:text-base">Explore our extensive catalog featuring a wide-ranging inventory across all categories—bringing you everything from everyday essentials to unique specialty items, all in one place.</p>
          <div className="mt-7 h-1 w-20 bg-brand-orange" />
        </div>
        {CATALOGS.map((catalog) => (
          <button key={catalog.title} type="button" onClick={() => setOpenCatalog(catalog)} aria-label={`Open ${catalog.title}`} className="catalog-book group mx-auto block w-full max-w-[260px] text-left">
            <div className="catalog-book-body relative aspect-[210/297]">
              <div aria-hidden="true" className="catalog-book-pages" />
              <div className="catalog-book-cover">
                <Image src={catalog.image} alt={catalog.title} fill sizes="(max-width: 1024px) 70vw, 260px" className="object-cover" />
                <span className="catalog-book-title absolute inset-x-0 bottom-0 bg-white/95 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-brand-navy">{catalog.title}</span>
              </div>
              <span aria-hidden="true" className="catalog-book-spine" />
            </div>
          </button>
        ))}
      </div>
      {openCatalog && <CatalogFlipbook file={openCatalog.pdf} title={openCatalog.title} onClose={() => setOpenCatalog(null)} />}
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="border-y border-brand-line bg-gradient-to-r from-brand-bg via-brand-white to-brand-orange-soft px-5 py-5 md:px-10">
      <div className="mx-auto flex max-w-[1513px] flex-col items-center gap-4 md:flex-row md:justify-between md:gap-10">
        <div className="flex shrink-0 items-center gap-3 text-brand-navy">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-orange-soft text-brand-orange"><Send size={19} strokeWidth={2} /></span>
          <h2 className="text-base font-bold md:text-lg">Signup To Newsletter</h2>
        </div>
        <form className="flex min-h-14 w-full max-w-2xl overflow-hidden border border-[#ded2c4] bg-white shadow-[0_8px_24px_rgba(11,31,58,0.10)] transition focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/20" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input id="newsletter-email" name="email" type="email" required placeholder="Enter your email address" className="min-w-0 flex-1 bg-white px-7 py-3 text-base text-brand-navy outline-none placeholder:text-brand-muted" />
          <button type="submit" className="min-w-28 shrink-0 bg-brand-orange px-7 py-3 text-sm font-extrabold text-white transition hover:bg-brand-navy focus-visible:bg-brand-navy">SignUp</button>
        </form>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { data } = useProducts({ sort: "newest", per_page: 70 });
  const products = data?.data ?? [];
  return (
    <main className="bg-white">
      <h1 className="sr-only">Wholesale Disposable Vapes in New Hampshire</h1>
      <HeroCarousel />
      <CategoryGrid />
      <ProductSection title="New Arrivals" products={products.slice(0, 14)} />
      <ProductSection title="Top Disposables" products={products.slice(14, 28)} />
      <ProductSection title="Top E-Liquid" products={products.slice(28, 42)} />
      <ProductSection title="Top Cigar" products={products.slice(42, 56)} />
      <ProductSection title="7-Hydroxymitragynine" products={products.slice(56, 70)} />
      <BrandStrip />
      <CatalogSection />
      <NewsletterSection />
    </main>
  );
}
