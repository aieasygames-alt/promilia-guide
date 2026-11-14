import { setTimeout as delay } from 'node:timers/promises';

const account = 'e6472b6c6172a3ac1e1596ef100543ae';
const project = 'promilia-guide';

export function deploymentFromCheck(check, sha) {
  if (check.name !== 'Cloudflare Pages' || check.app?.id !== 85455 || check.app?.slug !== 'cloudflare-workers-and-pages' || check.head_sha !== sha) return null;
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(check.external_id || '')) return null;
  let url;
  try { url = new URL(check.details_url); } catch { return null; }
  if (url.origin !== 'https://dash.cloudflare.com' || url.searchParams.get('to') !== `/${account}/pages/view/${project}/${check.external_id}`) return null;
  return { checkId: check.id, suiteId: check.check_suite?.id, commitSha: sha, deploymentId: check.external_id, deploymentUrl: `https://${check.external_id.slice(0, 8)}.${project}.pages.dev`, logsUrl: check.details_url };
}

/** Poll the actual Pages check for this SHA and production branch, not a timer. */
export async function waitForDeployment({ sha, api, timeout = 600000, interval = 10000, now = Date.now, sleep = delay, log = console.log }) {
  if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('Expected a full commit SHA');
  const deadline = now() + timeout;
  while (now() < deadline) {
    const main = await api('/branches/main');
    if (main.commit.sha !== sha) return { status: 'superseded', commitSha: sha, currentMain: main.commit.sha };
    const { check_runs: checks } = await api(`/commits/${sha}/check-runs?per_page=100`);
    for (const check of checks.sort((a, b) => b.id - a.id)) {
      const deployment = deploymentFromCheck(check, sha);
      if (!deployment?.suiteId) continue;
      const suite = await api(`/check-suites/${deployment.suiteId}`);
      if (suite.head_branch !== 'main' || suite.head_sha !== sha) continue;
      if (check.status !== 'completed') break;
      if (check.conclusion !== 'success') throw new Error(`Pages deployment ${check.conclusion}: ${deployment.logsUrl}`);
      return { status: 'success', ...deployment };
    }
    log('Waiting for the Cloudflare Pages production check for this commit…');
    await sleep(Math.min(interval, Math.max(0, deadline - now())));
  }
  throw new Error('Timed out waiting for the Cloudflare Pages production check');
}

/** Edge propagation can lag the check. Only the expected manifest completes this wait. */
export async function waitForManifest({ sha, fetcher = fetch, timeout = 180000, interval = 5000, now = Date.now, sleep = delay, log = console.log }) {
  const deadline = now() + timeout;
  let observed = 'unavailable';
  while (now() < deadline) {
    try {
      const response = await fetcher(`https://promiliaguide.com/build-info.json?verify=${sha}`, { redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(12000) });
      if (response.ok) {
        const manifest = await response.json();
        observed = manifest.commitSha || 'missing commitSha';
        if (manifest.mode === 'production' && manifest.commitSha === sha) return;
      } else observed = `HTTP ${response.status}`;
    } catch (error) { observed = error.message; }
    log(`Waiting for the canonical origin to serve ${sha}; observed ${observed}`);
    await sleep(Math.min(interval, Math.max(0, deadline - now())));
  }
  throw new Error(`Canonical origin did not serve the expected production commit; last observed ${observed}`);
}
