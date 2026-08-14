const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase.from('Subject').select('*').limit(5);
  if (error) {
    console.error('Subject error:', error);
  } else {
    console.log('Subject data sample:', data);
  }

  const { data: courses, error: courseErr } = await supabase.from('Course').select('id, title, slug, degreeLevel').limit(10);
  if (courseErr) {
    console.error('Course error:', courseErr);
  } else {
    console.log('Courses count:', courses.length);
    console.log('Courses:', courses);
  }
}
run();
