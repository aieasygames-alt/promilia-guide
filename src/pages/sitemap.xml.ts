import type { APIRoute } from 'astro';
import { allGuides, articlePath, isPublished, preview } from '../lib/content';
import { origin, locales } from '../lib/publication.mjs';
export const GET: APIRoute = async () => {
  const staticPaths = ['/', ...locales.flatMap((locale) => ['', 'about/', 'editorial-policy/', 'contact/', 'updates/'].map((path) => `/${locale}/${path}`))];
  const all = await allGuides();
  const entries = all.filter(({ data }) => isPublished(data, all));
  const catalogs = locales.flatMap((locale) => ['guides', 'systems'].filter((section) => entries.filter(({ data }) => data.locale === locale && data.section === section).length >= 2).map((section) => `/${locale}/${section}/`));
  const paths = preview ? [] : [...staticPaths, ...catalogs, ...entries.map(({ data }) => articlePath(data))];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
