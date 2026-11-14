import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';

export async function readEntries(folder = 'src/content/guides') {
  const entries = [];
  for (const item of await readdir(folder, { withFileTypes: true })) {
    const path = join(folder, item.name);
    if (item.isDirectory()) entries.push(...await readEntries(path));
    else if (item.name.endsWith('.md')) {
      const text = await readFile(path, 'utf8');
      const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if (!frontmatter) throw new Error(`${path}: missing frontmatter`);
      entries.push({ path, data: parse(frontmatter[1]), body: text.slice(frontmatter[0].length) });
    }
  }
  return entries;
}

export { validateEntries } from '../src/lib/content-integrity.mjs';
