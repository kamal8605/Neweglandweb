// Homepage — Forge & Co.
function Homepage() {
  const { COLORS, Placeholder, UtilityBar, NavBar, Footer } = window.FC;

  return (
    <div style={{ width: 1440, background: COLORS.bg, fontFamily: 'Geist, sans-serif' }}>
      <UtilityBar />
      <NavBar active="Shop" />

      {/* HERO — editorial split */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.1fr 1fr',
        borderBottom: `1px solid ${COLORS.line}`,
      }}>
        <div style={{ padding: '80px 64px 72px', position: 'relative' }}>
          <div style={{
            fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: COLORS.orange, marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ width: 24, height: 1, background: COLORS.orange }}/>
            SS26 WHOLESALE PREVIEW · OPEN NOW
          </div>
          <h1 style={{
            fontFamily: 'Instrument Serif, serif', fontSize: 88, lineHeight: 0.96,
            color: COLORS.ink, margin: 0, letterSpacing: '-0.02em', fontWeight: 400,
          }}>
            The wholesale<br/>
            <em style={{ color: COLORS.blue }}>back-of-house</em><br/>
            for indie retail.
          </h1>
          <p style={{
            fontSize: 17, lineHeight: 1.55, color: COLORS.muted, maxWidth: 480,
            marginTop: 32,
          }}>
            Six hundred vetted brands. One purchase order. Sixty-day terms.
            Stock your shelves without stocking your spreadsheet.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
            <button style={{
              background: COLORS.ink, color: COLORS.white, border: 'none',
              padding: '16px 28px', fontFamily: 'Geist, sans-serif', fontSize: 14,
              fontWeight: 500, borderRadius: 2, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              Apply for a buyer account
              <span style={{ color: COLORS.orange }}>→</span>
            </button>
            <button style={{
              background: 'transparent', color: COLORS.ink, border: `1px solid ${COLORS.ink}`,
              padding: '16px 24px', fontFamily: 'Geist, sans-serif', fontSize: 14,
              fontWeight: 500, borderRadius: 2, cursor: 'pointer',
            }}>
              Browse the catalog
            </button>
          </div>

          {/* Stat strip */}
          <div style={{
            marginTop: 72, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: `1px solid ${COLORS.line}`, paddingTop: 28,
          }}>
            {[
              { n: '612', l: 'Vetted brands' },
              { n: '12.4k', l: 'SKUs in stock' },
              { n: 'Net-60', l: 'Standard terms' },
            ].map(s => (
              <div key={s.l}>
                <div style={{
                  fontFamily: 'Instrument Serif, serif', fontSize: 44,
                  color: COLORS.navy, lineHeight: 1, fontWeight: 400,
                }}>{s.n}</div>
                <div style={{
                  fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: COLORS.muted, marginTop: 8,
                }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero imagery — composition */}
        <div style={{
          background: COLORS.bgAlt, padding: 48, position: 'relative', minHeight: 720,
        }}>
          <div style={{ position: 'absolute', inset: 48 }}>
            <Placeholder label="Lifestyle · workshop scene" tone="warm" h="100%"/>
          </div>
          <div style={{
            position: 'absolute', bottom: 48, left: 48, right: 200,
            background: COLORS.blue, color: COLORS.white, padding: '24px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
                textTransform: 'uppercase', opacity: 0.7,
              }}>This week's drop</div>
              <div style={{ fontSize: 18, fontWeight: 500, marginTop: 4 }}>
                Hudson Falls Pottery — 14 new stoneware pieces
              </div>
            </div>
            <span style={{ fontSize: 22 }}>→</span>
          </div>
          <div style={{
            position: 'absolute', top: 48, right: 48, width: 140, height: 140,
            background: COLORS.orange, color: COLORS.white,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: 16, fontFamily: 'Geist Mono, monospace',
          }}>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', opacity: 0.85 }}>OPENING ORDER</div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, lineHeight: 1, marginTop: 6 }}>$150</div>
            <div style={{ fontSize: 10, letterSpacing: '0.06em', marginTop: 4 }}>FOR ALL BRANDS</div>
          </div>
        </div>
      </div>

      {/* CATEGORY GRID */}
      <div style={{ padding: '72px 64px 56px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: 32,
        }}>
          <div>
            <div style={{
              fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: COLORS.muted, marginBottom: 8,
            }}>SECTION 01 · DEPARTMENTS</div>
            <h2 style={{
              fontFamily: 'Instrument Serif, serif', fontSize: 44, margin: 0,
              color: COLORS.ink, fontWeight: 400, letterSpacing: '-0.01em',
            }}>Stock the entire store.</h2>
          </div>
          <span style={{
            fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.06em',
            color: COLORS.muted, textTransform: 'uppercase',
          }}>VIEW ALL 14 DEPARTMENTS →</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { n: '01', t: 'Home & Tabletop', c: '1,420 SKUs', tone: 'warm' },
            { n: '02', t: 'Apothecary', c: '860 SKUs', tone: 'orange' },
            { n: '03', t: 'Stationery', c: '2,100 SKUs', tone: 'cool' },
            { n: '04', t: 'Pantry & Provisions', c: '740 SKUs', tone: 'warm' },
            { n: '05', t: 'Kids & Play', c: '910 SKUs', tone: 'orange' },
            { n: '06', t: 'Apparel', c: '1,640 SKUs', tone: 'cool' },
            { n: '07', t: 'Garden & Outdoor', c: '430 SKUs', tone: 'warm' },
            { n: '08', t: 'Wellness', c: '680 SKUs', tone: 'orange' },
          ].map(c => (
            <div key={c.t} style={{ background: COLORS.white, border: `1px solid ${COLORS.line}` }}>
              <div style={{ aspectRatio: '1 / 1', position: 'relative' }}>
                <Placeholder label={c.t} tone={c.tone} h="100%"/>
                <span style={{
                  position: 'absolute', top: 12, left: 12,
                  fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
                  background: COLORS.ink, color: COLORS.white, padding: '3px 6px',
                }}>{c.n}</span>
              </div>
              <div style={{ padding: '14px 16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.ink }}>{c.t}</div>
                  <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.06em', color: COLORS.muted, marginTop: 4, textTransform: 'uppercase' }}>{c.c}</div>
                </div>
                <span style={{ color: COLORS.blue, fontSize: 18 }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED BRANDS — editorial */}
      <div style={{ padding: '40px 64px 72px', background: COLORS.bgAlt }}>
        <div style={{ paddingTop: 40, marginBottom: 32 }}>
          <div style={{
            fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: COLORS.muted, marginBottom: 8,
          }}>SECTION 02 · MAKERS</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 style={{
              fontFamily: 'Instrument Serif, serif', fontSize: 44, margin: 0,
              color: COLORS.ink, fontWeight: 400, letterSpacing: '-0.01em', maxWidth: 600,
            }}>Brands worth introducing your customers to.</h2>
            <span style={{
              fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.06em',
              color: COLORS.muted, textTransform: 'uppercase',
            }}>WEEK 17 · APR 26</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 16 }}>
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.line}`, padding: 0 }}>
            <div style={{ aspectRatio: '16 / 11', position: 'relative' }}>
              <Placeholder label="Hudson Falls Pottery · studio" tone="cool" h="100%"/>
              <span style={{
                position: 'absolute', top: 16, left: 16,
                background: COLORS.orange, color: COLORS.white,
                fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
                padding: '4px 8px',
              }}>SPOTLIGHT</span>
            </div>
            <div style={{ padding: '24px 28px 28px' }}>
              <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase' }}>
                NY · USA · EST. 2014
              </div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, color: COLORS.ink, marginTop: 6, fontWeight: 400 }}>
                Hudson Falls Pottery
              </div>
              <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.5, marginTop: 10, maxWidth: 480 }}>
                Hand-thrown stoneware made in a converted grain mill outside Kingston.
                14 new pieces this week — wax-resist drips and an oxblood glaze.
              </p>
              <div style={{ display: 'flex', gap: 24, marginTop: 18, fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.04em', color: COLORS.ink, textTransform: 'uppercase' }}>
                <span>→ SEE 38 PRODUCTS</span>
                <span style={{ color: COLORS.muted }}>WHOLESALE FROM $14</span>
              </div>
            </div>
          </div>

          {[
            { n: 'Marlow & Sons Apothecary', loc: 'Portland · OR', cat: 'Apothecary · 22 SKUs', tone: 'orange' },
            { n: 'Atelier Bord', loc: 'Montréal · QC', cat: 'Stationery · 41 SKUs', tone: 'warm' },
          ].map(b => (
            <div key={b.n} style={{ background: COLORS.white, border: `1px solid ${COLORS.line}` }}>
              <div style={{ aspectRatio: '4 / 3' }}>
                <Placeholder label={b.n} tone={b.tone} h="100%"/>
              </div>
              <div style={{ padding: '20px 22px 24px' }}>
                <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.08em', color: COLORS.muted, textTransform: 'uppercase' }}>
                  {b.loc}
                </div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 24, color: COLORS.ink, marginTop: 4, fontWeight: 400, lineHeight: 1.1 }}>
                  {b.n}
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{b.cat}</span>
                  <span style={{ color: COLORS.blue, fontSize: 16 }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VALUE PROPS — three rules */}
      <div style={{ padding: '88px 64px', background: COLORS.navy, color: COLORS.white }}>
        <div style={{
          fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: COLORS.orange, marginBottom: 8,
        }}>SECTION 03 · THE FORGE PROMISE</div>
        <h2 style={{
          fontFamily: 'Instrument Serif, serif', fontSize: 44, margin: 0,
          fontWeight: 400, letterSpacing: '-0.01em', maxWidth: 720, color: COLORS.white,
        }}>Three rules we don't bend on.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, marginTop: 56, background: '#1E3358' }}>
          {[
            { n: 'I.', h: 'Pay net-60, always.', b: 'Order today, pay in sixty days. No interest, no factoring fees, no fine print. We carry the float so you carry the inventory.' },
            { n: 'II.', h: 'Free returns on openers.', b: 'Didn\'t sell through? Send it back, full credit, on us. We\'d rather buy back the box than burn the relationship.' },
            { n: 'III.', h: 'No exclusivity nonsense.', b: 'Stock our brands wherever else you like. We don\'t police your floor — we just want to be on it.' },
          ].map(r => (
            <div key={r.n} style={{ background: COLORS.navy, padding: '32px 28px 36px' }}>
              <div style={{
                fontFamily: 'Instrument Serif, serif', fontSize: 56, color: COLORS.orange,
                lineHeight: 1, fontStyle: 'italic',
              }}>{r.n}</div>
              <div style={{
                fontFamily: 'Instrument Serif, serif', fontSize: 26, marginTop: 16,
                fontWeight: 400, lineHeight: 1.15,
              }}>{r.h}</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#9DAAC2', marginTop: 14 }}>
                {r.b}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

window.Homepage = Homepage;
