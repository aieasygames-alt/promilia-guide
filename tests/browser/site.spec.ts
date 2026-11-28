import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

// Compare the dashboard/export with the current report rather than a past review milestone.
const editorialStatus = JSON.parse(execFileSync(process.execPath, ['scripts/content-report.mjs', 'status', '--json'], { encoding: 'utf8' }));
const impactCount = (args: string[]) => JSON.parse(execFileSync(process.execPath, ['scripts/content-report.mjs', 'impact', ...args, '--json'], { encoding: 'utf8' })).articles.length;
const releaseStatus = JSON.parse(execFileSync(process.execPath, ['scripts/check-release.mjs', '--json'], { encoding: 'utf8' }));

async function expectEvidence(page: Page, ids: string[]) {
  const links = await page.locator('[data-evidence-channels]:visible > a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  expect(links.sort()).toEqual(ids.map(id => `#source-${id}`).sort());
  expect(new Set(links).size).toBe(links.length);
}

test('home renders, mobile navigation works, and layout fits viewport', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/zh-hans/');
  await expect(page.locator('h1')).toContainText('每一步都有方向');
  await expect(page.locator('.brand-logo')).toHaveAttribute('src', '/images/logo-wordmark.webp');
  await expect(page.locator('.brand-logo')).toHaveAttribute('alt', '蓝色星原：旅谣（Azur Promilia）');
  await expect(page.locator('.footer-logo')).toHaveAttribute('src', '/images/logo-wordmark.webp');
  await expect(page.locator('.hero-visual > img')).toHaveAttribute('src', '/images/feature/home-world.webp');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (isMobile) {
    await page.locator('.mobile-menu summary').click();
    await page.locator('.mobile-menu nav').getByRole('link', { name: '开荒攻略' }).click();
  } else await page.locator('.desktop-nav').getByRole('link', { name: '开荒攻略' }).click();
  await expect(page).toHaveURL(/\/zh-hans\/guides\//);
  expect(errors).toEqual([]);
});

test('checklist survives reload and preserves tasks across corresponding languages', async ({ page }) => {
  await page.goto('/zh-hans/guides/getting-started/');
  const task = page.locator('[data-task="device"]');
  await task.check();
  await expect(page.locator('.checklist-count')).toContainText('1 / 6');
  await page.reload();
  await expect(task).toBeChecked();
  await page.locator('.language-button').click();
  await expect(page).toHaveURL(/\/ja\/guides\/getting-started\//);
  await expect(task).toBeChecked();
  await page.getByRole('button', { name: '進捗をリセット' }).click();
  await expect(task).not.toBeChecked();
});

test('launch questions lead to existing answers and support FAQ reaches troubleshooting', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja']) {
    await page.goto(`/${locale}/`);
    const links = page.locator('.launch-answers a');
    await expect(links).toHaveCount(7);
    const paths = await links.evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
    expect(paths).toEqual(['download', 'requirements', 'resources', 'banner-rules', 'reroll', 'redeem-codes', 'support'].map(id => `/${locale}/guides/${id}/`));
    await links.last().click();
    await expect(page.locator('h1')).toContainText(locale === 'ja' ? 'ログイン' : '登录');
    await page.goto(`/${locale}/faq/#q-support`);
    const answer = page.locator('#q-support');
    await expect(answer).toHaveAttribute('data-answer-current', 'true');
    await expect(answer.locator('a')).toHaveAttribute('href', `/${locale}/guides/support/`);
    await expect(answer.locator('p')).toBeVisible();
  }
});

test('announced China banner characters connect catalogs to the exact rules section', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja']) {
    for (const path of ['characters', 'database']) {
      await page.goto(`/${locale}/${path}/`);
      const roster = page.locator('[data-banner-characters]');
      await expect(roster).toContainText('涂山小玉');
      await expect(roster).toContainText('枫糖');
      await expect(roster).toContainText('艾妮丝');
      await expect(roster).toContainText(locale === 'ja' ? '日本版の名称・開催予定を示しません' : '国服');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await roster.locator('.banner-links a').first().click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/guides/banner-rules/#`));
      const target = await page.evaluate(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.textContent);
      expect(target).toContain(locale === 'ja' ? '中国本土' : '当期卡池');
    }
  }
});

