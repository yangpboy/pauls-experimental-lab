import { ApiError, handleApiError, jsonData, readJson } from '../../../_shared/http';
import type { Env } from '../../../_shared/types';

interface ReorderItem {
  id: string;
  sortOrder: number;
}

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await readJson(request);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new ApiError(400, 'INVALID_PAYLOAD', 'Reorder payload must be an object.');
    }

    const rawProjects = (body as Record<string, unknown>).projects;
    if (!Array.isArray(rawProjects) || rawProjects.length === 0) {
      throw new ApiError(400, 'PROJECTS_REQUIRED', 'Provide at least one project to reorder.');
    }

    const projects: ReorderItem[] = rawProjects.map((item, index) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        throw new ApiError(400, 'INVALID_REORDER_ITEM', `Reorder item ${index + 1} is invalid.`);
      }
      const record = item as Record<string, unknown>;
      if (typeof record.id !== 'string' || !record.id) {
        throw new ApiError(400, 'PROJECT_ID_REQUIRED', `Reorder item ${index + 1} needs an ID.`);
      }

      return { id: record.id, sortOrder: index };
    });

    const now = new Date().toISOString();
    await env.DB.batch(projects.map((project) => env.DB
      .prepare('UPDATE projects SET sort_order = ?, updated_at = ? WHERE id = ?')
      .bind(project.sortOrder, now, project.id)));

    return jsonData({ updated: projects.length });
  } catch (error) {
    return handleApiError(error);
  }
};
