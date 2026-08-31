// Cart — grouped by parent product (variants nested)
function CartPage() {
  const { COLORS, Placeholder, StockDot, QtyStepper, TBL } = window.FC;

  const groups = [
    {
      parent: 'Lip Balm', parentSku: 'MAR-LB', brand: 'Marlow & Sons', tone: 'orange',
      meta: '0.5 oz · case of 24 · $2.80/unit',
      lines: [
        { sku: 'MAR-1180', flavor: 'Bergamot', qty: 2, w: 2.80, cs: 24, stock: 8400, lead: '2d' },
        { sku: 'MAR-1182', flavor: 'Fennel Honey', qty: 1, w: 2.80, cs: 24, stock: 6280, lead: '2d', tag: 'NEW' },
        { sku: 'MAR-1188', flavor: 'Black Tea', qty: 1, w: 2.80, cs: 24, stock: 88, lead: '2d', tag: 'LOW' },
      ],
    },
    {
      parent: 'Hand Salve in Tin', parentSku: 'MAR-HS', brand: 'Marlow & Sons', tone: 'orange',
      meta: '2 oz · case of 12 · $6.40/unit',
      lines: [
        { sku: 'MAR-1080', flavor: 'Standard', qty: 2, w: 6.40, cs: 12, stock: 2880, lead: '2d', tag: 'BEST' },
      ],
    },
    {
      parent: 'Beeswax Tapers', parentSku: 'FOX-TPR', brand: 'Foxglove Goods', tone: 'warm',
      meta: 'set of 4 · case of 12 · $8.20/set',
      lines: [
        { sku: 'FOX-0218', flavor: 'Ivory', qty: 1, w: 8.20, cs: 12, stock: 860, lead: '3d' },
        { sku: 'FOX-0220', flavor: 'Beeswax (natural)', qty: 1, w: 8.20, cs: 12, stock: 540, lead: '3d' },
        { sku: 'FOX-0222', flavor: 'Charcoal', qty: 0, w: 8.20, cs: 12, stock: 240, lead: '3d', tag: 'NEW' },
      ],
    },
    {
      parent: 'Stoneware Mug', parentSku: 'HFP-SM', brand: 'Hudson Falls Pottery', tone: 'cool',
      meta: '12 oz · case of 4 · $14.00 each',
      lines: [
        { sku: 'HFP-0440', flavor: 'Oxblood', qty: 1, w: 14.00, cs: 4, stock: 88, lead: '7d', tag: 'NEW' },
        { sku: 'HFP-0442', flavor: 'Cream', qty: 1, w: 14.00, cs: 4, stock: 64, lead: '7d', tag: 'NEW' },
      ],
    },
  ];

  const groupTotals = groups.map(g => {
    const cases = g.lines.reduce((a, l) => a + l.qty, 0);
    const units = g.lines.reduce((a, l) => a + l.qty * l.cs, 0);
    const total = g.lines.reduce((a, l) => a + l.qty * l.cs * l.w, 0);
    return { cases, units, total };
  });
  const grand = groupTotals.reduce((a, t) => a + t.total, 0);
  const grandUnits = groupTotals.reduce((a, t) => a + t.units, 0);
  const grandCases = groupTotals.reduce((a, t) => a + t.cases, 0);

  return (
    <div style={{ width: 1440, background: COLORS.bg, fontFamily: 'Geist, sans-serif' }}>
      <window.FC.UtilityBar />
      <window.FC.NavBar active="" />

      <div style={{ padding: '14px 32px', borderBottom: `1px solid ${COLORS.line}`, background: COLORS.white, fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase' }}>
        ACCOUNT / <span style={{ color: COLORS.ink }}>PURCHASE ORDER · DRAFT #PO-26-04129</span>
      </div>

      <div style={{ padding: '20px 32px 12px', background: COLORS.white, borderBottom: `1px solid ${COLORS.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, lineHeight: 1, margin: 0, color: COLORS.ink, fontWeight: 400, letterSpacing: '-0.01em' }}>
            Cart <span style={{ color: COLORS.blue, fontStyle: 'italic' }}>·</span> <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: COLORS.muted, fontStyle: 'italic' }}>draft P.O.</span>
          </h1>
          <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted, letterSpacing: '0.04em' }}>
            4 products · 8 variants · {grandCases} cases · {grandUnits} units
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>
          <button style={{ padding: '6px 10px', border: `1px solid ${COLORS.line}`, background: COLORS.white }}>↓ EXPORT P.O. PDF</button>
          <button style={{ padding: '6px 10px', border: `1px solid ${COLORS.line}`, background: COLORS.white }}>SHARE WITH TEAM</button>
          <button style={{ padding: '6px 10px', border: `1px solid ${COLORS.line}`, background: COLORS.white }}>SAVE AS LIST</button>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ padding: '14px 32px', background: COLORS.white, borderBottom: `1px solid ${COLORS.line}`, display: 'flex', gap: 0 }}>
        {[
          ['1', 'Cart', true, true],
          ['2', 'Shipping & terms', false, false],
          ['3', 'Review & submit', false, false],
        ].map(([n, t, active, done], i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 28 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 999,
              background: active ? COLORS.ink : COLORS.white,
              border: `1.5px solid ${active ? COLORS.ink : COLORS.line}`,
              color: active ? COLORS.white : COLORS.muted,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 600,
            }}>{n}</span>
            <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.06em', color: active ? COLORS.ink : COLORS.muted, textTransform: 'uppercase' }}>{t}</span>
            {i < 2 && <span style={{ width: 32, height: 1, background: COLORS.line, marginLeft: 16 }}/>}
          </div>
        ))}
      </div>

      {/* Two-col body: line items + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, padding: '16px 32px 32px' }}>
        <main>
          {groups.map((g, gi) => {
            const t = groupTotals[gi];
            return (
              <div key={g.parentSku} style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, marginBottom: 14 }}>
                {/* Group header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 14, alignItems: 'center',
                  padding: '14px 16px', background: COLORS.bgAlt, borderBottom: `1px solid ${COLORS.line}`,
                }}>
                  <div style={{ width: 48, height: 48 }}><Placeholder label="" tone={g.tone} h="100%" w="100%"/></div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: COLORS.ink, fontWeight: 400 }}>{g.parent}</span>
                      <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10.5, color: COLORS.muted, letterSpacing: '0.06em' }}>{g.parentSku}</span>
                      <span style={{ fontSize: 12, color: COLORS.blue }}>{g.brand}</span>
                    </div>
                    <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10.5, color: COLORS.muted, letterSpacing: '0.04em', marginTop: 2 }}>
                      {g.meta} · {g.lines.filter(l => l.qty > 0).length} of {g.lines.length} variants in cart
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.04em', color: COLORS.muted, textTransform: 'uppercase' }}>
                    <span>{t.cases} CS · {t.units} U</span>
                    <span style={{ color: COLORS.ink, fontWeight: 700, fontSize: 14 }}>${t.total.toFixed(2)}</span>
                    <span style={{ color: COLORS.muted }}>···</span>
                  </div>
                </div>

                {/* Variant rows */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ ...TBL.th, width: 120 }}>SKU</th>
                      <th style={TBL.th}>Variant</th>
                      <th style={{ ...TBL.th, width: 90, textAlign: 'right' }}>WHSL/u</th>
                      <th style={{ ...TBL.th, width: 70, textAlign: 'right' }}>Case</th>
                      <th style={{ ...TBL.th, width: 120 }}>Stock</th>
                      <th style={{ ...TBL.th, width: 60 }}>Lead</th>
                      <th style={{ ...TBL.th, width: 110, textAlign: 'right' }}>Cases</th>
                      <th style={{ ...TBL.th, width: 90, textAlign: 'right' }}>Line $</th>
                      <th style={{ ...TBL.th, width: 30 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.lines.map((l, i) => (
                      <tr key={l.sku} style={{ background: i % 2 ? COLORS.bg : COLORS.white, opacity: l.qty === 0 ? 0.55 : 1 }}>
                        <td style={{ ...TBL.td, fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted }}>{l.sku}</td>
                        <td style={TBL.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 500, color: COLORS.ink }}>{l.flavor}</span>
                            {l.tag && <span style={{ background: window.FC.tagColor(l.tag), color: COLORS.white, fontFamily: 'Geist Mono, monospace', fontSize: 9, letterSpacing: '0.06em', padding: '1px 5px' }}>{l.tag}</span>}
                            {l.qty === 0 && <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: COLORS.muted, fontStyle: 'italic' }}>(suggested)</span>}
                          </div>
                        </td>
                        <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>${l.w.toFixed(2)}</td>
                        <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>×{l.cs}</td>
                        <td style={TBL.td}><StockDot n={l.stock}/></td>
                        <td style={{ ...TBL.td, fontFamily: 'Geist Mono, monospace', fontSize: 11.5, color: COLORS.muted }}>{l.lead}</td>
                        <td style={{ ...TBL.td, textAlign: 'right' }}><QtyStepper value={l.qty}/></td>
                        <td style={{ ...TBL.td, textAlign: 'right', fontFamily: 'Geist Mono, monospace', fontWeight: 600, fontSize: 13, color: l.qty > 0 ? COLORS.ink : COLORS.muted }}>
                          {l.qty > 0 ? `$${(l.qty * l.cs * l.w).toFixed(2)}` : '—'}
                        </td>
                        <td style={{ ...TBL.td, textAlign: 'center', color: COLORS.muted }}>×</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Geist Mono, monospace', fontSize: 10.5, letterSpacing: '0.06em', color: COLORS.muted, textTransform: 'uppercase', borderTop: `1px solid ${COLORS.line}` }}>
                  <span>+ ADD ANOTHER VARIANT FROM {g.parent.toUpperCase()}</span>
                  <span style={{ color: COLORS.orange }}>REMOVE GROUP</span>
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: 8, padding: '14px 16px', border: `1px dashed ${COLORS.line}`, fontFamily: 'Geist Mono, monospace', fontSize: 11, color: COLORS.muted, letterSpacing: '0.06em', textAlign: 'center', textTransform: 'uppercase' }}>
            + PASTE A SKU LIST OR UPLOAD CSV TO QUICK-ADD
          </div>
        </main>

        {/* Sidebar — order summary */}
        <aside>
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, padding: '18px 18px 6px' }}>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.ink, paddingBottom: 12, borderBottom: `1px solid ${COLORS.ink}` }}>
              Order summary
            </div>
            {[
              ['Subtotal (8 lines)', `$${grand.toFixed(2)}`],
              ['Volume discount · 5%', `−$${(grand * 0.05).toFixed(2)}`, COLORS.blue],
              ['Estimated freight', 'FREE'],
              ['Estimated tax', 'Net of tax'],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${COLORS.line}`, fontSize: 12.5 }}>
                <span style={{ color: COLORS.muted }}>{l}</span>
                <span style={{ color: c || COLORS.ink, fontFamily: 'Geist Mono, monospace', fontSize: 12 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 6px', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>P.O. TOTAL</span>
              <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, color: COLORS.ink }}>${(grand * 0.95).toFixed(2)}</span>
            </div>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: COLORS.muted, letterSpacing: '0.04em', marginBottom: 14 }}>
              Due {new Date(Date.now() + 60 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} on Net-60 terms
            </div>

            <button style={{ width: '100%', background: COLORS.orange, color: COLORS.white, border: 'none', padding: '14px', fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
              Continue to shipping →
            </button>
            <button style={{ width: '100%', background: 'transparent', color: COLORS.ink, border: `1px solid ${COLORS.ink}`, padding: '12px', fontFamily: 'Geist, sans-serif', fontSize: 13 }}>
              Save & email to my buyer
            </button>
          </div>

          <div style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.line}`, padding: '14px 16px', marginTop: 12, fontSize: 12, lineHeight: 1.5 }}>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.orange, marginBottom: 6 }}>
              Freight progress
            </div>
            <div style={{ height: 4, background: COLORS.line, position: 'relative', marginTop: 4, marginBottom: 8 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(100, (grand / 500) * 100)}%`, background: COLORS.blue }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Geist Mono, monospace', fontSize: 10.5, color: COLORS.muted, letterSpacing: '0.04em' }}>
              <span>${grand.toFixed(0)} / $500</span>
              <span style={{ color: COLORS.ink }}>${(500 - grand).toFixed(0)} TO FREE FREIGHT</span>
            </div>
          </div>

          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, padding: '14px 16px', marginTop: 12 }}>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.ink, marginBottom: 10 }}>
              Promo / discount
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input placeholder="Code" style={{ flex: 1, padding: '8px 10px', border: `1px solid ${COLORS.line}`, fontSize: 12, fontFamily: 'Geist Mono, monospace' }}/>
              <button style={{ padding: '8px 12px', background: COLORS.ink, color: COLORS.white, border: 'none', fontSize: 11, fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em' }}>APPLY</button>
            </div>
          </div>
        </aside>
      </div>

      <window.FC.Footer />
    </div>
  );
}
window.CartPage = CartPage;
