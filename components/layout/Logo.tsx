import Link from "next/link";

interface LogoProps {
  color?: string;
  size?: number;
}

export function Logo({ color = "#0B1F3A", size = 28 }: LogoProps) {
  // Renders as "Forge" + orange "&" + "Co." — customize via env
  const raw = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Forge & Co.";
  const [before, after] = raw.includes(" & ")
    ? raw.split(" & ")
    : [raw, null];

  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect x="2" y="2" width="28" height="28" rx="2" stroke={color} strokeWidth="2" />
        <path
          d="M10 10 L10 22 M10 10 L20 10 M10 16 L18 16"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="square"
        />
        <circle cx="22" cy="20" r="2.5" fill="#FF6B1A" />
      </svg>
      <span
        className="font-semibold text-[18px] tracking-tight leading-none"
        style={{ color }}
      >
        {before}
        {after !== null && (
          <>
            <span style={{ color: "#FF6B1A" }}>&</span>
            {after}
          </>
        )}
      </span>
    </Link>
  );
}
