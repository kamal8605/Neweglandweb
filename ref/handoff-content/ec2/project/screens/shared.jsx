// Shared design tokens & primitives for Forge & Co. B2B
const COLORS = {
  bg: '#F7F4EE',
  bgAlt: '#EFEAE0',
  ink: '#0A0A0A',
  navy: '#0B1F3A',
  muted: '#5A5751',
  line: '#D9D3C5',
  blue: '#1E5BFF',
  blueDeep: '#0E3FCC',
  orange: '#FF6B1A',
  orangeSoft: '#FFE8D6',
  white: '#FFFFFF',
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');
`;

// A subtly-striped SVG placeholder for product imagery
function Placeholder({ label, w = '100%', h = '100%', tone = 'warm', radius = 0 }) {
  const stripeA = tone === 'cool' ? '#D6DEEC' : tone === 'orange' ? '#FFD9BD' : '#E5DFD0';
  const stripeB = tone === 'cool' ? '#C6D0E2' : tone === 'orange' ? '#FFC499' : '#D9D3C5';
  const fg = tone === 'cool' ? '#3A4866' : tone === 'orange' ? '#7A3B12' : '#5A5751';
  return (
    <div style={{
      width: w, height: h, borderRadius: radius, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(135deg, ${stripeA} 0 14px, ${stripeB} 14px 28px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
        color: fg, textTransform: 'uppercase',
        background: 'rgba(247,244,238,0.9)', padding: '4px 8px', borderRadius: 2,
      }}>{label}</span>
    </div>
  );
}

// Brand monogram mark
function Mark({ size = 28, color = '#0B1F3A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx="2" stroke={color} strokeWidth="2"/>
      <path d="M10 10 L10 22 M10 10 L20 10 M10 16 L18 16" stroke={color} strokeWidth="2.4" strokeLinecap="square"/>
      <circle cx="22" cy="20" r="2.5" fill="#FF6B1A"/>
    </svg>
  );
}

function Logo({ color = '#0B1F3A' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Mark color={color}/>
      <span style={{
        fontFamily: 'Geist, sans-serif', fontWeight: 600, fontSize: 18,
        color, letterSpacing: '-0.01em',
      }}>Forge<span style={{ color: '#FF6B1A' }}>&</span>Co.</span>
    </div>
  );
}

// Top utility bar
function UtilityBar() {
  return (
    <div style={{
      background: COLORS.navy, color: '#C8D2E5',
      fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.04em',
      padding: '8px 32px', display: 'flex', justifyContent: 'space-between',
      textTransform: 'uppercase',
    }}>
      <span>FREE FREIGHT ON ORDERS OVER $500 · NET-60 TERMS AVAILABLE</span>
      <div style={{ display: 'flex', gap: 24 }}>
        <span>FOR RETAILERS</span>
        <span>FOR BRANDS</span>
        <span>HELP</span>
        <span style={{ color: COLORS.orange }}>SIGN IN</span>
      </div>
    </div>
  );
}

// Main nav
function NavBar({ active }) {
  const items = ['Shop', 'Brands', 'New Arrivals', 'Sale', 'Curated'];
  return (
    <div style={{
      background: COLORS.bg, borderBottom: `1px solid ${COLORS.line}`,
      padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 40,
    }}>
      <Logo />
      <div style={{ display: 'flex', gap: 28, fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 500 }}>
        {items.map(i => (
          <span key={i} style={{
            color: i === active ? COLORS.ink : COLORS.muted,
            borderBottom: i === active ? `2px solid ${COLORS.orange}` : '2px solid transparent',
            paddingBottom: 4,
          }}>{i}</span>
        ))}
      </div>
      <div style={{
        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 320, height: 38, border: `1px solid ${COLORS.line}`, borderRadius: 2,
          padding: '0 12px', display: 'flex', alignItems: 'center', gap: 10,
          background: COLORS.white, fontSize: 13, color: COLORS.muted,
          fontFamily: 'Geist, sans-serif',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke={COLORS.muted} strokeWidth="1.4"/>
            <path d="M9.5 9.5 L13 13" stroke={COLORS.muted} strokeWidth="1.4"/>
          </svg>
          Search 12,400+ products
        </div>
        <div style={{
          fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.06em',
          color: COLORS.ink, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{
            background: COLORS.orange, color: COLORS.white, padding: '2px 6px', borderRadius: 2,
          }}>3</span>
          CART
        </div>
      </div>
    </div>
  );
}

// Footer
function Footer() {
  const cols = [
    { h: 'For Retailers', items: ['Apply for an account', 'Net-60 terms', 'Free returns', 'Order tracking'] },
    { h: 'For Brands', items: ['Sell on Forge', 'Brand handbook', 'Logistics', 'Payouts'] },
    { h: 'Company', items: ['About', 'Careers', 'Press', 'Contact'] },
  ];
  return (
    <div style={{
      background: COLORS.navy, color: '#C8D2E5', padding: '56px 32px 28px',
      fontFamily: 'Geist, sans-serif',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48 }}>
        <div>
          <Logo color={COLORS.white}/>
          <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 16, color: '#9DAAC2', maxWidth: 280 }}>
            A wholesale marketplace built for independent retailers. 600+ vetted brands, one invoice, sixty-day terms.
          </p>
        </div>
        {cols.map(c => (
          <div key={c.h}>
            <h4 style={{
              fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: COLORS.orange, marginBottom: 14, fontWeight: 500,
            }}>{c.h}</h4>
            {c.items.map(i => (
              <div key={i} style={{ fontSize: 13, marginBottom: 8, color: '#C8D2E5' }}>{i}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 48, paddingTop: 20, borderTop: '1px solid #1E3358',
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: '#6B7A95',
      }}>
        <span>© 2026 Forge & Co. Wholesale Inc.</span>
        <span>Brooklyn · Portland · Chicago</span>
      </div>
    </div>
  );
}

// ─── Shared dense-table primitives ──────────────────────────────────────
const tagColor = (t) =>
  t === 'NEW' ? COLORS.blue :
  t === 'LOW' ? COLORS.orange :
  t === 'BEST' ? COLORS.ink :
  t === 'SALE' ? '#B83434' :
  '#8A6A2E';

function StockDot({ n }) {
  const c = n < 100 ? COLORS.orange : n < 400 ? '#C8951A' : '#1F8A3A';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: c }}/>
      {n.toLocaleString()}
    </span>
  );
}

function QtyStepper({ value = 0 }) {
  return (
    <div style={{ display: 'inline-flex', border: `1px solid ${COLORS.line}`, height: 26, alignItems: 'stretch' }}>
      <span style={{ width: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${COLORS.line}`, color: COLORS.muted, fontSize: 13 }}>−</span>
      <span style={{ width: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>{value}</span>
      <span style={{ width: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderLeft: `1px solid ${COLORS.line}`, color: COLORS.ink, fontSize: 13, background: COLORS.bgAlt }}>+</span>
    </div>
  );
}

