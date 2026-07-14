import { createProject, listProjects, validateProjectPayload } from '../../../_shared/projects';
import { handleApiError, jsonData, readJson } from '../../../_shared/http';
import type { Env } from '../../../_shared/types';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const projects = await listProjects(env.DB, true, true);
    return jsonData(projects);
  } catch (error) {
    return handleApiError(error);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const payload = validateProjectPayload(await readJson(request));
    const project = await createProject(env.DB, payload);
    return jsonData(project, 201);
  } catch (error) {
    return handleApiError(error);
  }
};
