"use client";

import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const OFFICIAL_PLACEHOLDER = "https://centralsmokedistro.com/wp-content/uploads/2024/09/placeholder-1-1-1-1-300x300.jpg";

// Exact products from live site screenshot 2
const ORIGINAL_PRODUCTS_ROW1 = [
  {
    id: 101,
    name: "QUICK FIX PLUS",
    category: "Detox / Supplements / Health, Synthetic",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/07/svfIriFc6ABeqbmihl7FiUh3mbHs6hkd6ikWLlXu-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 102,
    name: "RAW TIPS BOX – PERFECTO 100 TIPS BOX OF 6",
    category: "Filters / Tips, Papers / Cones / Wraps",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/07/07B7rol7pvbU5k6IrV7cVi9yNdKZ1UGpK3k4KSwO-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 103,
    name: "SMOK NOVO 5 POD – MESH 0.70 OHMS",
    category: "Coils / Pods / Tanks, Vape Mods /",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/07/RgNyGIp2T5MzRpSg0g088QwSrzY0xiCsIlxrz8kN-300x300.jpeg",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 104,
    name: "RAW TIPS BOX – PERFECTO 21 TIPS BOX OF 20",
    category: "Filters / Tips, Papers / Cones / Wraps",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/07/EL9Cj4zjoBEDN6GmtKeltOdSwnJIWOLjYRT1MQFT-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 105,
    name: "RAW TIPS BOX – 100 TIP TIN BOX OF 6",
    category: "Filters / Tips, Papers / Cones / Wraps",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/07/ta0b0InydDFcS7eF1MTBITwkNQ1UXz3AcGlEU7rd-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 106,
    name: "X-STREAM FETISH URINE – 3FLOZ",
    category: "Detox / Supplements / Health, Synthetic",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/07/YmkUwxnUBSrpaZY1uekhiryLkOCSEPZ1whlMX8r5-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 107,
    name: "UWELL CALIBURN A2 REFILLABLE POD – 4PCS 0.90 OHM MESHED-H",
    category: "Coils / Pods / Tanks, Vape Mods /",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/07/rQwg3k4InSLl2RR3n3cBEV94I0f6It96DSjRAkQU-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
];

const ORIGINAL_PRODUCTS_ROW2 = [
  {
    id: 201,
    name: "SMOK NOVO X CLEAR POD 3PCS – DC 0.80 OHMS MTL",
    category: "Coils / Pods / Tanks, Vape Mods /",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/04/bQEdjQKTptbCfEhz31R8ZDZLYtzdEBv9HXWkZeeA-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 202,
    name: "SMOK NOVO 3 POD 3PCS – MESHED 0.80 OHMS",
    category: "Coils / Pods / Tanks, Vape Mods /",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/01/qPH8ODaC3CespCm3BMNRMPbpsDxANLjZ5kc7lMlB-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 203,
    name: "BUTTAS HOT GRABBA CHIPZ BOX OF 20",
    category: "Papers / Cones / Wraps, Tobacco Leaf /",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/04/IxpWH0KMcQ1KwmE9sg46y3AV37xuhv4WR7tYDsiO-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 204,
    name: "HOT HEAD GRABBA – BOX OF 30",
    category: "Papers / Cones / Wraps, Tobacco Leaf /",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/04/9KdZvqyVJuwufwI7TIqv3LdmDjMtuipjfotXiC5K-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 205,
    name: "UWELL CALIBURN X EMPTY CARTRIDGE 2PCS 3 ML",
    category: "Coils / Pods / Tanks, Vape Mods /",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/04/VBlDf1wycQrlZww1QbBhTmPMX0UqSfoq59OObkGn-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 206,
    name: "UWELL CALIBURN G COIL – 4PCS 0.80 OHMS UN2 MESHED-H",
    category: "Coils / Pods / Tanks, Vape Mods /",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/01/z3uMNmiMyKOYyTYH0ZsHQVFGFSJa6x96iKzgOoKw-300x300.png",
    isSoldOut: false,
    isNew: false,
  },
  {
    id: 207,
    name: "RAW ROLLING PAPER CONES BOX – 32 PACK 1 1/4 SIZE",
    category: "Cones / Wraps, Rolling Papers",
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/05/aZ0kPYDJ4YarWzR6UA0nhg83Uv6j5OLfJhTIRTZl-300x300.png",
    isSoldOut: true,
    isNew: false,
  },
];

interface ProductGridProps {
  titleText?: string;
  showComingSoonRow?: boolean;
  showRow2?: boolean;
}

export function ProductGrid6Col({ titleText, showComingSoonRow, showRow2 }: ProductGridProps) {
  const { data, isLoading } = useProducts({ page: 1, per_page: 7 });
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  let productsToDisplay = ORIGINAL_PRODUCTS_ROW1;
  if (showRow2) {
    productsToDisplay = ORIGINAL_PRODUCTS_ROW2;
  }

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    const price = product.current_price ?? product.sale_price ?? 0;
    addItem(
      {
        product_id: product.id,
        name: product.name,
        sku: product.sku || "",
        image: product.image || OFFICIAL_PLACEHOLDER,
        price,
        parent_id: product.parent_id,
        parent_name: null,
      },
      1
    );
    alert("Added to cart!");
  };

  return (
    <div className="w-full bg-white py-3">
      <div className="max-w-[1600px] mx-auto px-2 md:px-4">
        {/* Optional Title Banner if provided */}
        {titleText && (
          <div className="w-full h-[40px] bg-black flex items-center justify-center mb-4 relative overflow-hidden rounded">
            <div className="text-white font-bold tracking-[0.3em] italic text-xl md:text-2xl uppercase">
              {titleText}
            </div>
          </div>
        )}

        {/* 7 Column Grid matching screenshot 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3">
          {productsToDisplay.map((product) => {
            const productImageSrc = showComingSoonRow ? OFFICIAL_PLACEHOLDER : product.image;

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group flex flex-col bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden relative p-3 rounded"
              >
                {/* Top Bar with Category & Badges */}
                <div className="flex items-start justify-between gap-1 mb-2 min-h-[24px]">
                  <div className="flex items-center gap-1 flex-wrap">
                    {product.isSoldOut && (
                      <span className="bg-[#d90000] text-white text-[8px] font-bold px-1.5 py-0.5 rounded leading-none">
                        Sold Out
                      </span>
                    )}
                    <span className="text-[9px] text-gray-400 font-medium truncate max-w-[110px]">
                      {product.category}
                    </span>
                  </div>

                  {product.isNew && (
                    <span className="bg-[#159c15] text-white text-[8px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0">
                      New
                    </span>
                  )}
                </div>

                {/* Product Image */}
                <div className="aspect-square relative p-2 flex items-center justify-center bg-white my-1">
                  <Image
                    src={productImageSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 14vw"
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Details */}
                <div className="flex flex-col flex-grow text-left mt-2">
                  <h3 className="text-[11px] font-bold text-[#1a558a] leading-tight mb-3 line-clamp-2 min-h-[28px] group-hover:underline uppercase">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto">
                    {isAuthenticated ? (
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full bg-[#ececec] hover:bg-[#215f93] hover:text-white text-gray-700 text-[11px] font-bold py-1.5 px-2 rounded-full transition-colors border border-gray-200"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="w-full bg-[#ececec] hover:bg-gray-300 text-gray-600 text-[11px] font-bold py-1 px-2 rounded-full text-center border border-gray-200">
                        Login to Buy
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
