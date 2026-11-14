import { locales, isPublished, articlePath } from './publication.mjs';
import { isVerifiedClaim, publicationIssues } from './editorial.mjs';

/** @param {any[]} entries @param {any[]} sources @param {any[]} claims */
export function validateEntries(entries, sources, claims = []) {
  const errors = [];
  const sourceMap = new Map(sources.map((source) => [source.id, source]));
  if (sourceMap.size !== sources.length) errors.push('Duplicate source IDs');
  const identity = new Set(); const paths = new Set();
  for (const { data: d, path } of entries) {
    const error = (message) => errors.push(`${path}: ${message}`);
    const key = `${d.locale}:${d.contentId}`;
    if (identity.has(key)) error(`Duplicate content identity ${key}`);
    identity.add(key);
    const url = articlePath(d);
    if (paths.has(url)) error(`Duplicate route ${url}`);
    paths.add(url);
    if (!locales.includes(d.locale)) error(`Unsupported locale ${d.locale}`);
    for (const ref of d.sourceRefs || []) if (!sourceMap.has(ref)) error(`Unknown source ${ref}`);
    for (const id of d.related || []) if (!entries.some((entry) => entry.data.contentId === id)) error(`Unknown related content ${id}`);
    if (d.updatedAt < d.publishedAt) error('updatedAt predates publishedAt');
    if (d.checklist && new Set(d.checklist.map((item) => item.id)).size !== d.checklist.length) error('Duplicate checklist IDs');
    const original = entries.find((entry) => entry.data.locale === 'zh-hans' && entry.data.contentId === d.contentId)?.data;
    if (d.locale !== 'zh-hans') {
      if (!original) error('Translation has no source article');
      if (original && d.status === 'published' && d.translationStatus === 'published' && d.sourceRevision !== original.sourceRevision) error('sourceRevision must match current source article; set translationStatus to needs-update and retain translatedFromRevision');
      if (d.status === 'published' && d.translationStatus === 'published' && original && d.translatedFromRevision !== original.sourceRevision) error('Published translation is behind its source revision');
      if (original?.checklist?.length && JSON.stringify(d.checklist?.map((item) => item.id).sort()) !== JSON.stringify(original.checklist.map((item) => item.id).sort())) error('Checklist IDs must match the source language');
    }
    if (d.status === 'published' && d.translationStatus === 'published' && !isPublished(d)) error('Publication requires a reviewer, review date and current translation');
    if (isPublished(d)) {
      if (!d.reviewer.trim()) error('Reviewer cannot be blank');
      if (d.verification === 'pending') error('Pending facts must remain in draft');
      if (d.verification === 'official' || d.verification === 'test') {
        if (!d.sourceRefs?.some((id) => { const source = sourceMap.get(id); return source?.status === 'verified' && source?.url?.startsWith('https://') && source?.checkedAt; })) error('Game facts need a verified, dated original source URL');
      }
      for (const issue of publicationIssues(d, { entries, sources, claims }).filter((issue) => issue.severity === 'blocker')) error(`${issue.code}: ${issue.message}`);
    }
    if (new Set(d.claimRefs || []).size !== (d.claimRefs || []).length) error('Duplicate claim references');
    for (const id of d.claimRefs || []) {
      const claim = claims.find((claim) => claim.id === id);
      if (!claim) error(`Unknown claim ${id}`);
      else if (!claim.affectedPages.includes(d.contentId)) error(`Claim ${id} must list this contentId in affectedPages`);
    }
    for (const id of Object.keys(d.claimRevisions || {})) if (!d.claimRefs?.includes(id)) error(`Revision recorded for unreferenced claim ${id}`);
  }
  for (const source of sources) {
    if (source.status === 'verified' && (!source.url?.startsWith('https://') || !source.checkedAt)) errors.push(`${source.id}: verified source requires HTTPS URL and checkedAt`);
  }
  const claimIds = new Set();
  for (const claim of claims) {
    if (claimIds.has(claim.id)) errors.push(`Duplicate claim ${claim.id}`);
    claimIds.add(claim.id);
    for (const id of claim.sourceRefs) if (!sourceMap.has(id)) errors.push(`${claim.id}: unknown source ${id}`);
    for (const id of claim.affectedPages) if (!entries.some((e) => e.data.contentId === id)) errors.push(`${claim.id}: unknown affected content ${id}`);
    if (claim.verification === 'verified' && !isVerifiedClaim(claim, sources)) errors.push(`${claim.id}: verified claim requires consistent original-source evidence`);
  }
  return errors;
}
