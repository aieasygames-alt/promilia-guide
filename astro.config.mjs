import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://promiliaguide.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: { define: { __CONTENT_PREVIEW__: JSON.stringify(process.env.CONTENT_PREVIEW === 'true') } },
});
