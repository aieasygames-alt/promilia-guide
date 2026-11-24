import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { sourceSchema, claimSchema } from '../src/lib/editorial-schema.mjs';
import { selectClaimRevisions } from '../src/lib/claim-revisions.mjs';

export async function readEditorialData({ preview = process.env.CONTENT_PREVIEW === 'true' } = {}) {
  const read = async (name) => JSON.parse(await readFile(`src/data/${name}.json`, 'utf8'));
  const [rawSources, rawClaims, rawRevisions] = await Promise.all([read('sources'), read('claims'), read('claim-revisions')]);
  const sources = z.array(sourceSchema).parse(rawSources);
  const approved = z.array(claimSchema).parse(rawClaims);
  const revisions = z.array(claimSchema).parse(rawRevisions);
  return { sources, claims: selectClaimRevisions(approved, revisions, preview) };
}
