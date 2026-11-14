import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { readEntries } from './content-validation.mjs';
import { articlePath, origin } from '../src/lib/publication.mjs';
import { isPublishable } from '../src/lib/editorial.mjs';
import { sourceSchema, claimSchema, guideSchema } from '../src/lib/editorial-schema.mjs';
import { z } from 'zod';

async function files(folder) {
  const result = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = join(folder, entry.name);
    if (entry.isDirectory()) result.push(...await files(file)); else result.push(file);
  }
  return result;
}
const allFiles = new Set(await files('dist'));
const htmlFiles = [...allFiles].filter((file) => file.endsWith('.html'));
const pages = new Map();
const errors = [];
const fail = (message) => errors.push(message);
const isPreview = process.env.CONTENT_PREVIEW === 'true';
for (const file of htmlFiles) {
  const $ = load(await readFile(file, 'utf8'));
  const path = file === 'dist/404.html' ? '/404/' : file.replace(/^dist/, '').replace(/index\.html$/, '');
  pages.set(path, { $, file });
  if ($('h1').length !== 1) fail(`${file}: expected exactly one h1`);
  if (!$('html').attr('lang')) fail(`${file}: missing language`);
  const canonical = $('link[rel=canonical]').attr('href');
  if (!canonical?.startsWith(origin + '/')) fail(`${file}: canonical must use production origin`);
  if (path !== '/404/' && canonical !== origin + path) fail(`${file}: canonical must reference this page`);
  if (isPreview && !$('meta[name=robots]').attr('content')?.includes('noindex')) fail(`${file}: preview must be noindex`);
  for (const script of $('script[type="application/ld+json"]').toArray()) {
    try { JSON.parse($(script).text()); } catch { fail(`${file}: invalid JSON-LD`); }
  }
  for (const node of $('img[src],script[src],link[rel=stylesheet][href]').toArray()) {
    const src = $(node).attr('src') || $(node).attr('href');
    if (src?.startsWith('/') && !allFiles.has('dist' + new URL(src, origin).pathname)) fail(`${file}: missing local asset ${src}`);
  }
}
for (const [path, { $, file }] of pages) {
  for (const link of $('a[href]').toArray()) {
    const href = $(link).attr('href');
    if (!href?.startsWith('/') && !href?.startsWith('#')) continue;
    const target = new URL(href, origin + path);
    const destination = pages.get(target.pathname);
    if (!destination && !allFiles.has('dist' + target.pathname)) fail(`${file}: broken internal link ${href}`);
    if (destination && target.hash) {
      const id = decodeURIComponent(target.hash.slice(1));
      if (!destination.$('[id]').toArray().some((node) => destination.$(node).attr('id') === id)) fail(`${file}: broken anchor ${href}`);
    }
  }
  for (const alt of $('link[rel=alternate][hreflang]').toArray()) {
    const lang = $(alt).attr('hreflang');
    const href = $(alt).attr('href');
    const target = pages.get(new URL(href).pathname);
    if (!target) { fail(`${file}: missing alternate target ${href}`); continue; }
    if (lang !== 'x-default' && !target.$('link[rel=alternate]').toArray().some((node) => target.$(node).attr('href') === origin + path)) fail(`${file}: alternate does not link back ${href}`);
  }
}
const entries = (await readEntries()).map((entry) => ({ ...entry, data: guideSchema.parse(entry.data) }));
const sources = z.array(sourceSchema).parse(JSON.parse(await readFile('src/data/sources.json', 'utf8')));
const claims = z.array(claimSchema).parse(JSON.parse(await readFile('src/data/claims.json', 'utf8')));
const context = { entries, sources, claims };
for (const { data } of entries) {
  if (!isPreview && !isPublishable(data, context) && pages.has(articlePath(data))) fail(`Production contains unpublished article ${articlePath(data)}`);
  if ((isPreview || isPublishable(data, context)) && !pages.has(articlePath(data))) fail(`Missing article ${articlePath(data)}`);
}
if (pages.has('/editorial/') !== isPreview) fail('Editorial workspace must exist only in preview builds');
if (pages.get('/editorial/')?.$('[data-pagefind-body]').length) fail('Editorial workspace must not be searchable');
const sitemapText = await readFile('dist/sitemap.xml', 'utf8');
const sitemap = load(sitemapText, { xmlMode: true });
for (const loc of sitemap('loc').toArray()) {
  const url = sitemap(loc).text(); const page = pages.get(new URL(url).pathname);
  if (new URL(url).pathname.startsWith('/editorial/')) fail('Editorial workspace must not enter sitemap');
  if (!page) fail(`Sitemap points to nonexistent page ${url}`);
  else if (page.$('meta[name=robots]').attr('content')?.includes('noindex')) fail(`Sitemap contains noindex page ${url}`);
}
if (isPreview && sitemap('loc').length) fail('Preview sitemap must be empty');
assert(allFiles.has('dist/404.html'), 'Cloudflare Pages requires a top-level 404.html');
assert(allFiles.has('dist/pagefind/pagefind.js'), 'Pagefind bundle missing');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
if (isPreview) {
  const headers = await readFile('dist/_headers', 'utf8');
  await writeFile('dist/_headers', headers.replace('/*\n', '/*\n  X-Robots-Tag: noindex, nofollow\n'));
}
await writeFile('dist/build-info.json', JSON.stringify({
  schemaVersion: 1,
  mode: isPreview ? 'editorial-preview' : 'production',
  origin,
  generatedAt: new Date().toISOString(),
  articlePaths: entries.filter(({ data }) => isPreview || isPublishable(data, context)).map(({ data }) => articlePath(data)).sort(),
}, null, 2) + '\n');
console.log(`Build verified: ${htmlFiles.length} HTML pages; internal links, anchors, canonical, hreflang, sitemap, JSON-LD, search bundle and draft isolation passed (${isPreview ? 'editorial preview' : 'production'}).`);
