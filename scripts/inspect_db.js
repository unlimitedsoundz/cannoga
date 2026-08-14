const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing env vars');
  process.exit(1);
}
const supabase = createClient(url, key);

(async () => {
  const { data: schools, error: schoolErr } = await supabase.from('School').select('id,slug,name').order('slug');
  if (schoolErr) { console.error('School error:', schoolErr); process.exit(1); }
  console.log('SCHOOLS:', JSON.stringify(schools, null, 2));

  const { data: depts, error: deptErr } = await supabase.from('Department').select('id,slug,name,schoolId').order('slug');
  if (deptErr) { console.error('Department error:', deptErr); process.exit(1); }
  console.log('DEPARTMENTS:', JSON.stringify(depts, null, 2));

  const { data: enumData, error: enumErr } = await supabase.rpc('pg_enum_values', { type_name: 'DegreeLevel' });
  if (enumErr) {
    console.error('Enum error:', enumErr);
    process.exit(1);
  }
  console.log('DEGREE_LEVEL_ENUM:', JSON.stringify(enumData, null, 2));
})();
