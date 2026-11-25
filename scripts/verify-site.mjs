import { parseArgs } from 'node:util';
import { randomUUID } from 'node:crypto';
import { inspectHtml, inspectDiscovery, inspectManifest, inspectRedirect, normalizeTarget } from './site-verification.mjs';

let jsonOutput = false;
try {
  const { values } = parseArgs({ options: {
    url: { type: 'string' }, mode: { type: 'string' }, local: { type: 'boolean' }, json: { type: 'boolean' }, help: { type: 'boolean' },
    commit: { type: 'string' }, redirects: { type: 'boolean' },
  } });
  jsonOutput = values.json;
  if (values.help) {
    console.log('npm run site:verify -- --url https://YOUR-PREVIEW.pages.dev --mode preview [--commit FULL_SHA]\nnpm run site:verify -- --url https://promiliaguide.com --mode production --redirects [--commit FULL_SHA]\nnpm run site:verify -- --url http://127.0.0.1:4321 --mode preview --local [--json]');
    process.exit(0);
  }
  if (!values.url || !['production', 'preview'].includes(values.mode)) throw new Error('Specify --url ORIGIN and --mode production|preview');
  const target = normalizeTarget(values.url, values.local);
  if (values.redirects && (target !== 'https://promiliaguide.com' || values.mode !== 'production' || values.local)) throw new Error('--redirects requires the hosted production canonical origin');
  const checks = [];
  async function request(path, expected = 200) {
    try {
      const response = await fetch(target + path, { redirect: 'manual', signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'PromiliaGuide-SiteVerification/1.0' } });
      const result = { path, status: response.status, headers: Object.fromEntries(response.headers), body: await response.text() };
      checks.push({ path, check: 'http', passed: response.status === expected, detail: `Expected ${expected}, received ${response.status}` });
      return result;
    } catch (error) {
      checks.push({ path, check: 'http', passed: false, detail: error.message });
      return null;
    }
  }
  const manifestResponse = await request('/build-info.json');
  if (!manifestResponse || manifestResponse.status !== 200) throw new Error('Build manifest is unavailable; deploy the current build before checking');
  const manifest = inspectManifest(JSON.parse(manifestResponse.body), values.mode, values.commit);
  const paths = ['/zh-hans/', '/ja/', '/zh-hans/updates/', '/ja/updates/', '/zh-hans/database/', '/ja/database/', '/zh-hans/faq/', '/ja/faq/', ...manifest.articlePaths, ...(values.mode === 'preview' ? ['/editorial/'] : [])];
  for (let index = 0; index < paths.length; index += 4) {
    const batch = await Promise.all(paths.slice(index, index + 4).map(async (path) => {
      const response = await request(path);
      if (!response || response.status !== 200) return;
      const issues = inspectHtml({ ...response, mode: values.mode, local: values.local });
      checks.push({ path, check: 'html-and-headers', passed: issues.length === 0, detail: issues.join('; ') || 'Canonical, index policy and applicable headers passed' });
    }));
    void batch;
  }
  const [robots, sitemap] = await Promise.all([request('/robots.txt'), request('/sitemap.xml'), request('/pagefind/pagefind.js'), request(`/__site-verification-${randomUUID()}/`, 404), ...(values.mode === 'production' ? [request('/editorial/', 404)] : [])]);
  if (robots && sitemap) {
    const issues = inspectDiscovery({ robots: robots.body, sitemap: sitemap.body, mode: values.mode });
    checks.push({ path: '/robots.txt + /sitemap.xml', check: 'discovery', passed: issues.length === 0, detail: issues.join('; ') || 'Robots and sitemap passed' });
  }
  if (values.redirects) {
    const sources = ['https://promilia-guide.pages.dev', 'https://www.promiliaguide.com', 'http://promilia-guide.pages.dev', 'http://www.promiliaguide.com', 'http://promiliaguide.com'];
    const routes = ['/', '/zh-hans/guides/download/?utm_source=redirect-check&tag=a&tag=b&note=%E6%B5%8B%E8%AF%95', '/ja/guides/global-release/?utm_source=redirect-check&lang=ja'];
    for (const source of sources) {
      await Promise.all(routes.map(async (path) => {
        try {
          const hops = await inspectRedirect(source + path);
          checks.push({ path: source + path, check: 'canonical-redirect', passed: true, detail: 'Permanent redirects preserve path and query', hops });
        } catch (error) {
          checks.push({ path: source + path, check: 'canonical-redirect', passed: false, detail: error.message });
        }
      }));
    }
  }
  const passed = checks.every((check) => check.passed);
  const result = { target, mode: values.mode, commitSha: manifest.commitSha || null, expectedCommit: values.commit || null, environment: values.local ? 'local-astro-preview' : 'hosted', passed, generatedAt: new Date().toISOString(), articleCount: manifest.articlePaths.length, notes: values.local ? ['Local validation skips Pages response headers, HTTPS and DNS verification.'] : [], checks };
  if (values.json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`${passed ? 'PASS' : 'FAIL'} · ${target} · ${result.environment} · ${result.articleCount} articles`);
    for (const check of checks.filter((check) => !check.passed)) console.log(`FAIL ${check.path}: ${check.detail}`);
    console.log(`${checks.filter((check) => check.passed).length}/${checks.length} checks passed. This checks technical delivery; human content approval and real-device/network acceptance remain separate.`);
    result.notes.forEach((note) => console.log(note));
  }
  if (!passed) process.exitCode = 1;
} catch (error) {
  if (jsonOutput) console.log(JSON.stringify({ passed: false, error: error.message }, null, 2));
  else console.error(error.message);
  process.exitCode = 1;
}
