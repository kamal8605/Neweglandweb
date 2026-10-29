"use client";

import { useSiteConfig } from "@/context/SiteConfigContext";
import { nicotineWarning } from "@/lib/homepage";

/** Site-wide warning bar above the header; the text is managed in the admin (site_settings.nicotine_warning). */
export function NicotineWarning() {
  const { site } = useSiteConfig();
  const text = nicotineWarning(site);
  if (!text) return null;
  return (
    <div className="bg-foreground py-2 text-center text-background">
      <p className="site-container text-[11px] font-bold uppercase leading-snug tracking-[0.04em] sm:text-xs lg:text-[13px]">{text}</p>
    </div>
  );
}
