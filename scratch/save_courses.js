const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase.from('Course').select('id, title, slug, degreeLevel, duration');
  if (error) {
    console.error(error);
  } else {
    fs.writeFileSync(path.join(__dirname, 'all_courses.json'), JSON.stringify(data, null, 2));
    console.log('Total courses:', data.length);
  }
}
run();
