import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSiteSettings();
  const name = site.site_name || "New England Distribution";
  return {
    name,
    short_name: name,
    description: site.seo_description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
