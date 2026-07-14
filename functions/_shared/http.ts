export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

export const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });

export const jsonData = (data: unknown, status = 200) => json({ data }, status);

export const readJson = async (request: Request): Promise<unknown> => {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Expected an application/json request body.');
  }

  try {
    return await request.json();
  } catch {
    throw new ApiError(400, 'INVALID_JSON', 'The request body is not valid JSON.');
  }
};

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return json({ error: { code: error.code, message: error.message, details: error.details } }, error.status);
  }

  const message = error instanceof Error ? error.message : 'Unknown server error';
  if (/unique constraint/i.test(message)) {
    return json({ error: { code: 'SLUG_CONFLICT', message: 'A project with this slug already exists.' } }, 409);
  }

  console.error(error);
  return json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected server error occurred.' } }, 500);
};

export const getParam = (params: Record<string, string | string[]>, key: string) => {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};
