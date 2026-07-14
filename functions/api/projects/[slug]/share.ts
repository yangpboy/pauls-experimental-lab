import { getParam, handleApiError, jsonData } from '../../../_shared/http';
import { updateProjectEngagement } from '../../../_shared/projects';
import type { Env } from '../../../_shared/types';

export const onRequestPost: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const slug = getParam(params, 'slug');
    if (!slug) return jsonData(null, 404);

    const engagement = await updateProjectEngagement(env.DB, slug, 'shares', 1);
    if (!engagement) {
      return new Response(JSON.stringify({
        error: { code: 'PROJECT_NOT_FOUND', message: 'Published project not found.' },
      }), {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      });
    }

    return jsonData(engagement);
  } catch (error) {
    return handleApiError(error);
  }
};
