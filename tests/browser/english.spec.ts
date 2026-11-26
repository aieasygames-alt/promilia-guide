import { test, expect } from '@playwright/test';

const topics = ['global-release', 'download', 'requirements', 'cloud-gaming', 'getting-started', 'resources', 'redeem-codes', 'support'];

test('English preparation checklist persists through Japanese switching and FAQ returns to its guide', async ({ page }) => {
  await page.goto('/en/guides/getting-started/');
  await page.locator('input[data-task="account"]').check();
  await page.locator('.language-selector summary').click();
  await page.locator('.language-selector a[lang="ja"]').click();
  await expect(page.locator('input[data-task="account"]')).toBeChecked();
  await page.locator('.language-selector summary').click();
  await page.locator('.language-selector a[lang="en"]').click();
  await expect(page.locator('input[data-task="account"]')).toBeChecked();
  await page.locator('.related-questions a[href$="#q-first-day"]').click();
  await expect(page.locator('#q-first-day')).toHaveAttribute('open', '');
  await expect(page.locator('[data-faq-id]')).toHaveCount(15);
  await expect(page.locator('[data-answer-current="false"]')).toHaveCount(0);
  await page.locator('#q-first-day a').click();
  await expect(page).toHaveURL(/\/en\/guides\/getting-started\/$/);
});

test('English reward and code paths expose tools without unverified code actions', async ({ page, request }) => {
  await page.goto('/en/guides/resources/');
  await expect(page.locator('.prose')).toContainText('星彩・クロディーメ');
  await expect(page.locator('.prose')).toContainText('星彩・キラミィ');
  for (const file of ['launch-rewards-en.txt', 'launch-troubleshooting-en.txt']) {
    const response = await request.get(`/downloads/${file}`);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain('https://promiliaguide.com/en/guides/');
  }
  await page.goto('/en/guides/redeem-codes/');
  await expect(page.locator('[data-redeem-container]')).toContainText('no independently verified active codes');
  await expect(page.locator('[data-copy-target]')).toHaveCount(0);
  await page.goto('/en/search/?q=rewards');
  await expect(page.locator('.search-results a[href="/en/guides/resources/"]')).toBeVisible();
});

test('official regional character names switch across three languages and 404 offers English recovery', async ({ page, request }) => {
  for (const locale of ['zh-hans', 'ja', 'en']) {
    await page.goto(`/${locale}/characters/`);
    await expect(page.locator('[data-launch-roster] .name-list li')).toHaveCount(12);
    await expect(page.locator('[data-launch-roster]')).toContainText('源千代');
    await page.locator('.language-selector summary').click();
    await expect(page.locator('.language-selector a[lang="en"]')).toHaveAttribute('href', '/en/characters/');
  }
  const missing = await request.get('/en/no-such-guide/');
  expect(missing.status()).toBe(404);
  await page.goto('/en/no-such-guide/');
  await expect(page.locator('main h1')).toHaveText('Page not found');
  await expect(page.locator('main a[href="/en/"]')).toBeVisible();
});

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
  await page.goto('/zh-hans/guides/recharge-return/');
  await expect(page.locator('link[hreflang="en"]')).toHaveCount(0);
  await page.locator('.language-selector summary').click();
  const english = page.locator('.language-selector a[lang="en"]');
  await expect(english).toHaveAttribute('href', '/en/');
  await expect(english).toContainText('首页');
  await english.click();
  await expect(page.locator('#guides .guide-card')).toHaveCount(8);
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
  await expect(page.locator('.prose')).toContainText('at least 55GB');
  await expect(page.locator('.prose')).toContainText('not measured download sizes');
  await expect(page.locator('.prose')).toContainText('GTX 1060');
  await expect(page.locator('.prose')).toContainText('Dimensity 9000+');
});

test('English home and guides fit narrow phones and tablets with accessible language navigation', async ({ page }) => {
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['', ...topics.map(topic => `guides/${topic}/`), 'search/', 'faq/', 'characters/']) {
      await page.goto(`/en/${path}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} at ${width}px`).toBe(true);
      await page.locator('.language-selector summary').click();
      await expect(page.locator('.language-selector a[lang="en"]')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});
