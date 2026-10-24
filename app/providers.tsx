"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { getQueryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SiteConfigProvider, type HomepagePayload } from "@/context/SiteConfigContext";

export function Providers({ children, initialHomepage }: { children: ReactNode; initialHomepage?: HomepagePayload | null }) {
  // Not useState: per TanStack's guidance the client must not be lost if a render suspends before mounting.
  const queryClient = getQueryClient();
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
