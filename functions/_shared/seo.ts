export interface SeoDocument {
  title: string;
  description: string;
  canonical: string;
  image: string;
  imageAlt: string;
  type?: 'website' | 'article';
  robots?: string;
  jsonLd: unknown;
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const safeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

export const absoluteUrl = (value: string, origin = 'https://paul-lab.com') => {
  try {
    return new URL(value, origin).href;
  } catch {
    return `${origin}/works/tini/cover.png`;
  }
};

export const renderSeoBlock = (seo: SeoDocument) => `
    <meta name="seo-boundary-start" content="true" />
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <meta name="author" content="Paul Yang" />
    <meta name="robots" content="${escapeHtml(seo.robots ?? 'index, follow, max-image-preview:large')}" />
    <link rel="canonical" href="${escapeHtml(seo.canonical)}" />
    <meta property="og:type" content="${seo.type ?? 'website'}" />
    <meta property="og:site_name" content="Paul's Experimental Lab" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:url" content="${escapeHtml(seo.canonical)}" />
    <meta property="og:image" content="${escapeHtml(seo.image)}" />
    <meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${escapeHtml(seo.image)}" />
    <script id="seo-jsonld" type="application/ld+json">${safeJsonLd(seo.jsonLd)}</script>
    <meta name="seo-boundary-end" content="true" />`;

const SEO_BLOCK_PATTERN = /<meta\s+name=["']seo-boundary-start["'][^>]*>[\s\S]*?<meta\s+name=["']seo-boundary-end["'][^>]*>/i;

export const injectSeoBlock = (html: string, seo: SeoDocument) => {
  const block = renderSeoBlock(seo);
  return SEO_BLOCK_PATTERN.test(html)
    ? html.replace(SEO_BLOCK_PATTERN, block)
    : html.replace('</head>', `${block}\n  </head>`);
};
