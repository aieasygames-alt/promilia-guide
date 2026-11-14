import test from 'node:test';
import assert from 'node:assert/strict';
import { isPublished, isVisible, alternateLinks, articlePath } from '../src/lib/publication.mjs';
import { validateEntries } from '../scripts/content-validation.mjs';

const base = { contentId: 'preparation', locale: 'zh-hans', section: 'guides', slug: 'preparation', status: 'published', translationStatus: 'published', reviewer: 'Test reviewer', reviewedAt: '2026-11-14', sourceRevision: 2, sourceRefs: ['official'], verification: 'official', related: [] };
const translated = { ...base, locale: 'ja', translatedFromRevision: 2 };
const sources = [{ id: 'official', kind: 'official', url: 'https://example.com/announcement', checkedAt: '2026-11-14', status: 'verified', excerpt: 'Official announcement.' }];
const wrap = (data) => ({ data, path: `${data.locale}/${data.slug}.md` });

test('drafts stay out of production regardless of translation metadata', () => {
  const draft = { ...base, status: 'draft' };
  assert.equal(isPublished(draft), false);
  assert.equal(isVisible(draft), false);
  assert.equal(isVisible(draft, true), true);
});

test('publication requires reviewer and current translation', () => {
  assert.equal(isPublished({ ...base, reviewer: undefined }), false);
  assert.equal(isPublished({ ...base, reviewedAt: undefined }), false);
  assert.equal(isPublished({ ...translated, translatedFromRevision: 1 }), false);
  assert.equal(isPublished({ ...translated, translationStatus: 'needs-update' }), false);
  assert.equal(isPublished(translated), true);
});

test('alternates include self and real translations, with article x-default', () => {
  const links = alternateLinks([wrap(base), wrap(translated)], 'preparation');
  assert.equal(links.length, 3);
  assert.equal(links.find((link) => link.lang === 'x-default').href, 'https://promiliaguide.com/zh-hans/guides/preparation/');
  assert.equal(links.find((link) => link.lang === 'ja').href.endsWith(articlePath(translated)), true);
});

test('missing or obsolete translation does not create an alternate to a homepage', () => {
  const links = alternateLinks([wrap(base), wrap({ ...translated, translationStatus: 'needs-update' })], 'preparation');
  assert.deepEqual(links.map((link) => link.lang), ['zh-Hans', 'x-default']);
  assert.equal(links.some((link) => link.href.endsWith('/ja/')), false);
});

test('cross-file validation rejects stale translation disguised as current', () => {
  const disguised = { ...translated, sourceRevision: 1, translatedFromRevision: 1 };
  assert.equal(isPublished(disguised), true);
  assert.match(validateEntries([wrap(base), wrap(disguised)], sources).join('\n'), /sourceRevision|behind/);
});

test('unresolved sources and invalid related IDs fail content validation', () => {
  const errors = validateEntries([wrap({ ...base, sourceRefs: ['missing'], related: ['unknown'] })], sources);
  assert.match(errors.join('\n'), /Unknown source/);
  assert.match(errors.join('\n'), /Unknown related content/);
});

test('planning documents cannot substantiate a published official fact', () => {
  assert.match(validateEntries([wrap(base)], [{ id: 'official', status: 'planning-only' }]).join('\n'), /verified, dated original/);
});

test('checklist task IDs must match across languages to preserve progress', () => {
  const original = { ...base, checklist: [{ id: 'device', text: '设备' }] };
  const translation = { ...translated, checklist: [{ id: 'another', text: '端末' }] };
  assert.match(validateEntries([wrap(original), wrap(translation)], sources).join('\n'), /Checklist IDs must match/);
});
