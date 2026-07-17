# Architecture — FreshMart Pro

This document explains the complete system architecture and request flow of FreshMart.

---

## High-Level Overview

```mermaid
graph TD
    A[Browser / Mobile] --> B[Next.js 16 App Router]

    B --> C[Middleware\nRBAC + Route Protection]
    C --> D{Route Type}

    D --> E[Storefront\n/ and /shop and /product]
    D --> F[Admin Panel\n/admin/*]
    D --> G[API Routes\n/api/*]

    E --> H[React Server Components\nSSR + ISR]
    F --> I[Server Actions\nMutations]
    G --> J[REST Handlers]

    H --> K[Prisma Client]
    I --> K
    J --> K

    K --> L[(PostgreSQL)]

    B --> M[Auth.js v5\nJWT Sessions]
    M --> L

    E --> N[Zustand\nCart / Wishlist State]
    N --> O[localStorage\nPersistence]

    I --> P[Cache Revalidation\nrevalidatePath / revalidateTag]

    H --> Q[External Services]
    Q --> R[Cloudinary CDN\nImage Hosting]
    Q --> S[Stripe\nPayments]
```

---

## Request Flow — Storefront (Read Path)

```mermaid
sequenceDiagram
    participant Browser
    participant Middleware
    participant RSC as React Server Component
    participant Prisma
    participant DB as PostgreSQL

    Browser->>Middleware: GET /product/orange-juice-1l
    Middleware->>Middleware: Check auth (public route, allow)
    Middleware->>RSC: Forward request
    RSC->>Prisma: product.findUnique({ where: { slug } })
    Prisma->>DB: SELECT * FROM products WHERE slug = ?
    DB-->>Prisma: Product row
    Prisma-->>RSC: Product object
    RSC->>RSC: generateMetadata() → SEO tags
    RSC-->>Browser: Fully rendered HTML + JSON
```

---

## Request Flow — Admin Mutation (Write Path)

```mermaid
sequenceDiagram
    participant AdminBrowser
    participant Middleware
    participant Action as Server Action
    participant Prisma
    participant DB as PostgreSQL
    participant Cache as Next.js Cache

    AdminBrowser->>Middleware: POST /admin/products/edit
    Middleware->>Middleware: JWT check + RBAC (ADMIN role required)
    Middleware->>Action: Forward to Server Action
    Action->>Action: Validate payload (Zod schema)
    Action->>Prisma: product.update({ where: { id }, data: {...} })
    Prisma->>DB: UPDATE products SET ... WHERE id = ?
    DB-->>Prisma: Updated product row
    Prisma-->>Action: Updated product
    Action->>Cache: revalidatePath("/product/[slug]")
    Action->>Cache: revalidatePath("/shop")
    Action->>Cache: revalidatePath("/")
    Action->>Cache: revalidateTag("products")
    Action-->>AdminBrowser: { success: true }
```

---

## Authentication Flow

```mermaid
flowchart TD
    A[User visits /login] --> B{Provider}
    B --> C[Email + Password]
    B --> D[Google OAuth]

    C --> E[Auth.js credentials provider]
    D --> F[Google OAuth callback]

    E --> G[bcrypt.compare password]
    F --> H[Validate Google token]

    G --> I{Valid?}
    H --> I

    I --> J[No] --> K[Return error]
    I --> L[Yes] --> M[Issue JWT token\n30-day expiry]

    M --> N[Set session cookie]
    N --> O{User role?}

    O --> P[USER] --> Q[Redirect to /]
    O --> R[ADMIN/MANAGER/EDITOR] --> S[Redirect to /admin/dashboard]
```

---

## Data Model Relationships

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--o{ Review : writes
    User ||--o{ Cart : has
    User ||--o{ Wishlist : maintains
    User ||--o{ Address : saves
    User ||--o{ Notification : receives

    Product ||--o{ ProductVariant : has
    Product ||--o{ ProductImage : has
    Product ||--o{ Review : receives
    Product ||--o{ Cart : "added to"
    Product ||--o{ Wishlist : "saved in"
    Product ||--o{ OrderItem : "included in"
    Product }o--|| Category : "belongs to"
    Product }o--o| Brand : "belongs to"

    Order ||--o{ OrderItem : contains
    Order ||--o{ Payment : has
    Order }o--o| Coupon : "uses"
    Order }o--o| Address : "ships to"

    Category ||--o{ Category : "has children"

    Inventory }o--|| Product : tracks
    Inventory }o--o| ProductVariant : tracks
```

---

## Folder Architecture

```
freshmart/
│
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Unauthenticated auth pages
│   ├── (storefront)/             # Public-facing store
│   │   ├── (shop)/               # Shopping routes
│   │   │   ├── cart/
│   │   │   ├── category/[slug]/
│   │   │   ├── checkout/
│   │   │   ├── product/[slug]/
│   │   │   └── shop/
│   │   └── (user)/               # Authenticated user routes
│   │       └── dashboard/
│   ├── admin/                    # Admin panel routes (RBAC protected)
│   └── api/                      # REST API endpoints
│
├── components/                   # React components
│   ├── admin/                    # Admin-only components
│   ├── product/                  # Product cards, detail, form
│   ├── sections/                 # Homepage sections
│   └── ui/                       # Base UI primitives
│
├── lib/
│   ├── actions/                  # Server Actions (mutations)
│   └── prisma.ts                 # Singleton Prisma client
│
├── context/                      # React Context providers
├── hooks/                        # Custom hooks
├── prisma/                       # Schema + migrations + seeds
└── types/                        # Shared TypeScript interfaces
```

---

## Key Design Decisions

### Why Next.js Server Components?
Product pages, category pages, and the admin panel use React Server Components (RSC) by default. This means **zero client-side JavaScript** is shipped for data fetching — the DB query runs server-side and the rendered HTML is streamed directly to the browser. This results in best-in-class Core Web Vitals scores.

### Why Zustand for Cart?
Cart state needs to persist across page navigations and survive page refreshes without a network roundtrip. Zustand provides a tiny (~1KB) state store with built-in `localStorage` persistence middleware. A full Redux setup would be overkill.

### Why Prisma?
Prisma's type-safe query builder eliminates a whole class of runtime errors. It generates TypeScript types directly from the schema, meaning the IDE catches field mismatches at compile-time rather than in production.

### Why Cursor Pagination on the Shop API?
Offset-based pagination (`LIMIT x OFFSET y`) degrades to O(n) as page number increases — PostgreSQL must scan and discard all preceding rows. Cursor-based pagination (`WHERE id > cursor LIMIT x`) is always O(1) regardless of dataset size. This is critical for a shop catalogue that can have thousands of products.
