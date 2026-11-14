import { appendFile, writeFile } from 'node:fs/promises';
import { waitForDeployment, waitForManifest } from './pages-deployment.mjs';

const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repository, GITHUB_SHA: sha } = process.env;
let report = { status: 'failed', commitSha: sha };
try {
  if (!token || !/^[\w.-]+\/[\w.-]+$/.test(repository || '')) throw new Error('Run with a GitHub token and repository');
  const api = async (path) => {
    const response = await fetch(`https://api.github.com/repos/${repository}${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status} for ${path}`);
    return response.json();
  };
  report = await waitForDeployment({ sha, api });
  if (report.status === 'success') {
    await waitForManifest({ sha });
    // A later push must not let an old job claim a newer deployment passed.
    const main = await api('/branches/main');
    if (main.commit.sha !== sha) report = { ...report, status: 'superseded', currentMain: main.commit.sha };
  }
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `status=${report.status}\n`);
} catch (error) {
  report = { ...report, status: 'failed', error: error.message };
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await writeFile('pages-deployment.json', JSON.stringify(report, null, 2) + '\n');
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `### Pages production deployment\n\nCommit: \`${sha}\`\n\nStatus: **${report.status}**\n\n${report.deploymentUrl || ''}\n\n${report.logsUrl || ''}\n\n${report.error || ''}\n`);
}
