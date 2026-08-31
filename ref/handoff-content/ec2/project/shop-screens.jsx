// B2B shop flow — product details (with variants), cart (grouped by variant),
// and checkout. Reuses Pallet brand tokens and primitives from screens.jsx.

const SHOP_BRAND = {
  blue: '#1B3A8A',
  blueDeep: '#0E2466',
  blueSoft: '#EEF2FB',
  blueLine: '#DBE2F2',
  orange: '#F26B1F',
  orangeSoft: '#FFF1E6',
  ink: '#0F172A',
  ink2: '#475569',
  ink3: '#94A3B8',
  line: '#E5E9F0',
  bg: '#F7F8FB',
  white: '#FFFFFF',
  ok: '#0E9F6E',
};
const SHOP_FONT = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

// ────────────────────────── shared chrome ──────────────────────────

function ShopFrame({ children, bg = SHOP_BRAND.bg }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      fontFamily: SHOP_FONT, color: SHOP_BRAND.ink,
      display: 'flex', flexDirection: 'column',
      letterSpacing: '-0.005em',
    }}>
      {children}
    </div>
  );
}

function ShopLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        background: SHOP_BRAND.blue,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: SHOP_BRAND.orange }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', color: SHOP_BRAND.ink }}>
        Pallet<span style={{ color: SHOP_BRAND.orange }}>.</span>
      </span>
    </div>
  );
}

