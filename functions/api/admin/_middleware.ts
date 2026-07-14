import { json } from '../../_shared/http';
import type { Env } from '../../_shared/types';

const isLocalRequest = (request: Request) => {
  const hostname = new URL(request.url).hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
};

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  if (env.ADMIN_DEV_BYPASS === 'true' && isLocalRequest(request)) {
    return next();
  }

  const email = request.headers.get('cf-access-authenticated-user-email')?.trim().toLowerCase();
  if (!email) {
    return json({
      error: {
        code: 'ADMIN_AUTH_REQUIRED',
        message: 'Cloudflare Access authentication is required for this endpoint.',
      },
    }, 401);
  }

  const allowedEmails = (env.ADMIN_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails.length > 0 && !allowedEmails.includes(email)) {
    return json({
      error: {
        code: 'ADMIN_FORBIDDEN',
        message: 'This Cloudflare Access identity is not allowed to manage projects.',
      },
    }, 403);
  }

  return next();
};
