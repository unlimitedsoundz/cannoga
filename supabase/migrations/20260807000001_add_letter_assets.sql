-- Add letter logo and signature URLs to system_settings
INSERT INTO "system_settings" ("key", "value", "description")
VALUES 
  ('letter_logo_url', 'https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/logo-cannoga.png', 'URL for the Cannoga College logo used in Letter of Acceptance PDFs'),
  ('letter_signature_url', 'https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/registrar-signature.png', 'URL for the Registrar signature image used in Letter of Acceptance PDFs')
ON CONFLICT ("key") DO UPDATE SET value = EXCLUDED.value, "updatedAt" = CURRENT_TIMESTAMP;
