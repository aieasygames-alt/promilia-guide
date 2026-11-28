import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const baseUrl = process.env.PERF_BASE_URL || 'http://127.0.0.1:4321';
const output = process.env.PERF_OUTPUT;
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
// Use the built publication set, including English, detail pages and legal pages.
const routes = process.env.PERF_ROUTES?.split(',') || walk('dist')
  .filter(file => file.endsWith('.html') && !file.endsWith('/404.html'))
  .map(file => '/' + file.slice(5).replace(/index\.html$/, ''));
const viewports = [
  { name: 'desktop', width: 1365, height: 900, deviceScaleFactor: 1 },
  { name: 'mobile', width: 320, height: 812, deviceScaleFactor: 2 },
];
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const viewport of viewports) {
    // Independent contexts avoid image cache transfer results leaking between viewports.
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: viewport.deviceScaleFactor });
    const queue = [...routes];
    await Promise.all(Array.from({ length: 3 }, async () => {
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.__imageAudit = { lcp: 0, cls: 0 };
        new PerformanceObserver(list => {
          const last = list.getEntries().at(-1);
          if (last) window.__imageAudit.lcp = last.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__imageAudit.cls += entry.value;
        }).observe({ type: 'layout-shift', buffered: true });
      });
      for (let route; (route = queue.shift());) {
        try {
          const response = await page.goto(new URL(route, baseUrl).href, { waitUntil: 'networkidle' });
          const initial = await page.evaluate(() => ({
            ...window.__imageAudit,
            fcp: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
            ttfb: performance.getEntriesByType('navigation')[0]?.responseStart || 0,
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
          }));
          // Native lazy loading is expected for offscreen images. Bring each into view
          // before checking decode, so an unfetched lazy image is not a false failure.
          const images = page.locator('img');
          for (let index = 0; index < await images.count(); index++) {
            const image = images.nth(index);
            if (!await image.isVisible()) continue;
            await image.scrollIntoViewIfNeeded();
            await image.evaluate(image => image.decode().catch(() => {}));
          }
          const measurement = await page.evaluate(() => {
            const images = [...document.images].filter(image => image.getClientRects().length);
            const resources = performance.getEntriesByType('resource').filter(entry => entry.initiatorType === 'img');
            return {
              imageCount: images.length,
              images: images.map(image => ({ src: image.getAttribute('src'), currentSrc: image.currentSrc, alt: image.alt, loading: image.loading, renderedWidth: image.getBoundingClientRect().width, naturalWidth: image.naturalWidth, complete: image.complete, srcset: image.srcset })),
              brokenImages: images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.currentSrc || image.src),
              imageBytes: resources.reduce((total, entry) => total + (entry.encodedBodySize || 0), 0),
              imageLoads: resources.map(entry => ({ url: entry.name, duration: entry.duration, bytes: entry.encodedBodySize || 0 })),
            };
          });
          results.push({ route, viewport: viewport.name, status: response?.status(), ...initial, ...measurement });
        } catch (error) {
          results.push({ route, viewport: viewport.name, error: error.message });
        }
      }
      await page.close();
    }));
    await context.close();
  }
} finally {
  await browser.close();
}
results.sort((a, b) => a.route.localeCompare(b.route) || a.viewport.localeCompare(b.viewport));
if (output) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify({ measuredAt: new Date().toISOString(), baseUrl, conditions: 'Unthrottled local Chromium lab check; LCP/CLS are initial-load observations, not field Core Web Vitals. Image loading is checked after scrolling.', results }, null, 2) + '\n');
}
console.log('viewport\troute\timages\timage KB\tTTFB ms\tFCP ms\tLCP ms\tCLS\tbroken\toverflow');
for (const result of results) {
  console.log([result.viewport, result.route, result.imageCount ?? '-', result.imageBytes === undefined ? '-' : (result.imageBytes / 1024).toFixed(1), Math.round(result.ttfb || 0), Math.round(result.fcp || 0), Math.round(result.lcp || 0), (result.cls || 0).toFixed(3), result.brokenImages?.length ?? result.error, result.horizontalOverflow || false].join('\t'));
}
if (results.some(result => result.error || result.status >= 400 || result.brokenImages.length || result.horizontalOverflow)) process.exitCode = 1;
