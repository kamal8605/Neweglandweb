"use client";

import Link from "next/link";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  const { site } = useSiteConfig();
  const columns = site.footer_columns ?? [];
  const hours = site.business_hours ?? [];

  function splitHours(value: string) {
    const separator = value.indexOf(":");
    return separator === -1
      ? { day: value, time: "" }
      : { day: value.slice(0, separator + 1), time: value.slice(separator + 1).trim() };
  }

  return (
    <footer className="border-t-4 border-brand-orange bg-brand-navy text-white">
      <div className="mx-auto max-w-[1780px] px-6 pb-8 pt-10 md:px-10 xl:px-12 xl:pt-12">
        <div className="grid items-start gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.35fr_.85fr_.9fr_1.15fr_1.35fr] xl:gap-x-12 2xl:gap-x-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo size={124} />
            {site.site_name && <h3 className="mt-6 text-lg font-bold leading-tight">{site.site_name}</h3>}
            <address className="mt-4 space-y-1.5 text-sm not-italic leading-6 text-white/80">
              {site.address && <p className="whitespace-pre-line">{site.address}</p>}
              {site.phone && <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="block hover:text-brand-orange">{site.phone}</a>}
              {site.email && <a href={`mailto:${site.email}`} className="block break-all hover:text-brand-orange">{site.email}</a>}
            </address>
          </div>
          {columns.map((column) => (
            <div key={column.title} className="min-w-0">
              <h3 className="mb-5 text-base font-bold leading-tight text-white">{column.title}</h3>
              <ul className="space-y-2.5 text-sm leading-5 text-white/80">
                {column.links.map((link) => <li key={`${link.label}-${link.url}`}><Link href={link.url} className="transition-colors hover:text-brand-orange">{link.label}</Link></li>)}
              </ul>
            </div>
          ))}
          {hours.length > 0 && <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            {site.business_hours_title && <h3 className="mb-5 text-base font-bold leading-tight text-white">{site.business_hours_title}</h3>}
            <ul className="space-y-2.5 text-sm leading-5 text-white/80">{hours.map((item) => { const row = splitHours(item); return <li key={item} className="grid grid-cols-[minmax(92px,auto)_1fr] gap-3"><span>{row.day}</span>{row.time && <span className="whitespace-nowrap">{row.time}</span>}</li>; })}</ul>
          </div>}
        </div>
        {site.footer_legal_notice && <div className="mt-10 whitespace-pre-line border-t border-white/15 pt-6 text-[11px] leading-5 text-white/65 xl:mt-12">{site.footer_legal_notice}</div>}
      </div>
      {site.footer_copyright && <div className="border-t border-white/15 bg-brand-bg px-5 py-4 text-center text-sm font-semibold text-brand-navy">Copyright © {year} {site.footer_copyright}</div>}
    </footer>
  );
}
