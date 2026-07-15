-- Remove the legacy seeded engagement values. New projects already default to 0.
UPDATE projects
SET
  likes_count = 0,
  shares_count = 0,
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now');
