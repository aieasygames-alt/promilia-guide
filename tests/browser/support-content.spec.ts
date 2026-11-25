import { test, expect } from '@playwright/test';

test('support guides explain regional routing and connect each released guide', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const locale of ['zh-hans', 'ja']) {
    await page.goto(`/${locale}/guides/support/`);
    await expect(page.locator('h1')).toContainText(locale === 'ja' ? '問い合わせ先' : '客服怎么联系');
    await expect(page.locator('article')).toContainText('主页面 → 设置 → 账户 → 用户中心 → 联系客服');
    await expect(page.locator('article')).toContainText(locale === 'ja' ? '日本語' : '日语');
    await expect(page.locator('article')).toContainText('@azurpromilia.jp');
    await expect(page.locator('article a[href="https://azurpromilia.jp/contact"]').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator(`article a[href="/downloads/launch-troubleshooting-${locale}.txt"]`).click();
    await expect(page).toHaveURL(new RegExp(`/downloads/launch-troubleshooting-${locale}.txt$`));
    await page.goto(`/${locale}/guides/`);
    await page.locator(`.content-routes a[href="/${locale}/guides/support/"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/guides/support/`));
    for (const topic of ['download', 'requirements', 'getting-started']) {
      await page.goto(`/${locale}/guides/${topic}/`);
      await expect(page.locator('.prose')).toContainText(topic === 'download' ? (locale === 'ja' ? 'クライアント' : '重启客户端') : (locale === 'ja' ? '実名認証' : '实名'));
      await expect(page.locator(`article a[href="/${locale}/guides/support/"]`).first()).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    }
  }
});

test('support content can be found through matching-language search', async ({ page }) => {
  for (const [locale, query] of [['zh-hans', '客服怎么联系'], ['ja', '問い合わせ先']]) {
    await page.goto(`/${locale}/search/?q=${encodeURIComponent(query)}`);
    await expect(page.locator(`.search-result a[href^="/${locale}/guides/support/"]`)).toBeVisible({ timeout: 15000 });
  }
});
