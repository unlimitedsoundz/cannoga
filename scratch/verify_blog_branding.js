const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mrqzlmkdhzwvbpljikjz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA'
);

async function verifyBlogs() {
  const { data: blogs, error: fetchError } = await supabase
    .from('blogs')
    .select('id, title, excerpt, content, meta_description');

  if (fetchError) {
    console.error('Error fetching blogs:', fetchError);
    process.exit(1);
  }

  let remainingIssues = 0;
  for (const blog of blogs) {
    const fields = ['title', 'excerpt', 'content', 'meta_description'];
    for (const field of fields) {
      if (blog[field] && typeof blog[field] === 'string') {
        if (blog[field].includes('Cannoga College') || /ottawa.?canada/gi.test(blog[field])) {
          console.log(`Blog ${blog.id} field ${field} still has old branding:`, blog[field].substring(0, 200));
          remainingIssues++;
        }
      }
    }
  }

  if (remainingIssues === 0) {
    console.log('All blogs verified: no old branding found.');
  } else {
    console.log(`Found ${remainingIssues} fields with remaining old branding.`);
  }
}

verifyBlogs();
