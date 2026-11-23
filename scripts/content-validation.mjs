import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';

async function readFolder(folder) {
  const entries = [];
  for (const item of await readdir(folder, { withFileTypes: true })) {
    const path = join(folder, item.name);
    if (item.isDirectory()) entries.push(...await readFolder(path));
    else if (item.name.endsWith('.md')) {
      const text = await readFile(path, 'utf8');
      const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if (!frontmatter) throw new Error(`${path}: missing frontmatter`);
      entries.push({ path, data: parse(frontmatter[1]), body: text.slice(frontmatter[0].length) });
    }
  }
  return entries;
}

// Pending revisions replace their approved counterpart only in editorial previews.
export function mergeEditorialRevisions(approved, revisions) {
  const identity = (entry) => `${entry.data.locale}:${entry.data.contentId}`;
  const replacements = new Map();
  for (const entry of revisions) {
    const key = identity(entry);
    const original = approved.find((item) => identity(item) === key);
    if (!original || original.data.slug !== entry.data.slug || original.data.section !== entry.data.section) throw new Error(`${entry.path}: revision must preserve an existing article route`);
    if (replacements.has(key)) throw new Error(`${entry.path}: duplicate editorial revision ${key}`);
    if (entry.data.sourceRevision <= original.data.sourceRevision) throw new Error(`${entry.path}: revision must be newer than the approved article`);
    if (entry.data.status !== 'draft' || entry.data.translationStatus !== 'draft' || entry.data.reviewer || entry.data.reviewedAt) throw new Error(`${entry.path}: pending revisions cannot inherit publication approval`);
    replacements.set(key, entry);
  }
  return approved.map((entry) => replacements.get(identity(entry)) || entry);
}

export async function readEntries(folder = 'src/content/guides') {
  const approved = await readFolder(folder);
  if (folder !== 'src/content/guides' || process.env.CONTENT_PREVIEW !== 'true') return approved;
  let revisions;
  try { revisions = await readFolder('src/content/revisions'); }
  catch (error) { if (error.code === 'ENOENT') return approved; throw error; }
  return mergeEditorialRevisions(approved, revisions);
}

export { validateEntries } from '../src/lib/content-integrity.mjs';
