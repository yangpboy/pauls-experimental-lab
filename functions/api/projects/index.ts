import { handleApiError, jsonData } from '../../_shared/http';
import { listProjects } from '../../_shared/projects';
import type { Env } from '../../_shared/types';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const projects = await listProjects(env.DB, false, false);
    return jsonData(projects);
  } catch (error) {
    return handleApiError(error);
  }
};
