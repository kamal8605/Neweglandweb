# Fastweb — B2B Ecommerce Development Guide

> **Instructions for AI agents**: Work through this guide **one phase at a time**. Complete all tasks in a phase, then stop and wait for the user to verify before proceeding to the next phase. Do not skip phases or implement ahead.

---

## Project Overview

A B2B wholesale ecommerce site built in **Next.js 15** (App Router) with **Tailwind CSS** and **shadcn/ui** components. The design is based on the Forge & Co. handoff exported from Claude Design. The site connects to a Gateway REST API documented in `ref/client-api.md`.

### Reference files (read before coding)
- `ref/handoff-content/ec2/project/screens/shared.jsx` — design tokens, shared components
- `ref/handoff-content/ec2/project/screens/Homepage.jsx` — homepage design
- `ref/handoff-content/ec2/project/screens/CategoryPage.jsx` — category/product listing
- `ref/handoff-content/ec2/project/screens/BrandPage.jsx` — brand page
- `ref/handoff-content/ec2/project/screens/ProductDetails.jsx` — product detail
- `ref/handoff-content/ec2/project/screens/CartPage.jsx` — cart
- `ref/handoff-content/ec2/project/screens/CheckoutPage.jsx` — checkout
- `ref/handoff-content/ec2/project/screens/NewArrivals.jsx` — new arrivals
- `ref/handoff-content/ec2/project/screens/SalePage.jsx` — sale page
- `ref/client-api.md` — complete API documentation

---

## Design System

### Primary Theme: Forge & Co.
```
Colors:
  bg:          #F7F4EE   (warm cream background)
  bgAlt:       #EFEAE0   (slightly darker cream)
  ink:         #0A0A0A   (near-black text)
  navy:        #0B1F3A   (dark blue — utility bar, footer, cart bar)
  muted:       #5A5751   (muted text, labels)
  line:        #D9D3C5   (borders, dividers)
  blue:        #1E5BFF   (accent links, active states)
  blueDeep:    #0E3FCC   (hover on blue)
  orange:      #FF6B1A   (primary CTA, highlights)
  orangeSoft:  #FFE8D6   (orange tint backgrounds)
  white:       #FFFFFF

Typography:
  Sans:        Geist (weights 300–700)
  Mono:        Geist Mono (weights 400, 500)
  Serif:       Instrument Serif (weights regular + italic)
```

### Alternate Theme: Pallet
```
Colors:
  bg:          #F7F8FB
  blue:        #1B3A8A
  blueDeep:    #0E2466
  blueSoft:    #EEF2FB
  blueLine:    #DBE2F2
  orange:      #F26B1F
  orangeSoft:  #FFF1E6
  ink:         #0F172A
  ink2:        #475569
  ink3:        #94A3B8
  line:        #E5E9F0
  ok:          #0E9F6E

Typography: Inter (system sans)
Style: Rounded cards (border-radius: 8–12px) vs Forge's sharp edges (radius: 2px)
```

Implement as two Tailwind themes switchable via a `data-theme` attribute on `<html>`. Default = `forge`.

---

## API Reference Summary

**Base URL**: `{GATEWAY_URL}/api` — stored in `NEXT_PUBLIC_API_URL` env var

### Auth
- `POST /api/auth/register` → `{ message }` (201)
- `POST /api/auth/login` → `{ access_token, token_type, expires_in, user }` (200)
- `POST /api/auth/refresh` → same shape as login (200)
- `POST /api/auth/logout` → `{ message }` (200)
- `GET /api/users/me` → user object with `orders_count`
- `PATCH /api/users/{id}` → update profile

### Catalogue (public — no auth needed)
- `GET /api/products` — query params: `category_id`, `brand_id`, `in_stock`, `search`, `sort` (name_asc|price_asc|price_desc|newest), `per_page`, `page`
- `GET /api/products/{id}` — includes `description`, `attributes`, `images[]`, `children[]` for grouped products
- `GET /api/categories` — returns all categories with `children[]`
- `GET /api/categories/{id}`
- `GET /api/brands`
- `GET /api/brands/{id}`

### Auth-required
- `GET/POST /api/wishlist` — wishlist CRUD
- `DELETE /api/wishlist/product/{productId}` — remove by product ID
- `GET /api/orders` — paginated order list
- `POST /api/orders` — place order (requires approved account)
- `GET /api/orders/{id}` — order detail
- `GET/POST /api/addresses` — address book
- `GET/PATCH/DELETE /api/addresses/{id}`

