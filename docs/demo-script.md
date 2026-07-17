# Demo Recording Script — FreshMart Pro

> **Target duration:** 60–90 seconds  
> **Format:** GIF or MP4 (compressed)  
> **Resolution:** 1280×800 recommended  
> **Tool:** [LICEcap](https://www.cockos.com/licecap/), [ScreenToGif](https://www.screentogif.com/), or [OBS Studio](https://obsproject.com/)

---

## Pre-Recording Checklist

Before you hit record:

- [ ] Run `npm run dev` and confirm the app is running at `http://localhost:3000`
- [ ] Seed the database: `npx tsx prisma/seed.ts`
- [ ] Log out of all accounts (fresh session)
- [ ] Open browser in a clean profile (no extensions visible)
- [ ] Set browser zoom to **100%**
- [ ] Clear the cart and wishlist
- [ ] Have a test coupon code ready (e.g., `SAVE10`)
- [ ] Browser window: **1280×800** — no bookmarks bar visible

---

## Scene-by-Scene Script

### 🎬 Scene 1 — Homepage (0–8s)

**URL:** `http://localhost:3000`

1. Page loads — hero section animates in
2. Slowly scroll down to reveal **Featured Products** grid
3. Hover over 2–3 product cards to show the hover effects and wishlist button
4. Scroll further to reveal the **Special Offers** section
5. Pause 1 second

**What to show:** Beautiful hero, product grid animations, card hover states

---

### 🎬 Scene 2 — Category Navigation (8–18s)

**URL:** `http://localhost:3000/shop`

1. Click a category from the top navigation (e.g., "Dairy")
2. Show filtered products loading
3. Apply a price filter using the slider
4. Show results narrowing in real-time
5. Type "orange" in the search bar
6. Show matching products appear

**What to show:** Filtering, search, real-time results

---

### 🎬 Scene 3 — Product Detail (18–30s)

**URL:** Click on **Orange Juice 1L** product card

1. Product detail page loads with hero image
2. Click through 2–3 gallery thumbnails
3. Click a size/variant selector
4. Scroll down to show description
5. Scroll to the reviews section

**What to show:** Gallery, variants, description, reviews

---

### 🎬 Scene 4 — Add to Cart & Wishlist (30–40s)

1. Click **♡ Wishlist** on a product card (heart fills red)
2. Open a product detail page
3. Increase quantity to 2
4. Click **Add to Cart**
5. Cart drawer slides open from the right
6. Show item in cart with quantity controls
7. Close the drawer

**What to show:** Wishlist animation, cart drawer, real-time totals

---

### 🎬 Scene 5 — Checkout (40–52s)

**URL:** `/cart` → `/checkout`

1. Click **Go to Checkout** from the cart
2. Fill in a test shipping address quickly (pre-fill if possible)
3. Type coupon code `SAVE10` and apply — discount updates
4. Show order summary with totals
5. Click **Place Order**
6. Order confirmation page appears ✓

**What to show:** Full checkout flow, coupon working, order confirmation

---

### 🎬 Scene 6 — Admin Dashboard (52–70s)

**URL:** `http://localhost:3000/admin`

1. Log in as `admin@freshmart.com` / `admin123`
2. Dashboard loads — animated metric cards (Revenue, Orders, Customers, Products)
3. Scroll to show the sales chart
4. Click **Products** in the sidebar
5. Product list loads — search for "orange"
6. Click **Edit** on Orange Juice 1L
7. Change the product name or price
8. Click **Save** — success toast appears
9. Navigate to **Orders**
10. Click on an order → change status to "Shipped"
11. Click **Analytics** in the sidebar
12. Show charts and stats

**What to show:** Admin power, real data, smooth navigation

---

### 🎬 Scene 7 — Storefront Sync (70–80s)

**URL:** `http://localhost:3000/product/orange-juice-1l`

1. Switch back to the storefront tab
2. Refresh the product page
3. The updated name/price is instantly visible ✓

**What to show:** Live sync between Admin and Storefront

---

### 🎬 Scene 8 — Mobile Responsiveness (80–90s)

1. Open browser DevTools → Toggle Device Toolbar (Cmd/Ctrl+Shift+M)
2. Select iPhone 12 Pro
3. Show homepage on mobile
4. Show the mobile bottom navigation bar
5. Show the mobile cart drawer

**What to show:** Fully responsive design

---

## Post-Recording

- [ ] Trim to 60–90 seconds
- [ ] Add subtle fade transitions between scenes (0.3s)
- [ ] Export at 15–20fps for GIF to keep file size under 10MB
- [ ] Save as `docs/assets/demo.gif`
- [ ] Update the README `![Demo](docs/assets/demo.gif)` link

---

## Screenshot Checklist

While recording, pause and take screenshots for:

| Screenshot | Filename |
|------------|----------|
| Homepage (full-width) | `homepage.png` |
| Shop page with filters | `shop.png` |
| Product detail page | `product-detail.png` |
| Cart drawer open | `cart.png` |
| Checkout page | `checkout.png` |
| Order confirmation | `order-confirmation.png` |
| Wishlist page | `wishlist.png` |
| User dashboard | `user-dashboard.png` |
| Admin dashboard | `admin-dashboard.png` |
| Admin analytics | `admin-analytics.png` |
| Admin products list | `admin-products.png` |
| Admin product edit form | `admin-product-edit.png` |
| Admin orders | `admin-orders.png` |
| Mobile view | `mobile.png` |

Save all screenshots to: `docs/assets/screenshots/`
