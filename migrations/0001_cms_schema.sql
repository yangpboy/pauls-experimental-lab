PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Uncategorized',
  project_date TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  tools_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(tools_json)),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  likes_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS project_blocks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  block_type TEXT NOT NULL CHECK (block_type IN (
    'hero', 'text', 'image', 'gallery', 'video', 'quote', 'twoColumn', 'process'
  )),
  content_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(content_json)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  storage_provider TEXT NOT NULL DEFAULT 'external' CHECK (storage_provider IN ('external', 'r2', 'images')),
  storage_key TEXT,
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  metadata_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata_json)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_public_order
  ON projects(status, sort_order, published_at);
CREATE INDEX IF NOT EXISTS idx_project_blocks_project_order
  ON project_blocks(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_assets_project
  ON assets(project_id, created_at);
