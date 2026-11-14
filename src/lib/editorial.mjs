import { isPublished, articlePath } from './publication.mjs';

export function effectiveSourceRefs(data, claims) {
  return [...new Set([...(data.sourceRefs || []), ...(data.claimRefs || []).flatMap((id) => claims.find((claim) => claim.id === id)?.sourceRefs || [])])];
}

export function isVerifiedClaim(claim, sources) {
  if (!claim || claim.verification !== 'verified' || claim.conflicts?.length || !claim.sourceRefs?.length) return false;
  return claim.sourceRefs.every((id) => {
    const source = sources.find((source) => source.id === id);
    if (!source || source.kind === 'project' || source.status !== 'verified' || !source.url?.startsWith('https://') || !source.checkedAt || !source.excerpt) return false;
    return claim.type !== 'official' || ['official', 'official-store'].includes(source.kind);
  });
}

/** @param {any} data
 * @param {{ entries?: any[], sources?: any[], claims?: any[] }} context
 */
export function publicationIssues(data, { entries = [], sources = [], claims = [] } = {}) {
  const issues = [];
  const add = (code, message, severity = 'blocker') => issues.push({ code, message, severity });
  if (data.status !== 'published') add('draft', '文章仍为草稿');
  if (data.translationStatus !== 'published') add('review-state', `审核状态：${data.translationStatus}`);
  if (!data.reviewer?.trim() || !data.reviewedAt) add('manual-review', '缺少真实审核人与审核日期');
  if (data.verification === 'pending') add('pending-article', '文章的核心结论尚未核验');
  const original = entries.find((entry) => entry.data.locale === 'zh-hans' && entry.data.contentId === data.contentId)?.data;
  if (data.locale !== 'zh-hans' && (!original || data.sourceRevision !== original.sourceRevision || data.translatedFromRevision !== original.sourceRevision)) {
    add('stale-translation', '译文尚未跟上当前中文原稿修订号');
  }
  for (const id of data.sourceRefs || []) {
    const source = sources.find((source) => source.id === id);
    if (!source) add('missing-source', `不存在的来源：${id}`);
    else if (source.status === 'unavailable') add('unavailable-source', `来源不可访问，需重新核验：${id}`);
    else if (source.status !== 'verified') add('unverified-source', `来源尚未完成核验：${id}`, 'warning');
  }
  if (['official', 'test'].includes(data.verification) && !(data.sourceRefs || []).some((id) => {
    const source = sources.find((source) => source.id === id);
    const allowed = data.verification === 'official' ? ['official', 'official-store'] : ['official', 'official-store', 'test'];
    return source?.status === 'verified' && source.url?.startsWith('https://') && source.checkedAt && source.excerpt && allowed.includes(source.kind);
  })) add('missing-evidence', '官方或测试结论缺少已核验的原始证据');

  for (const id of data.claimRefs || []) {
    const claim = claims.find((claim) => claim.id === id);
    if (!claim) { add('missing-claim', `不存在的事实：${id}`); continue; }
    if (data.claimRevisions?.[id] !== claim.revision) add('stale-claim', `事实 ${id} 已为 r${claim.revision}，文章记录为 ${data.claimRevisions?.[id] ? 'r' + data.claimRevisions[id] : '未记录'}，需复查正文`);
    if (claim.verification === 'verified' && !isVerifiedClaim(claim, sources)) add('invalid-claim-evidence', `事实 ${id} 的核验状态与来源不一致`);
    if (claim.verification === 'conflicting' || claim.conflicts?.length) add('conflicting-claim', `事实 ${id} 存在未解决冲突`);
    if (claim.verification === 'pending') add('pending-claim', `事实 ${id} 仍待核验，公开展示时须保留未知说明`, 'warning');
  }
  return issues;
}

export function isPublishable(data, context) {
  return isPublished(data) && !publicationIssues(data, context).some((issue) => issue.severity === 'blocker');
}

/** @param {{ entries: any[], sources: any[], claims: any[], asOf?: string }} context */
export function createEditorialReport({ entries, sources, claims, asOf = beijingDate() }) {
  const articles = entries.map(({ data, path }) => {
    const issues = publicationIssues(data, { entries, sources, claims });
    return {
      contentId: data.contentId, locale: data.locale, title: data.title, file: path,
      url: articlePath(data), status: data.status, translationStatus: data.translationStatus,
      sourceRevision: data.sourceRevision, translatedFromRevision: data.translatedFromRevision ?? null,
      claimRefs: data.claimRefs || [], claimRevisions: data.claimRevisions || {},
      sourceRefs: effectiveSourceRefs(data, claims),
      publishable: isPublishable(data, { entries, sources, claims }),
      blockers: issues.filter((issue) => issue.severity === 'blocker'),
      warnings: issues.filter((issue) => issue.severity === 'warning'),
    };
  }).sort((a, b) => a.contentId.localeCompare(b.contentId) || a.locale.localeCompare(b.locale));
  return {
    asOf,
    summary: {
      articles: articles.length,
      publishable: articles.filter((article) => article.publishable).length,
      awaitingReview: articles.filter((article) => article.blockers.some((issue) => issue.code === 'manual-review')).length,
      staleArticles: articles.filter((article) => article.blockers.some((issue) => ['stale-claim', 'stale-translation'].includes(issue.code))).length,
      sources: sources.length,
      verifiedSources: sources.filter((source) => source.status === 'verified').length,
      claims: claims.length,
      verifiedClaims: claims.filter((claim) => isVerifiedClaim(claim, sources)).length,
    },
    articles,
    sources: sources.map((source) => ({
      id: source.id, title: source.title, status: source.status, checkedAt: source.checkedAt,
      daysSinceChecked: source.checkedAt ? Math.floor((Date.parse(asOf) - Date.parse(source.checkedAt)) / 86400000) : null,
      affectedArticles: findContentImpact({ entries, sources, claims, sourceId: source.id }).articles.map((article) => article.url),
    })),
    claims: claims.map((claim) => ({ id: claim.id, revision: claim.revision, verification: claim.verification, affectedPages: claim.affectedPages })),
  };
}

