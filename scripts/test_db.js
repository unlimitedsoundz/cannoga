const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mrqzlmkdhzwvbpljikjz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testQuery() {
  const { data: pageContent, error: pcErr } = await supabase.from('page_content').select('*').limit(5);
  console.log('page_content:', pcErr || pageContent?.length);

  const { data: courseData, error: cErr } = await supabase.from('Course').select('id, title').limit(5);
  console.log('Course:', cErr || courseData?.length);
}

testQuery();
