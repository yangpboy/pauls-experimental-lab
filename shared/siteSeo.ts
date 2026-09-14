export const SITE_URL = 'https://paul-lab.com';
export const SITE_NAME = "Paul's Experimental Lab";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/works/tini/cover.png`;
export const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export interface SeoProjectBlockLike {
  type: string;
  content: Record<string, unknown>;
}

export interface SeoProjectLike {
  slug: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  category: string;
  creativeFields?: string[];
  projectDate: string;
  location: string;
  author: string;
  tools: string[];
  publishedAt: string | null;
  updatedAt: string;
  blocks?: SeoProjectBlockLike[];
}

interface ProjectSeoProfile {
  title: string;
  description: string;
  imageAlt: string;
  topics: string[];
  alternateName?: string;
  citation?: string;
}

export interface PageSeo {
  title: string;
  description: string;
  canonical: string;
  image: string;
  imageAlt: string;
  type: 'website' | 'article';
  robots: string;
  jsonLd: unknown;
}

const HOME_TITLE = 'Paul Yang — Industrial Designer & Product Design Portfolio';
const HOME_DESCRIPTION = "Paul Yang's industrial design portfolio featuring product, computational and spatial design developed through research, prototyping and digital fabrication.";
const EXPLO11_FILM_URL = 'https://media.paul-lab.com/projects/explo-11/explo11-film.mp4?v=20260913';
const EXPLO11_ARTICLE_URL = 'https://pr.ntnu.edu.tw/ntnunews/index.php?mode=data&id=23525';

const PROJECT_PROFILES: Record<string, ProjectSeoProfile> = {
  'geologic-assemblies': {
    title: 'Geologic Assemblies — Kinetic Stone Object | Paul Yang',
    description: 'Geologic Assemblies is a kinetic collectible object by Paul Yang and Nicolas Düchs, shaped around natural stone through computational design and digital fabrication.',
    imageAlt: 'Geologic Assemblies kinetic translucent object opened around a natural stone',
    topics: ['collectible design', 'natural stone', 'kinetic sculpture', 'computational design', 'digital fabrication', 'mechanism design'],
    alternateName: 'Hidden yet ready to bloom',
  },
  'dark-side-of-the-tini': {
    title: 'Dark Side of the Tini — Computational Stone Object | Paul Yang',
    description: 'Dark Side of the Tini is a computational stone object by Paul Yang and Nicolas Düchs, using Grasshopper, centroid analysis and physical prototyping.',
    imageAlt: 'Dark Side of the Tini computational stone object by Paul Yang and Nicolas Düchs',
    topics: ['natural stone', 'computational design', 'Grasshopper', 'centroid analysis', 'physical prototyping', 'material-led design'],
  },
  '2025-industrial-design-portfolio': {
    title: '2025 Industrial Design Portfolio — Paul Yang',
    description: "Paul Yang's 2025 industrial design portfolio presents selected product, mobility, sensory and spatial design work, from research and sketches to final prototypes.",
    imageAlt: "Cover of Paul Yang's 2025 industrial design portfolio",
    topics: ['industrial design portfolio', 'product design', 'design research', 'sketching', 'prototyping', 'Taiwanese designer'],
  },
  'explo-11': {
    title: 'Explo.11 — Inclusive Mobility for Children | Paul Yang',
    description: 'Explo.11 is an inclusive mobility concept for children with limited mobility, developed through occupational therapy research, prototyping and field testing.',
    imageAlt: 'Explo.11 inclusive mobility design project for children with limited mobility',
    topics: ['inclusive mobility for children', 'occupational therapy', 'assistive play', 'independent exploration', 'product design research', 'mobility prototyping'],
    alternateName: 'Explo.11 探索十一號',
    citation: EXPLO11_ARTICLE_URL,
  },
  'tube-radio': {
    title: 'Tube Radio — Industrial Design Styling Study | Paul Yang',
    description: "Tube Radio is Paul Yang's industrial design styling study, reinterpreting the classic vacuum-tube radio through form development, 3D modelling and detailing.",
    imageAlt: 'Tube Radio industrial design styling study by Paul Yang',
    topics: ['radio design', 'industrial design styling', 'vacuum tube radio', '3D modelling', 'form development', 'consumer electronics'],
  },
  'invisible-senses': {
    title: 'Invisible Senses — Sensory Product Design | Paul Yang',
    description: "Invisible Senses is Paul Yang's product design research into overlooked human perception and sensory interactions that connect people with their environment.",
    imageAlt: 'Invisible Senses sensory product design research project by Paul Yang',
    topics: ['sensory design', 'human perception', 'user research', 'interaction design', 'industrial design', 'human-centred design'],
  },
  openess: {
    title: 'Openess — Student Dormitory Spatial Design | Paul Yang',
    description: 'Openess is a student dormitory concept by Paul Yang and Yu-Yang Huang, using organic curves to organise accessible rooms and shared community spaces.',
    imageAlt: 'Openess student dormitory with an organic curved façade and shared spaces',
    topics: ['student dormitory', 'spatial design', 'accessible design', 'community living', 'organic architecture', 'Rhino'],
  },
};

const absoluteUrl = (value: string) => {
  try {
    return new URL(value, SITE_URL).href;
  } catch {
    return DEFAULT_SOCIAL_IMAGE;
  }
};

const unique = (items: Array<string | undefined>) => [...new Set(items.map((item) => item?.trim()).filter((item): item is string => Boolean(item)))];

const splitCreators = (author: string) => author
  .split(/\s*(?:,|&|×|\band\b)\s*/i)
  .map((name) => name.trim())
  .filter(Boolean)
  .map((name) => ({
    '@type': 'Person',
    ...(name === 'Po-Yu Yang' || name === 'Paul Yang'
      ? { '@id': `${SITE_URL}/#paul-yang`, name: 'Po-Yu Yang', alternateName: 'Paul Yang' }
      : { name }),
  }));

