"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import queryClient from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SiteConfigProvider, type HomepagePayload } from "@/context/SiteConfigContext";

export function Providers({ children, initialHomepage }: { children: ReactNode; initialHomepage?: HomepagePayload | null }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteConfigProvider initialHomepage={initialHomepage}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </SiteConfigProvider>
    </QueryClientProvider>
  );
}
