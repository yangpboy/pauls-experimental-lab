import { ApiError, getParam, handleApiError, jsonData, readJson } from '../../../_shared/http';
import { getProjectById, updateProject, validateProjectPayload } from '../../../_shared/projects';
import type { Env } from '../../../_shared/types';

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const id = getParam(params, 'id');
    if (!id) throw new ApiError(400, 'PROJECT_ID_REQUIRED', 'Project ID is required.');
    const project = await getProjectById(env.DB, id);
    if (!project) throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found.');
    return jsonData(project);
  } catch (error) {
    return handleApiError(error);
  }
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  try {
    const id = getParam(params, 'id');
    if (!id) throw new ApiError(400, 'PROJECT_ID_REQUIRED', 'Project ID is required.');
    const payload = validateProjectPayload(await readJson(request));
    const project = await updateProject(env.DB, id, payload);
    return jsonData(project);
  } catch (error) {
    return handleApiError(error);
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const id = getParam(params, 'id');
    if (!id) throw new ApiError(400, 'PROJECT_ID_REQUIRED', 'Project ID is required.');

    const existing = await getProjectById(env.DB, id);
    if (!existing) throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found.');

    await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
};
