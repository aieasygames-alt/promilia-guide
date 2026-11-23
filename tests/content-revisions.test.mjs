import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeEditorialRevisions } from '../scripts/content-validation.mjs';

const approved = { path: 'guides/ja/example.md', body: 'Approved answer', data: { locale: 'ja', contentId: 'example', slug: 'example', section: 'guides', sourceRevision: 1, status: 'published', translationStatus: 'published', reviewer: 'Human reviewer', reviewedAt: '2026-11-21' } };
const pending = { path: 'revisions/ja/example.md', body: 'Pending answer', data: { locale: 'ja', contentId: 'example', slug: 'example', section: 'guides', sourceRevision: 2, status: 'draft', translationStatus: 'draft' } };

test('editorial replacement retains stable routes and leaves approved input intact', () => {
  const unrelated = { ...approved, data: { ...approved.data, contentId: 'other', slug: 'other' } };
  const result = mergeEditorialRevisions([approved, unrelated], [pending]);
  assert.equal(result[0].body, 'Pending answer');
  assert.equal(result[1], unrelated);
  assert.equal(approved.body, 'Approved answer');
  assert.equal(approved.data.status, 'published');
  assert.deepEqual(mergeEditorialRevisions([approved], []), [approved]);
});

test('pending content cannot inherit an old approval or change a published URL', () => {
  for (const patch of [{ reviewer: 'Old reviewer' }, { reviewedAt: '2026-11-21' }, { status: 'published' }, { translationStatus: 'published' }, { slug: 'new-url' }, { section: 'systems' }, { sourceRevision: 1 }, { locale: 'zh-hans' }]) {
    assert.throws(() => mergeEditorialRevisions([approved], [{ ...pending, data: { ...pending.data, ...patch } }]));
  }
  assert.throws(() => mergeEditorialRevisions([approved], [pending, pending]), /duplicate/);
});
