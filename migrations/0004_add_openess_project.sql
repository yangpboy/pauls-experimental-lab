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
  'project-openess',
  'openess',
  'Openess',
  'A non-conventional student dormitory shaped by organic curves to support creativity, community, and everyday life.',
  '/works/openess/cover.jpg',
  'Spatial Design',
  '11.2023~12.2023',
  'Taiwan',
  'Po-Yu Yang and Yu-Yang Huang',
  '["Rhino","Lumion"]',
  'published',
  5,
  0,
  0,
  '2023-12-01T00:00:00.000Z'
);

INSERT OR IGNORE INTO project_blocks (id, project_id, block_type, content_json, sort_order) VALUES
  (
    'block-openess-hero',
    'project-openess',
    'hero',
    '{"imageUrl":"/works/openess/cover.jpg","alt":"Openess dormitory exterior","eyebrow":"Spatial Design","heading":"Openess","subheading":"Open area inspires open-mindedness."}',
    0
  ),
  (
    'block-openess-introduction',
    'project-openess',
    'text',
    '{"heading":"A dormitory for open minds","body":"We set out to create a non-conventional dormitory where students can think freely, create, read, and enjoy everyday life together.\n\nOrganic, undulating forms define functional zones without making the building feel rigid. Curved walls, lighting, and flooring create an open atmosphere that encourages self-expression, collaboration, and community."}',
    1
  ),
  (
    'block-openess-concept',
    'project-openess',
    'gallery',
    '{"columns":2,"gap":"none","images":[{"url":"/works/openess/statement.jpg","alt":"Openess project statement"},{"url":"/works/openess/concept.jpg","alt":"Organic spatial concept and programme diagram"}]}',
    2
  ),
  (
    'block-openess-exterior',
    'project-openess',
    'image',
    '{"url":"/works/openess/exterior.jpg","alt":"Openess dormitory exterior perspective","caption":"The curved façade makes the shared life of the dormitory visible from the street."}',
    3
  ),
  (
    'block-openess-planning-copy',
    'project-openess',
    'text',
    '{"heading":"Three levels, one shared life","body":"The first floor combines twin rooms, an accessible room, and a reading lobby. Quadruple rooms and informal rest areas occupy the second floor. The third floor becomes the communal heart of the building, bringing together a kitchen, creative area, lounge, and balcony."}',
    4
  ),
  (
    'block-openess-floor-plans',
    'project-openess',
    'gallery',
    '{"columns":3,"gap":"standard","images":[{"url":"/works/openess/plan-01.jpg","alt":"Openess first floor plan","caption":"01 / Twin rooms, reading lobby, and accessible room"},{"url":"/works/openess/plan-02.jpg","alt":"Openess second floor plan","caption":"02 / Quadruple rooms and shared rest areas"},{"url":"/works/openess/plan-03.jpg","alt":"Openess third floor plan","caption":"03 / Kitchen, creative area, lounge, and balcony"}]}',
    5
  ),
  (
    'block-openess-materials',
    'project-openess',
    'image',
    '{"url":"/works/openess/materials.jpg","alt":"Openess material palette of concrete, wood, and steel","caption":"A restrained palette of raw concrete, wood, and steel frames balances durability with warmth."}',
    6
  ),
  (
    'block-openess-spatial-system',
    'project-openess',
    'gallery',
    '{"columns":2,"gap":"standard","images":[{"url":"/works/openess/section.jpg","alt":"Openess overall building section"},{"url":"/works/openess/axon-01.jpg","alt":"Openess first floor axonometric"},{"url":"/works/openess/axon-02.jpg","alt":"Openess second floor axonometric"},{"url":"/works/openess/axon-03.jpg","alt":"Openess third floor axonometric"}]}',
    7
  ),
  (
    'block-openess-interiors-copy',
    'project-openess',
    'text',
    '{"heading":"Curves as spatial cues","body":"Instead of conventional partitions, continuous curves guide movement and shape moments for reading, resting, gathering, and privacy. Their changing heights and radii give each zone a distinct character while preserving visual continuity across the building."}',
    8
  ),
  (
    'block-openess-interiors',
    'project-openess',
    'gallery',
    '{"columns":3,"gap":"standard","images":[{"url":"/works/openess/lobby-accessible-room.jpg","alt":"First floor lobby and accessible room details"},{"url":"/works/openess/dorm-room.jpg","alt":"Second floor dormitory room interior"},{"url":"/works/openess/reading-area.jpg","alt":"Second floor reading and social area"}]}',
    9
  ),
  (
    'block-openess-community',
    'project-openess',
    'gallery',
    '{"columns":2,"gap":"none","images":[{"url":"/works/openess/community-section.jpg","alt":"Third floor communal zone section"},{"url":"/works/openess/community-cutaway.jpg","alt":"Third floor communal zone cutaway"},{"url":"/works/openess/lounge.jpg","alt":"Third floor lounge interior"},{"url":"/works/openess/kitchen-balcony.jpg","alt":"Third floor kitchen and balcony"}]}',
    10
  ),
  (
    'block-openess-closing',
    'project-openess',
    'image',
    '{"url":"/works/openess/final-exterior.jpg","alt":"Openess final exterior and section view"}',
    11
  ),
  (
    'block-openess-quote',
    'project-openess',
    'quote',
    '{"quote":"Open area inspires open-mindedness.","attribution":"Openess"}',
    12
  );

