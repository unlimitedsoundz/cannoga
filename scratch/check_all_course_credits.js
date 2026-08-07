const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: courses, error } = await supabase
    .from('Course')
    .select('id, title, slug, degreeLevel, credits');

  if (error) {
    console.error(error);
  } else {
    console.log('Sample course credits:');
    console.log(courses.slice(0, 30));
    const nullCredits = courses.filter(c => c.credits === null);
    console.log(`Total courses: ${courses.length}`);
    console.log(`Courses with null credits: ${nullCredits.length}`);
    console.log('Null credits courses sample:', nullCredits.map(c => ({ title: c.title, slug: c.slug, degreeLevel: c.degreeLevel })).slice(0, 20));
  }
}
run();
