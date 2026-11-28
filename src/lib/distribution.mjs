import { scheduleValue, verifiedRegionalClaim } from './release-state.mjs';

const platformNames = { pc: ['pc', 'windows'], android: ['android'], ios: ['ios', 'iphone', 'ipad', 'ipados'] };
const supportsPlatform = (claim, platform) => claim?.value.platforms?.some((name) => platformNames[platform]?.includes(name.toLowerCase())) || false;

/** Derive every actionable field from currently verified evidence.
 * @param {{ channels: import('zod').infer<typeof import('./editorial-schema.mjs').distributionSchema>[], claims: import('zod').infer<typeof import('./editorial-schema.mjs').claimSchema>[], sources: import('zod').infer<typeof import('./editorial-schema.mjs').sourceSchema>[], locale: 'zh-hans' | 'ja' }} options
 */
export function distributionRows({ channels, claims, sources, locale }) {
  const ja = locale === 'ja';
  const claimById = (id) => claims.find((claim) => claim.id === id);
  const verified = (id, region) => verifiedRegionalClaim(claims, sources, id, region);
  const stages = ja ? { reservation: '事前登録', preload: '事前ダウンロード', download: 'ダウンロード' } : { reservation: '预约', preload: '预下载', download: '客户端下载' };
  return channels.map((channel) => {
    const entry = verified(channel.entryClaim, channel.region);
    const schedule = verified(channel.scheduleClaim, channel.region);
    const preload = verified(channel.preloadClaim, channel.region);
    const opening = channel.openingClaim ? verified(channel.openingClaim, channel.region) : null;
    const compatibility = channel.compatibilityClaim ? verified(channel.compatibilityClaim, channel.region) : null;
    const stage = entry?.value.availability || null;
    const actionable = Boolean(stage && entry?.value.url && supportsPlatform(entry, channel.platform));
    const claimIds = [...new Set([channel.entryClaim, channel.scheduleClaim, channel.preloadClaim, channel.openingClaim, channel.compatibilityClaim].filter(Boolean))];
    const evidenceIds = [...new Set(claimIds.flatMap((id) => claimById(id)?.sourceRefs || []))];
    const evidence = sources.filter((source) => evidenceIds.includes(source.id) && source.status === 'verified' && source.url && ['official', 'official-store'].includes(source.kind));
    return {
      ...channel,
      regionLabel: channel.region === 'cn' ? (ja ? '中国本土' : '中国大陆') : (ja ? '日本' : '日本地区'),
      platformLabel: channel.platform === 'ios' ? 'iPhone / iPad' : channel.platform === 'pc' ? 'PC' : 'Android',
      stage: actionable ? stage : null,
      stageLabel: actionable ? stages[stage] : (ja ? '配布先を確認中' : '入口待核验'),
      entryUrl: actionable ? entry.value.url : null,
      entrySummary: claimById(channel.entryClaim)?.localized[locale]?.summary || (ja ? '確認中です。' : '待核验。'),
      date: schedule?.value.date || null,
      launch: scheduleValue(opening) || scheduleValue(schedule),
      preload: scheduleValue(preload),
      preloadUrl: preload?.value.availability === 'preload' && supportsPlatform(preload, channel.platform) ? preload.value.url || null : null,
      minimumOS: compatibility?.value.minimumOS || null,
      evidence: evidence.map((source) => ({ id: source.id, title: source.localized?.[locale]?.title || source.title, url: source.url, checkedAt: source.checkedAt })),
    };
  });
}

/** @param {any[]} channels @param {any[]} claims @param {any[]} entries */
export function validateDistribution(channels, claims, entries = []) {
  const errors = [];
  const identities = new Set();
  for (const channel of channels) {
    const key = `${channel.region}:${channel.platform}`;
    if (identities.has(key)) errors.push(`Duplicate distribution region/platform: ${key}`);
    identities.add(key);
    for (const field of ['entryClaim', 'scheduleClaim', 'preloadClaim', 'openingClaim', 'compatibilityClaim']) {
      if (channel[field] && !claims.some((claim) => claim.id === channel[field])) errors.push(`${channel.id}: unknown ${field} ${channel[field]}`);
      const claim = claims.find((claim) => claim.id === channel[field]);
      if (claim && (claim.distributionScope?.region !== channel.region || claim.distributionScope?.release !== 'public-launch')) errors.push(`${channel.id}: ${field} must match this region and the public launch`);
    }
    const entry = claims.find((claim) => claim.id === channel.entryClaim);
    if (entry?.verification === 'verified' && (!entry.value.url || !entry.value.availability)) errors.push(`${channel.id}: verified entry needs a URL and availability stage`);
    if (entry?.verification === 'verified' && !supportsPlatform(entry, channel.platform)) errors.push(`${channel.id}: verified entry must explicitly support this platform`);
  }
  if (new Set(channels.map((channel) => channel.id)).size !== channels.length) errors.push('Duplicate distribution IDs');
  const required = [...new Set(channels.flatMap((channel) => [channel.entryClaim, channel.scheduleClaim, channel.preloadClaim, channel.openingClaim, channel.compatibilityClaim].filter(Boolean)))];
  for (const { data, path } of entries.filter(({ data }) => data.locale !== 'en' && ['download', 'platforms'].includes(data.contentId))) {
    for (const id of required) if (!data.claimRefs?.includes(id)) errors.push(`${path}: distribution component requires claimRefs ${id}`);
  }
  return errors;
}
