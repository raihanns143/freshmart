# 🗺️ FreshMart Pro — Product Roadmap

This roadmap tracks current, planned, and completed work. Items are ordered by priority within each release.

> **Last Updated:** July 2026  
> **Current Version:** v1.0.0

---

## ✅ v1.0 — Foundation (Released)

### Platform
- [x] Next.js 16 App Router with React Server Components
- [x] Tailwind CSS v4
- [x] TypeScript 5 throughout the entire codebase
- [x] PostgreSQL + Prisma ORM with full schema
- [x] Docker + docker-compose setup
- [x] Vercel deployment configuration

### Authentication
- [x] Email + password login (bcrypt)
- [x] Google OAuth login
- [x] JWT sessions (30-day expiry)
- [x] Role-based access control (USER, ADMIN, MANAGER, EDITOR, SUPER_ADMIN)
- [x] Admin login at `/admin/login`
- [x] Middleware route protection

### Storefront
- [x] Homepage (Hero, Featured Products, Special Offers)
- [x] Responsive mobile-first layout
- [x] Mobile-specific navigation (bottom bar + search)
- [x] Product catalogue page (`/shop`)
- [x] Advanced filtering (category, price range, tags, brand)
- [x] Keyword search
- [x] Sort by price, rating, newest
- [x] Cursor-based pagination
- [x] Category pages (`/category/[slug]`)
- [x] Brand pages
- [x] Product detail page (`/product/[slug]`)
- [x] Product image gallery with thumbnails
- [x] Product variants (size, colour, SKU)
- [x] Related products section
- [x] Real-time stock indicator
- [x] Product reviews & ratings
- [x] Shopping cart (Zustand, localStorage-persisted)
- [x] Wishlist management
- [x] Coupon / promo code system
- [x] Checkout page with address management
- [x] Order confirmation
- [x] Order history (`/dashboard/orders`)
- [x] User dashboard (`/dashboard`)
- [x] Profile management
- [x] 404 not found page

### Admin Panel
- [x] Analytics dashboard (revenue, orders, customers, products)
- [x] Sales charts (daily/monthly, Recharts)
- [x] Product CRUD with full variant management
- [x] Product image management (gallery, main image)
- [x] Cloudinary image upload integration
- [x] Category CRUD (hierarchical parent/child)
- [x] Brand CRUD
- [x] Order management & status updates
- [x] Customer management
- [x] Inventory tracking & movement log
- [x] Coupon management (percentage, fixed, per-user limits)
- [x] Review moderation (approve, reject, reply)
- [x] Media library
- [x] Reports with export
- [x] User management (assign roles)
- [x] Audit log for all admin actions
- [x] Settings panel
- [x] Cache revalidation on every save

### SEO & Performance
- [x] Dynamic `generateMetadata()` per page
- [x] Open Graph & Twitter Card tags
- [x] Auto-generated `sitemap.ts`
- [x] `robots.ts`
- [x] Lighthouse CI integration
- [x] Playwright E2E tests

---

## 🚀 v1.1 — Payments & Communication (Next)

### Payments
- [ ] Stripe Checkout — full end-to-end card payments
- [ ] Stripe webhook handler — payment confirmation, refunds
- [ ] Payment receipt page
- [ ] Refund management in admin

### Notifications & Email
- [ ] Transactional email on order confirmation (Resend / Nodemailer)
- [ ] Email verification on registration
- [ ] Password reset flow via email
- [ ] Low stock alert emails to admin

### Quality of Life
- [ ] GitHub Actions CI/CD pipeline (lint, type-check, Playwright on PR)
- [ ] Order invoice PDF generation
- [ ] Admin bulk product actions (activate, deactivate, delete)

---

## 🔮 v1.2 — Intelligence & Experience

### AI Features
- [ ] AI product search (semantic / vector search)
- [ ] AI product recommendation engine
- [ ] AI-generated product descriptions in admin
- [ ] Smart category suggestions during product creation

### User Experience
- [ ] Progressive Web App (PWA) — installable, offline cart
- [ ] Recently viewed products
- [ ] Real-time in-app notifications (WebSocket / SSE)
- [ ] Product comparison table
- [ ] Advanced review system (photos, helpful votes)
- [ ] Customer loyalty points system

---

## 🌍 v1.3 — Globalisation & Scale

### Internationalisation
- [ ] Multi-language support (i18n) — English, Bangla, Arabic
- [ ] RTL layout support
- [ ] Currency switcher (USD, BDT, EUR)

### Bangladesh Payment Gateways
- [ ] SSLCommerz integration
- [ ] bKash integration
- [ ] Nagad integration
- [ ] Rocket integration

### Infrastructure
- [ ] Redis caching layer for hot product data
- [ ] Full-text search with Meilisearch or Elasticsearch
- [ ] Image optimisation pipeline (WebP auto-conversion)
- [ ] CDN configuration for static assets
- [ ] Kubernetes deployment manifests

---

## 🏪 v2.0 — Multi-Vendor Marketplace

- [ ] Vendor registration & onboarding
- [ ] Vendor dashboard (orders, products, revenue)
- [ ] Commission system
- [ ] Vendor payout management
- [ ] Product approval workflow (vendor → admin)
- [ ] Vendor storefronts (`/store/[vendor-slug]`)
- [ ] Split payments (vendor + platform fee)

---

## 💡 Ideas Backlog (Not Prioritised)

- [ ] Live chat support widget
- [ ] Abandoned cart recovery emails
- [ ] Product bundles & upsells
- [ ] Subscription products (weekly delivery)
- [ ] Flash sale / countdown timer
- [ ] Gift cards
- [ ] Affiliate marketing system
- [ ] Mobile app (React Native)

---

> Want to suggest a feature? [Open a Feature Request](https://github.com/yourusername/freshmart/issues/new?template=feature_request.md) 🚀
