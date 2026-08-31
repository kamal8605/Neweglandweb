# Plan: Deploy fastweb on Vercel

## Context

fastweb is a frontend-only Next.js 16 (App Router) e-commerce app with no API routes. All data comes from an external REST API (`NEXT_PUBLIC_API_URL`). The goal is to deploy it on Vercel and configure it optimally for ~100–200 concurrent users.

---

## Step 1: Create `vercel.json`

**File to create:** `/home/user/fastweb/vercel.json`

```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

**Why:**
- `regions: ["iad1"]` — Washington D.C. / US East region, closest to New York users.
- Security headers protect against clickjacking, MIME sniffing, etc.
- Static asset cache header — Next.js already does this but explicit config ensures it on Vercel's edge.

---

## Step 2: Add `.vercelignore`

**File to create:** `/home/user/fastweb/.vercelignore`

```
.env.local
.env.development
node_modules
```

Keeps the deployment bundle clean.

---

## Step 3: Set Environment Variables on Vercel

Go to **Vercel Dashboard → Project → Settings → Environment Variables** and add:

| Key | Value | Environments |
|-----|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.com/api` | Production, Preview, Development |
| `NEXT_PUBLIC_COMPANY_NAME` | Your company name | Production |
| `NEXT_PUBLIC_COMPANY_LOGO_URL` | Logo URL (optional) | Production |
| `NEXT_PUBLIC_THEME` | `forge` or `pallet` | Production |

Note: All are `NEXT_PUBLIC_*` so they're baked into the client bundle at build time — no secrets here.

---

## Step 4: Vercel Dashboard Settings to Tweak

### Build & Deployment
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` or `pnpm install`
- **Node.js Version**: 22.x (latest LTS)

### Performance (for 100–200 users)

**Image Optimization**
- Vercel automatically serves `next/image` via its built-in image CDN.
- The app uses images from `phynixcloud.com` — these will be proxied and cached by Vercel's image CDN automatically.
- No changes needed in next.config.ts — it's already set up.
- On **Hobby plan**, image optimization is limited (1,000 source images/month). Consider **Pro plan** for higher limits if product catalog is large.

**Edge Network / CDN**
- All static assets (`/_next/static/*`) are served from Vercel's global Edge Network automatically — zero config needed.
- For 100–200 users, the Hobby plan handles this fine; no need for dedicated infra.

**Serverless Functions**
- This app has no API routes, so no serverless function config is needed.

---

## Step 5: Helpful Vercel Features to Enable

### 1. Preview Deployments (enabled by default)
Every PR/branch gets its own URL — useful for testing before merging to production. No config needed.

### 2. Speed Insights
Go to **Vercel Dashboard → Project → Analytics → Speed Insights → Enable**.
Tracks Core Web Vitals (LCP, CLS, FID) per-page in production. Free on Hobby plan with limits.

### 3. Web Analytics
Go to **Vercel Dashboard → Project → Analytics → Web Analytics → Enable**.
Lightweight, privacy-friendly page view tracking — no cookie consent needed. Free on Hobby plan.

### 4. Vercel Toolbar (dev only)
Already included via `@vercel/toolbar` when deployed to preview URLs. Useful for commenting on preview deployments.

### 5. Deployment Protection (Pro feature)
If you're on Pro, enable **Password Protection** or **Vercel Authentication** on preview deployments to keep staging URLs private.

---

## Step 6: Plan for Growth Beyond 200 Users

For 100–200 users the **Hobby plan is sufficient** since this is a static/CSR app with no serverless functions. If you expect growth:

- **Upgrade to Pro** when you hit Hobby limits (100GB bandwidth/month, 6,000 build minutes/month).
- Pro gives unlimited serverless function invocations, better image optimization quotas, and team collaboration.

---

## Verification

1. Push the `vercel.json` and `.vercelignore` to the branch.
2. Connect the GitHub repo to Vercel (vercel.com → New Project → Import Git Repository → `jay-brainbean/fastweb`).
3. Set all env vars in the Vercel dashboard.
4. Trigger a deployment and verify:
   - Build completes without errors (`next build` succeeds).
   - Visit the production URL and confirm pages load, API calls reach `NEXT_PUBLIC_API_URL`.
   - Check `/_next/static/` responses have `Cache-Control: public, max-age=31536000, immutable`.
   - Verify images from `phynixcloud.com` load correctly via Vercel's image CDN.
5. Enable Speed Insights and Web Analytics from the dashboard.
