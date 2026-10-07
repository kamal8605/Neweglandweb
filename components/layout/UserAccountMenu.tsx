"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const MENU_ITEMS = [
  { label: "EDIT PROFILE", href: "/account/profile" },
  { label: "MANAGE ADDRESSES", href: "/account/addresses" },
  { label: "RESET PASSWORD", href: "/account/password" },
  { label: "YOUR ORDERS", href: "/orders" },
  { label: "WISHLIST", href: "/wishlist" },
];

export function UserAccountMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await logout();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 cursor-pointer items-center gap-1 rounded-md border-none bg-transparent px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.04em] text-background/80 transition-colors hover:bg-background/10 hover:text-background lg:min-h-0"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {user?.name}
        <svg
          width="8"
          height="5"
          viewBox="0 0 8 5"
          fill="none"
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
          <div className="border-b border-border px-4 pb-3 pt-3">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Account</p>
            <p className="mt-1 truncate text-xs font-medium text-foreground">{user?.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
          </div>

          <nav className="py-1">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-[11px] font-medium tracking-[0.04em] text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-border py-1">
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer border-none bg-transparent px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.04em] text-destructive transition-colors hover:bg-destructive/10"
            >
              SIGN OUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
