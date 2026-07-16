import { injectSeoBlock } from './_shared/seo';
import type { Env } from './_shared/types';

export const onRequestGet: PagesFunction<Env> = async ({ next }) => {
  const response = await next();
  if (!(response.headers.get('content-type') ?? '').includes('text/html')) return response;

  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'private, no-store');
  headers.set('x-robots-tag', 'noindex, nofollow');

  const html = injectSeoBlock(await response.text(), {
    title: "Private Studio — Paul's Experimental Lab",
    description: 'Private portfolio editor sign-in for Paul Yang.',
    canonical: 'https://paul-lab.com/login',
    image: 'https://paul-lab.com/works/tini/cover.png',
    imageAlt: "Paul's Experimental Lab private studio",
    robots: 'noindex, nofollow',
    jsonLd: {},
  });

  return new Response(html, { status: response.status, headers });
};
