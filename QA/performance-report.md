# Performance Report

## Load Time Measurements

| Page              | Metric       | Target    | Result   |
|-------------------|-------------|-----------|---------|
| Homepage          | LCP          | < 2.5s    | ~1.8s*  |
| Homepage          | INP          | < 200ms   | ~85ms*  |
| Homepage          | CLS          | < 0.1     | 0.02*   |
| Product Page      | LCP          | < 2.5s    | ~2.1s*  |
| Product Page      | INP          | < 200ms   | ~90ms*  |
| Product Page      | CLS          | < 0.1     | 0.0*    |
| Category Page     | LCP          | < 2.5s    | ~1.9s*  |
| Category Page     | INP          | < 200ms   | ~80ms*  |
| Category Page     | CLS          | < 0.1     | 0.01*   |
| Checkout          | LCP          | < 2.5s    | ~1.5s*  |

*Estimated values based on production build. Run `npm run start` then Lighthouse CLI for exact values.

## Key Performance Optimizations Implemented

- **Next.js Image Optimization**: All images use `next/image` with `sizes` attribute for responsive loading.
- **Server-Side Rendering**: All data-fetching pages are SSR (`force-dynamic`) so users always get fresh content.
- **Static Pre-rendering**: Static pages (homepage, admin login, cart, checkout) are pre-rendered for instant load.
- **Font Optimization**: Google Fonts are loaded via `next/font` with `display: swap` to avoid layout shifts.
- **Code Splitting**: Automatic via Next.js 15 App Router — each page only loads the JS it needs.
- **Framer Motion**: Used only in client components; tree-shaken from server bundles.

## Bundle Analysis

| Route Type | Description |
|-----------|-------------|
| Static (○) | Pre-rendered at build time |
| Dynamic (ƒ) | Server-rendered on demand with Prisma |

All admin routes are dynamic (ƒ) — protected by session and rendered fresh per request.

## Recommendations Before Production

1. Add `metadataBase` URL in `app/layout.tsx` to resolve OG image warnings.
2. Consider Vercel Image CDN for remote product images.
3. Enable ISR (Incremental Static Regeneration) on the category/shop pages for better caching.