/** @param {{ entries: any[], sources: any[], claims: any[], sourceId?: string, claimId?: string, contentId?: string }} options */
export function findContentImpact({ entries, sources, claims, sourceId, claimId, contentId }) {
  if (!sourceId && !claimId && !contentId) throw new Error('Specify --source, --claim or --content');
  if (sourceId && !sources.some((source) => source.id === sourceId)) throw new Error(`Unknown source: ${sourceId}`);
  if (claimId && !claims.some((claim) => claim.id === claimId)) throw new Error(`Unknown claim: ${claimId}`);
  if (contentId && !entries.some((entry) => entry.data.contentId === contentId)) throw new Error(`Unknown content: ${contentId}`);
  const topicRefs = entries.filter(({ data }) => data.contentId === contentId).flatMap(({ data }) => data.claimRefs || []);
  const impactedClaims = claims.filter((claim) => claim.id === claimId || (sourceId && claim.sourceRefs.includes(sourceId)) || (contentId && (claim.affectedPages.includes(contentId) || topicRefs.includes(claim.id))));
  const claimIds = new Set(impactedClaims.map((claim) => claim.id));
  const topics = new Set(contentId && !sourceId && !claimId ? [contentId] : [...(contentId ? [contentId] : []), ...impactedClaims.flatMap((claim) => claim.affectedPages)]);
  for (const { data } of entries) {
    if ((sourceId && data.sourceRefs?.includes(sourceId)) || ((sourceId || claimId) && data.claimRefs?.some((id) => claimIds.has(id)))) topics.add(data.contentId);
  }
  return {
    query: { sourceId: sourceId || null, claimId: claimId || null, contentId: contentId || null },
    claims: impactedClaims.map((claim) => ({ id: claim.id, revision: claim.revision, verification: claim.verification })),
    articles: entries.filter(({ data }) => topics.has(data.contentId)).map(({ data, path }) => ({
      contentId: data.contentId, locale: data.locale, title: data.title, file: path, url: articlePath(data),
      status: data.status, translationStatus: data.translationStatus,
      sourceRevision: data.sourceRevision, translatedFromRevision: data.translatedFromRevision ?? null,
      blockers: publicationIssues(data, { entries, sources, claims }).filter((issue) => issue.severity === 'blocker'),
    })).sort((a, b) => a.contentId.localeCompare(b.contentId) || a.locale.localeCompare(b.locale)),
  };
}

export function beijingDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** @param {{ claims: any[], sources: any[], locale: 'zh-hans' | 'ja', region?: 'cn' | 'jp', asOf?: string }} options */
export function releaseSummary({ claims, sources, locale, region = 'cn', asOf = beijingDate() }) {
  const ja = locale === 'ja';
  const claimId = region === 'jp' ? 'jp-release-status' : 'cn-launch-date';
  const regionLabel = region === 'jp' ? (ja ? '日本' : '日本地区') : (ja ? '中国本土' : '中国大陆');
  const claim = claims.find((claim) => claim.id === claimId);
  const verified = isVerifiedClaim(claim, sources) && Boolean(claim.value.date) && claim.distributionScope?.region === region && claim.distributionScope?.release === 'public-launch';
  if (!verified) return {
    verified: false, claimId, revision: claim?.revision ?? null, date: null,
    label: `${regionLabel} · ${ja ? '配信日を確認中' : '发行日期核验中'}`,
    detail: ja ? '対象地域の公式発表を確認中です。他地域の日程では補いません。' : '正在核验该地区原始公告，不以其他地区的日期补充。',
    source: null,
  };
  const [year, month, day] = claim.value.date.split('-').map(Number);
  const reached = asOf >= claim.value.date;
  const source = sources.find((source) => claim.sourceRefs.includes(source.id) && source.status === 'verified');
  return {
    verified: true, claimId: claim.id, revision: claim.revision, date: claim.value.date,
    label: `${regionLabel} · ${reached ? (ja ? '告知日到来・開始状況は確認中' : '已到公告日期 · 开服状态待核验') : (ja ? `${month}月${day}日開始予定` : `${month} 月 ${day} 日${region === 'cn' ? '公测' : '发行'}`)}`,
    detail: reached ? (ja ? '日付の到来だけではサービス開始と判断しません。実際の稼働状況を別途確認します。' : '公告日期已到，实际开放情况仍需核验，不根据日期自动标记已开服。') : (ja ? `${year}年の対象地域の公式日程を確認済み。具体的な開始時刻と配布状況は別途確認します。` : `${year} 年该地区独立官方日程已核验；具体时刻与下载开放状态分别确认。`),
    source: source ? { id: source.id, title: source.localized?.[locale]?.title || source.title, url: source.url, checkedAt: source.checkedAt } : null,
  };
}
