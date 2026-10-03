"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { Mail, Minus, Phone, Plus } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { Logo } from "./Logo";

/**
 * Footer column.
 * - Below `xl` (phones and tablets, both orientations): an accordion. The title is a full-width, touch-sized button
 *   that smoothly expands/collapses its content, with a plus/minus indicator.
 * - From `xl` (laptop / desktop): a plain heading with the content always visible, so the multi-column footer is
 *   unchanged. The same content is shown by CSS only, so there is no layout jump when the window is resized.
 */
function FooterSection({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className={`min-w-0 border-b border-white/15 xl:border-0 ${className}`}>
      <h3 className="m-0">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-14 w-full items-center justify-between gap-4 text-left text-base font-bold leading-tight text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange xl:pointer-events-none xl:mb-5 xl:min-h-0 xl:cursor-default"
        >
          {title}
          <span aria-hidden="true" className="shrink-0 text-brand-orange xl:hidden">
            {open ? <Minus size={18} strokeWidth={2.25} /> : <Plus size={18} strokeWidth={2.25} />}
          </span>
        </button>
      </h3>
      {/* grid-rows 0fr -> 1fr animates the height without measuring; `invisible` keeps collapsed links out of the tab order. */}
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none xl:visible xl:grid-rows-[1fr] ${
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-5 xl:pb-0">{children}</div>
        </div>
      </div>
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
        {/* Phones/tablets: brand row + accordions (1 column, 2 columns from md). Laptop (xl+): one row of columns. */}
        <div className="grid grid-cols-1 items-start gap-x-12 md:grid-cols-2 xl:grid-cols-[1.35fr_.85fr_.9fr_1.15fr_1.35fr] xl:gap-x-12 2xl:gap-x-16">
          <div className="border-b border-white/15 pb-6 md:col-span-2 md:flex md:items-start md:gap-10 md:pb-8 xl:col-span-1 xl:block xl:border-0 xl:pb-0">
            <div className="[&>a]:h-20! [&>a]:w-20! sm:[&>a]:h-24! sm:[&>a]:w-24! md:[&>a]:h-[110px]! md:[&>a]:w-[110px]! xl:[&>a]:h-[124px]! xl:[&>a]:w-[124px]!">
              <Logo size={124} />
            </div>
            <div className="mt-5 min-w-0 md:mt-0 xl:mt-6">
              {site.site_name && <h3 className="text-lg font-bold leading-tight">{site.site_name}</h3>}
              <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-white/80 md:mt-4 xl:space-y-1.5">
                {site.address && <p className="whitespace-pre-line">{site.address}</p>}
                {site.phone && (
                  <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="flex min-h-11 items-center gap-2.5 hover:text-brand-orange xl:min-h-0">
                    <Phone size={15} className="shrink-0 text-brand-orange" aria-hidden="true" />
                    {site.phone}
                  </a>
                )}
                {site.email && (
                  <a href={`mailto:${site.email}`} className="flex min-h-11 items-start gap-2.5 break-all py-2.5 hover:text-brand-orange xl:min-h-0 xl:py-0">
                    <Mail size={15} className="mt-1 shrink-0 text-brand-orange" aria-hidden="true" />
                    {site.email}
                  </a>
                )}
              </address>
            </div>
          </div>

          {columns.map((column) => (
            <FooterSection key={column.title} title={column.title}>
              <ul className="text-sm leading-5 text-white/80 xl:space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.url}`}>
                    <Link href={link.url} className="block py-3 transition-colors hover:text-brand-orange xl:inline xl:py-0">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </FooterSection>
          ))}

          {hours.length > 0 && (
            <FooterSection title={site.business_hours_title || "Business Hours"}>
              <ul className="space-y-2.5 text-sm leading-5 text-white/80">
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
          <div className="mt-8 border-t border-white/15 pt-6 xl:mt-12 xl:border-t">
            <p className={`whitespace-pre-line text-[11px] leading-5 text-white/65 ${legalOpen ? "" : "line-clamp-4 xl:line-clamp-none"}`}>
              {site.footer_legal_notice}
            </p>
            <button
              type="button"
              onClick={() => setLegalOpen((value) => !value)}
              aria-expanded={legalOpen}
              className="mt-2 inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-wider text-brand-orange xl:hidden"
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
