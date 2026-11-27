import { test, expect } from '@playwright/test';

test('regional gateway leads to the chosen device and preserves it through language switching', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja']) {
    for (const region of ['jp', 'cn']) {
      for (const platform of ['pc', 'android', 'ios']) {
        await page.goto(`/${locale}/guides/global-release/`);
        await page.locator(`[data-region-entry="${region}"] a[href*="platform=${platform}"]`).click();
        await expect(page.locator('[data-region-filter]')).toHaveValue(region);
        await expect(page.locator('[data-platform-filter]')).toHaveValue(platform);
        await expect(page.locator('.distribution-card:visible')).toHaveCount(1);
        await expect(page.locator('.distribution-card:visible')).toHaveAttribute('data-region', region);
        await expect(page.locator('.distribution-card:visible')).toHaveAttribute('data-platform', platform);
      }
    }
  }
  await page.locator('.language-selector summary').click();
  await page.locator('.language-selector a[lang="zh-Hans"]').click();
  await expect(page.locator('[data-region-filter]')).toHaveValue('cn');
  await expect(page.locator('[data-platform-filter]')).toHaveValue('ios');
  await page.locator('.language-selector summary').click();
  // English uses prose installation sections rather than the bilingual filter widget.
  await expect(page.locator('.language-selector a[lang="en"]')).toHaveAttribute('href', '/en/guides/download/');
});

test('regional official entries and sources work without JavaScript in every language', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  const official = ['https://azurpromilia.jp/', 'https://azurpromilia.manjuu.com/home/', 'https://azurpromilia.jimi-global.com/home/'];
  for (const locale of ['zh-hans', 'ja', 'en']) {
    await page.goto(`/${locale}/guides/global-release/`);
    const gateway = page.locator('[data-regional-gateway]');
    await expect(gateway).toBeVisible();
    await expect(gateway.locator('h3')).toHaveCount(3);
    for (const url of official) await expect(gateway.locator(`a[href="${url}"]`)).toBeVisible();
    await expect(gateway.locator('a[href="https://azurpromilia.jp/PCdownload"]')).toBeVisible();
    for (const href of await gateway.locator('a[href^="#source-"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')!))) {
      await expect(page.locator(href)).toHaveCount(1);
    }
    await page.goto(`/${locale}/guides/download/?region=jp&platform=pc#distribution-title`);
    if (locale !== 'en') await expect(page.locator('.distribution-card:visible')).toHaveCount(6);
  }
  await context.close();
});

test('English device links land on real steps and all core journeys reach published guides without overflow', async ({ page, request }) => {
  await page.goto('/en/guides/global-release/');
  const links = await page.locator('[data-regional-gateway] a[href^="/en/guides/download/#"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')!));
  for (const href of new Set(links)) {
    await page.goto(href);
    await expect(page.locator(new URL(href, 'https://promiliaguide.com').hash)).toBeVisible();
  }
  for (const locale of ['zh-hans', 'ja', 'en']) {
    for (const topic of ['global-release', 'download', 'requirements', 'getting-started']) {
      await page.goto(`/${locale}/guides/${topic}/`);
      await page.setViewportSize({ width: 320, height: 850 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale}/${topic}`).toBe(true);
      if (topic === 'download') {
        const headings = await page.locator('.prose h2').allTextContents();
        expect(headings[0]).not.toMatch(/反复|何度も|Post-launch report/);
      }
      const targets = await page.locator('.prose a[href^="/' + locale + '/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')!).filter(href => !href.includes('?')));
      // Validate the destination HTML and anchors, including the character/Kibo catalogs.
      for (const target of new Set(targets)) {
        const response = await request.get(target);
        expect(response.ok(), target).toBe(true);
        const html = await response.text();
        const hash = new URL(target, 'https://promiliaguide.com').hash;
        if (hash) expect(html).toContain(`id="${decodeURIComponent(hash.slice(1))}"`);
        expect(html).toMatch(/data-published="true"|data-launch-roster|data-launch-kibo/);
      }
    }
  }
});
