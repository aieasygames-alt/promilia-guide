import { articlePath } from './publication.mjs';
import { isPublishable, isVerifiedClaim } from './editorial.mjs';

export function resolveQuestions(groups, locale, { entries, sources, claims }) {
  return groups.map(group => ({ ...group, questions: group.questions.map(question => {
    const guide = entries.find(({ data }) => data.locale === locale && data.contentId === question.contentId);
    const current = Object.entries(question.claimRevisions || {}).every(([id, revision]) => {
      const claim = claims.find(claim => claim.id === id);
      return claim?.revision === revision && isVerifiedClaim(claim, sources);
    });
    const available = Boolean(guide && isPublishable(guide.data, { entries, sources, claims }) && current);
    return { ...question, available, href: available ? articlePath(guide.data) : null };
  }) }));
}

export function officialAnnouncements(sources) {
  const byUrl = new Map();
  for (const source of sources) {
    if (source.kind !== 'official' || source.status !== 'verified' || !source.url || !source.publishedAt) continue;
    const url = new URL(source.url);
    url.hash = '';
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    const key = url.href;
    const previous = byUrl.get(key);
    if (!previous || (source.checkedAt || '') >= (previous.checkedAt || '')) byUrl.set(key, source);
  }
  return [...byUrl.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id));
}