export const getProjectSeoProfile = (project: SeoProjectLike): ProjectSeoProfile => PROJECT_PROFILES[project.slug] ?? {
  title: `${project.title} — Paul Yang`,
  description: project.summary || `${project.category} project by industrial designer Paul Yang.`,
  imageAlt: `${project.title} project by Paul Yang`,
  topics: unique([project.category, ...project.tools]),
};

export const getProjectSeoDescription = (project: SeoProjectLike) => getProjectSeoProfile(project).description;
export const getProjectSeoTitle = (project: SeoProjectLike) => getProjectSeoProfile(project).title;

const personJsonLd = () => ({
  '@type': 'Person',
  '@id': `${SITE_URL}/#paul-yang`,
  name: 'Po-Yu Yang',
  alternateName: 'Paul Yang',
  url: `${SITE_URL}/`,
  jobTitle: 'Industrial Designer',
  knowsAbout: [
    'Industrial design',
    'Product design',
    'Computational design',
    'Design engineering',
    'Digital fabrication',
    'Human-centred design',
    'Physical prototyping',
  ],
  sameAs: [
    'https://www.instagram.com/yangpboy',
    'https://www.linkedin.com/in/paul-yang-b2755329a',
    'https://www.behance.net/paulyang10',
  ],
});

export const buildHomeJsonLd = (projects: readonly SeoProjectLike[] = []) => {
  const itemList = {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#project-list`,
    name: 'Selected design projects by Paul Yang',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => {
      const profile = getProjectSeoProfile(project);
      const url = `${SITE_URL}/projects/${encodeURIComponent(project.slug)}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          '@id': `${url}#project`,
          url,
          name: project.title,
          ...(profile.alternateName ? { alternateName: profile.alternateName } : {}),
          description: profile.description,
          image: absoluteUrl(project.coverImageUrl),
        },
      };
    }),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: HOME_DESCRIPTION,
        inLanguage: 'en',
        creator: { '@id': `${SITE_URL}/#paul-yang` },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profile-page`,
        url: `${SITE_URL}/`,
        name: HOME_TITLE,
        description: HOME_DESCRIPTION,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/#paul-yang` },
        ...(projects.length ? { hasPart: { '@id': `${SITE_URL}/#project-list` } } : {}),
        inLanguage: 'en',
      },
      personJsonLd(),
      ...(projects.length ? [itemList] : []),
    ],
  };
};

