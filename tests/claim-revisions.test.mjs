import test from 'node:test';
import assert from 'node:assert/strict';
import { selectClaimRevisions } from '../src/lib/claim-revisions.mjs';
import { readEditorialData } from '../scripts/editorial-data.mjs';
import { regionalReleaseState } from '../src/lib/release-state.mjs';
import { distributionRows } from '../src/lib/distribution.mjs';
import { readFile } from 'node:fs/promises';

test('pending shared facts stay out of production and replace the same facts in preview without mutation', () => {
  const approved = [{ id: 'date', revision: 1, value: {} }, { id: 'other', revision: 1 }];
  const revisions = [{ id: 'date', revision: 2, value: { time: '11:00' } }];
  const original = structuredClone(approved);
  assert.equal(selectClaimRevisions(approved, revisions), approved);
  assert.deepEqual(selectClaimRevisions(approved, revisions, true), [revisions[0], approved[1]]);
  assert.deepEqual(approved, original);
});

test('unknown, duplicate and non-increasing staged facts fail in both modes', () => {
  const approved = [{ id: 'date', revision: 3 }];
  for (const preview of [false, true]) {
    assert.throws(() => selectClaimRevisions(approved, [{ id: 'unknown', revision: 4 }], preview), /Unknown/);
    assert.throws(() => selectClaimRevisions(approved, [{ id: 'date', revision: 4 }, { id: 'date', revision: 5 }], preview), /Duplicate/);
    for (const revision of [2, 3, 3.5]) assert.throws(() => selectClaimRevisions(approved, [{ id: 'date', revision }], preview), /newer/);
  }
});

test('published FAQ opening times agree across build modes and never certify an open server', async () => {
  const approved = await readEditorialData({ preview: false });
  const preview = await readEditorialData({ preview: true });
  for (const [region, time, timeZone] of [['cn', '10:00', 'Asia/Shanghai'], ['jp', '11:00', 'Asia/Tokyo']]) {
    const published = approved.claims.find(claim => claim.id === `${region}-opening-time`);
    const staged = preview.claims.find(claim => claim.id === `${region}-opening-time`);
    assert.equal(published.verification, 'verified');
    assert.deepEqual(published, staged);
    assert.equal(staged.verification, 'verified');
    assert.deepEqual(staged.value, { date: '2026-11-26', time, timeZone });
    assert.equal(regionalReleaseState({ ...preview, region, now: new Date('2026-11-26T02:00:00Z') }).stage, 'awaiting-confirmation');
    assert.equal(regionalReleaseState({ ...approved, region, now: new Date('2026-11-26T02:00:00Z') }).stage, 'awaiting-confirmation');
  }
});

test('published preload exposes the verified PC page in both modes and fails closed when evidence is lost', async () => {
  const approved = await readEditorialData({ preview: false });
  const preview = await readEditorialData({ preview: true });
  const channels = JSON.parse(await readFile('src/data/distribution.json', 'utf8'));
  const rows = (data) => distributionRows({ ...data, channels, locale: 'ja' });
  assert.equal(rows(approved).find(row => row.id === 'jp-pc').entryUrl, 'https://azurpromilia.jp/PCdownload');
  assert.equal(rows(preview).find(row => row.id === 'jp-pc').entryUrl, 'https://azurpromilia.jp/PCdownload');
  assert.equal(rows(preview).find(row => row.id === 'jp-android').entryUrl, 'https://azurpromilia.jp/');
  assert.equal(rows(preview).find(row => row.id === 'cn-pc').entryUrl, null);
  assert.equal(regionalReleaseState({ ...approved, region: 'jp' }).preloadAnnounced, true);
  assert.equal(regionalReleaseState({ ...preview, region: 'jp' }).preloadAnnounced, true);
  const lost = { ...preview, sources: preview.sources.map(source => source.id === 'jp-pc-download-page-2026-11-24' ? { ...source, status: 'unavailable' } : source) };
  assert.equal(rows(lost).find(row => row.id === 'jp-pc').entryUrl, null);
  const unannounced = { ...preview, sources: preview.sources.map(source => source.id === 'jp-preload-open-2026-11-24' ? { ...source, status: 'unavailable' } : source) };
  assert.equal(regionalReleaseState({ ...unannounced, region: 'jp', now: new Date('2026-11-25T00:00:00Z') }).preloadAnnounced, false);
});
