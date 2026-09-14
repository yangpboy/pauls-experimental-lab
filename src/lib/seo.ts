import type { Project, ProjectSummary } from '../types/cms';
import {
  DEFAULT_SOCIAL_IMAGE,
  getHomeSeo,
  getProjectSeo,
  getProjectSeoDescription,
  getProjectSeoTitle,
  SITE_URL,
  type PageSeo,
} from '../../shared/siteSeo';

export { getProjectSeoDescription, getProjectSeoTitle };

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

const setDocumentSeo = ({ title, description, canonical, image, imageAlt, type, robots, jsonLd }: PageSeo) => {
  document.title = title;
  document.documentElement.lang = 'en';
  setCanonical(canonical);
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'author', 'Paul Yang');
  upsertMeta('name', 'robots', robots);
  upsertMeta('name', 'googlebot', robots);
  upsertMeta('name', 'bingbot', robots);
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:site_name', "Paul's Experimental Lab");
  upsertMeta('property', 'og:locale', 'en_GB');
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

export const applyHomeSeo = (projects: readonly ProjectSummary[] = []) => setDocumentSeo(getHomeSeo(projects));

export const applyProjectSeo = (project: Project) => setDocumentSeo(getProjectSeo(project));

export const applyLoginSeo = () => setDocumentSeo({
  title: "Private Studio — Paul's Experimental Lab",
  description: 'Private portfolio editor sign-in for Paul Yang.',
  canonical: `${SITE_URL}/login`,
  image: DEFAULT_SOCIAL_IMAGE,
  imageAlt: "Paul's Experimental Lab private studio",
  type: 'website',
  robots: 'noindex, nofollow',
  jsonLd: {},
});
