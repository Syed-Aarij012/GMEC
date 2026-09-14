-- Reorder the Cool White / Warm White LED Bulb category slugs so the URL
-- word order matches the on-page H1 ("Cool White LED Bulbs" /
-- "Warm White LED Bulbs") instead of leading with "led-". Matched by the old
-- slug, so re-running this migration after it has applied once is a no-op.
UPDATE "Category" SET "slug" = 'cool-white-led-bulbs' WHERE "slug" = 'led-cool-white-bulbs';
UPDATE "Category" SET "slug" = 'warm-white-led-bulbs' WHERE "slug" = 'led-warm-white-bulbs';
