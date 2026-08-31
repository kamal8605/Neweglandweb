// Product Details — with variants (flavors/scents)
function ProductDetails() {
  const { COLORS, Placeholder, StockDot, QtyStepper, CartBar, TBL } = window.FC;

  const variants = [
    { sku: 'MAR-1180', flavor: 'Bergamot', desc: 'Citrus, slightly bitter', cs: 24, w: 2.80, msrp: 6, stock: 8400, lead: '2d', tone: 'orange', tag: 'BEST', qty: 2 },
    { sku: 'MAR-1182', flavor: 'Fennel Honey', desc: 'Sweet, herbal', cs: 24, w: 2.80, msrp: 6, stock: 6280, lead: '2d', tone: 'orange', tag: 'NEW', qty: 1 },
    { sku: 'MAR-1184', flavor: 'Rose', desc: 'Floral, soft', cs: 24, w: 2.80, msrp: 6, stock: 5920, lead: '2d', tone: 'orange', tag: 'NEW', qty: 0 },
    { sku: 'MAR-1186', flavor: 'Cedar Mint', desc: 'Cooling, woody', cs: 24, w: 2.80, msrp: 6, stock: 4120, lead: '2d', tone: 'warm', qty: 0 },
    { sku: 'MAR-1188', flavor: 'Black Tea', desc: 'Tannic, dry', cs: 24, w: 2.80, msrp: 6, stock: 88, lead: '2d', tone: 'warm', tag: 'LOW', qty: 0 },
    { sku: 'MAR-1189', flavor: 'Unscented', desc: 'Plain beeswax + jojoba', cs: 24, w: 2.80, msrp: 6, stock: 3640, lead: '2d', tone: 'cool', qty: 0 },
  ];
  const totalQty = variants.reduce((a, v) => a + v.qty, 0);
  const totalCases = totalQty;
  const totalUnits = totalQty * 24;
  const subtotal = totalQty * 24 * 2.80;

  return (
    <div style={{ width: 1440, background: COLORS.bg, fontFamily: 'Geist, sans-serif' }}>
      <window.FC.UtilityBar />
      <window.FC.NavBar active="Shop" />

      <div style={{ padding: '14px 32px', borderBottom: `1px solid ${COLORS.line}`, background: COLORS.white, fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase' }}>
        SHOP / APOTHECARY / SKINCARE / MARLOW & SONS / <span style={{ color: COLORS.ink }}>LIP BALM</span>
      </div>

      {/* Hero — gallery + summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ background: COLORS.bgAlt, padding: 24, display: 'grid', gridTemplateColumns: '64px 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['orange', 'warm', 'cool', 'orange'].map((t, i) => (
              <div key={i} style={{ width: 64, height: 64, border: i === 0 ? `2px solid ${COLORS.ink}` : `1px solid ${COLORS.line}` }}>
                <Placeholder label="" tone={t} h="100%" w="100%"/>
              </div>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Placeholder label="Lip Balm · packaging shot" tone="orange" h="100%"/>
            <span style={{ position: 'absolute', top: 12, left: 12, background: COLORS.orange, color: COLORS.white, fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em', padding: '4px 8px' }}>BESTSELLER · 6 FLAVORS</span>
          </div>
        </div>

        <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10.5, letterSpacing: '0.1em', color: COLORS.blue, textTransform: 'uppercase', marginBottom: 6 }}>
            MARLOW & SONS · PORTLAND, OR
          </div>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 52, lineHeight: 0.98, margin: 0, color: COLORS.ink, fontWeight: 400, letterSpacing: '-0.01em' }}>
            Lip Balm <span style={{ fontStyle: 'italic', color: COLORS.blue }}>—</span><br/>6 flavors
          </h1>
          <div style={{ marginTop: 10, fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted, letterSpacing: '0.04em' }}>
            PARENT SKU · MAR-LB · 0.5 oz tin · case of 24
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 24 }}>
            {[
              { l: 'Wholesale', v: '$2.80', sub: '/ unit' },
              { l: 'Case price', v: '$67.20', sub: '× 24 units' },
              { l: 'MSRP', v: '$6.00' },
              { l: 'Margin', v: '53%', color: COLORS.blue },
              { l: 'Lead time', v: '2 days' },
              { l: 'Min. cases', v: '1' },
              { l: 'Total stock', v: '28,448' },
              { l: 'Variants', v: '6' },
            ].map(s => (
              <div key={s.l} style={{ borderTop: `1px solid ${COLORS.line}`, padding: '10px 8px', borderRight: `1px solid ${COLORS.line}` }}>
                <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 9.5, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase' }}>{s.l}</div>
                <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 14, color: s.color || COLORS.ink, marginTop: 4, fontWeight: 600 }}>
                  {s.v} {s.sub && <span style={{ fontWeight: 400, color: COLORS.muted, fontSize: 11 }}>{s.sub}</span>}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13.5, lineHeight: 1.55, color: COLORS.muted, marginTop: 20, marginBottom: 0 }}>
            Beeswax base with jojoba and shea. Hand-poured into recycled aluminum tins, sleeved in
            kraft paper. Sells through fast at the register — buyers typically reorder every 6 weeks.
            Mix flavors freely; case minimum applies per variant.
          </p>

          <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', gap: 18, fontFamily: 'Geist Mono, monospace', fontSize: 10.5, letterSpacing: '0.06em', color: COLORS.muted, textTransform: 'uppercase' }}>
            <span>★ SAVE</span>
            <span>↓ TEAR SHEET</span>
            <span>⌘ COMPARE</span>
            <span>SHARE</span>
          </div>
        </div>
      </div>

      {/* VARIANTS TABLE — the buyer's main interaction */}
      <div style={{ padding: '24px 32px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: COLORS.ink, margin: 0, fontWeight: 400, letterSpacing: '-0.01em' }}>
            Choose flavors <span style={{ color: COLORS.muted, fontStyle: 'italic' }}>·</span> <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 12, color: COLORS.muted, letterSpacing: '0.06em' }}>6 VARIANTS</span>
          </h2>
          <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10.5, letterSpacing: '0.06em', color: COLORS.muted, textTransform: 'uppercase' }}>ALL VARIANTS · 1 CASE = 24 UNITS · $2.80/UNIT</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', background: COLORS.white }}>
          <thead>
            <tr>
              <th style={{ ...TBL.th, width: 28 }}><span style={{ width: 12, height: 12, border: `1.5px solid ${COLORS.line}`, display: 'inline-block' }}/></th>
              <th style={{ ...TBL.th, width: 56 }}>Img</th>
              <th style={{ ...TBL.th, width: 100 }}>SKU</th>
              <th style={TBL.th}>Flavor</th>
              <th style={TBL.th}>Profile</th>
              <th style={{ ...TBL.th, width: 70, textAlign: 'right' }}>Case</th>
              <th style={{ ...TBL.th, width: 90, textAlign: 'right' }}>WHSL/unit</th>
              <th style={{ ...TBL.th, width: 100, textAlign: 'right' }}>WHSL/case</th>
              <th style={{ ...TBL.th, width: 120 }}>Stock</th>
              <th style={{ ...TBL.th, width: 60 }}>Lead</th>
              <th style={{ ...TBL.th, width: 110, textAlign: 'right' }}>Cases</th>
              <th style={{ ...TBL.th, width: 90, textAlign: 'right' }}>Line $</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, i) => (
              <tr key={v.sku} style={{ background: i % 2 ? COLORS.bg : COLORS.white }}>
                <td style={TBL.td}><span style={{ width: 12, height: 12, border: `1.5px solid ${v.qty > 0 ? COLORS.blue : COLORS.line}`, background: v.qty > 0 ? COLORS.blue : COLORS.white, display: 'inline-block' }}/></td>
                <td style={TBL.td}><div style={{ width: 36, height: 36 }}><Placeholder label="" tone={v.tone} h="100%" w="100%"/></div></td>
                <td style={{ ...TBL.td, fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted }}>{v.sku}</td>
                <td style={TBL.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 500, color: COLORS.ink }}>{v.flavor}</span>
                    {v.tag && <span style={{ background: window.FC.tagColor(v.tag), color: COLORS.white, fontFamily: 'Geist Mono, monospace', fontSize: 9, letterSpacing: '0.06em', padding: '1px 5px' }}>{v.tag}</span>}
                  </div>
                </td>
                <td style={{ ...TBL.td, color: COLORS.muted, fontStyle: 'italic', fontFamily: 'Instrument Serif, serif', fontSize: 14 }}>{v.desc}</td>
                <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>×{v.cs}</td>
                <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontWeight: 600, fontSize: 13 }}>${v.w.toFixed(2)}</td>
                <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>${(v.w * v.cs).toFixed(2)}</td>
                <td style={TBL.td}><StockDot n={v.stock}/></td>
                <td style={{ ...TBL.td, fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>{v.lead}</td>
                <td style={{ ...TBL.td, textAlign: 'right' }}><QtyStepper value={v.qty}/></td>
                <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontWeight: 600, fontSize: 13, color: v.qty > 0 ? COLORS.ink : COLORS.muted }}>
                  {v.qty > 0 ? `$${(v.qty * v.cs * v.w).toFixed(2)}` : '—'}
                </td>
              </tr>
            ))}
            <tr style={{ background: COLORS.bgAlt }}>
              <td colSpan="6" style={{ ...TBL.td, fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.ink, fontWeight: 500 }}>
                TOTAL · MAR-LB
              </td>
              <td colSpan="2" style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted }}>
                {totalCases} cases · {totalUnits} units
              </td>
              <td colSpan="3"></td>
              <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontWeight: 700, fontSize: 14 }}>${subtotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: 14 }}>
          <CartBar
            left={<>
              <span><span style={{ color: COLORS.orange }}>◉</span> 2 OF 6 VARIANTS SELECTED</span>
              <span style={{ color: '#9DAAC2' }}>{totalCases} CASES · {totalUnits} UNITS</span>
              <span style={{ color: '#9DAAC2' }}>LINE TOTAL <span style={{ color: COLORS.white, fontWeight: 600 }}>${subtotal.toFixed(2)}</span></span>
            </>}
            right={<>
              <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: COLORS.white, padding: '6px 12px', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em' }}>ADD ALL FLAVORS · 1 EACH</button>
              <button style={{ background: COLORS.orange, border: 'none', color: COLORS.white, padding: '6px 14px', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em', fontWeight: 600 }}>ADD TO CART →</button>
            </>}
          />
        </div>
      </div>

      {/* Spec + ingredient strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: `1px solid ${COLORS.line}`, marginTop: 16 }}>
        {[
          { h: 'Specifications', items: [
            ['Net weight', '0.5 oz / 14 g'],
            ['Tin diameter', '1.85 in'],
            ['Case dim.', '8 × 6 × 2 in'],
            ['Case weight', '1.4 lb'],
            ['UPC', '0-63912-1804x-7'],
            ['HS code', '3304.10.00'],
          ]},
          { h: 'Ingredients', items: [
            ['Base', 'Beeswax, jojoba, shea butter'],
            ['Sweetener', 'Stevia (trace)'],
            ['Sourcing', 'USA (Oregon)'],
            ['Certifications', 'Leaping Bunny, Vegan-OK'],
            ['Allergens', 'None declared'],
            ['Shelf life', '24 months unopened'],
          ]},
          { h: 'Logistics', items: [
            ['Ships from', 'Portland, OR · 97214'],
            ['Lead time', '2 business days'],
            ['Carrier', 'UPS Ground / LTL'],
            ['Returns', 'Free on openers'],
            ['Refill', 'Yes · 8oz pouch SKU'],
            ['Restock fee', 'None'],
          ]},
        ].map((c, i) => (
          <div key={c.h} style={{ padding: '24px 28px', borderRight: i < 2 ? `1px solid ${COLORS.line}` : 'none' }}>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.orange, marginBottom: 14 }}>{c.h}</div>
            {c.items.map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${COLORS.line}`, fontSize: 12.5 }}>
                <span style={{ color: COLORS.muted }}>{l}</span>
                <span style={{ color: COLORS.ink, fontFamily: 'Geist Mono, monospace', fontSize: 11.5 }}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <window.FC.Footer />
    </div>
  );
}
window.ProductDetails = ProductDetails;
