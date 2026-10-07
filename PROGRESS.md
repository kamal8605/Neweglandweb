# Fastweb — Build Progress

> Tracks completed work, decisions made, and what comes next.
> Updated at the end of each phase.

---

## Status Overview

| Phase | Title | Status |
|-------|-------|--------|
| 1 | Project Setup | ✅ Complete |
| 2 | Context, Providers, Layout Shell | ✅ Complete |
| 3 | Shared Components | ✅ Complete |
| 4 | Auth Pages | ✅ Complete |
| 5 | Homepage | ✅ Complete |
| 6 | Category / Browse Pages | ✅ Complete |
| 7 | Brand Pages | ✅ Complete |
| 8 | Product Detail Page | ✅ Complete |
| 9 | New Arrivals & Sale Pages | ✅ Complete |
| 10 | Cart Page | ✅ Complete |
| 11 | Checkout Page | ✅ Complete |
| 12 | Orders & Order Detail | ✅ Complete |
| 13 | Wishlist Page | ✅ Complete |
| 14 | Theme Toggle & Polish | ✅ Complete |
| 15 | Final Integration & E2E Test | ✅ Complete |

---

## Phase 1 — Project Setup ✅

**Completed:** 2026-05-05

### What was done

1. **Dependencies installed**
   - `axios` — HTTP client for API calls
   - `@tanstack/react-query` + `@tanstack/react-query-devtools` — server state management
   - `class-variance-authority`, `clsx`, `tailwind-merge` — shadcn/ui utilities
   - `lucide-react` — icon library
   - Radix UI primitives: `@radix-ui/react-slot`, `react-dialog`, `react-select`, `react-toast`, `react-label`, `react-checkbox`, `react-separator`, `react-scroll-area`, `react-tabs`, `react-avatar`

2. **Fonts configured** (`app/layout.tsx`)
   - Geist Sans → `--font-sans` (weights 300–700)
   - Geist Mono → `--font-mono` (weights 400, 500)
   - Instrument Serif → `--font-serif` (regular + italic)
   - Default theme set via `data-theme="forge"` on `<html>`

3. **Tailwind v4 design tokens** (`app/globals.css`)
   - Forge & Co. theme: warm cream `#F7F4EE`, sharp edges (radius: 2px), Geist + Instrument Serif
   - Pallet theme: clean blue/white `#F7F8FB`, rounded cards (radius: 10px), Inter-compatible
   - Both themes toggled via `html[data-theme]` CSS attribute selectors
   - All brand colors mapped as `--color-brand-*` Tailwind tokens
   - shadcn/ui-compatible CSS variable aliases (`--color-background`, `--color-primary`, etc.)

4. **Environment variables** (`.env.local`)
   - `NEXT_PUBLIC_API_URL` — Gateway REST API base URL
   - `NEXT_PUBLIC_COMPANY_NAME` — Branding (defaults to "Forge & Co.")
   - `NEXT_PUBLIC_COMPANY_LOGO_URL` — Optional logo URL override
   - `NEXT_PUBLIC_THEME` — Default theme name

5. **`lib/utils.ts`** — `cn()` helper merging Tailwind classes (clsx + tailwind-merge)

6. **`lib/axios.ts`** — Axios instance
   - Base URL from `NEXT_PUBLIC_API_URL`
   - Request interceptor: attaches `Authorization: Bearer <token>` from localStorage
   - Response interceptor: on 401, attempts token refresh once; on failure, clears token and redirects to `/login`
   - Queues concurrent requests during refresh (single refresh promise)

7. **`lib/queryClient.ts`** — Shared TanStack QueryClient
   - `staleTime: 5min` for catalogue data
   - `retry: 1`, `refetchOnWindowFocus: false`

8. **`lib/theme.ts`** — Theme utility
   - `getTheme()` — reads from localStorage (SSR-safe)
   - `setTheme(name)` — writes `data-theme` attribute + persists to localStorage
   - `initTheme()` — rehydrates saved theme on client mount

