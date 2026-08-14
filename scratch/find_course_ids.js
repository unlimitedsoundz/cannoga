const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const targetTitles = [
  'Business Foundations',
  'Human Resources Management',
  'Accounting Fundamentals',
  'Entrepreneurship',
  'Marketing Essentials',
  'Project Management',
  'Supply Chain Management',
  'Business Administration',
  'Accounting',
  'Marketing',
  'International Business',
  'Financial Services',
  'Supply Chain and Logistics Management'
];

async function run() {
  const { data, error } = await supabase
    .from('Course')
    .select('id, title, slug, degreeLevel')
    .in('degreeLevel', ['CERTICACATE', 'DIPLOMA']);
  if (error) {
    console.error(error);
  } else {
    const matched = data.filter(c => targetTitles.includes(c.title));
    console.log('Matched courses in DB:', JSON.stringify(matched, null, 2));
    console.log('Total matched:', matched.length);
  }
}
run();
