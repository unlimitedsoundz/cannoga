const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'd:/cannogauniversity/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function sanitizeSlug(slug) {
  if (!slug) return '';
  return slug
    .toLowerCase()
    .trim()
    .replace(/[,._\s/]+/g, '-')     // replace commas, dots, spaces, slashes with hyphens
    .replace(/[^a-z0-9-]/g, '')     // remove non-alphanumeric chars except hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');       // trim hyphens from start/end
}

async function cleanSlugs() {
  const { data: posts, error } = await supabase.from('blogs').select('id, title, slug');
  if (error) {
    console.error('Error fetching blogs:', error);
    return;
  }

  console.log(`Found ${posts.length} posts. Normalizing slugs...`);

  for (const post of posts) {
    const clean = sanitizeSlug(post.slug);
    if (clean !== post.slug) {
      console.log(`Updating "${post.slug}" -> "${clean}" for post "${post.title}"`);
      const { error: updateError } = await supabase
        .from('blogs')
        .update({ slug: clean, updatedAt: new Date().toISOString() })
        .eq('id', post.id);
      
      if (updateError) {
        console.error(`Failed to update post ${post.id}:`, updateError);
      }
    }
  }

  console.log('Finished updating slugs in database!');
}

cleanSlugs();
