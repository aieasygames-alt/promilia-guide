import { test, expect } from '@playwright/test';

test('global English answer precedes regional choices without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: test.info().project.use.baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/en/guides/global-release/');
    const answer = page.locator('[data-release-answer]');
    await expect(answer).toContainText('summer 2027, subject to change');
    await expect(answer).toContainText('An exact release date has not been announced');
    const precedes = await page.locator('article').evaluate(article => Boolean(article.querySelector('[data-release-answer]')!.compareDocumentPosition(article.querySelector('[data-regional-gateway]')!) & Node.DOCUMENT_POSITION_FOLLOWING));
    expect(precedes).toBe(true);
    await expect(page.locator('.toc-desktop a[href="#english-release-answer"], .toc-mobile a[href="#english-release-answer"]')).toHaveCount(2);
  } finally { await context.close(); }
});

test('search-intent guides distinguish storage, Japanese Mac support and serial-code input', async ({ page }) => {
  await page.goto('/en/guides/requirements/');
  await expect(page.locator('h1')).toContainText('System Requirements & Size');
  await expect(page.locator('.prose')).toContainText('not confirmed download or installed sizes');
  await expect(page.locator('.prose h2').filter({hasText:'Download size versus installed size'})).toBeVisible();
  await page.goto('/ja/guides/cloud-gaming/');
  await expect(page.locator('.prose h2').first()).toContainText('日本版');
  await expect(page.locator('.prose')).toContainText('Windows・Android・iOS');
  await page.goto('/ja/guides/redeem-codes/');
  await expect(page.locator('h1')).toContainText('シリアルコード');
  await expect(page.locator('.prose')).toContainText('設定→アカウント→引き換えコード');
  await expect(page.locator('.prose')).toContainText('2027年11月26日');
});

test('Metsa has published bilingual gameplay guidance with attributed sources', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja']) {
    await page.goto(`/${locale}/characters/metsa/`);
    await expect(page.locator('[data-entity-detail]')).toHaveAttribute('data-detail-status', 'published');
    await expect(page.locator('article[data-pagefind-body]')).toBeVisible();
    await expect(page.locator('[data-entity-guide-section]')).toHaveCount(5);
    await expect(page.locator('#combat-loop ol li')).toHaveCount(4);
    await expect(page.locator('#anima')).toContainText('木漏れ日の眼差し');
    await expect(page.locator('#equipment')).toContainText('慈悲の光');
    await expect(page.locator('#gameplay-sources a').first()).toHaveAttribute('href', 'https://game8.jp/azurpromilia/846242');
    await expect(page.locator('.entity-image')).toHaveAttribute('src', '/images/entities/characters/metsa-official.webp');
    await page.locator('nav[aria-label="攻略の目次"], nav[aria-label="攻略目录"]').getByRole('link').first().click();
    await expect(page).toHaveURL(/#combat-loop$/);
  }
});
