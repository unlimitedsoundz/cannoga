-- Seed Cannoga College institutional settings (idempotent)
BEGIN;

-- Insert or update core institution settings
INSERT INTO "system_settings" ("key", "value", "description") VALUES
  ('institution_name', 'Cannoga College', 'Official institution display name'),
  ('institution_type', 'College', 'Type of institution'),
  ('street', '81 Montreal Rd', 'Street address'),
  ('city', 'Ottawa', 'City'),
  ('province', 'Ontario', 'Province/State'),
  ('postal_code', 'K1L 6E8', 'Postal / ZIP code'),
  ('country', 'Canada', 'Country'),
  ('country_code', 'CA', 'ISO country code'),
  ('currency', 'CAD', 'Default transactional currency'),
  ('timezone', 'America/Toronto', 'Default timezone'),
  ('institution_email_domain', '@cannogacollege.ca', 'Institutional email domain (configurable)'),
  ('institution_address_full', 'Cannoga College\n81 Montreal Rd\nOttawa, Ontario\nK1L 6E8\nCanada', 'Full formatted postal address'),
  ('institution_official_location', 'Ottawa, Ontario', 'Human-readable location'),
  ('seo_default_title', 'Cannoga College — Ottawa, Ontario', 'Default SEO title'),
  ('seo_default_description', 'Cannoga College is a career-focused college located in Ottawa, Ontario, Canada. Explore our programs, admissions, and support for international students.', 'Default SEO description')
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = CURRENT_TIMESTAMP;

COMMIT;

-- Note: This seed is idempotent and safe to run multiple times. It upserts only system settings and does not modify student, application, or payment records.
