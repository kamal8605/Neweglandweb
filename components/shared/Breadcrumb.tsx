import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase text-brand-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-brand-line">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-ink transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-brand-ink">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
