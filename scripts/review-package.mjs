import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cp, lstat, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { load } from 'cheerio';

// Only editorial evidence and static assets belong in the handoff, never local configuration.
export const reviewInputs = ['src/content', 'src/data', 'research', 'plans/CONTENT-REVIEW.md', 'plans/LOCALIZATION-PLAN.md'];
const buildInputs = ['src', 'public', 'scripts', 'astro.config.mjs', 'package.json', 'package-lock.json', 'tsconfig.json', '.nvmrc'];

export async function regularFiles(path) {
  const info = await lstat(path);
  if (info.isSymbolicLink()) throw new Error(`Symbolic links are not allowed in review input: ${path}`);
  if (info.isFile()) return [path];
  if (!info.isDirectory()) throw new Error(`Unsupported review input: ${path}`);
  const nested = await Promise.all((await readdir(path)).sort().map((name) => regularFiles(join(path, name))));
  return nested.flat();
}

async function digests(root, paths) {
  const files = [...new Set((await Promise.all(paths.map((path) => regularFiles(join(root, path))))).flat())].sort();
  return Promise.all(files.map(async (path) => ({ path: relative(root, path).split(sep).join('/'), sha256: createHash('sha256').update(await readFile(path)).digest('hex') })));
}

export async function reviewInputDigest(root) {
  return createHash('sha256').update(JSON.stringify(await digests(root, [...buildInputs, ...reviewInputs]))).digest('hex');
}

export function archiveReviewPackage(stagingRoot, outputArchive) {
  // macOS tar otherwise adds AppleDouble files absent from the SHA-256 manifest.
  execFileSync('tar', ['-czf', outputArchive, '-C', stagingRoot, 'promilia-review'], {
    stdio: 'pipe', env: { ...process.env, COPYFILE_DISABLE: '1' },
  });
}

/** Copy an already verified preview and evidence into a new, private staging directory. */
export async function stageReviewPackage({ projectRoot, siteRoot, targetRoot, release, status, inputDigest, generatedAt }) {
  const info = JSON.parse(await readFile(join(siteRoot, 'build-info.json'), 'utf8'));
  if (info.mode !== 'editorial-preview') throw new Error('The review package requires an editorial-preview build.');
  const actualPaths = [...info.articlePaths].sort();
  const expectedPaths = status.articles.map((article) => article.url).sort();
  if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) throw new Error('Preview article paths do not match the editorial report; rebuild before packaging.');
  if (release.validationIssues.length) throw new Error('Content integrity errors must be fixed before packaging.');
  const siteFiles = await regularFiles(siteRoot);
  for (const file of siteFiles.filter((file) => file.endsWith('.html'))) {
    const $ = load(await readFile(file, 'utf8'));
    if (!$('meta[name="robots"]').attr('content')?.split(',').map((part) => part.trim()).includes('noindex')) throw new Error(`Review page must be noindex: ${file}`);
  }
  const sitemap = load(await readFile(join(siteRoot, 'sitemap.xml'), 'utf8'), { xmlMode: true });
  if (sitemap('loc').length) throw new Error('Review sitemap must not contain public URLs.');
  const headers = await readFile(join(siteRoot, '_headers'), 'utf8');
  if (!/X-Robots-Tag:\s*noindex/i.test(headers)) throw new Error('Review build is missing noindex response-header configuration.');
  for (const path of reviewInputs) await regularFiles(join(projectRoot, path));
  await mkdir(targetRoot, { recursive: false });
  await cp(siteRoot, join(targetRoot, 'site'), { recursive: true });
  for (const path of reviewInputs) {
    const destination = join(targetRoot, path);
    await mkdir(join(destination, '..'), { recursive: true });
    await cp(join(projectRoot, path), destination, { recursive: true });
  }
  await mkdir(join(targetRoot, 'reports'));
  await writeFile(join(targetRoot, 'reports/release-readiness.json'), JSON.stringify(release, null, 2) + '\n');
  await writeFile(join(targetRoot, 'reports/content-status.json'), JSON.stringify(status, null, 2) + '\n');
  const routes = release.articles.map((article) => `- ${article.locale} · ${article.label}：[${article.title}](http://127.0.0.1:4322${article.url})`).join('\n');
  const readme = `# Promilia Guide 本地内容审核包

生成时间：${generatedAt}。用途：正文、日语表达与来源核对，不是正式发布产物。

首发状态：${release.summary.ready}/${release.summary.required} 篇可发布；待人工审核 ${release.summary.awaitingReview}，缺稿 ${release.summary.missing}，需同步 ${release.summary.stale}。
全部 ${status.summary.articles} 篇稿件及其预览均已附上，首发重点为五个主题的中日文稿，平台页为关联复核项。

## 打开审核预览

解压后在本文件所在目录执行（需要 Python 3；无须安装项目依赖）：

\x60\x60\x60sh
python3 -m http.server 4322 --bind 127.0.0.1 --directory site
\x60\x60\x60

然后打开 http://127.0.0.1:4322/editorial/ 。按 Ctrl+C 停止。若端口被占用，更换端口并相应修改链接。请通过 HTTP 打开；直接双击 HTML 的 file:// 方式不能验证搜索和脚本。

## 首发阅读顺序

${routes}

## 审核材料

- site/：已构建的完整 noindex 预览，含搜索、来源、目录与清单。
- src/content/guides/：当前已审原稿与译稿；src/content/revisions/（如有）为预览中覆盖的待审修订。
- src/data/：来源、事实、术语、分发及首发计划。
- research/：原始来源核验记录及结论边界。
- plans/CONTENT-REVIEW.md：逐篇交接与人工审核步骤；LOCALIZATION-PLAN.md 为语言规范。
- reports/：同批来源与稿件生成的只读状态报告。
- manifest.json：逐文件 SHA-256，用于识别和核对这一版审核材料。

核对日期、地区、设备与版本；未确认的开服小时、安装器、预下载和配置继续标明未知。完成真实审核后，在项目原稿中填写审核人、审核日期并同步语言修订，再运行正式发布检查。此包不会改写项目稿件、提交审核或执行云端部署。

noindex 是索引设置，不是访问权限。交接时请把它作为编辑材料；不将 site/ 当作正式发布产物上传。清单记录仅在各自浏览器保存。
`;
  await writeFile(join(targetRoot, 'README.md'), readme);
  const manifest = {
    schemaVersion: 1, purpose: 'editorial-review', generatedAt, inputDigest,
    buildMode: info.mode, releaseReady: release.ready, releaseSummary: release.summary,
    files: await digests(targetRoot, ['.']),
  };
  await writeFile(join(targetRoot, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}
