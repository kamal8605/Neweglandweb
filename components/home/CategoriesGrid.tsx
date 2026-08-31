"use client";

import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  { id: 1, title: "Zenith", href: "/brand/zenith", image: "https://centralsmokedistro.com/wp-content/uploads/2024/12/ZENITH-E-LIQUIED-1-1-png.webp" },
  { id: 2, title: "Zig-Zag", href: "/brand/zig-zag", image: "https://centralsmokedistro.com/wp-content/uploads/2024/05/zig-zag.webp" },
  { id: 3, title: "Ooze", href: "/brand/ooze", image: "https://centralsmokedistro.com/wp-content/uploads/2024/05/ooze.webp" },
  { id: 4, title: "RAW", href: "/brand/raw", image: "https://centralsmokedistro.com/wp-content/uploads/2024/05/raw.webp" },
];

export function CategoriesGrid() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 my-8">
      {/* OUR CATEGORIES Ribbon Banner */}
      <div className="relative w-full h-[36px] md:h-[48px] mb-4">
        <Image
          src="https://centralsmokedistro.com/wp-content/uploads/2024/05/our-categories.webp"
          alt="OUR CATEGORIES"
          fill
          className="object-contain"
        />
      </div>

      {/* "Most Sought-after Items" Video Banner */}
      <div className="relative w-full h-[100px] md:h-[140px] rounded-lg overflow-hidden my-6 shadow-sm bg-black">
        <video
          src="https://centralsmokedistro.com/wp-content/uploads/2026/06/Banner-1-ezgif.com-gif-maker.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* 4 Category Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="relative block w-full aspect-[4/3] rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
