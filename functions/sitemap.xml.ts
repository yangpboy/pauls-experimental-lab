import { SITE_URL } from '../shared/siteSeo';
import type { Env } from './_shared/types';

interface SitemapProjectRow {
  slug: string;
  title: string;
  cover_image_url: string;
  updated_at: string;
  published_at: string | null;
}

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const absoluteUrl = (value: string) => {
  try {
    return new URL(value, SITE_URL).href;
  } catch {
    return `${SITE_URL}/works/tini/cover.png`;
  }
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const projects = await env.DB.prepare(`
      SELECT slug, title, cover_image_url, updated_at, published_at
      FROM projects
      WHERE status = 'published'
      ORDER BY sort_order ASC, updated_at DESC
    `).all<SitemapProjectRow>();

    const latestUpdate = projects.results
      .map((project) => project.updated_at)
      .filter(Boolean)
      .sort()
      .at(-1);

    const urls = [
      `  <url>
    <loc>${SITE_URL}/</loc>${latestUpdate ? `
    <lastmod>${escapeXml(latestUpdate)}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
      ...projects.results.map((project) => {
        const canonical = `${SITE_URL}/projects/${encodeURIComponent(project.slug)}`;
        const cover = absoluteUrl(project.cover_image_url);
        const video = project.slug === 'explo-11' ? `
    <video:video>
      <video:thumbnail_loc>${SITE_URL}/works/explo.11/explo11-film-poster.jpg</video:thumbnail_loc>
      <video:title>Explo.11 Testing &amp; Interview</video:title>
      <video:description>Field interview about children&apos;s mobility, play and occupational therapy during the development of Explo.11.</video:description>
      <video:content_loc>https://media.paul-lab.com/projects/explo-11/explo11-film.mp4?v=20260913</video:content_loc>
      <video:duration>318</video:duration>
      <video:publication_date>${escapeXml(project.published_at ?? project.updated_at)}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>` : '';

        return `  <url>
    <loc>${escapeXml(canonical)}</loc>
    <lastmod>${escapeXml(project.updated_at)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${escapeXml(cover)}</image:loc>
      <image:title>${escapeXml(`${project.title} — Paul Yang`)}</image:title>
    </image:image>${video}
  </url>`;
      }),
    ];

    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n${urls.join('\n')}\n</urlset>\n`, {
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
