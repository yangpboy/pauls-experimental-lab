import { getParam } from '../_shared/http';
import { getProjectBySlug } from '../_shared/projects';
import { absoluteUrl, injectSeoBlock } from '../_shared/seo';
import type { Env } from '../_shared/types';

const fallbackImage = 'https://paul-lab.com/works/tini/cover.png';

export const onRequestGet: PagesFunction<Env> = async ({ env, params, next }) => {
  const response = await next();
  if (!(response.headers.get('content-type') ?? '').includes('text/html')) return response;

  const slug = getParam(params, 'slug');
  const project = slug ? await getProjectBySlug(env.DB, slug, false) : null;
  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'public, max-age=0, must-revalidate');

  if (!project) {
    headers.set('x-robots-tag', 'noindex, nofollow');
    return new Response(await response.text(), { status: 404, headers });
  }

  const canonical = `https://paul-lab.com/projects/${encodeURIComponent(project.slug)}`;
  const description = project.summary || `${project.category} project by industrial designer Paul Yang.`;
  const image = project.coverImageUrl ? absoluteUrl(project.coverImageUrl) : fallbackImage;
  const html = injectSeoBlock(await response.text(), {
    title: `${project.title} — Paul Yang`,
    description,
    canonical,
    image,
    imageAlt: `${project.title} project cover`,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description,
      url: canonical,
      image,
      genre: project.category,
      keywords: project.tools.join(', '),
      datePublished: project.publishedAt ?? undefined,
      dateModified: project.updatedAt,
      creator: {
        '@type': 'Person',
        '@id': 'https://paul-lab.com/#paul-yang',
        name: 'Paul Yang',
        alternateName: 'Po-Yu Yang',
      },
    },
  });

  return new Response(html, { status: response.status, headers });
};
