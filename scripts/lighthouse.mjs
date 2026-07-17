#!/usr/bin/env node
/**
 * scripts/lighthouse.mjs
 * Run Lighthouse against a URL and save the report to QA/lighthouse-report/
 *
 * Usage:
 *   node scripts/lighthouse.mjs https://your-app.vercel.app
 *
 * Dependencies (install once):
 *   npm install -D lighthouse chrome-launcher
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET_URL = process.argv[2] || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, '..', 'QA', 'lighthouse-report');

const PAGES = [
  { name: 'homepage',  path: '/' },
  { name: 'shop',      path: '/shop' },
  { name: 'cart',      path: '/cart' },
  { name: 'login',     path: '/login' },
  { name: 'checkout',  path: '/checkout' },
];

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  const results = [];

  for (const { name, path: urlPath } of PAGES) {
    const url = `${TARGET_URL}${urlPath}`;
    console.log(`\n🔦  Running Lighthouse: ${url}`);

    try {
      const runnerResult = await lighthouse(url, {
        port: chrome.port,
        output: ['html', 'json'],
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      });

      if (!runnerResult) {
        console.error(`  ❌ No result for ${url}`);
        continue;
      }

      const { lhr, report } = runnerResult;
      const [htmlReport, jsonReport] = Array.isArray(report) ? report : [report, '{}'];

      // Save HTML report
      const htmlPath = path.join(OUT_DIR, `${name}.html`);
      fs.writeFileSync(htmlPath, htmlReport);

      // Save JSON report
      const jsonPath = path.join(OUT_DIR, `${name}.json`);
      fs.writeFileSync(jsonPath, typeof jsonReport === 'string' ? jsonReport : JSON.stringify(jsonReport, null, 2));

      const scores = {
        page: name,
        url,
        performance:    Math.round((lhr.categories.performance?.score    ?? 0) * 100),
        accessibility:  Math.round((lhr.categories.accessibility?.score  ?? 0) * 100),
        bestPractices:  Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
        seo:            Math.round((lhr.categories.seo?.score            ?? 0) * 100),
      };

      results.push(scores);

      console.log(`  ✅ Performance:   ${scores.performance}`);
      console.log(`  ✅ Accessibility: ${scores.accessibility}`);
      console.log(`  ✅ Best-Practices:${scores.bestPractices}`);
      console.log(`  ✅ SEO:           ${scores.seo}`);
      console.log(`  📄 Report:        QA/lighthouse-report/${name}.html`);

    } catch (err) {
      console.error(`  ❌ Error on ${url}:`, err.message);
    }
  }

  await chrome.kill();

  // Save summary JSON
  const summaryPath = path.join(OUT_DIR, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 Summary saved: ${summaryPath}`);

  // Print table
  console.log('\n╔════════════════╦═════════════╦═══════════════╦══════════════╦═════╗');
  console.log('║ Page           ║ Performance ║ Accessibility ║ Best Pract.  ║ SEO ║');
  console.log('╠════════════════╬═════════════╬═══════════════╬══════════════╬═════╣');
  for (const r of results) {
    const p    = String(r.performance).padEnd(11);
    const a    = String(r.accessibility).padEnd(13);
    const bp   = String(r.bestPractices).padEnd(12);
    const seo  = String(r.seo).padEnd(3);
    const page = r.page.padEnd(14);
    console.log(`║ ${page} ║ ${p} ║ ${a} ║ ${bp} ║ ${seo} ║`);
  }
  console.log('╚════════════════╩═════════════╩═══════════════╩══════════════╩═════╝');

  // Fail if any critical score is below 70
  const failures = results.filter(r => r.performance < 70 || r.accessibility < 70 || r.seo < 70);
  if (failures.length > 0) {
    console.error('\n❌ Some pages scored below threshold (70):');
    failures.forEach(f => console.error(`   ${f.page}: perf=${f.performance} a11y=${f.accessibility} seo=${f.seo}`));
    process.exit(1);
  }

  console.log('\n✅ All Lighthouse scores passed!');
}

run().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
