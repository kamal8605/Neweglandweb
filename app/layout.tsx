import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-site",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Disposable Vapes Wholesale - New Hampshire",
  description: "B2B wholesale ecommerce for indie retail buyers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={process.env.NEXT_PUBLIC_THEME ?? "forge"}
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
