import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { guideSchema } from './lib/editorial-schema.mjs';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: guideSchema,
});
export const collections = { guides };