export const buildProjectJsonLd = (project: SeoProjectLike) => {
  const profile = getProjectSeoProfile(project);
  const canonical = `${SITE_URL}/projects/${encodeURIComponent(project.slug)}`;
  const projectId = `${canonical}#project`;
  const pageId = `${canonical}#webpage`;
  const image = absoluteUrl(project.coverImageUrl);
  const creators = splitCreators(project.author);
  const creativeFields = project.creativeFields?.length ? project.creativeFields : [project.category];
  const keywords = unique([...profile.topics, ...creativeFields, ...project.tools]);

  const creativeWork: Record<string, unknown> = {
    '@type': 'CreativeWork',
    '@id': projectId,
    name: project.title,
    headline: project.title,
    ...(profile.alternateName ? { alternateName: profile.alternateName } : {}),
    description: profile.description,
    abstract: profile.description,
    url: canonical,
    mainEntityOfPage: { '@id': pageId },
    image: {
      '@type': 'ImageObject',
      contentUrl: image,
      url: image,
      caption: profile.imageAlt,
      representativeOfPage: true,
    },
    genre: creativeFields,
    keywords,
    about: profile.topics,
    ...(project.publishedAt ? { datePublished: project.publishedAt } : {}),
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
    ...(project.projectDate ? { temporalCoverage: project.projectDate } : {}),
    ...(project.location ? { locationCreated: { '@type': 'Place', name: project.location } } : {}),
    creator: creators,
    author: creators,
    copyrightHolder: { '@id': `${SITE_URL}/#paul-yang` },
    inLanguage: project.slug === 'explo-11' ? ['en', 'zh-Hant'] : 'en',
    ...(profile.citation ? { citation: profile.citation } : {}),
  };

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebPage',
      '@id': pageId,
      url: canonical,
      name: profile.title,
      description: profile.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      primaryImageOfPage: { '@type': 'ImageObject', contentUrl: image, caption: profile.imageAlt },
      breadcrumb: { '@id': `${canonical}#breadcrumb` },
      mainEntity: { '@id': projectId },
      inLanguage: project.slug === 'explo-11' ? ['en', 'zh-Hant'] : 'en',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: project.title, item: canonical },
      ],
    },
    creativeWork,
    personJsonLd(),
  ];

  if (project.slug === 'explo-11') {
    const filmId = `${canonical}#field-film`;
    creativeWork.subjectOf = { '@id': filmId };
    graph.push({
      '@type': 'VideoObject',
      '@id': filmId,
      name: 'Explo.11 Testing & Interview — Prof. Hsiang-Han Huang',
      description: 'A field interview about children’s mobility, play and occupational therapy conducted during the development and testing of Explo.11.',
      thumbnailUrl: [`${SITE_URL}/works/explo.11/explo11-film-poster.jpg`],
      uploadDate: project.publishedAt ?? project.updatedAt,
      duration: 'PT5M18S',
      contentUrl: EXPLO11_FILM_URL,
      encodingFormat: 'video/mp4',
      inLanguage: ['zh-Hant', 'en'],
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

export const getHomeSeo = (projects: readonly SeoProjectLike[] = []): PageSeo => ({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  canonical: `${SITE_URL}/`,
  image: DEFAULT_SOCIAL_IMAGE,
  imageAlt: 'Paul Yang industrial and product design portfolio',
  type: 'website',
  robots: INDEX_ROBOTS,
  jsonLd: buildHomeJsonLd(projects),
});

export const getProjectSeo = (project: SeoProjectLike): PageSeo => {
  const profile = getProjectSeoProfile(project);
  return {
    title: profile.title,
    description: profile.description,
    canonical: `${SITE_URL}/projects/${encodeURIComponent(project.slug)}`,
    image: absoluteUrl(project.coverImageUrl),
    imageAlt: profile.imageAlt,
    type: 'article',
    robots: INDEX_ROBOTS,
    jsonLd: buildProjectJsonLd(project),
  };
};
