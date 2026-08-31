import { Logo } from "./Logo";

const COLUMNS = [
  {
    heading: "For Retailers",
    links: ["Apply for an account", "Net-60 terms", "Free returns", "Order tracking"],
  },
  {
    heading: "For Brands",
    links: ["Sell on Forge", "Brand handbook", "Logistics", "Payouts"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
];

export function Footer() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Forge & Co.";
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-[#C8D2E5] px-8 pt-14 pb-7">
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 max-w-7xl mx-auto">
        {/* Brand column */}
        <div>
          <Logo color="#FFFFFF" />
          <p className="text-[13px] leading-relaxed mt-4 text-[#9DAAC2] max-w-[280px]">
            A wholesale marketplace built for independent retailers. 600+ vetted brands,
            one invoice, sixty-day terms.
          </p>
        </div>

        {/* Link columns */}
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h4 className="font-mono text-[11px] tracking-[0.08em] uppercase text-brand-orange mb-3.5 font-medium">
              {col.heading}
            </h4>
            <ul className="space-y-2">
              {col.links.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[13px] text-[#C8D2E5] hover:text-white transition-colors no-underline"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-5 border-t border-[#1E3358] flex justify-between items-center font-mono text-[10px] tracking-[0.06em] uppercase text-[#6B7A95] max-w-7xl mx-auto">
        <span>© {year} {companyName} Wholesale Inc.</span>
        <span>Brooklyn · Portland · Chicago</span>
      </div>
    </footer>
  );
}
