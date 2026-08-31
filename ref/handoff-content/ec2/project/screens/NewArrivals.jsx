// New Arrivals — wide-net, ordered chronologically
function NewArrivals() {
  const { COLORS, ProductTable, CartBar, PageHeader } = window.FC;

  const rows = [
    { sku: 'MAR-1182', brand: 'Marlow & Sons', name: 'Lip Balm, Fennel Honey', size: '0.5 oz', cs: 24, w: 2.80, msrp: 6, stock: 6280, lead: '2d', tone: 'orange', tag: 'NEW', added: 'Apr 24', qty: 4 },
    { sku: 'MAR-1184', brand: 'Marlow & Sons', name: 'Lip Balm, Rose', size: '0.5 oz', cs: 24, w: 2.80, msrp: 6, stock: 5920, lead: '2d', tone: 'orange', tag: 'NEW', added: 'Apr 24' },
    { sku: 'VET-0144', brand: 'Vetiver Co.', name: 'Room Spray, Smoke + Oak', size: '4 oz', cs: 6, w: 12.00, msrp: 26, stock: 188, lead: '5d', tone: 'warm', tag: 'NEW', added: 'Apr 22' },
    { sku: 'VET-0220', brand: 'Vetiver Co.', name: 'Solid Cologne, No. 4', size: '0.5 oz', cs: 8, w: 11.40, msrp: 26, stock: 142, lead: '4d', tone: 'warm', tag: 'NEW', added: 'Apr 22' },
    { sku: 'HFP-0440', brand: 'Hudson Falls Pottery', name: 'Stoneware Mug, Oxblood', size: '12 oz', cs: 4, w: 14.00, msrp: 32, stock: 88, lead: '7d', tone: 'cool', tag: 'NEW', added: 'Apr 21' },
    { sku: 'HFP-0442', brand: 'Hudson Falls Pottery', name: 'Stoneware Bowl, Cream', size: '8"', cs: 4, w: 16.40, msrp: 38, stock: 64, lead: '7d', tone: 'cool', tag: 'NEW', added: 'Apr 21' },
    { sku: 'ATB-2120', brand: 'Atelier Bord', name: 'Pocket Notebook, Linen', size: 'set/3', cs: 6, w: 10.40, msrp: 24, stock: 280, lead: '4d', tone: 'warm', tag: 'NEW', added: 'Apr 20', qty: 1 },
    { sku: 'ATB-2160', brand: 'Atelier Bord', name: 'Brass Pen, Refillable', size: 'each', cs: 4, w: 18.00, msrp: 42, stock: 96, lead: '5d', tone: 'warm', tag: 'NEW', added: 'Apr 20' },
    { sku: 'OAK-0125', brand: 'Oak & Salt', name: 'Mineral Deodorant, Sage', size: '2 oz', cs: 12, w: 6.20, msrp: 14, stock: 1080, lead: '3d', tone: 'warm', tag: 'NEW', added: 'Apr 18' },
    { sku: 'OAK-0140', brand: 'Oak & Salt', name: 'Mineral Deodorant, Cedar', size: '2 oz', cs: 12, w: 6.20, msrp: 14, stock: 920, lead: '3d', tone: 'orange', tag: 'NEW', added: 'Apr 18' },
    { sku: 'KOJ-0750', brand: 'Kōji & Co.', name: 'Yuzu Hand Cream, Refill', size: '8 oz', cs: 4, w: 14.40, msrp: 32, stock: 184, lead: '5d', tone: 'orange', tag: 'NEW', added: 'Apr 16' },
    { sku: 'PRP-1520', brand: 'Persephone Press', name: 'Tea Towel, Geometric', size: '20×28', cs: 6, w: 9.80, msrp: 22, stock: 312, lead: '3d', tone: 'cool', tag: 'NEW', added: 'Apr 15' },
    { sku: 'NRD-5040', brand: 'Nordfjord Skin', name: 'Birch Body Oil', size: '6 oz', cs: 4, w: 18.00, msrp: 40, stock: 78, lead: '7d', tone: 'cool', tag: 'NEW', added: 'Apr 14' },
    { sku: 'BRK-2360', brand: 'Brookline Botanicals', name: 'Lavender Sleep Mist', size: '2 oz', cs: 8, w: 6.80, msrp: 15, stock: 540, lead: '3d', tone: 'warm', tag: 'NEW', added: 'Apr 12' },
    { sku: 'FOX-0510', brand: 'Foxglove Goods', name: 'Tealight, Smoked Fig', size: '12 ct', cs: 12, w: 7.60, msrp: 17, stock: 740, lead: '3d', tone: 'orange', tag: 'NEW', added: 'Apr 10' },
    { sku: 'SGE-3520', brand: 'Sage North', name: 'Sea Salt Soak', size: '32 oz', cs: 4, w: 15.40, msrp: 34, stock: 144, lead: '4d', tone: 'cool', tag: 'NEW', added: 'Apr 08' },
  ];

  return (
    <div style={{ width: 1440, background: COLORS.bg, fontFamily: 'Geist, sans-serif' }}>
      <window.FC.UtilityBar />
      <window.FC.NavBar active="New Arrivals" />

      <PageHeader
        crumb="SHOP /"
        title="New arrivals"
        accent="this month"
        meta="142 SKUs added in the last 30 days · 28 brands"
        actions={<>
          <button style={{ padding: '6px 10px', border: `1px solid ${COLORS.line}`, background: COLORS.white, fontSize: 11 }}>↓ EXPORT CSV</button>
          <button style={{ padding: '6px 10px', border: `1px solid ${COLORS.ink}`, background: COLORS.ink, color: COLORS.white, fontSize: 11 }}>SUBSCRIBE TO ALERTS</button>
        </>}
      />

      {/* Date-window selector */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.line}`, padding: '12px 32px', display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase', marginRight: 8 }}>ADDED IN</span>
        {[['Last 7 days', 38], ['Last 14 days', 76], ['Last 30 days', 142, true], ['Last 90 days', 412]].map(([t, n, a]) => (
          <span key={t} style={{
            padding: '4px 9px', border: `1px solid ${a ? COLORS.ink : COLORS.line}`,
            background: a ? COLORS.ink : COLORS.white,
            color: a ? COLORS.white : COLORS.ink,
            fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {t}
            <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 9.5, color: a ? 'rgba(255,255,255,0.6)' : COLORS.muted }}>{n}</span>
          </span>
        ))}
        <span style={{ width: 1, background: COLORS.line, height: 22, margin: '0 8px' }}/>
        <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase', marginRight: 8 }}>DEPT</span>
        {['All', 'Apothecary', 'Home & Tabletop', 'Stationery', 'Pantry', 'Apparel'].map((t, i) => (
          <span key={t} style={{
            padding: '4px 9px', border: `1px solid ${i === 0 ? COLORS.ink : COLORS.line}`,
            background: i === 0 ? COLORS.ink : COLORS.white,
            color: i === 0 ? COLORS.white : COLORS.ink, fontSize: 11.5,
          }}>{t}</span>
        ))}
      </div>

      <div style={{ padding: '16px 32px 32px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 0', borderBottom: `1px solid ${COLORS.ink}`,
        }}>
          <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10.5, letterSpacing: '0.04em', color: COLORS.muted, textTransform: 'uppercase' }}>
            <span style={{ color: COLORS.ink }}>16 SKUS SHOWN</span> · ORDERED BY DATE ADDED ↓
          </span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11.5 }}>
            <span style={{ color: COLORS.muted, fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>SORT</span>
            <select style={{ padding: '4px 8px', border: `1px solid ${COLORS.line}`, fontSize: 11.5, background: COLORS.white }}>
              <option>Newest first</option>
              <option>Brand A–Z</option>
              <option>Margin ↓</option>
            </select>
          </div>
        </div>

        <ProductTable rows={rows} extraCols={[{ key: 'added', label: 'Added', w: 70, align: 'left', color: COLORS.muted, render: p => p.added }]}/>

        <div style={{ marginTop: 14 }}>
          <CartBar
            left={<>
              <span><span style={{ color: COLORS.orange }}>◉</span> 2 LINES SELECTED</span>
              <span style={{ color: '#9DAAC2' }}>5 CASES · 30 UNITS</span>
              <span style={{ color: '#9DAAC2' }}>SUBTOTAL <span style={{ color: COLORS.white, fontWeight: 600 }}>$21.60</span></span>
            </>}
            right={<>
              <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: COLORS.white, padding: '6px 12px', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em' }}>SAVE LIST</button>
              <button style={{ background: COLORS.orange, border: 'none', color: COLORS.white, padding: '6px 14px', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em', fontWeight: 600 }}>ADD TO P.O. →</button>
            </>}
          />
        </div>
      </div>

      <window.FC.Footer />
    </div>
  );
}
window.NewArrivals = NewArrivals;
