import Image from "next/image";
import Link from "next/link";

const columns = [
  { title: "Categories", links: [["Disposables", "/shop?search=disposables"], ["E-Liquid", "/shop?search=e-liquid"], ["Salt E-Liquid", "/shop?search=salt%20e-liquid"], ["Kratom", "/shop?search=kratom"], ["Rolling Paper + Filters", "/shop?search=rolling%20paper"]] },
  { title: "Useful Links", links: [["Home", "/"], ["About", "/about"], ["Product Catalog", "/shop"], ["Contact Us", "mailto:sales@newenglanddistro.com"], ["Blog", "/blog"]] },
  { title: "Get Started", links: [["My Account", "/account/profile"], ["Registration", "/register"], ["Privacy Policy", "/privacy-policy"], ["Terms and Conditions", "/terms-and-conditions"]] },
];

const hours = ["Monday: 9:00 AM – 7:00 PM", "Tuesday: 9:00 AM – 7:00 PM", "Wednesday: 9:00 AM – 7:00 PM", "Thursday: 9:00 AM – 7:00 PM", "Friday: 9:00 AM – 7:00 PM", "Saturday: 9:00 AM – 7:00 PM", "Sunday: Closed"];

function LegalNotice() {
  return <div className="mt-16 space-y-4 text-xs leading-6 text-[#f2f2f2]"><p><strong>WARNING:</strong> This product is intended for use by persons 21 or older and not by children, pregnant or nursing women, or persons at risk of heart disease, high blood pressure, diabetes, or taking medicine for depression or asthma. Nicotine is highly addictive and habit forming. Keep out of reach of children.</p><p>Lithium-ion batteries are volatile. Use only approved charging devices, keep away from heat and water, and never leave charging devices unattended. Do not use damaged batteries or devices. Failure to follow warnings may result in fire, injury, or property damage.</p><p>All prices listed on the main site are base prices. Prices may change when options are selected.</p></div>;
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t-4 border-brand-orange bg-brand-navy text-white">
      <div className="mx-auto max-w-[1900px] px-5 pb-10 pt-9 md:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr_1fr_1.15fr] lg:gap-16">
          <div>
            <Link href="/" aria-label="New England Distribution home">
              <Image src="/images/brand/new-england-logo.png" alt="New England Smoke Distribution" width={180} height={180} className="h-44 w-44 object-contain" />
            </Link>
            <h3 className="mt-4 text-xl font-bold">Contact Info</h3>
            <address className="mt-2 space-y-1 text-sm not-italic leading-6 text-[#f2f2f2]">
              <p>460 Amherst Street, Nashua, New Hampshire<br />03063</p>
              <a href="tel:+16175486419" className="block hover:text-brand-orange">+1 617-548-6419</a>
              <a href="mailto:sales@newenglanddistro.com" className="block break-all hover:text-brand-orange">sales@newenglanddistro.com</a>
            </address>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-lg font-bold">{column.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {column.links.map(([label, href]) => <li key={label}><Link href={href} className="hover:text-brand-orange">{label}</Link></li>)}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-5 text-lg font-bold">Business Hours</h3>
            <ul className="space-y-1.5 text-sm">{hours.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <LegalNotice />
      </div>
      <div className="border-t border-white/15 bg-brand-bg px-5 py-5 text-center text-sm font-semibold text-brand-navy">Copyright © {year} New England Distribution. – All Rights Reserved</div>
    </footer>
  );
}
