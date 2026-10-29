"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { Download } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { appStoreLinks } from "@/lib/homepage";

/** Store links from the admin (site_settings.app_store_url / play_store_url); null when neither is set. */
function useAppLinks() {
  const { site } = useSiteConfig();
  const links = appStoreLinks(site);
  return links.appStore || links.playStore ? links : null;
}

export function GetAppButton() {
  const links = useAppLinks();
  if (!links) return null;
  return (
    <Link href="/get-our-app" className="hidden min-h-11 shrink-0 items-center gap-2 rounded-md border border-input bg-background px-4 text-[13px] font-semibold text-foreground no-underline shadow-xs transition-colors hover:border-primary/40 hover:bg-accent [&>svg]:text-primary xl:inline-flex">
      <Download size={16} aria-hidden="true" /> Get our app
    </Link>
  );
}

/** Floating button on phones (bottom-left), mirroring the original mobile storefront. */
export function MobileAppButton() {
  const links = useAppLinks();
  if (!links) return null;
  // Sends phones straight to their store when that link is set; everything else (and no-JS) lands on /get-our-app.
  function openStoreForDevice(event: MouseEvent<HTMLAnchorElement>) {
    const ua = navigator.userAgent;
    const store = /iPad|iPhone|iPod/.test(ua) ? links?.appStore : /android/i.test(ua) ? links?.playStore : null;
    if (!store) return;
    event.preventDefault();
    window.location.href = store;
  }
  return (
    <Link
      href="/get-our-app"
      onClick={openStoreForDevice}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-xs font-bold uppercase tracking-[0.08em] text-primary-foreground no-underline shadow-lg md:hidden"
    >
      <Download size={16} aria-hidden="true" /> Get our app
    </Link>
  );
}
