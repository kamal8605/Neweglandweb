"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { StockDot } from "./StockDot";
import { PriceGate } from "./PriceGate";
import { type Product } from "@/hooks/useProducts";
import { imageVariant } from "@/lib/imageVariants";

export type ProductCardData = Pick<
  Product,
  "id" | "name" | "sku" | "brand" | "current_price" |
  "sale_price" | "regular_price" | "on_sale" | "in_stock" | "stock_quantity" |
  "prices_visible" | "image" | "image_variants"
>;

interface ProductCardProps {
  product: ProductCardData;
  onWishlistToggle?: (id: number) => void;
  wishlisted?: boolean;
}

function ImagePlaceholder() {
  return (
    <div
      className="w-full h-full"
      style={{
        background:
          "repeating-linear-gradient(135deg, var(--muted) 0 14px, var(--border) 14px 28px)",
      }}
    />
  );
}

export function ProductCard({ product, onWishlistToggle, wishlisted = false }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-md">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {product.image ? (
          <Image
            src={imageVariant(product.image, product.image_variants, 512)!}
            alt={product.name}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ImagePlaceholder />
        )}
        {product.on_sale && (
          <span className="absolute left-2 top-2 rounded-sm bg-destructive px-1.5 py-0.5 font-mono text-[9px] tracking-[0.06em] text-destructive-foreground shadow-sm">
            SALE
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="p-3">
        {product.brand?.name && (
          <Link
            href={product.brand.id ? `/brand/${product.brand.id}` : "#"}
            className="font-mono text-[10px] uppercase tracking-[0.06em] text-primary transition-colors hover:text-primary/80"
          >
            {product.brand.name}
          </Link>
        )}
        <Link href={`/product/${product.id}`} className="block mt-0.5">
          <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between gap-2">
          <PriceGate pricesVisible={product.prices_visible}>
            {product.on_sale && product.sale_price !== null ? (
              <span className="flex items-baseline gap-1.5 font-mono text-[13px]">
                <span className="font-semibold text-destructive">${product.sale_price.toFixed(2)}</span>
                <span className="text-[11px] text-muted-foreground line-through">${product.regular_price?.toFixed(2)}</span>
              </span>
            ) : (
              <span className="font-mono text-[13px] font-semibold text-foreground">
                {product.current_price !== null ? `$${product.current_price.toFixed(2)}` : "—"}
              </span>
            )}
          </PriceGate>

          <StockDot inStock={product.in_stock} stockQuantity={product.stock_quantity} />
        </div>
      </div>

      {/* Wishlist button */}
      {onWishlistToggle && (
        <button
          onClick={() => onWishlistToggle(product.id)}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-background/90 shadow-sm transition-colors hover:bg-background"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            className={wishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"}
          />
        </button>
      )}
    </div>
  );
}
