import { test, expect } from '@playwright/test';

for (const locale of ['zh-hans', 'ja', 'en']) {
  test(`${locale}: artwork loads and representative images agree with search metadata`, async ({ page }) => {
    for (const route of ['', 'characters/', 'kibo/', 'guides/getting-started/']) {
      await page.goto(`/${locale}/${route}`);
      const imageURL = await page.locator('meta[property="og:image"]').getAttribute('content');
      const relative = new URL(imageURL!).pathname;
      const primary = page.locator(`img[src="${relative}"]`);
      await expect(primary).toHaveCount(1);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', imageURL!);
      await expect(primary).toHaveAttribute('loading', 'eager');
      const figures = page.locator('[data-visual-id] img');
      for (const image of await figures.all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        await expect(image).toHaveAttribute('srcset', /\d+w/);
        expect((await image.getAttribute('alt'))!.length).toBeGreaterThan(10);
        expect(await image.evaluate((img: HTMLImageElement) => Math.abs(img.clientWidth / img.clientHeight - img.width / img.height))).toBeLessThan(.03);
      }
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(schemas.join('')).toContain(imageURL!);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });

  test(`${locale}: supplied artwork keeps its context and lazy gallery loading`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    const holiday = page.locator('[data-visual-id="holiday-illustration"]');
    await expect(holiday.locator('img')).toHaveAttribute('width', '1280');
    await expect(holiday.locator('img')).toHaveAttribute('loading', 'lazy');
    await expect(holiday).toContainText('NEXON Korea Corp.');
    await page.goto(`/${locale}/characters/`);
    await expect(page.locator('[data-visual-id="nono-profile"]')).toContainText('ノノ / NONO');
    await expect(page.locator('.artwork-grid img')).toHaveCount(2);
    for (const image of await page.locator('.artwork-grid img').all()) {
      await expect(image).toHaveAttribute('loading', 'lazy');
      await expect(image).not.toHaveAttribute('fetchpriority', 'high');
    }
  });
}
