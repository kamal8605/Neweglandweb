"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteConfig } from "@/context/SiteConfigContext";

interface LogoProps {
  size?: number;
  loading?: "eager" | "lazy";
}

export function Logo({ size = 48, loading = "lazy" }: LogoProps) {
  const { site } = useSiteConfig();
  if (!site.logo_url) return null;
  return (
    <Link
      href="/"
      aria-label={`${site.site_name || "Website"} home`}
      className="relative block shrink-0 rounded-md no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ width: size, height: size }}
    >
      <Image
        src={site.logo_url}
        alt={site.site_name || "Website logo"}
        fill
        sizes={`${size}px`}
        loading={loading}
        className="object-contain"
      />
    </Link>
  );
}
