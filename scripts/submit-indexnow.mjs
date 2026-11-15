import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';

const HOST = 'promiliaguide.com';
const ORIGIN = `https://${HOST}`;
const KEY = process.env.INDEXNOW_KEY || 'b75df5f80b1d85cf0509daf00db815f3';
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;

const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

async function getUrlsToSubmit() {
  try {
    const sitemapContent = await readFile('dist/sitemap.xml', 'utf8');
    const $ = load(sitemapContent, { xmlMode: true });
    const urls = $('loc').map((_, el) => $(el).text().trim()).get();
    return [...new Set(urls)].filter((url) => url.startsWith(ORIGIN));
  } catch (error) {
    console.warn('Could not read dist/sitemap.xml, using fallback URL list:', error.message);
    return [
      `${ORIGIN}/zh-hans/`,
      `${ORIGIN}/ja/`,
      `${ORIGIN}/zh-hans/guides/launch/`,
      `${ORIGIN}/ja/guides/launch/`,
      `${ORIGIN}/zh-hans/guides/redeem-codes/`,
      `${ORIGIN}/ja/guides/redeem-codes/`,
      `${ORIGIN}/zh-hans/guides/reroll/`,
      `${ORIGIN}/ja/guides/reroll/`,
      `${ORIGIN}/zh-hans/characters/`,
      `${ORIGIN}/ja/characters/`,
      `${ORIGIN}/zh-hans/kibo/`,
      `${ORIGIN}/ja/kibo/`,
    ];
  }
}

async function submitIndexNow() {
  const urls = await getUrlsToSubmit();
  console.log(`\n[IndexNow] Preparing to submit ${urls.length} URLs for host: ${HOST}`);
  console.log(`[IndexNow] Key Location: ${KEY_LOCATION}\n`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const results = [];

  for (const endpoint of ENDPOINTS) {
    console.log(`[IndexNow] Submitting to: ${endpoint} ...`);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'User-Agent': 'PromiliaGuide-IndexNowSubmitter/1.0',
        },
        body: JSON.stringify(payload),
      });

      const status = response.status;
      const text = await response.text();
      const success = [200, 202].includes(status);

      results.push({ endpoint, status, success, text });
      console.log(`  -> Status: ${status} (${success ? 'SUCCESS/QUEUED' : 'FAILED'})`);
      if (text && !success) {
        console.log(`  -> Response: ${text}`);
      }
    } catch (err) {
      console.error(`  -> Network/Fetch Error for ${endpoint}:`, err.message);
      results.push({ endpoint, status: 0, success: false, error: err.message });
    }
  }

  console.log('\n[IndexNow] Summary:');
  for (const res of results) {
    console.log(`  - ${res.endpoint}: HTTP ${res.status} ${res.success ? '✔' : '✖'}`);
  }

  const anySuccess = results.some((r) => r.success);
  if (!anySuccess) {
    console.warn('\nNote: If verification failed with 403 or 400, make sure the key file at https://promiliaguide.com/' + KEY + '.txt is deployed and publicly accessible on your production CDN.');
  } else {
    console.log('\n[IndexNow] Successfully submitted URLs to search engines!');
  }
}

submitIndexNow().catch((err) => {
  console.error('[IndexNow] Fatal error:', err);
  process.exit(1);
});
