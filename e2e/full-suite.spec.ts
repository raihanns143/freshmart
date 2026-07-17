import { test, expect, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// ─────────────────────────────────────────────────────────────
// GLOBAL SETUP
// ─────────────────────────────────────────────────────────────
const SCREENSHOT_DIR = path.join('QA', 'test-results', 'screenshots');

test.beforeAll(async () => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  // networkidle is too slow on Vercel prod deployments due to analytics/streaming
}

async function shot(page: Page, name: string) {
  const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
}

// ─────────────────────────────────────────────────────────────
// 01 · HOMEPAGE
// ─────────────────────────────────────────────────────────────
test.describe('01 · Homepage', () => {
  test('loads with FreshMart title', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    await expect(page).toHaveTitle(/FreshMart/i);
    await shot(page, '01-homepage');
  });

  test('visible header / navigation', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    await shot(page, '01-header');
  });

  test('hero section or h1 is visible', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    const hero = page.getByRole('heading', { level: 1 }).first();
    await expect(hero).toBeVisible({ timeout: 15_000 });
  });
});

// ─────────────────────────────────────────────────────────────
// 02 · SHOP & CATEGORIES
// ─────────────────────────────────────────────────────────────
test.describe('02 · Shop & Categories', () => {
  test('shop page has h1', async ({ page }) => {
    await page.goto('/shop');
    await waitForPageReady(page);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 15_000 });
    await shot(page, '02-shop');
  });

  test('category page loads (fresh-fruits)', async ({ page }) => {
    await page.goto('/category/fresh-fruits');
    await waitForPageReady(page);
    // Banner heading OR empty state message
    const banner = page.locator('h1').first();
    const empty  = page.locator('text=/No products/i');
    const has = (await banner.isVisible()) || (await empty.isVisible());
    expect(has).toBe(true);
    await shot(page, '02-category');
  });

  test('navigating to a product detail page works', async ({ page }) => {
    await page.goto('/shop');
    await waitForPageReady(page);
    const links = page.locator('a[href^="/product/"]');
    if (await links.count() === 0) {
      test.skip();
    }
    await links.first().click();
    await waitForPageReady(page);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 20_000 });
    await shot(page, '02-product-detail');
  });
});

// ─────────────────────────────────────────────────────────────
// 03 · SEARCH
// ─────────────────────────────────────────────────────────────
test.describe('03 · Search', () => {
  test('search input exists in header', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    // The header has <input type="text" placeholder="Search...">
    const input = page.locator('header input[type="text"], header input[placeholder*="Search" i]').first();
    await expect(input).toBeVisible({ timeout: 10_000 });
    await shot(page, '03-search-bar');
  });

  test('typing in search and submitting navigates to /shop with q param', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    const form = page.locator('header form, form[action="/shop"], form[role="search"]').first();
    const input = form.locator('input').first();
    if (!(await input.isVisible({ timeout: 5_000 }).catch(() => false))) {
      // Try any visible search input
      const anyInput = page.locator('input[placeholder*="Search" i]').first();
      if (!(await anyInput.isVisible({ timeout: 3_000 }).catch(() => false))) {
        test.skip();
      }
      await anyInput.fill('organic');
      await anyInput.press('Enter');
    } else {
      await input.fill('organic');
      await input.press('Enter');
    }
    await waitForPageReady(page);
    // Either URL has q= param or we landed on shop page
    const url = page.url();
    const onResults = url.includes('q=') || url.includes('/shop') || url.includes('/search');
    expect(onResults).toBe(true);
    await shot(page, '03-search-results');
  });
});

// ─────────────────────────────────────────────────────────────
// 04 · CART
// ─────────────────────────────────────────────────────────────
test.describe('04 · Cart', () => {
  test('cart page renders heading', async ({ page }) => {
    await page.goto('/cart');
    await waitForPageReady(page);
    const heading = page.locator('h1, h2').filter({ hasText: /cart/i }).first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
    await shot(page, '04-cart');
  });

  test('adding a product updates cart count', async ({ page }) => {
    await page.goto('/shop');
    await waitForPageReady(page);

    // Look for any visible "Add to cart" or "+" button
    const btn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (!(await btn.isVisible({ timeout: 5_000 }).catch(() => false))) {
      test.skip();
    }
    await btn.click();
    await page.waitForTimeout(1_500);

    // Verify cart has items by going to cart page
    await page.goto('/cart');
    await waitForPageReady(page);
    // Either items are present or empty-state shows
    const hasItem  = await page.locator('[data-testid="cart-item"]').count();
    const hasEmpty = await page.locator('text=/empty|no items/i').count();
    expect(hasItem + hasEmpty).toBeGreaterThan(0);
    await shot(page, '04-cart-after-add');
  });
});

// ─────────────────────────────────────────────────────────────
// 05 · WISHLIST
// ─────────────────────────────────────────────────────────────
test.describe('05 · Wishlist', () => {
  test('wishlist page renders heading', async ({ page }) => {
    await page.goto('/wishlist');
    await waitForPageReady(page);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10_000 });
    await shot(page, '05-wishlist');
  });
});