### Key behaviours
- `prices_visible: false` → price fields are `null` for guests and pending-approval users → show "Sign in to see prices" lock prompt
- Account states: guest (no prices, no orders) | pending (no prices, no orders) | approved (full access)
- Grouped products: `type = "grouped"` has `children[]`; child products have `parent_id`

---

## Decisions Made (Design vs API Gaps)

| Design element | Decision |
|---|---|
| Case size (×24) | Treat as ×1 — quantity = units |
| MOQ | Drop |
| Lead time | Drop |
| MSRP | Drop |
| Margin % | Drop |
| Product size field | Drop |
| Brand tags/values | Drop |
| Brand origin/location | Drop |
| Reviews/ratings | Drop |
| Wholesale price label | Rename to "Price" |
| Volume discount | Drop |
| Freight bar | Show "Shipping: TBD" |
| Payment terms selection | Drop |
| Multiple ship-to locations | Allow separate billing + shipping address |
| Per-brand shipments | Drop |
| P.O. reference | Store in `customer_note` |
| Resale tax ID | Drop |
| Promo codes | Drop |
| "Curated" nav item | Wire to New Arrivals |
| Export CSV | Drop |
| Upload order list | Drop |
| Save brand/save list | Drop |
| Sale filter by reason | Drop |
| New Arrivals date window filter | Drop (use sort=newest) |
| Subscription/recurring orders | Drop |

### Product table columns (API-aligned)
Checkbox · Image · SKU · Product name (+ SALE badge) · Brand · Price (strikethrough if on_sale) · Stock dot + quantity · Qty stepper

### Stock dot color rules (from `stock_quantity`)
- `stock_quantity < 100` → orange dot
- `stock_quantity < 400` → amber dot
- `stock_quantity >= 400` → green dot
- `in_stock = false` → grey dot / "Out of stock"
- `stock_quantity = null` (unmanaged) → show "In stock" text without dot

---

## Phase 1 — Project Setup

### Tasks
1. Initialize Next.js 15 project with App Router in the current directory (`fastweb/`)
   ```bash
   npx create-next-app@latest . --typescript=false --eslint=false --tailwind=true --app=true --src-dir=true --import-alias="@/*"
   ```
2. Install dependencies:
   ```bash
   npm install axios @tanstack/react-query @tanstack/react-query-devtools
   npx shadcn@latest init
   ```
3. Install shadcn components needed:
   ```bash
   npx shadcn@latest add button input select badge dialog sheet table skeleton toast
   ```
4. Configure Google Fonts in `src/app/layout.jsx`:
   - Load Geist (sans-serif), Geist Mono, Instrument Serif via `next/font/google`
   - Apply CSS variables: `--font-sans`, `--font-mono`, `--font-serif`

5. Configure Tailwind with design tokens in `tailwind.config.js`:
   ```js
   // Both themes defined as CSS variables toggled by data-theme attribute
   // Theme: forge (default), pallet (alternate)
   // Map all COLORS values as Tailwind color aliases
   ```
   Define custom colors:
   - `brand-bg`, `brand-bg-alt`, `brand-ink`, `brand-navy`, `brand-muted`, `brand-line`
   - `brand-blue`, `brand-blue-deep`, `brand-orange`, `brand-orange-soft`
   - Apply via CSS variables on `html[data-theme="forge"]` and `html[data-theme="pallet"]`

