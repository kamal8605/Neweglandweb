"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { Logo } from "./Logo";

/**
 * Footer column. Below `md` it is an accordion (tap the title to open); from `md` up the title is a plain
 * heading and the content is always visible, so tablet and laptop layouts are unaffected by the toggle.
 */
function FooterSection({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`min-w-0 border-b border-white/15 md:border-0 ${className}`}>
      <h3 className="m-0">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex min-h-12 w-full items-center justify-between gap-3 text-left text-base font-bold leading-tight text-white md:pointer-events-none md:mb-5 md:min-h-0 md:cursor-default"
        >
          {title}
          <ChevronDown size={18} className={`shrink-0 text-white/70 transition-transform md:hidden ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </h3>
      <div className={`${open ? "block pb-5" : "hidden"} md:block md:pb-0`}>{children}</div>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { site } = useSiteConfig();
  const [legalOpen, setLegalOpen] = useState(false);
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
      <div className="mx-auto max-w-[1780px] px-5 pb-8 pt-8 sm:px-6 md:px-10 md:pt-10 xl:px-12 xl:pt-12">
        {/* Phone: stacked accordions. Tablet (md–lg): brand row, link columns, hours row. Laptop (xl+): one row. */}
        <div className="grid grid-cols-1 items-start gap-x-8 md:grid-cols-3 md:gap-y-10 xl:grid-cols-[1.35fr_.85fr_.9fr_1.15fr_1.35fr] xl:gap-x-12 2xl:gap-x-16">
          <div className="pb-6 md:col-span-3 md:flex md:items-start md:gap-10 md:pb-0 xl:col-span-1 xl:block">
            <div className="[&>a]:h-24! [&>a]:w-24! md:[&>a]:h-[124px]! md:[&>a]:w-[124px]!">
              <Logo size={124} />
            </div>
            <div className="mt-5 md:mt-0 xl:mt-6">
              {site.site_name && <h3 className="text-lg font-bold leading-tight">{site.site_name}</h3>}
              <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-white/80 md:mt-4 md:space-y-1.5">
                {site.address && <p className="whitespace-pre-line">{site.address}</p>}
                {site.phone && <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="block py-1 hover:text-brand-orange md:py-0">{site.phone}</a>}
                {site.email && <a href={`mailto:${site.email}`} className="block break-all py-1 hover:text-brand-orange md:py-0">{site.email}</a>}
              </address>
            </div>
          </div>

          {columns.map((column) => (
            <FooterSection key={column.title} title={column.title}>
              <ul className="space-y-1 text-sm leading-5 text-white/80 md:space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.url}`}>
                    <Link href={link.url} className="block py-2 transition-colors hover:text-brand-orange md:inline md:py-0">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </FooterSection>
          ))}

          {hours.length > 0 && (
            <FooterSection title={site.business_hours_title || "Business Hours"} className="md:col-span-3 xl:col-span-1">
              <ul className="space-y-2.5 text-sm leading-5 text-white/80 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-2.5 md:space-y-0 lg:grid-cols-3 xl:block xl:space-y-2.5">
                {hours.map((item) => {
                  const row = splitHours(item);
                  return (
                    <li key={item} className="grid grid-cols-[minmax(92px,auto)_1fr] gap-3">
                      <span>{row.day}</span>
                      {row.time && <span className="whitespace-nowrap">{row.time}</span>}
                    </li>
                  );
                })}
              </ul>
            </FooterSection>
          )}
        </div>

        {site.footer_legal_notice && (
          <div className="mt-8 border-t border-white/15 pt-6 md:mt-10 xl:mt-12">
            <p className={`whitespace-pre-line text-[11px] leading-5 text-white/65 ${legalOpen ? "" : "line-clamp-4 lg:line-clamp-none"}`}>
              {site.footer_legal_notice}
            </p>
            <button
              type="button"
              onClick={() => setLegalOpen((value) => !value)}
              aria-expanded={legalOpen}
              className="mt-2 inline-flex min-h-10 items-center text-xs font-bold uppercase tracking-wider text-brand-orange lg:hidden"
            >
              {legalOpen ? "Show less" : "Read more"}
            </button>
          </div>
        )}
      </div>
      {site.footer_copyright && (
        <div className="border-t border-white/15 bg-brand-bg px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs font-semibold leading-5 text-brand-navy sm:px-5 sm:text-sm">
          Copyright © {year} {site.footer_copyright}
        </div>
      )}
    </footer>
  );
}
