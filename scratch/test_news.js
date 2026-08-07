require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testNews() {
    console.log('Querying News table...');
    const { data, error } = await supabase.from('News').select('slug');
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('News data length:', data?.length);
        console.log('News data:', data);
    }
}

testNews();
