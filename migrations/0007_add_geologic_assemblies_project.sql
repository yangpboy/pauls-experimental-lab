INSERT OR IGNORE INTO projects (
  id,
  slug,
  title,
  summary,
  cover_image_url,
  category,
  project_date,
  location,
  author,
  tools_json,
  status,
  sort_order,
  likes_count,
  shares_count,
  published_at
) VALUES (
  'project-geologic-assemblies',
  'geologic-assemblies',
  'Hidden yet ready to bloom',
  'A mechanically expanding translucent body built around the irregular character of natural stone.',
  '/works/geologic-assemblies/assets/00-02.webp',
  'Collectible Design',
  '08.2026',
  'Germany',
  'Po-Yu Yang and Nicolas Düchs',
  '["Rhino","Grasshopper","Digital Fabrication","Mechanism Design"]',
  'published',
  0,
  0,
  0,
  '2026-08-25T00:00:00.000Z'
);

INSERT OR IGNORE INTO project_blocks (id, project_id, block_type, content_json, sort_order) VALUES
  (
    'block-geologic-assemblies-hero',
    'project-geologic-assemblies',
    'hero',
    '{"imageUrl":"/works/geologic-assemblies/assets/00-02.webp","alt":"Geologic assembly opened around a natural stone","eyebrow":"Collectible Design","heading":"Hidden yet ready to bloom","subheading":"Geologic Assemblies / designing with digital stone"}',
    0
  ),
  (
    'block-geologic-assemblies-introduction',
    'project-geologic-assemblies',
    'text',
    '{"heading":"The stone determines every piece","body":"Geologic Assemblies begins with the irregularity of a selected natural stone. Digital modelling, mechanical prototyping, and translucent fabrication translate that unique geometry into an expanding body that can open, close, and reveal its internal structure.\n\nThe complete project is presented as an interactive publication inside Paul’s Experimental Lab."}',
    1
  );

INSERT OR IGNORE INTO assets (
  id,
  project_id,
  storage_provider,
  storage_key,
  url,
  alt_text,
  mime_type,
  metadata_json
) VALUES (
  'asset-geologic-assemblies-cover',
  'project-geologic-assemblies',
  'external',
  'works/geologic-assemblies/assets/00-02.webp',
  '/works/geologic-assemblies/assets/00-02.webp',
  'Geologic assembly opened around a natural stone',
  'image/webp',
  '{"source":"Geologic Assemblies interactive publication"}'
);
