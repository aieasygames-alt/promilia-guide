import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readEntries } from '../scripts/content-validation.mjs';
import { readEditorialData } from '../scripts/editorial-data.mjs';
import { guideSchema } from '../src/lib/editorial-schema.mjs';
import { entities } from '../src/data/entities.ts';
import { entityCategory } from '../src/lib/entity-category.mjs';
import { resolveQuestions, officialAnnouncements } from '../src/lib/content-navigation.mjs';

const groups = JSON.parse(await readFile(new URL('../src/data/faq.json', import.meta.url), 'utf8'));
const entries = (await readEntries()).map(entry => ({ ...entry, data: guideSchema.parse(entry.data) }));
const { sources, claims } = await readEditorialData();
const context = { entries, sources, claims };

test('FAQ entries have unique anchors, both languages, current claim pins and real guide targets', () => {
  const ids = groups.flatMap(group => [group.id, ...group.questions.map(question => `q-${question.id}`)]);
  assert.equal(new Set(ids).size, ids.length);
  for (const locale of ['zh-hans', 'ja']) for (const group of resolveQuestions(groups, locale, context)) {
    assert.ok(group.title[locale]);
    for (const question of group.questions) {
      assert.ok(question.question[locale] && question.answer[locale]);
      assert.ok(question.available, `${locale}/${question.id} has a stale dependency or missing guide`);
      assert.ok(question.href.startsWith(`/${locale}/`));
    }
  }
});

test('FAQ suppresses stale answers when a pinned claim changes or loses its source', () => {
  const question = groups.flatMap(group => group.questions).find(question => question.id === 'opening');
  const fixture = [{ id: 'start', title: {}, questions: [question] }];
  const changed = claims.map(claim => claim.id === 'jp-opening-time' ? { ...claim, revision: claim.revision + 1 } : claim);
  assert.equal(resolveQuestions(fixture, 'ja', { ...context, claims: changed })[0].questions[0].available, false);
  const lost = sources.map(source => source.id === 'jp-launch-faq-2026-11-24' ? { ...source, status: 'unavailable' } : source);
  const result = resolveQuestions(fixture, 'ja', { ...context, sources: lost })[0].questions[0];
  assert.equal(result.available, false);
  assert.equal(result.href, null);
});

test('FAQ cannot route public answers to draft articles or missing translations', () => {
  const fixture = [{ id: 'test', title: {}, questions: [groups[0].questions[1]] }];
  const draft = entries.map(entry => entry.data.locale === 'ja' && entry.data.contentId === 'getting-started' ? { ...entry, data: { ...entry.data, status: 'draft' } } : entry);
  assert.equal(resolveQuestions(fixture, 'ja', { ...context, entries: draft })[0].questions[0].available, false);
  assert.equal(resolveQuestions(fixture, 'ja', { ...context, entries: [] })[0].questions[0].href, null);
});

test('Metsa and Symphoria belong to the same region despite different language spellings', () => {
  assert.equal(entityCategory(entities.find(entity => entity.id === 'metsa')), 'roselansa');
  assert.equal(entityCategory(entities.find(entity => entity.id === 'symphoria')), 'roselansa');
  assert.equal(entityCategory({ kind: 'character', origin: { ja: 'ローズランサ' } }), 'roselansa');
  assert.equal(entityCategory({ kind: 'kibo', classification: { ja: '幻生類' } }), 'phantom');
});

test('announcement feed consolidates repeated URLs and sorts by original publication date', () => {
  const rows = officialAnnouncements([
    { id: 'original', kind: 'official', status: 'verified', url: 'https://example.org/news/1/', publishedAt: '2026-11-20', checkedAt: '2026-11-20' },
    { id: 'recheck', kind: 'official', status: 'verified', url: 'https://example.org/news/1', publishedAt: '2026-11-20', checkedAt: '2026-11-24' },
    { id: 'new', kind: 'official', status: 'verified', url: 'https://example.org/news/2', publishedAt: '2026-11-24', checkedAt: '2026-11-24' },
    { id: 'unavailable', kind: 'official', status: 'unavailable', url: 'https://example.org/news/3', publishedAt: '2026-11-25' },
  ]);
  assert.deepEqual(rows.map(source => source.id), ['new', 'recheck']);
});
