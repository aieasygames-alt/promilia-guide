import { entities } from '../src/data/entities.ts';
import { isEntityCatalogPublishable, isEntityDetailPublishable } from '../src/lib/entity-publication.mjs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { readEntries } from './content-validation.mjs';
import { articlePath, origin } from '../src/lib/publication.mjs';
import { isPublishable } from '../src/lib/editorial.mjs';
import { guideSchema } from '../src/lib/editorial-schema.mjs';
import { readEditorialData } from './editorial-data.mjs';

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
const commitSha = process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || null;
if (commitSha && !/^[a-f0-9]{40}$/.test(commitSha)) fail('Build commit must be a full Git SHA');
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
  if (!$('meta[name=robots]').attr('content')?.includes('noindex') && !$('meta[name=robots]').attr('content')?.includes('max-image-preview:large')) fail(`${file}: indexable page must allow large image previews`);
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (!ogImage?.startsWith(origin + '/') || !allFiles.has('dist' + new URL(ogImage, origin).pathname)) fail(`${file}: social image must be an existing canonical asset`);
  if ($('meta[name="twitter:image"]').attr('content') !== ogImage) fail(`${file}: Twitter and Open Graph images must agree`);
  if (ogImage && !ogImage.endsWith('/images/social.png')) {
    const image = $('img').toArray().find(node => origin + $(node).attr('src') === ogImage);
    if (!image) fail(`${file}: representative image must be visible in the page HTML`);
    else {
      if ($(image).attr('width') !== $('meta[property="og:image:width"]').attr('content') || $(image).attr('height') !== $('meta[property="og:image:height"]').attr('content')) fail(`${file}: social dimensions must match the visible image`);
      if ($(image).attr('alt') !== $('meta[property="og:image:alt"]').attr('content')) fail(`${file}: social alt must match the localized visible image`);
    }
    const structured = $('script[type="application/ld+json"]').text();
    if (!structured.includes(ogImage)) fail(`${file}: structured data must include the representative image`);
  }
  const structuredNodes = [];
  const collectStructuredNodes = (value) => {
    if (Array.isArray(value)) return value.forEach(collectStructuredNodes);
    if (!value || typeof value !== 'object') return;
    structuredNodes.push(value);
    if (value['@graph']) collectStructuredNodes(value['@graph']);
  };
  for (const script of $('script[type="application/ld+json"]').toArray()) {
    try { collectStructuredNodes(JSON.parse($(script).text())); } catch { fail(`${file}: invalid JSON-LD`); }
  }
  const articles = structuredNodes.filter(node => node['@type'] === 'Article');
  if ($('meta[property="og:type"]').attr('content') !== (articles.length ? 'article' : 'website')) fail(`${file}: Open Graph type must match the actual page schema`);
  for (const article of articles) {
    if (article.headline !== $('h1').text().trim()) fail(`${file}: Article headline must match its visible heading`);
    if (article.description !== $('meta[name=description]').attr('content')) fail(`${file}: Article description must match its page metadata`);
    if (article.inLanguage !== $('html').attr('lang')) fail(`${file}: Article language must match the page language`);
    if (article.url !== canonical || article.mainEntityOfPage !== canonical) fail(`${file}: Article must identify its canonical page`);
    if (article.publisher?.['@type'] !== 'Organization' || article.publisher.url !== origin) fail(`${file}: Article must identify the site publisher`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(article.datePublished || '') || !/^\d{4}-\d{2}-\d{2}$/.test(article.dateModified || '') || article.dateModified < article.datePublished) fail(`${file}: Article dates must be valid and ordered`);
  }
  for (const node of $('img[src],script[src],link[rel=stylesheet][href]').toArray()) {
    const src = $(node).attr('src') || $(node).attr('href');
    if (src?.startsWith('/') && !allFiles.has('dist' + new URL(src, origin).pathname)) fail(`${file}: missing local asset ${src}`);
  }
  for (const node of $('img[srcset]').toArray()) for (const candidate of $(node).attr('srcset').split(',')) {
    const src = candidate.trim().split(/\s+/)[0];
    if (src.startsWith('/') && !allFiles.has('dist' + src)) fail(`${file}: missing responsive image ${src}`);
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
  const alternateLanguages = new Set();
  const alternates = $('link[rel=alternate][hreflang]').toArray();
  if (alternates.length && path !== '/' && !alternates.some(alt => $(alt).attr('hreflang') === $('html').attr('lang') && $(alt).attr('href') === origin + path)) fail(`${file}: alternate cluster must include this page with its own language`);
  for (const alt of alternates) {
    const lang = $(alt).attr('hreflang');
    const href = $(alt).attr('href');
    if (alternateLanguages.has(lang)) fail(`${file}: duplicate hreflang ${lang}`);
    alternateLanguages.add(lang);
    let targetUrl;
    try { targetUrl = new URL(href); } catch { fail(`${file}: invalid alternate URL ${href}`); continue; }
    if (targetUrl.origin !== origin || targetUrl.search || targetUrl.hash) fail(`${file}: alternate must use a clean production URL ${href}`);
    const target = pages.get(targetUrl.pathname);
    if (!target) { fail(`${file}: missing alternate target ${href}`); continue; }
    if (target.$('meta[name=robots]').attr('content')?.includes('noindex')) fail(`${file}: alternate target must be indexable ${href}`);
    if (target.$('link[rel=canonical]').attr('href') !== href) fail(`${file}: alternate target must be canonical ${href}`);
    if (lang !== 'x-default' && lang?.toLowerCase() !== target.$('html').attr('lang')?.toLowerCase()) fail(`${file}: alternate language does not match its target ${href}`);
    if (lang !== 'x-default' && !target.$('link[rel=alternate]').toArray().some((node) => target.$(node).attr('href') === origin + path && (path === '/' || target.$(node).attr('hreflang') === $('html').attr('lang')))) fail(`${file}: alternate does not link back with the correct language ${href}`);
  }
}
const entries = (await readEntries()).map((entry) => ({ ...entry, data: guideSchema.parse(entry.data) }));
const { sources, claims } = await readEditorialData();
const context = { entries, sources, claims };
for (const { data } of entries) {
  if (!isPreview && !isPublishable(data, context) && pages.has(articlePath(data))) fail(`Production contains unpublished article ${articlePath(data)}`);
  if ((isPreview || isPublishable(data, context)) && !pages.has(articlePath(data))) fail(`Missing article ${articlePath(data)}`);
}
if (pages.has('/editorial/') !== isPreview) fail('Editorial workspace must exist only in preview builds');
if (pages.get('/editorial/')?.$('[data-pagefind-body]').length) fail('Editorial workspace must not be searchable');
const sitemapText = await readFile('dist/sitemap.xml', 'utf8');
const sitemap = load(sitemapText, { xmlMode: true });
const articleUpdates = new Map(entries.filter(({ data }) => isPublishable(data, context)).map(({ data }) => [articlePath(data), data.updatedAt]));
const sitemapPaths = new Set();
for (const node of sitemap('url').toArray()) {
  const item = sitemap(node);
  const url = item.children('loc').text();
  const path = new URL(url).pathname;
  const page = pages.get(path);
  if (sitemapPaths.has(path)) fail(`Sitemap repeats page ${path}`);
  sitemapPaths.add(path);
  if (path.startsWith('/editorial/')) fail('Editorial workspace must not enter sitemap');
  if (!page) fail(`Sitemap points to nonexistent page ${url}`);
  else if (page.$('meta[name=robots]').attr('content')?.includes('noindex')) fail(`Sitemap contains noindex page ${url}`);
  const lastmod = item.children('lastmod');
  if (articleUpdates.has(path)) {
    if (lastmod.length !== 1 || lastmod.text() !== articleUpdates.get(path)) fail(`Sitemap lastmod must match the article's actual updatedAt ${path}`);
  } else if (lastmod.length) fail(`Sitemap must not invent an update date for a non-article page ${path}`);
  for (const image of item.find('image\\:loc').toArray()) {
    const src = sitemap(image).text();
    if (!src.startsWith(origin + '/') || !allFiles.has('dist' + new URL(src, origin).pathname)) fail(`Sitemap image must be an existing canonical asset: ${src}`);
    if (!page?.$('img').toArray().some(node => origin + page.$(node).attr('src') === src)) fail(`Sitemap image must appear in the page HTML: ${path} ${src}`);
  }
}
if (!isPreview) for (const path of articleUpdates.keys()) {
  if (!sitemapPaths.has(path)) fail(`Published article missing from sitemap ${path}`);
}

