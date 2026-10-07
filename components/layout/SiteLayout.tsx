import { type ReactNode } from "react";
import { UtilityBar } from "./UtilityBar";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";


export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
     
      <UtilityBar />
      <NavBar />
      {/* At least one screen tall: pages that load their content on the client would otherwise show the footer
          first and then push it down (layout shift). */}
      <main className="min-h-svh flex-1">{children}</main>
      <Footer />
    </div>
  );
}