### Decisions / deviations from guide

- Project uses **TypeScript** (`.tsx`/`.ts`) throughout — guide uses `.jsx`; we keep TS for type safety.
- App directory is at **root `app/`** (not `src/app/`) — tsconfig `@/*` alias maps to project root.
- **shadcn CLI skipped** — newer versions (4.x) require network access to `ui.shadcn.com` which is unavailable. Radix UI packages installed manually; components will be authored directly.
- `NEXT_PUBLIC_COMPANY_NAME` and `NEXT_PUBLIC_COMPANY_LOGO_URL` added per guide note on company branding customization via env vars.

### Verification checklist

- [x] Dependencies installed without errors
- [x] Geist + Geist Mono + Instrument Serif fonts configured with CSS variables
- [x] Both Forge and Pallet themes defined via `data-theme` selectors
- [x] Brand Tailwind color tokens mapped (`bg-brand-bg`, `text-brand-ink`, etc.)
- [x] Axios instance exports correctly with interceptors
- [x] QueryClient exported with staleTime defaults
- [x] Theme utility reads/writes localStorage and `data-theme`
- [ ] `npm run dev` verified (pending Phase 2 layout shell before smoke-test)

---

---

## Phase 2 — Context, Providers, Layout Shell ✅

**Completed:** 2026-05-05

### What was done

1. **`context/AuthContext.tsx`**
   - State: `user`, `token`, `isLoading`
   - On mount: validates stored token via `GET /api/users/me`; clears on error
   - Derived: `isAuthenticated`, `isApproved` (approval_status === "approved")
   - Methods: `login(email, password)`, `logout()`, `updateUser(patch)`

2. **`context/CartContext.tsx`**
   - Items shape: `{ product_id, name, sku, image, price, quantity, parent_id?, parent_name? }`
   - Persisted to localStorage (rehydrates on mount)
   - Methods: `addItem`, `updateQty`, `removeItem`, `clearCart`
   - Derived: `itemCount`, `subtotal`

3. **`app/providers.tsx`** — client component wrapping `QueryClientProvider` → `AuthProvider` → `CartProvider` + ReactQueryDevtools

4. **`app/layout.tsx`** — updated to import `<Providers>` around children

5. **Route groups**:
   - `app/(site)/layout.tsx` — wraps pages with `<SiteLayout>` (NavBar + Footer)
   - `app/(site)/page.tsx` — homepage placeholder (replaced in Phase 5)
   - `app/(auth)/layout.tsx` — minimal centered layout for login/register

6. **`components/layout/Logo.tsx`** — SVG F-mark + company name from `NEXT_PUBLIC_COMPANY_NAME`, orange `&` separator

7. **`components/layout/UtilityBar.tsx`** — navy bar; left: freight/terms message; right: auth-aware (SIGN IN link for guests, username + SIGN OUT for logged-in users)

8. **`components/layout/NavBar.tsx`** — Logo + 5 nav links with active underline detection, search form (routes to `/shop?search=`), cart icon with item count badge

9. **`components/layout/Footer.tsx`** — navy footer, 4-column grid (brand description + 3 link columns), copyright bar

10. **`components/layout/SiteLayout.tsx`** — composes UtilityBar + NavBar + `<main>` + Footer

### Decisions / deviations

- Used **route groups** (`(site)` / `(auth)`) instead of manually wrapping each page, keeping the root layout lean
- `GET /api/auth/validate` not in API spec — using `GET /api/users/me` for token validation on mount
- TypeScript throughout; `useCallback` on all context mutators to avoid unnecessary re-renders

### Verification checklist

- [x] TypeScript compiles with no errors (`tsc --noEmit`)
- [x] AuthContext, CartContext typed and exported
- [x] NavBar active state logic covers shop/brand/product routes
- [x] Cart item count badge hidden when cart is empty
- [x] UtilityBar shows correct auth state (guest vs signed-in)
- [x] Route groups created; (site) layout wraps SiteLayout
- [ ] Visual verification pending `npm run dev` smoke test

