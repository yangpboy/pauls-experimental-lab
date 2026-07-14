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

export interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

export interface ProcessStep {
  title: string;
  description?: string;
  imageUrl?: string;
}

export type ProjectBlockContent = Record<string, unknown> & {
  heading?: string;
  body?: string;
  imageUrl?: string;
  url?: string;
  alt?: string;
  caption?: string;
  subheading?: string;
  eyebrow?: string;
  attribution?: string;
  quote?: string;
  posterUrl?: string;
  columns?: number;
  images?: GalleryImage[];
  steps?: ProcessStep[];
  left?: { heading?: string; body?: string; imageUrl?: string };
  right?: { heading?: string; body?: string; imageUrl?: string };
};

export interface ProjectBlock {
  id: string;
  type: BlockType;
  sortOrder: number;
  content: ProjectBlockContent;
}

export interface ProjectSummary {
  id: string;
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
  likesCount: number;
  sharesCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project extends ProjectSummary {
  blocks: ProjectBlock[];
}

export interface ProjectInput {
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
  blocks: ProjectBlock[];
}

export interface ApiEnvelope<T> {
  data: T;
}

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const BLOCK_TYPES: BlockType[] = [
  'hero',
  'text',
  'image',
  'gallery',
  'video',
  'quote',
  'twoColumn',
  'process',
];

export const createEmptyBlock = (type: BlockType, sortOrder = 0): ProjectBlock => {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `block-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const contentByType: Record<BlockType, ProjectBlockContent> = {
    hero: { imageUrl: '', eyebrow: '', heading: '', subheading: '' },
    text: { heading: '', body: '' },
    image: { url: '', alt: '', caption: '' },
    gallery: { images: [], columns: 1 },
    video: { url: '', posterUrl: '', caption: '' },
    quote: { quote: '', attribution: '' },
    twoColumn: { left: { heading: '', body: '', imageUrl: '' }, right: { heading: '', body: '', imageUrl: '' } },
    process: { heading: '', steps: [] },
  };

  return { id, type, sortOrder, content: contentByType[type] };
};
