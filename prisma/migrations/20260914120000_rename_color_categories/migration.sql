-- Rename the "Cool White Colour" / "Warm White Colour" categories to their
-- new SEO-driven slugs and display names. No schema change: this only
-- updates the two existing Category rows (matched by their old slug, so
-- re-running this migration after it has applied once is a safe no-op).
UPDATE "Category" SET "slug" = 'led-cool-white-bulbs', "name" = 'Cool White LED Bulbs' WHERE "slug" = 'cool-white-color';
UPDATE "Category" SET "slug" = 'led-warm-white-bulbs', "name" = 'Warm White LED Bulbs' WHERE "slug" = 'warm-white-color';
