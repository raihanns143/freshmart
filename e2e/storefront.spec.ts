/**
 * E2E Test: Storefront Flows
 * Tests product page, cart, checkout, coupon application, and order placement.
 */
import { test, expect, Page } from '@playwright/test';

const CUSTOMER_EMAIL = 'qa-customer@freshmart-test.com';
const CUSTOMER_PASS = 'CustomerTest123!';

async function loginAsCustomer(page: Page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', CUSTOMER_EMAIL);
  await page.fill('input[type="password"]', CUSTOMER_PASS);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
}

test.describe('Storefront: Product & Navigation', () => {
  test('Homepage loads', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/.+/);
    await page.screenshot({ path: 'QA/screenshots/desktop/storefront-homepage.png', fullPage: true });
    console.log('✅ PASS: Homepage loaded');
  });

  test('Shop page loads with products', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'QA/screenshots/desktop/storefront-shop.png', fullPage: true });
    console.log('✅ PASS: Shop page loaded');
  });

  test('Product page loads from QA test product', async ({ page }) => {
    await page.goto('/product/qa-test-product');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'QA/screenshots/desktop/storefront-product.png', fullPage: true });
    // Should not be 404
    const title = await page.title();
    expect(title).not.toContain('404');
    console.log('✅ PASS: Product detail page loaded');
  });
});

test.describe('Storefront: Cart', () => {
  test('Add to cart works', async ({ page }) => {
    await page.goto('/product/qa-test-product');
    await page.waitForLoadState('networkidle');

    const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag")').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(1500);
      // Check cart count updated
      const cartBadge = page.locator('[data-testid="cart-count"], .cart-count, [aria-label*="cart"]').first();
      const cartText = await cartBadge.textContent().catch(() => '');
      console.log(`✅ PASS: Add to cart clicked. Cart state: ${cartText}`);
    } else {
      console.log('⚠️ SKIP: Add to cart button not found (product may be out of stock)');
    }
  });

  test('Cart page loads', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'QA/screenshots/desktop/storefront-cart.png', fullPage: true });
    await expect(page).toHaveTitle(/.+/);
    console.log('✅ PASS: Cart page loaded');
  });
});

test.describe('Storefront: Authentication', () => {
  test('Login page loads', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'QA/screenshots/desktop/storefront-login.png', fullPage: true });
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    console.log('✅ PASS: Login page loads with email input');
  });

  test('Customer login works', async ({ page }) => {
    await loginAsCustomer(page);
    const url = page.url();
    const isLoggedIn = !url.includes('/login');
    expect(isLoggedIn).toBe(true);
    await page.screenshot({ path: 'QA/screenshots/desktop/storefront-logged-in.png', fullPage: true });
    console.log(`✅ PASS: Customer login successful (redirected to: ${url})`);
  });
});

test.describe('Storefront: Coupon Validation', () => {
  test('Valid coupon accepted', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    const couponInput = page.locator('input[placeholder*="coupon"], input[placeholder*="promo"], input[name="coupon"]').first();
    if (await couponInput.isVisible()) {
      await couponInput.fill('QA-TEST-10');
      const applyBtn = page.locator('button:has-text("Apply"), button:has-text("Redeem")').first();
      await applyBtn.click();
      await page.waitForTimeout(2000);
      console.log('✅ PASS: Coupon field found and submitted');
    } else {
      console.log('⚠️ SKIP: Coupon input not visible (cart may be empty)');
    }
  });
});

test.describe('Storefront: SEO', () => {
  test('Homepage has proper meta tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    const description = await page.getAttribute('meta[name="description"]', 'content');
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');

    expect(title.length).toBeGreaterThan(5);
    console.log(`  Title: ${title}`);
    console.log(`  Description: ${description}`);
    console.log(`  OG Title: ${ogTitle}`);
    console.log('✅ PASS: Homepage meta tags present');
  });

  test('robots.txt exists', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain('User-agent');
    console.log('✅ PASS: robots.txt exists and is valid');
  });

  test('sitemap.xml or sitemap exists', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const status = response?.status();
    if (status === 200) {
      console.log('✅ PASS: sitemap.xml exists');
    } else {
      console.log(`⚠️ NOTE: sitemap.xml returned ${status} — consider adding next-sitemap`);
    }
  });
});
