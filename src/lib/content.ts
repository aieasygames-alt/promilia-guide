import { getCollection, type CollectionEntry } from 'astro:content';
import { articlePath } from './publication.mjs';
import { isPublishable, publicationIssues } from './editorial.mjs';
import { sources, claims } from './facts';

export type Locale = 'zh-hans' | 'ja';
export type Guide = CollectionEntry<'guides'>;
export const preview = __CONTENT_PREVIEW__;
export const allGuides = () => getCollection('guides');
export async function publicationContext() {
  return { entries: await allGuides(), sources, claims };
}
export function isPublished(data: Guide['data'], entries: Guide[]) {
  return isPublishable(data, { entries, sources, claims });
}
export async function guideIssues(data: Guide['data']) {
  return publicationIssues(data, await publicationContext());
}
export async function visibleGuides(locale?: Locale) {
  const entries = await allGuides();
  return entries.filter(({ data }) => (preview || isPublished(data, entries)) && (!locale || data.locale === locale))
    .sort((a, b) => a.data.order - b.data.order);
}
export { articlePath };
