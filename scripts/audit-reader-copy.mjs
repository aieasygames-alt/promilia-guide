import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { load } from 'cheerio';

// Audit rendered player pages: frontmatter and editorial-only routes are not reader copy.
const root = process.argv[2] || 'dist';
const internalCopy = [
  ['editorial-workflow', /本轮|今回クリック|本次核对边界|真实人工审核|译文审核|发布确认|会话确认|项目负责人|本会話|レビュー待ち|独立言語校閲|publication authorization/i],
  ['research-instructions', /可复核的战斗|唯一变化|验证三个小闭环|需要哪些证据|記録手順|唯一の変更点|does not invent|does not supply an invented/i],
  ['technical-log', /\bHEAD\b|fileSizeBytes|構築時点|构建时|検索インデックスがありません|请运行构建/i],
];
const files = (await readdir(root, { recursive: true })).filter(path => path.endsWith('.html')).sort();
const pages = [];
for (const file of files) {
  if (!/^(zh-hans|ja|en)\//.test(file) || /\/(editorial-policy|about|contact)\//.test(file)) continue;
  const $ = load(await readFile(join(root, file), 'utf8'));
  if ($('article[data-published="false"]').length) continue;
  $('script, style, nav, footer, #sources, .distribution-evidence').remove();
  const text = $('main').text().replace(/\s+/g, ' ');
  const findings = internalCopy.flatMap(([rule, pattern]) => {
    const match = pattern.exec(text);
    return match ? [{ rule, excerpt: text.slice(Math.max(0, match.index - 20), match.index + match[0].length + 60) }] : [];
  });
  const article = $('.prose').length > 0 && $('article[data-content-id]').length > 0;
  if (article && !$('.prose h2').length) findings.push({ rule: 'missing-reader-sections' });
  if (article && $('#revisions').text().match(/本会話|会话|审核|授权|publication authorized/i)) findings.push({ rule: 'internal-revision-history' });
  pages.push({ path: '/' + file.replace(/index\.html$/, ''), article, headings: $('.prose h2').map((_, node) => $(node).text()).get(), findings });
}
const failed = pages.filter(page => page.findings.length);
console.log(JSON.stringify({ passed: failed.length === 0, pages: pages.length, articles: pages.filter(page => page.article).length, failed, results: pages }, null, 2));
if (failed.length) process.exitCode = 1;
