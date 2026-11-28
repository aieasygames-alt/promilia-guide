import { test, expect } from '@playwright/test';

test('bilingual database and FAQ connect actual profiles, answers and guides on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const locale of ['zh-hans', 'ja']) {
    await page.goto(`/${locale}/database/`);
    await expect(page.locator('section[aria-labelledby="characters"] tbody tr')).toHaveCount(5);
    await expect(page.locator('section[aria-labelledby="kibo"] tbody tr')).toHaveCount(5);
    await expect(page.locator('.world-regions dt')).toHaveCount(5);
    await expect(page.getByRole('link', { name: locale === 'ja' ? '資料の読み方' : '资料怎么看', exact: false })).toHaveAttribute('href', `/${locale}/faq/#database`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto(`/${locale}/faq/#q-home-unlock`);
    await expect(page.locator('#q-home-unlock')).toHaveAttribute('open', '');
    await expect(page.locator('[data-faq-id]')).toHaveCount(33);
    await expect(page.locator('[data-answer-current="false"]')).toHaveCount(0);
    await expect(page.locator('#q-pvp')).toContainText(locale === 'ja' ? '判断できません' : '判断');
    await expect(page.locator('#q-home-unlock')).toContainText(locale === 'ja' ? '未検証' : '未实测');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('#q-home-unlock a').click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/systems/home/`));
    await page.locator('.related-questions a[href$="#q-home-unlock"]').click();
    await expect(page.locator('#q-home-unlock')).toHaveAttribute('open', '');
  }
});

test('region filter includes the Japanese-name Metsa and matches its count and pressed state', async ({ page }) => {
  for (const [locale, label] of [['zh-hans', '洛斯兰瑟'], ['ja', 'ローズランサ']]) {
    await page.goto(`/${locale}/characters/`);
    const filter = page.locator('[data-filter-target="roselansa"]');
    await expect(filter).toContainText(label);
    await expect(filter.locator('.filter-badge')).toHaveText('2');
    await filter.click();
    await expect(filter).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.entity-card:visible')).toHaveCount(2);
    await expect(page.locator('[data-entity-id="metsa"]')).toBeVisible();
    await expect(page.locator('[data-entity-id="symphoria"]')).toBeVisible();
    await page.locator('[data-filter-target="all"]').click();
    await expect(page.locator('.entity-card:visible')).toHaveCount(await page.locator('.preview-bar').count() ? 6 : 5);
  }
});

test('updates show latest releases first and consolidate official announcement links', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja']) {
    await page.goto(`/${locale}/updates/`);
    await expect(page.locator('[data-site-update]').first()).toHaveAttribute('data-site-update', '2026-11-28');
    await expect(page.locator('[data-site-update]').first()).toContainText('41');
    const links = await page.locator('[data-announcement-url]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-announcement-url')!.replace(/\/$/, '')));
    expect(links.length).toBe(new Set(links).size);
    const dates = await page.locator('[data-announcement-url] time').allTextContents();
    expect(dates).toEqual([...dates].sort().reverse());
  }
});

test('FAQ works without JavaScript and new hub content is searchable in the matching language', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: test.info().project.use.baseURL });
  try {
    const offline = await context.newPage();
    await offline.goto('/ja/faq/');
    await offline.locator('#q-home-unlock summary').click();
    await expect(offline.locator('#q-home-unlock')).toContainText('未検証');
    await offline.locator('#q-home-unlock a').click();
    await expect(offline).toHaveURL(/\/ja\/systems\/home\//);
  } finally { await context.close(); }
  for (const locale of ['zh-hans', 'ja']) {
    await page.goto(`/${locale}/search/?q=PvP`);
    await expect(page.locator(`.search-result a[href^="/${locale}/faq/"]`)).toBeVisible({ timeout: 15000 });
  }
});
