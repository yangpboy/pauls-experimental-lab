import { ApiError } from './http';
import type { BlockType, ProjectBlockInput, ProjectPayload, ProjectStatus } from './types';

const BLOCK_TYPES = new Set<BlockType>([
  'hero',
  'text',
  'image',
  'gallery',
  'video',
  'quote',
  'twoColumn',
  'process',
]);

interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover_image_url: string;
  category: string;
  project_date: string;
  location: string;
  author: string;
  tools_json: string;
  status: ProjectStatus;
  sort_order: number;
  likes_count: number;
  shares_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BlockRow {
  id: string;
  project_id: string;
  block_type: BlockType;
  content_json: string;
  sort_order: number;
}

interface EngagementRow {
  likes_count: number;
  shares_count: number;
}

const PROJECT_COLUMNS = `
  id, slug, title, summary, cover_image_url, category, project_date, location,
  author, tools_json, status, sort_order, likes_count, shares_count,
  published_at, created_at, updated_at
`;

const safeJsonArray = (value: string): string[] => {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const safeJsonObject = (value: string): Record<string, unknown> => {
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
};

const mapBlock = (row: BlockRow) => ({
  id: row.id,
  type: row.block_type,
  sortOrder: row.sort_order,
  content: safeJsonObject(row.content_json),
});

const mapProject = (row: ProjectRow, blocks?: BlockRow[]) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  summary: row.summary,
  coverImageUrl: row.cover_image_url,
  category: row.category,
  projectDate: row.project_date,
  location: row.location,
  author: row.author,
  tools: safeJsonArray(row.tools_json),
  status: row.status,
  sortOrder: row.sort_order,
  likesCount: row.likes_count,
  sharesCount: row.shares_count,
  publishedAt: row.published_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  ...(blocks ? { blocks: blocks.map(mapBlock) } : {}),
});

export const listProjects = async (db: D1Database, includeDrafts = false, includeBlocks = false) => {
  const where = includeDrafts ? '' : "WHERE status = 'published'";
  const projects = await db
    .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects ${where} ORDER BY sort_order ASC, created_at DESC`)
    .all<ProjectRow>();

  if (!includeBlocks || projects.results.length === 0) {
    return projects.results.map((project) => mapProject(project));
  }

  const blocks = await db
    .prepare('SELECT id, project_id, block_type, content_json, sort_order FROM project_blocks ORDER BY sort_order ASC')
    .all<BlockRow>();
  const projectIds = new Set(projects.results.map((project) => project.id));
  const blocksByProject = new Map<string, BlockRow[]>();

  for (const block of blocks.results) {
    if (!projectIds.has(block.project_id)) continue;
    const existing = blocksByProject.get(block.project_id) ?? [];
    existing.push(block);
    blocksByProject.set(block.project_id, existing);
  }

  return projects.results.map((project) => mapProject(project, blocksByProject.get(project.id) ?? []));
};

export const getProjectBySlug = async (db: D1Database, slug: string, includeDrafts = false) => {
  const statusClause = includeDrafts ? '' : "AND status = 'published'";
  const project = await db
    .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE slug = ? ${statusClause} LIMIT 1`)
    .bind(slug)
    .first<ProjectRow>();

  if (!project) return null;

  const blocks = await db
    .prepare('SELECT id, project_id, block_type, content_json, sort_order FROM project_blocks WHERE project_id = ? ORDER BY sort_order ASC')
    .bind(project.id)
    .all<BlockRow>();

  return mapProject(project, blocks.results);
};

export const updateProjectEngagement = async (
  db: D1Database,
  slug: string,
  metric: 'likes' | 'shares',
  change: 1 | -1,
) => {
  const column = metric === 'likes' ? 'likes_count' : 'shares_count';

  await db
    .prepare(`
      UPDATE projects
      SET ${column} = MAX(0, ${column} + ?), updated_at = ?
      WHERE slug = ? AND status = 'published'
    `)
    .bind(change, new Date().toISOString(), slug)
    .run();

  const counts = await db
    .prepare(`
      SELECT likes_count, shares_count
      FROM projects
      WHERE slug = ? AND status = 'published'
      LIMIT 1
    `)
    .bind(slug)
    .first<EngagementRow>();

  if (!counts) return null;

  return {
    likesCount: counts.likes_count,
    sharesCount: counts.shares_count,
  };
};

