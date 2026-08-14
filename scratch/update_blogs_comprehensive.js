const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mrqzlmkdhzwvbpljikjz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA'
);

async function updateAllBlogs() {
  const { data: blogs, error: fetchError } = await supabase
    .from('blogs')
    .select('*');

  if (fetchError) {
    console.error('Error fetching blogs:', fetchError);
    process.exit(1);
  }

  console.log(`Found ${blogs.length} blogs`);

  let updatedCount = 0;
  for (const blog of blogs) {
    const updates = {};
    let needsUpdate = false;

    const fields = ['title', 'slug', 'excerpt', 'content', 'meta_description', 'imageUrl'];
    for (const field of fields) {
      if (blog[field] && typeof blog[field] === 'string') {
        let newValue = blog[field];
        newValue = newValue.replace(/Cannoga College/g, 'Cannoga College');
        newValue = newValue.replace(/Cannoga/gi, 'Cannoga');
        newValue = newValue.replace(/ottawa[,\s]*canada/gi, 'Ottawa, Ontario, Canada');
        newValue = newValue.replace(/penkka/gi, 'Cannoga');
        if (newValue !== blog[field]) {
          updates[field] = newValue;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('blogs')
        .update(updates)
        .eq('id', blog.id);

      if (updateError) {
        console.error(`Error updating blog ${blog.id}:`, updateError);
      } else {
        console.log(`Updated blog ${blog.id}: ${Object.keys(updates).join(', ')}`);
        updatedCount++;
      }
    }
  }

  console.log(`Update complete. ${updatedCount} blogs updated.`);
}

updateAllBlogs();
