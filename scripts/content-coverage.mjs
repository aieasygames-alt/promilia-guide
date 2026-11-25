import { readFile } from 'node:fs/promises';
import { readEntries } from './content-validation.mjs';
import { readEditorialData } from './editorial-data.mjs';
import { guideSchema } from '../src/lib/editorial-schema.mjs';
import { entities } from '../src/data/entities.ts';
import { isPublishable } from '../src/lib/editorial.mjs';
import { isEntityCatalogPublishable, isEntityDetailPublishable } from '../src/lib/entity-publication.mjs';
import { resolveQuestions } from '../src/lib/content-navigation.mjs';
import { contentRoutes } from '../src/data/content-routes.ts';

const entries = (await readEntries()).map(entry => ({ ...entry, data: guideSchema.parse(entry.data) }));
const { sources, claims } = await readEditorialData();
const groups = JSON.parse(await readFile(new URL('../src/data/faq.json', import.meta.url), 'utf8'));
const result = {
  mode: process.env.CONTENT_PREVIEW === 'true' ? 'preview' : 'production',
  locales: Object.fromEntries(['zh-hans', 'ja'].map(locale => {
    const localized = entries.filter(({ data }) => data.locale === locale);
    const published = entries.filter(({ data }) => data.locale === locale && isPublishable(data, { entries, sources, claims }));
    const topics = contentRoutes.flatMap(group => group.topics);
    const available = resolveQuestions(groups, locale, { entries, sources, claims });
    return [locale, {
      publishedGuides: published.filter(entry => entry.data.section === 'guides').length,
      publishedSystemGuides: published.filter(entry => entry.data.section === 'systems').length,
      awaitingReviewGuides: localized.filter(entry => entry.data.section === 'guides' && entry.data.status === 'draft').length,
      awaitingReviewSystemGuides: localized.filter(entry => entry.data.section === 'systems' && entry.data.status === 'draft').length,
      verifiedCharacterProfiles: entities.filter(entity => entity.kind === 'character' && isEntityCatalogPublishable(entity, locale, sources)).length,
      verifiedKiboProfiles: entities.filter(entity => entity.kind === 'kibo' && isEntityCatalogPublishable(entity, locale, sources)).length,
      publishedPracticalEntityDetails: entities.filter(entity => isEntityDetailPublishable(entity, locale, sources)).length,
      questions: available.flatMap(group => group.questions).length,
      currentAnswers: available.flatMap(group => group.questions).filter(question => question.available).length,
      missingTopics: topics.filter(id => !localized.some(entry => entry.data.contentId === id)),
      unpublishedTopics: topics.filter(id => localized.some(entry => entry.data.contentId === id) && !published.some(entry => entry.data.contentId === id)),
    }];
  }).concat([['en', {
    scope: 'Launch essentials: release dates, downloads and requirements',
    publishedGuides: entries.filter(({ data }) => data.locale === 'en' && isPublishable(data, { entries, sources, claims })).length,
    missingTopics: ['global-release', 'download', 'requirements'].filter(id => !entries.some(({ data }) => data.locale === 'en' && data.contentId === id)),
    unpublishedTopics: entries.filter(({ data }) => data.locale === 'en' && !isPublishable(data, { entries, sources, claims })).map(({ data }) => data.contentId),
  }]])),
};
console.log(JSON.stringify(result, null, 2));
