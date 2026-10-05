UPDATE projects
SET
  project_date = '09.2023~05.2025',
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE slug = '2025-industrial-design-portfolio';
