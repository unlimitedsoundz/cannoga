-- Enable RLS on storage.objects if not already enabled
-- Provide full public read & authenticated/anon upload policies for blog-images, events, and content buckets

INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('blog-images', 'blog-images', true),
    ('content', 'content', true),
    ('event-images', 'event-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop prior overlapping policies if they exist
DROP POLICY IF EXISTS "Public Access blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access content" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to content" ON storage.objects;
DROP POLICY IF EXISTS "Public Access event-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to event-images" ON storage.objects;

-- 1. Public Read Policies
CREATE POLICY "Public Access blog-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Public Access content"
ON storage.objects FOR SELECT
USING (bucket_id = 'content');

CREATE POLICY "Public Access event-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

-- 2. Allow authenticated and anon insert policies (ensures editors can upload without RLS failures)
CREATE POLICY "Allow uploads to blog-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Allow update to blog-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images');

CREATE POLICY "Allow uploads to content"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'content');

CREATE POLICY "Allow uploads to event-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-images');