// Check the generic crawler's longest matching rule, with Allow winning ties.
function robotsAllows(robots, path) {
  const groups = [];
  let group = { agents: [], rules: [] };
  for (const line of robots.split(/\r?\n/)) {
    const match = line.replace(/#.*/, '').trim().match(/^(user-agent|allow|disallow)\s*:\s*(.*)$/i);
    if (!match) continue;
    const directive = match[1].toLowerCase(), value = match[2].trim();
    if (directive === 'user-agent') {
      if (group.rules.length) { groups.push(group); group = { agents: [], rules: [] }; }
      group.agents.push(value.toLowerCase());
    } else if (value) group.rules.push({ allow: directive === 'allow', pattern: value });
  }
  groups.push(group);
  const matches = groups.filter(group => group.agents.includes('*')).flatMap(group => group.rules).filter(rule => {
    const pattern = rule.pattern.replace(/[.+?^{}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    return new RegExp('^' + pattern).test(path);
  }).sort((a, b) => b.pattern.length - a.pattern.length || Number(b.allow) - Number(a.allow));
  return matches[0]?.allow ?? true;
}
const robots = await readFile('dist/robots.txt', 'utf8');
for (const locale of ['zh-hans', 'ja', 'en']) {
  const path = `/${locale}/search/`, page = pages.get(path);
  if (!page?.$('meta[name=robots]').attr('content')?.includes('noindex')) fail(`Search page must remain noindex ${path}`);
  if (sitemapPaths.has(path)) fail(`Search page must not enter sitemap ${path}`);
  if (!isPreview && !robotsAllows(robots, path)) fail(`Production robots must allow crawlers to read the search page's noindex ${path}`);
}
for (const entity of entities) for (const locale of ['zh-hans', 'ja']) {
  const path = `/${locale}/${entity.kind === 'character' ? 'characters' : 'kibo'}/${entity.id}/`;
  const page = pages.get(path);
  if (!isPreview && !isEntityCatalogPublishable(entity, locale, sources) && page) fail(`Production contains pending entity ${path}`);
  if (page && !isEntityDetailPublishable(entity, locale, sources)) {
    if (!page.$('meta[name=robots]').attr('content')?.includes('noindex')) fail(`Unreviewed entity must be noindex ${path}`);
    if (page.$('[data-pagefind-body]').length || page.$('body').attr('data-pagefind-ignore') !== 'all') fail(`Unreviewed entity must not be searchable ${path}`);
    if (sitemapText.includes(origin + path + '<')) fail(`Unreviewed entity must not enter sitemap ${path}`);
  }
}
if (!isPreview && [...pages.keys()].some(path => path.startsWith('/editorial/'))) fail('Editorial fixtures must not enter production');
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
  commitSha,
  generatedAt: new Date().toISOString(),
  articlePaths: entries.filter(({ data }) => isPreview || isPublishable(data, context)).map(({ data }) => articlePath(data)).sort(),
}, null, 2) + '\n');
console.log(`Build verified: ${htmlFiles.length} HTML pages; internal links, anchors, canonical, hreflang, sitemap, JSON-LD, search bundle and draft isolation passed (${isPreview ? 'editorial preview' : 'production'}).`);
