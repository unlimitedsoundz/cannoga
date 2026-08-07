const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mrqzlmkdhzwvbpljikjz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA'
);

async function inspectBlogs() {
  const { data: blogs, error: fetchError } = await supabase
    .from('blogs')
    .select('*');

  if (fetchError) {
    console.error('Error fetching blogs:', fetchError);
    process.exit(1);
  }

  const issues = [];
  for (const blog of blogs) {
    const fields = Object.keys(blog).filter(k => typeof blog[k] === 'string');
    for (const field of fields) {
      const val = blog[field];
      if (/cannoga/i.test(val) || /ottawa/i.test(val) || /penkka/i.test(val)) {
        issues.push({ id: blog.id, field, value: val });
      }
    }
  }

  if (issues.length === 0) {
    console.log('No old branding found in any blog fields.');
  } else {
    console.log(`Found ${issues.length} issues:`);
    for (const issue of issues) {
      console.log(`Blog ${issue.id} | ${issue.field}: ${issue.value.substring(0, 300)}`);
    }
  }
}

inspectBlogs();
