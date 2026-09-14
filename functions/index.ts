import { getHomeSeo, getProjectSeoDescription, SITE_NAME, SITE_URL, type SeoProjectLike } from '../shared/siteSeo';
import { listProjects } from './_shared/projects';
import { injectSeoBlock } from './_shared/seo';
import type { Env } from './_shared/types';

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const renderHomeFallback = (projects: readonly SeoProjectLike[]) => `<noscript>
  <main>
    <header>
      <h1>Paul Yang — Industrial Designer</h1>
      <p>Product, computational and spatial design developed through research, prototyping, digital fabrication and critical making.</p>
    </header>
    <section aria-labelledby="selected-projects">
      <h2 id="selected-projects">Selected projects</h2>
      <ul>
        ${projects.map((project) => `<li>
          <article>
            <h3><a href="${SITE_URL}/projects/${encodeURIComponent(project.slug)}">${escapeHtml(project.title)}</a></h3>
            <p>${escapeHtml(getProjectSeoDescription(project))}</p>
          </article>
        </li>`).join('\n')}
      </ul>
    </section>
    <footer><p>${escapeHtml(SITE_NAME)} · Portfolio of Po-Yu “Paul” Yang.</p></footer>
  </main>
</noscript>`;

const injectFallback = (html: string, fallback: string) => html.includes('<div id="root"></div>')
  ? html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${fallback}`)
  : html.replace('</body>', `${fallback}\n  </body>`);

export const onRequestGet: PagesFunction<Env> = async ({ env, next }) => {
  const response = await next();
  if (!(response.headers.get('content-type') ?? '').includes('text/html')) return response;

  let projects: Awaited<ReturnType<typeof listProjects>> = [];
  try {
    projects = await listProjects(env.DB, false, false);
  } catch (error) {
    console.error('Unable to load projects for homepage metadata.', error);
  }

  const seo = getHomeSeo(projects);
  const html = injectFallback(
    injectSeoBlock(await response.text(), seo),
    renderHomeFallback(projects),
  );
  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('content-language', 'en');
  headers.set('cache-control', 'public, max-age=0, must-revalidate');
  headers.set('link', `<${seo.canonical}>; rel="canonical"`);
  return new Response(html, { status: response.status, headers });
};
