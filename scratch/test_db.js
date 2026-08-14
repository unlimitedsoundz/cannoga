const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: schools, error: sErr } = await supabase.from('School').select('id, name, slug');
  const { data: depts, error: dErr } = await supabase.from('Department').select('id, name, slug');
  console.log('sErr:', sErr);
  console.log('dErr:', dErr);
  console.log('Schools count:', schools ? schools.length : 'null');
  console.log('Depts count:', depts ? depts.length : 'null');
  if (schools) console.log('Schools:', schools);
  if (depts) console.log('Depts:', depts.map(d => ({ slug: d.slug, id: d.id })));
}
run();
