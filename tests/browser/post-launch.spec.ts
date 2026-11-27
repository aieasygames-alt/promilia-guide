import { test, expect } from '@playwright/test';

test('post-launch guides expose regional evidence, event dates and community attribution across languages', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja', 'en']) {
    await page.goto(`/${locale}/guides/banner-rules/`);
    const prose = page.locator('.prose');
    await expect(prose).toContainText('0.800%');
    await expect(prose).toContainText('1.200%');
    await expect(prose).toContainText('1.716%');
    await expect(prose.locator('a[href="https://azurpromilia.jp/news/5225"]').first()).toBeVisible();
    await expect(prose.locator('a[href="https://azurpromilia.manjuu.com/home/news/detail/913156502976598016"]')).toBeVisible();
    await page.locator('.language-selector summary').click();
    await expect(page.locator('.language-selector a[lang="en"]')).toHaveAttribute('href', '/en/guides/banner-rules/');
    await page.goto(`/${locale}/guides/resources/`);
    await expect(page.locator('.prose')).toContainText('凪いだ一日');
    await expect(page.locator('.prose')).toContainText('600');
    await page.goto(`/${locale}/guides/download/`);
    await expect(page.locator('.prose a[href="https://www.taptap.cn/moment/875190460434352579"]')).toBeVisible();
    await page.goto(`/${locale}/guides/requirements/`);
    await expect(page.locator('.prose a[href="https://www.taptap.cn/moment/875181885217573464"]')).toBeVisible();
  }
});
