const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: schools, error: err1 } = await supabase.from('School').select('*');
  const { data: depts, error: err2 } = await supabase.from('Department').select('*');
  
  if (err1 || err2) {
    console.error(err1 || err2);
  } else {
    console.log('--- Schools ---');
    console.log(JSON.stringify(schools, null, 2));
    console.log('--- Departments ---');
    console.log(JSON.stringify(depts, null, 2));
  }
}
run();
