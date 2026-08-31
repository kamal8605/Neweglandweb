"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
    router.push("/login");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[#C8D2E5] hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 font-mono text-[11px] tracking-[0.04em] uppercase flex items-center gap-1"
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
        <div className="absolute right-0 top-full mt-2 w-52 bg-brand-navy border border-[#1E3A5F] shadow-lg z-50">
          <div className="px-4 pt-3 pb-2 border-b border-[#1E3A5F]">
            <p className="font-mono text-[10px] tracking-[0.06em] text-[#7A8EB0] uppercase">Account</p>
            <p className="font-mono text-[12px] text-white mt-0.5 truncate">{user?.name}</p>
            <p className="font-mono text-[10px] text-[#7A8EB0] truncate">{user?.email}</p>
          </div>

          <nav className="py-1">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 font-mono text-[11px] tracking-[0.04em] text-[#C8D2E5] hover:text-white hover:bg-[#1E3A5F] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[#1E3A5F] py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 font-mono text-[11px] tracking-[0.04em] uppercase text-brand-orange hover:text-white hover:bg-[#1E3A5F] transition-colors cursor-pointer bg-transparent border-none"
            >
              SIGN OUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
