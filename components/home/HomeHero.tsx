"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LEFT_SLIDES = [
  {
    id: 1,
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/06/raw-6.webp",
    alt: "RAW Natural Rolling Papers",
    link: "/brand/raw",
  },
  {
    id: 2,
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/06/image-2.webp",
    alt: "RAW Rolling Papers Hero Banner",
    link: "/brand/raw",
  },
];

const RIGHT_SLIDES = [
  {
    id: 1,
    image: "https://centralsmokedistro.com/wp-content/uploads/2026/06/jubi-3-1-1-450x347.webp",
    alt: "Jubi Next Level Chewables",
    link: "/brand/jubi",
  },
  {
    id: 2,
    image: "https://centralsmokedistro.com/wp-content/uploads/2025/05/Banner-Infuzd-1.jpg",
    alt: "Infuzd Wholesale",
    link: "/category/infuzd",
  },
];

export function HomeHero() {
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);

  // Auto swap every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % LEFT_SLIDES.length);
      setRightIndex((prev) => (prev + 1) % RIGHT_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLeftPrev = () => {
    setLeftIndex((prev) => (prev === 0 ? LEFT_SLIDES.length - 1 : prev - 1));
  };

  const handleLeftNext = () => {
    setLeftIndex((prev) => (prev + 1) % LEFT_SLIDES.length);
  };

  const handleRightPrev = () => {
    setRightIndex((prev) => (prev === 0 ? RIGHT_SLIDES.length - 1 : prev - 1));
  };

  const handleRightNext = () => {
    setRightIndex((prev) => (prev + 1) % RIGHT_SLIDES.length);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left Slider (RAW & Image 2) - full image containment */}
      <div className="relative group w-full aspect-[940/500] rounded-lg overflow-hidden shadow-sm bg-black/5">
        {LEFT_SLIDES.map((slide, idx) => (
          <Link
            key={slide.id}
            href={slide.link}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === leftIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-contain md:object-fill"
              priority={idx === 0}
            />
          </Link>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={handleLeftPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleLeftNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Right Slider (JUBI & Infuzd) - full image containment, no cut off text */}
      <div className="relative group w-full aspect-[940/500] rounded-lg overflow-hidden shadow-sm bg-[#041a13]">
        {RIGHT_SLIDES.map((slide, idx) => (
          <Link
            key={slide.id}
            href={slide.link}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === rightIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-contain md:object-fill"
              priority={idx === 0}
            />
          </Link>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={handleRightPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleRightNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
