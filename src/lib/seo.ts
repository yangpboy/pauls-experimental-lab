import type { Project } from '../types/cms';

const SITE_URL = 'https://paul-lab.com';
const HOME_TITLE = 'Paul Yang — Industrial Designer & Product Design Portfolio';
const HOME_DESCRIPTION = "Industrial designer Paul Yang's portfolio featuring product design, computational design, automotive concepts, prototypes, and experimental projects.";
const HOME_IMAGE = `${SITE_URL}/works/tini/cover.png`;
const EXPLO11_DESCRIPTION = 'Explo.11 is an inclusive mobility concept for children with limited mobility, developed through occupational therapy research, prototyping, and testing.';
const EXPLO11_FILM_URL = 'https://media.paul-lab.com/projects/explo-11/explo11-film.mp4?v=20260913';
const EXPLO11_ARTICLE_URL = 'https://pr.ntnu.edu.tw/ntnunews/index.php?mode=data&id=23525';

export const getProjectSeoDescription = (project: Project) => project.slug === 'explo-11'
  ? EXPLO11_DESCRIPTION
  : project.summary || `${project.category} project by industrial designer Paul Yang.`;

export const getProjectSeoTitle = (project: Project) => project.slug === 'explo-11'
  ? 'Explo.11 — Inclusive Mobility for Children | Paul Yang'
  : `${project.title} — Paul Yang`;

const projectCreators = (project: Project) => project.author
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean)
  .map((name) => ({
    '@type': 'Person',
    ...(name === 'Po-Yu Yang' ? { '@id': `${SITE_URL}/#paul-yang` } : {}),
    name,
  }));

const projectJsonLd = (project: Project, title: string, canonical: string, description: string, image: string) => {
  const projectId = `${canonical}#project`;
  const pageId = `${canonical}#webpage`;
  const creators = projectCreators(project);
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
      isPartOf: { '@id': `${SITE_URL}/#website` },
      primaryImageOfPage: { '@type': 'ImageObject', url: image },
      breadcrumb: { '@id': `${canonical}#breadcrumb` },
      mainEntity: { '@id': projectId },
      inLanguage: 'en',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: "Paul's Experimental Lab", item: `${SITE_URL}/` },
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
    creativeWork.citation = EXPLO11_ARTICLE_URL;
    creativeWork.subjectOf = { '@id': filmId };
    graph.push({
      '@type': 'VideoObject',
      '@id': filmId,
      name: 'Explo.11 Testing & Interview — Prof. Hsiang-Han Huang',
      description: 'A field interview about children’s mobility, play, and occupational therapy conducted during the development of Explo.11.',
      thumbnailUrl: [`${SITE_URL}/works/explo.11/explo11-film-poster.jpg`],
      uploadDate: project.publishedAt ?? project.updatedAt,
      duration: 'PT5M18S',
      contentUrl: EXPLO11_FILM_URL,
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
        contentUrl: `${SITE_URL}/works/explo.11/explo11-en.vtt`,
        encodingFormat: 'text/vtt',
        inLanguage: 'en',
      },
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
};

const upsertMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
};

const setCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.append(element);
  }
  element.href = href;
};

const setJsonLd = (value: unknown) => {
  let element = document.head.querySelector<HTMLScriptElement>('#seo-jsonld');
  if (!element) {
    element = document.createElement('script');
    element.id = 'seo-jsonld';
    element.type = 'application/ld+json';
    document.head.append(element);
  }
  element.textContent = JSON.stringify(value);
};

const setDocumentSeo = ({ title, description, canonical, image, imageAlt, type, robots, jsonLd }: {
  title: string;
  description: string;
  canonical: string;
  image: string;
  imageAlt: string;
  type: 'website' | 'article';
  robots: string;
  jsonLd: unknown;
}) => {
  document.title = title;
  setCanonical(canonical);
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', robots);
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:image:alt', imageAlt);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', image);
  upsertMeta('name', 'twitter:image:alt', imageAlt);
  setJsonLd(jsonLd);
};

export const applyHomeSeo = () => setDocumentSeo({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  canonical: `${SITE_URL}/`,
  image: HOME_IMAGE,
  imageAlt: 'Paul Yang industrial design portfolio',
  type: 'website',
  robots: 'index, follow, max-image-preview:large',
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "Paul's Experimental Lab",
        description: 'Industrial design and product design portfolio by Paul Yang.',
        creator: { '@id': `${SITE_URL}/#paul-yang` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#paul-yang`,
        name: 'Paul Yang',
        alternateName: 'Po-Yu Yang',
        url: `${SITE_URL}/`,
        jobTitle: 'Industrial Designer',
        sameAs: [
          'https://www.instagram.com/yangpboy',
          'https://www.linkedin.com/in/paul-yang-b2755329a',
          'https://www.behance.net/paulyang10',
        ],
      },
    ],
  },
});

export const applyProjectSeo = (project: Project) => {
  const canonical = `${SITE_URL}/projects/${encodeURIComponent(project.slug)}`;
  const title = getProjectSeoTitle(project);
  const description = getProjectSeoDescription(project);
  const image = project.coverImageUrl ? new URL(project.coverImageUrl, SITE_URL).href : HOME_IMAGE;

  setDocumentSeo({
    title,
    description,
    canonical,
    image,
    imageAlt: project.slug === 'explo-11' ? 'Explo.11 inclusive mobility design project cover' : `${project.title} project cover`,
    type: 'article',
    robots: 'index, follow, max-image-preview:large',
    jsonLd: projectJsonLd(project, title, canonical, description, image),
  });
};

export const applyLoginSeo = () => setDocumentSeo({
  title: "Private Studio — Paul's Experimental Lab",
  description: 'Private portfolio editor sign-in for Paul Yang.',
  canonical: `${SITE_URL}/login`,
  image: HOME_IMAGE,
  imageAlt: "Paul's Experimental Lab private studio",
  type: 'website',
  robots: 'noindex, nofollow',
  jsonLd: {},
});
