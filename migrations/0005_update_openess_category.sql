UPDATE projects
SET
  category = 'Spatial Design',
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE slug = 'openess';

UPDATE project_blocks
SET
  content_json = json_set(content_json, '$.eyebrow', 'Spatial Design'),
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE project_id = 'project-openess'
  AND block_type = 'hero';
