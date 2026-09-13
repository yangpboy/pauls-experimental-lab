import { getParam } from '../_shared/http';
import { getProjectBySlug } from '../_shared/projects';
import { absoluteUrl, injectSeoBlock } from '../_shared/seo';
import type { Env } from '../_shared/types';

const fallbackImage = 'https://paul-lab.com/works/tini/cover.png';
const siteUrl = 'https://paul-lab.com';
const explo11Description = 'Explo.11 is an inclusive mobility concept for children with limited mobility, developed through occupational therapy research, prototyping, and testing.';
const explo11FilmUrl = 'https://media.paul-lab.com/projects/explo-11/explo11-film.mp4?v=20260913';
const explo11ArticleUrl = 'https://pr.ntnu.edu.tw/ntnunews/index.php?mode=data&id=23525';

type SeoProject = NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>;

const getDescription = (project: SeoProject) => project.slug === 'explo-11'
  ? explo11Description
  : project.summary || `${project.category} project by industrial designer Paul Yang.`;

const getTitle = (project: SeoProject) => project.slug === 'explo-11'
  ? 'Explo.11 — Inclusive Mobility for Children | Paul Yang'
  : `${project.title} — Paul Yang`;

const getProjectJsonLd = (project: SeoProject, title: string, canonical: string, description: string, image: string) => {
  const projectId = `${canonical}#project`;
  const pageId = `${canonical}#webpage`;
  const creators = project.author
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({
      '@type': 'Person',
      ...(name === 'Po-Yu Yang' ? { '@id': `${siteUrl}/#paul-yang` } : {}),
      name,
    }));
  const creativeWork: Record<string, unknown> = {
    '@type': 'CreativeWork',
    '@id': projectId,
    name: project.title,
    headline: project.title,
    description,
    url: canonical,
    mainEntityOfPage: { '@id': pageId },
    image,
    genre: project.category,
    keywords: [...new Set([project.category, ...project.tools])],
    datePublished: project.publishedAt ?? undefined,
    dateModified: project.updatedAt,
    temporalCoverage: project.projectDate || undefined,
    locationCreated: project.location ? { '@type': 'Place', name: project.location } : undefined,
    creator: creators,
    author: creators,
    inLanguage: 'en',
  };
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebPage',
      '@id': pageId,
      url: canonical,
      name: title,
      description,
      isPartOf: { '@id': `${siteUrl}/#website` },
      primaryImageOfPage: { '@type': 'ImageObject', url: image },
      breadcrumb: { '@id': `${canonical}#breadcrumb` },
      mainEntity: { '@id': projectId },
      inLanguage: 'en',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: "Paul's Experimental Lab", item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: project.title, item: canonical },
      ],
    },
    creativeWork,
  ];

  if (project.slug === 'explo-11') {
    const filmId = `${canonical}#field-film`;
    creativeWork.about = [
      'Inclusive mobility for children',
      'Occupational therapy research',
      'Assistive play and independent exploration',
      'Product design prototyping',
    ];
    creativeWork.citation = explo11ArticleUrl;
    creativeWork.subjectOf = { '@id': filmId };
    graph.push({
      '@type': 'VideoObject',
      '@id': filmId,
      name: 'Explo.11 Testing & Interview — Prof. Hsiang-Han Huang',
      description: 'A field interview about children’s mobility, play, and occupational therapy conducted during the development of Explo.11.',
      thumbnailUrl: [`${siteUrl}/works/explo.11/explo11-film-poster.jpg`],
      uploadDate: project.publishedAt ?? project.updatedAt,
      duration: 'PT5M18S',
      contentUrl: explo11FilmUrl,
      encodingFormat: 'video/mp4',
      inLanguage: ['zh-TW', 'en'],
      isFamilyFriendly: true,
      encodesCreativeWork: { '@id': projectId },
      contributor: {
        '@type': 'Person',
        name: 'Hsiang-Han Huang',
        alternateName: '黃湘涵',
        jobTitle: 'Associate Professor, Department of Occupational Therapy',
        affiliation: { '@type': 'CollegeOrUniversity', name: 'Chang Gung University' },
      },
      caption: {
        '@type': 'MediaObject',
        contentUrl: `${siteUrl}/works/explo.11/explo11-en.vtt`,
        encodingFormat: 'text/vtt',
        inLanguage: 'en',
      },
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
};

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
  const title = getTitle(project);
  const description = getDescription(project);
  const image = project.coverImageUrl ? absoluteUrl(project.coverImageUrl) : fallbackImage;
  const html = injectSeoBlock(await response.text(), {
    title,
    description,
    canonical,
    image,
    imageAlt: project.slug === 'explo-11' ? 'Explo.11 inclusive mobility design project cover' : `${project.title} project cover`,
    type: 'article',
    jsonLd: getProjectJsonLd(project, title, canonical, description, image),
  });

  return new Response(html, { status: response.status, headers });
};
