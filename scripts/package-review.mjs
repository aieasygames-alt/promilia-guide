import { createHash, randomUUID } from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { constants } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { archiveReviewPackage, reviewInputDigest, stageReviewPackage } from './review-package.mjs';

let staging;
try {
  const { values } = parseArgs({ options: { help: { type: 'boolean' } } });
  if (values.help) console.log('npm run review:bundle\nRebuilds the noindex preview, validates reports, and creates a local .tar.gz handoff under artifacts/review-bundles/. Requires tar; the recipient can serve site/ using Python 3. Does not approve content or deploy.');
  else {
    const root = process.cwd();
    const inputDigest = await reviewInputDigest(root);
    // Build first: never package an old dist/ left behind by a production build.
    const child = spawnSync('npm', ['run', 'build:preview'], { stdio: 'inherit' });
    if (child.error) throw child.error;
    if (child.status !== 0) throw new Error('Preview build failed; no review archive was created.');
    if (inputDigest !== await reviewInputDigest(root)) throw new Error('Project inputs changed during the build; rerun review:bundle for a consistent snapshot.');
    const report = (script, args) => JSON.parse(execFileSync(process.execPath, [script, ...args, '--json'], { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
    const release = report('scripts/check-release.mjs', []);
    const status = report('scripts/content-report.mjs', ['status']);
    staging = await mkdtemp(join(tmpdir(), 'promilia-review-'));
    const generatedAt = new Date().toISOString();
    const manifest = await stageReviewPackage({ projectRoot: root, siteRoot: join(root, 'dist'), targetRoot: join(staging, 'promilia-review'), release, status, inputDigest, generatedAt });
    if (inputDigest !== await reviewInputDigest(root)) throw new Error('Project inputs changed while copying review materials; rerun review:bundle.');
    const filename = `promilia-review-${generatedAt.replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}.tar.gz`;
    const temporaryArchive = join(staging, filename);
    archiveReviewPackage(staging, temporaryArchive);
    const outputRoot = resolve('artifacts/review-bundles');
    await mkdir(outputRoot, { recursive: true });
    const output = join(outputRoot, filename);
    await copyFile(temporaryArchive, output, constants.COPYFILE_EXCL);
    await writeFile(`${output}.sha256`, `${createHash('sha256').update(await readFile(output)).digest('hex')}  ${basename(output)}\n`, { flag: 'wx' });
    console.log(`\nReview bundle: ${output}\n${manifest.files.length} files; ${release.summary.ready}/${release.summary.required} release-ready. Reviews and cloud deployment remain unchanged.`);
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { if (staging) await rm(staging, { recursive: true, force: true }); }
