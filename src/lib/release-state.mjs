import { isVerifiedClaim } from './editorial.mjs';

export function verifiedRegionalClaim(claims, sources, id, region) {
  const claim = claims.find((item) => item.id === id);
  return isVerifiedClaim(claim, sources) && claim.distributionScope?.region === region && claim.distributionScope?.release === 'public-launch' ? claim : null;
}

export function scheduleValue(claim) {
  if (!claim?.value.date) return null;
  const { date, time, timeZone } = claim.value;
  const offset = { 'Asia/Shanghai': '+08:00', 'Asia/Tokyo': '+09:00' }[timeZone];
  return { date, time: time || null, timeZone: timeZone || null, instant: time && offset ? `${date}T${time}:00${offset}` : null };
}

/** Planned times never certify a live server or an available installer. */
export function regionalReleaseState({ claims, sources, region, now = new Date() }) {
  const get = (id) => verifiedRegionalClaim(claims, sources, id, region);
  const opening = get(`${region}-opening-time`);
  const date = get(region === 'cn' ? 'cn-launch-date' : 'jp-release-status');
  const launch = scheduleValue(opening) || scheduleValue(date);
  const preload = scheduleValue(get(`${region}-preload-status`));
  const service = get(`${region}-service-status`);
  const asOf = new Intl.DateTimeFormat('en-CA', { timeZone: region === 'cn' ? 'Asia/Shanghai' : 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const reached = launch?.instant ? now.getTime() >= Date.parse(launch.instant) : launch && asOf >= launch.date;
  return { region, launch, preload, stage: service?.value.serviceStatus || (reached ? 'awaiting-confirmation' : launch ? 'announced' : 'unconfirmed') };
}

export function countdownText(instant, now, locale) {
  const remaining = Math.max(0, Date.parse(instant) - now.getTime());
  if (!remaining) return locale === 'ja' ? '開始予定時刻を迎えました。稼働状況は確認中です。' : '已到计划时间，实际开放状态待核验。';
  const totalMinutes = Math.ceil(remaining / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor(totalMinutes % 1440 / 60);
  const minutes = totalMinutes % 60;
  return locale === 'ja' ? `開始予定まで ${days}日 ${hours}時間 ${minutes}分` : `距计划时间 ${days} 天 ${hours} 小时 ${minutes} 分钟`;
}
