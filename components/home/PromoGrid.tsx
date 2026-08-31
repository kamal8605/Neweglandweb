"use client";

import Image from "next/image";
import Link from "next/link";

const PROMOS = [
  { id: 1, title: "Infuzd", href: "/category/infuzd", image: "https://centralsmokedistro.com/wp-content/uploads/2025/05/Banner-Infuzd-1.jpg" },
  { id: 2, title: "7-Hydroxy", href: "/category/7-hydroxy", image: "https://centralsmokedistro.com/wp-content/uploads/2025/05/IMG-20250417-WA0001.jpg" },
  { id: 3, title: "Juice", href: "/category/juice", image: "https://centralsmokedistro.com/wp-content/uploads/2025/05/IMG-20250502-WA0003.jpg" },
  { id: 4, title: "Vaporizers", href: "/category/vaporizers", image: "https://centralsmokedistro.com/wp-content/uploads/2025/05/IMG-20250430-WA0000.jpg" },
];

export function PromoGrid() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROMOS.map((promo) => (
          <Link
            key={promo.id}
            href={promo.href}
            className="relative block w-full aspect-[4/5] rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
          >
            <Image
              src={promo.image}
              alt={promo.title}
              fill
              className="object-cover"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