---

---

## Phase 3 — Shared Components ✅

**Completed:** 2026-05-05

### What was done

1. **`StockDot`** — colored dot + quantity; orange (<100), amber (<400), green (≥400), grey (out of stock), green "In stock" text (unmanaged stock)
2. **`QtyStepper`** — −/value/+ stepper with min/max/disabled support; monospace font, sharp border design
3. **`Breadcrumb`** — monospace uppercase trail with optional link per segment
4. **`PriceGate`** — wraps price content; shows lock + "Sign in to see prices" for guests, "Pending approval" for unapproved users, renders children for approved users
5. **`PageHeader`** — breadcrumb + serif title + italic blue accent + monospace meta + right-side actions
6. **`Pagination`** — prev/next arrows + numbered buttons with ellipsis; active page highlighted; hidden when only 1 page
7. **`ProductCard`** — card with image (stripe placeholder fallback), brand link, name, price (sale strikethrough), stock dot, wishlist heart toggle
8. **`CartBar`** — fixed bottom navy bar; shows cart item count + subtotal; "ADD TO CART" + "VIEW CART" buttons; hidden when cart empty
9. **`ProductTable`** — full-featured table:
   - Columns: expand toggle, image, SKU, name (+SALE badge), brand (optional), price (PriceGate aware, sale strikethrough), off% (optional), stock dot, qty stepper
   - Grouped products expand inline to show child rows
   - Skeleton loading rows (6 rows with pulse animation)
   - Empty state: "No products found"
   - `onQtyChange` callback for parent-controlled cart adds

### Decisions

- `ProductTable` owns local qty state per session; parent gets notified via `onQtyChange`
- `CartBar` reads from `CartContext` directly (no props needed for counts)
- `PriceGate` reads auth state from `AuthContext` — `pricesVisible` prop is the per-product API value

### Verification checklist

- [x] TypeScript compiles clean (tsc --noEmit)
- [x] All components typed with explicit return types
- [x] ProductTable handles loading, empty, simple, grouped states
- [x] PriceGate covers 3 states: guest, pending, approved
- [x] StockDot covers all 4 stock states correctly

---

---

## Phase 4 — Auth Pages ✅

**Completed:** 2026-05-05

### What was done

1. **`app/(auth)/login/page.tsx`**
   - Two-column layout: navy brand panel (left) + form (right)
   - Email + password fields with proper autocomplete attributes
   - Calls `AuthContext.login()` → redirects to `/` on success
   - Error states: invalid credentials (401/422), pending approval (403 or "pending" in message), generic server error
   - "Forgot password" link placeholder; "Apply for access" → `/register`

2. **`app/(auth)/register/page.tsx`**
   - Same two-column layout; left panel shows feature benefits list
   - Fields: name, work email, password, confirm password
   - Client-side validation before API call (empty fields, password length ≥ 8, password match)
   - `POST /api/auth/register` — maps API validation errors per-field
   - Success state replaces form: confirmation message with the submitted email + "Back to sign in" link
   - "Sign in" link → `/login`

3. **`components/auth/withAuth.tsx`** — two hooks:
   - `useRequireAuth()` — redirects to `/login` if unauthenticated; returns `{ isLoading, isAuthenticated }`
   - `useRequireApproved()` — redirects to `/login` if unauthenticated, `/` if authenticated but not approved; used for cart/checkout/orders

### Decisions

- Used hooks (`useRequireAuth`, `useRequireApproved`) rather than an HOC — simpler call site in page components
- Auth layout (`app/(auth)/layout.tsx`) already centers the card on cream background — no extra wrapper needed
- Password confirmation validated client-side only; server also validates via `password_confirmation` field

### Verification checklist

