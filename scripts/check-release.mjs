import { redeemCodeSchema, validateRedeemCodes } from '../src/lib/redeem-codes.mjs';
import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { z } from 'zod';
import { readEntries, validateEntries } from './content-validation.mjs';
import { guideSchema, distributionSchema } from '../src/lib/editorial-schema.mjs';
import { validateDistribution } from '../src/lib/distribution.mjs';
import { createReleaseReport, releasePlanSchema, releaseGateIssues } from '../src/lib/release-readiness.mjs';
import { readEditorialData } from './editorial-data.mjs';

try {
  const { values } = parseArgs({ options: { json: { type: 'boolean' }, 'require-ready': { type: 'boolean' }, help: { type: 'boolean' } } });
  if (values.help) {
    console.log('npm run content:readiness -- [--json]\nnpm run release:check -- [--json]\nnpm run build:release\nReports are read-only. The release gate returns exit code 1 for missing reviews, stale content or preview mode.');
    process.exit(0);
  }
  const read = async (name) => JSON.parse(await readFile(`src/data/${name}.json`, 'utf8'));
  const [{ sources, claims }, rawChannels, rawPlan, rawEntries] = await Promise.all([readEditorialData(), read('distribution'), read('release-plan'), readEntries()]);
  const channels = z.array(distributionSchema).parse(rawChannels);
  const plan = releasePlanSchema.parse(rawPlan);
  const entries = rawEntries.map((entry) => ({ ...entry, data: guideSchema.parse(entry.data) }));
  const codes = z.array(redeemCodeSchema).parse(await read('redeem-codes'));
  const validationIssues = [...validateRedeemCodes(codes, sources), ...validateEntries(entries, sources, claims), ...validateDistribution(channels, claims, entries)];
  const report = createReleaseReport({ plan, entries, sources, claims, validationIssues });
  const englishReport = createReleaseReport({ plan: await read('english-release-plan'), entries, sources, claims, validationIssues });
  const additionalReleases = [englishReport];
  const gateIssues = values['require-ready'] ? [report, ...additionalReleases].flatMap(item => releaseGateIssues(item, { preview: process.env.CONTENT_PREVIEW === 'true' }).map(issue => `${item.planId}: ${issue}`)) : [];
  if (values.json) console.log(JSON.stringify({ ...report, additionalReleases, gateIssues }, null, 2));
  else {
    console.log(`${report.title}：${report.ready ? '就绪' : '待处理'} · ${report.summary.ready}/${report.summary.required} 篇可发布 · 缺稿 ${report.summary.missing} · 待人工审核 ${report.summary.awaitingReview} · 需同步 ${report.summary.stale}`);
    console.table(report.articles.map((article) => ({ 主题: article.label, 语言: article.locale, 状态: article.ready ? '可发布' : '待处理', 发布阻碍: article.blockers.map((issue) => issue.message).join('；') || '无', 核验提醒: article.warnings.map((issue) => issue.message).join('；') || '无' })));
    console.log(`${englishReport.title}: ${englishReport.summary.ready}/${englishReport.summary.required} ready`);
    [...report.validationIssues, ...gateIssues].forEach((issue) => console.log(issue));
    console.log('只读检查，不自动填写审核人、修改文章状态或执行云端发布。');
  }
  if (gateIssues.length || validationIssues.length) process.exitCode = 1;
} catch (error) { console.error(error.message); process.exitCode = 1; }
