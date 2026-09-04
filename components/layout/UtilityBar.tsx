"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Heart, Mail, Phone, Search, ShoppingCart, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { UserAccountMenu } from "./UserAccountMenu";
import { Logo } from "./Logo";

export function UtilityBar() {
  const { isAuthenticated, user } = useAuth();
  const { itemCount, subtotal } = useCart();
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = search.trim();
    if (!value) return;
    router.push(`/shop?search=${encodeURIComponent(value)}`);
    setSearch("");
  }

  if (!isAuthenticated) {
    return (
      <header className="border-t-[3px] border-brand-ink bg-white">
        <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center gap-5 px-4 py-3 lg:px-10">
          <Logo size={36} />

          <div className="mx-auto hidden items-center gap-7 text-[12px] text-brand-muted md:flex">
            <a href="tel:+19145395580" className="inline-flex items-center gap-2 text-brand-muted no-underline hover:text-brand-blue">
              <Phone size={14} /> +1 (914) 539-5580
            </a>
            <a href="mailto:info@forgesmokedistro.com" className="inline-flex items-center gap-2 text-brand-muted no-underline hover:text-brand-blue">
              <Mail size={15} /> info@forgesmokedistro.com
            </a>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <Link href="/login" className="inline-flex min-h-10 items-center gap-2 rounded-[var(--brand-radius)] bg-brand-navy px-5 text-xs font-bold text-white no-underline hover:bg-brand-blue-deep">
              <UserRound size={15} /> Login
            </Link>
            <Link href="/register" className="hidden min-h-10 items-center border border-brand-blue px-5 text-xs font-semibold text-brand-blue no-underline transition-colors hover:bg-brand-blue hover:text-white sm:inline-flex">
              Register for Wholesale
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white">
      <div className="border-b border-brand-line bg-brand-bg-alt px-4 py-2 text-[11px] text-brand-muted lg:px-10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <a href="tel:+19145395580" className="inline-flex items-center gap-1.5 text-brand-muted no-underline hover:text-brand-blue">
              <Phone size={12} /> +1 (914) 539-5580
            </a>
            <a href="mailto:info@forgesmokedistro.com" className="hidden items-center gap-1.5 text-brand-muted no-underline hover:text-brand-blue sm:inline-flex">
              <Mail size={13} /> info@forgesmokedistro.com
            </a>
          </div>
          {isAuthenticated ? (
            <nav className="hidden items-center gap-4 md:flex" aria-label="Account shortcuts">
              <span className="font-semibold text-brand-ink">Welcome, {user?.name}</span>
              <Link href="/orders" className="text-brand-muted no-underline hover:text-brand-blue">Orders</Link>
              <Link href="/account/addresses" className="text-brand-muted no-underline hover:text-brand-blue">Addresses</Link>
              <Link href="/account/profile" className="text-brand-muted no-underline hover:text-brand-blue">Account details</Link>
            </nav>
          ) : (
            <span className="hidden font-semibold uppercase tracking-[0.08em] sm:block">Wholesale accounts only</span>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-4 px-4 py-5 lg:flex-nowrap lg:gap-8 lg:px-10">
        <Logo size={48} />
        {isAuthenticated && (
          <form onSubmit={handleSearch} className="order-3 flex w-full overflow-hidden rounded-none border border-brand-line bg-white shadow-sm transition-all focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/15 lg:order-none lg:mx-auto lg:max-w-[720px]">
            <label htmlFor="site-search" className="sr-only">Search products, brands, or categories</label>
            <input id="site-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for products, brands or categories" className="h-12 min-w-0 flex-1 px-4 text-sm text-brand-ink outline-none placeholder:text-brand-muted" />
            <button type="submit" className="flex w-14 items-center justify-center border-l border-brand-navy bg-brand-navy text-white transition-colors hover:border-brand-blue hover:bg-brand-blue focus:outline-none focus-visible:bg-brand-blue" aria-label="Search"><Search size={21} /></button>
          </form>
        )}

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/wishlist" className="hidden min-h-12 flex-col items-center justify-center gap-1 rounded-none px-3 text-[10px] font-bold uppercase text-brand-muted no-underline transition-colors hover:bg-brand-orange-soft hover:text-brand-orange sm:flex"><Heart size={21} /><span>Wishlist</span></Link>
              <div className="rounded-none border border-brand-navy bg-brand-navy px-3 py-2.5 shadow-sm transition-colors hover:bg-brand-blue-deep"><UserAccountMenu /></div>
            </>
          ) : (
            <Link href="/login" className="inline-flex items-center gap-2 rounded-[var(--brand-radius)] bg-brand-navy px-4 py-3 text-xs font-bold uppercase text-white no-underline"><UserRound size={17} /> Login</Link>
          )}
          {isAuthenticated && (
            <Link href="/cart" className="group relative flex min-h-12 items-center gap-3 rounded-none border border-brand-line bg-brand-bg-alt px-3 text-brand-navy no-underline shadow-sm transition-all hover:border-brand-blue hover:bg-white" aria-label={`${itemCount} items in cart`}>
              <span className="relative transition-colors group-hover:text-brand-blue"><ShoppingCart size={26} />{itemCount > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-none bg-brand-orange px-1 text-[10px] font-black text-white">{itemCount}</span>}</span>
              <span className="hidden flex-col sm:flex"><span className="text-[10px] font-bold uppercase text-brand-muted">Cart</span><span className="text-sm font-black text-brand-navy">${subtotal.toFixed(2)}</span></span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
