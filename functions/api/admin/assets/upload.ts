import { ApiError, handleApiError, jsonData } from '../../../_shared/http';
import type { Env } from '../../../_shared/types';

interface ImagesResponse {
  success: boolean;
  result?: { id: string; variants?: string[] };
  errors?: Array<{ message?: string }>;
}

const sanitizeFilename = (filename: string) => filename
  .normalize('NFKD')
  .replace(/[^a-zA-Z0-9._-]+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '') || 'asset';

const insertAsset = async (
  env: Env,
  provider: 'r2' | 'images',
  key: string,
  url: string,
  file: File,
  projectId: string | null,
) => {
  const id = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO assets (id, project_id, storage_provider, storage_key, url, mime_type, metadata_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    projectId,
    provider,
    key,
    url,
    file.type || null,
    JSON.stringify({ originalFilename: file.name, size: file.size }),
  ).run();

  return { id, provider, key, url, mimeType: file.type, size: file.size };
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      throw new ApiError(400, 'FILE_REQUIRED', 'Choose a file to upload.');
    }
    if (!file.type.startsWith('image/')) {
      throw new ApiError(400, 'IMAGE_REQUIRED', 'Only image uploads are supported in this CMS version.');
    }
    if (file.size > 20 * 1024 * 1024) {
      throw new ApiError(413, 'FILE_TOO_LARGE', 'Images must be 20 MB or smaller.');
    }

    const projectIdValue = form.get('projectId');
    const projectId = typeof projectIdValue === 'string' && projectIdValue ? projectIdValue : null;
    const provider = env.ASSET_PROVIDER ?? 'r2';

    if (provider === 'r2') {
      if (!env.MEDIA_BUCKET || !env.R2_PUBLIC_BASE_URL) {
        throw new ApiError(501, 'R2_NOT_CONFIGURED', 'Configure MEDIA_BUCKET and R2_PUBLIC_BASE_URL before uploading.');
      }

      const key = `portfolio/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${sanitizeFilename(file.name)}`;
      await env.MEDIA_BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type || 'application/octet-stream' },
        customMetadata: projectId ? { projectId } : undefined,
      });
      const url = `${env.R2_PUBLIC_BASE_URL.replace(/\/$/, '')}/${key}`;
      return jsonData(await insertAsset(env, 'r2', key, url, file, projectId), 201);
    }

    if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_IMAGES_API_TOKEN) {
      throw new ApiError(501, 'IMAGES_NOT_CONFIGURED', 'Configure CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_IMAGES_API_TOKEN before uploading.');
    }

    const imagesForm = new FormData();
    imagesForm.set('file', file, file.name);
    imagesForm.set('metadata', JSON.stringify({ projectId, originalFilename: file.name }));
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`, {
      method: 'POST',
      headers: { authorization: `Bearer ${env.CLOUDFLARE_IMAGES_API_TOKEN}` },
      body: imagesForm,
    });
    const result = await response.json() as ImagesResponse;
    if (!response.ok || !result.success || !result.result) {
      throw new ApiError(502, 'IMAGES_UPLOAD_FAILED', result.errors?.[0]?.message ?? 'Cloudflare Images upload failed.');
    }

    const variantName = env.CLOUDFLARE_IMAGES_VARIANT ?? 'public';
    const url = result.result.variants?.find((variant) => variant.endsWith(`/${variantName}`))
      ?? result.result.variants?.[0];
    if (!url) {
      throw new ApiError(502, 'IMAGES_VARIANT_MISSING', `Cloudflare Images did not return a ${variantName} delivery URL.`);
    }

    return jsonData(await insertAsset(env, 'images', result.result.id, url, file, projectId), 201);
  } catch (error) {
    return handleApiError(error);
  }
};
