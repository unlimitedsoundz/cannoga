const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const schoolId = uuidv4();
  console.log('Attempting to insert school with ID:', schoolId);
  const { data, error } = await supabase.from('School').insert({
    id: schoolId,
    name: 'Test School of Health',
    slug: 'health-test-slug',
    description: 'A test description',
    imageUrl: '/images/school-health.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  console.log('Insert result data:', data);
  console.log('Insert result error:', error);
}
run();
