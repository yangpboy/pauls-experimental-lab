import type { Env } from './_shared/types';

interface SitemapProjectRow {
  slug: string;
  updated_at: string;
}

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const projects = await env.DB.prepare(`
      SELECT slug, updated_at
      FROM projects
      WHERE status = 'published'
      ORDER BY sort_order ASC, updated_at DESC
    `).all<SitemapProjectRow>();

    const urls = [
      `  <url><loc>https://paul-lab.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
      ...projects.results.map((project) => `  <url><loc>https://paul-lab.com/projects/${escapeXml(encodeURIComponent(project.slug))}</loc><lastmod>${escapeXml(project.updated_at)}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`),
    ];

    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`, {
      headers: {
        'content-type': 'application/xml; charset=utf-8',
        'cache-control': 'public, max-age=0, must-revalidate',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Unable to generate sitemap.', {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
};
