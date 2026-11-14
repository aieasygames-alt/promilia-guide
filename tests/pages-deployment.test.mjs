import test from 'node:test';
import assert from 'node:assert/strict';
import { deploymentFromCheck, waitForDeployment, waitForManifest } from '../scripts/pages-deployment.mjs';

const sha = 'a'.repeat(40);
const id = '738c5a9f-31dd-4c1a-9e26-49cf7a99e590';
const check = { id: 42, name: 'Cloudflare Pages', app: { id: 85455, slug: 'cloudflare-workers-and-pages' }, head_sha: sha, external_id: id, details_url: `https://dash.cloudflare.com/?to=/e6472b6c6172a3ac1e1596ef100543ae/pages/view/promilia-guide/${id}`, check_suite: { id: 99 }, status: 'completed', conclusion: 'success' };
function clock() {
  let elapsed = 0;
  return { now: () => elapsed, sleep: async (ms) => { elapsed += ms; }, log: () => {}, timeout: 30, interval: 10 };
}
function apiWith(checks, branch = 'main', mainSha = sha) {
  return async (path) => {
    if (path === '/branches/main') return { commit: { sha: mainSha } };
    if (path.includes('check-runs')) return { check_runs: typeof checks === 'function' ? checks() : checks };
    if (path.includes('check-suites')) return { head_branch: branch, head_sha: sha };
    throw new Error(`Unexpected API call ${path}`);
  };
}

test('deployment identity requires the Cloudflare app, project and exact commit', () => {
  assert.equal(deploymentFromCheck(check, sha).deploymentUrl, 'https://738c5a9f.promilia-guide.pages.dev');
  for (const candidate of [
    { ...check, app: { id: 1, slug: 'fake' } },
    { ...check, head_sha: 'b'.repeat(40) },
    { ...check, details_url: check.details_url.replace('promilia-guide', 'other-project') },
    { ...check, details_url: check.details_url.replace('dash.cloudflare.com', 'example.com') },
    { ...check, details_url: null },
  ]) assert.equal(deploymentFromCheck(candidate, sha), null);
});

test('pending Pages checks are polled until actual success', async () => {
  let reads = 0;
  const api = apiWith(() => [++reads === 1 ? { ...check, status: 'in_progress', conclusion: null } : check]);
  const result = await waitForDeployment({ sha, api, ...clock() });
  assert.equal(reads, 2);
  assert.equal(result.status, 'success');
  assert.equal(result.deploymentId, id);
});

test('failed deployment, preview branch and timeout cannot pass production verification', async () => {
  await assert.rejects(waitForDeployment({ sha, api: apiWith([{ ...check, conclusion: 'failure' }]), ...clock() }), /deployment failure/);
  await assert.rejects(waitForDeployment({ sha, api: apiWith([check], 'editorial/deployment-check'), ...clock() }), /Timed out/);
  await assert.rejects(waitForDeployment({ sha, api: apiWith([]), ...clock() }), /Timed out/);
  await assert.rejects(waitForDeployment({ sha, api: async () => { throw new Error('GitHub API returned 403'); }, ...clock() }), /403/);
});

test('a superseded main commit is skipped before reading deployment checks', async () => {
  const result = await waitForDeployment({ sha, api: apiWith([], 'main', 'b'.repeat(40)), ...clock() });
  assert.equal(result.status, 'superseded');
});

test('edge propagation waits for the expected production manifest, never a healthy old or preview build', async () => {
  const sequence = [{ mode: 'production', commitSha: 'b'.repeat(40) }, { mode: 'editorial-preview', commitSha: sha }, { mode: 'production', commitSha: sha }];
  let reads = 0;
  await waitForManifest({ sha, fetcher: async () => Response.json(sequence[reads++]), ...clock() });
  assert.equal(reads, 3);
  await assert.rejects(waitForManifest({ sha, fetcher: async () => Response.json(sequence[0]), ...clock() }), /did not serve/);
});
