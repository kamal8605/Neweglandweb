// B2B signup flow screens — 6 steps + supporting states.
// Brand: deep blue primary, vibrant orange accent. Inter type stack.

const BRAND = {
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

const FONT = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

// ────────────────────────── primitives ──────────────────────────

function Frame({ children, padded = true, bg = BRAND.white }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      fontFamily: FONT, color: BRAND.ink,
      display: 'flex', flexDirection: 'column',
      letterSpacing: '-0.005em',
    }}>
      {children}
    </div>
  );
}

function Logo({ size = 14 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        background: BRAND.blue,
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: 2,
          background: BRAND.orange,
        }} />
      </div>
      <span style={{ fontSize: size, fontWeight: 700, letterSpacing: '-0.02em', color: BRAND.ink }}>
        Pallet<span style={{ color: BRAND.orange }}>.</span>
      </span>
    </div>
  );
}

function TopBar({ step, total = 4, label }) {
  return (
    <div style={{
      padding: '18px 32px',
      borderBottom: `1px solid ${BRAND.line}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: BRAND.white,
    }}>
      <Logo />
      {step !== undefined ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: BRAND.ink2, fontWeight: 500 }}>
            Step {step} of {total}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                width: 22, height: 4, borderRadius: 2,
                background: i < step ? BRAND.blue : BRAND.line,
              }} />
            ))}
          </div>
        </div>
      ) : label ? (
        <span style={{ fontSize: 12, color: BRAND.ink2 }}>{label}</span>
      ) : (
        <a style={{ fontSize: 13, color: BRAND.ink2, textDecoration: 'none' }}>
          Already have an account? <span style={{ color: BRAND.blue, fontWeight: 600 }}>Sign in</span>
        </a>
      )}
    </div>
  );
}

function Field({ label, value, placeholder, hint, prefix, suffix, focus, error, type = 'text' }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.ink, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center',
        height: 42, borderRadius: 8,
        border: `1px solid ${error ? '#E11D48' : focus ? BRAND.blue : BRAND.line}`,
        background: BRAND.white,
        boxShadow: focus ? `0 0 0 3px ${BRAND.blue}1F` : 'none',
        padding: '0 12px',
        fontSize: 14,
      }}>
        {prefix && <span style={{ color: BRAND.ink3, marginRight: 8 }}>{prefix}</span>}
        <span style={{ flex: 1, color: value ? BRAND.ink : BRAND.ink3 }}>
          {value || placeholder}
        </span>
        {suffix && <span style={{ color: BRAND.ink2, marginLeft: 8, fontSize: 12 }}>{suffix}</span>}
      </div>
      {(hint || error) && (
        <div style={{ fontSize: 11, color: error ? '#E11D48' : BRAND.ink2, marginTop: 5 }}>
          {error || hint}
        </div>
      )}
    </label>
  );
}

function Btn({ children, primary, ghost, full, icon, disabled }) {
  const bg = disabled ? '#E2E8F0' : primary ? BRAND.blue : ghost ? 'transparent' : BRAND.white;
  const fg = disabled ? BRAND.ink3 : primary ? BRAND.white : ghost ? BRAND.ink2 : BRAND.ink;
  const border = ghost ? 'transparent' : primary ? 'transparent' : BRAND.line;
  return (
    <button style={{
      height: 42, padding: '0 18px', borderRadius: 8,
      background: bg, color: fg,
      border: `1px solid ${border}`,
      fontSize: 13, fontWeight: 600, fontFamily: FONT,
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: full ? '100%' : 'auto',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      letterSpacing: '-0.005em',
    }}>
      {children}
      {icon}
    </button>
  );
}

function ArrowR() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Side() {
  return (
    <div style={{
      width: 280, padding: '32px 28px',
      background: BRAND.blue,
      color: BRAND.white,
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* decorative orange wedge */}
      <div style={{
        position: 'absolute', right: -40, bottom: -40,
        width: 180, height: 180, borderRadius: '50%',
        background: BRAND.orange, opacity: 0.9,
      }} />
      <div style={{
        position: 'absolute', right: 60, bottom: 30,
        width: 80, height: 80, borderRadius: '50%',
        background: BRAND.blueDeep, opacity: 0.5,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', opacity: 0.7, marginBottom: 16 }}>
          WHOLESALE OS
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14 }}>
          Built for buyers, suppliers, and everyone in&nbsp;between.
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.78 }}>
          Net terms, custom catalogs, and approval flows — without the spreadsheets.
        </div>
      </div>
      <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1, fontSize: 11, opacity: 0.6 }}>
        Trusted by 4,200+ wholesale teams
      </div>
    </div>
  );
}

// ────────────────────────── 1 · Account ──────────────────────────

function Screen1_Account() {
  return (
    <Frame>
      <TopBar />
      <div style={{ flex: 1, display: 'flex' }}>
        <Side />
        <div style={{ flex: 1, padding: '40px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: BRAND.orange, letterSpacing: '0.1em', marginBottom: 8 }}>
            01 — GET STARTED
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Create your work account
          </div>
          <div style={{ fontSize: 13, color: BRAND.ink2, marginBottom: 24 }}>
            Use your business email. We'll verify the domain in the next step.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Field label="First name" value="Maya" />
            <Field label="Last name" value="Okafor" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Field label="Work email" value="maya@northwindsupply.co" focus suffix="✓ valid domain" />
          </div>
          <div style={{ marginBottom: 18 }}>
            <Field label="Password" value="••••••••••••" hint="12+ characters, including a number and a symbol" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: BRAND.ink2, marginBottom: 22 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 4,
              background: BRAND.blue, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            I agree to the <span style={{ color: BRAND.blue, fontWeight: 600 }}>Terms</span> and <span style={{ color: BRAND.blue, fontWeight: 600 }}>Privacy Policy</span>
          </div>

          <Btn primary full icon={<ArrowR />}>Continue</Btn>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 14px' }}>
            <div style={{ flex: 1, height: 1, background: BRAND.line }} />
            <span style={{ fontSize: 11, color: BRAND.ink3 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: BRAND.line }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Btn>Continue with Google</Btn>
            <Btn>Continue with SSO</Btn>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ────────────────────────── 2 · Business ──────────────────────────

function Screen2_Business() {
  return (
    <Frame bg={BRAND.bg}>
      <TopBar step={2} />
      <div style={{ flex: 1, padding: '40px 64px', overflow: 'auto' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Tell us about your business
          </div>
          <div style={{ fontSize: 13, color: BRAND.ink2, marginBottom: 28 }}>
            This helps us match you with the right pricing tier and supplier catalog.
          </div>

          <div style={{
            background: BRAND.white, border: `1px solid ${BRAND.line}`,
            borderRadius: 12, padding: 24,
          }}>
            <div style={{ marginBottom: 14 }}>
              <Field label="Legal business name" value="Northwind Supply Co." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, marginBottom: 14 }}>
              <Field label="DBA (optional)" placeholder="Doing business as…" />
              <Field label="EIN / Tax ID" value="47-• • • • 932" suffix="🔒" />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Business type</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {['Retailer', 'Distributor', 'Manufacturer', 'Other'].map((t, i) => (
                  <div key={t} style={{
                    height: 38, borderRadius: 8,
                    border: `1.5px solid ${i === 0 ? BRAND.blue : BRAND.line}`,
                    background: i === 0 ? BRAND.blueSoft : BRAND.white,
                    color: i === 0 ? BRAND.blue : BRAND.ink2,
                    fontSize: 13, fontWeight: i === 0 ? 600 : 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{t}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <Field label="Annual purchase volume" value="$500K – $2M" />
              <Field label="Team size" value="11–50 employees" />
            </div>

            <div style={{ borderTop: `1px solid ${BRAND.line}`, paddingTop: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.ink, marginBottom: 12 }}>
                Headquarters address
              </div>
              <div style={{ marginBottom: 12 }}>
                <Field label="Street" value="2200 Industrial Pkwy, Suite 410" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 12 }}>
                <Field label="City" value="Portland" />
                <Field label="State" value="OR" />
                <Field label="ZIP" value="97203" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}>
            <Btn ghost>← Back</Btn>
            <Btn primary icon={<ArrowR />}>Continue to verification</Btn>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ────────────────────────── 3 · Verify ──────────────────────────

function Screen3_Verify() {
  return (
    <Frame bg={BRAND.bg}>
      <TopBar step={3} />
      <div style={{ flex: 1, padding: '40px 64px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Verify your business
          </div>
          <div style={{ fontSize: 13, color: BRAND.ink2, marginBottom: 28 }}>
            We need one document to unlock wholesale pricing and net terms.
          </div>

          {/* Email check banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: BRAND.orangeSoft,
            border: `1px solid ${BRAND.orange}55`,
            borderRadius: 10, padding: '12px 16px', marginBottom: 16,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: BRAND.orange,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: BRAND.white, fontSize: 14, fontWeight: 700,
            }}>✓</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                Email verified — maya@northwindsupply.co
              </div>
              <div style={{ fontSize: 12, color: BRAND.ink2 }}>
                Domain matches your business record.
              </div>
            </div>
          </div>

          {/* Upload */}
          <div style={{
            background: BRAND.white, border: `1px solid ${BRAND.line}`,
            borderRadius: 12, padding: 24, marginBottom: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              Upload a resale certificate or business license
            </div>
            <div style={{ fontSize: 12, color: BRAND.ink2, marginBottom: 14 }}>
              PDF, PNG, or JPG · max 10 MB. Reviewed in under 24 hours.
            </div>

            <div style={{
              border: `2px dashed ${BRAND.blue}`,
              background: BRAND.blueSoft,
              borderRadius: 10, padding: '28px 20px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: BRAND.white, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${BRAND.blueLine}`,
              }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 14V4M11 4L7 8M11 4L15 8M4 14V17C4 17.5523 4.44772 18 5 18H17C17.5523 18 18 17.5523 18 17V14" stroke={BRAND.blue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                Drag a file, or <span style={{ color: BRAND.blue, textDecoration: 'underline' }}>browse</span>
              </div>
              <div style={{ fontSize: 11, color: BRAND.ink2 }}>
                Encrypted at rest · SOC 2 Type II
              </div>
            </div>

            {/* Already uploaded */}
            <div style={{
              marginTop: 14,
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 8,
              background: BRAND.bg, border: `1px solid ${BRAND.line}`,
            }}>
              <div style={{
                width: 32, height: 36, borderRadius: 4,
                background: BRAND.white, border: `1px solid ${BRAND.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: BRAND.orange,
              }}>PDF</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>resale-cert-OR-2024.pdf</div>
                <div style={{ fontSize: 11, color: BRAND.ink2 }}>1.4 MB · uploaded just now</div>
              </div>
              <div style={{ fontSize: 11, color: BRAND.ok, fontWeight: 600 }}>● Ready</div>
            </div>
          </div>

          {/* Skip */}
          <div style={{ fontSize: 12, color: BRAND.ink2, marginBottom: 22 }}>
            Don't have one handy? <span style={{ color: BRAND.blue, fontWeight: 600 }}>Skip and finish later</span> — you can browse the catalog but checkout will be limited.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Btn ghost>← Back</Btn>
            <Btn primary icon={<ArrowR />}>Continue</Btn>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ────────────────────────── 4 · Team ──────────────────────────

function Screen4_Team() {
  const seats = [
    { name: 'Maya Okafor', email: 'maya@northwindsupply.co', role: 'Admin', you: true },
    { name: 'Devon Patel', email: 'devon@northwindsupply.co', role: 'Buyer' },
    { name: 'Rae Chen', email: 'rae@northwindsupply.co', role: 'Approver' },
  ];
  return (
    <Frame bg={BRAND.bg}>
      <TopBar step={4} />
      <div style={{ flex: 1, padding: '40px 64px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Invite your team
          </div>
          <div style={{ fontSize: 13, color: BRAND.ink2, marginBottom: 28 }}>
            Add buyers, approvers, and finance. You can change roles anytime.
          </div>

          <div style={{
            background: BRAND.white, border: `1px solid ${BRAND.line}`,
            borderRadius: 12, overflow: 'hidden', marginBottom: 14,
          }}>
            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1.6fr 1fr auto', gap: 10 }}>
              <Field label="Email address" placeholder="teammate@northwindsupply.co" />
              <Field label="Role" value="Buyer" suffix="▾" />
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Btn>+ Add</Btn>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${BRAND.line}` }}>
              {seats.map((s, i) => (
                <div key={s.email} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  borderTop: i === 0 ? 'none' : `1px solid ${BRAND.line}`,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: i === 0 ? BRAND.orange : i === 1 ? BRAND.blue : '#A8B3CF',
                    color: BRAND.white, fontSize: 12, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{s.name.split(' ').map(n => n[0]).join('')}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {s.name} {s.you && <span style={{ color: BRAND.ink3, fontWeight: 500, fontSize: 11 }}>· you</span>}
                    </div>
                    <div style={{ fontSize: 11, color: BRAND.ink2 }}>{s.email}</div>
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600,
                    padding: '4px 10px', borderRadius: 999,
                    background: s.role === 'Admin' ? BRAND.blueSoft : s.role === 'Approver' ? BRAND.orangeSoft : BRAND.bg,
                    color: s.role === 'Admin' ? BRAND.blue : s.role === 'Approver' ? BRAND.orange : BRAND.ink2,
                  }}>{s.role}</div>
                  <div style={{ fontSize: 11, color: BRAND.ink3, width: 70, textAlign: 'right' }}>
                    {s.you ? '—' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roles legend */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
            marginBottom: 22,
          }}>
            {[
              { t: 'Buyer', d: 'Browse, build carts, request quotes.' },
              { t: 'Approver', d: 'Sign off on orders over your limit.' },
              { t: 'Admin', d: 'Manage seats, billing, and net terms.' },
            ].map((r, i) => (
              <div key={r.t} style={{
                padding: 12, borderRadius: 8,
                background: BRAND.white, border: `1px solid ${BRAND.line}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3, color: i === 2 ? BRAND.blue : i === 1 ? BRAND.orange : BRAND.ink }}>
                  {r.t}
                </div>
                <div style={{ fontSize: 11, color: BRAND.ink2, lineHeight: 1.4 }}>{r.d}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Btn ghost>Skip for now</Btn>
            <Btn primary icon={<ArrowR />}>Send invites & finish</Btn>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ────────────────────────── 5 · Pending review ──────────────────────────

function Screen5_Pending() {
  const steps = [
    { t: 'Account created', s: 'done', when: 'Just now' },
    { t: 'Email verified', s: 'done', when: '2 min ago' },
    { t: 'Documents under review', s: 'active', when: 'Typically <24h' },
    { t: 'Net terms approved', s: 'todo', when: '' },
  ];
  return (
    <Frame bg={BRAND.bg}>
      <TopBar label="Onboarding · 5 of 6" />
      <div style={{ flex: 1, padding: '40px 64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '100%', maxWidth: 560,
          background: BRAND.white, border: `1px solid ${BRAND.line}`,
          borderRadius: 14, overflow: 'hidden',
        }}>
          {/* hero strip */}
          <div style={{
            height: 88, position: 'relative', overflow: 'hidden',
            background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.blueDeep} 100%)`,
          }}>
            <div style={{
              position: 'absolute', right: -20, top: -20,
              width: 120, height: 120, borderRadius: '50%',
              background: BRAND.orange, opacity: 0.85,
            }} />
            <div style={{
              position: 'absolute', right: 70, top: 30,
              width: 50, height: 50, borderRadius: '50%',
              background: BRAND.white, opacity: 0.18,
            }} />
          </div>

          <div style={{ padding: '24px 28px 28px', marginTop: -28 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: BRAND.white, border: `1px solid ${BRAND.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14, boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
            }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="13" r="10" stroke={BRAND.orange} strokeWidth="2" strokeDasharray="4 3"/>
                <path d="M9 13L12 16L17 10" stroke={BRAND.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
              We're reviewing your application
            </div>
            <div style={{ fontSize: 13, color: BRAND.ink2, marginBottom: 22, lineHeight: 1.5 }}>
              You can browse the catalog now. We'll email <b style={{ color: BRAND.ink }}>maya@northwindsupply.co</b> as soon as net terms and wholesale pricing are unlocked — usually within a business day.
            </div>

            {/* checklist */}
            <div style={{ marginBottom: 22 }}>
              {steps.map((step, i) => (
                <div key={step.t} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '10px 0',
                  borderTop: i === 0 ? `1px solid ${BRAND.line}` : 'none',
                  borderBottom: `1px solid ${BRAND.line}`,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: step.s === 'done' ? BRAND.blue : step.s === 'active' ? BRAND.orange : BRAND.white,
                    border: step.s === 'todo' ? `1.5px solid ${BRAND.line}` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: BRAND.white, fontSize: 11, fontWeight: 700,
                  }}>
                    {step.s === 'done' ? '✓' : step.s === 'active' ? (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: BRAND.white,
                      }} />
                    ) : ''}
                  </div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: step.s === 'active' ? 600 : 500, color: step.s === 'todo' ? BRAND.ink3 : BRAND.ink }}>
                    {step.t}
                  </div>
                  <div style={{ fontSize: 11, color: BRAND.ink2 }}>{step.when}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Btn primary full icon={<ArrowR />}>Browse catalog</Btn>
              <Btn>Set up payments</Btn>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ────────────────────────── 6 · Welcome ──────────────────────────

function Screen6_Welcome() {
  return (
    <Frame>
      <TopBar label="Welcome to Pallet" />
      <div style={{ flex: 1, display: 'flex' }}>
        {/* left feature */}
        <div style={{
          flex: 1.1, padding: '48px 56px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: BRAND.orange, letterSpacing: '0.1em', marginBottom: 10 }}>
            ★ APPROVED · NET 30 UNLOCKED
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 12 }}>
            Welcome aboard,<br />
            <span style={{ color: BRAND.blue }}>Northwind Supply.</span>
          </div>
          <div style={{ fontSize: 14, color: BRAND.ink2, marginBottom: 28, lineHeight: 1.55, maxWidth: 380 }}>
            Your wholesale account is live. Here are three things to do in your first session.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {[
              { n: '01', t: 'Connect your accounting', d: 'QuickBooks, Xero, NetSuite — sync invoices automatically.' },
              { n: '02', t: 'Build your first list', d: 'Save SKUs your team reorders every week.' },
              { n: '03', t: 'Set approval limits', d: 'Auto-approve under $5K, route the rest to Rae.' },
            ].map((task, i) => (
              <div key={task.n} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 10,
                border: `1px solid ${BRAND.line}`,
                background: i === 0 ? BRAND.blueSoft : BRAND.white,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: i === 0 ? BRAND.blue : BRAND.ink3,
                  letterSpacing: '0.05em',
                }}>{task.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{task.t}</div>
                  <div style={{ fontSize: 11, color: BRAND.ink2, marginTop: 2 }}>{task.d}</div>
                </div>
                <ArrowR />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Btn primary icon={<ArrowR />}>Go to dashboard</Btn>
            <Btn ghost>Watch 2-min tour</Btn>
          </div>
        </div>

        {/* right summary card */}
        <div style={{
          flex: 0.9, background: BRAND.bg,
          padding: '48px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderLeft: `1px solid ${BRAND.line}`,
        }}>
          <div style={{
            width: '100%', maxWidth: 320,
            background: BRAND.white, borderRadius: 14,
            border: `1px solid ${BRAND.line}`,
            overflow: 'hidden',
            boxShadow: '0 8px 28px rgba(15,23,42,0.06)',
          }}>
            <div style={{
              padding: '18px 20px',
              background: BRAND.blue, color: BRAND.white,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.08em' }}>ACCOUNT</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>Northwind Supply</div>
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700,
                padding: '4px 8px', borderRadius: 4,
                background: BRAND.orange, color: BRAND.white,
              }}>VERIFIED</div>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { l: 'Plan', v: 'Wholesale · Tier 2' },
                { l: 'Net terms', v: 'Net 30' },
                { l: 'Credit limit', v: '$50,000' },
                { l: 'Seats', v: '3 of 10 used' },
                { l: 'Catalog access', v: '218 suppliers' },
              ].map((row, i) => (
                <div key={row.l} style={{
                  display: 'flex', justifyContent: 'space-between',
                  paddingBottom: i < 4 ? 14 : 0,
                  borderBottom: i < 4 ? `1px solid ${BRAND.line}` : 'none',
                  fontSize: 13,
                }}>
                  <span style={{ color: BRAND.ink2 }}>{row.l}</span>
                  <span style={{ fontWeight: 600 }}>{row.v}</span>
                </div>
              ))}
            </div>
            <div style={{
              padding: '14px 20px',
              borderTop: `1px solid ${BRAND.line}`,
              background: BRAND.bg,
              fontSize: 11, color: BRAND.ink2,
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>Account #NW-48201</span>
              <span style={{ color: BRAND.blue, fontWeight: 600 }}>Manage</span>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

Object.assign(window, {
  Screen1_Account, Screen2_Business, Screen3_Verify,
  Screen4_Team, Screen5_Pending, Screen6_Welcome,
});
