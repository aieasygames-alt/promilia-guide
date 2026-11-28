import test from 'node:test';
import assert from 'node:assert/strict';
import { claimSchema } from '../src/lib/editorial-schema.mjs';
import { countdownText, regionalReleaseState } from '../src/lib/release-state.mjs';
import { distributionRows } from '../src/lib/distribution.mjs';
import { redeemCodeSchema, redeemCodeRows, announcedCodeRows, validateRedeemCodes } from '../src/lib/redeem-codes.mjs';
import { entityImpact, isEntityCatalogPublishable, isEntityDetailPublishable } from '../src/lib/entity-publication.mjs';

const source = { id: 'official', status: 'verified', kind: 'official', url: 'https://example.com/original', excerpt: 'Fixture evidence', checkedAt: '2026-11-21' };
const claim = { id: 'cn-opening-time', revision: 1, text: 'Fixture', localized: { 'zh-hans': { summary: 'Fixture' }, ja: { summary: 'Fixture' } }, sourceRefs: [source.id], type: 'official', gameRegion: 'CN', gameVersion: 'public', distributionScope: { region: 'cn', release: 'public-launch' }, verification: 'verified', affectedPages: ['launch'], value: { date: '2026-11-26', time: '10:00', timeZone: 'Asia/Shanghai' } };
const state = (claims = [claim], sources = [source], region = 'cn', now = new Date('2026-11-25T00:00:00Z')) => regionalReleaseState({ claims, sources, region, now });

test('typed claim values survive parsing and unknown or impossible values fail', () => {
  const value = { characterHardPity: 80, weaponHardPity: 60, beginnerPity: 50, characterRateUpProbability: '100%', pityCarryOver: true, loginPulls: 66, explorationPullsMinimum: 510 };
  assert.deepEqual(claimSchema.parse({ ...claim, value }).value, value);
  assert.equal(claimSchema.safeParse({ ...claim, value: { inventedMechanic: 80 } }).success, false);
  for (const time of ['24:00', '10:60', '9:00']) assert.equal(claimSchema.safeParse({ ...claim, value: { ...claim.value, time } }).success, false);
  assert.equal(claimSchema.safeParse({ ...claim, value: { date: '2026-11-26', time: '10:00' } }).success, false);
});

test('regional schedules preserve independent offsets and never certify opening by the clock', () => {
  assert.equal(state().launch.instant, '2026-11-26T10:00:00+08:00');
  const jp = { ...claim, id: 'jp-opening-time', distributionScope: { region: 'jp', release: 'public-launch' }, value: { date: '2026-11-26', time: '11:00', timeZone: 'Asia/Tokyo' } };
  assert.equal(state([claim, jp], [source], 'jp').launch.instant, '2026-11-26T11:00:00+09:00');
  for (const instant of ['2026-11-26T02:00:00Z', '2026-12-01T00:00:00Z']) assert.equal(state([claim], [source], 'cn', new Date(instant)).stage, 'awaiting-confirmation');
  const service = { ...claim, id: 'cn-service-status', value: { serviceStatus: 'open' } };
  assert.equal(state([claim, service]).stage, 'open');
  assert.equal(state([claim, { ...service, value: { serviceStatus: 'maintenance' } }]).stage, 'maintenance');
  assert.equal(state([claim], [source], 'jp').launch, null);
});

test('missing, historical, wrong-region and lost evidence cannot yield a planned instant', () => {
  for (const change of [{ verification: 'pending', value: {} }, { distributionScope: { region: 'jp', release: 'public-launch' } }, { distributionScope: { region: 'cn', release: 'historical-test' } }]) assert.equal(state([{ ...claim, ...change }]).launch, null);
  assert.equal(state([claim], [{ ...source, status: 'unavailable' }]).launch, null);
  const dateOnly = { ...claim, id: 'cn-launch-date', value: { date: '2026-11-26' } };
  assert.equal(state([dateOnly]).launch.instant, null);
  assert.equal(state([dateOnly], [source], 'cn', new Date('2026-11-25T16:01:00Z')).stage, 'awaiting-confirmation');
});

