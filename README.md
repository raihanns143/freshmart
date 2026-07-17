<div align="center">

<img src="docs/assets/screenshots/homepage.png" alt="FreshMart Hero" width="100%" style="border-radius:12px" />

# 🛒 FreshMart Pro

**A production-grade full-stack eCommerce platform built with Next.js 15, React 19, Prisma & PostgreSQL.**

[Live Demo](#) · [Admin Demo](#) · [Report a Bug](https://github.com/yourusername/freshmart/issues) · [Request a Feature](https://github.com/yourusername/freshmart/issues)

---

![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## 📌 Table of Contents

- [🌟 Features](#-features)
- [📸 Screenshots](#-screenshots)
- [🏗️ Tech Stack](#️-tech-stack)
- [📁 Folder Structure](#-folder-structure)
- [⚡ Quick Start](#-quick-start)
- [🔧 Environment Variables](#-environment-variables)
- [🗄️ Database Overview](#️-database-overview)
- [🏛️ Architecture](#️-architecture)
- [🔐 Authentication](#-authentication)
- [🚀 Deployment](#-deployment)
- [🛡️ Security](#️-security)
- [📈 Performance](#-performance)
- [🔍 SEO](#-seo)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Author](#-author)

---

## 🌟 Features

### 🛍️ Customer Storefront

| Feature | Status |
|---|---|
| Responsive mobile-first design | ✅ Live |
| Homepage with Hero, Featured Products & Special Offers | ✅ Live |
| Product catalogue with advanced filtering & search | ✅ Live |
| Category & Brand browsing | ✅ Live |
| Product Detail Page (variants, gallery, reviews) | ✅ Live |
| Real-time cart (Zustand, localStorage-persisted) | ✅ Live |
| Wishlist management | ✅ Live |
| Coupon code system | ✅ Live |
| Secure checkout with address management | ✅ Live |
| Order history & tracking | ✅ Live |
| User dashboard | ✅ Live |
| Email / Password & Google OAuth login | ✅ Live |
| Product reviews & ratings | ✅ Live |
| SEO-optimised pages (metadata, OG, sitemap, robots.txt) | ✅ Live |
| Stripe payment integration | 🟡 Planned |

### 🛠️ Admin Panel

| Feature | Status |
|---|---|
| Secure role-based admin login | ✅ Live |
| Analytics dashboard (revenue, orders, customers) | ✅ Live |
| Full product CRUD with variants & images | ✅ Live |
| Category & Brand management | ✅ Live |
| Order management & status updates | ✅ Live |
| Customer management | ✅ Live |
| Inventory tracking | ✅ Live |
| Coupon management | ✅ Live |
| Review moderation | ✅ Live |
| Audit log | ✅ Live |
| Media library | ✅ Live |
| Settings panel | ✅ Live |
| Reports | ✅ Live |
| User management | ✅ Live |

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center"><strong>🏠 Homepage</strong><br/><img src="docs/assets/screenshots/homepage.png" alt="Homepage" width="380"/></td>
    <td align="center"><strong>🛍️ Shop</strong><br/><img src="docs/assets/screenshots/shop.png" alt="Shop" width="380"/></td>
  </tr>
  <tr>
    <td align="center"><strong>📦 Product Detail</strong><br/><img src="docs/assets/screenshots/product-detail.png" alt="Product Detail" width="380"/></td>
    <td align="center"><strong>🛒 Cart & Checkout</strong><br/><img src="docs/assets/screenshots/cart.png" alt="Cart" width="380"/></td>
  </tr>
  <tr>
    <td align="center"><strong>📊 Admin Dashboard</strong><br/><img src="docs/assets/screenshots/admin-dashboard.png" alt="Admin Dashboard" width="380"/></td>
    <td align="center"><strong>📝 Admin Products</strong><br/><img src="docs/assets/screenshots/admin-products.png" alt="Admin Products" width="380"/></td>
  </tr>
  <tr>
    <td align="center"><strong>📱 Mobile View</strong><br/><img src="docs/assets/screenshots/mobile.png" alt="Mobile" width="180"/></td>
    <td align="center"><strong>❤️ Wishlist</strong><br/><img src="docs/assets/screenshots/wishlist.png" alt="Wishlist" width="380"/></td>
  </tr>
</table>

> 📷 **Note:** Add your actual screenshots to `docs/assets/screenshots/`. See the [screenshot checklist](docs/SCREENSHOT_CHECKLIST.md).

---

## 🏗️ Tech Stack

### Core

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |

### Backend & Database

| Layer | Technology |
|---|---|
| **ORM** | Prisma 5 |
| **Database** | PostgreSQL 16 |
| **Server Actions** | Next.js Server Actions |
| **API Routes** | Next.js App Router API |

### Authentication & Security

| Layer | Technology |
|---|---|
| **Auth** | Auth.js v5 (NextAuth) |
| **OAuth** | Google Provider |
| **Passwords** | bcryptjs |
| **Session** | JWT (30-day expiry) |

### Payments & Media

| Layer | Technology |
|---|---|
| **Payments** | Stripe |
| **Image Storage** | Cloudinary |

### State & UI

| Layer | Technology |
|---|---|
| **Global State** | Zustand |
| **Server State** | TanStack Query v5 |
| **UI Components** | Radix UI Primitives |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Toast** | Sonner |
| **Forms** | React Hook Form + Zod |

### Testing & DevOps

| Layer | Technology |
|---|---|
| **E2E Tests** | Playwright |
| **Performance** | Lighthouse CI |
| **Containerisation** | Docker + Docker Compose |
| **Deployment** | Vercel |

---

## 📁 Folder Structure

```
freshmart/
├── app/
│   ├── (auth)/                  # Login / Register pages
│   ├── (storefront)/
│   │   ├── (shop)/
│   │   │   ├── cart/            # Shopping cart
│   │   │   ├── category/[slug]/ # Category pages
│   │   │   ├── checkout/        # Checkout flow
│   │   │   ├── product/[slug]/  # Product detail
│   │   │   └── shop/            # Shop catalogue
│   │   └── (user)/
│   │       └── dashboard/       # Customer dashboard
│   ├── admin/
│   │   ├── analytics/
│   │   ├── categories/
│   │   ├── coupons/
│   │   ├── customers/
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── logs/
│   │   ├── media/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── reports/
│   │   ├── reviews/
│   │   ├── settings/
│   │   └── users/
│   └── api/                     # API route handlers
├── components/
│   ├── admin/                   # Admin-specific components
│   ├── auth/                    # Auth forms & guards
│   ├── cart/                    # Cart drawer & items
│   ├── layout/                  # Header, Footer, Sidebar
│   ├── product/                 # ProductCard, ProductDetail
│   ├── sections/                # Homepage sections
│   ├── shop/                    # Shop filters, grid
│   └── ui/                      # Shared UI primitives
├── context/                     # React context providers
├── hooks/                       # Custom React hooks
├── lib/
│   ├── actions/                 # Next.js Server Actions
│   └── prisma.ts                # Prisma client singleton
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # Database seeder
│   └── migrations/              # DB migration history
├── public/                      # Static assets
├── types/                       # Shared TypeScript types
├── docs/                        # Project documentation
├── .github/                     # GitHub templates
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── tailwind.config.ts
└── playwright.config.ts
```

---

## ⚡ Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [PostgreSQL](https://www.postgresql.org/) ≥ 14 **or** [Docker](https://www.docker.com/)
- [npm](https://www.npmjs.com/) ≥ 10

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/freshmart.git
cd freshmart
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Fill in the required values in `.env` (see [Environment Variables](#-environment-variables) below).

### 4. Start the Database

**Option A — Docker (recommended for local dev):**
```bash
docker-compose up db -d
```

**Option B — Use your own PostgreSQL instance:**  
Update `DATABASE_URL` in your `.env` file.

### 5. Initialise the Database

```bash
# Push schema and generate Prisma client
npx prisma db push

# Seed with demo data, categories, products & admin user
npx tsx prisma/seed.ts
```

> **Default Admin Credentials:**  
> 📧 `admin@freshmart.com`  
> 🔑 `admin123`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The Admin Panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure the following:

```env
# ─── Database ──────────────────────────────────────────────────────
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/freshmart?schema=public"

# ─── Auth.js ───────────────────────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_SECRET="generate-with-openssl-rand-base64-32"

# ─── Google OAuth (optional) ───────────────────────────────────────
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ─── Stripe (optional — for live payments) ─────────────────────────
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ─── Cloudinary (optional — for image uploads) ─────────────────────
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

> **Tip:** Generate a secure secret with:
> ```bash
> openssl rand -base64 32
> ```

---

## 🗄️ Database Overview

FreshMart uses **PostgreSQL** with **Prisma ORM**. The schema is production-ready with proper indexes and foreign key constraints.

### Models

| Model | Description |
|---|---|
| `User` | Customers and admins with role-based access |
| `Account` | OAuth account links (Auth.js) |
| `Session` | JWT session records |
| `Product` | Core product with SEO, badges, and flags |
| `ProductVariant` | SKU-level variants (size, colour, price) |
| `ProductImage` | Ordered product gallery images |
| `Category` | Hierarchical (parent/child) categories |
| `Brand` | Product brands |
| `Order` | Customer orders with full shipping details |
| `OrderItem` | Individual line items per order |
| `Cart` | Persistent server-side cart |
| `Wishlist` | User saved products |
| `Review` | Product reviews with moderation status |
| `Address` | User saved delivery addresses |
| `Coupon` | Discount code system |
| `Payment` | Stripe payment records |
| `Inventory` | Stock movement audit trail |
| `Notification` | In-app user notifications |
| `Setting` | Key-value store for app configuration |
| `AuditLog` | Admin action audit trail |

### Entity Relationship Overview

```
User ──< Order >── OrderItem ──< Product >── ProductVariant
User ──< Review ──< Product >── ProductImage
User ──< Cart >── Product
User ──< Wishlist >── Product
Product >── Category (hierarchical)
Product >── Brand
Order >── Coupon
Order ──< Payment
```

---

## 🏛️ Architecture

See the full [Architecture Document](docs/architecture.md) for Mermaid diagrams and detailed request flow.

```
Browser
  │
  ├── Next.js App Router (SSR / RSC / Static)
  │     ├── Storefront (/)
  │     │     ├── Server Components → Prisma → PostgreSQL
  │     │     └── Client Components → Zustand (cart/wishlist state)
  │     ├── Admin Panel (/admin)
  │     │     ├── Server Actions → Prisma → PostgreSQL
  │     │     └── Cache Revalidation → Next.js ISR
  │     └── API Routes (/api)
  │           └── REST endpoints for client-side data fetching
  │
  ├── Auth.js v5 (JWT sessions, Google OAuth, credentials)
  │
  ├── Middleware (route protection, RBAC)
  │
  └── External Services
        ├── Cloudinary (image hosting)
        ├── Stripe (payments)
        └── PostgreSQL (data persistence)
```

---

## 🔐 Authentication

FreshMart uses **Auth.js v5 (NextAuth)** with JWT sessions.

### Providers
- **Credentials** — Email + bcrypt-hashed password
- **Google OAuth** — One-click sign-in

### Roles

| Role | Access |
|---|---|
| `USER` | Storefront, dashboard, orders, reviews |
| `ADMIN` | Full admin panel access |
| `MANAGER` | Admin panel (limited) |
| `EDITOR` | Admin panel (limited) |
| `SUPER_ADMIN` | Full system access |

### Flow

1. User submits credentials → Auth.js validates against DB
2. JWT token issued (30-day expiry, refreshed every 24h)
3. Middleware checks role on every `/admin/*` request
4. Non-admin users are redirected to `/`

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

Set the following **Environment Variables** in your Vercel dashboard:

| Key | Value |
|---|---|
| `DATABASE_URL` | Production PostgreSQL connection string (Neon/Supabase) |
| `AUTH_SECRET` | Random 32-char string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

> See the full [Deployment Guide](Deployment-Guide.md) for step-by-step instructions.

### Deploy with Docker

```bash
docker-compose up --build -d
```

This starts:
- **PostgreSQL** on port `5432`
- **Next.js App** on port `3000`

### Recommended Database Providers

| Provider | Free Tier | Notes |
|---|---|---|
| [Neon](https://neon.tech) | ✅ 512 MB | Best for serverless |
| [Supabase](https://supabase.com) | ✅ 500 MB | Includes auth tools |
| [Railway](https://railway.app) | ✅ 1 GB | Simple setup |

---

## 🛡️ Security

- **Passwords** hashed with `bcryptjs` (cost factor 10)
- **RBAC** enforced in Next.js middleware on every request
- **CSRF** protection via Auth.js
- **SQL injection** prevented by Prisma parameterised queries
- **Environment secrets** never exposed to the client
- **Stripe Webhook** signature verification
- **Audit logging** for all admin mutations

See [SECURITY.md](SECURITY.md) for vulnerability reporting instructions.

---

## 📈 Performance

- **Next.js App Router** with React Server Components — minimal client JS
- **ISR (Incremental Static Regeneration)** for product pages
- **Cursor-based pagination** on the Shop API for efficient DB queries
- **Optimised images** via `next/image` + Cloudinary CDN
- **Tailwind CSS** — zero unused CSS in production
- **Zustand** — lightweight state management (no Redux overhead)

Run Lighthouse CI:
```bash
npm run lighthouse
```

---

## 🔍 SEO

Every page is fully optimised for search engines:

- ✅ Dynamic `generateMetadata()` per page
- ✅ OpenGraph & Twitter Card tags
- ✅ `sitemap.ts` auto-generated sitemap
- ✅ `robots.ts` robots.txt
- ✅ Structured data (planned)
- ✅ Canonical URLs
- ✅ Semantic HTML5 structure

---

## 🗺️ Roadmap

See the full [ROADMAP.md](docs/ROADMAP.md).

**Upcoming highlights:**

- [ ] 💳 Stripe full checkout integration
- [ ] 💬 Real-time notifications
- [ ] 🤖 AI product recommendations
- [ ] 📧 Transactional email (order confirmation)
- [ ] 📱 PWA support
- [ ] 🌍 Multi-language (i18n)
- [ ] 🏪 Multi-vendor marketplace

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

```bash
# 1. Fork the repo
# 2. Create your branch
git checkout -b feat/your-feature

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push and open a PR
git push origin feat/your-feature
```

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 👤 Author

Built with ❤️ by a passionate full-stack developer.

[![GitHub](https://img.shields.io/badge/GitHub-yourusername-181717?style=flat-square&logo=github)](https://github.com/yourusername)

---

## ⭐ Show Your Support

If you find FreshMart useful, please consider giving it a ⭐ on GitHub — it helps more developers discover the project!

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/freshmart&type=Date)](https://star-history.com/#yourusername/freshmart&Date)

---

<div align="center">

**[⬆ Back to Top](#-freshmart-pro)**

Made with Next.js 15 · React 19 · Tailwind CSS · PostgreSQL · Prisma

</div>
