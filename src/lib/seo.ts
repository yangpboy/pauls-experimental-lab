import type { Project } from '../types/cms';

const SITE_URL = 'https://paul-lab.com';
const HOME_TITLE = 'Paul Yang — Industrial Designer & Product Design Portfolio';
const HOME_DESCRIPTION = "Industrial designer Paul Yang's portfolio featuring product design, computational design, automotive concepts, prototypes, and experimental projects.";
const HOME_IMAGE = `${SITE_URL}/works/tini/cover.png`;

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
  const description = project.summary || `${project.category} project by industrial designer Paul Yang.`;
  const image = project.coverImageUrl ? new URL(project.coverImageUrl, SITE_URL).href : HOME_IMAGE;

  setDocumentSeo({
    title: `${project.title} — Paul Yang`,
    description,
    canonical,
    image,
    imageAlt: `${project.title} project cover`,
    type: 'article',
    robots: 'index, follow, max-image-preview:large',
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
        '@id': `${SITE_URL}/#paul-yang`,
        name: 'Paul Yang',
        alternateName: 'Po-Yu Yang',
      },
    },
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
