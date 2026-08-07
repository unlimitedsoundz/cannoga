const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mrqzlmkdhzwvbpljikjz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA'
);

async function updateBlogs() {
  const { data: blogs, error: fetchError } = await supabase
    .from('blogs')
    .select('*')
    .limit(1);

  if (fetchError) {
    console.error('Error fetching blogs:', fetchError);
    process.exit(1);
  }

  if (!blogs || blogs.length === 0) {
    console.log('No blogs found');
    process.exit(0);
  }

  console.log('Blog columns:', Object.keys(blogs[0]));
}

updateBlogs();
