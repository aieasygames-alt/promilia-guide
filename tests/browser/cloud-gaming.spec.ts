import { test, expect } from '@playwright/test';

test('cloud guide keeps China service separate, survives language switching and opens its FAQ', async ({ page, request }) => {
  for (const locale of ['zh-hans', 'ja', 'en']) {
    await page.goto(`/${locale}/guides/cloud-gaming/`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://promiliaguide.com/${locale}/guides/cloud-gaming/`);
    await expect(page.locator('.prose')).toContainText('600');
    await expect(page.locator('.prose')).toContainText('15');
    await expect(page.locator('.prose a[href="https://azurpromilia.manjuu.com/cloudgame"]')).toBeVisible();
    const sheet = await request.get(`/downloads/cloud-gaming-${locale}.txt`);
    expect(sheet.ok()).toBe(true);
    expect(await sheet.text()).toContain(`https://promiliaguide.com/${locale}/guides/cloud-gaming/`);
    await page.locator('.language-selector summary').click();
    await page.locator('.language-selector a[lang="en"]').click();
    await expect(page).toHaveURL(/\/en\/guides\/cloud-gaming\/$/);
    await expect(page.locator('.prose')).toContainText('mainland China');
    await expect(page.locator('.prose')).toContainText('It does not announce a native Mac installer');
    await page.locator('.related-questions a[href$="#q-cloud-free-time"]').click();
    await expect(page.locator('#q-cloud-free-time')).toHaveAttribute('open', '');
    await page.locator('#q-cloud-free-time a').click();
    await expect(page).toHaveURL(/\/en\/guides\/cloud-gaming\/$/);
  }
});

test('cloud topic can be found from existing guidance and each language search', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja', 'en']) {
    for (const topic of ['download', 'requirements']) {
      await page.goto(`/${locale}/guides/${topic}/`);
      await page.locator('.prose a[href$="/guides/cloud-gaming/"]').click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/guides/cloud-gaming/$`));
    }
    await page.goto(`/${locale}/search/?q=Mac`);
    await expect(page.locator(`.search-results a[href="/${locale}/guides/cloud-gaming/"]`)).toBeVisible();
    await page.goto(`/${locale}/guides/cloud-gaming/`);
    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});