function ShopNav({ active = 'Catalog', cartCount = 0 }) {
  const links = ['Catalog', 'Lists', 'Orders', 'Quotes', 'Invoices'];
  return (
    <div style={{
      padding: '14px 28px',
      borderBottom: `1px solid ${SHOP_BRAND.line}`,
      display: 'flex', alignItems: 'center', gap: 24,
      background: SHOP_BRAND.white,
    }}>
      <ShopLogo />
      <div style={{
        marginLeft: 8, display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, fontWeight: 600, color: SHOP_BRAND.ink2,
        padding: '4px 10px', borderRadius: 999,
        background: SHOP_BRAND.blueSoft, border: `1px solid ${SHOP_BRAND.blueLine}`,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: SHOP_BRAND.ok }} />
        Northwind Supply · Tier 2
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 18, marginLeft: 18 }}>
        {links.map(l => (
          <span key={l} style={{
            fontSize: 13,
            fontWeight: l === active ? 600 : 500,
            color: l === active ? SHOP_BRAND.ink : SHOP_BRAND.ink2,
            paddingBottom: 2,
            borderBottom: l === active ? `2px solid ${SHOP_BRAND.blue}` : '2px solid transparent',
          }}>{l}</span>
        ))}
      </div>
      {/* search */}
      <div style={{
        width: 240, height: 34, borderRadius: 8,
        border: `1px solid ${SHOP_BRAND.line}`, background: SHOP_BRAND.bg,
        display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px',
        fontSize: 12, color: SHOP_BRAND.ink3,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke={SHOP_BRAND.ink3} strokeWidth="1.4"/>
          <path d="M9.5 9.5L12 12" stroke={SHOP_BRAND.ink3} strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        Search SKUs, brands…
      </div>
      {/* cart */}
      <div style={{
        position: 'relative',
        width: 36, height: 34, borderRadius: 8,
        border: `1px solid ${SHOP_BRAND.line}`, background: SHOP_BRAND.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 2H4L4.8 11.2C4.85 11.7 5.27 12 5.77 12H12.5C13 12 13.4 11.7 13.5 11.2L14.7 5H4.5" stroke={SHOP_BRAND.ink} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="6.5" cy="14" r="1" fill={SHOP_BRAND.ink}/>
          <circle cx="12" cy="14" r="1" fill={SHOP_BRAND.ink}/>
        </svg>
        {cartCount > 0 && (
          <div style={{
            position: 'absolute', top: -6, right: -6,
            minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999,
            background: SHOP_BRAND.orange, color: SHOP_BRAND.white,
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${SHOP_BRAND.white}`,
          }}>{cartCount}</div>
        )}
      </div>
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: SHOP_BRAND.orange, color: SHOP_BRAND.white,
        fontSize: 12, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>MO</div>
    </div>
  );
}

function ShopBtn({ children, primary, ghost, full, icon, small, leftIcon }) {
  const bg = primary ? SHOP_BRAND.blue : ghost ? 'transparent' : SHOP_BRAND.white;
  const fg = primary ? SHOP_BRAND.white : ghost ? SHOP_BRAND.ink2 : SHOP_BRAND.ink;
  const border = ghost ? 'transparent' : primary ? 'transparent' : SHOP_BRAND.line;
  return (
    <button style={{
      height: small ? 34 : 42, padding: small ? '0 14px' : '0 18px',
      borderRadius: 8,
      background: bg, color: fg,
      border: `1px solid ${border}`,
      fontSize: small ? 12 : 13, fontWeight: 600, fontFamily: SHOP_FONT,
      cursor: 'pointer',
      width: full ? '100%' : 'auto',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      letterSpacing: '-0.005em',
    }}>
      {leftIcon}
      {children}
      {icon}
    </button>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Striped placeholder image – never draw fake products as SVG art.
function ProductPlaceholder({ label, tone = 'blue', tall }) {
  const tones = {
    blue:   { bg: '#E7ECF7', stripe: '#D0D9EE', ink: SHOP_BRAND.blue },
    orange: { bg: '#FCE6D6', stripe: '#F7CFAE', ink: SHOP_BRAND.orange },
    cream:  { bg: '#F4EFE6', stripe: '#E6DCC8', ink: '#7A6A4A' },
    mint:   { bg: '#DDEBE3', stripe: '#C2D9CC', ink: '#1F6B4F' },
    rose:   { bg: '#F3DFE2', stripe: '#E5C4C9', ink: '#9A3848' },
    plum:   { bg: '#E5DEEC', stripe: '#CFC1DD', ink: '#5B4377' },
  };
  const t = tones[tone] || tones.blue;
  return (
    <div style={{
      width: '100%', height: tall ? 360 : '100%',
      borderRadius: 10,
      background: `repeating-linear-gradient(135deg, ${t.bg} 0 14px, ${t.stripe} 14px 28px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 11, color: t.ink, letterSpacing: '0.04em',
      border: `1px solid ${SHOP_BRAND.line}`,
    }}>
      {label}
    </div>
  );
}

// Variant data shared between PDP and cart.
const PRODUCT = {
  brand: 'Sunrise Roasters',
  name: 'Single-Origin Cold Brew Concentrate',
  sku: 'SR-CBC',
  unit: '12 × 32oz case',
  rating: 4.8,
  reviews: 142,
  moq: 4,
  leadTime: '2–3 business days',
  shelfLife: '14 months',
  description: 'Slow-steeped 18 hours, double-filtered, shelf-stable concentrate. Mix 1:3 with water or milk. Sized for café back-bar and grab-and-go programs.',
};

const VARIANTS = [
  { id: 'classic',  flavor: 'Classic Dark',     tone: 'cream',  origin: 'Colombia · Huila',     price: 84.00, tier: 78.00, stock: 'In stock · 412 cases' },
  { id: 'vanilla',  flavor: 'Madagascar Vanilla', tone: 'orange', origin: 'Ethiopia + vanilla',  price: 92.00, tier: 86.00, stock: 'In stock · 188 cases' },
  { id: 'mocha',    flavor: 'Cocoa Mocha',      tone: 'plum',   origin: 'Brazil · cacao blend', price: 92.00, tier: 86.00, stock: 'In stock · 96 cases' },
  { id: 'oat',      flavor: 'Oat Latte (RTD)',  tone: 'mint',   origin: 'Guatemala + oat base', price: 108.00, tier: 99.00, stock: 'Low · 24 cases' },
  { id: 'decaf',    flavor: 'Swiss Water Decaf',tone: 'rose',   origin: 'Peru · decaffeinated', price: 88.00, tier: 82.00, stock: 'Backorder · ships May 18' },
];

// ────────────────────────── 1 · Product details ──────────────────────────

function Screen_PDP() {
  const selected = VARIANTS[1]; // Vanilla
  return (
    <ShopFrame bg={SHOP_BRAND.white}>
      <ShopNav active="Catalog" cartCount={2} />
      {/* breadcrumb */}
      <div style={{
        padding: '12px 28px', fontSize: 12, color: SHOP_BRAND.ink2,
        borderBottom: `1px solid ${SHOP_BRAND.line}`, background: SHOP_BRAND.white,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span>Catalog</span>
        <span style={{ color: SHOP_BRAND.ink3 }}>›</span>
        <span>Beverage</span>
        <span style={{ color: SHOP_BRAND.ink3 }}>›</span>
        <span>Cold Brew & RTD</span>
        <span style={{ color: SHOP_BRAND.ink3 }}>›</span>
        <span style={{ color: SHOP_BRAND.ink, fontWeight: 600 }}>Sunrise Roasters CBC</span>
      </div>

      <div style={{ flex: 1, padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, overflow: 'auto' }}>
        {/* Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ProductPlaceholder label={`[ HERO · ${selected.flavor.toUpperCase()} CASE PACK ]`} tone={selected.tone} tall />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, height: 78 }}>
            {[selected.tone, 'cream', 'plum', 'blue'].map((t, i) => (
              <div key={i} style={{
                position: 'relative',
                border: i === 0 ? `2px solid ${SHOP_BRAND.blue}` : `1px solid ${SHOP_BRAND.line}`,
                borderRadius: 8, overflow: 'hidden',
              }}>
                <ProductPlaceholder label={i === 0 ? 'FRONT' : i === 1 ? 'BACK' : i === 2 ? 'NUTRI' : 'LIFESTYLE'} tone={t} />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              color: SHOP_BRAND.orange,
            }}>SUNRISE ROASTERS</span>
            <span style={{ color: SHOP_BRAND.ink3 }}>·</span>
            <span style={{ fontSize: 11, color: SHOP_BRAND.ink2 }}>SKU {PRODUCT.sku}-{selected.id.toUpperCase()}</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 8 }}>
            {PRODUCT.name}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, fontSize: 12, color: SHOP_BRAND.ink2 }}>
            <span style={{ color: SHOP_BRAND.orange, fontWeight: 700 }}>★ {PRODUCT.rating}</span>
            <span>({PRODUCT.reviews} buyer reviews)</span>
            <span style={{ color: SHOP_BRAND.ink3 }}>·</span>
            <span>{PRODUCT.unit}</span>
          </div>

          {/* Price block */}
          <div style={{
            background: SHOP_BRAND.blueSoft,
            border: `1px solid ${SHOP_BRAND.blueLine}`,
            borderRadius: 10, padding: '14px 16px', marginBottom: 18,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 11, color: SHOP_BRAND.ink2, fontWeight: 600, letterSpacing: '0.04em' }}>YOUR TIER 2 PRICE</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: SHOP_BRAND.blue, letterSpacing: '-0.02em' }}>
                  ${selected.tier.toFixed(2)}
                </span>
                <span style={{ fontSize: 12, color: SHOP_BRAND.ink2, textDecoration: 'line-through' }}>${selected.price.toFixed(2)}</span>
                <span style={{ fontSize: 12, color: SHOP_BRAND.orange, fontWeight: 600 }}>save 7%</span>
              </div>
              <div style={{ fontSize: 11, color: SHOP_BRAND.ink2, marginTop: 2 }}>per case · ${(selected.tier/12).toFixed(2)}/unit</div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{
              padding: '6px 10px', borderRadius: 6,
              background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.blueLine}`,
              fontSize: 11, color: SHOP_BRAND.ink2,
            }}>
              <div style={{ fontWeight: 600, color: SHOP_BRAND.ink }}>Net 30</div>
              <div>Approved</div>
            </div>
          </div>

          {/* Variant list — flavors */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                Flavor · <span style={{ color: SHOP_BRAND.ink2, fontWeight: 500 }}>{selected.flavor}</span>
              </div>
              <span style={{ fontSize: 11, color: SHOP_BRAND.ink2 }}>5 variants available</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {VARIANTS.map(v => {
                const active = v.id === selected.id;
                return (
                  <div key={v.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 10px', borderRadius: 8,
                    border: active ? `1.5px solid ${SHOP_BRAND.blue}` : `1px solid ${SHOP_BRAND.line}`,
                    background: active ? SHOP_BRAND.blueSoft : SHOP_BRAND.white,
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden' }}>
                      <ProductPlaceholder label="" tone={v.tone} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{v.flavor}</div>
                      <div style={{ fontSize: 10, color: SHOP_BRAND.ink2 }}>{v.origin}</div>
                    </div>
                    <div style={{
                      fontSize: 10, fontWeight: 600,
                      color: v.stock.startsWith('In stock') ? SHOP_BRAND.ok : v.stock.startsWith('Low') ? SHOP_BRAND.orange : SHOP_BRAND.ink2,
                    }}>
                      {v.stock.split(' · ')[0]}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, width: 64, textAlign: 'right', color: SHOP_BRAND.ink }}>
                      ${v.tier.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quantity + add */}
          <div style={{
            display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: 10,
            alignItems: 'center', marginBottom: 14,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: `1px solid ${SHOP_BRAND.line}`, borderRadius: 8, height: 42,
              background: SHOP_BRAND.white,
            }}>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 18, color: SHOP_BRAND.ink2 }}>−</div>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700 }}>8</div>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 18, color: SHOP_BRAND.ink2 }}>+</div>
            </div>
            <ShopBtn primary full icon={<ArrowRight />}>Add 8 cases to cart</ShopBtn>
            <ShopBtn>♡</ShopBtn>
          </div>
          <div style={{ fontSize: 11, color: SHOP_BRAND.ink2, marginBottom: 18 }}>
            MOQ {PRODUCT.moq} cases · ships in {PRODUCT.leadTime} from Portland, OR
          </div>

          {/* Specs grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
            paddingTop: 14, borderTop: `1px solid ${SHOP_BRAND.line}`,
          }}>
            {[
              { l: 'Pack', v: PRODUCT.unit },
              { l: 'Lead time', v: PRODUCT.leadTime },
              { l: 'Shelf life', v: PRODUCT.shelfLife },
              { l: 'Origin', v: selected.origin },
              { l: 'Certifications', v: 'Organic · Fair Trade' },
              { l: 'Customizable', v: 'Private label avail.' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 10, color: SHOP_BRAND.ink3, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.l}</div>
                <div style={{ fontSize: 12, color: SHOP_BRAND.ink, marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShopFrame>
  );
}

// ────────────────────────── 2 · Cart (grouped by variant) ──────────────────────────

const CART_GROUPS = [
  {
    productSku: 'SR-CBC',
    brand: 'Sunrise Roasters',
    name: 'Single-Origin Cold Brew Concentrate',
    unit: '12 × 32oz case',
    items: [
      { variant: VARIANTS[0], qty: 6 },
      { variant: VARIANTS[1], qty: 8 },
      { variant: VARIANTS[3], qty: 4 },
    ],
  },
  {
    productSku: 'KP-OAT',
    brand: 'Kettle Peak',
    name: 'Oat Milk Barista (Shelf-Stable)',
    unit: '6 × 1L case',
    items: [
      { variant: { id: 'orig',    flavor: 'Original',     tone: 'cream', origin: '—', tier: 28.50, stock: 'In stock' }, qty: 12 },
      { variant: { id: 'barista', flavor: 'Extra Creamy Barista', tone: 'mint',  origin: '—', tier: 32.00, stock: 'In stock' }, qty: 6 },
    ],
  },
];

function lineSubtotal(items) {
  return items.reduce((s, i) => s + i.qty * i.variant.tier, 0);
}

function Screen_Cart() {
  const subtotal = CART_GROUPS.reduce((s, g) => s + lineSubtotal(g.items), 0);
  const totalCases = CART_GROUPS.reduce((s, g) => s + g.items.reduce((a, b) => a + b.qty, 0), 0);
  const shipping = 0;
  const tax = subtotal * 0.0825;
  const total = subtotal + shipping + tax;

  return (
    <ShopFrame>
      <ShopNav active="Catalog" cartCount={totalCases} />
      <div style={{ flex: 1, padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 22, overflow: 'auto' }}>
        {/* Items column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Your cart</div>
            <div style={{ fontSize: 13, color: SHOP_BRAND.ink2 }}>
              {totalCases} cases · {CART_GROUPS.length} products · {CART_GROUPS.reduce((s, g) => s + g.items.length, 0)} variants
            </div>
          </div>
          <div style={{ fontSize: 12, color: SHOP_BRAND.ink2, marginBottom: 18 }}>
            Items grouped by product. Each row is a single flavor/variant — adjust quantities independently.
          </div>

          {CART_GROUPS.map((g, gi) => (
            <div key={g.productSku} style={{
              background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`,
              borderRadius: 12, marginBottom: 14, overflow: 'hidden',
            }}>
              {/* Product header */}
              <div style={{
                padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: `1px solid ${SHOP_BRAND.line}`,
                background: SHOP_BRAND.bg,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden' }}>
                  <ProductPlaceholder label="" tone={gi === 0 ? 'orange' : 'mint'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: SHOP_BRAND.orange, letterSpacing: '0.08em' }}>
                    {g.brand.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 1 }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: SHOP_BRAND.ink2, marginTop: 1 }}>
                    {g.unit} · {g.items.length} variants · {g.items.reduce((s,i)=>s+i.qty,0)} cases
                  </div>
                </div>
                <div style={{ fontSize: 11, color: SHOP_BRAND.ink2, marginRight: 8 }}>
                  Subtotal
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: SHOP_BRAND.ink, minWidth: 80, textAlign: 'right' }}>
                  ${lineSubtotal(g.items).toFixed(2)}
                </div>
              </div>

              {/* Variant rows */}
              <div>
                {/* column header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '52px 1fr 110px 130px 90px 28px',
                  gap: 12, padding: '8px 16px',
                  fontSize: 10, fontWeight: 600, color: SHOP_BRAND.ink3,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  borderBottom: `1px solid ${SHOP_BRAND.line}`,
                }}>
                  <div></div>
                  <div>Variant</div>
                  <div>Unit price</div>
                  <div>Quantity</div>
                  <div style={{ textAlign: 'right' }}>Line total</div>
                  <div></div>
                </div>

                {g.items.map((line, li) => (
                  <div key={line.variant.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 1fr 110px 130px 90px 28px',
                    gap: 12, padding: '14px 16px', alignItems: 'center',
                    borderBottom: li < g.items.length - 1 ? `1px solid ${SHOP_BRAND.line}` : 'none',
                  }}>
                    <div style={{ width: 52, height: 52, borderRadius: 6, overflow: 'hidden' }}>
                      <ProductPlaceholder label="" tone={line.variant.tone} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{line.variant.flavor}</div>
                      <div style={{ fontSize: 11, color: SHOP_BRAND.ink2, marginTop: 1 }}>
                        SKU {g.productSku}-{line.variant.id.toUpperCase()}
                        {line.variant.origin && line.variant.origin !== '—' && (
                          <span> · {line.variant.origin}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: line.variant.stock?.startsWith('Low') ? SHOP_BRAND.orange : line.variant.stock?.startsWith('Backorder') ? SHOP_BRAND.ink2 : SHOP_BRAND.ok, fontWeight: 600, marginTop: 3 }}>
                        ● {line.variant.stock || 'In stock'}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      ${line.variant.tier.toFixed(2)}
                      <div style={{ fontSize: 10, color: SHOP_BRAND.ink2, fontWeight: 500 }}>per case</div>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      border: `1px solid ${SHOP_BRAND.line}`, borderRadius: 8, height: 34,
                      background: SHOP_BRAND.white,
                    }}>
                      <div style={{ flex: 1, textAlign: 'center', fontSize: 14, color: SHOP_BRAND.ink2 }}>−</div>
                      <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>{line.qty}</div>
                      <div style={{ flex: 1, textAlign: 'center', fontSize: 14, color: SHOP_BRAND.ink2 }}>+</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      ${(line.qty * line.variant.tier).toFixed(2)}
                    </div>
                    <div style={{ fontSize: 14, color: SHOP_BRAND.ink3, textAlign: 'center', cursor: 'pointer' }}>×</div>
                  </div>
                ))}

                {/* group footer — add another variant */}
                <div style={{
                  padding: '10px 16px',
                  borderTop: `1px solid ${SHOP_BRAND.line}`,
                  background: SHOP_BRAND.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontSize: 12,
                }}>
                  <span style={{ color: SHOP_BRAND.blue, fontWeight: 600 }}>+ Add another variant of {g.brand}</span>
                  <span style={{ color: SHOP_BRAND.ink2 }}>
                    Buy 5+ variants, save additional 3% · <b style={{ color: SHOP_BRAND.orange }}>{g.items.length === 5 ? 'unlocked' : `${5 - g.items.length} to go`}</b>
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Recently viewed strip */}
          <div style={{
            background: SHOP_BRAND.white, border: `1px dashed ${SHOP_BRAND.line}`,
            borderRadius: 10, padding: 14,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: SHOP_BRAND.ink2 }}>Often paired:</div>
            {['rose', 'plum', 'cream'].map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8, flex: 1,
                padding: 6, borderRadius: 8, border: `1px solid ${SHOP_BRAND.line}`,
              }}>
                <div style={{ width: 30, height: 30, borderRadius: 4, overflow: 'hidden' }}>
                  <ProductPlaceholder label="" tone={t} />
                </div>
                <div style={{ flex: 1, fontSize: 11 }}>
                  <div style={{ fontWeight: 600 }}>{['Compostable cups', 'Paper straws', 'Vanilla syrup'][i]}</div>
                  <div style={{ color: SHOP_BRAND.ink2 }}>${[42.00, 18.50, 24.00][i].toFixed(2)}</div>
                </div>
                <div style={{ fontSize: 16, color: SHOP_BRAND.blue, fontWeight: 700 }}>+</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary column */}
        <div>
          <div style={{
            background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`,
            borderRadius: 12, padding: 18, position: 'sticky', top: 0,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Order summary</div>

            {[
              { l: `Subtotal · ${totalCases} cases`, v: `$${subtotal.toFixed(2)}` },
              { l: 'Wholesale tier discount', v: '−$54.00', muted: SHOP_BRAND.orange },
              { l: 'Shipping (LTL freight)', v: 'Free' },
              { l: 'Tax (estimated)', v: `$${tax.toFixed(2)}` },
            ].map(r => (
              <div key={r.l} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', fontSize: 13,
                borderBottom: `1px solid ${SHOP_BRAND.line}`,
              }}>
                <span style={{ color: SHOP_BRAND.ink2 }}>{r.l}</span>
                <span style={{ fontWeight: 600, color: r.muted || SHOP_BRAND.ink }}>{r.v}</span>
              </div>
            ))}

            <div style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '14px 0 4px', fontSize: 16,
            }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontWeight: 700, color: SHOP_BRAND.blue }}>${total.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: 11, color: SHOP_BRAND.ink2, marginBottom: 14 }}>
              Charged on Net 30 terms · due Jun 3
            </div>

            <ShopBtn primary full icon={<ArrowRight />}>Checkout</ShopBtn>
            <div style={{ marginTop: 8 }}>
              <ShopBtn full>Save as draft / quote</ShopBtn>
            </div>

            {/* PO entry */}
            <div style={{
              marginTop: 14, padding: 12,
              background: SHOP_BRAND.blueSoft, border: `1px solid ${SHOP_BRAND.blueLine}`,
              borderRadius: 8,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: SHOP_BRAND.blue, letterSpacing: '0.04em' }}>PO NUMBER</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>NW-2026-04-118</div>
              <div style={{ fontSize: 11, color: SHOP_BRAND.ink2, marginTop: 2 }}>Auto-applied to invoice</div>
            </div>
          </div>

          {/* Approval flow card */}
          <div style={{
            background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`,
            borderRadius: 12, padding: 16, marginTop: 14,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Approval needed</div>
            <div style={{ fontSize: 11, color: SHOP_BRAND.ink2, marginBottom: 10, lineHeight: 1.4 }}>
              Total exceeds your $1,500 limit. Will route to <b style={{ color: SHOP_BRAND.ink }}>Rae Chen</b> after checkout.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#A8B3CF', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>RC</div>
              <div style={{ fontSize: 11 }}>
                <div style={{ fontWeight: 600 }}>Rae Chen</div>
                <div style={{ color: SHOP_BRAND.ink2 }}>Approver · usually replies in 2h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShopFrame>
  );
}