function CartBar({ left, right }) {
  return (
    <div style={{
      background: COLORS.navy, color: COLORS.white,
      padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: 'Geist Mono, monospace', fontSize: 11.5, letterSpacing: '0.04em',
    }}>
      <div style={{ display: 'flex', gap: 24 }}>{left}</div>
      <div style={{ display: 'flex', gap: 8 }}>{right}</div>
    </div>
  );
}

function PageHeader({ crumb, title, accent, meta, actions }) {
  return (
    <div style={{ padding: '20px 32px 16px', borderBottom: `1px solid ${COLORS.line}`, background: COLORS.white }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase' }}>{crumb}</span>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, lineHeight: 1, margin: 0, color: COLORS.ink, fontWeight: 400, letterSpacing: '-0.01em' }}>
            {title} {accent && <span style={{ color: COLORS.blue, fontStyle: 'italic' }}>{accent}</span>}
          </h1>
          {meta && <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted, letterSpacing: '0.04em' }}>{meta}</span>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 6, fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>{actions}</div>}
      </div>
    </div>
  );
}

const TBL = {
  th: {
    fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: COLORS.muted, textAlign: 'left',
    padding: '10px 10px', fontWeight: 500, borderBottom: `1px solid ${COLORS.line}`,
    background: COLORS.bgAlt,
  },
  td: {
    padding: '8px 10px', fontSize: 12.5, color: COLORS.ink,
    borderBottom: `1px solid ${COLORS.line}`, verticalAlign: 'middle',
  },
};

