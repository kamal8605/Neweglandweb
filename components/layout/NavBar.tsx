"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Brands", href: "/brands" },
  { label: "New Arrivals", href: "/new" },
  { label: "Sale", href: "/sale" },
  { label: "Curated", href: "/new" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  }

  function isActive(href: string) {
    if (href === "/shop") return pathname === "/shop" || pathname.startsWith("/category") || pathname.startsWith("/product");
    if (href === "/brands") return pathname === "/brands" || pathname.startsWith("/brand");
    return pathname.startsWith(href);
  }

  return (
    <nav className="bg-brand-bg border-b border-brand-line px-8 py-5 flex items-center gap-10">
      <Logo />

      {/* Nav links */}
      <div className="flex items-center gap-7">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              isActive(href)
                ? "text-brand-ink border-brand-orange"
                : "text-brand-muted border-transparent hover:text-brand-ink"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Search + Cart */}
      <div className="ml-auto flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 12,400+ products"
            className="w-80 h-[38px] pl-8 pr-3 border border-brand-line bg-brand-white text-[13px] text-brand-muted placeholder:text-brand-muted focus:outline-none focus:border-brand-blue rounded-[var(--brand-radius)]"
          />
        </form>

        <Link
          href="/cart"
          className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] uppercase text-brand-ink hover:text-brand-blue transition-colors"
        >
          {itemCount > 0 && (
            <span className="bg-brand-orange text-brand-white text-[10px] font-mono px-1.5 py-0.5 rounded-[var(--brand-radius)] leading-none">
              {itemCount}
            </span>
          )}
          <ShoppingCart size={16} />
          CART
        </Link>
      </div>
    </nav>
  );
}
