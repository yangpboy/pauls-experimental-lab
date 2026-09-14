import { getProjectSeo, SITE_NAME, SITE_URL } from '../../shared/siteSeo';
import { getParam } from '../_shared/http';
import { getProjectBySlug } from '../_shared/projects';
import { injectSeoBlock } from '../_shared/seo';
import type { Env } from '../_shared/types';

type SeoProject = NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>;

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';

const renderParagraphs = (value: string) => value
  .split(/\n{2,}/)
  .map((paragraph) => paragraph.trim())
  .filter(Boolean)
  .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
  .join('\n');

const renderBlockText = (project: SeoProject) => {
  if (project.slug === 'explo-11') return '';

  return (project.blocks ?? []).flatMap((block) => {
    const content = block.content;
    const sections: string[] = [];
    const heading = text(content.heading);
    const body = text(content.body);
    const quote = text(content.quote);
    const attribution = text(content.attribution);

    if (heading) sections.push(`<h2>${escapeHtml(heading)}</h2>`);
    if (body) sections.push(renderParagraphs(body));
    if (quote) sections.push(`<blockquote><p>${escapeHtml(quote)}</p>${attribution ? `<cite>${escapeHtml(attribution)}</cite>` : ''}</blockquote>`);
    return sections;
  }).join('\n');
};

const renderProjectFallback = (project: SeoProject, description: string) => {
  return `<noscript>
    <main>
      <article>
        <header>
          <p>${escapeHtml(project.category)}</p>
          <h1>${escapeHtml(project.title)}</h1>
          <p>${escapeHtml(description)}</p>
        </header>
        <dl>
          ${project.projectDate ? `<dt>Project date</dt><dd>${escapeHtml(project.projectDate)}</dd>` : ''}
          ${project.location ? `<dt>Location</dt><dd>${escapeHtml(project.location)}</dd>` : ''}
          ${project.author ? `<dt>Designers</dt><dd>${escapeHtml(project.author)}</dd>` : ''}
          ${project.tools.length ? `<dt>Methods and tools</dt><dd>${escapeHtml(project.tools.join(', '))}</dd>` : ''}
        </dl>
        ${renderBlockText(project)}
        <p><a href="${SITE_URL}/">View all projects at ${escapeHtml(SITE_NAME)}</a></p>
      </article>
    </main>
  </noscript>`;
};

const injectFallback = (html: string, fallback: string) => html.includes('<div id="root"></div>')
  ? html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${fallback}`)
  : html.replace('</body>', `${fallback}\n  </body>`);

export const onRequestGet: PagesFunction<Env> = async ({ env, params, next }) => {
  const response = await next();
  if (!(response.headers.get('content-type') ?? '').includes('text/html')) return response;

  const slug = getParam(params, 'slug');
  const project = slug ? await getProjectBySlug(env.DB, slug, false) : null;
  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('content-language', 'en');
  headers.set('cache-control', 'public, max-age=0, must-revalidate');

  if (!project) {
    headers.set('x-robots-tag', 'noindex, nofollow');
    const html = injectSeoBlock(await response.text(), {
      title: `Project not found — ${SITE_NAME}`,
      description: 'This project is not available.',
      canonical: `${SITE_URL}/`,
      image: `${SITE_URL}/works/tini/cover.png`,
      imageAlt: 'Paul Yang industrial design portfolio',
      type: 'website',
      robots: 'noindex, nofollow',
      jsonLd: {},
    });
    return new Response(html, { status: 404, headers });
  }

  const seo = getProjectSeo(project);
  const html = injectFallback(
    injectSeoBlock(await response.text(), seo),
    renderProjectFallback(project, seo.description),
  );

  headers.set('link', `<${seo.canonical}>; rel="canonical"`);
  return new Response(html, { status: response.status, headers });
};
