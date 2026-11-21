import { z } from 'zod';
import { calendarDate } from './editorial-schema.mjs';

const timestamp = z.iso.datetime({ offset: true });
const localized = z.object({ 'zh-hans': z.string().trim().min(1), ja: z.string().trim().min(1) });
export const redeemCodeSchema = z.object({
  code: z.string().regex(/^[A-Z0-9_-]+$/),
  region: z.enum(['cn', 'jp', 'unconfirmed']),
  verification: z.enum(['pending', 'verified']),
  reward: localized.nullable(),
  availableAt: timestamp.nullable(),
  expiresAt: timestamp.nullable(),
  timeZone: z.enum(['Asia/Shanghai', 'Asia/Tokyo']).nullable(),
  redemptionMethod: localized.nullable(),
  sourceRefs: z.array(z.string().min(1)),
  checkedAt: calendarDate.nullable(),
}).strict().superRefine((item, ctx) => {
  if (item.verification === 'verified' && (item.region === 'unconfirmed' || !item.reward || !item.redemptionMethod || !item.sourceRefs.length || !item.checkedAt || !item.availableAt || !item.expiresAt || !item.timeZone)) ctx.addIssue({ code: 'custom', message: 'Verified codes need a region, reward, redemption instructions, dated evidence and an explicit validity window with time zone' });
  const zone = item.region === 'cn' ? 'Asia/Shanghai' : item.region === 'jp' ? 'Asia/Tokyo' : null;
  const offset = item.timeZone === 'Asia/Shanghai' ? '+08:00' : '+09:00';
  if (item.verification === 'verified' && (item.timeZone !== zone || !item.availableAt?.endsWith(offset) || !item.expiresAt?.endsWith(offset))) ctx.addIssue({ code: 'custom', message: 'Code region, time zone and timestamp offset must agree' });
  if (item.expiresAt && item.availableAt && Date.parse(item.expiresAt) <= Date.parse(item.availableAt)) ctx.addIssue({ code: 'custom', message: 'Code expiry must be later than availability' });
});

export function validateRedeemCodes(codes, sources) {
  const errors = [];
  const seen = new Set();
  for (const code of codes) {
    if (!redeemCodeSchema.safeParse(code).success) errors.push(`${code.code}: invalid redeem code record`);
    const key = `${code.region}:${code.code}`;
    if (seen.has(key)) errors.push(`Duplicate redeem code ${key}`);
    seen.add(key);
    for (const id of code.sourceRefs) {
      const source = sources.find((source) => source.id === id);
      if (!source) errors.push(`${code.code}: unknown source ${id}`);
      else if (code.verification === 'verified' && (source.status !== 'verified' || !['official', 'official-store'].includes(source.kind) || !source.checkedAt || !source.url?.startsWith('https://') || !source.excerpt)) errors.push(`${code.code}: verified code needs verified official evidence`);
    }
  }
  return errors;
}

/** @param {{codes: import('zod').infer<typeof redeemCodeSchema>[], sources: import('zod').infer<typeof import('./editorial-schema.mjs').sourceSchema>[], now?: Date, region?: string}} options */
export function redeemCodeRows({ codes, sources, now = new Date(), region }) {
  return codes.filter((code) => code.verification === 'verified' && (!region || code.region === region) && !validateRedeemCodes([code], sources).length && redeemCodeSchema.safeParse(code).success).map((code) => ({
    ...code,
    status: now.getTime() < Date.parse(code.availableAt) ? 'scheduled' : now.getTime() >= Date.parse(code.expiresAt) ? 'expired' : 'active',
  }));
}
