import type { ApiEnvelope, ApiErrorEnvelope, Project, ProjectInput, ProjectSummary } from '../types/cms';

export type ProjectEngagement = Pick<ProjectSummary, 'likesCount' | 'sharesCount'>;

export class CmsApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) return undefined as T;

  let payload: ApiEnvelope<T> | ApiErrorEnvelope | null = null;
  try {
    payload = await response.json() as ApiEnvelope<T> | ApiErrorEnvelope;
  } catch {
    // The generic error below covers malformed upstream responses.
  }

  if (!response.ok) {
    const apiError = payload && 'error' in payload ? payload.error : null;
    throw new CmsApiError(
      apiError?.message ?? `Request failed with status ${response.status}.`,
      response.status,
      apiError?.code ?? 'REQUEST_FAILED',
      apiError?.details,
    );
  }

  if (!payload || !('data' in payload)) {
    throw new CmsApiError('The server returned an invalid response.', response.status, 'INVALID_RESPONSE');
  }

  return payload.data;
};

const request = async <T>(path: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set('content-type', 'application/json');

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: 'same-origin',
    cache: 'no-store',
  });
  return parseResponse<T>(response);
};

export const projectsApi = {
  list: () => request<ProjectSummary[]>('/api/projects'),
  getBySlug: (slug: string) => request<Project>(`/api/projects/${encodeURIComponent(slug)}`),
  like: (slug: string) => request<ProjectEngagement>(`/api/projects/${encodeURIComponent(slug)}/like`, { method: 'POST' }),
  unlike: (slug: string) => request<ProjectEngagement>(`/api/projects/${encodeURIComponent(slug)}/like`, { method: 'DELETE' }),
  share: (slug: string) => request<ProjectEngagement>(`/api/projects/${encodeURIComponent(slug)}/share`, { method: 'POST' }),
};

export const adminProjectsApi = {
  list: () => request<Project[]>('/api/admin/projects'),
  get: (id: string) => request<Project>(`/api/admin/projects/${encodeURIComponent(id)}`),
  create: (project: ProjectInput) => request<Project>('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  }),
  update: (id: string, project: ProjectInput) => request<Project>(`/api/admin/projects/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(project),
  }),
  remove: (id: string) => request<void>(`/api/admin/projects/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  reorder: (projects: Array<{ id: string; sortOrder: number }>) => request<{ updated: number }>('/api/admin/projects/reorder', {
    method: 'PUT',
    body: JSON.stringify({ projects }),
  }),
  uploadAsset: (file: File, projectId?: string) => {
    const body = new FormData();
    body.set('file', file);
    if (projectId) body.set('projectId', projectId);
    return request<{ id: string; provider: string; key: string; url: string }>('/api/admin/assets/upload', {
      method: 'POST',
      body,
    });
  },
};
