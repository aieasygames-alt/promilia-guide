import { test, expect } from '@playwright/test';

test('home action cards use independent regions and do not promote unverified claims', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja']) {
    await page.goto(`/${locale}/`);
    const actions = page.locator('[data-launch-actions]');
    await expect(actions.locator('[data-launch-region]')).toHaveCount(2);
    await expect(actions.locator('[data-launch-clock]')).toHaveCount(0);
    await expect(actions.locator('[data-launch-region="cn"] time[datetime="2026-11-26T10:00:00+08:00"]')).toHaveText('2026-11-26 10:00 (UTC+8)');
    await expect(actions.locator('[data-launch-region="jp"] time[datetime="2026-11-26T11:00:00+09:00"]')).toHaveText('2026-11-26 11:00 (JST / UTC+9)');
    await expect(actions.locator('[data-launch-region="cn"]')).toHaveAttribute('data-service-stage', 'open');
    await expect(actions.locator('[data-launch-region="jp"]')).toHaveAttribute('data-service-stage', 'open');
    await expect(actions.locator('[data-home-code-count]')).toContainText('AZPR1126');
    await expect(actions.locator('[data-home-code-count] a')).toHaveAttribute('href', `/${locale}/guides/redeem-codes/`);
    await expect(page.locator('body')).not.toContainText(/PROMILIA1120LIVE|STARVOYAGE2026|AZUR1126READY|仅剩 6 天|あと6日/);
    await actions.locator('[data-launch-region="jp"] a').click();
    await expect(page).toHaveURL(/region=jp/);
    await expect(page.locator('[data-region-filter]')).toHaveValue('jp');
    await expect(page.locator('[data-channel]:visible')).toHaveCount(3);
  }
});

test('planned clock reaches zero without inventing a live server', async ({ page }) => {
  await page.clock.install({ time: new Date('2049-12-31T16:00:00Z') });
  await page.goto('/editorial/fixtures/trust/');
  const clock = page.locator('[data-launch-clock]');
  await expect(clock).toContainText('0 天 0 小时 1 分钟');
  await expect(page.locator('[data-launch-region="cn"] time')).toHaveText('2050-01-01 00:01 (UTC+8)');
  await page.clock.runFor(60000);
  await expect(clock).toContainText('实际开放状态待核验');
  await expect(clock).not.toContainText(/-\d|已开服/);
  await expect(page.locator('[data-launch-region="cn"]')).toHaveAttribute('data-service-stage', 'announced');
});

test('copy reports clipboard outcomes and disables at the actual expiry', async ({ page }) => {
  await page.clock.install({ time: new Date('2049-12-31T16:00:00Z') });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { (window as any).copiedCode = text; } } });
  });
  await page.goto('/editorial/fixtures/trust/');
  const button = page.locator('[data-copy-target]');
  const feedback = page.locator('[data-copy-feedback]');
  await expect(button).toBeEnabled();
  await button.click();
  await expect(feedback).toHaveText('已复制');
  expect(await page.evaluate(() => (window as any).copiedCode)).toBe('FIXTURE_ONLY');
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Permission denied'); }; });
  await button.click();
  await expect(feedback).toContainText('复制失败');
  await page.clock.runFor(120000);
  await expect(button).toBeDisabled();
  await expect(page.locator('[data-code-status]')).toHaveText('已到期');
});

test('unreviewed details are explicitly excluded from indexing and CV claims', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja']) {
    await page.goto(`/${locale}/characters/anais/`);
    await expect(page.locator('[data-entity-review-note]')).toBeVisible();
    await expect(page.locator('[data-pagefind-body]')).toHaveCount(0);
    await expect(page.locator('body')).toHaveAttribute('data-pagefind-ignore', 'all');
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(schemas.join(' ')).not.toContain('jobTitle');
    await page.goto(`/${locale}/characters/`);
    await expect(page.locator('[data-entity-id="hanyouyou"]')).toContainText(/待核验|確認中/);
  }
});

test('pending entity revisions are readable in preview while remaining outside search', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja']) {
    for (const path of ['kibo/cabbird']) {
      await page.goto(`/${locale}/${path}/`);
      await expect(page.locator('[data-entity-detail][data-detail-status="draft"]')).toBeVisible();
      await expect(page.locator('[data-entity-detail] p')).toHaveCount(3);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.locator('[data-pagefind-body]')).toHaveCount(0);
      await expect(page.locator('.entity-card-footer a')).toHaveAttribute('href', /azurpromilia\.(jp|manjuu\.com)/);
    }
  }
});

test('core guide answers precede expandable evidence with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: test.info().project.use.baseURL });
  try {
    const page = await context.newPage();
    for (const locale of ['ja', 'zh-hans']) {
      for (const topic of ['requirements', 'reroll', 'banner-rules', 'resources']) {
        await page.goto(`/${locale}/guides/${topic}/`);
        const evidence = page.locator('#claim-summary-details');
        await expect(evidence).not.toHaveAttribute('open');
        await expect(page.locator('.prose h2').first()).toBeVisible();
        await evidence.locator('summary').click();
        await expect(evidence).toHaveAttribute('open', '');
        await expect(evidence.locator('#claim-summary-title')).toBeVisible();
      }
    }
  } finally { await context.close(); }
});

test('absolute schedules and regional links remain useful with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: test.info().project.use.baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/editorial/fixtures/trust/');
    await expect(page.locator('[data-launch-region="cn"] time')).toContainText('UTC+8');
    await expect(page.locator('[data-copy-target]')).toBeDisabled();
    await page.goto('/zh-hans/');
    await expect(page.locator('[data-launch-region="cn"] time[datetime="2026-11-26T10:00:00+08:00"]')).toHaveText('2026-11-26 10:00 (UTC+8)');
    await expect(page.locator('[data-launch-region="cn"] time[datetime="2026-11-24T15:00:00+08:00"]')).toHaveText('2026-11-24 15:00 (UTC+8)');
    await page.locator('[data-launch-region="jp"] a').click();
    await expect(page.locator('[data-channel]')).toHaveCount(6);
    await expect(page.locator('[data-channel="jp-ios"] .distribution-action')).toHaveAttribute('href', 'https://azurpromilia.jp/');
  } finally { await context.close(); }
});