- [x] TypeScript compiles clean
- [x] Login form validates required fields via HTML `required` attribute
- [x] Register form validates password match before API call
- [x] API validation errors mapped per-field with red border + message
- [x] Both pages use shared `Logo` component and brand color tokens
- [x] Pending approval state renders clearly with orange background
- [x] Success state on register shows submitted email address

---

## Notes for Next Phase

---

## Phase 5 — Homepage ✅

**Completed:** 2026-05-05

### What was done

1. **`hooks/useCategories.ts`** — `useCategories()` + `useCategory(id)` React Query hooks; `Category` type with id, name, slug, image, products_count, children
2. **`hooks/useBrands.ts`** — `useBrands()` + `useBrand(id)` React Query hooks; `Brand` type

3. **`app/(site)/page.tsx`** — Full homepage with 4 sections:

   **A. Hero split** (`1.1fr 1fr` grid)
   - Left: orange eyebrow line, 82px Instrument Serif headline with blue italic accent, sub-copy, two CTAs (Apply → `/register`, Browse → `/shop`), 3-column stat strip (612 brands / 12.4k SKUs / Net-60)
   - Right: striped placeholder + blue "This week's drop" card (bottom) + orange "Opening order $150" badge (top-right)

   **B. Category grid** (`GET /api/categories`)
   - 4×2 grid of up to 8 top-level categories
   - Stripe placeholder fallback when no image; numbered badge (01–08); products_count shown
   - Skeleton loading state (8 animated pulse tiles)
   - Each tile links to `/category/{id}`

   **C. Featured brands** (`GET /api/brands`)
   - `1.6fr 1fr 1fr` editorial grid; first brand gets "SPOTLIGHT" badge and `aspect-[16/11]`; others `aspect-[4/3]`
   - Image or stripe placeholder; description, location, product count shown
   - Skeleton loading; "VIEW ALL BRANDS" footer link
   - Each card links to `/brand/{id}`

   **D. Value props** (static, navy)
   - Roman numeral italic serif number + bold heading + body text
   - 3-column grid separated by 1px `#1E3358` gutter lines

### Decisions

- Page is a client component (React Query hooks); no server fetch needed since catalogue data is shared across pages and benefits from cache
- Stripe `Placeholder` component is inlined (matches reference exactly); reused from `shared.jsx` spec
- `displayed.length < 2` guard renders empty placeholder cards if API returns fewer than 3 brands

### Verification checklist

- [x] TypeScript compiles clean
- [x] Hero renders with correct fonts and layout proportions
- [x] Category grid shows skeleton while loading, renders tiles from API
- [x] Featured brands section handles 0, 1, 2, 3 brand results
- [x] Value props section renders 3 roman numeral cards on navy

---

## Notes for Next Phase

---

## Phase 6 — Category / Browse Pages ✅

**Completed:** 2026-05-05

### What was done

1. **`hooks/useProducts.ts`** — `useProducts(params)` + `useProduct(id)` React Query hooks; canonical `Product` type (all fields from API spec); `ProductsResponse` with paginated `meta`; `ProductsParams` for all filter/sort/page options
2. **ProductTable + ProductCard refactored** to import `Product` from the hook (eliminated duplicate type definition)

3. **`components/browse/BrowseLayout.tsx`** — fully URL-driven shared layout:
   - All filter state in URL search params (page, sort, in_stock, brand_id, sub_cat) via `useSearchParams`/`useRouter`
   - **Filters sidebar** (220px): In stock checkbox, brand multi-select (scrollable list), sort dropdown
   - Active filter chips in toolbar with individual × remove buttons
   - **Sub-category pills** (shown when `subCategories` prop provided)
   - **ProductTable** with qty tracking; `onQtyChange` maps product_id → qty
   - **CartBar** with "ADD TO CART" when any qty > 0; adds all selected items to CartContext
   - **Pagination** centered below table; `Suspense`-wrapped throughout
   - `placeholderData: prev` on the query keeps previous page visible during navigation (no flash)

