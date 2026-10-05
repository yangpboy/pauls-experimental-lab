import { createRemoteJWKSet, jwtVerify } from 'jose';
import { json } from '../../_shared/http';
import type { Env } from '../../_shared/types';

const jwksByTeamDomain = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

const getJwks = (teamDomain: string) => {
  const cached = jwksByTeamDomain.get(teamDomain);
  if (cached) return cached;

  const jwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
  jwksByTeamDomain.set(teamDomain, jwks);
  return jwks;
};

const isLocalRequest = (request: Request) => {
  const hostname = new URL(request.url).hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
};

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  if (env.ADMIN_DEV_BYPASS === 'true' && isLocalRequest(request)) {
    return next();
  }

  const allowedEmails = (env.ADMIN_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails.length === 0) {
    return json({
      error: {
        code: 'ADMIN_NOT_CONFIGURED',
        message: 'Admin access is disabled until an email allowlist is configured.',
      },
    }, 503);
  }

  const teamDomain = env.CF_ACCESS_TEAM_DOMAIN?.trim().replace(/\/+$/, '');
  const audience = env.CF_ACCESS_AUD?.trim();
  if (!teamDomain || !audience) {
    return json({
      error: {
        code: 'ADMIN_AUTH_NOT_CONFIGURED',
        message: 'Cloudflare Access JWT verification is not configured.',
      },
    }, 503);
  }

  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token) {
    return json({
      error: {
        code: 'ADMIN_AUTH_REQUIRED',
        message: 'Cloudflare Access authentication is required for this endpoint.',
      },
    }, 401);
  }

  let email = '';
  try {
    const { payload } = await jwtVerify(token, getJwks(teamDomain), {
      issuer: teamDomain,
      audience,
    });
    email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  } catch {
    return json({
      error: {
        code: 'ADMIN_AUTH_INVALID',
        message: 'Cloudflare Access authentication could not be verified.',
      },
    }, 401);
  }

  if (!email) {
    return json({
      error: {
        code: 'ADMIN_IDENTITY_MISSING',
        message: 'The verified Cloudflare Access identity does not include an email address.',
      },
    }, 401);
  }

  if (!allowedEmails.includes(email)) {
    return json({
      error: {
        code: 'ADMIN_FORBIDDEN',
        message: 'This Cloudflare Access identity is not allowed to manage projects.',
      },
    }, 403);
  }

  return next();
};
