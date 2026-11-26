import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readEntries } from '../scripts/content-validation.mjs';
import { readEditorialData } from '../scripts/editorial-data.mjs';
import { guideSchema } from '../src/lib/editorial-schema.mjs';
import { isPublishable, effectiveSourceRefs } from '../src/lib/editorial.mjs';
import { alternateLinks } from '../src/lib/publication.mjs';
import { createReleaseReport, releaseGateIssues } from '../src/lib/release-readiness.mjs';
const entries = (await readEntries()).map(entry => ({ ...entry, data: guideSchema.parse(entry.data) }));
const { sources, claims } = await readEditorialData();
const plan = JSON.parse(await readFile('src/data/english-release-plan.json', 'utf8'));
const english = entries.filter(({ data }) => data.locale === 'en');
const context = { entries, sources, claims };

test('English release requires all planned, substantive guides and localized source provenance', () => {
  assert.deepEqual(english.map(({ data }) => data.contentId).sort(), plan.topics.map(topic => topic.contentId).sort());
  assert.equal(createReleaseReport({ plan, ...context }).ready, true);
  for (const entry of english) {
    assert.ok(entry.body.split(/\s+/).length > 500);
    assert.ok(isPublishable(entry.data, context));
    assert.match(entry.data.reviewer, /publication authorized/);
    for (const id of effectiveSourceRefs(entry.data, claims)) {
      const source = sources.find(source => source.id === id);
      assert.ok(source.localized.en.title && source.localized.en.note && source.localized.en.publisher, id);
    }
    assert.deepEqual(alternateLinks(entries.filter(({ data }) => isPublishable(data, context)), entry.data.contentId).map(link => link.lang).sort(), ['en', 'ja', 'x-default', 'zh-Hans']);
  }
});

test('missing or draft English guide blocks its release without requiring unplanned English topics', () => {
  for (const entry of english) {
    const missing = createReleaseReport({ plan, ...context, entries: entries.filter(item => item !== entry) });
    assert.equal(missing.summary.missing, 1);
    assert.ok(releaseGateIssues(missing).length > 0);
    const draft = createReleaseReport({ plan, ...context, entries: entries.map(item => item === entry ? { ...item, data: { ...item.data, status: 'draft' } } : item) });
    assert.equal(draft.ready, false);
  }
});

test('English guides stop publishing when their Chinese source, shared claim revision or evidence changes', () => {
  for (const { data } of english) {
    const original = entries.find(entry => entry.data.locale === 'zh-hans' && entry.data.contentId === data.contentId);
    assert.equal(isPublishable(data, { ...context, entries: entries.map(item => item === original ? { ...item, data: { ...item.data, sourceRevision: item.data.sourceRevision + 1 } } : item) }), false);
    const id = data.claimRefs.find(id => claims.find(claim => claim.id === id).verification === 'verified');
    const target = claims.find(claim => claim.id === id);
    assert.equal(isPublishable(data, { ...context, claims: claims.map(claim => claim === target ? { ...claim, revision: claim.revision + 1 } : claim) }), false);
    assert.equal(isPublishable(data, { ...context, sources: sources.map(source => source.id === target.sourceRefs[0] ? { ...source, status: 'unavailable' } : source) }), false);
  }
});