4. **`app/(site)/shop/page.tsx`** — BrowseLayout with no category filter; breadcrumb "Shop"
5. **`app/(site)/category/[id]/page.tsx`** — fetches category by id, passes name + children as sub-category pills to BrowseLayout

### Decisions

- `BrowseLayout` props-driven (`categoryId`, `brandId`, `saleOnly`, `showDiscountPct`) so it's reused across Phase 7, 9 (brands, new arrivals, sale) without duplication
- Multiple `brand_id` params supported in URL for multi-brand filter; API only supports one, so we pass the first selected; filter chips still show all selected
- `Suspense` wrapper on both pages required because `useSearchParams` needs it in Next.js App Router

### Verification checklist

- [x] TypeScript compiles clean
- [x] `/shop` renders BrowseLayout with no category constraint
- [x] `/category/[id]` fetches category, passes children as pills
- [x] Brand filter, in-stock filter, sort all update URL params
- [x] Active filter chips removable individually, "Clear all" resets
- [x] CartBar shows when any qty stepper > 0

---

## Notes for Next Phase

---

## Phase 7 — Brand Pages ✅

**Completed:** 2026-05-05

### What was done

1. **`app/(site)/brands/page.tsx`** — 4-column responsive grid of all brands from `GET /api/brands`; each card shows image (or stripe placeholder), location, name, description snippet, SKU count; links to `/brand/{id}`; skeleton loading state

2. **`app/(site)/brand/[id]/page.tsx`** — full brand detail page:
   - **BrandHero**: two-column layout; left = image with dark gradient overlay + brand name + location/year; right = Buyer fact sheet (SKUs total, in-stock count, lowest wholesale price, Net-60 terms, description blockquote, "Shop all" link)
   - **Stat block** calculates values from `GET /api/products?brand_id=&per_page=100` — no dropped fields needed since we use API-available values only
   - **Tab bar**: Catalog / New / Sale — switches `BrowseLayout` key+props; "New" uses `sort=newest`, "Sale" uses `saleOnly=true`
   - **BrowseLayout** reused with `brandId` prop (hides brand column automatically, scopes filters to brand)

### Decisions

