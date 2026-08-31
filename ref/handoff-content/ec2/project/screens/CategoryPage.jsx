// Category page — Apothecary (warehouse-density)
function CategoryPage() {
  const { COLORS, Placeholder, UtilityBar, NavBar, Footer } = window.FC;

  const filters = [
    { h: 'Sub-category', items: [
      ['All apothecary', 860], ['Body & bath', 214], ['Skincare', 186], ['Fragrance', 92],
      ['Candles', 144], ['Hair', 78], ['Oral care', 41], ['Gift sets', 105],
    ], active: 'All apothecary' },
    { h: 'Price tier', items: [['$0–6', 188], ['$6–12', 312], ['$12–24', 246], ['$24–48', 96], ['$48+', 18]] },
    { h: 'Origin', items: [['USA', 612], ['Canada', 88], ['Europe', 122], ['Japan', 38]] },
    { h: 'Values', items: [['Woman-owned', 244], ['BIPOC-owned', 92], ['Carbon-neutral', 318], ['Refill program', 76], ['Vegan', 412]] },
    { h: 'Stock', items: [['In stock now', 798], ['Low stock', 42], ['Pre-order', 20]] },
  ];

  // 24 dense rows
  const products = [
    { sku: 'MAR-1042', brand: 'Marlow & Sons', name: 'Cedar & Black Tea Body Wash', size: '8 oz', case: 6, w: 11.50, msrp: 24, stock: 1240, lead: '2d', tone: 'orange' },
    { sku: 'FOX-0218', brand: 'Foxglove Goods', name: 'Beeswax Tapers, ivory', size: 'set/4', case: 12, w: 8.20, msrp: 18, stock: 860, lead: '3d', tone: 'warm', tag: 'BEST' },
    { sku: 'SGE-3301', brand: 'Sage North', name: 'Eucalyptus Bath Salt', size: '16 oz', case: 6, w: 9.80, msrp: 22, stock: 612, lead: '2d', tone: 'cool' },
    { sku: 'MAR-1080', brand: 'Marlow & Sons', name: 'Hand Salve in Tin', size: '2 oz', case: 12, w: 6.40, msrp: 14, stock: 2880, lead: '2d', tone: 'orange' },
    { sku: 'VET-0144', brand: 'Vetiver Co.', name: 'Room Spray, Smoke + Oak', size: '4 oz', case: 6, w: 12.00, msrp: 26, stock: 188, lead: '5d', tone: 'warm', tag: 'NEW' },
    { sku: 'FOX-0312', brand: 'Foxglove Goods', name: 'Pillar Candle, Honey', size: '9 oz', case: 8, w: 10.50, msrp: 22, stock: 412, lead: '3d', tone: 'orange' },
    { sku: 'BRK-2200', brand: 'Brookline Botanicals', name: 'Rosehip Facial Oil', size: '1 oz', case: 4, w: 16.80, msrp: 38, stock: 96, lead: '4d', tone: 'warm' },
    { sku: 'SGE-3120', brand: 'Sage North', name: 'Charcoal Bar Soap', size: '4.5 oz', case: 12, w: 4.20, msrp: 10, stock: 4040, lead: '2d', tone: 'cool' },
    { sku: 'VET-0178', brand: 'Vetiver Co.', name: 'Linen Mist, Iris + Vetiver', size: '8 oz', case: 6, w: 11.00, msrp: 24, stock: 322, lead: '3d', tone: 'warm' },
    { sku: 'MAR-1120', brand: 'Marlow & Sons', name: 'Beard Oil, Sandalwood', size: '1 oz', case: 6, w: 9.00, msrp: 20, stock: 540, lead: '2d', tone: 'orange', tag: 'RESTOCK' },
    { sku: 'BRK-2280', brand: 'Brookline Botanicals', name: 'Clay Mask, Pink Kaolin', size: '4 oz', case: 6, w: 13.40, msrp: 28, stock: 244, lead: '4d', tone: 'warm' },
    { sku: 'FOX-0430', brand: 'Foxglove Goods', name: 'Matchbook, kraft', size: '100 ct', case: 24, w: 3.20, msrp: 8, stock: 6120, lead: '2d', tone: 'orange' },
    { sku: 'NRD-5001', brand: 'Nordfjord Skin', name: 'Sea Buckthorn Serum', size: '1 oz', case: 4, w: 22.00, msrp: 48, stock: 38, lead: '7d', tone: 'cool', tag: 'LOW' },
    { sku: 'KOJ-0710', brand: 'Kōji & Co.', name: 'Rice Bran Cleansing Bar', size: '3.5 oz', case: 12, w: 7.40, msrp: 16, stock: 980, lead: '3d', tone: 'warm' },
    { sku: 'PRP-1500', brand: 'Persephone Press', name: 'Bath Tea Sachets', size: 'set/8', case: 8, w: 9.20, msrp: 20, stock: 432, lead: '3d', tone: 'orange' },
    { sku: 'OAK-0099', brand: 'Oak & Salt', name: 'Sea Salt Hair Spray', size: '6 oz', case: 6, w: 10.20, msrp: 22, stock: 286, lead: '4d', tone: 'cool' },
    { sku: 'MAR-1180', brand: 'Marlow & Sons', name: 'Lip Balm, Bergamot', size: '0.5 oz', case: 24, w: 2.80, msrp: 6, stock: 8400, lead: '2d', tone: 'orange' },
    { sku: 'FOX-0490', brand: 'Foxglove Goods', name: 'Votive Candle, Smoked Fig', size: '3 oz', case: 12, w: 5.40, msrp: 12, stock: 1520, lead: '3d', tone: 'warm' },
    { sku: 'SGE-3450', brand: 'Sage North', name: 'Lavender Body Oil', size: '4 oz', case: 6, w: 12.80, msrp: 28, stock: 198, lead: '3d', tone: 'cool' },
    { sku: 'VET-0220', brand: 'Vetiver Co.', name: 'Solid Cologne, No. 4', size: '0.5 oz', case: 8, w: 11.40, msrp: 26, stock: 142, lead: '4d', tone: 'warm', tag: 'NEW' },
    { sku: 'BRK-2340', brand: 'Brookline Botanicals', name: 'Toner, Witch Hazel', size: '4 oz', case: 6, w: 8.60, msrp: 18, stock: 348, lead: '3d', tone: 'cool' },
    { sku: 'NRD-5020', brand: 'Nordfjord Skin', name: 'Cloudberry Eye Cream', size: '0.5 oz', case: 4, w: 19.20, msrp: 42, stock: 64, lead: '7d', tone: 'cool' },
    { sku: 'KOJ-0740', brand: 'Kōji & Co.', name: 'Yuzu Hand Cream', size: '2.5 oz', case: 12, w: 8.40, msrp: 18, stock: 720, lead: '3d', tone: 'orange' },
    { sku: 'OAK-0125', brand: 'Oak & Salt', name: 'Mineral Deodorant, Sage', size: '2 oz', case: 12, w: 6.20, msrp: 14, stock: 1080, lead: '3d', tone: 'warm', tag: 'BEST' },
  ];

  const headerCell = {
    fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: COLORS.muted, textAlign: 'left',
    padding: '10px 10px', fontWeight: 500, borderBottom: `1px solid ${COLORS.line}`,
    background: COLORS.bgAlt,
  };
  const cell = {
    padding: '8px 10px', fontSize: 12.5, color: COLORS.ink, borderBottom: `1px solid ${COLORS.line}`,
    verticalAlign: 'middle',
  };

  const stockDot = (n) => {
    const c = n < 100 ? COLORS.orange : n < 400 ? '#C8951A' : '#1F8A3A';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: c }}/>
        {n.toLocaleString()}
      </span>
    );
  };

  const tagColor = (t) => t === 'NEW' ? COLORS.blue : t === 'LOW' ? COLORS.orange : t === 'BEST' ? COLORS.ink : '#8A6A2E';

  return (
    <div style={{ width: 1440, background: COLORS.bg, fontFamily: 'Geist, sans-serif' }}>
      <UtilityBar />
      <NavBar active="Shop" />

      {/* Compact page header */}
      <div style={{ padding: '20px 32px 16px', borderBottom: `1px solid ${COLORS.line}`, background: COLORS.white }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={{
              fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.08em',
              color: COLORS.muted, textTransform: 'uppercase',
            }}>SHOP / DEPT 02 /</span>
            <h1 style={{
              fontFamily: 'Instrument Serif, serif', fontSize: 36, lineHeight: 1, margin: 0,
              color: COLORS.ink, fontWeight: 400, letterSpacing: '-0.01em',
            }}>Apothecary <span style={{ color: COLORS.blue, fontStyle: 'italic' }}>&</span> Body</h1>
            <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted, letterSpacing: '0.04em' }}>
              860 SKUs · 47 brands · 12 sub-categories
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>
            <button style={{ padding: '6px 10px', border: `1px solid ${COLORS.line}`, background: COLORS.white, fontSize: 11 }}>↓ EXPORT CSV</button>
            <button style={{ padding: '6px 10px', border: `1px solid ${COLORS.line}`, background: COLORS.white, fontSize: 11 }}>UPLOAD ORDER LIST</button>
            <button style={{ padding: '6px 10px', border: `1px solid ${COLORS.ink}`, background: COLORS.ink, color: COLORS.white, fontSize: 11 }}>QUICK ORDER</button>
          </div>
        </div>

        {/* Sub-cat pills inline */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
          {filters[0].items.map(([p, n], i) => (
            <span key={p} style={{
              padding: '4px 9px', border: `1px solid ${i === 0 ? COLORS.ink : COLORS.line}`,
              background: i === 0 ? COLORS.ink : COLORS.white,
              color: i === 0 ? COLORS.white : COLORS.ink,
              fontSize: 11.5, borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'Geist, sans-serif',
            }}>
              {p}
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 9.5, color: i === 0 ? 'rgba(255,255,255,0.6)' : COLORS.muted }}>{n}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main: filters rail + dense table */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', padding: '0 32px 40px', gap: 24, paddingTop: 16 }}>
        {/* FILTERS — tight */}
        <aside style={{ fontSize: 12.5 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingBottom: 8, borderBottom: `1px solid ${COLORS.ink}`,
          }}>
            <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              FILTERS · 4 ACTIVE
            </span>
            <span style={{ fontSize: 11, color: COLORS.orange }}>Clear all</span>
          </div>

          <div style={{ marginTop: 12, marginBottom: 12 }}>
            <div style={{
              border: `1px solid ${COLORS.line}`, padding: '6px 10px', fontSize: 12,
              display: 'flex', alignItems: 'center', gap: 8, background: COLORS.white,
            }}>
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke={COLORS.muted} strokeWidth="1.4"/>
                <path d="M9.5 9.5 L13 13" stroke={COLORS.muted} strokeWidth="1.4"/>
              </svg>
              <span style={{ color: COLORS.muted }}>Filter products</span>
            </div>
          </div>

          {filters.slice(1).map(f => (
            <div key={f.h} style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${COLORS.line}` }}>
              <div style={{
                fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: COLORS.ink, marginBottom: 6,
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>{f.h}</span>
                <span style={{ color: COLORS.muted }}>−</span>
              </div>
              {f.items.map(([i, n], idx) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0',
                  fontSize: 12.5, color: COLORS.ink,
                }}>
                  <span style={{
                    width: 12, height: 12, border: `1.5px solid ${idx === 0 && f.h === 'Origin' ? COLORS.blue : COLORS.line}`,
                    background: (idx === 0 && f.h === 'Origin') ? COLORS.blue : COLORS.white,
                    flexShrink: 0, position: 'relative',
                  }}>
                    {idx === 0 && f.h === 'Origin' && (
                      <svg width="12" height="12" viewBox="0 0 12 12" style={{ position: 'absolute', inset: -1.5 }}>
                        <path d="M2.5 6 L5 8.5 L9.5 3.5" stroke="white" strokeWidth="1.8" fill="none"/>
                      </svg>
                    )}
                  </span>
                  <span style={{ flex: 1 }}>{i}</span>
                  <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: COLORS.muted }}>{n}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.ink, marginBottom: 8 }}>
              Wholesale price
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input value="$0" readOnly style={{ width: '50%', padding: '6px 8px', border: `1px solid ${COLORS.line}`, fontSize: 12, fontFamily: 'Geist Mono, monospace' }}/>
              <input value="$48" readOnly style={{ width: '50%', padding: '6px 8px', border: `1px solid ${COLORS.line}`, fontSize: 12, fontFamily: 'Geist Mono, monospace' }}/>
            </div>
            <div style={{ height: 4, background: COLORS.line, marginTop: 10, position: 'relative' }}>
              <div style={{ position: 'absolute', left: '8%', right: '20%', top: 0, bottom: 0, background: COLORS.blue }}/>
              <div style={{ position: 'absolute', left: '8%', top: -3, width: 10, height: 10, background: COLORS.ink, borderRadius: 999, transform: 'translateX(-50%)' }}/>
              <div style={{ position: 'absolute', left: '80%', top: -3, width: 10, height: 10, background: COLORS.ink, borderRadius: 999, transform: 'translateX(-50%)' }}/>
            </div>
          </div>
        </aside>

        {/* TABLE TOOLBAR */}
        <main>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderBottom: `1px solid ${COLORS.ink}`,
          }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.04em', color: COLORS.muted, textTransform: 'uppercase' }}>
              <span><span style={{ color: COLORS.ink }}>860 SKUs</span> · 1–48</span>
              <span style={{ color: COLORS.line }}>|</span>
              <span style={{ color: COLORS.ink }}>4 active filters</span>
              {['Made in USA ×', 'In stock now ×', 'Vegan ×', 'Refill program ×'].map(t => (
                <span key={t} style={{
                  padding: '3px 7px', border: `1px solid ${COLORS.line}`, background: COLORS.white,
                  textTransform: 'none', letterSpacing: 0, fontSize: 10.5, color: COLORS.ink,
                }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11.5, fontFamily: 'Geist, sans-serif' }}>
              <span style={{ color: COLORS.muted, fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>SORT</span>
              <select style={{ padding: '5px 8px', border: `1px solid ${COLORS.line}`, fontSize: 11.5, background: COLORS.white }}>
                <option>Bestselling</option>
                <option>Price ↑</option>
                <option>Margin ↓</option>
              </select>
              <span style={{ width: 1, background: COLORS.line, height: 22, margin: '0 6px' }}/>
              <span style={{ color: COLORS.muted, fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>VIEW</span>
              {[
                { k: 'tbl', label: '☰', active: true, title: 'Table' },
                { k: 'cmp', label: '▤', active: false, title: 'Compact' },
                { k: 'grd', label: '▦', active: false, title: 'Grid' },
              ].map(v => (
                <span key={v.k} title={v.title} style={{
                  width: 26, height: 26, border: `1px solid ${v.active ? COLORS.ink : COLORS.line}`,
                  background: v.active ? COLORS.ink : COLORS.white,
                  color: v.active ? COLORS.white : COLORS.ink,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                }}>{v.label}</span>
              ))}
            </div>
          </div>

          {/* DENSE TABLE */}
          <table style={{ width: '100%', borderCollapse: 'collapse', background: COLORS.white, marginTop: 0 }}>
            <thead>
              <tr>
                <th style={{ ...headerCell, width: 28 }}><span style={{ width: 12, height: 12, border: `1.5px solid ${COLORS.line}`, display: 'inline-block' }}/></th>
                <th style={{ ...headerCell, width: 56 }}>Img</th>
                <th style={{ ...headerCell, width: 90 }}>SKU</th>
                <th style={headerCell}>Product</th>
                <th style={{ ...headerCell, width: 130 }}>Brand</th>
                <th style={{ ...headerCell, width: 70 }}>Size</th>
                <th style={{ ...headerCell, width: 60, textAlign: 'right' }}>Case</th>
                <th style={{ ...headerCell, width: 90, textAlign: 'right' }}>WHSL</th>
                <th style={{ ...headerCell, width: 70, textAlign: 'right' }}>MSRP</th>
                <th style={{ ...headerCell, width: 60, textAlign: 'right' }}>Margin</th>
                <th style={{ ...headerCell, width: 110 }}>Stock</th>
                <th style={{ ...headerCell, width: 50 }}>Lead</th>
                <th style={{ ...headerCell, width: 110, textAlign: 'right' }}>Qty (cases)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const margin = Math.round(((p.msrp - p.w) / p.msrp) * 100);
                return (
                  <tr key={p.sku} style={{ background: i % 2 ? COLORS.bg : COLORS.white }}>
                    <td style={cell}>
                      <span style={{ width: 12, height: 12, border: `1.5px solid ${COLORS.line}`, display: 'inline-block', verticalAlign: 'middle' }}/>
                    </td>
                    <td style={cell}>
                      <div style={{ width: 36, height: 36, position: 'relative' }}>
                        <Placeholder label="" tone={p.tone} h="100%" w="100%"/>
                      </div>
                    </td>
                    <td style={{ ...cell, fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted, letterSpacing: '0.02em' }}>{p.sku}</td>
                    <td style={cell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 500, color: COLORS.ink }}>{p.name}</span>
                        {p.tag && (
                          <span style={{
                            background: tagColor(p.tag), color: COLORS.white,
                            fontFamily: 'Geist Mono, monospace', fontSize: 9, letterSpacing: '0.06em',
                            padding: '1px 5px',
                          }}>{p.tag}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ ...cell, color: COLORS.blue, fontSize: 12 }}>{p.brand}</td>
                    <td style={{ ...cell, fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>{p.size}</td>
                    <td style={{ ...cell, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>×{p.case}</td>
                    <td style={{ ...cell, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontWeight: 600, fontSize: 13 }}>${p.w.toFixed(2)}</td>
                    <td style={{ ...cell, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>${p.msrp.toFixed(2)}</td>
                    <td style={{ ...cell, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.blue }}>{margin}%</td>
                    <td style={cell}>{stockDot(p.stock)}</td>
                    <td style={{ ...cell, fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>{p.lead}</td>
                    <td style={{ ...cell, textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', border: `1px solid ${COLORS.line}`, height: 26, alignItems: 'stretch' }}>
                        <span style={{ width: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${COLORS.line}`, color: COLORS.muted, fontSize: 13 }}>−</span>
                        <span style={{ width: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>{i === 0 ? 2 : i === 4 ? 1 : 0}</span>
                        <span style={{ width: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderLeft: `1px solid ${COLORS.line}`, color: COLORS.ink, fontSize: 13, background: COLORS.bgAlt }}>+</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Sticky-feeling cart summary bar */}
          <div style={{
            marginTop: 16, background: COLORS.navy, color: COLORS.white,
            padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: 'Geist Mono, monospace', fontSize: 11.5, letterSpacing: '0.04em',
          }}>
            <div style={{ display: 'flex', gap: 28 }}>
              <span><span style={{ color: COLORS.orange }}>◉</span> 3 LINES SELECTED</span>
              <span style={{ color: '#9DAAC2' }}>5 CASES · 30 UNITS</span>
              <span style={{ color: '#9DAAC2' }}>SUBTOTAL <span style={{ color: COLORS.white, fontWeight: 600 }}>$182.00</span></span>
              <span style={{ color: '#9DAAC2' }}>FREIGHT <span style={{ color: COLORS.white }}>FREE @ $500</span></span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: COLORS.white, padding: '6px 12px', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em' }}>SAVE LIST</button>
              <button style={{ background: COLORS.orange, border: 'none', color: COLORS.white, padding: '6px 14px', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em', fontWeight: 600 }}>ADD TO P.O. →</button>
            </div>
          </div>

          {/* Pagination */}
          <div style={{
            marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted,
          }}>
            <span>SHOWING 1–48 OF 860</span>
            <div style={{ display: 'flex', gap: 2 }}>
              {['‹', '1', '2', '3', '4', '5', '…', '18', '›'].map((p, i) => (
                <span key={i} style={{
                  width: 28, height: 28, border: `1px solid ${p === '2' ? COLORS.ink : COLORS.line}`,
                  background: p === '2' ? COLORS.ink : COLORS.white,
                  color: p === '2' ? COLORS.white : COLORS.ink,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>{p}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>PER PAGE</span>
              {[48, 96, 200].map(n => (
                <span key={n} style={{
                  padding: '3px 8px', border: `1px solid ${n === 48 ? COLORS.ink : COLORS.line}`,
                  background: n === 48 ? COLORS.ink : COLORS.white, color: n === 48 ? COLORS.white : COLORS.ink,
                }}>{n}</span>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

window.CategoryPage = CategoryPage;
