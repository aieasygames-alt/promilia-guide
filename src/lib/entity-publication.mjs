import { calendarDate } from './editorial-schema.mjs';
export function isEntityCatalogPublishable(entity, locale, sources) {
  const source = sources.find((source) => source.id === entity.sourceRefs[locale]);
  return entity.catalogStatus === 'verified' && source?.status === 'verified' && ['official', 'official-store'].includes(source.kind) && Boolean(source.url?.startsWith('https://') && calendarDate.safeParse(source.checkedAt).success && source.excerpt);
}

export function isEntityDetailPublishable(entity, locale, sources) {
  const review = entity.detailReview?.[locale];
  if (!isEntityCatalogPublishable(entity, locale, sources) || !entity.detailContent?.[locale]?.trim() || review?.status !== 'published' || !review.reviewer?.trim() || !calendarDate.safeParse(review.reviewedAt).success || review.revision !== entity.revision) return false;
  if (locale !== 'zh-hans' && review.translatedFromRevision !== entity.revision) return false;
  const source = sources.find((source) => source.id === entity.sourceRefs[locale]);
  return [source.id, ...(entity.detailSourceRefs || [])].every(id => {
    const reference = sources.find(source => source.id === id);
    return reference?.status === 'verified' && reference.url?.startsWith('https://') && calendarDate.safeParse(reference.checkedAt).success && Boolean(reference.excerpt) && review.sourceChecks?.[id] === reference.checkedAt;
  });
}

export function entityImpact(entities, sourceId) {
  return entities.flatMap((entity) => [...Object.values(entity.sourceRefs), ...(entity.detailSourceRefs || [])].includes(sourceId) ? Object.keys(entity.sourceRefs).map((locale) => `/${locale}/${entity.kind === 'character' ? 'characters' : 'kibo'}/${entity.id}/`) : []);
}
