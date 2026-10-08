import { getAboutContent } from '../_shared/about';
import { handleApiError, jsonData } from '../_shared/http';
import type { Env } from '../_shared/types';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    return jsonData(await getAboutContent(env.DB));
  } catch (error) {
    return handleApiError(error);
  }
};
