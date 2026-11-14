import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { normalizeTarget, inspectHtml, inspectDiscovery, inspectManifest, inspectRedirect } from '../scripts/site-verification.mjs';
const origin = 'https://promiliaguide.com';
const html = (path, preview) => `<html><head><link rel="canonical" href="${origin}${path}"><meta name="robots" content="${preview ? 'noindex,follow' : 'index,follow'}"></head><body${path === '/editorial/' ? ' data-pagefind-ignore="all"' : ''}><h1>Fixture</h1></body></html>`;
const headers = { 'x-robots-tag': 'noindex', 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY' };
const manifest = (preview) => ({ schemaVersion: 1, mode: preview ? 'editorial-preview' : 'production', origin, articlePaths: [] });

test('a local Astro check never passes as hosted Pages response-header verification', () => {
  const input = { body: html('/ja/', true), headers: {}, path: '/ja/', mode: 'preview' };
  assert.ok(inspectHtml(input).some((issue) => issue.includes('X-Robots-Tag')));
  assert.deepEqual(inspectHtml({ ...input, local: true }), []);
  assert.deepEqual(inspectHtml({ ...input, headers }), []);
  assert.ok(inspectHtml({ ...input, body: html('/ja/', false), headers }).some((issue) => issue.includes('HTML')));
});

test('production checks catch inherited noindex, wrong canonical and draft artifacts', () => {
  assert.ok(inspectHtml({ body: html('/ja/', false), headers, path: '/ja/', mode: 'production' }).some((issue) => issue.includes('blocked')));
  assert.ok(inspectHtml({ body: html('/zh-hans/', false), path: '/ja/', mode: 'production', local: true }).some((issue) => issue.includes('Canonical')));
  assert.throws(() => inspectManifest(manifest(true), 'production'), /production/);
  assert.throws(() => inspectManifest({ ...manifest(false), articlePaths: ['https://example.com/'] }, 'production'), /invalid article/);
  assert.throws(() => normalizeTarget('https://user:secret@example.com'), /credentials/);
  assert.throws(() => normalizeTarget('http://example.com', true), /loopback/);
});

test('discovery checks distinguish an empty editorial sitemap from an indexable production sitemap', () => {
  const preview = { robots: 'User-agent: *\nDisallow: /\n', sitemap: '<urlset/>', mode: 'preview' };
  assert.deepEqual(inspectDiscovery(preview), []);
  assert.ok(inspectDiscovery({ ...preview, mode: 'production' }).length > 0);
  const sitemap = `<urlset><url><loc>${origin}/zh-hans/</loc></url><url><loc>${origin}/ja/</loc></url></urlset>`;
  assert.deepEqual(inspectDiscovery({ robots: `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml`, sitemap, mode: 'production' }), []);
  assert.ok(inspectDiscovery({ ...preview, sitemap }).some((issue) => issue.includes('empty')));
});

test('expected commit rejects stale or missing manifests even when production mode matches', () => {
  const sha = 'a'.repeat(40);
  assert.throws(() => inspectManifest(manifest(false), 'production', sha), /commit mismatch/);
  assert.throws(() => inspectManifest({ ...manifest(false), commitSha: 'b'.repeat(40) }, 'production', sha), /commit mismatch/);
  assert.equal(inspectManifest({ ...manifest(false), commitSha: sha }, 'production', sha).commitSha, sha);
  assert.throws(() => inspectManifest(manifest(false), 'production', 'short'), /full Git SHA/);
});

test('canonical redirects preserve deep paths and repeated encoded query values', async () => {
  const suffix = '/ja/guides/download/?tag=a&tag=b&note=%E6%B5%8B%E8%AF%95';
  const start = 'http://www.promiliaguide.com' + suffix;
  const hops = await inspectRedirect(start, async (url) => url === start
    ? new Response(null, { status: 301, headers: { location: 'https://www.promiliaguide.com' + suffix } })
    : url.startsWith('https://www.') ? new Response(null, { status: 301, headers: { location: origin + suffix } })
      : new Response('OK'));
  assert.equal(hops.length, 3);
  assert.equal(hops.at(-1).url, origin + suffix);
});

test('redirect verifier rejects loops, foreign hosts, temporary redirects and lost queries', async () => {
  const start = 'https://promilia-guide.pages.dev/zh-hans/?a=1&a=2';
  for (const [status, location, message] of [
    [301, start, /loop/],
    [301, 'https://example.com/zh-hans/?a=1&a=2', /approved/],
    [302, origin + '/zh-hans/?a=1&a=2', /permanent/],
    [301, origin + '/zh-hans/?a=1', /query/],
    [301, origin + '/?a=1&a=2', /path/],
  ]) await assert.rejects(inspectRedirect(start, async () => new Response(null, { status, headers: { location } })), message);
});

test('site CLI validates observed routes and rejects false HTTP 404 responses', async () => {
  let fallback = false;
  const server = createServer((request, response) => {
    const route = request.url;
    if (route === '/build-info.json') return response.end(JSON.stringify(manifest(true)));
    if (route === '/robots.txt') return response.end('User-agent: *\nDisallow: /\n');
    if (route === '/sitemap.xml') return response.end('<urlset/>');
    if (route === '/pagefind/pagefind.js') return response.end('/* fixture */');
    if (['/zh-hans/', '/ja/', '/zh-hans/updates/', '/ja/updates/', '/editorial/'].includes(route)) return response.end(html(route, true));
    response.statusCode = fallback ? 200 : 404; response.end('Unknown route');
  }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const run = () => promisify(execFile)(process.execPath, ['scripts/verify-site.mjs', '--url', `http://127.0.0.1:${server.address().port}`, '--mode', 'preview', '--local', '--json']);
  try {
    const { stdout } = await run();
    const result = JSON.parse(stdout);
    assert.equal(result.passed, true);
    assert.equal(result.environment, 'local-astro-preview');
    fallback = true;
    await assert.rejects(run(), (error) => {
      assert.equal(error.code, 1);
      const result = JSON.parse(error.stdout);
      assert.equal(result.passed, false);
      assert.ok(result.checks.some((check) => !check.passed && check.detail.includes('received 200')));
      return true;
    });
  } finally { server.close(); }
});
