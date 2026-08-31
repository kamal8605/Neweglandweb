"use client";

import Image from "next/image";
import Link from "next/link";

const BRANDS = [
  { id: 1, name: "Puffco", slug: "puffco", video: "https://centralsmokedistro.com/wp-content/uploads/2026/06/puffco-1.mp4", fallback: "https://centralsmokedistro.com/wp-content/uploads/2026/05/PUFFCO-1.gif" },
  { id: 2, name: "OPMS", slug: "opms", video: "https://centralsmokedistro.com/wp-content/uploads/2026/06/OPMS.mp4", fallback: "https://centralsmokedistro.com/wp-content/uploads/2026/05/OPMS-1.gif" },
  { id: 3, name: "Coastal Clouds", slug: "coastal-clouds", video: "https://centralsmokedistro.com/wp-content/uploads/2026/06/Coastal-Clouds.mp4", fallback: "https://centralsmokedistro.com/wp-content/uploads/2026/05/COSTAL-CLOUDS-1.gif" },
  { id: 4, name: "Smok", slug: "smok", video: "https://centralsmokedistro.com/wp-content/uploads/2026/06/Smoke.mp4", fallback: "https://centralsmokedistro.com/wp-content/uploads/2026/05/SMOK-1.gif" },
  { id: 5, name: "Formula 420", slug: "formula-420", video: "https://centralsmokedistro.com/wp-content/uploads/2026/06/Formula-420_2.mp4", fallback: "https://centralsmokedistro.com/wp-content/uploads/2026/06/qu5rvti86gdqjyxeejy32-ezgif.com-optimize.gif" },
  { id: 6, name: "Raw", slug: "raw", video: "https://centralsmokedistro.com/wp-content/uploads/2026/06/Raw.mp4", fallback: "https://centralsmokedistro.com/wp-content/uploads/2026/06/lcprguxgubnyu3bmtu7u1-ezgif.com-optimize.gif" },
  { id: 7, name: "Blazy Susan", slug: "blazy-susan", video: "https://centralsmokedistro.com/wp-content/uploads/2026/06/Blazy-Susan.mp4", fallback: "https://centralsmokedistro.com/wp-content/uploads/2026/06/Blazy-Suzan-Logo.webp" },
];

export function HomeBrands() {
  return (
    <div className="w-full max-w-[1600px] mx-auto my-6 px-4">
      {/* Featured Brands Ribbon Graphic with Video Banner Option */}
      <div className="relative w-full h-[40px] md:h-[52px] mb-6 overflow-hidden rounded-md flex items-center justify-center">
        <Image
          src="https://centralsmokedistro.com/wp-content/uploads/2024/05/slider-1.webp"
          alt="FEATURED BRANDS"
          fill
          className="object-contain"
        />
      </div>

      {/* Circular Brand Badges with Autoplay Videos */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {BRANDS.map((brand) => (
          <Link
            key={brand.id}
            href={`/brand/${brand.slug}`}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden relative border-2 border-gray-100 shadow-md group-hover:scale-105 transition-transform duration-300 bg-black">
              <video
                src={brand.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-3 text-xs sm:text-sm font-bold text-gray-700 group-hover:text-[#215f93] transition-colors">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
