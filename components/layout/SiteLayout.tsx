import { type ReactNode } from "react";
import { UtilityBar } from "./UtilityBar";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <UtilityBar />
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
