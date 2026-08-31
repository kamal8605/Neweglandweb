// Checkout — shipping & terms (step 2 of P.O. flow)
function CheckoutPage() {
  const { COLORS, Placeholder, TBL } = window.FC;

  const groups = [
    { parent: 'Lip Balm', sku: 'MAR-LB', brand: 'Marlow & Sons', tone: 'orange', cs: 4, units: 96, total: 268.80, variants: 'Bergamot ×2 · Fennel Honey ×1 · Black Tea ×1' },
    { parent: 'Hand Salve in Tin', sku: 'MAR-HS', brand: 'Marlow & Sons', tone: 'orange', cs: 2, units: 24, total: 153.60, variants: 'Standard ×2' },
    { parent: 'Beeswax Tapers', sku: 'FOX-TPR', brand: 'Foxglove Goods', tone: 'warm', cs: 2, units: 24, total: 196.80, variants: 'Ivory ×1 · Beeswax natural ×1' },
    { parent: 'Stoneware Mug', sku: 'HFP-SM', brand: 'Hudson Falls Pottery', tone: 'cool', cs: 2, units: 8, total: 112.00, variants: 'Oxblood ×1 · Cream ×1' },
  ];
  const subtotal = groups.reduce((a, g) => a + g.total, 0);
  const discount = subtotal * 0.05;
  const total = subtotal - discount;

  const fieldLabel = { fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6, display: 'block' };
  const inputStyle = { width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.line}`, fontSize: 13, fontFamily: 'Geist, sans-serif', background: COLORS.white };

  return (
    <div style={{ width: 1440, background: COLORS.bg, fontFamily: 'Geist, sans-serif' }}>
      <window.FC.UtilityBar />
      <window.FC.NavBar active="" />

      <div style={{ padding: '14px 32px', borderBottom: `1px solid ${COLORS.line}`, background: COLORS.white, fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase' }}>
        ACCOUNT / PURCHASE ORDER #PO-26-04129 / <span style={{ color: COLORS.ink }}>SHIPPING & TERMS</span>
      </div>

      {/* Step indicator */}
      <div style={{ padding: '14px 32px', background: COLORS.white, borderBottom: `1px solid ${COLORS.line}`, display: 'flex', gap: 0 }}>
        {[
          ['1', 'Cart', false, true],
          ['2', 'Shipping & terms', true, false],
          ['3', 'Review & submit', false, false],
        ].map(([n, t, active, done], i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 28 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 999,
              background: active ? COLORS.ink : done ? COLORS.blue : COLORS.white,
              border: `1.5px solid ${active ? COLORS.ink : done ? COLORS.blue : COLORS.line}`,
              color: (active || done) ? COLORS.white : COLORS.muted,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600,
            }}>{done ? '✓' : n}</span>
            <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.06em', color: active ? COLORS.ink : COLORS.muted, textTransform: 'uppercase' }}>{t}</span>
            {i < 2 && <span style={{ width: 32, height: 1, background: COLORS.line, marginLeft: 16 }}/>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, padding: '20px 32px 32px' }}>
        <main>
          {/* SHIP-TO */}
          <section style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, padding: '20px 22px', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${COLORS.ink}`, paddingBottom: 10, marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: COLORS.ink, margin: 0, fontWeight: 400 }}>
                Ship to <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted, letterSpacing: '0.06em', marginLeft: 8 }}>01</span>
              </h2>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.blue, letterSpacing: '0.04em' }}>+ ADD ANOTHER LOCATION</span>
            </div>

            {/* Saved locations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
              {[
                { n: 'Hawthorne Storefront', a: '4218 SE Hawthorne Blvd', city: 'Portland, OR 97214', active: true },
                { n: 'Pearl District Outlet', a: '922 NW 11th Ave', city: 'Portland, OR 97209' },
                { n: 'Warehouse — Milwaukie', a: '2410 SE Tenino St', city: 'Milwaukie, OR 97222' },
              ].map(loc => (
                <div key={loc.n} style={{
                  padding: '12px 14px', border: `1.5px solid ${loc.active ? COLORS.ink : COLORS.line}`,
                  background: loc.active ? COLORS.bgAlt : COLORS.white, position: 'relative',
                }}>
                  <div style={{ position: 'absolute', top: 10, right: 10, width: 12, height: 12, borderRadius: 999, border: `1.5px solid ${loc.active ? COLORS.ink : COLORS.line}`, background: loc.active ? COLORS.ink : 'transparent' }}/>
                  <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 4 }}>SHIP-TO</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.ink }}>{loc.n}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{loc.a}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{loc.city}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={fieldLabel}>Receiving contact</label><input style={inputStyle} defaultValue="Margaret Voss"/></div>
              <div><label style={fieldLabel}>Phone</label><input style={inputStyle} defaultValue="(503) 555-0142"/></div>
              <div style={{ gridColumn: 'span 2' }}><label style={fieldLabel}>Delivery instructions</label><input style={inputStyle} defaultValue="Back alley dock, 7am–3pm M–F. Call on arrival."/></div>
              <div><label style={fieldLabel}>Receive between</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input style={inputStyle} defaultValue="May 02, 2026"/>
                  <input style={inputStyle} defaultValue="May 09, 2026"/>
                </div>
              </div>
              <div><label style={fieldLabel}>Resale tax ID</label><input style={inputStyle} defaultValue="OR-RT-2014-88401"/></div>
            </div>
          </section>

          {/* SHIPMENT BY BRAND */}
          <section style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, padding: '20px 22px', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${COLORS.ink}`, paddingBottom: 10, marginBottom: 14 }}>
              <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: COLORS.ink, margin: 0, fontWeight: 400 }}>
                Shipments <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted, letterSpacing: '0.06em', marginLeft: 8 }}>02 · 3 PARCELS, FROM 3 BRANDS</span>
              </h2>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted, letterSpacing: '0.04em' }}>EACH BRAND SHIPS SEPARATELY</span>
            </div>

            {[
              { b: 'Marlow & Sons', from: 'Portland, OR', items: '2 products · 6 cases', method: 'UPS Ground · 2 days', cost: 'FREE', tone: 'orange' },
              { b: 'Foxglove Goods', from: 'Brooklyn, NY', items: '1 product · 2 cases', method: 'UPS Ground · 4 days', cost: '$12.40', tone: 'warm' },
              { b: 'Hudson Falls Pottery', from: 'Kingston, NY', items: '1 product · 2 cases', method: 'LTL Freight · 7 days', cost: '$28.00', tone: 'cool' },
            ].map(s => (
              <div key={s.b} style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 1.4fr 1.6fr 80px', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${COLORS.line}` }}>
                <div style={{ width: 36, height: 36 }}><Placeholder label="" tone={s.tone} h="100%" w="100%"/></div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.ink }}>{s.b}</div>
                  <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10.5, color: COLORS.muted, letterSpacing: '0.04em' }}>FROM {s.from.toUpperCase()}</div>
                </div>
                <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>{s.items}</div>
                <div>
                  <select style={{ ...inputStyle, padding: '6px 10px', fontSize: 12 }}>
                    <option>{s.method}</option>
                    <option>Express · +$24</option>
                    <option>Pickup at brand</option>
                  </select>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 13, fontWeight: 600, color: s.cost === 'FREE' ? COLORS.blue : COLORS.ink }}>{s.cost}</div>
              </div>
            ))}
          </section>

          {/* PAYMENT & TERMS */}
          <section style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, padding: '20px 22px', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${COLORS.ink}`, paddingBottom: 10, marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: COLORS.ink, margin: 0, fontWeight: 400 }}>
                Payment & terms <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted, letterSpacing: '0.06em', marginLeft: 8 }}>03</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
              {[
                { n: 'Net-60', sub: 'Approved · default', detail: `Due Jun 25, 2026`, active: true, badge: 'APPROVED' },
                { n: 'Net-30 · 2% off', sub: 'Save 2% for paying early', detail: `Due May 26 · save $${(total * 0.02).toFixed(2)}`, badge: 'EARLY-PAY' },
                { n: 'Pay now · ACH / card', sub: 'Settles immediately', detail: 'Save 3% · no terms', badge: '' },
              ].map(p => (
                <div key={p.n} style={{
                  padding: '14px 16px', border: `1.5px solid ${p.active ? COLORS.ink : COLORS.line}`,
                  background: p.active ? COLORS.bgAlt : COLORS.white, position: 'relative',
                }}>
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 12, height: 12, borderRadius: 999, border: `1.5px solid ${p.active ? COLORS.ink : COLORS.line}`, background: p.active ? COLORS.ink : 'transparent' }}/>
                  {p.badge && (
                    <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 9, letterSpacing: '0.08em', background: p.active ? COLORS.orange : COLORS.bgAlt, color: p.active ? COLORS.white : COLORS.muted, padding: '2px 6px', textTransform: 'uppercase', display: 'inline-block', marginBottom: 8 }}>{p.badge}</span>
                  )}
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: COLORS.ink }}>{p.n}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{p.sub}</div>
                  <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10.5, color: COLORS.ink, letterSpacing: '0.04em', marginTop: 10, paddingTop: 8, borderTop: `1px solid ${COLORS.line}` }}>{p.detail}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div><label style={fieldLabel}>Billed to</label>
                <select style={inputStyle}><option>Voss Mercantile LLC · Net-60</option></select>
              </div>
              <div><label style={fieldLabel}>P.O. reference (your number)</label><input style={inputStyle} defaultValue="VM-Q2-0149"/></div>
              <div><label style={fieldLabel}>Internal notes (optional)</label><input style={inputStyle} placeholder="e.g. allocate to Hawthorne floor"/></div>
            </div>
          </section>

          {/* REVIEW LINES — collapsed by group */}
          <section style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${COLORS.ink}`, paddingBottom: 10, marginBottom: 12 }}>
              <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: COLORS.ink, margin: 0, fontWeight: 400 }}>
                Order lines <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted, letterSpacing: '0.06em', marginLeft: 8 }}>04 · 4 PRODUCTS · 8 VARIANTS</span>
              </h2>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.blue, letterSpacing: '0.04em' }}>← EDIT IN CART</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...TBL.th, width: 48 }}></th>
                  <th style={TBL.th}>Product</th>
                  <th style={TBL.th}>Variants</th>
                  <th style={{ ...TBL.th, width: 100, textAlign: 'right' }}>Cases</th>
                  <th style={{ ...TBL.th, width: 80, textAlign: 'right' }}>Units</th>
                  <th style={{ ...TBL.th, width: 100, textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g, i) => (
                  <tr key={g.sku} style={{ background: i % 2 ? COLORS.bg : COLORS.white }}>
                    <td style={TBL.td}><div style={{ width: 36, height: 36 }}><Placeholder label="" tone={g.tone} h="100%" w="100%"/></div></td>
                    <td style={TBL.td}>
                      <div style={{ fontWeight: 500, color: COLORS.ink, fontSize: 13 }}>{g.parent}</div>
                      <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10.5, color: COLORS.muted, letterSpacing: '0.04em', marginTop: 2 }}>{g.sku} · {g.brand}</div>
                    </td>
                    <td style={{ ...TBL.td, fontSize: 12, color: COLORS.muted, fontStyle: 'italic', fontFamily: 'Instrument Serif, serif' }}>{g.variants}</td>
                    <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>{g.cs}</td>
                    <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 12, color: COLORS.muted }}>{g.units}</td>
                    <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontWeight: 600, fontSize: 13 }}>${g.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>

        {/* SIDEBAR — totals & confirm */}
        <aside>
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, padding: '18px 18px 6px', position: 'sticky', top: 16 }}>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.ink, paddingBottom: 12, borderBottom: `1px solid ${COLORS.ink}` }}>
              P.O. summary
            </div>

            {[
              ['Subtotal · 8 lines', `$${subtotal.toFixed(2)}`],
              ['Volume discount · 5%', `−$${discount.toFixed(2)}`, COLORS.blue],
              ['Marlow & Sons freight', 'FREE'],
              ['Foxglove freight', '$12.40'],
              ['Hudson Falls LTL', '$28.00'],
              ['Tax (Oregon · resale exempt)', '$0.00'],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${COLORS.line}`, fontSize: 12.5 }}>
                <span style={{ color: COLORS.muted }}>{l}</span>
                <span style={{ color: c || COLORS.ink, fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>{v}</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 4px', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Due Jun 25</span>
              <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, color: COLORS.ink }}>${(total + 40.40).toFixed(2)}</span>
            </div>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: COLORS.muted, letterSpacing: '0.04em', marginBottom: 14 }}>
              Net-60 · No interest · Auto-debit ACH on file
            </div>

            <button style={{ width: '100%', background: COLORS.orange, color: COLORS.white, border: 'none', padding: '14px', fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
              Place P.O. → ${(total + 40.40).toFixed(2)}
            </button>
            <button style={{ width: '100%', background: 'transparent', color: COLORS.ink, border: `1px solid ${COLORS.ink}`, padding: '12px', fontFamily: 'Geist, sans-serif', fontSize: 13, marginBottom: 12 }}>
              ← Back to cart
            </button>

            <div style={{ display: 'flex', gap: 8, fontSize: 11, color: COLORS.muted, lineHeight: 1.45, paddingTop: 12, borderTop: `1px solid ${COLORS.line}` }}>
              <span style={{ color: COLORS.blue }}>★</span>
              <span>By placing this P.O. you agree to Forge & Co.'s wholesale terms. Net-60 invoices auto-debit on the due date unless paid manually first.</span>
            </div>
          </div>
        </aside>
      </div>

      <window.FC.Footer />
    </div>
  );
}
window.CheckoutPage = CheckoutPage;
