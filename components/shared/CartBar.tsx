"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartBarProps {
  /** Called when the user clicks "Add to cart" — undefined hides the button */
  onAddToCart?: () => void;
  cta?: string;
  /** Selection count for context-aware label, e.g. on browse pages */
  selectedCount?: number;
}

export function CartBar({ onAddToCart, cta = "ADD TO CART", selectedCount }: CartBarProps) {
  const { itemCount, subtotal } = useCart();

  if (itemCount === 0 && selectedCount === undefined) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border bg-card/95 px-4 py-3 text-[11.5px] tracking-[0.04em] text-card-foreground shadow-[0_-4px_18px_rgba(0,0,0,0.10)] backdrop-blur-md md:px-8">
      {/* Left — cart summary */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 md:gap-6">
        <span className="flex items-center gap-2">
          <ShoppingCart size={14} className="text-muted-foreground" />
          <span className="font-medium text-muted-foreground">CART</span>
          <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] leading-none text-primary-foreground">
            {itemCount}
          </span>
        </span>
        <span className="text-muted-foreground">
          SUBTOTAL <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
        </span>
        {selectedCount !== undefined && selectedCount > 0 && (
          <span className="text-muted-foreground">
            {selectedCount} SELECTED
          </span>
        )}
      </div>

      {/* Right — CTA buttons */}
      <div className="flex items-center gap-2">
        {onAddToCart && (
          <button
            onClick={onAddToCart}
            className="rounded-md bg-primary px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            {cta}
          </button>
        )}
        <a
          href="/cart"
          className="rounded-md border border-border bg-background px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground no-underline shadow-xs transition-colors hover:border-primary/50 hover:bg-accent"
        >
          VIEW CART →
        </a>
      </div>
    </div>
  );
}