test('countdown clamps at planned instant and remains explicit in both languages', () => {
  for (const locale of ['zh-hans', 'ja']) {
    const target = '2026-11-26T10:00:00+08:00';
    assert.match(countdownText(target, new Date('2026-11-25T02:00:00Z'), locale), /1/);
    for (const now of ['2026-11-26T02:00:00Z', '2026-11-27T02:00:00Z']) {
      const text = countdownText(target, new Date(now), locale);
      assert.match(text, /待核验|確認中/);
      assert.doesNotMatch(text, /-\d|已开服/);
    }
  }
});

test('preload schedule can be shown without implying an actionable installer', () => {
  const preload = { ...claim, id: 'cn-preload-status', value: { date: '2026-11-24', time: '10:00', timeZone: 'Asia/Shanghai' } };
  const entry = { ...claim, id: 'cn-pc-entry', verification: 'pending', value: {} };
  const [row] = distributionRows({ channels: [{ id: 'cn-pc', region: 'cn', platform: 'pc', entryClaim: entry.id, scheduleClaim: claim.id, preloadClaim: preload.id }], claims: [claim, preload, entry], sources: [source], locale: 'zh-hans' });
  assert.equal(row.preload.instant, '2026-11-24T10:00:00+08:00');
  assert.equal(row.preloadUrl, null);
  assert.equal(row.entryUrl, null);
  assert.equal(row.stage, null);
  const mobilePreload = { ...preload, value: { ...preload.value, availability: 'preload', url: 'https://example.com/ios', platforms: ['ios'] } };
  const [pc] = distributionRows({ channels: [row], claims: [claim, mobilePreload, entry], sources: [source], locale: 'zh-hans' });
  assert.equal(pc.preloadUrl, null, 'mobile preload must not become a PC installer');
});

const code = { code: 'FIXTURE_ONLY', region: 'cn', verification: 'verified', reward: { 'zh-hans': 'Fixture', ja: 'Fixture' }, availableAt: '2026-11-26T10:00:00+08:00', expiresAt: '2026-11-26T11:00:00+08:00', timeZone: 'Asia/Shanghai', redemptionMethod: { 'zh-hans': 'Fixture', ja: 'Fixture' }, sourceRefs: [source.id], checkedAt: '2026-11-21' };
const codeRows = (changes = {}) => redeemCodeRows({ codes: [code], sources: [source], now: new Date('2026-11-26T02:30:00Z'), ...changes });

test('code validity has exact start and expiry boundaries and independent regional filters', () => {
  for (const [now, status] of [['2026-11-26T01:59:59Z', 'scheduled'], ['2026-11-26T02:00:00Z', 'active'], ['2026-11-26T02:59:59Z', 'active'], ['2026-11-26T03:00:00Z', 'expired']]) assert.equal(codeRows({ now: new Date(now) })[0].status, status);
  assert.equal(codeRows({ region: 'jp' }).length, 0);
  assert.equal(codeRows({ region: 'cn' }).length, 1);
});

test('codes fail closed for missing fields, pending or lost evidence, duplicates and timezone errors', () => {
  for (const field of ['region', 'reward', 'redemptionMethod', 'availableAt', 'expiresAt', 'checkedAt', 'timeZone']) assert.equal(redeemCodeSchema.safeParse({ ...code, [field]: null }).success, false, field);
  assert.equal(redeemCodeSchema.safeParse({ ...code, expiresAt: code.availableAt }).success, false);
  assert.equal(redeemCodeSchema.safeParse({ ...code, availableAt: '2026-11-26T10:00:00+09:00' }).success, false);
  assert.equal(redeemCodeSchema.safeParse({ ...code, timeZone: 'Asia/Tokyo' }).success, false);
  assert.equal(codeRows({ codes: [{ ...code, verification: 'pending' }] }).length, 0);
  for (const patch of [{ status: 'unavailable' }, { kind: 'community' }, { url: 'http://example.com' }, { excerpt: '' }]) assert.equal(codeRows({ sources: [{ ...source, ...patch }] }).length, 0);
  assert.equal(codeRows({ sources: [] }).length, 0);
  assert.match(validateRedeemCodes([code, code], [source]).join(' '), /Duplicate/);
});

