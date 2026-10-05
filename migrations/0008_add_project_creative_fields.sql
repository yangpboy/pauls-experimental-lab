ALTER TABLE projects
ADD COLUMN creative_fields_json TEXT NOT NULL DEFAULT '[]'
CHECK (json_valid(creative_fields_json));

WITH RECURSIVE split(project_id, rest, creative_field) AS (
  SELECT id, category || ',', ''
  FROM projects

  UNION ALL

  SELECT
    project_id,
    substr(rest, instr(rest, ',') + 1),
    trim(substr(rest, 1, instr(rest, ',') - 1))
  FROM split
  WHERE rest <> ''
), grouped AS (
  SELECT project_id, json_group_array(creative_field) AS creative_fields_json
  FROM split
  WHERE creative_field <> ''
  GROUP BY project_id
)
UPDATE projects
SET creative_fields_json = COALESCE(
  (SELECT grouped.creative_fields_json FROM grouped WHERE grouped.project_id = projects.id),
  json_array('Uncategorized')
);

UPDATE projects
SET category = json_extract(creative_fields_json, '$[0]')
WHERE json_array_length(creative_fields_json) > 0;
