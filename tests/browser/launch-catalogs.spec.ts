import { test, expect } from '@playwright/test';

for (const locale of ['zh-hans', 'ja', 'en']) {
  test(`${locale} launch catalogs preserve source scope and exact language navigation`, async ({ page, request }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`/${locale}/characters/`);
    const pool = page.locator('[data-standard-pool]');
    await expect(pool.locator('[data-pool-character]')).toHaveCount(20);
    await expect(pool.locator('[data-pool-rarity="5"] li')).toHaveCount(10);
    await expect(pool.locator('[data-pool-rarity="4"]')).toContainText('寒悠悠');
    await expect(pool.locator('[data-pool-character="涂山小玉"]')).toHaveCount(0);
    await expect(pool.locator('a[href*="912772234182004736"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto(`/${locale}/kibo/`);
    const showcase = page.locator('[data-launch-kibo]');
    await expect(showcase.locator('[data-kibo-introduction]')).toHaveCount(18);
    await expect(showcase.locator('[data-kibo-name-only] li')).toHaveCount(6);
    await expect(showcase.locator('[data-kibo-introduction="airay"]')).toContainText('飞鳐');
    const last = showcase.locator('[data-kibo-introduction="tangtang"] img');
    await last.scrollIntoViewIfNeeded();
    await expect.poll(() => last.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    expect((await request.get('/images/entities/launch-kibo/phantomfly.webp')).ok()).toBe(true);
    await page.locator('.language-selector summary').click();
    await expect(page.locator('.language-selector a[lang="en"]')).toHaveAttribute('href', '/en/kibo/');
    await page.locator('.language-selector a[lang="en"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-launch-kibo]')).toContainText('not verified English localizations');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test(`${locale} search finds the new regional names within its own language`, async ({ page }) => {
    for (const [name, route] of [['寒悠悠', 'characters'], ['森彩灵蝶', 'kibo']]) {
      await page.goto(`/${locale}/search/?q=${encodeURIComponent(name)}`);
      await expect(page.locator(`.search-results a[href="/${locale}/${route}/"]`)).toBeVisible({ timeout: 15000 });
    }
  });
}
