import { getParam, handleApiError, jsonData } from '../../_shared/http';
import { getProjectBySlug } from '../../_shared/projects';
import type { Env } from '../../_shared/types';

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const slug = getParam(params, 'slug');
    if (!slug) return jsonData(null, 404);

    const project = await getProjectBySlug(env.DB, slug, false);
    if (!project) {
      return new Response(JSON.stringify({
        error: { code: 'PROJECT_NOT_FOUND', message: 'Published project not found.' },
      }), {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      });
    }

    return jsonData(project);
  } catch (error) {
    return handleApiError(error);
  }
};
