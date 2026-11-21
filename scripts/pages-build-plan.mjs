/** Resolve Pages' explicit environment settings without guessing its production branch. */
export function pagesBuildPlan(env) {
  const mode = env.PAGES_BUILD_MODE;
  if (!['production', 'preview'].includes(mode)) throw new Error('Set PAGES_BUILD_MODE to production or preview in the corresponding Pages environment.');
  const preview = mode === 'preview';
  if (env.CONTENT_PREVIEW && env.CONTENT_PREVIEW !== String(preview)) throw new Error('CONTENT_PREVIEW contradicts PAGES_BUILD_MODE; remove the shared override.');
  const hosted = env.CF_PAGES === '1';
  const branch = env.CF_PAGES_BRANCH?.trim();
  const productionBranch = env.PAGES_PRODUCTION_BRANCH?.trim();
  if (hosted || branch) {
    if (!branch || !productionBranch) throw new Error('Pages builds require CF_PAGES_BRANCH and an explicit PAGES_PRODUCTION_BRANCH matching the dashboard.');
    if ((branch === productionBranch) !== !preview) throw new Error('The branch and PAGES_BUILD_MODE disagree; refusing to build the wrong environment.');
  }
  return {
    mode,
    hosted,
    branch: branch || null,
    productionBranch: productionBranch || null,
    checks: preview ? [] : ['check', 'test'],
    script: preview ? 'build:preview' : 'build:release',
    environment: { CONTENT_PREVIEW: String(preview) },
    outputDirectory: 'dist',
  };
}