export const getProjectById = async (db: D1Database, id: string) => {
  const project = await db
    .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE id = ? LIMIT 1`)
    .bind(id)
    .first<ProjectRow>();

  if (!project) return null;

  const blocks = await db
    .prepare('SELECT id, project_id, block_type, content_json, sort_order FROM project_blocks WHERE project_id = ? ORDER BY sort_order ASC')
    .bind(id)
    .all<BlockRow>();

  return mapProject(project, blocks.results);
};

const stringField = (object: Record<string, unknown>, key: string, fallback = '') => {
  const value = object[key];
  return typeof value === 'string' ? value.trim() : fallback;
};

const normalizeBlocks = (value: unknown): ProjectBlockInput[] => {
  if (!Array.isArray(value)) return [];

  return value.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new ApiError(400, 'INVALID_BLOCK', `Block ${index + 1} must be an object.`);
    }

    const block = item as Record<string, unknown>;
    const type = block.type;
    if (typeof type !== 'string' || !BLOCK_TYPES.has(type as BlockType)) {
      throw new ApiError(400, 'INVALID_BLOCK_TYPE', `Block ${index + 1} has an unsupported type.`);
    }

    const content = block.content;
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
      throw new ApiError(400, 'INVALID_BLOCK_CONTENT', `Block ${index + 1} content must be an object.`);
    }

    return {
      id: typeof block.id === 'string' && block.id ? block.id : crypto.randomUUID(),
      type: type as BlockType,
      sortOrder: index,
      content: content as Record<string, unknown>,
    };
  });
};

export const validateProjectPayload = (value: unknown): ProjectPayload => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiError(400, 'INVALID_PAYLOAD', 'Project payload must be an object.');
  }

  const object = value as Record<string, unknown>;
  const title = stringField(object, 'title');
  const slug = stringField(object, 'slug').toLowerCase();
  if (!title) throw new ApiError(400, 'TITLE_REQUIRED', 'Project title is required.');
  if (!slug) throw new ApiError(400, 'SLUG_REQUIRED', 'Project slug is required.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new ApiError(400, 'INVALID_SLUG', 'Slug may only contain lowercase letters, numbers, and single hyphens.');
  }

  const rawStatus = object.status;
  const status: ProjectStatus = rawStatus === 'published' ? 'published' : 'draft';
  const tools = Array.isArray(object.tools)
    ? object.tools.filter((tool): tool is string => typeof tool === 'string').map((tool) => tool.trim()).filter(Boolean)
    : [];

  return {
    slug,
    title,
    summary: stringField(object, 'summary'),
    coverImageUrl: stringField(object, 'coverImageUrl'),
    category: stringField(object, 'category', 'Uncategorized'),
    projectDate: stringField(object, 'projectDate'),
    location: stringField(object, 'location'),
    author: stringField(object, 'author'),
    tools,
    status,
    sortOrder: typeof object.sortOrder === 'number' && Number.isFinite(object.sortOrder)
      ? Math.max(0, Math.trunc(object.sortOrder))
      : 0,
    blocks: normalizeBlocks(object.blocks),
  };
};

const blockStatements = (db: D1Database, projectId: string, blocks: ProjectBlockInput[]) =>
  blocks.map((block, index) => db.prepare(`
    INSERT INTO project_blocks (id, project_id, block_type, content_json, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    block.id ?? crypto.randomUUID(),
    projectId,
    block.type,
    JSON.stringify(block.content),
    index,
  ));

export const createProject = async (db: D1Database, payload: ProjectPayload) => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const publishedAt = payload.status === 'published' ? now : null;
  const statements = [
    db.prepare(`
      INSERT INTO projects (
        id, slug, title, summary, cover_image_url, category, project_date, location,
        author, tools_json, status, sort_order, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, payload.slug, payload.title, payload.summary, payload.coverImageUrl,
      payload.category, payload.projectDate, payload.location, payload.author,
      JSON.stringify(payload.tools), payload.status, payload.sortOrder,
      publishedAt, now, now,
    ),
    ...blockStatements(db, id, payload.blocks),
  ];

  await db.batch(statements);
  return getProjectById(db, id);
};

export const updateProject = async (db: D1Database, id: string, payload: ProjectPayload) => {
  const existing = await getProjectById(db, id);
  if (!existing) throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found.');

  const now = new Date().toISOString();
  const publishedAt = payload.status === 'published'
    ? existing.publishedAt ?? now
    : null;
  const statements = [
    db.prepare(`
      UPDATE projects SET
        slug = ?, title = ?, summary = ?, cover_image_url = ?, category = ?,
        project_date = ?, location = ?, author = ?, tools_json = ?, status = ?,
        sort_order = ?, published_at = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      payload.slug, payload.title, payload.summary, payload.coverImageUrl,
      payload.category, payload.projectDate, payload.location, payload.author,
      JSON.stringify(payload.tools), payload.status, payload.sortOrder,
      publishedAt, now, id,
    ),
    db.prepare('DELETE FROM project_blocks WHERE project_id = ?').bind(id),
    ...blockStatements(db, id, payload.blocks),
  ];

  await db.batch(statements);
  return getProjectById(db, id);
};
