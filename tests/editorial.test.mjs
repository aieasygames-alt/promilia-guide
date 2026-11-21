import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { isPublishable, publicationIssues, isVerifiedClaim, releaseSummary, findContentImpact, createEditorialReport, beijingDate } from '../src/lib/editorial.mjs';
import { sourceSchema, claimSchema, calendarDate } from '../src/lib/editorial-schema.mjs';

const sources = [JSON.parse(await readFile('src/data/sources.json', 'utf8'))[1]];
const claim = JSON.parse(await readFile('src/data/claims.json', 'utf8'))[0];
const base = { contentId: 'launch', locale: 'zh-hans', section: 'guides', slug: 'launch', title: '日期核验', status: 'published', translationStatus: 'published', reviewer: 'Fixture reviewer', reviewedAt: '2026-11-14', sourceRevision: 2, sourceRefs: [sources[0].id], claimRefs: [claim.id], claimRevisions: { [claim.id]: claim.revision }, verification: 'official' };
const translated = { ...base, locale: 'ja', translatedFromRevision: 2 };
const wrap = (data) => ({ data, path: `${data.locale}/launch.md` });
const context = { entries: [wrap(base), wrap(translated)], sources, claims: [claim] };

test('fact revisions block reviewed content until the body is rechecked', () => {
  assert.equal(isPublishable(base, context), true);
  const updated = { ...context, claims: [{ ...claim, revision: claim.revision + 1 }] };
  assert.equal(isPublishable(base, updated), false);
  assert.ok(publicationIssues(base, updated).some((issue) => issue.code === 'stale-claim'));
  assert.equal(isPublishable({ ...base, claimRevisions: { [claim.id]: claim.revision + 1 } }, updated), true);
});

test('self-consistent old translation cannot publish behind the current source', () => {
  const stale = { ...translated, sourceRevision: 1, translatedFromRevision: 1 };
  const updated = { ...context, entries: [wrap(base), wrap(stale)] };
  assert.equal(isPublishable(stale, updated), false);
  assert.ok(publicationIssues(stale, updated).some((issue) => issue.code === 'stale-translation'));
});

test('lost or nonofficial evidence invalidates a verified fact and publication', () => {
  for (const change of [{ status: 'unavailable' }, { kind: 'project' }, { kind: 'community' }, { excerpt: undefined }, { url: 'http://example.com/' }]) {
    const evidence = [{ ...sources[0], ...change }];
    assert.equal(isVerifiedClaim(claim, evidence), false);
    assert.equal(isPublishable(base, { ...context, sources: evidence }), false);
  }
  assert.equal(isPublishable({ ...base, claimRefs: [], claimRevisions: {} }, { ...context, sources: [{ ...sources[0], kind: 'community' }] }), false);
});

test('schemas reject actionable unverified claims, project evidence and impossible dates', () => {
  assert.equal(claimSchema.safeParse({ ...claim, verification: 'pending' }).success, false);
  assert.equal(claimSchema.safeParse({ ...claim, conflicts: ['Unresolved conflict'] }).success, false);
  assert.equal(sourceSchema.safeParse({ ...sources[0], kind: 'project' }).success, false);
  assert.equal(sourceSchema.safeParse({ ...sources[0], excerpt: '' }).success, false);
  assert.equal(calendarDate.safeParse('2026-02-30').success, false);
});

test('both locales use the same date and fail closed when its evidence is unavailable', () => {
  for (const locale of ['zh-hans', 'ja']) {
    const result = releaseSummary({ ...context, locale, asOf: '2026-11-14' });
    assert.equal(result.date, '2026-11-26');
    assert.equal(result.source.url, sources[0].url);
    const missing = releaseSummary({ ...context, sources: [], locale });
    assert.equal(missing.verified, false);
    assert.equal(missing.date, null);
    assert.equal(missing.source, null);
    const reached = releaseSummary({ ...context, locale, asOf: '2026-11-26' });
    assert.match(reached.label, /待核验|確認中/);
  }
  assert.equal(beijingDate(new Date('2026-11-13T16:01:00Z')), '2026-11-14');
});

test('Japanese and Chinese schedules use independent evidence without region fallback', () => {
  const jpSource = { ...sources[0], id: 'jp-original', url: 'https://example.com/jp-announcement' };
  const jpClaim = { ...claim, id: 'jp-release-status', revision: 2, sourceRefs: [jpSource.id], value: { date: '2026-12-03' }, distributionScope: { region: 'jp', release: 'public-launch' } };
  const input = { sources: [...sources, jpSource], claims: [claim, jpClaim], asOf: '2026-11-14' };
  for (const locale of ['zh-hans', 'ja']) {
    const result = releaseSummary({ ...input, locale, region: 'jp' });
    assert.equal(result.date, '2026-12-03');
    assert.equal(result.source.id, jpSource.id);
    assert.equal(result.claimId, 'jp-release-status');
    assert.equal(releaseSummary({ ...input, locale, region: 'cn' }).date, '2026-11-26');
    const missing = releaseSummary({ ...input, sources, locale, region: 'jp' });
    assert.equal(missing.date, null);
    assert.equal(missing.source, null);
    const mismatched = releaseSummary({ ...input, claims: [claim, { ...jpClaim, distributionScope: claim.distributionScope }], locale, region: 'jp' });
    assert.equal(mismatched.verified, false);
    assert.equal(mismatched.date, null);
    const reached = releaseSummary({ ...input, locale, region: 'jp', asOf: '2026-12-03' });
    assert.match(reached.label, /待核验|確認中/);
  }
});

test('source and fact impact includes both languages even with missing translation linkage', () => {
  const incomplete = { ...context, entries: [wrap(base), wrap({ ...translated, sourceRefs: [], claimRefs: [] })] };
  assert.equal(findContentImpact({ ...incomplete, sourceId: sources[0].id }).articles.length, 2);
  assert.equal(findContentImpact({ ...incomplete, claimId: claim.id }).articles.length, 2);
  const topic = findContentImpact({ ...incomplete, contentId: base.contentId });
  assert.equal(topic.articles.length, 2);
  assert.equal(topic.claims.length, 1);
  assert.equal(createEditorialReport(incomplete).sources[0].affectedArticles.length, 2);
  assert.throws(() => findContentImpact({ ...context, claimId: 'missing' }), /Unknown claim/);
});

test('report CLI emits JSON, rejects invalid IDs and leaves editorial files unchanged', async () => {
  const file = 'src/data/claims.json';
  const before = await readFile(file, 'utf8');
  const status = JSON.parse(execFileSync(process.execPath, ['scripts/content-report.mjs', 'status', '--json', '--at', '2026-11-14'], { encoding: 'utf8' }));
  assert.equal(status.summary.articles, 22);
  assert.equal(status.summary.publishable, 22);
  assert.equal(status.articles.filter(article => article.blockers.some(issue => issue.code === 'manual-review')).length, 0);
  const impact = JSON.parse(execFileSync(process.execPath, ['scripts/content-report.mjs', 'impact', '--claim', claim.id, '--json'], { encoding: 'utf8' }));
  assert.ok(impact.articles.some((article) => article.locale === 'ja'));
  const invalid = spawnSync(process.execPath, ['scripts/content-report.mjs', 'impact', '--claim', 'missing', '--json'], { encoding: 'utf8' });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /Unknown claim/);
  assert.equal(await readFile(file, 'utf8'), before);
});
