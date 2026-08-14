const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
const pgClient = new Client({ connectionString });

const sourceUrl = 'https://mrqzlmkdhzwvbpljikjz.supabase.co';
const sourceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTI5ODMsImV4cCI6MjA4NTA4ODk4M30.ILwXM7fhNnip6Mq5HF04poDCzdhcNO69AVnYmheSmeY';
const sourceClient = createClient(sourceUrl, sourceKey);

(async () => {
  try {
    console.log('Connecting to main Supabase PG...');
    await pgClient.connect();
    console.log('Connected!');

    // Create table blogs
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        "imageUrl" TEXT,
        "publishDate" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        published BOOLEAN NOT NULL DEFAULT false,
        meta_title TEXT,
        meta_description TEXT,
        og_image TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
    `);
    console.log('Created blogs table in main Supabase and disabled RLS.');

    // Fetch blogs from source
    const { data: blogs, error: fetchErr } = await sourceClient.from('blogs').select('*');
    if (fetchErr) {
      console.error('Fetch error:', fetchErr);
      await pgClient.end();
      return;
    }
    console.log('Fetched', blogs.length, 'blogs from source DB.');

    let count = 0;
    for (const b of blogs) {
      await pgClient.query(`
        INSERT INTO blogs (id, title, slug, content, excerpt, "imageUrl", "publishDate", published, meta_title, meta_description, og_image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          content = EXCLUDED.content,
          excerpt = EXCLUDED.excerpt,
          "imageUrl" = EXCLUDED."imageUrl",
          "publishDate" = EXCLUDED."publishDate",
          published = EXCLUDED.published,
          meta_title = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description,
          og_image = EXCLUDED.og_image;
      `, [
        b.id,
        b.title,
        b.slug,
        b.content,
        b.excerpt,
        b.imageUrl,
        b.publishDate || new Date(),
        b.published ?? true,
        b.meta_title || null,
        b.meta_description || null,
        b.og_image || null
      ]);
      count++;
    }

    console.log('SUCCESS! Seeded', count, 'blog posts into main Supabase DB (lbkrzyqpdqgtqbodkcyi)!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pgClient.end();
  }
})();
