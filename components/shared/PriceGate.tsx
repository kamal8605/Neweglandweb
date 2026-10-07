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
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
          <Lock size={11} />
          Pending approval
        </span>
      );
    }
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary no-underline transition-colors hover:text-primary/80"
      >
        <Lock size={11} />
        Sign in to see prices
      </Link>
    );
  }

  return <>{children}</>;
}