// ────────────────────────── 3 · Checkout ──────────────────────────

function Screen_Checkout() {
  const subtotal = CART_GROUPS.reduce((s, g) => s + lineSubtotal(g.items), 0);
  const totalCases = CART_GROUPS.reduce((s, g) => s + g.items.reduce((a, b) => a + b.qty, 0), 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <ShopFrame>
      <ShopNav active="Catalog" cartCount={totalCases} />
      <div style={{
        padding: '14px 28px', borderBottom: `1px solid ${SHOP_BRAND.line}`,
        background: SHOP_BRAND.white, fontSize: 12, color: SHOP_BRAND.ink2,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span>Cart</span><span style={{ color: SHOP_BRAND.ink3 }}>›</span>
        <span style={{ color: SHOP_BRAND.ink, fontWeight: 600 }}>Checkout</span>
        <span style={{ color: SHOP_BRAND.ink3 }}>›</span><span>Confirmation</span>
        <div style={{ flex: 1 }} />
        <span style={{
          padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
          background: SHOP_BRAND.orangeSoft, color: SHOP_BRAND.orange,
        }}>🔒 Net 30 terms</span>
      </div>

      <div style={{ flex: 1, padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 22, overflow: 'auto' }}>
        {/* Left: forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Ship to */}
          <div style={{ background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>1 · Ship to</div>
              <span style={{ fontSize: 11, color: SHOP_BRAND.blue, fontWeight: 600 }}>+ New address</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { name: 'Northwind · Portland HQ', addr: '2200 Industrial Pkwy, Suite 410\nPortland, OR 97203', selected: true, badge: 'Default' },
                { name: 'Northwind · Tacoma DC', addr: '4188 Marine View Dr\nTacoma, WA 98422', selected: false, badge: '' },
              ].map(a => (
                <div key={a.name} style={{
                  border: a.selected ? `1.5px solid ${SHOP_BRAND.blue}` : `1px solid ${SHOP_BRAND.line}`,
                  background: a.selected ? SHOP_BRAND.blueSoft : SHOP_BRAND.white,
                  borderRadius: 10, padding: 12, position: 'relative',
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: `1.5px solid ${a.selected ? SHOP_BRAND.blue : SHOP_BRAND.line}`,
                    background: SHOP_BRAND.white,
                    position: 'absolute', top: 12, right: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {a.selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: SHOP_BRAND.blue }} />}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>
                    {a.name}
                    {a.badge && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, color: SHOP_BRAND.orange }}>{a.badge}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: SHOP_BRAND.ink2, whiteSpace: 'pre-line', marginTop: 4, lineHeight: 1.5 }}>
                    {a.addr}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div style={{ background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>2 · Delivery</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { t: 'Standard LTL freight', d: 'Arrives May 7–9 · pallet drop, liftgate included', p: 'Free', sel: true },
                { t: 'Expedited (2-day)', d: 'Arrives May 6 · refrigerated truck', p: '+$84.00' },
                { t: 'Will-call pickup', d: 'Portland warehouse · ready in 4h', p: 'Free' },
              ].map((d, i) => (
                <div key={d.t} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 12, borderRadius: 8,
                  border: d.sel ? `1.5px solid ${SHOP_BRAND.blue}` : `1px solid ${SHOP_BRAND.line}`,
                  background: d.sel ? SHOP_BRAND.blueSoft : SHOP_BRAND.white,
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: `1.5px solid ${d.sel ? SHOP_BRAND.blue : SHOP_BRAND.line}`,
                    background: SHOP_BRAND.white,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {d.sel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: SHOP_BRAND.blue }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{d.t}</div>
                    <div style={{ fontSize: 11, color: SHOP_BRAND.ink2 }}>{d.d}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: d.p === 'Free' ? SHOP_BRAND.ok : SHOP_BRAND.ink }}>{d.p}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div style={{ background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>3 · Payment</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
              {[
                { t: 'Net 30 invoice', d: 'Bill to Northwind · due Jun 3', sel: true },
                { t: 'ACH transfer', d: 'Pay now, save 1.5%' },
                { t: 'Card on file', d: 'Visa ··· 4821' },
              ].map(p => (
                <div key={p.t} style={{
                  padding: 12, borderRadius: 8,
                  border: p.sel ? `1.5px solid ${SHOP_BRAND.blue}` : `1px solid ${SHOP_BRAND.line}`,
                  background: p.sel ? SHOP_BRAND.blueSoft : SHOP_BRAND.white,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{p.t}</div>
                  <div style={{ fontSize: 11, color: SHOP_BRAND.ink2, marginTop: 3 }}>{p.d}</div>
                </div>
              ))}
            </div>
            <div style={{
              padding: 12, borderRadius: 8,
              background: SHOP_BRAND.orangeSoft, border: `1px solid ${SHOP_BRAND.orange}55`,
              display: 'flex', alignItems: 'center', gap: 10, fontSize: 12,
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', background: SHOP_BRAND.orange, color: '#fff',
                fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>$</span>
              <span><b>$50,000 credit limit</b> — $42,118 available after this order.</span>
            </div>
          </div>
        </div>

        {/* Right: review summary */}
        <div>
          <div style={{
            background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`,
            borderRadius: 12, padding: 18,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Review order</div>

            {CART_GROUPS.map(g => (
              <div key={g.productSku} style={{
                marginBottom: 12, paddingBottom: 12,
                borderBottom: `1px solid ${SHOP_BRAND.line}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 4, overflow: 'hidden' }}>
                    <ProductPlaceholder label="" tone={g.productSku === 'SR-CBC' ? 'orange' : 'mint'} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, flex: 1 }}>{g.brand}</div>
                  <div style={{ fontSize: 11, color: SHOP_BRAND.ink2 }}>{g.items.length} variants</div>
                </div>
                {g.items.map(line => (
                  <div key={line.variant.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '4px 0', fontSize: 12,
                  }}>
                    <span style={{ color: SHOP_BRAND.ink2 }}>
                      <span style={{ color: SHOP_BRAND.ink, fontWeight: 500 }}>{line.variant.flavor}</span>
                      <span> × {line.qty}</span>
                    </span>
                    <span style={{ fontWeight: 600 }}>${(line.qty * line.variant.tier).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ))}

            {[
              { l: 'Subtotal', v: `$${subtotal.toFixed(2)}` },
              { l: 'Shipping', v: 'Free', ok: true },
              { l: 'Tax (8.25%)', v: `$${tax.toFixed(2)}` },
            ].map(r => (
              <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12 }}>
                <span style={{ color: SHOP_BRAND.ink2 }}>{r.l}</span>
                <span style={{ fontWeight: 600, color: r.ok ? SHOP_BRAND.ok : SHOP_BRAND.ink }}>{r.v}</span>
              </div>
            ))}

            <div style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '12px 0 4px', borderTop: `1px solid ${SHOP_BRAND.line}`, marginTop: 6,
            }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Total due Jun 3</span>
              <span style={{ fontWeight: 700, fontSize: 18, color: SHOP_BRAND.blue, letterSpacing: '-0.01em' }}>
                ${total.toFixed(2)}
              </span>
            </div>

            <div style={{ marginTop: 14 }}>
              <ShopBtn primary full icon={<ArrowRight />}>Place order · request approval</ShopBtn>
            </div>
            <div style={{ fontSize: 10, color: SHOP_BRAND.ink2, marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
              By placing this order you agree to Pallet's Wholesale Terms.<br />Routes to Rae Chen for approval before fulfillment.
            </div>
          </div>
        </div>
      </div>
    </ShopFrame>
  );
}

// ────────────────────────── 4 · Order confirmed ──────────────────────────

function Screen_Confirm() {
  const subtotal = CART_GROUPS.reduce((s, g) => s + lineSubtotal(g.items), 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;
  const totalCases = CART_GROUPS.reduce((s, g) => s + g.items.reduce((a, b) => a + b.qty, 0), 0);

  return (
    <ShopFrame>
      <ShopNav active="Orders" cartCount={0} />
      <div style={{ flex: 1, padding: '28px 28px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 22, overflow: 'auto' }}>
        {/* Left hero */}
        <div>
          <div style={{
            background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`,
            borderRadius: 14, overflow: 'hidden', marginBottom: 14,
          }}>
            <div style={{
              height: 84, position: 'relative', overflow: 'hidden',
              background: `linear-gradient(135deg, ${SHOP_BRAND.blue} 0%, ${SHOP_BRAND.blueDeep} 100%)`,
            }}>
              <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: SHOP_BRAND.orange, opacity: 0.85 }} />
              <div style={{ position: 'absolute', right: 70, top: 36, width: 50, height: 50, borderRadius: '50%', background: SHOP_BRAND.white, opacity: 0.18 }} />
            </div>
            <div style={{ padding: '20px 24px 24px', marginTop: -24 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12, boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
              }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="10" stroke={SHOP_BRAND.orange} strokeWidth="2"/>
                  <path d="M9 13L12 16L17 10" stroke={SHOP_BRAND.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: SHOP_BRAND.orange, letterSpacing: '0.1em', marginBottom: 6 }}>
                ORDER #PAL-48201-A
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
                Order placed — pending approval
              </div>
              <div style={{ fontSize: 13, color: SHOP_BRAND.ink2, lineHeight: 1.55, marginBottom: 16 }}>
                Routed to <b style={{ color: SHOP_BRAND.ink }}>Rae Chen</b> for sign-off. Once approved, fulfillment from Portland kicks off automatically — ETA <b style={{ color: SHOP_BRAND.ink }}>May 7–9</b>.
              </div>

              {/* tracker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 18 }}>
                {['Placed', 'Approval', 'Fulfilling', 'Shipped', 'Delivered'].map((step, i) => {
                  const state = i === 0 ? 'done' : i === 1 ? 'active' : 'todo';
                  return (
                    <React.Fragment key={step}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: state === 'done' ? SHOP_BRAND.blue : state === 'active' ? SHOP_BRAND.orange : SHOP_BRAND.white,
                          border: state === 'todo' ? `1.5px solid ${SHOP_BRAND.line}` : 'none',
                          color: '#fff', fontSize: 11, fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {state === 'done' ? '✓' : state === 'active' ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} /> : ''}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: state === 'active' ? 700 : 500, color: state === 'todo' ? SHOP_BRAND.ink3 : SHOP_BRAND.ink }}>{step}</div>
                      </div>
                      {i < 4 && <div style={{ flex: 1, height: 2, background: i === 0 ? SHOP_BRAND.blue : SHOP_BRAND.line, margin: '0 4px', marginBottom: 14 }} />}
                    </React.Fragment>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <ShopBtn primary icon={<ArrowRight />}>View order details</ShopBtn>
                <ShopBtn>Download PO PDF</ShopBtn>
                <ShopBtn ghost>Reorder</ShopBtn>
              </div>
            </div>
          </div>

          {/* Items recap, grouped by product */}
          <div style={{
            background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`,
            borderRadius: 12, padding: 18,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
              {totalCases} cases · {CART_GROUPS.length} products · {CART_GROUPS.reduce((s,g)=>s+g.items.length,0)} variants
            </div>
            {CART_GROUPS.map((g, gi) => (
              <div key={g.productSku} style={{
                paddingTop: gi === 0 ? 0 : 12, marginTop: gi === 0 ? 0 : 12,
                borderTop: gi === 0 ? 'none' : `1px solid ${SHOP_BRAND.line}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 5, overflow: 'hidden' }}>
                    <ProductPlaceholder label="" tone={gi === 0 ? 'orange' : 'mint'} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, flex: 1 }}>{g.brand} · {g.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>${lineSubtotal(g.items).toFixed(2)}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                  {g.items.map(line => (
                    <div key={line.variant.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 8px', borderRadius: 6, background: SHOP_BRAND.bg,
                      fontSize: 11,
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: SHOP_BRAND.orange }} />
                      <span style={{ flex: 1, fontWeight: 500 }}>{line.variant.flavor}</span>
                      <span style={{ color: SHOP_BRAND.ink2 }}>× {line.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: details column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`,
            borderRadius: 12, padding: 18,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Order details</div>
            {[
              { l: 'PO number', v: 'NW-2026-04-118' },
              { l: 'Placed by', v: 'Maya Okafor' },
              { l: 'Approver', v: 'Rae Chen · pending' },
              { l: 'Ship to', v: 'Portland HQ' },
              { l: 'Delivery', v: 'LTL freight · May 7–9' },
              { l: 'Payment', v: 'Net 30 · due Jun 3' },
            ].map((r, i, arr) => (
              <div key={r.l} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', fontSize: 12,
                borderBottom: i < arr.length - 1 ? `1px solid ${SHOP_BRAND.line}` : 'none',
              }}>
                <span style={{ color: SHOP_BRAND.ink2 }}>{r.l}</span>
                <span style={{ fontWeight: 600 }}>{r.v}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: SHOP_BRAND.white, border: `1px solid ${SHOP_BRAND.line}`,
            borderRadius: 12, padding: 18,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Charges</div>
            {[
              { l: 'Subtotal', v: `$${subtotal.toFixed(2)}` },
              { l: 'Shipping', v: 'Free' },
              { l: 'Tax', v: `$${tax.toFixed(2)}` },
            ].map(r => (
              <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12 }}>
                <span style={{ color: SHOP_BRAND.ink2 }}>{r.l}</span>
                <span style={{ fontWeight: 600 }}>{r.v}</span>
              </div>
            ))}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 10, paddingTop: 10, borderTop: `1px solid ${SHOP_BRAND.line}`,
            }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>Total invoiced</span>
              <span style={{ fontWeight: 700, fontSize: 16, color: SHOP_BRAND.blue }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{
            background: SHOP_BRAND.blue, color: SHOP_BRAND.white,
            borderRadius: 12, padding: 18, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -30, bottom: -30, width: 120, height: 120, borderRadius: '50%', background: SHOP_BRAND.orange, opacity: 0.85 }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', opacity: 0.7, marginBottom: 6 }}>NEXT TIME</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>
                Save this as a recurring order?
              </div>
              <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.5, marginBottom: 12 }}>
                Auto-create a draft of these 5 variants every 4 weeks. Edit before it ships.
              </div>
              <button style={{
                height: 34, padding: '0 14px', borderRadius: 8,
                background: SHOP_BRAND.white, color: SHOP_BRAND.blue,
                border: 'none', fontSize: 12, fontWeight: 700, fontFamily: SHOP_FONT,
                cursor: 'pointer',
              }}>
                Set up subscription →
              </button>
            </div>
          </div>
        </div>
      </div>
    </ShopFrame>
  );
}

Object.assign(window, {
  Screen_PDP, Screen_Cart, Screen_Checkout, Screen_Confirm,
});