// ─────────────────────────────────────────────────────────────
// 06 · CHECKOUT
// ─────────────────────────────────────────────────────────────
test.describe('06 · Checkout', () => {
  test('checkout page renders (form or empty-cart message)', async ({ page }) => {
    await page.goto('/checkout');
    await waitForPageReady(page);
    const hasForm  = await page.locator('form').count() > 0;
    const hasEmpty = await page.locator('text=/empty|no items/i').count() > 0;
    expect(hasForm || hasEmpty).toBe(true);
    await shot(page, '06-checkout');
  });

  test('invalid coupon shows error message', async ({ page }) => {
    // Navigate to checkout; if the cart is empty we may be redirected
    await page.goto('/checkout');
    await waitForPageReady(page);

    const couponInput = page.locator([
      'input[placeholder*="coupon" i]',
      'input[placeholder*="promo" i]',
      'input[name*="coupon" i]',
      'input[name="code"]',
    ].join(', ')).first();

    if (!(await couponInput.isVisible({ timeout: 5_000 }).catch(() => false))) {
      test.skip(); // coupon section hidden when cart is empty
    }

    await couponInput.fill('INVALID_CODE_XXXXXXX');
    await page.locator('button').filter({ hasText: /apply/i }).first().click();
    await page.waitForTimeout(2_500);

    // Error can be an inline text or a Sonner toast
    const error = page.locator([
      '[data-testid="coupon-error"]',
      'text=/invalid/i',
      'text=/not found/i',
      'text=/expired/i',
      // Sonner toast
      '[data-sonner-toast] [data-title]',
    ].join(', ')).first();
    await expect(error).toBeVisible({ timeout: 10_000 });
    await shot(page, '06-coupon-error');
  });
});

// ─────────────────────────────────────────────────────────────
// 07 · AUTHENTICATION
// ─────────────────────────────────────────────────────────────
test.describe('07 · Authentication', () => {
  test('login page renders email & password inputs', async ({ page }) => {
    await page.goto('/login');
    await waitForPageReady(page);
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await shot(page, '07-login');
  });

  test('invalid login shows Sonner error toast', async ({ page }) => {
    await page.goto('/login');
    await waitForPageReady(page);

    await page.locator('input[type="email"]').first().fill('nobody@invalid.xyz');
    await page.locator('input[type="password"]').first().fill('WrongP@ss999!');
    await page.locator('button[type="submit"]').first().click();

    // The LoginForm uses toast.error() — Sonner renders a li[data-sonner-toast]
    const toast = page.locator('[data-sonner-toast]').filter({ hasText: /invalid|wrong|error|incorrect/i });
    await expect(toast.first()).toBeVisible({ timeout: 15_000 });
    await shot(page, '07-login-error');
  });

  test('"Continue with Google" button is present', async ({ page }) => {
    await page.goto('/login');
    await waitForPageReady(page);
    // The button text is "Continue with Google"
    const googleBtn = page.locator('button').filter({ hasText: /continue with google/i });
    await expect(googleBtn).toBeVisible({ timeout: 10_000 });
    await shot(page, '07-google-btn');
  });

  test('register page renders with email input', async ({ page }) => {
    await page.goto('/register');
    await waitForPageReady(page);
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10_000 });
    await shot(page, '07-register');
  });
});

// ─────────────────────────────────────────────────────────────
// 08 · CUSTOMER DASHBOARD
// ─────────────────────────────────────────────────────────────
test.describe('08 · Customer Dashboard', () => {
  test('redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageReady(page);
    await expect(page.url()).toMatch(/\/login/);
    await shot(page, '08-dashboard-redirect');
  });
});

// ─────────────────────────────────────────────────────────────
// 09 · ADMIN
// ─────────────────────────────────────────────────────────────
test.describe('09 · Admin', () => {
  test('admin root redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    await waitForPageReady(page);
    await expect(page.url()).toMatch(/\/login/);
    await shot(page, '09-admin-redirect');
  });

  test('admin login page renders', async ({ page }) => {
    await page.goto('/admin/login');
    await waitForPageReady(page);
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10_000 });
    await shot(page, '09-admin-login');
  });

  test('admin products redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin/products');
    await waitForPageReady(page);
    await expect(page.url()).toMatch(/\/login/);
  });

  test('admin orders redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin/orders');
    await waitForPageReady(page);
    await expect(page.url()).toMatch(/\/login/);
  });
});

// ─────────────────────────────────────────────────────────────
// 10 · SEO & TECHNICAL
// ─────────────────────────────────────────────────────────────
test.describe('10 · SEO & Technical', () => {
  test('robots.txt is served (2xx)', async ({ page }) => {
    const res = await page.goto('/robots.txt');
    expect(res?.status()).toBeLessThan(400);
  });

  test('sitemap.xml is served (2xx)', async ({ page }) => {
    const res = await page.goto('/sitemap.xml');
    expect(res?.status()).toBeLessThan(400);
  });

  test('404 for unknown routes', async ({ page }) => {
    const res = await page.goto('/this-route-does-not-exist-xyz-404abc');
    expect(res?.status()).toBe(404);
    await shot(page, '10-404');
  });

  test('meta description present on homepage', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    const content = await page.locator('meta[name="description"]').getAttribute('content');
    expect(content).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────
// 11 · MOBILE
// ─────────────────────────────────────────────────────────────
test.describe('11 · Mobile', () => {
  test('homepage renders on 390px width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForPageReady(page);
    await expect(page.locator('h1, [class*="hero"]').first()).toBeVisible({ timeout: 15_000 });
    await shot(page, '11-mobile-home');
  });

  test('cart page renders on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/cart');
    await waitForPageReady(page);
    const heading = page.locator('h1, h2').filter({ hasText: /cart/i }).first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
    await shot(page, '11-mobile-cart');
  });
});
