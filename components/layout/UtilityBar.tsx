"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserAccountMenu } from "./UserAccountMenu";

export function UtilityBar() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-brand-navy text-[#C8D2E5] font-mono text-[11px] tracking-[0.04em] uppercase px-8 py-2 flex justify-between items-center">
      <span>FREE FREIGHT ON ORDERS OVER $500 · NET-60 TERMS AVAILABLE</span>

      <div className="flex items-center gap-6">
        <span className="hidden lg:inline">FOR RETAILERS</span>
        <span className="hidden lg:inline">FOR BRANDS</span>
        <span className="hidden lg:inline">HELP</span>
        {isAuthenticated ? (
          <UserAccountMenu />
        ) : (
          <Link href="/login" className="text-brand-orange hover:text-white transition-colors">
            SIGN IN
          </Link>
        )}
      </div>
    </div>
  );
}
