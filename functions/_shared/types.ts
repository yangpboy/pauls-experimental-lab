export interface Env {
  DB: D1Database;
  MEDIA_BUCKET?: R2Bucket;
  ASSET_PROVIDER?: 'r2' | 'images';
  R2_PUBLIC_BASE_URL?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_IMAGES_API_TOKEN?: string;
  CLOUDFLARE_IMAGES_VARIANT?: string;
  ADMIN_ALLOWED_EMAILS?: string;
  ADMIN_DEV_BYPASS?: string;
}

export type ProjectStatus = 'draft' | 'published';

export type BlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'gallery'
  | 'video'
  | 'quote'
  | 'twoColumn'
  | 'process';

export interface ProjectBlockInput {
  id?: string;
  type: BlockType;
  sortOrder?: number;
  content: Record<string, unknown>;
}

export interface ProjectPayload {
  slug: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  category: string;
  projectDate: string;
  location: string;
  author: string;
  tools: string[];
  status: ProjectStatus;
  sortOrder: number;
  blocks: ProjectBlockInput[];
}
