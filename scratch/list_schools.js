const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: schools } = await supabase.from('School').select('*');
  const { data: depts } = await supabase.from('Department').select('*');
  fs.writeFileSync(path.join(__dirname, 'schools_depts.json'), JSON.stringify({ schools, depts }, null, 2));
  console.log('Saved! Schools:', schools.length, 'Depts:', depts.length);
}
run();
