"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Heart, Mail, Phone, Search, ShoppingCart, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlistCount } from "@/hooks/useWishlist";
import { UserAccountMenu } from "./UserAccountMenu";
import { Logo } from "./Logo";
import { useSiteConfig } from "@/context/SiteConfigContext";

export function UtilityBar() {
  const { isAuthenticated, user } = useAuth();
  const { itemCount, subtotal } = useCart();
  const wishlistCount = useWishlistCount();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { site } = useSiteConfig();
  const phoneHref = site.phone ? `tel:${site.phone.replace(/[^+\d]/g, "")}` : undefined;
  const emailHref = site.email ? `mailto:${site.email}` : undefined;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = search.trim();
    if (!value) return;
    router.push(`/shop?search=${encodeURIComponent(value)}`);
    setSearch("");
  }

  if (!isAuthenticated) {
    return (
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center gap-5 px-4 py-3 lg:px-10">
          <Logo size={88} loading="eager" />

          <div className="mx-auto hidden items-center gap-7 text-xs text-muted-foreground md:flex">
            {site.phone && <a href={phoneHref} className="inline-flex items-center gap-2 no-underline transition-colors hover:text-primary"><Phone size={14} /> {site.phone}</a>}
            {site.email && <a href={emailHref} className="hidden items-center gap-2 no-underline transition-colors hover:text-primary lg:inline-flex"><Mail size={15} /> {site.email}</a>}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <Link href="/login" className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-5 text-xs font-semibold text-primary-foreground no-underline shadow-sm transition-colors hover:bg-primary/90">
              <UserRound size={15} /> {site.login_text}
            </Link>
            <Link href="/register" className="hidden min-h-10 items-center rounded-md border border-input bg-background px-5 text-xs font-semibold text-foreground no-underline shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-flex">
              {site.register_text}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="border-b border-border bg-muted/50 px-4 py-2 text-[11px] text-muted-foreground lg:px-10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {site.phone && <a href={phoneHref} className="inline-flex min-h-8 items-center gap-1.5 no-underline transition-colors hover:text-primary lg:min-h-0"><Phone size={12} /> {site.phone}</a>}
            {site.email && <a href={emailHref} className="hidden min-h-8 items-center gap-1.5 no-underline transition-colors hover:text-primary sm:inline-flex lg:min-h-0"><Mail size={13} /> {site.email}</a>}
          </div>
          {isAuthenticated ? (
            <nav className="hidden items-center gap-4 md:flex" aria-label="Account shortcuts">
              <span className="font-medium text-foreground">Welcome, {user?.name}</span>
              <Link href="/orders" className="inline-flex min-h-6 items-center no-underline transition-colors hover:text-primary">Orders</Link>
              <Link href="/account/addresses" className="inline-flex min-h-6 items-center no-underline transition-colors hover:text-primary">Addresses</Link>
              <Link href="/account/profile" className="inline-flex min-h-6 items-center no-underline transition-colors hover:text-primary">Account details</Link>
            </nav>
          ) : (
            <span className="hidden font-semibold uppercase tracking-[0.08em] sm:block">Wholesale accounts only</span>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-4 px-4 py-5 lg:flex-nowrap lg:gap-8 lg:px-10">
        <Logo size={88} loading="eager" />
        {isAuthenticated && (
          <form onSubmit={handleSearch} className="order-3 flex w-full overflow-hidden rounded-lg border border-input bg-background shadow-xs transition-shadow focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20 lg:order-none lg:mx-auto lg:max-w-[720px]">
            <label htmlFor="site-search" className="sr-only">Search products, brands, or categories</label>
            <input id="site-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={site.search_placeholder} className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            <button type="submit" className="flex w-14 items-center justify-center border-l border-primary bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:bg-primary/90" aria-label="Search"><Search size={21} /></button>
          </form>
        )}

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/wishlist" aria-label={`${wishlistCount} items in wishlist`} className="hidden min-h-12 flex-col items-center justify-center gap-1 rounded-md px-3 text-[10px] font-semibold uppercase text-muted-foreground no-underline transition-colors hover:bg-accent hover:text-accent-foreground sm:flex"><span className="relative"><Heart size={21} />{wishlistCount > 0 && <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">{wishlistCount}</span>}</span><span>Wishlist</span></Link>
              <div className="rounded-md border border-border bg-foreground text-background shadow-xs transition-colors hover:bg-foreground/90"><UserAccountMenu /></div>
            </>
          ) : (
            <Link href="/login" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-3 text-xs font-semibold uppercase text-primary-foreground no-underline shadow-sm transition-colors hover:bg-primary/90"><UserRound size={17} /> {site.login_text}</Link>
          )}
          {isAuthenticated && (
            <Link href="/cart" className="group relative flex min-h-12 items-center gap-3 rounded-lg border border-border bg-card px-3 text-foreground no-underline shadow-xs transition-colors hover:border-primary/40 hover:bg-accent" aria-label={`${itemCount} items in cart`}>
              <span className="relative transition-colors group-hover:text-primary"><ShoppingCart size={26} />{itemCount > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{itemCount}</span>}</span>
              <span className="hidden flex-col sm:flex"><span className="text-[10px] font-semibold uppercase text-muted-foreground">Cart</span><span className="text-sm font-bold text-foreground">${subtotal.toFixed(2)}</span></span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
