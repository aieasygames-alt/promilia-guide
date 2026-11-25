import { z } from 'zod';
import { articlePath } from './publication.mjs';
import { publicationIssues, beijingDate } from './editorial.mjs';

const uniqueIds = z.array(z.string().trim().min(1)).refine((values) => new Set(values).size === values.length, 'Duplicate IDs');
export const releasePlanSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1),
  locales: z.array(z.enum(['zh-hans', 'ja', 'en'])).min(1).refine((values) => new Set(values).size === values.length, 'Duplicate locales'),
  topics: z.array(z.object({ contentId: z.string().trim().min(1), label: z.string().trim().min(1), requiredClaims: uniqueIds.default([]) })).min(1),
}).refine((plan) => new Set(plan.topics.map((topic) => topic.contentId)).size === plan.topics.length, 'Duplicate release topics');

/** @param {{ plan: z.infer<typeof releasePlanSchema>, entries: any[], sources: any[], claims: any[], validationIssues?: string[], asOf?: string }} context */
export function createReleaseReport({ plan, entries, sources, claims, validationIssues = [], asOf = beijingDate() }) {
  const validated = releasePlanSchema.parse(plan);
  const issues = [...validationIssues];
  for (const topic of validated.topics) {
    for (const id of topic.requiredClaims) if (!claims.some((claim) => claim.id === id)) issues.push(`${topic.contentId}: 首发计划引用不存在的事实 ${id}`);
  }
  const articles = validated.topics.flatMap((topic) => validated.locales.map((locale) => {
    const matches = entries.filter(({ data }) => data.contentId === topic.contentId && data.locale === locale);
    const entry = matches[0];
    /** @type {{ code: string, message: string }[]} */
    const blockers = [];
    /** @type {{ code: string, message: string }[]} */
    const warnings = [];
    if (!entry) blockers.push({ code: 'missing-article', message: '缺少此语言稿件' });
    else {
      if (matches.length > 1) blockers.push({ code: 'duplicate-article', message: '同主题同语言存在重复稿件' });
      const articleIssues = publicationIssues(entry.data, { entries, sources, claims });
      blockers.push(...articleIssues.filter((issue) => issue.severity === 'blocker'));
      warnings.push(...articleIssues.filter((issue) => issue.severity === 'warning'));
      for (const id of topic.requiredClaims) if (!entry.data.claimRefs?.includes(id)) blockers.push({ code: 'missing-required-claim', message: `缺少首发必要事实引用：${id}` });
      if (typeof entry.body !== 'string' || !entry.body.trim()) blockers.push({ code: 'empty-body', message: '缺少正文，不能仅凭元数据发布' });
    }
    return { contentId: topic.contentId, label: topic.label, locale, title: entry?.data.title || null, file: entry?.path || null, url: entry ? articlePath(entry.data) : null, ready: blockers.length === 0, blockers, warnings };
  }));
  const readyArticles = articles.filter((article) => article.ready).length;
  return {
    planId: validated.id, title: validated.title, asOf,
    ready: issues.length === 0 && readyArticles === articles.length,
    summary: { required: articles.length, ready: readyArticles, missing: articles.filter((article) => article.blockers.some((issue) => issue.code === 'missing-article')).length, awaitingReview: articles.filter((article) => article.blockers.some((issue) => issue.code === 'manual-review')).length, stale: articles.filter((article) => article.blockers.some((issue) => ['stale-claim', 'stale-translation'].includes(issue.code))).length },
    locales: validated.locales.map((locale) => ({ locale, required: validated.topics.length, ready: articles.filter((article) => article.locale === locale && article.ready).length })),
    validationIssues: issues,
    articles,
  };
}

export function releaseGateIssues(report, { preview = false } = {}) {
  return [...(preview ? ['正式发布检查不能使用 CONTENT_PREVIEW=true；请使用普通构建预览草稿。'] : []), ...(report.ready ? [] : [`首批内容尚未就绪：${report.summary.ready}/${report.summary.required} 篇满足发布条件。`])];
}
