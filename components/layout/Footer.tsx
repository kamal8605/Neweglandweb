import Link from "next/link";
import { Logo } from "./Logo";

const columns = [
  { title: "Categories", links: [["Disposables", "/shop?search=disposables"], ["E-Liquid", "/shop?search=e-liquid"], ["Salt E-Liquid", "/shop?search=salt%20e-liquid"], ["Kratom", "/shop?search=kratom"], ["Rolling Paper + Filters", "/shop?search=rolling%20paper"]] },
  { title: "Useful Links", links: [["Home", "/"], ["About", "/about"], ["Product Catalog", "/shop"], ["Contact Us", "mailto:sales@newenglanddistro.com"], ["Blog", "/blog"]] },
  { title: "Get Started", links: [["My Account", "/account/profile"], ["Registration", "/register"], ["Privacy Policy", "/privacy-policy"], ["Terms and Conditions", "/terms-and-conditions"]] },
];

const hours = ["Monday: 9:00 AM – 7:00 PM", "Tuesday: 9:00 AM – 7:00 PM", "Wednesday: 9:00 AM – 7:00 PM", "Thursday: 9:00 AM – 7:00 PM", "Friday: 9:00 AM – 7:00 PM", "Saturday: 9:00 AM – 7:00 PM", "Sunday: Closed"];

function LegalNotice() {
  return <div className="mt-10 space-y-3 border-t border-white/15 pt-6 text-[11px] leading-5 text-white/70"><p><strong className="text-white">WARNING:</strong> This product is intended for use by persons 21 or older and not by children, pregnant or nursing women, or persons at risk of heart disease, high blood pressure, diabetes, or taking medicine for depression or asthma. Nicotine is highly addictive and habit forming. Keep out of reach of children.</p><p>Lithium-ion batteries are volatile. Use only approved charging devices, keep away from heat and water, and never leave charging devices unattended. Do not use damaged batteries or devices. Failure to follow warnings may result in fire, injury, or property damage.</p><p>All prices listed on the main site are base prices. Prices may change when options are selected.</p></div>;
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t-4 border-brand-orange bg-brand-navy text-white">
      <div className="mx-auto max-w-[1600px] px-5 pb-8 pt-10 md:px-10">
        <div className="grid items-start gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1.25fr] lg:gap-12">
          <div>
            <Logo size={128} />
            <h3 className="mt-5 text-lg font-bold">Contact Info</h3>
            <address className="mt-3 space-y-1.5 text-sm not-italic leading-6 text-white/80">
              <p>460 Amherst Street<br />Nashua, New Hampshire 03063</p>
              <a href="tel:+16175486419" className="block hover:text-brand-orange">+1 617-548-6419</a>
              <a href="mailto:sales@newenglanddistro.com" className="block break-all hover:text-brand-orange">sales@newenglanddistro.com</a>
            </address>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-base font-bold text-white">{column.title}</h3>
              <ul className="space-y-2.5 text-sm text-white/80">
                {column.links.map(([label, href]) => <li key={label}><Link href={href} className="hover:text-brand-orange">{label}</Link></li>)}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-5 text-base font-bold text-white">Business Hours</h3>
            <ul className="space-y-2 text-sm text-white/80">{hours.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <LegalNotice />
      </div>
      <div className="border-t border-white/15 bg-brand-bg px-5 py-4 text-center text-sm font-semibold text-brand-navy">Copyright © {year} New England Distribution. – All Rights Reserved</div>
    </footer>
  );
}
