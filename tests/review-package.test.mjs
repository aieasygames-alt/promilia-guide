import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { archiveReviewPackage, reviewInputDigest, stageReviewPackage } from '../scripts/review-package.mjs';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'promilia-review-test-'));
  for (const dir of ['src/content/guides/ja', 'src/data', 'research', 'plans', 'public', 'scripts', 'dist', '.git']) await mkdir(join(root, dir), { recursive: true });
  const files = {
    'src/content/guides/ja/launch.md': 'Draft with no reviewer.\n', 'src/data/sources.json': '[]\n',
    'research/evidence.md': 'Original evidence.\n', 'plans/CONTENT-REVIEW.md': 'Review checklist.\n', 'plans/LOCALIZATION-PLAN.md': 'Locale policy.\n',
    'public/asset.svg': '<svg/>', 'scripts/build.mjs': '// build\n', 'astro.config.mjs': '// config\n',
    'package.json': '{}', 'package-lock.json': '{}', 'tsconfig.json': '{}', '.nvmrc': '22.23.4\n',
    '.env': 'PRIVATE_TEST_SECRET=never-include\n', '.git/config': 'private-repo-test',
    'dist/build-info.json': JSON.stringify({ mode: 'editorial-preview', articlePaths: ['/ja/guides/launch/'] }),
    'dist/index.html': '<html><head><meta name="robots" content="noindex,follow"></head><body>Preview</body></html>',
    'dist/sitemap.xml': '<urlset/>', 'dist/_headers': '/*\n  X-Robots-Tag: noindex, nofollow\n',
  };
  await Promise.all(Object.entries(files).map(([file, body]) => writeFile(join(root, file), body)));
  return {
    root,
    input: {
      projectRoot: root, siteRoot: join(root, 'dist'), targetRoot: join(root, 'bundle'), inputDigest: 'fixture-digest', generatedAt: '2026-11-14T04:00:00.000Z',
      release: { ready: false, summary: { required: 1, ready: 0, awaitingReview: 1, missing: 0, stale: 0 }, validationIssues: [], articles: [{ locale: 'ja', label: '配信日', title: 'Draft', url: '/ja/guides/launch/' }] },
      status: { summary: { articles: 1 }, articles: [{ url: '/ja/guides/launch/' }] },
    },
  };
}

test('review handoff includes evidence, reports and matching file hashes while excluding local credentials and Git', async () => {
  const { root, input } = await fixture();
  try {
    const before = await readFile(join(root, 'src/content/guides/ja/launch.md'), 'utf8');
    const manifest = await stageReviewPackage(input);
    assert.equal(manifest.purpose, 'editorial-review');
    assert.equal(manifest.releaseReady, false);
    for (const file of manifest.files) {
      assert.equal(createHash('sha256').update(await readFile(join(input.targetRoot, file.path))).digest('hex'), file.sha256);
      assert.ok(!file.path.startsWith('.env') && !file.path.startsWith('.git/'));
    }
    assert.ok(manifest.files.some((file) => file.path === 'src/data/sources.json'));
    assert.ok(manifest.files.some((file) => file.path === 'reports/release-readiness.json'));
    assert.ok(manifest.files.some((file) => file.path === 'site/index.html'));
    const readme = await readFile(join(input.targetRoot, 'README.md'), 'utf8');
    assert.match(readme, /--bind 127\.0\.0\.1 --directory site/);
    assert.match(readme, /0\/1 篇可发布/);
    assert.equal(await readFile(join(root, 'src/content/guides/ja/launch.md'), 'utf8'), before);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('review packaging rejects production, indexed pages, populated sitemap, missing headers, stale routes and symlinks before copying', async () => {
  const changes = [
    async ({ root }) => writeFile(join(root, 'dist/build-info.json'), JSON.stringify({ mode: 'production', articlePaths: [] })),
    async ({ root }) => writeFile(join(root, 'dist/index.html'), '<meta name="robots" content="index,follow">'),
    async ({ root }) => writeFile(join(root, 'dist/sitemap.xml'), '<urlset><url><loc>https://example.com/</loc></url></urlset>'),
    async ({ root }) => writeFile(join(root, 'dist/_headers'), '/*\n  X-Content-Type-Options: nosniff\n'),
    async ({ input }) => { input.status.articles = []; },
    async ({ input }) => { input.release.validationIssues = ['Missing claim dependency']; },
    async ({ root }) => symlink(join(root, '.env'), join(root, 'dist/leak.txt')),
  ];
  for (const change of changes) {
    const context = await fixture();
    try {
      await change(context);
      await assert.rejects(stageReviewPackage(context.input));
      await assert.rejects(readFile(join(context.input.targetRoot, 'README.md')));
    } finally { await rm(context.root, { recursive: true, force: true }); }
  }
});

test('review fingerprints track source and evidence changes while ignoring secrets and generated output', async () => {
  const { root } = await fixture();
  try {
    const initial = await reviewInputDigest(root);
    await writeFile(join(root, '.env'), 'PRIVATE_TEST_SECRET=changed');
    await writeFile(join(root, 'dist/index.html'), 'a new generated page');
    assert.equal(await reviewInputDigest(root), initial);
    await writeFile(join(root, 'src/content/guides/ja/launch.md'), 'Revised draft.');
    const revised = await reviewInputDigest(root);
    assert.notEqual(revised, initial);
    await writeFile(join(root, 'research/evidence.md'), 'Changed original evidence.');
    assert.notEqual(await reviewInputDigest(root), revised);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('native archive contains exactly the manifest files without macOS metadata companions', async () => {
  const { root, input } = await fixture();
  try {
    input.targetRoot = join(root, 'promilia-review');
    const manifest = await stageReviewPackage(input);
    if (process.platform === 'darwin') execFileSync('xattr', ['-w', 'com.promiliaguide.review-test', 'fixture', join(input.targetRoot, 'README.md')]);
    const archive = join(root, 'review.tar.gz');
    archiveReviewPackage(root, archive);
    const members = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split('\n');
    const files = members.filter((path) => !path.endsWith('/')).map((path) => path.replace(/^promilia-review\//, '')).sort();
    assert.deepEqual(files, [...manifest.files.map((file) => file.path), 'manifest.json'].sort());
  } finally { await rm(root, { recursive: true, force: true }); }
});
