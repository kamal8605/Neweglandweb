"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface PriceGateProps {
  pricesVisible: boolean;
  children: ReactNode;
}

export function PriceGate({ pricesVisible, children }: PriceGateProps) {
  const { isAuthenticated, isApproved } = useAuth();

  if (!pricesVisible) {
    if (isAuthenticated && !isApproved) {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-brand-muted">
          <Lock size={11} />
          Pending approval
        </span>
      );
    }
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1 font-mono text-[11px] text-brand-blue hover:text-brand-blue-deep transition-colors no-underline"
      >
        <Lock size={11} />
        Sign in to see prices
      </Link>
    );
  }

  return <>{children}</>;
}