test('officially announced codes can retain incomplete fields without becoming active or accepting community evidence', () => {
  const announced = { ...code, verification: 'announced', reward: null, availableAt: null, expiresAt: null, timeZone: null, announcedValidity: { 'zh-hans': '原文期限，时区未列', ja: '原文の期限・時差未記載' } };
  assert.equal(redeemCodeSchema.safeParse(announced).success, true);
  assert.equal(announcedCodeRows({ codes: [announced], sources: [source] }).length, 1);
  assert.equal(redeemCodeRows({ codes: [announced], sources: [source] }).length, 0);
  for (const field of ['announcedValidity', 'redemptionMethod', 'checkedAt']) {
    const incomplete = { ...announced }; delete incomplete[field];
    assert.equal(announcedCodeRows({ codes: [incomplete], sources: [source] }).length, 0);
  }
  for (const patch of [{ kind: 'community' }, { status: 'unavailable' }, { excerpt: '' }]) {
    assert.equal(announcedCodeRows({ codes: [announced], sources: [{ ...source, ...patch }] }).length, 0);
  }
  assert.equal(announcedCodeRows({ codes: [announced], sources: [] }).length, 0);
  assert.equal(announcedCodeRows({ codes: [{ ...announced, verification: 'pending' }], sources: [source] }).length, 0);
  assert.match(validateRedeemCodes([announced, announced], [source]).join(' '), /Duplicate/);
});

const entity = { id: 'fixture', kind: 'character', catalogStatus: 'verified', revision: 2, sourceRefs: { 'zh-hans': source.id, ja: source.id }, detailContent: { 'zh-hans': 'Useful guide', ja: 'Useful translation' }, detailReview: Object.fromEntries(['zh-hans', 'ja'].map(locale => [locale, { status: 'published', reviewer: 'Fixture reviewer', reviewedAt: '2026-11-21', revision: 2, translatedFromRevision: 2, sourceChecks: { [source.id]: source.checkedAt } }])) };

test('entity gameplay sources must remain verified and match the reviewed version', () => {
  const guide = { ...source, id: 'third-party-guide', kind: 'community' };
  const reviewed = { ...entity, detailSourceRefs: [guide.id], detailReview: Object.fromEntries(['zh-hans', 'ja'].map(locale => [locale, { ...entity.detailReview[locale], sourceChecks: { ...entity.detailReview[locale].sourceChecks, [guide.id]: guide.checkedAt } }])) };
  for (const locale of ['zh-hans', 'ja']) {
    assert.equal(isEntityDetailPublishable(reviewed, locale, [source, guide]), true);
    assert.equal(isEntityDetailPublishable(reviewed, locale, [source]), false);
    for (const patch of [{ status: 'unavailable' }, { checkedAt: '2026-11-22' }, { excerpt: '' }]) assert.equal(isEntityDetailPublishable(reviewed, locale, [source, { ...guide, ...patch }]), false);
  }
  assert.deepEqual(entityImpact([reviewed], guide.id), ['/zh-hans/characters/fixture/', '/ja/characters/fixture/']);
});

test('entity details need body, current bilingual review and matching source checks', () => {
  for (const locale of ['zh-hans', 'ja']) {
    assert.equal(isEntityDetailPublishable(entity, locale, [source]), true);
    for (const patch of [{ detailContent: {} }, { revision: 3 }, { catalogStatus: 'pending' }, { detailReview: {} }]) assert.equal(isEntityDetailPublishable({ ...entity, ...patch }, locale, [source]), false);
    for (const patch of [{ status: 'draft' }, { reviewer: '' }, { reviewedAt: 'bad-date' }, { revision: 1 }, { sourceChecks: {} }]) assert.equal(isEntityDetailPublishable({ ...entity, detailReview: { [locale]: { ...entity.detailReview[locale], ...patch } } }, locale, [source]), false);
    assert.equal(isEntityDetailPublishable(entity, locale, [{ ...source, checkedAt: '2026-11-22' }]), false);
    assert.equal(isEntityCatalogPublishable(entity, locale, [{ ...source, status: 'unavailable' }]), false);
  }
  assert.equal(isEntityDetailPublishable({ ...entity, detailReview: { ja: { ...entity.detailReview.ja, translatedFromRevision: 1 } } }, 'ja', [source]), false);
  assert.deepEqual(entityImpact([{ ...entity, sourceRefs: { 'zh-hans': source.id, ja: 'other-original' } }], source.id), ['/zh-hans/characters/fixture/', '/ja/characters/fixture/']);
});