function ProductTable({ rows, showBrand = true, extraCols = [] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: COLORS.white }}>
      <thead>
        <tr>
          <th style={{ ...TBL.th, width: 28 }}><span style={{ width: 12, height: 12, border: `1.5px solid ${COLORS.line}`, display: 'inline-block' }}/></th>
          <th style={{ ...TBL.th, width: 56 }}>Img</th>
          <th style={{ ...TBL.th, width: 90 }}>SKU</th>
          <th style={TBL.th}>Product</th>
          {showBrand && <th style={{ ...TBL.th, width: 130 }}>Brand</th>}
          <th style={{ ...TBL.th, width: 70 }}>Size</th>
          <th style={{ ...TBL.th, width: 60, textAlign: 'right' }}>Case</th>
          <th style={{ ...TBL.th, width: 90, textAlign: 'right' }}>WHSL</th>
          <th style={{ ...TBL.th, width: 70, textAlign: 'right' }}>MSRP</th>
          {extraCols.map(c => <th key={c.key} style={{ ...TBL.th, width: c.w, textAlign: c.align || 'right' }}>{c.label}</th>)}
          <th style={{ ...TBL.th, width: 60, textAlign: 'right' }}>Margin</th>
          <th style={{ ...TBL.th, width: 110 }}>Stock</th>
          <th style={{ ...TBL.th, width: 50 }}>Lead</th>
          <th style={{ ...TBL.th, width: 110, textAlign: 'right' }}>Qty (cases)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p, i) => {
          const margin = Math.round(((p.msrp - p.w) / p.msrp) * 100);
          return (
            <tr key={p.sku} style={{ background: i % 2 ? COLORS.bg : COLORS.white }}>
              <td style={TBL.td}><span style={{ width: 12, height: 12, border: `1.5px solid ${COLORS.line}`, display: 'inline-block', verticalAlign: 'middle' }}/></td>
              <td style={TBL.td}><div style={{ width: 36, height: 36 }}><Placeholder label="" tone={p.tone} h="100%" w="100%"/></div></td>
              <td style={{ ...TBL.td, fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted }}>{p.sku}</td>
              <td style={TBL.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 500, color: COLORS.ink }}>{p.name}</span>
                  {p.tag && (
                    <span style={{ background: tagColor(p.tag), color: COLORS.white, fontFamily: 'Geist Mono, monospace', fontSize: 9, letterSpacing: '0.06em', padding: '1px 5px' }}>{p.tag}</span>
                  )}
                  {p.added && <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: COLORS.muted }}>· added {p.added}</span>}
                </div>
              </td>
              {showBrand && <td style={{ ...TBL.td, color: COLORS.blue, fontSize: 12 }}>{p.brand}</td>}
              <td style={{ ...TBL.td, fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>{p.size}</td>
              <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>×{p.cs || p.case}</td>
              <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontWeight: 600, fontSize: 13, color: p.discounted ? '#B83434' : COLORS.ink }}>${p.w.toFixed(2)}</td>
              <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted, textDecoration: p.wOriginal ? 'line-through' : 'none' }}>{p.wOriginal ? `$${p.wOriginal.toFixed(2)}` : `$${p.msrp.toFixed(2)}`}</td>
              {extraCols.map(c => <td key={c.key} style={{ ...TBL.td, textAlign: c.align || 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: c.color || COLORS.ink }}>{c.render(p)}</td>)}
              <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.blue }}>{margin}%</td>
              <td style={TBL.td}><StockDot n={p.stock}/></td>
              <td style={{ ...TBL.td, fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>{p.lead}</td>
              <td style={{ ...TBL.td, textAlign: 'right' }}><QtyStepper value={p.qty || 0}/></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

window.FC = { COLORS, FONTS, Placeholder, Mark, Logo, UtilityBar, NavBar, Footer, ProductTable, StockDot, QtyStepper, CartBar, PageHeader, TBL, tagColor };
