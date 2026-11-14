import { parseArgs } from 'node:util';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { pagesBuildPlan } from './pages-build-plan.mjs';

try {
  const { values } = parseArgs({ options: { 'dry-run': { type: 'boolean' }, help: { type: 'boolean' } } });
  if (values.help) {
    console.log('npm run build:pages -- [--dry-run]\nSet PAGES_BUILD_MODE=production|preview. On Pages, set PAGES_PRODUCTION_BRANCH to the actual dashboard production branch in both environments. Dry runs validate configuration without building or deploying.');
  } else {
    const plan = pagesBuildPlan(process.env);
    if (values['dry-run']) console.log(JSON.stringify(plan, null, 2));
    else {
      console.log(`Pages ${plan.mode}: npm run ${plan.script}${plan.branch ? ` (branch: ${plan.branch})` : ''}`);
      const child = spawnSync('npm', ['run', plan.script], { stdio: 'inherit', env: { ...process.env, ...plan.environment } });
      if (child.error) throw child.error;
      if (child.status !== 0) process.exitCode = child.status || 1;
      else {
        const info = JSON.parse(await readFile('dist/build-info.json', 'utf8'));
        if (info.mode !== (plan.mode === 'preview' ? 'editorial-preview' : 'production')) throw new Error('Build output mode does not match the resolved Pages environment.');
        console.log(`Pages build verified: ${info.mode}. This command builds locally; it does not deploy.`);
      }
    }
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
