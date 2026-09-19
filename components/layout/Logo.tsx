"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteConfig } from "@/context/SiteConfigContext";

interface LogoProps {
  size?: number;
}

export function Logo({ size = 48 }: LogoProps) {
  const { site } = useSiteConfig();
  if (!site.logo_url) return null;
  return (
    <Link
      href="/"
      aria-label={`${site.site_name || "Website"} home`}
      className="relative block shrink-0 no-underline"
      style={{ width: size, height: size }}
    >
      <Image
        src={site.logo_url}
        alt={site.site_name || "Website logo"}
        fill
        sizes={`${size}px`}
        priority
        quality={100}
        unoptimized
        className="object-contain"
      />
    </Link>
  );
}
