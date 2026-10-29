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
import { GetAppButton } from "./AppDownload";
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

  return (
    <header className="border-b border-border bg-background">
      <div className="border-b border-border bg-muted/60 text-[12px] text-muted-foreground">
        <div className="site-container flex min-h-8 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-5">
            {site.phone && <a href={phoneHref} className="inline-flex min-h-9 items-center gap-1.5 no-underline transition-colors hover:text-primary"><Phone size={13} aria-hidden="true" /> {site.phone}</a>}
            {site.email && <a href={emailHref} className="hidden min-h-9 items-center gap-1.5 truncate no-underline transition-colors hover:text-primary sm:inline-flex"><Mail size={13} aria-hidden="true" /> {site.email}</a>}
          </div>
          {isAuthenticated ? (
            <nav className="hidden items-center gap-5 md:flex" aria-label="Account shortcuts">
              <span className="font-medium text-foreground">Welcome, {user?.name}</span>
              <Link href="/orders" className="inline-flex min-h-9 items-center no-underline transition-colors hover:text-primary">Orders</Link>
              <Link href="/account/addresses" className="inline-flex min-h-9 items-center no-underline transition-colors hover:text-primary">Addresses</Link>
              <Link href="/account/profile" className="inline-flex min-h-9 items-center no-underline transition-colors hover:text-primary">Account details</Link>
            </nav>
          ) : (
            <span className="hidden font-semibold uppercase tracking-[0.08em] text-foreground/70 sm:block">Wholesale accounts only</span>
          )}
        </div>
      </div>

      <div className="site-container flex flex-wrap items-center gap-x-4 gap-y-2.5 py-2.5 lg:flex-nowrap lg:gap-8 lg:py-2">
        {/* 56px on phones, 76px from lg (the logo is a round emblem, so it needs the height to stay legible). */}
        <div className="[&>a]:h-14! [&>a]:w-14! lg:[&>a]:h-[76px]! lg:[&>a]:w-[76px]!">
          <Logo size={76} loading="eager" />
        </div>

        <form onSubmit={handleSearch} role="search" className="order-3 flex w-full overflow-hidden rounded-lg border border-input bg-background shadow-xs transition-shadow focus-within:border-primary focus-within:ring-[3px] focus-within:ring-ring/30 lg:order-none lg:mx-auto lg:max-w-[680px]">
          <label htmlFor="site-search" className="sr-only">Search products, brands, or categories</label>
          <input id="site-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={site.search_placeholder} className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground lg:h-12" />
          <button type="submit" className="flex w-12 items-center justify-center bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:bg-primary/90 lg:w-14" aria-label="Search"><Search size={20} /></button>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <GetAppButton />
          {isAuthenticated ? (
            <>
              <Link href="/wishlist" aria-label={`${wishlistCount} items in wishlist`} className="hidden min-h-12 flex-col items-center justify-center gap-1 rounded-md px-3 text-[10px] font-semibold uppercase text-muted-foreground no-underline transition-colors hover:bg-accent hover:text-accent-foreground sm:flex"><span className="relative"><Heart size={21} />{wishlistCount > 0 && <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">{wishlistCount}</span>}</span><span>Wishlist</span></Link>
              <div className="rounded-md border border-border bg-foreground text-background shadow-xs transition-colors hover:bg-foreground/90"><UserAccountMenu /></div>
              <Link href="/cart" className="group relative flex min-h-12 items-center gap-3 rounded-lg border border-border bg-card px-3 text-foreground no-underline shadow-xs transition-colors hover:border-primary/40 hover:bg-accent" aria-label={`${itemCount} items in cart`}>
                <span className="relative transition-colors group-hover:text-primary"><ShoppingCart size={26} />{itemCount > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{itemCount}</span>}</span>
                <span className="hidden flex-col sm:flex"><span className="text-[10px] font-semibold uppercase text-muted-foreground">Cart</span><span className="text-sm font-bold text-foreground">${subtotal.toFixed(2)}</span></span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-semibold text-primary-foreground no-underline shadow-sm transition-colors hover:bg-primary/90 sm:px-5">
                <UserRound size={16} aria-hidden="true" /> {site.login_text}
              </Link>
              <Link href="/register" className="hidden min-h-11 items-center rounded-md border border-input bg-background px-5 text-[13px] font-semibold text-foreground no-underline shadow-xs transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground sm:inline-flex">
                {site.register_text}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