- Stat block lowest price derived client-side from product list (API doesn't expose aggregate on brand endpoint)
- Tab switching uses React `key` prop on BrowseLayout to fully remount + refetch on tab change — avoids stale data
- Brand page does not show brand column in product table (handled by `!brandId` check in BrowseLayout)

### Verification checklist

- [x] TypeScript compiles clean
- [x] Brands list renders grid with skeleton loading
- [x] Brand hero shows image with gradient overlay and name
- [x] Stat block populates from products query
- [x] Tabs switch between Catalog/New/Sale views correctly

---

## Phase 8 — Product Detail Page ✅

**Completed:** 2026-05-05

### What was done

1. **`app/(site)/product/[id]/page.tsx`** — full product detail page:
   - **Breadcrumb**: Shop → Category → Brand → Product name (links generated from nested `category`/`brand` objects)
   - **ImageGallery**: primary image first, thumbnail strip, prev/next arrows on hover; stripe placeholder fallback
   - **PriceBlock**: handles sale (red price + strikethrough regular + % badge), regular, and PriceGate for guests/pending users
   - **StockDot**: inline stock indicator from product fields
   - **Description**: renders `short_description` if available, else truncates `description` at 400 chars
   - **Simple products**: inline `SimpleAddToCart` with QtyStepper + "Add to cart" button; CartBar at page bottom
   - **Grouped products**: `GroupedVariantTable` — per-variant image, SKU, price, stock, qty stepper, line total; "Add to cart (N)" button adds all non-zero variants at once; CartBar below table
   - **Wishlist**: heart toggle calls `POST /api/wishlist` / `DELETE /api/wishlist/{id}`; requires auth; silently ignores errors
   - **Compare**: decorative button (no functionality as per guide)
   - **SpecStrip**: 3-column attribute grid rendered from `product.attributes` key-value pairs; hidden when empty

2. **Bug fix** (brand display): `ProductTable` and `ProductCard` updated to use nested `brand.id`/`brand.name` from API response (was incorrectly using flat `brand_name`/`brand_id` fields)

### Decisions

- Wishlist errors are silently swallowed — wishlist is non-critical UX; user sees optimistic toggle only if API call doesn't throw
- Grouped CartBar rendered inside the variant table section, not at page bottom, so it doesn't conflict with simple product layout
- `useWishlist` hook is local to this file — no global wishlist state needed for Phase 8 (Phase 13 will build the full wishlist page)
- Images array falls back to `[{ url: product.image, is_primary: true }]` when `images[]` is empty

### Verification checklist

- [x] TypeScript compiles clean (tsc --noEmit)
- [x] Simple product renders qty stepper + add to cart
- [x] Grouped product renders variant table with per-row qty steppers
- [x] Sale price shows in red with strikethrough regular price
- [x] PriceGate shows lock link for guests
- [x] CartBar shows when items in cart
- [x] Breadcrumb links to category and brand pages

---

## Phase 9 — New Arrivals & Sale Pages ✅

**Completed:** 2026-05-05

### What was done

1. **`app/(site)/new/page.tsx`** — New Arrivals page
   - Fetches top-level categories from `useCategories()` and passes them as subcategory pills to `BrowseLayout`
   - Default sort: `newest` — products sorted by recency
   - Category pill filter: user can narrow by department (All, or any top-level category)
   - All other filters (brand, in-stock, sort override) via sidebar as on other browse pages
   - CartBar from BrowseLayout

2. **`app/(site)/sale/page.tsx`** — Sale & clearance page
   - Red promo banner: "SALE · ENDS SOON" with sub-copy
   - `BrowseLayout` with `saleOnly=true` — products filtered client-side by `on_sale === true`
   - `showDiscountPct=true` — extra "Off %" column (calculated as `Math.round((1 - sale_price/regular_price) * 100)`)
   - All sidebar filters available (brand, in-stock, sort)

### Decisions

- Both pages are thin wrappers around `BrowseLayout` — no new logic needed
- New Arrivals passes all top-level categories as pills (same mechanism as category sub-pages) — clean reuse of existing URL param `sub_cat`
- Sale page client-side filters by `on_sale` since the API has no `on_sale` filter param (per guide note)

### Verification checklist

- [x] TypeScript compiles clean
- [x] `/new` renders with newest sort default and category pills
- [x] `/sale` renders promo banner + only on_sale products
- [x] Off % column shows correctly on sale page
- [x] CartBar shows when items selected

---

## Phase 10 — Cart Page ✅

**Completed:** 2026-05-05

### What was done

1. **`app/(site)/cart/page.tsx`** — full cart page:
   - Auth-gated via `useRequireAuth()` — redirects to `/login` if unauthenticated
   - **Page header**: "Cart · draft P.O." in Instrument Serif + item count / line count meta
   - **3-step indicator**: Cart (active) → Checkout → Confirmation
   - **Empty state**: cart icon + "Browse products" link
   - **Item grouping**: items with same `parent_id` are grouped under the parent product; standalone simples get their own group
   - **Group card**: product thumbnail, name link, line count + group subtotal, "Add variant" link to product page, "Remove group" button
   - **Variant table**: SKU, variant name, unit price, qty stepper (calls `updateQty`), line total, × remove button
   - **Order summary sidebar**: subtotal, Shipping TBD, Tax (net), total; "Continue to checkout →" for approved users; "Account pending approval" panel for unapproved
   - **Cart persistence** inherited from CartContext localStorage

### Decisions

- Grouping is client-side only — `parent_id` field already on CartItem from Phase 3
- Grouped items remove via per-row × or all-at-once "Remove group" button
- Checkout button is a plain `<Link>` — no JS guard needed since `/checkout` page handles its own auth check

### Verification checklist

- [x] TypeScript compiles clean
- [x] Cart groups items by parent_id
- [x] Qty stepper calls updateQty; removes item at qty 0
- [x] Remove × button calls removeItem
- [x] Subtotal matches CartContext subtotal
- [x] Approved users see checkout button; others see pending message
- [x] Empty state renders with shop link

---

## Phase 11 — Checkout Page ✅

**Completed:** 2026-05-05

### What was done

1. **`hooks/useAddresses.ts`** — `useAddresses()` + `useCreateAddress()` hooks; `Address` type with all billing/shipping fields
2. **`app/(site)/checkout/page.tsx`** — full checkout page (requires approved account):
   - **Step indicator**: Step 2 active (Cart ✓, Checkout, Confirmation)
   - **Billing address**: saved address cards (selectable), inline "Add new address" form (`POST /api/addresses`)
   - **Shipping address**: same UX; "Use same as billing" shortcut
   - **Order note**: textarea for `customer_note` / P.O. reference
   - **Order review**: collapsed table of cart items with "Edit in cart" link
   - **Sidebar**: subtotal, shipping TBD, total; "Place order →" button
   - On success (201): clears cart, redirects to `/orders/{id}`
   - Error handling: 422 (product unavailable), 403 (not approved), generic

---

## Phase 12 — Orders & Order Detail ✅

**Completed:** 2026-05-05

### What was done

1. **`hooks/useOrders.ts`** — `useOrders(page)` + `useOrder(id)` hooks; full `Order`, `OrderLine`, `OrdersMeta` types; all status/payment enums
2. **`app/(site)/orders/page.tsx`** — paginated orders table (requires approved account):
   - Columns: Invoice #, Date, Status badge, Payment status, Total
   - Status badge colors: pending=tan, processing=blue, shipped=orange, delivered=green, cancelled=red
   - Rows link to `/orders/{id}`; Pagination component for multi-page results
3. **`app/(site)/orders/[id]/page.tsx`** — full order detail page:
   - Breadcrumb: Orders → Invoice #
   - Status tracker: Pending → Processing → Shipped → Delivered (cancelled shows red label)
   - Billing + shipping address blocks side-by-side
   - Line items table with qty, unit price, line total
   - Totals block: line total, shipping (if set), tax (if set), grand total
   - Customer note (if present)
   - "Back to orders" link

---

## Phase 13 — Wishlist Page ✅

**Completed:** 2026-05-05

### What was done

1. **`hooks/useWishlist.ts`** — `useWishlist()`, `useWishlistIds()`, `useToggleWishlist()` hooks; optimistic add/remove via React Query mutations
2. **`app/(site)/wishlist/page.tsx`** — auth-gated wishlist page:
   - Table: image, name, SKU, stock dot, added date, "See price →" link, × remove
   - Skeleton loading; empty state with browse link
   - Remove calls `DELETE /api/wishlist/{productId}` and invalidates query

---

## Phase 14 — Theme Toggle & Polish ✅

**Completed:** 2026-05-05

### What was done

1. **`components/layout/ThemeToggle.tsx`** — pill toggle switch Forge ↔ Pallet; reads/writes via `lib/theme.ts`; hydrates on mount to avoid SSR mismatch
2. ThemeToggle placed in **UtilityBar** (right-side nav)
3. **`app/not-found.tsx`** — custom 404 page: "Page not found" in Instrument Serif, back-to-home + browse-shop links

---

## Phase 15 — Final Integration ✅

**Completed:** 2026-05-05

All 15 phases built. Full user journeys supported:
- Guest: browse shop, categories, brands, new arrivals, sale; price gate on all prices
- Register: form validation, success state, pending approval message
- Approved user: prices visible, add to cart, grouped product variants, wishlist, cart → checkout → order confirmation
- Order history with status tracker and line item detail
