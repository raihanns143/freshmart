import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function crawl() {
  console.log(`Starting crawl at ${BASE_URL}...`);
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  const visited = new Set<string>();
  const queue = [BASE_URL];
  
  const errors: Array<{ url: string, status: number, from: string }> = [];

  while (queue.length > 0) {
    const currentUrl = queue.shift()!;
    
    // Skip external links or already visited
    if (!currentUrl.startsWith(BASE_URL)) continue;
    if (visited.has(currentUrl)) continue;
    
    visited.add(currentUrl);
    console.log(`Crawling: ${currentUrl}`);

    const page = await context.newPage();
    
    try {
      const response = await page.goto(currentUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
      
      if (!response) {
        console.log(`[WARN] No response for ${currentUrl}`);
        await page.close();
        continue;
      }

      const status = response.status();
      
      if (status >= 400) {
        errors.push({ url: currentUrl, status, from: "Initial Queue" });
        console.error(`[ERROR] ${status} at ${currentUrl}`);
      }

      // Collect links
      const hrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map(a => (a as HTMLAnchorElement).href)
          .filter(href => href.startsWith(window.location.origin) && !href.includes('#'));
      });

      for (const href of hrefs) {
        if (!visited.has(href) && !queue.includes(href)) {
          queue.push(href);
        }
      }

    } catch (e: any) {
      console.error(`[FAIL] Failed to crawl ${currentUrl}: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log("\n--- Crawl Summary ---");
  console.log(`Total Pages Visited: ${visited.size}`);
  
  if (errors.length > 0) {
    console.log(`Found ${errors.length} Broken Links:`);
    errors.forEach(e => console.log(`- ${e.status} | ${e.url}`));
    process.exit(1);
  } else {
    console.log("All internal links are OK! 🎉");
  }
}

crawl().catch(console.error);