test('both languages fit narrow phones and tablet widths', async ({ page }) => {
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ['zh-hans', 'ja']) {
      for (const path of ['', 'guides/resources/', 'guides/banner-rules/', 'guides/getting-started/', 'systems/home/', 'systems/kibo/']) {
        await page.goto(`/${locale}/${path}`);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale}/${path} at ${width}px`).toBe(true);
      }
    }
  }
});

test('missing translation goes to explicit target language home', async ({ page }) => {
  await page.goto('/editorial/fixtures/trust/');
  const language = page.locator('.language-button');
  await expect(language).toHaveAttribute('aria-label', /暂无对应译文/);
  await expect(language).toHaveAttribute('href', '/ja/');
  await language.click();
  await expect(page).toHaveURL(/\/ja\/$/);
});

test('combat guide helps troubleshoot skill input and links from home', async ({ page }) => {
  for (const [locale, title] of [['zh-hans', '战斗与开荒配队'], ['ja', '戦闘ガイド']]) {
    await page.goto(`/${locale}/systems/combat/`);
    await expect(page.locator('h1')).toContainText(title);
    await expect(page.locator('.prose')).toContainText(locale === 'ja' ? 'スキルが発動しない' : '技能按了没反应');
    await expect(page.locator('[data-checklist="combat"] input')).toHaveCount(5);
    await page.goto(`/${locale}/`);
    await expect(page.locator('.toolkit-grid a').nth(2)).toHaveAttribute('href', `/${locale}/systems/combat/`);
  }
});

test('official character and kibo catalogs render bilingual source-backed entries', async ({ page }) => {
  for (const [locale, characterNames, kiboNames] of [
    ['zh-hans', ['艾妮丝', '姬瑟贝露', '西夫未瑟', '忒拉拉'], ['星鳐', '绒心布里尼', '菜鸡', '布鲁达', '怯影之翼']],
    ['ja', ['アニス', 'キャスベル', 'シンフォーリア', 'テララ'], ['メテオール', 'モフリーネ', 'キャバード', 'ブルーダ', 'ナイトフォール']],
  ] as const) {
    await page.goto(`/${locale}/characters/`);
    const characters = page.locator('[data-entity-catalog="character"] [data-entity-id]');
    await expect(characters).toHaveCount(6);
    await expect(characters.locator('.entity-image')).toHaveCount(6);
    await expect(characters.first().locator('.entity-image')).toHaveAttribute('alt', new RegExp(characterNames[0]));
    await expect(page.locator('[data-entity-catalog="character"]')).toContainText(characterNames[0]);
    await expect(page.locator('[data-entity-catalog="character"]')).toContainText(characterNames[3]);
    await expect(page.locator('.entity-card').first().locator('.entity-card-footer a')).toHaveAttribute('href', locale === 'ja' ? 'https://azurpromilia.jp/character' : 'https://azurpromilia.manjuu.com/home/');

    await page.goto(`/${locale}/kibo/`);
    const kibo = page.locator('[data-entity-catalog="kibo"] [data-entity-id]');
    await expect(kibo).toHaveCount(5);
    await expect(kibo.locator('.entity-image')).toHaveCount(5);
    await expect(kibo.first().locator('.entity-image')).toHaveAttribute('alt', new RegExp(kiboNames[0]));
    await expect(page.locator('[data-entity-catalog="kibo"]')).toContainText(kiboNames[0]);
    await expect(page.locator('[data-entity-catalog="kibo"]')).toContainText(kiboNames[4]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('provided feature visuals appear on the intended bilingual pages', async ({ page }) => {
  for (const [locale, betaAlt, kiboAlt] of [
    ['zh-hans', '蓝色星原', '蓝色星原'],
    ['ja', 'アズールプロミリア', 'アズールプロミリア'],
  ] as const) {
    await page.goto(`/${locale}/guides/launch/`);
    await expect(page.locator('[data-visual-id="public-beta"] img')).toHaveAttribute('src', '/images/feature/public-beta.webp');
    await expect(page.locator('[data-visual-id="public-beta"] img')).toHaveAttribute('alt', new RegExp(betaAlt));
    await expect(page.locator('[data-visual-id="public-beta"] figcaption')).toContainText(locale === 'ja' ? 'ユーザー提供素材' : '用户提供素材');

    await page.goto(`/${locale}/kibo/`);
    await expect(page.locator('[data-visual-id="kibo-showcase"] img')).toHaveAttribute('src', '/images/feature/kibo-showcase.webp');
    await expect(page.locator('[data-visual-id="kibo-showcase"] img')).toHaveAttribute('alt', new RegExp(kiboAlt));
  }
});

test('Pagefind searches Chinese, Japanese and aliases within the current locale', async ({ page }) => {
  for (const [locale, query] of [['zh-hans', '设备'], ['ja', '端末'], ['zh-hans', '藍色星原'], ['ja', 'アズールプロミリア'], ['zh-hans', 'azure promilia']]) {
    await page.goto(`/${locale}/search/?q=${encodeURIComponent(query)}`);
    await expect(page.locator('.search-result').first()).toBeVisible({ timeout: 15000 });
    const links = await page.locator('.search-result h2 a').evaluateAll((elements) => elements.map((element) => element.getAttribute('href')));
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((link) => link?.startsWith(`/${locale}/`))).toBe(true);
  }
});

test('unknown route returns HTTP 404 and preview pages cannot be indexed', async ({ page, request }) => {
  const response = await request.get('/does-not-exist/');
  expect(response.status()).toBe(404);
  await page.goto('/ja/guides/download/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('feedback download contains the report and makes no submission', async ({ page }) => {
  await page.goto('/zh-hans/contact/?page=%2Fzh-hans%2Fguides%2Flaunch%2F');
  await expect(page.locator('[name="page"]')).toHaveValue('/zh-hans/guides/launch/');
  await page.locator('[name="body"]').fill('测试纠错：需要补充原始公告与适用地区。');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载文本' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('promilia-guide-feedback.txt');
  await expect(page.locator('.feedback-actions [role="status"]')).toContainText('尚未发送');
});

test('home and article share verified regional facts and dated original citations', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja']) {
    await page.goto(`/${locale}/`);
    const status = page.locator('[data-release-claim="cn-service-status"]');
    await expect(status).toHaveAttribute('data-release-revision', '1');
    await expect(status).toHaveAttribute('data-release-verified', 'true');
    await expect(status.locator('a')).toHaveAttribute('href', 'https://azurpromilia.manjuu.com/home/news/detail/912762865511960576');
    const japan = page.locator('[data-release-claim="jp-service-status"]');
    await expect(japan).toHaveAttribute('data-release-revision', '1');
    await expect(japan).toHaveAttribute('data-release-verified', 'true');
    await expect(japan).toContainText(/日本/);
    await expect(japan.locator('a')).toHaveAttribute('href', 'https://azurpromilia.jp/news/5225');
    await page.goto(`/${locale}/guides/global-release/`);
    for (const region of ['cn', 'jp']) {
      await expect(page.locator(`[data-claim-id="${region}-service-status"]`)).toHaveAttribute('data-claim-verified', 'true');
      await expect(page.locator(`[data-claim-id="${region}-service-status"]`)).toHaveAttribute('data-claim-revision', '1');
    }
    await page.goto(`/${locale}/guides/launch/`);
    await expect(page.locator('[data-claim-id="cn-launch-date"]')).toHaveAttribute('data-claim-revision', '2');
    await expect(page.locator('[data-claim-id="cn-opening-time"]')).toHaveAttribute('data-claim-verified', 'true');
    await expect(page.locator('[data-claim-id="cn-opening-time"]')).toHaveAttribute('data-claim-revision', '4');
    await expect(page.locator('[data-claim-id="jp-opening-time"]')).toHaveAttribute('data-claim-verified', 'true');
    await expect(page.locator('[data-claim-id="jp-opening-time"]')).toHaveAttribute('data-claim-revision', '2');
    await expect(page.locator('[data-claim-id="jp-release-status"]')).toHaveAttribute('data-claim-revision', '2');
    await expect(page.locator('[data-claim-id="jp-release-status"]')).toHaveAttribute('data-claim-verified', 'true');
    await expect(page.locator('#source-jp-launch-announcement-2026-10-23')).toContainText('2026-10-23');
    await expect(page.locator('#source-cn-launch-announcement-2026-10-23')).toContainText('2026-10-23');
    await expect(page.locator('#source-cn-launch-announcement-2026-10-23')).toContainText('2026-11-14');
    await page.setViewportSize({ width: 320, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('editorial preview filters bilingual impact and exports a local report', async ({ page }) => {
  await page.goto('/editorial/');
  await expect(page.locator('h1')).toHaveText('内容审核工作台');
  await expect(page.locator('body')).toHaveAttribute('data-pagefind-ignore', 'all');
  await expect(page.locator('[data-report-row]:visible')).toHaveCount(editorialStatus.summary.articles);
  await page.locator('#impact-filter').selectOption('claim:cn-launch-date');
  await expect(page.locator('[data-report-row]:visible')).toHaveCount(impactCount(['--claim', 'cn-launch-date']));
  const routes = await page.locator('[data-report-row]:visible').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-route')));
  expect(routes.some((route) => route?.startsWith('/ja/'))).toBe(true);
  expect(routes.some((route) => route?.startsWith('/zh-hans/'))).toBe(true);
  await page.locator('#impact-filter').selectOption('source:cn-app-store-2026-11-14');
  await expect(page.locator('[data-report-row]:visible')).toHaveCount(impactCount(['--source', 'cn-app-store-2026-11-14']));
  await page.locator('#impact-filter').selectOption('content:launch');
  await expect(page.locator('[data-report-row]:visible')).toHaveCount(2);
  await page.locator('#state-filter').selectOption('publishable');
  const publishedLaunch = editorialStatus.articles.filter((article: { contentId: string; publishable: boolean }) => article.contentId === 'launch' && article.publishable).length;
  await expect(page.locator('[data-report-row]:visible')).toHaveCount(publishedLaunch);
  await expect(page.locator('#filtered-count')).toHaveText(`显示 ${publishedLaunch} 篇稿件`);
  await page.locator('#state-filter').selectOption('review');
  const unreviewedLaunch = editorialStatus.articles.filter((article: { contentId: string; blockers: { code: string }[] }) => article.contentId === 'launch' && article.blockers.some(issue => issue.code === 'manual-review')).length;
  await expect(page.locator('[data-report-row]:visible')).toHaveCount(unreviewedLaunch);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载状态报告' }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toMatch(/^promilia-editorial-status-\d{4}-\d{2}-\d{2}\.json$/);
  const result = JSON.parse(await readFile((await download.path())!, 'utf8'));
  expect(result.summary).toEqual(editorialStatus.summary);
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('distribution filters keep unverified and historical clients out of actionable links', async ({ page }) => {
  for (const locale of ['zh-hans', 'ja']) {
    await page.goto(`/${locale}/guides/download/`);
    const matrix = page.locator('[data-distribution]');
    await expect(matrix.locator('[data-channel]:visible')).toHaveCount(3);
    await matrix.locator('[data-region-filter]').selectOption('cn');
    await matrix.locator('[data-platform-filter]').selectOption('ios');
    await expect(matrix.locator('[data-channel]:visible')).toHaveCount(1);
    await expect(matrix.locator('[data-channel="cn-ios"]')).toHaveAttribute('data-stage', 'preload');
    await expect(matrix.locator('[data-channel="cn-ios"] [data-preload-schedule] time')).toHaveAttribute('datetime', '2026-11-24T15:00:00+08:00');
    await expect(matrix.locator('[data-channel="cn-ios"] [data-preload-schedule] a')).toHaveCount(1);
    await expect(matrix.locator('[data-channel="cn-ios"] .distribution-action')).toHaveAttribute('href', /apps\.apple\.com\/cn\//);
    await matrix.locator('[data-platform-filter]').selectOption('android');
    await expect(matrix.locator('[data-channel]:visible')).toHaveCount(1);
    await expect(matrix.locator('[data-channel="cn-android"] .distribution-action')).toHaveCount(0);
    await expect(matrix.locator('[data-channel="cn-android"] [data-preload-schedule] time')).toContainText('2026-11-24 15:00');
    await expect(matrix.locator('[data-channel="cn-android"] [data-preload-schedule] a')).toHaveCount(1);
    await matrix.locator('[data-region-filter]').selectOption('jp');
    await expect(matrix.locator('[data-channel="jp-android"]')).toBeVisible();
    await expect(matrix.locator('[data-channel="jp-android"] time[datetime="2026-11-26T11:00:00+09:00"]')).toContainText('2026-11-26 11:00');
    await expect(matrix.locator('[data-channel="jp-android"] [data-preload-schedule] time')).toContainText('2026-11-24 16:00');
    await expect(matrix.locator('[data-channel="jp-android"] [data-preload-schedule] a')).toHaveCount(1);
    await expect(matrix.locator('[data-channel="jp-android"]')).toHaveAttribute('data-stage', 'preload');
    await expect(matrix.locator('[data-channel="jp-android"] .distribution-action')).toHaveAttribute('href', 'https://azurpromilia.jp/');
    await matrix.locator('[data-platform-filter]').selectOption('pc');
    await expect(matrix.locator('[data-channel="jp-pc"] .distribution-action')).toHaveAttribute('href', 'https://azurpromilia.jp/PCdownload');
    await matrix.locator('[data-platform-filter]').selectOption('ios');
    await expect(matrix.locator('[data-channel="jp-ios"] .distribution-action')).toHaveAttribute('href', 'https://azurpromilia.jp/');
    await expect(matrix.locator('[data-channel="jp-ios"] dl')).not.toContainText('iOS 15.0');
    await expect(page.locator('#source-jp-publishing-2025-12-15')).toContainText('2025-12-15');
    await expect(page.locator('#source-cn-test-ended-2026-10-07')).toContainText('2026-10-07');
    await page.setViewportSize({ width: 320, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('distribution facts and links are available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: test.info().project.use.baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/zh-hans/guides/platforms/');
    await expect(page.locator('[data-channel]')).toHaveCount(6);
    await expect(page.locator('[data-distribution-controls]')).toBeHidden();
    await expect(page.locator('[data-channel="cn-ios"] .distribution-action')).toHaveAttribute('href', /apps\.apple\.com/);
    await page.locator('[data-distribution-evidence] summary').click();
    await expectEvidence(page, ["cn-launch-announcement-2026-10-23","cn-launch-faq-2026-11-24","cn-preload-open-2026-11-24","cn-download-home-followup-2026-11-24","cn-app-store-2026-11-14","cn-ios-store-followup-2026-11-24","jp-launch-announcement-2026-10-23","jp-launch-faq-2026-11-24","jp-preload-open-2026-11-24","jp-pc-download-page-2026-11-24","jp-distribution-home-2026-11-24"]);
    await expect(page.locator('[data-channel="jp-ios"] .distribution-action')).toHaveAttribute('href', 'https://azurpromilia.jp/');
    await expect(page.locator('[data-channel="jp-pc"] .distribution-action')).toHaveAttribute('href', 'https://azurpromilia.jp/PCdownload');
    await page.setViewportSize({ width: 320, height: 900 });
    await page.locator('[data-mobile-toc] summary').click();
    await expect(page.locator('[data-mobile-toc] a[href="#distribution-title"]')).toBeVisible();
  } finally { await context.close(); }
});

test('first release dashboard reflects current review state and exports readiness', async ({ page }) => {
  await page.goto('/editorial/#release-readiness');
  await expect(page.locator('[data-release-ready]')).toHaveAttribute('data-release-ready', String(releaseStatus.ready));
  await expect(page.locator('[data-release-count]')).toHaveText(`${releaseStatus.summary.ready} / ${releaseStatus.summary.required}`);
  await expect(page.locator('[data-release-article]')).toHaveCount(releaseStatus.summary.required);
  const row = page.locator('[data-release-article="launch:ja"]');
  await row.locator('summary').click();
  const launch = releaseStatus.articles.find((article: { contentId: string; locale: string }) => article.contentId === 'launch' && article.locale === 'ja');
  if (launch.blockers.some((issue: { code: string }) => issue.code === 'manual-review')) await expect(row).toContainText('缺少真实审核人与审核日期');
  else await expect(row).not.toContainText('缺少真实审核人与审核日期');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载首发报告' }).click();
  const download = await pending;
  const report = JSON.parse(await readFile((await download.path())!, 'utf8'));
  expect(report.summary).toEqual(releaseStatus.summary);
  expect(report.validationIssues).toEqual([]);
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('distribution selection survives reload and language switching with deduplicated evidence', async ({ page }) => {
  await page.goto('/zh-hans/guides/download/?region=cn&platform=ios#distribution-title');
  await expect(page.locator('[data-channel]:visible')).toHaveCount(1);
  await page.locator('[data-distribution-evidence] summary').click();
  await expectEvidence(page, ["cn-launch-announcement-2026-10-23","cn-app-store-2026-11-14","cn-launch-faq-2026-11-24","cn-preload-open-2026-11-24","cn-ios-store-followup-2026-11-24"]);
  await expect(page.locator('.distribution-card .distribution-evidence')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('[data-platform-filter]')).toHaveValue('ios');
  await page.locator('.language-button').click();
  await expect(page).toHaveURL(/\/ja\/guides\/download\/\?region=cn&platform=ios#distribution-title$/);
  await expect(page.locator('[data-channel]:visible')).toHaveCount(1);
  await page.locator('[data-region-filter]').selectOption('jp');
  await expect(page).toHaveURL(/region=jp&platform=ios/);
  await page.locator('[data-distribution-evidence] summary').click();
  await expectEvidence(page, ["jp-launch-announcement-2026-10-23","jp-launch-faq-2026-11-24","jp-distribution-home-2026-11-24","jp-preload-open-2026-11-24"]);
  await expect(page.locator('[data-no-evidence]')).toBeHidden();
  await page.goto('/zh-hans/guides/download/?region=unknown&platform=invalid');
  await expect(page.locator('[data-region-filter]')).toHaveValue('cn');
  await expect(page.locator('[data-platform-filter]')).toHaveValue('all');
});

test('narrow article navigation collapses after a jump and leaves the target below the header', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const locale of ['zh-hans', 'ja']) {
    await page.goto(`/${locale}/guides/download/`);
    const toc = page.locator('[data-mobile-toc]');
    await expect(toc).not.toHaveAttribute('open', '');
    await toc.locator('summary').click();
    await toc.locator('a[href="#distribution-title"]').click();
    await expect(page).toHaveURL(/#distribution-title$/);
    await expect(toc).not.toHaveAttribute('open', '');
    await expect(page.locator('#distribution-title')).toBeFocused();
    await expect.poll(async () => page.locator('#distribution-title').evaluate((node) => node.getBoundingClientRect().top)).toBeGreaterThanOrEqual(72);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('lightweight UI enhancements: homepage quick navigation, catalog filters, callouts, and mobile bar', async ({ page }) => {
  await page.goto('/zh-hans/');
  const quickCards = page.locator('.quick-nav-card');
  await expect(quickCards).toHaveCount(4);
  await expect(quickCards.nth(0)).toHaveAttribute('href', '/zh-hans/guides/launch/');
  await expect(quickCards.nth(1)).toHaveAttribute('href', '/zh-hans/guides/download/');
  await expect(quickCards.nth(2)).toHaveAttribute('href', '/zh-hans/guides/getting-started/');
  await expect(quickCards.nth(3)).toHaveAttribute('href', '/zh-hans/characters/');

  await page.goto('/zh-hans/characters/');
  const filterTabs = page.locator('.entity-filter-tab');
  await expect(filterTabs).toHaveCount(5);
  await filterTabs.filter({ hasText: '弗利斯' }).click();
  await expect(page.locator('.entity-card:visible')).toHaveCount(2);
  await filterTabs.filter({ hasText: '全部' }).click();
  await expect(page.locator('.entity-card:visible')).toHaveCount(6);

  await page.goto('/zh-hans/guides/redeem-codes/');
  await expect(page.locator('[data-announced-code="AZPR1126"]')).toBeVisible();
  await expect(page.locator('[data-code-empty]')).toHaveCount(0);
  await expect(page.locator('[data-copy-target]')).toHaveCount(0);

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/zh-hans/guides/redeem-codes/');
  await expect(page.locator('.mobile-action-bar')).toBeVisible();
  await expect(page.locator('#mobile-top-btn')).toBeVisible();
  await expect(page.locator('#mobile-share-btn')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
