import { test, expect } from '@playwright/test';

test('mobile quick contents opens the folded index and transfers keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of ['zh-hans', 'ja', 'en']) {
    await page.goto(`/${locale}/guides/getting-started/`);
    const toc = page.locator('[data-mobile-toc]');
    await expect(toc).not.toHaveAttribute('open', '');
    await page.locator('#mobile-toc-btn').click();
    await expect(toc).toHaveAttribute('open', '');
    await expect(toc.locator('summary')).toBeFocused();
    await toc.locator('a').first().click();
    await expect(toc).not.toHaveAttribute('open', '');
    await page.locator('#mobile-top-btn').click();
    await expect(page.locator('#main')).toBeFocused();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  }
});

test('sharing reports a denied clipboard write without claiming success', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Permission denied'); } }, configurable: true });
  });
  await page.goto('/en/guides/download/');
  await page.locator('#mobile-share-btn').click();
  await expect(page.locator('.mobile-share-status')).toContainText('Could not copy the link');
  await expect(page.locator('#mobile-share-btn')).not.toHaveClass(/copied/);
});

test('sharing announces success after a successful clipboard write', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => { document.documentElement.dataset.copiedUrl = text; } }, configurable: true });
  });
  await page.goto('/ja/guides/download/');
  await page.locator('#mobile-share-btn').click();
  await expect(page.locator('#mobile-share-btn')).toHaveClass(/copied/);
  await expect(page.locator('.mobile-share-status')).not.toBeEmpty();
  await expect(page.locator('html')).toHaveAttribute('data-copied-url', /\/ja\/guides\/download\/$/);
});

test('without JavaScript, article navigation and search guide links remain usable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('/zh-hans/guides/download/');
    await expect(page.locator('#mobile-share-btn')).toBeHidden();
    await page.locator('#mobile-toc-btn').click();
    await expect(page).toHaveURL(/#article-toc$/);
    await page.locator('[data-mobile-toc] summary').click();
    await expect(page.locator('[data-mobile-toc] nav')).toBeVisible();
    await page.locator('#mobile-top-btn').click();
    await expect(page).toHaveURL(/#main$/);
    for (const locale of ['zh-hans', 'ja', 'en']) {
      await page.goto(`/${locale}/search/`);
      const link = page.locator('noscript a');
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(locale === 'en' ? /\/en\/#guides$/ : new RegExp(`/${locale}/guides/$`));
    }
  } finally { await context.close(); }
});

test('all reported search matches are reachable after the first twelve results', async ({ page }) => {
  await page.goto('/zh-hans/search/?q=%E8%93%9D%E8%89%B2%E6%98%9F%E5%8E%9F');
  const more = page.getByRole('button', { name: '显示更多结果' });
  await expect(more).toBeVisible();
  const total = Number((await page.locator('.search-status').textContent())?.match(/^\d+/)?.[0]);
  expect(total).toBeGreaterThan(12);
  await expect(page.locator('.search-result')).toHaveCount(12);
  await more.click();
  await expect(page.locator('.search-result h2 a').nth(12)).toBeFocused();
  while (await more.isVisible()) await more.click();
  await expect(page.locator('.search-result')).toHaveCount(total);
  await page.locator('#search-input').fill('不存在的检索词abcdefghijk');
  await expect(page.locator('.search-result')).toHaveCount(0);
  await expect(more).toBeHidden();
});
