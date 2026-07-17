/**
 * Mobile-Desktop Product Count Parity Tests
 *
 * Verifies that the same number of products are rendered on
 * every mobile viewport as on a 1280px desktop viewport.
 *
 * Viewports tested: 320, 360, 375, 390, 414, 430 px wide.
 */

import { test, expect, Page, BrowserContext } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "https://www.raihans.shop";

const MOBILE_VIEWPORTS = [
  { name: "320px",  width: 320,  height: 812 },
  { name: "360px",  width: 360,  height: 800 },
  { name: "375px",  width: 375,  height: 812 },
  { name: "390px",  width: 390,  height: 844 },
  { name: "414px",  width: 414,  height: 896 },
  { name: "430px",  width: 430,  height: 932 },
];

const DESKTOP_VIEWPORT = { width: 1280, height: 900 };

async function waitReady(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  // Wait for any loading spinners to disappear
  await page.waitForFunction(
    () => !document.querySelector(".animate-spin"),
    { timeout: 15_000 }
  ).catch(() => { /* ignore if no spinner */ });
}

/** Count product cards visible in the DOM (not just in viewport) */
async function countProductCards(page: Page): Promise<number> {
  // Product cards are always wrapped in <a> pointing to /product/...
  return page.locator('a[href^="/product/"]').count();
}

test.describe("Product count parity — Featured Products (Homepage)", () => {
  let desktopCount = 0;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await waitReady(page);
    desktopCount = await countProductCards(page);
    console.log(`Desktop homepage product cards: ${desktopCount}`);
    await page.close();
  });

  for (const vp of MOBILE_VIEWPORTS) {
    test(`${vp.name} — same product count as desktop (${DESKTOP_VIEWPORT.width}px)`, async ({ browser }) => {
      const page = await browser.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
      await waitReady(page);
      const mobileCount = await countProductCards(page);
      console.log(`  ${vp.name} homepage product cards: ${mobileCount}`);
      expect(mobileCount, `${vp.name} should show same products as desktop`).toBe(desktopCount);
      await page.close();
    });
  }
});

test.describe("Product count parity — Shop Page (/shop)", () => {
  let desktopCount = 0;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto(`${BASE_URL}/shop`, { waitUntil: "domcontentloaded" });
    await waitReady(page);
    desktopCount = await countProductCards(page);
    console.log(`Desktop /shop product cards: ${desktopCount}`);
    await page.close();
  });

  for (const vp of MOBILE_VIEWPORTS) {
    test(`${vp.name} — same product count as desktop`, async ({ browser }) => {
      const page = await browser.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/shop`, { waitUntil: "domcontentloaded" });
      await waitReady(page);
      const mobileCount = await countProductCards(page);
      console.log(`  ${vp.name} /shop product cards: ${mobileCount}`);
      expect(mobileCount, `${vp.name} should show same products as desktop`).toBe(desktopCount);
      await page.close();
    });
  }
});

test.describe("Product count parity — Category Page (fresh-produce)", () => {
  let desktopCount = 0;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto(`${BASE_URL}/category/fresh-produce`, { waitUntil: "domcontentloaded" });
    await waitReady(page);
    desktopCount = await countProductCards(page);
    console.log(`Desktop /category/fresh-produce product cards: ${desktopCount}`);
    await page.close();
  });

  for (const vp of MOBILE_VIEWPORTS) {
    test(`${vp.name} — same product count as desktop`, async ({ browser }) => {
      const page = await browser.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/category/fresh-produce`, { waitUntil: "domcontentloaded" });
      await waitReady(page);
      const mobileCount = await countProductCards(page);
      console.log(`  ${vp.name} category product cards: ${mobileCount}`);
      expect(mobileCount, `${vp.name} should show same products as desktop`).toBe(desktopCount);
      await page.close();
    });
  }
});
