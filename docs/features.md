# Feature Matrix — FreshMart Pro

A comprehensive view of every feature, its target audience, implementation status, and priority.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully implemented & live |
| 🟡 | In progress / partially implemented |
| 🔜 | Planned — next release |
| 🔮 | Planned — future release |
| ❌ | Not planned |

---

## 🛍️ Storefront — Customer Features

| # | Feature | Customer | Admin Visible | Status | Priority |
|---|---------|----------|--------------|--------|----------|
| 1 | Homepage with hero section | ✅ | — | ✅ Live | P0 |
| 2 | Featured products section | ✅ | — | ✅ Live | P0 |
| 3 | Special offers / sale section | ✅ | — | ✅ Live | P0 |
| 4 | Mobile-responsive layout | ✅ | — | ✅ Live | P0 |
| 5 | Product catalogue / shop page | ✅ | — | ✅ Live | P0 |
| 6 | Advanced product filtering | ✅ | — | ✅ Live | P0 |
| 7 | Keyword search | ✅ | — | ✅ Live | P0 |
| 8 | Sort (price, rating, newest) | ✅ | — | ✅ Live | P0 |
| 9 | Cursor-based pagination | ✅ | — | ✅ Live | P0 |
| 10 | Category pages with products | ✅ | — | ✅ Live | P0 |
| 11 | Subcategory support | ✅ | ✅ | ✅ Live | P1 |
| 12 | Brand pages | ✅ | ✅ | ✅ Live | P1 |
| 13 | Product detail page | ✅ | — | ✅ Live | P0 |
| 14 | Product image gallery | ✅ | ✅ | ✅ Live | P0 |
| 15 | Product variants (size, colour) | ✅ | ✅ | ✅ Live | P0 |
| 16 | Stock indicator | ✅ | ✅ | ✅ Live | P0 |
| 17 | Related products | ✅ | — | ✅ Live | P1 |
| 18 | Product reviews & ratings | ✅ | ✅ | ✅ Live | P1 |
| 19 | Shopping cart | ✅ | — | ✅ Live | P0 |
| 20 | Cart persistence (localStorage) | ✅ | — | ✅ Live | P0 |
| 21 | Wishlist | ✅ | — | ✅ Live | P1 |
| 22 | Coupon / promo code | ✅ | ✅ | ✅ Live | P1 |
| 23 | Checkout page | ✅ | — | ✅ Live | P0 |
| 24 | Address management | ✅ | — | ✅ Live | P1 |
| 25 | Stripe payment | ✅ | ✅ | 🟡 Partial | P0 |
| 26 | Order confirmation | ✅ | ✅ | ✅ Live | P0 |
| 27 | Order history | ✅ | ✅ | ✅ Live | P0 |
| 28 | Order detail & tracking | ✅ | ✅ | ✅ Live | P0 |
| 29 | User dashboard | ✅ | — | ✅ Live | P1 |
| 30 | Profile management | ✅ | — | ✅ Live | P1 |
| 31 | Email / password login | ✅ | — | ✅ Live | P0 |
| 32 | Google OAuth login | ✅ | — | ✅ Live | P0 |
| 33 | Email verification | ✅ | — | 🔜 Next | P1 |
| 34 | Password reset | ✅ | — | 🔜 Next | P1 |
| 35 | In-app notifications | ✅ | ✅ | 🟡 Partial | P2 |
| 36 | Transactional emails | ✅ | — | 🔜 Next | P1 |
| 37 | SSLCommerz (BD payment) | ✅ | — | 🔮 Future | P2 |
| 38 | bKash integration | ✅ | — | 🔮 Future | P2 |
| 39 | Nagad integration | ✅ | — | 🔮 Future | P2 |

---

## 🛠️ Admin Panel Features

| # | Feature | Implemented | Status | Priority |
|---|---------|------------|--------|----------|
| 1 | Secure role-based login | ✅ | ✅ Live | P0 |
| 2 | Admin dashboard overview | ✅ | ✅ Live | P0 |
| 3 | Revenue & orders analytics | ✅ | ✅ Live | P0 |
| 4 | Sales charts (Recharts) | ✅ | ✅ Live | P0 |
| 5 | Product list with search & filter | ✅ | ✅ Live | P0 |
| 6 | Create product (with variants) | ✅ | ✅ Live | P0 |
| 7 | Edit product | ✅ | ✅ Live | P0 |
| 8 | Delete product (with safety checks) | ✅ | ✅ Live | P0 |
| 9 | Product image management | ✅ | ✅ Live | P0 |
| 10 | Cloudinary image uploads | ✅ | ✅ Live | P1 |
| 11 | Category CRUD | ✅ | ✅ Live | P0 |
| 12 | Subcategory management | ✅ | ✅ Live | P1 |
| 13 | Brand CRUD | ✅ | ✅ Live | P0 |
| 14 | Order list with filtering | ✅ | ✅ Live | P0 |
| 15 | Update order status | ✅ | ✅ Live | P0 |
| 16 | Order detail view | ✅ | ✅ Live | P0 |
| 17 | Customer list | ✅ | ✅ Live | P0 |
| 18 | Customer detail & orders | ✅ | ✅ Live | P1 |
| 19 | Inventory tracking | ✅ | ✅ Live | P1 |
| 20 | Low stock alerts | ✅ | 🟡 Partial | P1 |
| 21 | Coupon creation & management | ✅ | ✅ Live | P1 |
| 22 | Review moderation (approve/reject) | ✅ | ✅ Live | P1 |
| 23 | Media library | ✅ | ✅ Live | P2 |
| 24 | Reports export | ✅ | ✅ Live | P2 |
| 25 | User management (roles) | ✅ | ✅ Live | P1 |
| 26 | Audit log | ✅ | ✅ Live | P2 |
| 27 | Settings panel | ✅ | ✅ Live | P2 |
| 28 | Cache revalidation on save | ✅ | ✅ Live | P0 |
| 29 | Multi-vendor support | — | 🔮 Future | P3 |
| 30 | AI product description generator | — | 🔮 Future | P3 |

---

## ⚙️ Platform & Infrastructure

| # | Feature | Status | Priority |
|---|---------|--------|----------|
| 1 | Next.js App Router (RSC) | ✅ Live | P0 |
| 2 | Prisma + PostgreSQL | ✅ Live | P0 |
| 3 | Auth.js v5 (JWT + OAuth) | ✅ Live | P0 |
| 4 | Tailwind CSS v4 | ✅ Live | P0 |
| 5 | Docker + docker-compose | ✅ Live | P1 |
| 6 | Vercel deployment | ✅ Live | P0 |
| 7 | E2E tests (Playwright) | ✅ Live | P1 |
| 8 | Lighthouse CI | ✅ Live | P1 |
| 9 | Sitemap & robots.txt | ✅ Live | P1 |
| 10 | Dynamic Open Graph metadata | ✅ Live | P1 |
| 11 | PWA support | 🔮 Future | P2 |
| 12 | Docker Kubernetes deployment | 🔮 Future | P3 |
| 13 | CI/CD GitHub Actions | 🔜 Next | P2 |
| 14 | i18n / multi-language | 🔮 Future | P3 |
| 15 | Redis caching layer | 🔮 Future | P2 |