6. Create env file:
   ```
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

7. Create `src/lib/axios.js`:
   - Axios instance with `baseURL = process.env.NEXT_PUBLIC_API_URL + '/api'`
   - Request interceptor: attach `Authorization: Bearer {token}` from localStorage
   - Response interceptor: on 401, call `/auth/refresh`, update token, retry once. On retry failure, clear token + redirect to `/login`

8. Create `src/lib/queryClient.js`:
   - Export a shared `QueryClient` with sensible defaults (staleTime: 5 min for catalogue)

9. Create theme toggle utility:
   - `src/lib/theme.js` — `getTheme()`, `setTheme(name)` (reads/writes `data-theme` on `<html>` + persists to localStorage)

### Verification checklist
- [ ] `npm run dev` starts without errors
- [ ] Tailwind classes work (create a test element with `bg-brand-bg text-brand-ink`)
- [ ] Google Fonts loaded (Geist visible in browser)
- [ ] Both themes switch when `data-theme` is changed on `<html>`
- [ ] Axios instance exported correctly

---

## Phase 2 — Context, Providers, Layout Shell

### Tasks

1. Create `src/context/AuthContext.jsx`:
   - State: `user`, `token`, `isLoading` (initial validate call)
   - Derive: `isAuthenticated = !!user`, `isApproved = user?.approval_status === 'approved'` (or check via `prices_visible` from API)
   - On mount: if token in localStorage, call `GET /api/auth/validate` → populate user; on error, clear token
   - Methods: `login(email, password)`, `logout()`, `updateUser(patch)`

2. Create `src/context/CartContext.jsx`:
   - State: `items = []` — persisted to localStorage
   - Item shape: `{ product_id, name, sku, image, price, quantity }`
   - Methods: `addItem(product, qty)`, `updateQty(product_id, qty)`, `removeItem(product_id)`, `clearCart()`
   - Derived: `itemCount`, `subtotal`

3. Create `src/app/providers.jsx` (client component):
   - Wrap children with `QueryClientProvider`, `AuthProvider`, `CartProvider`

4. Create `src/app/layout.jsx`:
   - Load fonts via `next/font/google`
   - Import and use `Providers`
   - Set `<html data-theme="forge">` (default theme)
   - Apply base body styles via Tailwind

5. Create layout components:
   - `src/components/layout/UtilityBar.jsx` — navy top bar: "FREE FREIGHT ON ORDERS OVER $500 · NET-60 TERMS AVAILABLE" on left, auth links on right (Sign In / user name + logout)
   - `src/components/layout/NavBar.jsx` — logo, nav links (Shop → `/shop`, Brands → `/brands`, New Arrivals → `/new`, Sale → `/sale`, Curated → `/new`), search bar (routes to `/shop?search=...`), cart icon with item count
   - `src/components/layout/Footer.jsx` — navy footer with logo, description, link columns, copyright
   - `src/components/layout/Logo.jsx` — SVG mark + "Forge&Co." text
   - `src/components/layout/SiteLayout.jsx` — wraps pages: `<UtilityBar/><NavBar/><main>{children}</main><Footer/>`

6. Wrap all page layouts with `SiteLayout` (or use route groups)

### Verification checklist
- [ ] NavBar renders with correct links
- [ ] UtilityBar shows auth state: guest sees "SIGN IN", logged-in shows user name
- [ ] Cart icon in NavBar shows item count badge
- [ ] Footer renders with all columns
- [ ] Auth context: token survives page refresh
- [ ] Cart context: items survive page refresh

---

## Phase 3 — Shared Components

### Tasks

Build reusable components used across multiple pages. Match the Forge & Co. visual style from `shared.jsx`.

1. `src/components/shared/StockDot.jsx`
   - Props: `inStock: boolean`, `stockQuantity: number | null`
   - Renders colored dot + quantity number
   - Colors: orange (<100), amber (<400), green (≥400), grey (out of stock)
   - If `stockQuantity` is null and `inStock` is true: show "In stock" with green dot

2. `src/components/shared/QtyStepper.jsx`
   - Props: `value: number`, `onChange: (n) => void`, `min?: number`
   - Inline − value + buttons (styled as per design: sharp borders, monospace font)

3. `src/components/shared/ProductTable.jsx`
   - Props: `products[]`, `showBrand?: boolean`, `loading?: boolean`
   - Columns: checkbox, thumbnail, SKU (mono), Product name + SALE badge, Brand (if showBrand), Price (sale price + strikethrough regular if on_sale), Stock dot, Qty stepper
   - Loading state: skeleton rows using shadcn Skeleton
   - Empty state: "No products found"
   - PriceGate: if `prices_visible === false`, show lock icon + "Sign in to see prices" in price cell

4. `src/components/shared/CartBar.jsx`
   - Navy bottom bar: left side shows item count/subtotal, right side has CTA buttons
   - Shows only when cart has items
   - Props: `itemCount`, `subtotal`, `onAddToCart`, `cta?: string`

5. `src/components/shared/PageHeader.jsx`
   - Props: `crumb`, `title`, `accent`, `meta`, `actions`
   - White background bar with breadcrumb, serif title, monospace meta text, right-side action buttons

6. `src/components/shared/PriceGate.jsx`
   - If `prices_visible === false`:
     - Show lock icon + "Sign in to see prices" as a subtle prompt
     - Link to `/login`
   - If `isAuthenticated && !isApproved`:
     - Show "Account pending approval. Prices visible once approved."
   - Otherwise: render children

7. `src/components/shared/ProductCard.jsx` (for homepage/brand cards, not table rows)
   - Image, name, brand, price (or price gate), stock badge, wishlist heart icon
   - Used in homepage brand sections

8. `src/components/shared/Breadcrumb.jsx`
   - Monospace uppercase breadcrumb trail (e.g., SHOP / APOTHECARY / PRODUCT NAME)

9. `src/components/shared/Pagination.jsx`
   - Props: `currentPage`, `lastPage`, `onPageChange`
   - Number buttons, prev/next arrows — styled as per CategoryPage design

### Verification checklist
- [ ] ProductTable renders with mock data
- [ ] Price shows "Sign in to see prices" when `prices_visible = false`
- [ ] Stock dot shows correct color for different quantities
- [ ] QtyStepper increments/decrements correctly
- [ ] CartBar appears and shows correct totals
- [ ] Pagination renders and calls `onPageChange`

---

## Phase 4 — Auth Pages

### Tasks

Design reference: `ref/handoff-content/ec2/project/B2B Signup Flow.html`

1. `src/app/login/page.jsx`
   - Form: email, password
   - On submit: call `POST /api/auth/login` → store token + user in AuthContext → redirect to `/`
   - Error handling: show "Invalid credentials" message
   - Pending approval: show "Your account is pending approval" message
   - Link to `/register`
   - Visual style: centered card with Forge & Co. tokens (navy header, cream body)

2. `src/app/register/page.jsx`
   - Form: name, email, password, password_confirmation
   - On submit: call `POST /api/auth/register` → show success message: "Registration successful. Your account is pending approval before you can log in."
   - Validation: client-side password match check before submitting
   - Link back to `/login`

3. Protected route utility: `src/components/auth/withAuth.jsx` (HOC or middleware)
   - Redirect unauthenticated users to `/login` for auth-required pages (cart, checkout, orders, wishlist)

### Verification checklist
- [ ] Login with valid credentials sets user in context and redirects to homepage
- [ ] Login with invalid credentials shows error
- [ ] Login with pending account shows pending message
- [ ] Register creates account and shows success message
- [ ] Registered user can then log in
- [ ] Logout clears token and user from context

---

## Phase 5 — Homepage

### Tasks

Design reference: `ref/handoff-content/ec2/project/screens/Homepage.jsx`

1. `src/app/page.jsx` — Homepage

Sections to build (top to bottom):

**A. Hero Split** (`gridTemplateColumns: "1.1fr 1fr"`)
   - Left: eyebrow text, large serif headline ("The wholesale back-of-house for indie retail."), body copy, two CTA buttons ("Apply for a buyer account" → `/register`, "Browse the catalog" → `/shop`), stat strip (data driven from site copy — these are marketing stats, not from API)
   - Right: large image placeholder (or real hero image if provided), "This week's drop" blue card overlay, "Opening order $150" orange box

**B. Category Grid** — 4×2 grid
   - Fetch `GET /api/categories`
   - Display up to 8 top-level categories with image, name, and SKU count (from API)
   - Each links to `/category/{id}`
   - If fewer than 8 categories: show only what API returns

**C. Featured Brands** — 3-column editorial
   - Fetch `GET /api/brands` — show first 3 brands (or `featured` brands if API ever adds that)
   - Large card for first brand (spotlight), two smaller cards for brands 2 & 3
   - Each links to `/brand/{id}`

**D. Value Props** — navy section, 3 rules
   - Static content (no API): "Net-60 terms", "Free returns on openers", "No exclusivity"

### Verification checklist
- [ ] Homepage loads without errors
- [ ] Categories from API display in grid with correct names
- [ ] Brands from API display in editorial section
- [ ] Category tiles link to `/category/{id}`
- [ ] Brand tiles link to `/brand/{id}`
- [ ] CTA buttons navigate correctly
- [ ] Stat strip is visible

---

## Phase 6 — Category / Browse Pages

### Tasks

Design reference: `ref/handoff-content/ec2/project/screens/CategoryPage.jsx`

1. `src/app/shop/page.jsx` — Browse all products (no category filter)

2. `src/app/category/[id]/page.jsx` — Category-filtered products

Both pages share the same layout:

**A. Page header** (`PageHeader` component)
   - Breadcrumb: SHOP / {category name} (or just SHOP for /shop)
   - Serif title: category name
   - Meta: "{total} SKUs · {brand count} brands"
   - Actions: none (Export CSV dropped)

**B. Sub-category pills** (on category page only)
   - Fetch `GET /api/categories/{id}` → show `children[]` as filter pills
   - Active pill filters by `sub_category_id` query param

**C. Filters sidebar** (220px fixed)
   - **In stock**: checkbox → adds `in_stock=true` param
   - **Brand**: list of brands with checkbox — fetch `GET /api/brands` for brand list
   - **Price range**: `sort` selector (name_asc, price_asc, price_desc, newest)
   - Dropped filters: Price tier, Origin, Values — no API support
   - "Clear all" clears all active filters

**D. Table toolbar**
   - Shows "{total} SKUs · page X–Y"
   - Active filter chips (each removable)
   - Sort dropdown: Bestselling (name_asc) | Price ↑ (price_asc) | Price ↓ (price_desc) | Newest (newest)
   - View toggle: Table / Grid (optional — table is primary)

**E. ProductTable** (from Phase 3)
   - Fetch `GET /api/products?category_id={id}&...`
   - Grouped products: show parent row; if clicked, expand to show children inline OR link to product detail page

**F. CartBar** (sticky bottom)
   - Shows when any items are selected
   - "ADD TO CART" button → adds all selected items to CartContext

**G. Pagination**
   - Uses meta from API response

### Data flow
```
URL params: category_id, brand_id, in_stock, sort, page
→ useProducts(params) hook → GET /api/products
→ ProductTable renders rows
→ User changes filter → update URL params (useRouter/useSearchParams)
```

### Verification checklist
- [ ] /shop loads all products from API with pagination
- [ ] /category/{id} filters products by category
- [ ] Sub-category pills appear and filter by sub_category_id
- [ ] In-stock checkbox filters correctly
- [ ] Brand filter list works
- [ ] Sort dropdown changes order
- [ ] Pagination navigates between pages
- [ ] CartBar appears when qty stepper > 0; adds to cart correctly
- [ ] Price locked for guest users

---

## Phase 7 — Brand Page

### Tasks

Design reference: `ref/handoff-content/ec2/project/screens/BrandPage.jsx`

1. `src/app/brands/page.jsx` — All brands listing
   - Fetch `GET /api/brands`
   - Grid of brand cards (image, name, description)
   - Each links to `/brand/{id}`

2. `src/app/brand/[id]/page.jsx` — Single brand

**A. Breadcrumb**: BRANDS / {brand name}

**B. Hero** (two-column)
   - Left: brand image (large, with gradient overlay) + brand name + description overlay
   - Right: "Buyer fact sheet" stat block — show:
     - SKUs: `total` from products query
     - In stock: count from products where `in_stock = true`
     - Wholesale from: lowest `current_price` in results
     - Brand description as italic quote block

   - Dropped from fact sheet (no API data): Lead time, Avg margin, Open MOQ, Reorder MOQ, Terms, Origin, Ships from

**C. Action band** (navy bar)
   - Left: stock summary text
   - Dropped: "SAVE BRAND", "LINESHEET PDF" buttons (no API support)
   - Keep: "Shop all products" link

**D. Sub-section tabs** (Catalog / New / Sale)
   - "Catalog" → all products for brand
   - "New" → sort=newest for brand
   - "Sale" → on_sale products for brand

**E. ProductTable** with brand_id filter

**F. Brand story section**
   - If brand has a `description`: show it in editorial layout (image placeholder + formatted text)

### Verification checklist
- [ ] Brand list page shows all brands
- [ ] Brand page hero shows brand name and description
- [ ] Stat block shows correct SKU count and price range
- [ ] Product table filtered to this brand
- [ ] Sub-section tabs filter correctly (new, sale)
- [ ] CartBar and qty steppers work

---

## Phase 8 — Product Detail Page

### Tasks

Design reference: `ref/handoff-content/ec2/project/screens/ProductDetails.jsx`

1. `src/app/product/[id]/page.jsx`

**A. Breadcrumb**: SHOP / {category} / {brand} / {product name}

**B. Hero** (two-column)
   - Left: image gallery
     - Main image from `images[]` (primary first)
     - Thumbnails below (if multiple images)
     - If no images: striped placeholder
   - Right: product summary panel
     - Brand name (link to brand page)
     - Product name (serif, large)
     - SKU (monospace)
     - Price block:
       - If `prices_visible = false`: PriceGate prompt
       - If `on_sale`: show `sale_price` in red + `regular_price` struck through
       - Otherwise: show `current_price`
     - Description (`short_description` if available, else `description` truncated)
     - Wishlist / Compare actions (wishlist calls API; Compare is decorative)
     - Dropped: Lead time, Min cases, MSRP, Margin, Case price, Variants count stat grid

**C. For grouped products** (`type = "grouped"`)
   - Product has `children[]` array
   - Show variant selection table (replaces the flavor table in design):
     - Columns: Image, SKU, Variant name (from `name` or `attributes`), Price, Stock, Qty stepper, Line total
     - "ADD TO CART" button adds all variants with qty > 0 to cart

**D. For simple products** (`type = "simple"`)
   - Show single "Add to cart" qty stepper + button
   - If product is a child (`parent_id != null`): also show sibling products (fetch with `?with_siblings=1`)

**E. CartBar** — shows when qty > 0

**F. Spec strip** (3-column)
   - From `attributes` (key-value pairs)
   - From `description` if it contains structured info
   - Dropped: Specifications/Ingredients/Logistics panels (no API data for those fields)

### Verification checklist
- [ ] Product page loads for simple product
- [ ] Product page loads for grouped product and shows variant table
- [ ] Images display (or placeholder if none)
- [ ] Sale price shows correctly with strikethrough
- [ ] Price gate shows for guests
- [ ] Add to cart works (single and grouped)
- [ ] CartBar shows subtotal
- [ ] Wishlist heart toggles correctly (auth required)

---

## Phase 9 — New Arrivals & Sale Pages

### Tasks

Design references: `NewArrivals.jsx`, `SalePage.jsx`

1. `src/app/new/page.jsx`
   - Fetch `GET /api/products?sort=newest`
   - PageHeader: "New arrivals · this month", meta: "{total} SKUs"
   - Dropped: Date window filter pills (no API date filter)
   - Category dept filter: fetch categories, filter by selected category_id
   - ProductTable with `sort=newest`
   - CartBar

2. `src/app/sale/page.jsx`
   - Fetch `GET /api/products?sort=newest` — filter client-side by `on_sale = true` (or send no filter since API has no explicit `on_sale` filter param — check: API doesn't have an `on_sale` filter param, but products have `on_sale` field, so fetch all and filter, OR use `sort=price_asc` — NOTE: there is no on_sale filter in the API, so fetch all and show only those with `on_sale = true`, paginating client-side)
   - Promo banner (red): static text "SALE · ENDS SOON"
   - PageHeader: "Sale & clearance"
   - Dropped: Discount tier pills (no API discount %), Sale reason filter
   - ProductTable — show `sale_price` (red) + `regular_price` (struck through) for `on_sale` items
   - Extra column: "Off %" — calculated as `Math.round((1 - sale_price/regular_price) * 100)` (only if prices_visible)

> **Note for sale page**: Since the API has no `on_sale` filter param, fetch `per_page=100` pages and filter. If total product count is large, consider fetching all pages. Alternatively — check if `sort` returns sale items first; if not, load progressively.

### Verification checklist
- [ ] New Arrivals shows products sorted by newest
- [ ] Category filter works on New Arrivals
- [ ] Sale page shows only `on_sale = true` products
- [ ] Sale page shows struck-through regular price
- [ ] Off % column calculates correctly

---

## Phase 10 — Cart Page

### Tasks

Design reference: `ref/handoff-content/ec2/project/screens/CartPage.jsx`

1. `src/app/cart/page.jsx`
   - **Auth required**: redirect to `/login` if not authenticated

**A. Header**
   - "Cart · draft P.O." in serif
   - Item count, total products, total variants

**B. Cart step indicator** (3 steps: Cart → Checkout → Confirmation)
   - Step 1 active

**C. Main body** (two-column: cart items + sidebar)

**Left — Cart groups**
   - Group items by parent product (if a grouped product's children are in cart, group them)
   - Group header: product image, name, brand, meta
   - Variant rows: SKU, name, price, stock dot, qty stepper, line total, remove (×) button
   - "ADD ANOTHER VARIANT" link → goes to product page
   - "REMOVE GROUP" removes all lines for this product from cart

**Right — Order summary sidebar**
   - Subtotal (sum of all lines)
   - Shipping: "TBD"
   - Tax: "Net of tax" / "TBD"
   - **Total: subtotal** (no discounts/freight calculation)
   - "Continue to checkout →" button (links to `/checkout`, requires approved account)
   - If not approved: show "Account pending approval" message in place of checkout button
   - Dropped: Volume discount, Freight progress bar, Promo code input

**D. Dropped elements**: Export P.O. PDF, Share with team, Save as list, Paste SKU list / CSV upload

### Verification checklist
- [ ] Cart shows items from CartContext
- [ ] Items grouped by product
- [ ] Qty stepper updates cart
- [ ] Remove button removes item
- [ ] Subtotal calculates correctly
- [ ] "Continue to checkout" is disabled/hidden for non-approved users
- [ ] Cart persists on page refresh

---

## Phase 11 — Checkout Page

### Tasks

Design reference: `ref/handoff-content/ec2/project/screens/CheckoutPage.jsx`

1. `src/app/checkout/page.jsx`
   - **Auth required + approved account**: redirect if not approved

**A. Step indicator** — Step 2 active (Cart done ✓, Shipping active, Review pending)

**B. Billing address section**
   - Fetch `GET /api/addresses` → show saved addresses as selectable cards
   - "Add new address" → inline form for new address (`POST /api/addresses`)
   - Selected billing address fields map to `billing_*` in order payload

**C. Shipping address section**
   - Separate from billing — can select same or different address
   - Same UX as billing: saved address cards + add new
   - Selected shipping address fields map to `shipping_*` in order payload

**D. Order notes section**
   - Text input: "Customer note / P.O. reference (optional)"
   - Maps to `customer_note` in order payload

**E. Order review** — collapsed table of cart items
   - Product, qty, unit price, line total
   - "Edit in cart ←" link

**F. Sidebar summary**
   - Subtotal, Shipping: TBD, Total: subtotal
   - "Place Order →" button
     - On click: `POST /api/orders` with all cart items + addresses + note
     - On success (201): clear cart, redirect to `/orders/{id}`
     - On error 422 (product unavailable): show error message
     - On error 403 (not approved): show approval message

**Dropped sections**: Payment terms selection, Per-brand shipments, Resale tax ID, Volume discount line

### Verification checklist
- [ ] Saved addresses load and display
- [ ] Can select different billing vs shipping
- [ ] "Add new address" form works
- [ ] Order note field visible
- [ ] Place order button calls API with correct payload
- [ ] Success redirects to order detail page
- [ ] Cart cleared after successful order
- [ ] Error messages display for failures

---

## Phase 12 — Orders & Order Detail Pages

### Tasks

1. `src/app/orders/page.jsx`
   - **Auth required + approved**
   - Fetch `GET /api/orders` (paginated, 15 per page)
   - Table columns: Invoice #, Date, Status badge, Payment status, Total
   - Status badge colors: pending=grey, processing=blue, shipped=orange, delivered=green, cancelled=red
   - Rows link to `/orders/{id}`
   - Pagination

2. `src/app/orders/[id]/page.jsx`
   - Fetch `GET /api/orders/{id}`
   - Order confirmation / detail layout:
     - Order header: invoice_no, status badge, placed date
     - Step tracker: Pending → Processing → Shipped → Delivered (based on `status`)
     - Billing address, Shipping address
     - Line items table: name, SKU, qty, unit_price, total
     - Totals: line_total, shipping_total (if set), tax, total
     - Customer note (if present)
   - "Back to orders" link

### Verification checklist
- [ ] Orders list loads for approved user
- [ ] Order statuses show correct badges
- [ ] Order detail shows all line items
- [ ] Billing and shipping addresses render
- [ ] Status tracker highlights correct step
- [ ] Back navigation works

---

## Phase 13 — Wishlist Page

### Tasks

1. `src/app/wishlist/page.jsx`
   - **Auth required**
   - Fetch `GET /api/wishlist`
   - Display as table: image, name, SKU, stock status, added date
   - Each row: link to product page, remove from wishlist button (`DELETE /api/wishlist/product/{productId}`)
   - Empty state: "Your wishlist is empty. Browse products to save items."
   - Note: prices not included in wishlist response — show "See price" link to product page

2. Wishlist heart icon (used across all product tables/cards):
   - `src/components/shared/WishlistButton.jsx`
   - Props: `productId`
   - State: checks if product is in wishlist (from local wishlist state or query)
   - On click: toggle add/remove (requires auth — prompt login if not authenticated)

### Verification checklist
- [ ] Wishlist page loads saved products
- [ ] Remove button removes from wishlist
- [ ] Empty state shows correctly
- [ ] Wishlist heart on product rows toggles correctly
- [ ] Heart appears filled for wishlisted products

---

## Phase 14 — Theme Toggle & Polish

### Tasks

1. Theme toggle component: `src/components/layout/ThemeToggle.jsx`
   - Simple toggle switch: "Forge" ↔ "Pallet"
   - Calls `setTheme('forge')` or `setTheme('pallet')`
   - Place in NavBar or UtilityBar

2. Tailwind theme switching:
   - `html[data-theme="forge"]` → Forge & Co. CSS variables (warm cream, sharp edges, serif typography)
   - `html[data-theme="pallet"]` → Pallet CSS variables (clean blue/white, rounded corners, Inter font)
   - shadcn components pick up colors via CSS variables automatically

3. Polish pass across all pages:
   - Loading skeletons on all data-fetching pages
   - Error states (API down, not found)
   - 404 page: `src/app/not-found.jsx`
   - Empty states (no products found, no orders yet)
   - Responsive layout (min-width: 1280px — this is a desktop B2B tool; mobile is out of scope unless specified)
   - Toast notifications for cart add, wishlist toggle, order placed (use shadcn Toast)

### Verification checklist
- [ ] Theme toggle switches from Forge to Pallet and back
- [ ] All colors change correctly in both themes
- [ ] Loading skeletons appear before data loads
- [ ] 404 page renders for unknown routes
- [ ] Toasts show for cart/wishlist actions
- [ ] No console errors in final state

---

## Phase 15 — Final Integration & End-to-End Test

### Full user journey tests

**Guest user**
- [ ] Homepage loads with categories and brands
- [ ] Can browse /shop with pagination
- [ ] Price cells show lock prompt everywhere
- [ ] Can search products via NavBar search
- [ ] Can browse /new and /sale

**Registration → pending**
- [ ] Register at /register → success message
- [ ] Login → pending approval message (if account is truly pending)

**Approved user**
- [ ] Login with approved account → prices visible throughout
- [ ] Add products to cart from category page
- [ ] Add variant of grouped product to cart from product page
- [ ] Cart shows items, correct subtotal
- [ ] Checkout: select saved address
- [ ] Place order → redirect to order detail
- [ ] Order appears in /orders list
- [ ] Can add to wishlist; wishlist page shows saved items

**Error scenarios**
- [ ] Out-of-stock product cannot be added to cart (validate `in_stock` before adding)
- [ ] Unapproved user cannot reach /checkout
- [ ] Expired token → auto-refresh → continues seamlessly
- [ ] API timeout → error message (not crash)

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://your-api-server.com
```

