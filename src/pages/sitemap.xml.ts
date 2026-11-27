import type { APIRoute } from 'astro';
import { allGuides, articlePath, isPublished, preview } from '../lib/content';
import { origin, referenceLocales as locales } from '../lib/publication.mjs';
import { entities } from '../data/entities';
import { sources } from '../lib/facts';
import { isEntityDetailPublishable } from '../lib/entity-publication.mjs';
import { visuals, pageVisuals } from '../lib/visuals';

export const GET: APIRoute = async () => {
  const staticPaths = ['/en/', '/en/faq/', '/en/characters/', '/en/kibo/', '/', ...locales.flatMap((locale) => ['', 'about/', 'editorial-policy/', 'contact/', 'updates/', 'characters/', 'kibo/', 'database/', 'faq/'].map((path) => `/${locale}/${path}`))];
  const all = await allGuides();
  const entries = all.filter(({ data }) => isPublished(data, all));
  const catalogs = locales.flatMap((locale) => ['guides', 'systems'].filter((section) => entries.filter(({ data }) => data.locale === locale && data.section === section).length >= 2).map((section) => `/${locale}/${section}/`));
  const entityPaths = locales.flatMap((locale) => entities.filter((entity) => isEntityDetailPublishable(entity, locale, sources)).map((entity) => `/${locale}/${entity.kind === 'character' ? 'characters' : 'kibo'}/${entity.id}/`));
  const paths = preview ? [] : [...staticPaths, ...catalogs, ...entityPaths, ...entries.map(({ data }) => articlePath(data))];
  const articleUpdates = new Map<string, string>(entries.map(({ data }) => [articlePath(data), data.updatedAt]));
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${paths.map((path) => `<url><loc>${origin}${path}</loc>${articleUpdates.has(path) ? `<lastmod>${articleUpdates.get(path)}</lastmod>` : ''}${pageVisuals(path).map(id => `<image:image><image:loc>${origin}${visuals[id].src}</image:loc></image:image>`).join('')}</url>`).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
