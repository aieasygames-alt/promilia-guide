/** @type {Array<'zh-hans' | 'ja' | 'en'>} */
export const locales = ['zh-hans', 'ja', 'en'];
/** Full reference catalogs are currently available in these languages. */
export const referenceLocales = /** @type {Array<'zh-hans' | 'ja'>} */ (['zh-hans', 'ja']);
export const languageTag = { 'zh-hans': 'zh-Hans', ja: 'ja', en: 'en' };
export const origin = 'https://promiliaguide.com';

export function isPublished(data) {
  return data.status === 'published' &&
    data.translationStatus === 'published' &&
    Boolean(data.reviewer && data.reviewedAt) &&
    (data.locale === 'zh-hans' || data.translatedFromRevision === data.sourceRevision);
}

export function isVisible(data, preview = false) {
  return preview || isPublished(data);
}

export function articlePath(data) {
  return `/${data.locale}/${data.section}/${data.slug}/`;
}

// An unpublished or out-of-date translation never becomes an alternate URL.
export function alternateLinks(entries, contentId, home = false) {
  const published = entries.filter((entry) => entry.data.contentId === contentId && isPublished(entry.data));
  if (!published.length) return [];
  return [
    ...published.map(({ data }) => ({ lang: languageTag[data.locale], href: origin + articlePath(data) })),
    { lang: 'x-default', href: home ? origin + '/' : origin + articlePath((published.find(({ data }) => data.locale === 'zh-hans') || published[0]).data) },
  ];
}
