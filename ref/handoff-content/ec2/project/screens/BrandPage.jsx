// Brand page — Marlow & Sons Apothecary (warehouse-density)
function BrandPage() {
  const { COLORS, Placeholder, UtilityBar, NavBar, Footer } = window.FC;

  const products = [
    { sku: 'MAR-1042', name: 'Cedar & Black Tea Body Wash', size: '8 oz', cat: 'Body & bath', cs: 6, w: 11.50, msrp: 24, stock: 1240, lead: '2d', tone: 'orange', tag: 'BEST' },
    { sku: 'MAR-1080', name: 'Hand Salve in Tin', size: '2 oz', cat: 'Skincare', cs: 12, w: 6.40, msrp: 14, stock: 2880, lead: '2d', tone: 'orange', tag: 'BEST' },
    { sku: 'MAR-1120', name: 'Beard Oil, Sandalwood', size: '1 oz', cat: 'Skincare', cs: 6, w: 9.00, msrp: 20, stock: 540, lead: '2d', tone: 'warm', tag: 'RESTOCK' },
    { sku: 'MAR-1160', name: 'Bar Soap, Cedar', size: '4.5 oz', cat: 'Body & bath', cs: 12, w: 4.20, msrp: 10, stock: 4040, lead: '2d', tone: 'warm' },
    { sku: 'MAR-1180', name: 'Lip Balm, Bergamot', size: '0.5 oz', cat: 'Skincare', cs: 24, w: 2.80, msrp: 6, stock: 8400, lead: '2d', tone: 'orange' },
    { sku: 'MAR-1182', name: 'Lip Balm, Fennel Honey', size: '0.5 oz', cat: 'Skincare', cs: 24, w: 2.80, msrp: 6, stock: 6280, lead: '2d', tone: 'orange', tag: 'NEW' },
    { sku: 'MAR-1184', name: 'Lip Balm, Rose', size: '0.5 oz', cat: 'Skincare', cs: 24, w: 2.80, msrp: 6, stock: 5920, lead: '2d', tone: 'orange', tag: 'NEW' },
    { sku: 'MAR-1190', name: 'Lip Balm Trio (set)', size: 'set/3', cat: 'Gift sets', cs: 6, w: 8.40, msrp: 18, stock: 412, lead: '3d', tone: 'orange', tag: 'NEW' },
    { sku: 'MAR-1220', name: 'Body Lotion, Unscented', size: '8 oz', cat: 'Body & bath', cs: 6, w: 10.80, msrp: 24, stock: 720, lead: '3d', tone: 'cool' },
    { sku: 'MAR-1240', name: 'Body Lotion, Cedar', size: '8 oz', cat: 'Body & bath', cs: 6, w: 10.80, msrp: 24, stock: 612, lead: '3d', tone: 'orange' },
    { sku: 'MAR-1300', name: 'Hair Pomade, Light Hold', size: '2 oz', cat: 'Hair', cs: 6, w: 9.40, msrp: 20, stock: 286, lead: '3d', tone: 'warm' },
    { sku: 'MAR-1320', name: 'Hair Tonic, Sea Salt', size: '6 oz', cat: 'Hair', cs: 6, w: 11.20, msrp: 24, stock: 198, lead: '4d', tone: 'cool' },
    { sku: 'MAR-1400', name: 'Beeswax Candle, Workshop', size: '8 oz', cat: 'Candles', cs: 6, w: 14.00, msrp: 32, stock: 88, lead: '4d', tone: 'orange', tag: 'LOW' },
    { sku: 'MAR-1420', name: 'Beeswax Candle, Tea + Honey', size: '8 oz', cat: 'Candles', cs: 6, w: 14.00, msrp: 32, stock: 142, lead: '4d', tone: 'warm' },
    { sku: 'MAR-1500', name: 'Shave Soap, Bay Rum', size: '3 oz', cat: 'Body & bath', cs: 12, w: 5.80, msrp: 13, stock: 980, lead: '2d', tone: 'warm' },
    { sku: 'MAR-1520', name: 'Shave Brush, Boar', size: 'each', cat: 'Body & bath', cs: 4, w: 18.40, msrp: 42, stock: 64, lead: '5d', tone: 'orange', tag: 'LOW' },
    { sku: 'MAR-1600', name: 'Hand Salve, Refill Pouch', size: '8 oz', cat: 'Skincare', cs: 6, w: 16.20, msrp: 36, stock: 220, lead: '3d', tone: 'orange' },
    { sku: 'MAR-1700', name: 'Cologne, No. 2 — Cedar', size: '1 oz', cat: 'Fragrance', cs: 4, w: 24.00, msrp: 56, stock: 42, lead: '7d', tone: 'warm', tag: 'LOW' },
    { sku: 'MAR-1720', name: 'Cologne, No. 4 — Tea', size: '1 oz', cat: 'Fragrance', cs: 4, w: 24.00, msrp: 56, stock: 38, lead: '7d', tone: 'cool', tag: 'LOW' },
    { sku: 'MAR-1800', name: 'Workshop Mini-Set', size: 'set/4', cat: 'Gift sets', cs: 4, w: 22.40, msrp: 50, stock: 86, lead: '4d', tone: 'orange' },
    { sku: 'MAR-1820', name: 'Daily Carry Set', size: 'set/3', cat: 'Gift sets', cs: 4, w: 18.00, msrp: 40, stock: 124, lead: '4d', tone: 'warm' },
    { sku: 'MAR-1900', name: 'Cotton Hand Towel, Natural', size: 'each', cat: 'Body & bath', cs: 8, w: 7.20, msrp: 16, stock: 480, lead: '3d', tone: 'cool' },
  ];

  const headerCell = {
    fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: COLORS.muted, textAlign: 'left',
    padding: '10px 10px', fontWeight: 500, borderBottom: `1px solid ${COLORS.line}`,
    background: COLORS.bgAlt,
  };
  const cell = {
    padding: '8px 10px', fontSize: 12.5, color: COLORS.ink,
    borderBottom: `1px solid ${COLORS.line}`, verticalAlign: 'middle',
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
      <NavBar active="Brands" />

      {/* Breadcrumb */}
      <div style={{
        padding: '14px 32px', borderBottom: `1px solid ${COLORS.line}`,
        fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.08em',
        color: COLORS.muted, textTransform: 'uppercase', background: COLORS.white,
      }}>
        BRANDS / APOTHECARY / <span style={{ color: COLORS.ink }}>MARLOW & SONS</span>
      </div>

      {/* COMPACT HERO + STATS, two-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ position: 'relative', minHeight: 280 }}>
          <Placeholder label="Marlow & Sons · workshop" tone="warm" h="100%"/>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(11,31,58,0.0) 40%, rgba(11,31,58,0.7) 100%)',
          }}/>
          <div style={{ position: 'absolute', bottom: 24, left: 32, right: 32, color: COLORS.white }}>
            <div style={{
              fontFamily: 'Geist Mono, monospace', fontSize: 10.5, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: COLORS.orange, marginBottom: 8,
            }}>EST. 2009 · PORTLAND, OR · BRAND #B-0142</div>
            <h1 style={{
              fontFamily: 'Instrument Serif, serif', fontSize: 56, lineHeight: 0.95,
              margin: 0, fontWeight: 400, letterSpacing: '-0.01em',
            }}>
              Marlow <span style={{ fontStyle: 'italic', color: COLORS.orange }}>&</span> Sons
            </h1>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {['WOMAN-OWNED', 'CARBON-NEUTRAL', 'REFILL PROGRAM', 'VEGAN'].map(t => (
                <span key={t} style={{
                  fontFamily: 'Geist Mono, monospace', fontSize: 9.5, letterSpacing: '0.08em',
                  background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)', padding: '3px 7px', color: COLORS.white,
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Stat block — warehouse facts */}
        <div style={{ background: COLORS.white, padding: '24px 28px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingBottom: 12, borderBottom: `1px solid ${COLORS.ink}`,
          }}>
            <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.ink }}>
              Buyer fact sheet
            </span>
            <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: COLORS.muted }}>UPDATED APR 24</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 4 }}>
            {[
              { l: 'SKUs', v: '22' },
              { l: 'In stock', v: '20' },
              { l: 'Categories', v: '6' },
              { l: 'Lead time', v: '2–7d' },
              { l: 'Wholesale', v: '$2.80–24' },
              { l: 'MSRP', v: '$6–56' },
              { l: 'Avg margin', v: '54%' },
              { l: 'Open MOQ', v: '$150' },
              { l: 'Reorder MOQ', v: '$75' },
              { l: 'Terms', v: 'Net-60' },
              { l: 'Origin', v: 'USA' },
              { l: 'Ships from', v: 'PDX · 97214' },
            ].map(s => (
              <div key={s.l} style={{ borderTop: `1px solid ${COLORS.line}`, padding: '10px 0', borderRight: `1px solid ${COLORS.line}`, paddingLeft: 8, paddingRight: 8 }}>
                <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 9.5, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase' }}>{s.l}</div>
                <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 14, color: COLORS.ink, marginTop: 4, fontWeight: 600 }}>{s.v}</div>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: 'Instrument Serif, serif', fontStyle: 'italic',
            fontSize: 16, lineHeight: 1.4, color: COLORS.muted, marginTop: 16, marginBottom: 0,
          }}>
            "Small batches of bath and body goods from a converted carriage house in NE Portland.
            Cedar, black tea, and a lot of patience."
            <span style={{ display: 'block', fontStyle: 'normal', fontFamily: 'Geist Mono, monospace', fontSize: 10, marginTop: 8, color: COLORS.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              — ELEANOR MARLOW, FOUNDER
            </span>
          </p>
        </div>
      </div>

      {/* Action band */}
      <div style={{
        background: COLORS.navy, color: COLORS.white, padding: '12px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.06em',
      }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <span style={{ color: COLORS.orange }}>◉ IN STOCK · SHIPS IN 3 DAYS AVG</span>
          <span style={{ color: '#9DAAC2' }}>22 SKUS · 4 LOW · 3 NEW</span>
          <span style={{ color: '#9DAAC2' }}>NET-60 TERMS</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ background: 'transparent', color: COLORS.white, border: '1px solid rgba(255,255,255,0.3)', padding: '6px 12px', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em' }}>★ SAVE BRAND</button>
          <button style={{ background: 'transparent', color: COLORS.white, border: '1px solid rgba(255,255,255,0.3)', padding: '6px 12px', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em' }}>↓ LINESHEET PDF</button>
          <button style={{ background: COLORS.orange, color: COLORS.white, border: 'none', padding: '6px 14px', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em', fontWeight: 600 }}>ADD OPENER PACK · $150</button>
        </div>
      </div>

      {/* Sub-section nav */}
      <div style={{
        padding: '12px 32px 0', borderBottom: `1px solid ${COLORS.line}`,
        display: 'flex', gap: 24, fontSize: 13, background: COLORS.white,
      }}>
        {[
          ['Catalog (22)', true],
          ['Best sellers (4)', false],
          ['New (3)', false],
          ['Low stock (4)', false],
          ['Refills', false],
          ['Story', false],
        ].map(([t, a]) => (
          <span key={t} style={{
            paddingBottom: 12, color: a ? COLORS.ink : COLORS.muted,
            borderBottom: a ? `2px solid ${COLORS.orange}` : '2px solid transparent',
            fontWeight: a ? 500 : 400,
          }}>{t}</span>
        ))}
      </div>

      {/* DENSE CATALOG TABLE */}
      <div style={{ padding: '16px 32px 32px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 0', borderBottom: `1px solid ${COLORS.ink}`,
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontFamily: 'Geist Mono, monospace', fontSize: 10.5, letterSpacing: '0.04em', color: COLORS.muted, textTransform: 'uppercase' }}>
            <span><span style={{ color: COLORS.ink }}>22 SKUS</span></span>
            <span style={{ color: COLORS.line }}>|</span>
            <span>FILTER BY:</span>
            {['All categories', 'In stock only', 'Show new', 'Show bestsellers'].map((t, i) => (
              <span key={t} style={{
                padding: '3px 7px', border: `1px solid ${i === 0 ? COLORS.ink : COLORS.line}`,
                background: i === 0 ? COLORS.ink : COLORS.white,
                color: i === 0 ? COLORS.white : COLORS.ink,
                fontFamily: 'Geist, sans-serif', fontSize: 11, letterSpacing: 0, textTransform: 'none',
              }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11.5 }}>
            <span style={{ color: COLORS.muted, fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>SORT</span>
            <select style={{ padding: '4px 8px', border: `1px solid ${COLORS.line}`, fontSize: 11.5, background: COLORS.white }}>
              <option>Bestselling</option>
              <option>SKU ↑</option>
              <option>Stock ↓</option>
            </select>
            <span style={{ width: 1, background: COLORS.line, height: 22, margin: '0 6px' }}/>
            <span style={{ color: COLORS.muted, fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>VIEW</span>
            {[
              { label: '☰', a: true },
              { label: '▤', a: false },
              { label: '▦', a: false },
            ].map((v, i) => (
              <span key={i} style={{
                width: 26, height: 26, border: `1px solid ${v.a ? COLORS.ink : COLORS.line}`,
                background: v.a ? COLORS.ink : COLORS.white,
                color: v.a ? COLORS.white : COLORS.ink,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
              }}>{v.label}</span>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', background: COLORS.white }}>
          <thead>
            <tr>
              <th style={{ ...headerCell, width: 28 }}><span style={{ width: 12, height: 12, border: `1.5px solid ${COLORS.line}`, display: 'inline-block' }}/></th>
              <th style={{ ...headerCell, width: 56 }}>Img</th>
              <th style={{ ...headerCell, width: 90 }}>SKU</th>
              <th style={headerCell}>Product</th>
              <th style={{ ...headerCell, width: 110 }}>Category</th>
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
                  <td style={cell}><span style={{ width: 12, height: 12, border: `1.5px solid ${COLORS.line}`, display: 'inline-block', verticalAlign: 'middle' }}/></td>
                  <td style={cell}>
                    <div style={{ width: 36, height: 36 }}>
                      <Placeholder label="" tone={p.tone} h="100%" w="100%"/>
                    </div>
                  </td>
                  <td style={{ ...cell, fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted }}>{p.sku}</td>
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
                  <td style={{ ...cell, color: COLORS.muted, fontSize: 12 }}>{p.cat}</td>
                  <td style={{ ...cell, fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>{p.size}</td>
                  <td style={{ ...cell, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>×{p.cs}</td>
                  <td style={{ ...cell, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontWeight: 600, fontSize: 13 }}>${p.w.toFixed(2)}</td>
                  <td style={{ ...cell, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>${p.msrp.toFixed(2)}</td>
                  <td style={{ ...cell, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.blue }}>{margin}%</td>
                  <td style={cell}>{stockDot(p.stock)}</td>
                  <td style={{ ...cell, fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>{p.lead}</td>
                  <td style={{ ...cell, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', border: `1px solid ${COLORS.line}`, height: 26, alignItems: 'stretch' }}>
                      <span style={{ width: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${COLORS.line}`, color: COLORS.muted, fontSize: 13 }}>−</span>
                      <span style={{ width: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>{i === 0 ? 2 : i === 1 ? 1 : 0}</span>
                      <span style={{ width: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderLeft: `1px solid ${COLORS.line}`, color: COLORS.ink, fontSize: 13, background: COLORS.bgAlt }}>+</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Cart summary */}
        <div style={{
          marginTop: 14, background: COLORS.navy, color: COLORS.white,
          padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'Geist Mono, monospace', fontSize: 11.5, letterSpacing: '0.04em',
        }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <span><span style={{ color: COLORS.orange }}>◉</span> 2 LINES · MARLOW & SONS</span>
            <span style={{ color: '#9DAAC2' }}>3 CASES · 24 UNITS</span>
            <span style={{ color: '#9DAAC2' }}>SUBTOTAL <span style={{ color: COLORS.white, fontWeight: 600 }}>$29.40</span></span>
            <span style={{ color: COLORS.orange }}>$120.60 BELOW OPENER MIN</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: COLORS.white, padding: '6px 12px', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em' }}>SAVE LIST</button>
            <button style={{ background: COLORS.orange, border: 'none', color: COLORS.white, padding: '6px 14px', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em', fontWeight: 600 }}>ADD TO P.O. →</button>
          </div>
        </div>
      </div>

      {/* Maker story strip — kept compact */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.4fr', borderTop: `1px solid ${COLORS.line}`,
      }}>
        <div style={{ minHeight: 260 }}>
          <Placeholder label="Eleanor at the workbench" tone="warm" h="100%"/>
        </div>
        <div style={{ background: COLORS.bgAlt, padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            fontFamily: 'Geist Mono, monospace', fontSize: 10.5, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: COLORS.orange, marginBottom: 12,
          }}>THE MAKER</div>
          <h3 style={{
            fontFamily: 'Instrument Serif, serif', fontSize: 28, lineHeight: 1.1,
            color: COLORS.ink, margin: 0, fontWeight: 400, letterSpacing: '-0.01em', maxWidth: 560,
          }}>From a kitchen pot in 2009 to a 22-SKU catalog — and still no factory.</h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.65, color: COLORS.muted, marginTop: 12, maxWidth: 600 }}>
            Eleanor Marlow started melting beeswax on her stovetop the year her first son was born.
            Seventeen years later the same woman is still pouring every batch by hand — now in a
            converted carriage house in Northeast Portland, with two co-conspirators and a very
            patient golden retriever named Otis.
          </p>
          <div style={{ marginTop: 16, fontFamily: 'Geist Mono, monospace', fontSize: 10.5, letterSpacing: '0.06em', color: COLORS.ink, textTransform: 'uppercase' }}>
            → READ THE FULL STORY
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

window.BrandPage = BrandPage;
