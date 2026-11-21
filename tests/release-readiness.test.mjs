import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createReleaseReport, releasePlanSchema, releaseGateIssues } from '../src/lib/release-readiness.mjs';
import { readEntries } from '../scripts/content-validation.mjs';

const plan = { id: 'fixture-release', title: 'Fixture release', locales: ['zh-hans', 'ja'], topics: [{ contentId: 'launch', label: '日期', requiredClaims: ['date'] }] };
const source = { id: 'original', kind: 'official', status: 'verified', url: 'https://example.com/original', checkedAt: '2026-11-14', excerpt: 'Official fixture.' };
const claim = { id: 'date', revision: 1, type: 'official', verification: 'verified', sourceRefs: ['original'], conflicts: [], affectedPages: ['launch'] };
const data = { contentId: 'launch', title: 'Fixture title', locale: 'zh-hans', section: 'guides', slug: 'launch', status: 'published', translationStatus: 'published', reviewer: 'Fixture reviewer', reviewedAt: '2026-11-14', sourceRevision: 2, translatedFromRevision: 2, verification: 'official', sourceRefs: ['original'], claimRefs: ['date'], claimRevisions: { date: 1 } };
const wrap = (patch = {}) => ({ data: { ...data, ...patch }, path: 'fixture.md', body: 'A substantive fixture body.' });
const context = { plan, entries: [wrap(), wrap({ locale: 'ja' })], claims: [claim], sources: [source] };

test('release progress counts required topics in every configured language, rather than all drafts', () => {
  const report = createReleaseReport({ ...context, entries: [...context.entries, wrap({ contentId: 'extra', status: 'draft' })] });
  assert.equal(report.ready, true);
  assert.deepEqual(report.summary, { required: 2, ready: 2, missing: 0, awaitingReview: 0, stale: 0 });
  assert.equal(report.locales[1].ready, 1);
});

test('missing and duplicate translations cannot pass the release gate', () => {
  const missing = createReleaseReport({ ...context, entries: [wrap()] });
  assert.equal(missing.ready, false);
  assert.equal(missing.summary.missing, 1);
  assert.equal(missing.articles[1].url, null);
  const duplicate = createReleaseReport({ ...context, entries: [...context.entries, wrap({ locale: 'ja' })] });
  assert.equal(duplicate.ready, false);
  assert.ok(duplicate.articles[1].blockers.some((issue) => issue.code === 'duplicate-article'));
});

test('review, translation, evidence and body requirements each prevent false readiness', () => {
  const mutations = [
    { reviewer: undefined }, { reviewedAt: undefined }, { status: 'draft' },
    { sourceRevision: 1, translatedFromRevision: 1 },
    { claimRevisions: { date: 2 } }, { claimRefs: [] },
  ];
  for (const patch of mutations) {
    assert.equal(createReleaseReport({ ...context, entries: [wrap(), wrap({ locale: 'ja', ...patch })] }).ready, false);
  }
  assert.equal(createReleaseReport({ ...context, sources: [{ ...source, status: 'unavailable' }] }).ready, false);
  assert.equal(createReleaseReport({ ...context, entries: [{ ...wrap(), body: '' }, wrap({ locale: 'ja' })] }).ready, false);
  const inconsistent = createReleaseReport({ ...context, validationIssues: ['Broken shared content dependency'] });
  assert.equal(inconsistent.ready, false);
  assert.equal(inconsistent.summary.ready, 2);
  assert.equal(inconsistent.validationIssues.length, 1);
});

test('explicit unknown facts remain warnings while missing required references block release', () => {
  const unknown = { ...claim, id: 'unknown', verification: 'pending' };
  const modified = { ...context, claims: [claim, unknown], entries: context.entries.map((entry) => ({ ...entry, data: { ...entry.data, claimRefs: ['date', 'unknown'], claimRevisions: { date: 1, unknown: 1 } } })) };
  const report = createReleaseReport(modified);
  assert.equal(report.ready, true);
  assert.ok(report.articles[0].warnings.some((issue) => issue.code === 'pending-claim'));
  const missing = createReleaseReport({ ...modified, plan: { ...plan, topics: [{ ...plan.topics[0], requiredClaims: ['date', 'missing'] }] } });
  assert.equal(missing.ready, false);
  assert.ok(missing.validationIssues.some((issue) => issue.includes('missing')));
});

test('preview mode cannot pass the release gate even when all fixture articles are reviewed', () => {
  const report = createReleaseReport(context);
  assert.deepEqual(releaseGateIssues(report), []);
  assert.match(releaseGateIssues(report, { preview: true }).join('\n'), /CONTENT_PREVIEW/);
  assert.equal(releasePlanSchema.safeParse({ ...plan, topics: [...plan.topics, ...plan.topics] }).success, false);
  assert.equal(releasePlanSchema.safeParse({ ...plan, locales: ['ja', 'ja'] }).success, false);
});

test('readiness CLI reflects current reviews, enforces the gate, and leaves editorial files unchanged', async () => {
  const file = 'src/content/guides/zh-hans/download.md';
  const before = await readFile(file, 'utf8');
  const report = spawnSync(process.execPath, ['scripts/check-release.mjs', '--json'], { encoding: 'utf8' });
  assert.equal(report.status, 0, report.stderr);
  const result = JSON.parse(report.stdout);
  const currentPlan = JSON.parse(await readFile('src/data/release-plan.json', 'utf8'));
  const requiredEntries = (await readEntries()).filter(({ data }) => currentPlan.locales.includes(data.locale) && currentPlan.topics.some(topic => topic.contentId === data.contentId));
  assert.equal(result.summary.required, currentPlan.locales.length * currentPlan.topics.length);
  assert.equal(result.summary.ready, result.articles.filter(article => article.ready).length);
  assert.equal(result.summary.missing, 0);
  assert.equal(result.summary.awaitingReview, requiredEntries.filter(({ data }) => !data.reviewer?.trim() || !data.reviewedAt).length);
  const productionGate = spawnSync(process.execPath, ['scripts/check-release.mjs', '--require-ready', '--json'], { encoding: 'utf8', env: { ...process.env, CONTENT_PREVIEW: 'false' } });
  assert.equal(productionGate.status, result.ready ? 0 : 1);
  const gate = spawnSync(process.execPath, ['scripts/check-release.mjs', '--require-ready', '--json'], { encoding: 'utf8', env: { ...process.env, CONTENT_PREVIEW: 'true' } });
  assert.equal(gate.status, 1);
  assert.ok(JSON.parse(gate.stdout).gateIssues.some((issue) => issue.includes('CONTENT_PREVIEW')));
  assert.equal(await readFile(file, 'utf8'), before);
});
