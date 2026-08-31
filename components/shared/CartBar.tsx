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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-navy text-white px-8 py-3 flex items-center justify-between font-mono text-[11.5px] tracking-[0.04em] shadow-[0_-2px_16px_rgba(0,0,0,0.2)]">
      {/* Left — cart summary */}
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2">
          <ShoppingCart size={14} className="text-[#9DAAC2]" />
          <span className="text-[#9DAAC2]">CART</span>
          <span className="bg-brand-orange text-white text-[10px] px-1.5 py-0.5 rounded-[var(--brand-radius)] leading-none">
            {itemCount}
          </span>
        </span>
        <span className="text-[#C8D2E5]">
          SUBTOTAL <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
        </span>
        {selectedCount !== undefined && selectedCount > 0 && (
          <span className="text-[#9DAAC2]">
            {selectedCount} SELECTED
          </span>
        )}
      </div>

      {/* Right — CTA buttons */}
      <div className="flex items-center gap-2">
        {onAddToCart && (
          <button
            onClick={onAddToCart}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white font-mono text-[11px] tracking-[0.08em] uppercase px-5 py-2 rounded-[var(--brand-radius)] transition-colors"
          >
            {cta}
          </button>
        )}
        <a
          href="/cart"
          className="border border-[#2A4A6E] hover:border-[#9DAAC2] text-[#C8D2E5] hover:text-white font-mono text-[11px] tracking-[0.08em] uppercase px-5 py-2 rounded-[var(--brand-radius)] transition-colors no-underline"
        >
          VIEW CART →
        </a>
      </div>
    </div>
  );
}
