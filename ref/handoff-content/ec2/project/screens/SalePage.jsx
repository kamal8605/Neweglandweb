// Sale page — clearance & promotional pricing
function SalePage() {
  const { COLORS, ProductTable, CartBar, PageHeader } = window.FC;

  const rows = [
    { sku: 'FOX-0312', brand: 'Foxglove Goods', name: 'Pillar Candle, Honey', size: '9 oz', cs: 8, w: 7.30, wOriginal: 10.50, msrp: 22, stock: 412, lead: '3d', tone: 'orange', tag: 'SALE', discounted: true, qty: 2 },
    { sku: 'BRK-2200', brand: 'Brookline Botanicals', name: 'Rosehip Facial Oil', size: '1 oz', cs: 4, w: 11.80, wOriginal: 16.80, msrp: 38, stock: 96, lead: '4d', tone: 'warm', tag: 'SALE', discounted: true },
    { sku: 'SGE-3120', brand: 'Sage North', name: 'Charcoal Bar Soap', size: '4.5 oz', cs: 12, w: 2.95, wOriginal: 4.20, msrp: 10, stock: 4040, lead: '2d', tone: 'cool', tag: 'SALE', discounted: true },
    { sku: 'VET-0178', brand: 'Vetiver Co.', name: 'Linen Mist, Iris + Vetiver', size: '8 oz', cs: 6, w: 7.70, wOriginal: 11.00, msrp: 24, stock: 322, lead: '3d', tone: 'warm', tag: 'SALE', discounted: true },
    { sku: 'MAR-1120', brand: 'Marlow & Sons', name: 'Beard Oil, Sandalwood', size: '1 oz', cs: 6, w: 6.30, wOriginal: 9.00, msrp: 20, stock: 540, lead: '2d', tone: 'orange', tag: 'SALE', discounted: true, qty: 1 },
    { sku: 'BRK-2280', brand: 'Brookline Botanicals', name: 'Clay Mask, Pink Kaolin', size: '4 oz', cs: 6, w: 9.40, wOriginal: 13.40, msrp: 28, stock: 244, lead: '4d', tone: 'warm', tag: 'SALE', discounted: true },
    { sku: 'OAK-0099', brand: 'Oak & Salt', name: 'Sea Salt Hair Spray', size: '6 oz', cs: 6, w: 7.10, wOriginal: 10.20, msrp: 22, stock: 286, lead: '4d', tone: 'cool', tag: 'SALE', discounted: true },
    { sku: 'FOX-0490', brand: 'Foxglove Goods', name: 'Votive Candle, Smoked Fig', size: '3 oz', cs: 12, w: 3.80, wOriginal: 5.40, msrp: 12, stock: 1520, lead: '3d', tone: 'warm', tag: 'SALE', discounted: true },
    { sku: 'KOJ-0710', brand: 'Kōji & Co.', name: 'Rice Bran Cleansing Bar', size: '3.5 oz', cs: 12, w: 5.20, wOriginal: 7.40, msrp: 16, stock: 980, lead: '3d', tone: 'warm', tag: 'SALE', discounted: true },
    { sku: 'PRP-1500', brand: 'Persephone Press', name: 'Bath Tea Sachets', size: 'set/8', cs: 8, w: 6.40, wOriginal: 9.20, msrp: 20, stock: 432, lead: '3d', tone: 'orange', tag: 'SALE', discounted: true },
    { sku: 'NRD-5001', brand: 'Nordfjord Skin', name: 'Sea Buckthorn Serum', size: '1 oz', cs: 4, w: 15.40, wOriginal: 22.00, msrp: 48, stock: 38, lead: '7d', tone: 'cool', tag: 'LOW', discounted: true },
    { sku: 'SGE-3450', brand: 'Sage North', name: 'Lavender Body Oil', size: '4 oz', cs: 6, w: 8.95, wOriginal: 12.80, msrp: 28, stock: 198, lead: '3d', tone: 'cool', tag: 'SALE', discounted: true },
  ];

  return (
    <div style={{ width: 1440, background: COLORS.bg, fontFamily: 'Geist, sans-serif' }}>
      <window.FC.UtilityBar />
      <window.FC.NavBar active="Sale" />

      {/* Promo banner */}
      <div style={{ background: '#B83434', color: COLORS.white, padding: '10px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.08em' }}>
        <span>◉ Q2 CLEARANCE · UP TO 35% OFF WHOLESALE · ENDS APR 30 23:59 PT</span>
        <span style={{ opacity: 0.85 }}>ALL SALE ITEMS · FINAL SALE · NO RETURNS</span>
      </div>

      <PageHeader
        crumb="SHOP /"
        title="Sale"
        accent="& clearance"
        meta="124 SKUs · avg 31% off · ends Apr 30"
        actions={<>
          <button style={{ padding: '6px 10px', border: `1px solid ${COLORS.line}`, background: COLORS.white, fontSize: 11 }}>↓ EXPORT CSV</button>
          <button style={{ padding: '6px 10px', border: `1px solid ${COLORS.ink}`, background: COLORS.ink, color: COLORS.white, fontSize: 11 }}>BULK ADD TO P.O.</button>
        </>}
      />

      {/* Discount tier strip */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.line}`, padding: '12px 32px', display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase', marginRight: 8 }}>DISCOUNT</span>
        {[['All sale', 124, true], ['10–20% off', 48], ['20–30% off', 52], ['30%+ off', 24]].map(([t, n, a]) => (
          <span key={t} style={{
            padding: '4px 9px', border: `1px solid ${a ? '#B83434' : COLORS.line}`,
            background: a ? '#B83434' : COLORS.white,
            color: a ? COLORS.white : COLORS.ink,
            fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {t}
            <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 9.5, color: a ? 'rgba(255,255,255,0.7)' : COLORS.muted }}>{n}</span>
          </span>
        ))}
        <span style={{ width: 1, background: COLORS.line, height: 22, margin: '0 8px' }}/>
        <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase', marginRight: 8 }}>REASON</span>
        {['All', 'Seasonal', 'Discontinued', 'Overstock', 'Imperfect'].map((t, i) => (
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
            <span style={{ color: COLORS.ink }}>12 SKUS</span> · STRUCK PRICE = ORIGINAL WHOLESALE
          </span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11.5 }}>
            <span style={{ color: COLORS.muted, fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>SORT</span>
            <select style={{ padding: '4px 8px', border: `1px solid ${COLORS.line}`, fontSize: 11.5, background: COLORS.white }}>
              <option>Discount % ↓</option>
              <option>Price ↑</option>
              <option>Margin ↓</option>
            </select>
          </div>
        </div>

        <ProductTable rows={rows} extraCols={[{
          key: 'off', label: 'Off', w: 60, align: 'right',
          color: '#B83434',
          render: p => p.wOriginal ? `−${Math.round((1 - p.w / p.wOriginal) * 100)}%` : '—',
        }]}/>

        <div style={{ marginTop: 14 }}>
          <CartBar
            left={<>
              <span><span style={{ color: COLORS.orange }}>◉</span> 2 LINES · SALE ITEMS</span>
              <span style={{ color: '#9DAAC2' }}>3 CASES · 22 UNITS</span>
              <span style={{ color: '#9DAAC2' }}>YOU SAVE <span style={{ color: COLORS.orange, fontWeight: 600 }}>$11.20</span></span>
              <span style={{ color: '#9DAAC2' }}>SUBTOTAL <span style={{ color: COLORS.white, fontWeight: 600 }}>$20.90</span></span>
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
window.SalePage = SalePage;
