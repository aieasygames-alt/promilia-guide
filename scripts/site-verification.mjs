import { load } from 'cheerio';
import { origin } from '../src/lib/publication.mjs';

export function normalizeTarget(value, local = false) {
  const url = new URL(value);
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(local && loopback && url.protocol === 'http:')) || (local && !loopback)) throw new Error('Use an HTTPS origin; --local only permits loopback URLs');
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('Provide an origin without credentials, path, query or fragment');
  return url.origin;
}

/** Check observed HTML/headers without conflating local Astro with Pages. */
export function inspectHtml({ body, headers = {}, path, mode, local = false }) {
  const $ = load(body);
  const issues = [];
  const meta = $('meta[name="robots"]').attr('content') || '';
  const robots = headers['x-robots-tag'] || '';
  const preview = mode === 'preview';
  if ($('h1').length !== 1) issues.push('Expected one h1');
  if ($('link[rel="canonical"]').attr('href') !== origin + path) issues.push('Canonical does not match the production article URL');
  if (preview && !/\bnoindex\b/i.test(meta)) issues.push('Preview HTML is missing noindex');
  if (preview && !local && !/\bnoindex\b/i.test(robots)) issues.push('Pages preview response is missing X-Robots-Tag: noindex');
  if (!preview && /\b(noindex|none)\b/i.test(`${meta},${robots}`)) issues.push('Production page is blocked from indexing');
  if (!local) {
    if (headers['x-content-type-options'] !== 'nosniff') issues.push('Missing X-Content-Type-Options: nosniff');
    if (headers['x-frame-options']?.toUpperCase() !== 'DENY') issues.push('Missing X-Frame-Options: DENY');
  }
  if (path === '/editorial/' && $('body').attr('data-pagefind-ignore') !== 'all') issues.push('Editorial workspace must be excluded from search');
  return issues;
}

export function inspectDiscovery({ robots, sitemap, mode }) {
  const issues = [];
  const $ = load(sitemap, { xmlMode: true });
  if (!$('urlset').length) issues.push('Missing XML sitemap urlset');
  const paths = $('loc').toArray().map((node) => $(node).text());
  if (mode === 'preview') {
    if (!/^Disallow:\s*\/\s*$/im.test(robots)) issues.push('Preview robots.txt must disallow all crawling');
    if (paths.length) issues.push('Preview sitemap must be empty');
  } else {
    if (/^Disallow:\s*\/\s*$/im.test(robots)) issues.push('Production robots.txt blocks all crawling');
    if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`)) issues.push('Production robots.txt has the wrong sitemap');
    if (!paths.includes(origin + '/zh-hans/') || !paths.includes(origin + '/ja/')) issues.push('Production sitemap is missing a language homepage');
  }
  if (paths.some((url) => !url.startsWith(origin + '/') || url.includes('/editorial/'))) issues.push('Sitemap contains a foreign origin or editorial workspace');
  return issues;
}

export function inspectManifest(manifest, mode) {
  const expected = mode === 'preview' ? 'editorial-preview' : 'production';
  if (manifest?.schemaVersion !== 1 || manifest?.mode !== expected || manifest?.origin !== origin || !Array.isArray(manifest?.articlePaths)) throw new Error(`Expected a ${expected} build manifest from this project`);
  if (manifest.articlePaths.length > 500 || !manifest.articlePaths.every((path) => /^\/(zh-hans|ja)\/(guides|systems)\/[a-z0-9-]+\/$/.test(path))) throw new Error('Build manifest contains invalid article paths');
  if (new Set(manifest.articlePaths).size !== manifest.articlePaths.length) throw new Error('Build manifest contains duplicate article paths');
  return manifest;
}
