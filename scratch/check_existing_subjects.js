const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: courses, error: err0 } = await supabase
    .from('Course')
    .select('id, title, degreeLevel')
    .in('degreeLevel', ['CERTICACATE', 'DIPLOMA'])
    .limit(5);

  if (err0) {
    console.error(err0);
    return;
  }

  const ids = courses.map(c => c.id);
  const { data: subjects, error: err1 } = await supabase
    .from('Subject')
    .select('*')
    .in('courseId', ids);

  if (err1) {
    console.error(err1);
  } else {
    console.log('Subjects for Certificate/Diploma courses:', subjects.slice(0, 10));
    console.log('Total subjects found:', subjects.length);
  }
}
run();
