import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
}

export function Logo({ size = 48 }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="New England Smoke Distribution home"
      className="relative block shrink-0 no-underline"
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/brand/new-england-logo-clean.png"
        alt="New England Smoke Distribution"
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
