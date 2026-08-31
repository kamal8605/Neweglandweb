"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";

export function FeaturedProducts() {
  const { data, isLoading } = useProducts({ page: 1, per_page: 8 });
  const { addItem } = useCart();

  const products = data?.data ?? [];

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    const price = product.current_price ?? product.sale_price ?? 0;
    
    addItem(
      {
        product_id: product.id,
        name: product.name,
        sku: product.sku || "",
        image: product.image,
        price,
        parent_id: product.parent_id,
        parent_name: null,
      },
      1
    );
    alert("Added to cart!");
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-end mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-ink m-0">
            Featured Products
          </h2>
          <p className="text-sm text-gray-500 mt-1">Top picks from our inventory</p>
        </div>
        <Link
          href="/shop"
          className="text-sm font-medium text-brand-orange hover:text-orange-700 flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-md mb-3" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </div>
            ))
          : products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group flex flex-col h-full bg-white rounded-md border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-50 p-4 flex items-center justify-center">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-gray-300 font-medium">No Image</div>
                  )}
                  {product.in_stock && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      In Stock
                    </span>
                  )}
                </div>
                
                <div className="p-4 flex flex-col flex-grow border-t border-gray-50">
                  <div className="text-xs text-brand-orange font-medium mb-1">
                    {product.brand?.name ?? "Central Smoke"}
                  </div>
                  <h3 className="text-sm font-medium text-brand-ink leading-snug mb-2 line-clamp-2 flex-grow">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                    <div className="font-bold text-lg text-brand-navy">
                      ${Number(product.current_price ?? product.sale_price ?? 0).toFixed(2)}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={!product.in_stock}
                      className="w-8 h-8 rounded-full bg-brand-bg-alt text-brand-ink flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors disabled:opacity-50"
                      title="Add to cart"
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
