import { getAboutContent, saveAboutContent, validateAboutContent } from '../../_shared/about';
import { handleApiError, jsonData, readJson } from '../../_shared/http';
import type { Env } from '../../_shared/types';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    return jsonData(await getAboutContent(env.DB));
  } catch (error) {
    return handleApiError(error);
  }
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const content = validateAboutContent(await readJson(request));
    return jsonData(await saveAboutContent(env.DB, content));
  } catch (error) {
    return handleApiError(error);
  }
};