INSERT OR IGNORE INTO assets (
  id,
  project_id,
  storage_provider,
  storage_key,
  url,
  alt_text,
  mime_type,
  width,
  height,
  metadata_json
) VALUES
  ('asset-openess-cover', 'project-openess', 'external', 'works/openess/cover.jpg', '/works/openess/cover.jpg', 'Openess dormitory exterior', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":1}'),
  ('asset-openess-statement', 'project-openess', 'external', 'works/openess/statement.jpg', '/works/openess/statement.jpg', 'Openess project statement', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":2}'),
  ('asset-openess-concept', 'project-openess', 'external', 'works/openess/concept.jpg', '/works/openess/concept.jpg', 'Organic spatial concept', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":3}'),
  ('asset-openess-exterior', 'project-openess', 'external', 'works/openess/exterior.jpg', '/works/openess/exterior.jpg', 'Dormitory exterior perspective', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":4}'),
  ('asset-openess-plan-01', 'project-openess', 'external', 'works/openess/plan-01.jpg', '/works/openess/plan-01.jpg', 'First floor plan', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":5}'),
  ('asset-openess-plan-02', 'project-openess', 'external', 'works/openess/plan-02.jpg', '/works/openess/plan-02.jpg', 'Second floor plan', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":6}'),
  ('asset-openess-plan-03', 'project-openess', 'external', 'works/openess/plan-03.jpg', '/works/openess/plan-03.jpg', 'Third floor plan', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":7}'),
  ('asset-openess-materials', 'project-openess', 'external', 'works/openess/materials.jpg', '/works/openess/materials.jpg', 'Material palette', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":8}'),
  ('asset-openess-section', 'project-openess', 'external', 'works/openess/section.jpg', '/works/openess/section.jpg', 'Overall building section', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":9}'),
  ('asset-openess-axon-01', 'project-openess', 'external', 'works/openess/axon-01.jpg', '/works/openess/axon-01.jpg', 'First floor axonometric', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":10}'),
  ('asset-openess-lobby', 'project-openess', 'external', 'works/openess/lobby-accessible-room.jpg', '/works/openess/lobby-accessible-room.jpg', 'First floor lobby and accessible room details', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":11}'),
  ('asset-openess-axon-02', 'project-openess', 'external', 'works/openess/axon-02.jpg', '/works/openess/axon-02.jpg', 'Second floor axonometric', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":12}'),
  ('asset-openess-dorm-room', 'project-openess', 'external', 'works/openess/dorm-room.jpg', '/works/openess/dorm-room.jpg', 'Dormitory room interior', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":14}'),
  ('asset-openess-reading-area', 'project-openess', 'external', 'works/openess/reading-area.jpg', '/works/openess/reading-area.jpg', 'Reading and social area', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":15}'),
  ('asset-openess-axon-03', 'project-openess', 'external', 'works/openess/axon-03.jpg', '/works/openess/axon-03.jpg', 'Third floor axonometric', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":16}'),
  ('asset-openess-community-section', 'project-openess', 'external', 'works/openess/community-section.jpg', '/works/openess/community-section.jpg', 'Third floor communal zone section', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":17}'),
  ('asset-openess-community-cutaway', 'project-openess', 'external', 'works/openess/community-cutaway.jpg', '/works/openess/community-cutaway.jpg', 'Third floor communal zone cutaway', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":18}'),
  ('asset-openess-lounge', 'project-openess', 'external', 'works/openess/lounge.jpg', '/works/openess/lounge.jpg', 'Third floor lounge interior', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":19}'),
  ('asset-openess-kitchen', 'project-openess', 'external', 'works/openess/kitchen-balcony.jpg', '/works/openess/kitchen-balcony.jpg', 'Third floor kitchen and balcony', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":20}'),
  ('asset-openess-final', 'project-openess', 'external', 'works/openess/final-exterior.jpg', '/works/openess/final-exterior.jpg', 'Final exterior and section view', 'image/jpeg', 1440, 810, '{"source":"dormitory.pdf","page":21}');
