import { chromium } from '@playwright/test';

const baseUrl = process.env.PERF_BASE_URL || 'http://127.0.0.1:4321';
const routes = [
  '/zh-hans/',
  '/ja/',
  '/zh-hans/guides/launch/',
  '/ja/guides/launch/',
  '/zh-hans/characters/',
  '/ja/characters/',
  '/zh-hans/kibo/',
  '/ja/kibo/',
];

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const route of routes) {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      window.__imageAudit = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries.at(-1);
        if (last) window.__imageAudit.lcp = last.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__imageAudit.cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    const startedAt = performance.now();
    await page.goto(new URL(route, baseUrl).href, { waitUntil: 'networkidle' });
    await page.waitForTimeout(100);
    const measurement = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paints = performance.getEntriesByType('paint');
      const images = [...document.images];
      const resources = performance.getEntriesByType('resource')
        .filter((entry) => entry.initiatorType === 'img' || /\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?|$)/i.test(entry.name));
      return {
        imageCount: images.length,
        brokenImages: images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
        imageBytes: resources.reduce((total, entry) => total + (entry.transferSize || entry.encodedBodySize || 0), 0),
        imageLoadMs: resources.map((entry) => ({ url: entry.name, duration: entry.duration, bytes: entry.transferSize || entry.encodedBodySize || 0 })),
        ttfb: navigation?.responseStart || 0,
        domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
        loadEventEnd: navigation?.loadEventEnd || 0,
        fcp: paints.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,
        lcp: window.__imageAudit?.lcp || 0,
        cls: window.__imageAudit?.cls || 0,
      };
    });
    results.push({ route, wallTime: performance.now() - startedAt, ...measurement });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log('route\timages\timage KB\tTTFB ms\tFCP ms\tLCP ms\tCLS\tbroken');
for (const result of results) {
  console.log([
    result.route,
    result.imageCount,
    (result.imageBytes / 1024).toFixed(1),
    result.ttfb.toFixed(0),
    result.fcp.toFixed(0),
    result.lcp.toFixed(0),
    result.cls.toFixed(3),
    result.brokenImages.length,
  ].join('\t'));
}

if (results.some((result) => result.brokenImages.length > 0)) process.exitCode = 1;
