const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mrqzlmkdhzwvbpljikjz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA'
);

async function checkImageUrls() {
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('id, slug, imageUrl, title');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const withImage = blogs.filter(b => b.imageUrl);
  console.log(`Total blogs: ${blogs.length}`);
  console.log(`Blogs with imageUrl: ${withImage.length}`);
  for (const blog of withImage) {
    console.log(`  ${blog.id} | ${blog.slug} | ${blog.imageUrl}`);
  }
}

checkImageUrls();
