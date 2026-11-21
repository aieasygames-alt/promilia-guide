import { redeemCodeSchema, validateRedeemCodes } from '../src/lib/redeem-codes.mjs';
import { readFile } from 'node:fs/promises';
import { readEntries, validateEntries } from './content-validation.mjs';
import { isPublishable } from '../src/lib/editorial.mjs';
import { z } from 'zod';
import { sourceSchema, claimSchema, guideSchema, distributionSchema } from '../src/lib/editorial-schema.mjs';
import { validateDistribution } from '../src/lib/distribution.mjs';
const sources = z.array(sourceSchema).parse(JSON.parse(await readFile('src/data/sources.json', 'utf8')));
const claims = z.array(claimSchema).parse(JSON.parse(await readFile('src/data/claims.json', 'utf8')));
const channels = z.array(distributionSchema).parse(JSON.parse(await readFile('src/data/distribution.json', 'utf8')));
const entries = (await readEntries()).map((entry) => ({ ...entry, data: guideSchema.parse(entry.data) }));
const codes = z.array(redeemCodeSchema).parse(JSON.parse(await readFile('src/data/redeem-codes.json', 'utf8')));
const errors = [...validateRedeemCodes(codes, sources), ...validateEntries(entries, sources, claims), ...validateDistribution(channels, claims, entries)];
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Content validated: ${entries.length} articles, ${entries.filter(({ data }) => isPublishable(data, { entries, sources, claims })).length} publishable; source refs, content IDs, routes, claims and translation revisions checked.`);
