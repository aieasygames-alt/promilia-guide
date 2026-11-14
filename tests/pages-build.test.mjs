import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pagesBuildPlan } from '../scripts/pages-build-plan.mjs';

test('Pages explicitly selects gated production or noindex preview, including non-main production branches', () => {
  for (const productionBranch of ['main', 'release/stable']) {
    const context = { CF_PAGES: '1', PAGES_PRODUCTION_BRANCH: productionBranch };
    const production = pagesBuildPlan({ ...context, CF_PAGES_BRANCH: productionBranch, PAGES_BUILD_MODE: 'production' });
    assert.equal(production.script, 'build:release');
    assert.equal(production.environment.CONTENT_PREVIEW, 'false');
    const preview = pagesBuildPlan({ ...context, CF_PAGES_BRANCH: 'editorial/ja', PAGES_BUILD_MODE: 'preview' });
    assert.equal(preview.script, 'build:preview');
    assert.equal(preview.environment.CONTENT_PREVIEW, 'true');
  }
});

test('Pages refuses missing environment settings, branch mismatches and inherited preview overrides', () => {
  for (const env of [
    {}, { PAGES_BUILD_MODE: 'staging' },
    { CF_PAGES: '1', PAGES_BUILD_MODE: 'preview' },
    { CF_PAGES: '1', PAGES_BUILD_MODE: 'production', CF_PAGES_BRANCH: 'main' },
    { PAGES_BUILD_MODE: 'production', CONTENT_PREVIEW: 'true' },
    { PAGES_BUILD_MODE: 'preview', CONTENT_PREVIEW: 'false' },
    { CF_PAGES: '1', PAGES_BUILD_MODE: 'preview', CF_PAGES_BRANCH: 'main', PAGES_PRODUCTION_BRANCH: 'main' },
    { CF_PAGES: '1', PAGES_BUILD_MODE: 'production', CF_PAGES_BRANCH: 'feature', PAGES_PRODUCTION_BRANCH: 'main' },
  ]) assert.throws(() => pagesBuildPlan(env));
});

test('local Pages planning also requires an explicit mode and never infers it from a URL or language', () => {
  assert.throws(() => pagesBuildPlan({ CF_PAGES_URL: 'https://example.pages.dev', LANG: 'ja_JP' }));
  assert.equal(pagesBuildPlan({ PAGES_BUILD_MODE: 'preview' }).hosted, false);
  assert.equal(pagesBuildPlan({ PAGES_BUILD_MODE: 'production' }).script, 'build:release');
});

test('Pages dry runs and failed production release checks leave the existing preview untouched', async () => {
  const root = await mkdtemp(join(tmpdir(), 'promilia-pages-gate-'));
  try {
  await mkdir(join(root, 'src'), { recursive: true });
  await cp('src/data', join(root, 'src/data'), { recursive: true });
  await cp('src/content', join(root, 'src/content'), { recursive: true });
  const draft = join(root, 'src/content/guides/zh-hans/launch.md');
  await writeFile(draft, (await readFile(draft, 'utf8')).replace(/^status: .*$/m, 'status: "draft"'));
  await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { 'build:release': `node ${JSON.stringify(resolve('scripts/check-release.mjs'))} --require-ready && node -e "throw Error('Unexpected build')"` } }));
  await mkdir(join(root, 'dist'));
  await writeFile(join(root, 'dist/build-info.json'), JSON.stringify({ mode: 'editorial-preview' }));
  const env = { ...process.env, PAGES_BUILD_MODE: 'production', CF_PAGES: '1', CF_PAGES_BRANCH: 'main', PAGES_PRODUCTION_BRANCH: 'main' };
  delete env.CONTENT_PREVIEW;
  const before = await readFile(join(root, 'dist/build-info.json'), 'utf8');
  const cli = resolve('scripts/build-pages.mjs');
  const dry = spawnSync(process.execPath, [cli, '--dry-run'], { cwd: root, env, encoding: 'utf8' });
  assert.equal(dry.status, 0, dry.stderr);
  assert.equal(JSON.parse(dry.stdout).script, 'build:release');
  const production = spawnSync(process.execPath, [cli], { cwd: root, env, encoding: 'utf8' });
  assert.equal(production.status, 1);
  assert.match(production.stdout, /首批内容尚未就绪/);
  assert.doesNotMatch(production.stderr, /Unexpected build/);
  assert.equal(await readFile(join(root, 'dist/build-info.json'), 'utf8'), before);
  } finally { await rm(root, { recursive: true, force: true }); }
});
