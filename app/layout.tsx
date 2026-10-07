import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { SITE_URL, getHomepagePayload, getSiteSettings } from "@/lib/site";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-site",
  subsets: ["latin"],
});

const configuredTheme = process.env.NEXT_PUBLIC_THEME?.trim();
const siteTheme = configuredTheme === "pallet" ? "pallet" : "forge";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  const siteName = site.site_name || "New England Distribution";
  const defaultTitle = site.seo_title || siteName;
  return {
    metadataBase: new URL(SITE_URL),
    // Child pages set a short title ("Shop", a product name, ...) and get " | Site name" appended.
    title: { default: defaultTitle, template: `%s | ${siteName}` },
    description: site.seo_description,
    applicationName: siteName,
    openGraph: {
      type: "website",
      siteName,
      title: defaultTitle,
      description: site.seo_description,
      images: site.logo_url ? [{ url: site.logo_url, alt: siteName }] : undefined,
    },
    twitter: { card: "summary", title: defaultTitle, description: site.seo_description },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const homepage = await getHomepagePayload();
  return (
    <html
      lang="en"
      data-theme={siteTheme}
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-ink">
        <Providers initialHomepage={homepage}>{children}</Providers>
      </body>
    </html>
  );
}
