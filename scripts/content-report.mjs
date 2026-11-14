import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { readEntries } from './content-validation.mjs';
import { sourceSchema, claimSchema, guideSchema, calendarDate } from '../src/lib/editorial-schema.mjs';
import { createEditorialReport, findContentImpact } from '../src/lib/editorial.mjs';

try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    json: { type: 'boolean' }, source: { type: 'string' }, claim: { type: 'string' }, content: { type: 'string' }, at: { type: 'string' }, help: { type: 'boolean' },
  } });
  if (values.help) {
    console.log('npm run content:status -- [--json] [--at YYYY-MM-DD]\nnpm run content:impact -- --source SOURCE_ID | --claim CLAIM_ID | --content CONTENT_ID [--json]');
    process.exit(0);
  }
  const sources = z.array(sourceSchema).parse(JSON.parse(await readFile('src/data/sources.json', 'utf8')));
  const claims = z.array(claimSchema).parse(JSON.parse(await readFile('src/data/claims.json', 'utf8')));
  const entries = (await readEntries()).map((entry) => ({ ...entry, data: guideSchema.parse(entry.data) }));
  const context = { entries, sources, claims };
  const mode = positionals[0] || 'status';
  if (!['status', 'impact'].includes(mode)) throw new Error(`Unknown report mode: ${mode}`);
  const result = mode === 'impact' ? findContentImpact({ ...context, sourceId: values.source, claimId: values.claim, contentId: values.content })
    : createEditorialReport({ ...context, ...(values.at ? { asOf: calendarDate.parse(values.at) } : {}) });
  if (values.json) console.log(JSON.stringify(result, null, 2));
  else {
    if (mode === 'status') {
      const s = result.summary;
      console.log(`内容状态（${result.asOf}，北京时间）\n文章 ${s.articles} · 可发布 ${s.publishable} · 待人工审核 ${s.awaitingReview} · 需同步 ${s.staleArticles}\n来源 ${s.verifiedSources}/${s.sources} 已核验 · 事实 ${s.verifiedClaims}/${s.claims} 已核验\n`);
    } else console.log(`影响范围：${result.claims.length} 个事实、${result.articles.length} 篇语言稿（包括同主题译文）。\n`);
    console.table(result.articles.map((article) => ({
      主题: article.contentId, 语言: article.locale, 状态: article.translationStatus,
      原稿: article.sourceRevision, 译自: article.translatedFromRevision ?? '—',
      发布阻碍: article.blockers.map((issue) => issue.message).join('；') || '无',
    })));
    if (mode === 'status') {
      console.log('\n来源核对：');
      console.table(result.sources.map((source) => ({ 来源: source.id, 状态: source.status, 核对日期: source.checkedAt || '未核验', 影响文章: source.affectedArticles.length })));
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
