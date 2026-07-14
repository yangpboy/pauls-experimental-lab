import { getParam, handleApiError, jsonData } from '../../../_shared/http';
import { updateProjectEngagement } from '../../../_shared/projects';
import type { Env } from '../../../_shared/types';

const updateLike = async (env: Env, params: Record<string, string | string[]>, change: 1 | -1) => {
  const slug = getParam(params, 'slug');
  if (!slug) return jsonData(null, 404);

  const engagement = await updateProjectEngagement(env.DB, slug, 'likes', change);
  if (!engagement) {
    return new Response(JSON.stringify({
      error: { code: 'PROJECT_NOT_FOUND', message: 'Published project not found.' },
    }), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

  return jsonData(engagement);
};

export const onRequestPost: PagesFunction<Env> = async ({ env, params }) => {
  try {
    return await updateLike(env, params, 1);
  } catch (error) {
    return handleApiError(error);
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  try {
    return await updateLike(env, params, -1);
  } catch (error) {
    return handleApiError(error);
  }
};
