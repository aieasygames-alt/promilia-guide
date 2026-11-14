import type { APIRoute } from 'astro';
import { preview } from '../lib/content';
export const GET: APIRoute = () => new Response(preview
  ? 'User-agent: *\nDisallow: /\n'
  : 'User-agent: *\nAllow: /\nDisallow: /zh-hans/search/\nDisallow: /ja/search/\n\nSitemap: https://promiliaguide.com/sitemap.xml\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
