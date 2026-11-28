import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { distributionRows, validateDistribution } from '../src/lib/distribution.mjs';
import { claimSchema, distributionSchema } from '../src/lib/editorial-schema.mjs';
const read = async (file) => JSON.parse(await readFile(`src/data/${file}.json`, 'utf8'));
const [claims, sources, channels] = await Promise.all(['claims', 'sources', 'distribution'].map(read));
const rows = (overrides = {}) => distributionRows({ claims, sources, channels, locale: 'zh-hans', ...overrides });

test('reservation fixtures do not become predownload clients merely because a schedule exists', () => {
  const reservationClaims = claims.map((claim) => {
    if (['cn-platform-details', 'jp-platform-details'].includes(claim.id)) return { ...claim, verification: 'pending', value: {} };
    if (claim.id === 'cn-ios-store') return { ...claim, value: { ...claim.value, availability: 'reservation' } };
    if (claim.id === 'jp-official-entry') return { ...claim, value: { ...claim.value, availability: 'reservation', url: 'https://azurpromilia.jp/pre-register/' } };
    if (['cn-preload-status', 'jp-preload-status'].includes(claim.id)) return { ...claim, value: { date: '2026-11-24' } };
    return claim;
  });
  for (const locale of ['zh-hans', 'ja']) {
    const result = rows({ locale, claims: reservationClaims });
    const ios = result.find((row) => row.id === 'cn-ios');
    assert.equal(ios.stage, 'reservation');
    assert.match(ios.entryUrl, /^https:\/\/apps\.apple\.com\/cn\//);
    assert.equal(ios.preloadUrl, null);
    assert.equal(ios.minimumOS, 'iOS 15.0 / iPadOS 15.0');
    for (const row of result.filter((row) => ['cn-pc', 'cn-android', 'jp-pc'].includes(row.id))) assert.equal(row.entryUrl, null);
    for (const row of result.filter((row) => row.region === 'jp')) {
      assert.equal(row.date, '2026-11-26');
      assert.equal(row.preloadUrl, null);
      assert.equal(row.minimumOS, null);
    }
    for (const row of result.filter((row) => ['jp-ios', 'jp-android'].includes(row.id))) {
      assert.equal(row.stage, 'reservation');
      assert.equal(row.entryUrl, 'https://azurpromilia.jp/pre-register/');
    }
  }
});

test('mobile registration cannot become a PC client and Japanese evidence fails independently', () => {
  const changedChannels = channels.map((channel) => channel.id === 'jp-pc' ? { ...channel, entryClaim: 'jp-official-entry' } : channel);
  assert.equal(rows({ channels: changedChannels }).find((row) => row.id === 'jp-pc').entryUrl, null);
  assert.match(validateDistribution(changedChannels, claims).join('\n'), /explicitly support this platform/);
  const missingJapaneseEvidence = sources.map((source) => source.id.startsWith('jp-') ? { ...source, status: 'unavailable' } : source);
  const result = rows({ sources: missingJapaneseEvidence });
  for (const row of result.filter((row) => row.region === 'jp')) {
    assert.equal(row.entryUrl, null);
    assert.equal(row.date, null);
  }
  assert.equal(result.find((row) => row.id === 'cn-ios').stage, 'preload');
  assert.equal(result.find((row) => row.id === 'cn-ios').date, '2026-11-26');
});

test('missing evidence, another region or historical test never yields an actionable client', () => {
  for (const patch of [{ verification: 'pending', value: {} }, { distributionScope: { region: 'jp', release: 'public-launch' } }, { distributionScope: { region: 'cn', release: 'historical-test' } }]) {
    const changed = claims.map((claim) => claim.id === 'cn-ios-store' ? { ...claim, ...patch } : claim);
    assert.equal(rows({ claims: changed }).find((row) => row.id === 'cn-ios').entryUrl, null);
  }
  assert.equal(rows({ sources: sources.map((source) => ({ ...source, status: 'unavailable' })) }).find((row) => row.id === 'cn-ios').entryUrl, null);
});

test('distribution schema and cross-file checks reject duplicate, wrong-scope and untracked dependencies', () => {
  assert.deepEqual(validateDistribution(channels, claims), []);
  assert.match(validateDistribution([...channels, channels[0]], claims).join('\n'), /Duplicate distribution/);
  assert.match(validateDistribution([{ ...channels[0], entryClaim: 'cn-test-client-history' }], claims).join('\n'), /public launch/);
  assert.match(validateDistribution([{ ...channels[0], entryClaim: 'missing' }], claims).join('\n'), /unknown entryClaim/);
  assert.match(validateDistribution(channels, claims, [{ path: 'fixture.md', data: { contentId: 'download', claimRefs: [] } }]).join('\n'), /distribution component requires/);
  assert.deepEqual(validateDistribution(channels, claims, [{ path: 'en/platforms.md', data: { locale: 'en', contentId: 'platforms', claimRefs: [] } }]), []);
  assert.equal(distributionSchema.safeParse({ ...channels[0], region: 'global' }).success, false);
  const ios = claims.find((claim) => claim.id === 'cn-ios-store');
  assert.equal(claimSchema.safeParse({ ...ios, value: { availability: 'download' } }).success, false);
});
