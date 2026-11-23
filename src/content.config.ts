import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { guideSchema } from './lib/editorial-schema.mjs';
import { readEntries } from '../scripts/content-validation.mjs';

const revisions = (await readEntries()).map((entry: { path: string }) => entry.path.replace(/^src\/content\//, '')).filter((path: string) => path.startsWith('revisions/'));
const files = ['guides/**/*.md', ...revisions, ...revisions.map((path: string) => `!${path.replace(/^revisions\//, 'guides/')}`)];

const guides = defineCollection({
  loader: glob({ pattern: files, base: './src/content', generateId: ({ entry }) => entry.replace(/^(guides|revisions)\//, '').replace(/\.md$/, '') }),
  schema: guideSchema,
});
export const collections = { guides };
