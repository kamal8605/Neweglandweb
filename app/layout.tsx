import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-site",
  subsets: ["latin"],
});

const configuredTheme = process.env.NEXT_PUBLIC_THEME?.trim();
const siteTheme = configuredTheme === "pallet" ? "pallet" : "forge";

export async function generateMetadata(): Promise<Metadata> {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  const client = process.env.NEXT_PUBLIC_HOMEPAGE_CLIENT || "new-england";
  try {
    const response = await fetch(`${apiUrl}/api/homepage?client=${encodeURIComponent(client)}`, { next: { revalidate: 300 } });
    if (!response.ok) return {};
    const payload = await response.json() as { site?: { seo_title?: string; seo_description?: string } };
    return { title: payload.site?.seo_title, description: payload.site?.seo_description };
  } catch {
    return {};
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={siteTheme}
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