---

## Key Implementation Notes

1. **Do not calculate prices client-side for orders.** The API calculates all totals server-side from `current_price`. Send only `product_id` and `quantity` in order items.

2. **Grouped products in cart**: When a user adds a child product from a grouped parent, store it as the child's `product_id` (not the parent's). The API accepts child product IDs in order items.

3. **Token refresh**: Implement as an Axios response interceptor — queue concurrent requests during refresh rather than sending multiple refresh calls simultaneously.

4. **`prices_visible` is per-product in list responses.** Check it on each product object, not just once globally. (An approved user always gets `prices_visible: true`; use `isApproved` from AuthContext for UI decisions.)

5. **Sale page**: API has no `on_sale` query filter. Fetch pages of products and filter by `on_sale === true`. Consider fetching `per_page=100` to minimize requests. If the catalogue is very large, add a note that sale items may not be exhaustive.

6. **Order address payload**: The API expects flat fields (`billing_first_name`, `billing_last_name`, etc.). When submitting an order, split the selected `Address` object into these flat fields.

7. **Image fallback**: When `product.image` is null or fails to load, show the striped placeholder div (matching the design's Placeholder component — CSS repeating-linear-gradient pattern).

8. **Company Information**: Add company branding customization to enviroment variables so that we can change company related information like name, logo, etc from .env file.

9. **Desing**: This will be a desktop first app but also check for responsiveness to allow users to easily navigate from mobile or tablet devices. No need to go deep in responsive execution but keep a simple level of accessibility for mobile devices.