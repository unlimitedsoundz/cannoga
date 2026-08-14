-- CMS Tables for Cannoga College Website

-- Site-wide settings
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'settings',
  site_name TEXT NOT NULL DEFAULT 'Cannoga College',
  site_url TEXT NOT NULL DEFAULT 'https://cannogacollege.ca',
  default_seo_title TEXT,
  default_seo_description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  country TEXT,
  postal_code TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Editable pages
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  og_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP(3),
  content JSONB, -- Structured content sections
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Homepage sections (controlled content)
CREATE TABLE IF NOT EXISTS homepage_sections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type TEXT NOT NULL CHECK (section_type IN ('hero', 'announcements', 'featured_schools', 'featured_programs', 'statistics', 'news_feed', 'cta')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  display_order INTEGER NOT NULL DEFAULT 0,
  title TEXT,
  description TEXT,
  button_text TEXT,
  button_url TEXT,
  image_url TEXT,
  image_alt TEXT,
  items JSONB,
  related_ids JSONB,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Page content sections (editable content per page)
CREATE TABLE IF NOT EXISTS page_content (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL REFERENCES pages(slug) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_slug, section_key)
);

-- FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Contact form submissions (for admin review)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  institution TEXT,
  program_of_interest TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed')),
  admin_notes TEXT,
  responded_at TIMESTAMP(3),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tuition Information
CREATE TABLE IF NOT EXISTS tuition_info (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_type TEXT NOT NULL CHECK (credential_type IN ('CERTIFICATE', 'DIPLOMA', 'BACHELOR', 'MASTER')),
  domestic_tuition JSONB, -- { "domesticTuition": "value", "domesticPerCredit": "value", "terms": "payment_terms" }
  international_tuition JSONB, -- { "annualTuition": "value", "perCredit": "value", "terms": "payment_terms" }
  application_fee NUMERIC(10, 2),
  additional_fees JSONB,
  effective_from TIMESTAMP(3),
  effective_to TIMESTAMP(3),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- General Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  publish_start TIMESTAMP(3),
  publish_end TIMESTAMP(3),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for CMS tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tuition_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policies - Public read for published content
DROP POLICY IF EXISTS "Public read published pages" ON "pages";
CREATE POLICY "Public read published pages" ON "pages" FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read published homepage sections" ON "homepage_sections";
CREATE POLICY "Public read published homepage sections" ON "homepage_sections" FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read published FAQs" ON "faqs";
CREATE POLICY "Public read published FAQs" ON "faqs" FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read active tuition info" ON "tuition_info";
CREATE POLICY "Public read active tuition info" ON "tuition_info" FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Public read published announcements" ON "announcements";
CREATE POLICY "Public read published announcements" ON "announcements" FOR SELECT USING (status = 'published' AND (publish_start IS NULL OR publish_start <= NOW()) AND (publish_end IS NULL OR publish_end >= NOW()));

-- Admin policies (full access)
DROP POLICY IF EXISTS "Admin full access to site_settings" ON "site_settings";
CREATE POLICY "Admin full access to site_settings" ON "site_settings" TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'))
);

DROP POLICY IF EXISTS "Admin full access to pages" ON "pages";
CREATE POLICY "Admin full access to pages" ON "pages" TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'))
);

DROP POLICY IF EXISTS "Admin full access to homepage_sections" ON "homepage_sections";
CREATE POLICY "Admin full access to homepage_sections" ON "homepage_sections" TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'))
);

DROP POLICY IF EXISTS "Admin full access to faqs" ON "faqs";
CREATE POLICY "Admin full access to faqs" ON "faqs" TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'))
);

DROP POLICY IF EXISTS "Admin full access to tuition_info" ON "tuition_info";
CREATE POLICY "Admin full access to tuition_info" ON "tuition_info" TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'))
);

DROP POLICY IF EXISTS "Admin full access to announcements" ON "announcements";
CREATE POLICY "Admin full access to announcements" ON "announcements" TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'))
);