import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="relative bg-brand-navy min-h-[500px] flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-black to-transparent" />
      </div>
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="py-20 text-white">
          <div className="inline-block bg-brand-orange text-white px-3 py-1 font-mono text-[11px] tracking-widest uppercase mb-6 rounded-sm">
            Central Smoke Distro
          </div>
          <h1 className="text-5xl lg:text-6xl font-serif leading-tight mb-6">
            The Leading Disposable Vape Distributor.
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-lg">
            Premium brands, competitive prices, and fast, reliable delivery in White Plains and beyond.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="bg-brand-orange hover:bg-orange-600 text-white px-8 py-4 rounded-md font-medium flex items-center gap-2 transition-colors"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link
              href="/brand/juul"
              className="bg-transparent border border-white hover:bg-white hover:text-brand-navy text-white px-8 py-4 rounded-md font-medium transition-colors"
            >
              View Juul Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
