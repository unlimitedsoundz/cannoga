const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('Course')
    .select('id, title, slug, degreeLevel, schoolSlug:School(slug)')
    .in('degreeLevel', ['CERTICACATE', 'DIPLOMA']);

  if (error) {
    console.error(error);
  } else {
    const list = data.map(c => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      degreeLevel: c.degreeLevel,
      schoolSlug: c.schoolSlug ? c.schoolSlug.slug : 'unknown'
    }));
    console.log(JSON.stringify(list, null, 2));
  }
}
run();
