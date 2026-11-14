import { z } from 'zod';

export const calendarDate = z.iso.date();
const nonempty = z.string().trim().min(1);
const httpsUrl = z.url().refine((value) => new URL(value).protocol === 'https:', 'Use an HTTPS source URL');
const localizedText = z.object({ summary: nonempty, detail: nonempty.optional() });

export const sourceSchema = z.object({
  id: nonempty,
  title: nonempty,
  publisher: nonempty,
  kind: z.enum(['project', 'official', 'official-store', 'test', 'community']),
  url: httpsUrl.nullable(),
  file: nonempty.optional(),
  publishedAt: calendarDate.nullable(),
  checkedAt: calendarDate.nullable(),
  gameVersion: nonempty,
  gameRegion: nonempty,
  status: z.enum(['planning-only', 'pending', 'verified', 'unavailable']),
  note: nonempty,
  excerpt: nonempty.optional(),
  evidenceFile: nonempty.optional(),
  localized: z.object({
    'zh-hans': z.object({ title: nonempty, note: nonempty }),
    ja: z.object({ title: nonempty, note: nonempty }),
  }).partial().optional(),
}).superRefine((source, ctx) => {
  if (source.status === 'verified' && (!source.url || !source.checkedAt || !source.excerpt)) {
    ctx.addIssue({ code: 'custom', message: 'Verified sources need an original URL, checkedAt and a short evidence excerpt' });
  }
  if (source.kind === 'project' && source.status === 'verified') {
    ctx.addIssue({ code: 'custom', message: 'Project plans cannot be verified game evidence' });
  }
});

export const claimSchema = z.object({
  id: nonempty,
  revision: z.number().int().positive(),
  text: nonempty,
  localized: z.object({ 'zh-hans': localizedText, ja: localizedText }),
  sourceRefs: z.array(nonempty).min(1),
  type: z.enum(['official', 'test', 'editorial', 'pending']),
  gameRegion: nonempty,
  gameVersion: nonempty,
  distributionScope: z.object({ region: z.enum(['cn', 'jp', 'tc']), release: z.enum(['public-launch', 'historical-test']) }).optional(),
  verification: z.enum(['verified', 'pending', 'conflicting']),
  affectedPages: z.array(nonempty).min(1),
  conflicts: z.array(nonempty).default([]),
  value: z.object({
    date: calendarDate.optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    timeZone: z.enum(['Asia/Shanghai', 'Asia/Tokyo']).optional(),
    url: httpsUrl.optional(),
    availability: z.enum(['reservation', 'preload', 'download']).optional(),
    platforms: z.array(nonempty).optional(),
    minimumOS: nonempty.optional(),
  }).default({}),
}).superRefine((claim, ctx) => {
  if (claim.verification === 'verified' && claim.conflicts.length) {
    ctx.addIssue({ code: 'custom', message: 'A verified claim cannot have unresolved conflicts' });
  }
  if (claim.verification !== 'verified' && Object.keys(claim.value).length) {
    ctx.addIssue({ code: 'custom', message: 'Unverified claims cannot expose actionable date, URL or platform values' });
  }
  if (claim.value.time && (!claim.value.date || !claim.value.timeZone)) {
    ctx.addIssue({ code: 'custom', message: 'A clock time needs a date and explicit time zone' });
  }
  if (claim.value.availability && !claim.value.url) {
    ctx.addIssue({ code: 'custom', message: 'Distribution availability needs an original entry URL' });
  }
});

export const distributionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  region: z.enum(['cn', 'jp']),
  platform: z.enum(['pc', 'android', 'ios']),
  entryClaim: nonempty,
  scheduleClaim: nonempty,
  preloadClaim: nonempty,
  compatibilityClaim: nonempty.optional(),
});

export const guideSchema = z.object({
  contentId: nonempty,
  locale: z.enum(['zh-hans', 'ja']),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  section: z.enum(['guides', 'systems']),
  title: nonempty,
  description: nonempty,
  author: nonempty,
  publishedAt: calendarDate,
  updatedAt: calendarDate,
  gameVersion: nonempty,
  gameRegion: nonempty,
  verification: z.enum(['official', 'test', 'editorial', 'pending']),
  status: z.enum(['draft', 'published']),
  sourceRefs: z.array(nonempty).min(1),
  claimRefs: z.array(nonempty).default([]),
  claimRevisions: z.record(z.string(), z.number().int().positive()).default({}),
  sourceRevision: z.number().int().positive(),
  translatedFromRevision: z.number().int().positive().optional(),
  translationStatus: z.enum(['draft', 'reviewed', 'published', 'needs-update']),
  reviewer: nonempty.optional(),
  reviewedAt: calendarDate.optional(),
  aliases: z.array(nonempty).default([]),
  related: z.array(nonempty).default([]),
  checklist: z.array(z.object({ id: nonempty, text: nonempty })).default([]),
  revisions: z.array(z.object({ date: calendarDate, note: nonempty })).default([]),
  order: z.number().default(99),
  minutes: z.number().positive().default(3),
});
