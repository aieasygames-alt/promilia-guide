import { test, expect } from '@playwright/test';

const topics = ['global-release', 'download', 'requirements'];

test('English guides provide matching translations and native source / article UI', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const topic of topics) {
    await page.goto(`/en/guides/${topic}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.article-toc h2')).toHaveText('On this page');
    await expect(page.locator('#sources h2')).toHaveText('Sources and verification');
    await expect(page.locator('#sources')).toContainText('Source checked');
    await expect(page.locator('#sources')).not.toContainText('来源核对');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://promiliaguide.com/en/guides/${topic}/`);
    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(schema!)[0].inLanguage).toBe('en');
    await page.locator('.language-selector summary').click();
    await expect(page.locator('.language-selector a[lang="ja"]')).toHaveAttribute('href', `/ja/guides/${topic}/`);
    await page.locator('.language-selector a[lang="ja"]').click();
    await page.locator('.language-selector summary').click();
    await page.locator('.language-selector a[lang="en"]').click();
    await expect(page).toHaveURL(new RegExp(`/en/guides/${topic}/$`));
  }
  expect(errors).toEqual([]);
});

test('untranslated topics offer English home without a false article alternate', async ({ page }) => {
  await page.goto('/zh-hans/guides/getting-started/');
  await expect(page.locator('link[hreflang="en"]')).toHaveCount(0);
  await page.locator('.language-selector summary').click();
  const english = page.locator('.language-selector a[lang="en"]');
  await expect(english).toHaveAttribute('href', '/en/');
  await expect(english).toContainText('首页');
  await english.click();
  await expect(page.locator('#guides .guide-card')).toHaveCount(3);
  await expect(page.locator('#regional-status')).toBeVisible();
  await expect(page.locator('.english-scope')).toContainText('not verified a global English release date');
});

test('English search finds only English pages and preserves manual language preference', async ({ page }) => {
  await page.goto('/en/search/?q=storage');
  await expect(page.locator('.search-results a').first()).toBeVisible();
  const links = await page.locator('.search-results a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  expect(links.length).toBeGreaterThan(0);
  expect(links.every(link => link?.startsWith('/en/'))).toBe(true);
  expect(links).toContain('/en/guides/requirements/');
  await page.goto('/');
  await page.locator('.language-options [data-language-choice="en"]').click();
  await expect(page).toHaveURL(/\/en\/$/);
  await page.goto('/');
  await expect(page.locator('.language-options [data-language-choice="en"]')).toHaveClass(/suggested-language/);
  await expect(page.locator('#language-suggestion')).toContainText('English is suggested');
});

test('English launch facts retain regional and storage boundaries', async ({ page }) => {
  await page.goto('/en/guides/global-release/');
  await expect(page.locator('.prose')).toContainText('11:00 JST');
  await expect(page.locator('.prose')).toContainText('02:00 UTC');
  await expect(page.locator('.prose')).toContainText('not confirmation that servers are already live');
  await page.goto('/en/guides/requirements/');
  await expect(page.locator('.prose')).toContainText('more than 55GB');
  await expect(page.locator('.prose')).toContainText('not measured download sizes');
  await expect(page.locator('.prose')).toContainText('GTX 1060');
  await expect(page.locator('.prose')).toContainText('Dimensity 9000+');
});

test('English home and guides fit narrow phones and tablets with accessible language navigation', async ({ page }) => {
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['', ...topics.map(topic => `guides/${topic}/`), 'search/']) {
      await page.goto(`/en/${path}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} at ${width}px`).toBe(true);
      await page.locator('.language-selector summary').click();
      await expect(page.locator('.language-selector a[lang="en"]')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});
