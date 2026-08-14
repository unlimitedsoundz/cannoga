
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

async function test() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('Testing Supabase connection with:');
    console.log('URL:', url);
    console.log('Key:', key?.substring(0, 10) + '...');

    if (!url || !key) {
        console.error('Missing environment variables!');
        return;
    }

    const supabase = createClient(url, key);

    console.log('\n--- Testing News Table ---');
    const { data: news, error: newsError } = await supabase.from('News').select('*').limit(1);
    if (newsError) {
        console.error('News Error:', newsError);
    } else {
        console.log('News Data (first item):', news);
    }

    console.log('\n--- Testing Event Table ---');
    const { data: events, error: eventsError } = await supabase.from('Event').select('*').limit(1);
    if (eventsError) {
        console.error('Event Error:', eventsError);
    } else {
        console.log('Event Data (first item):', events);
    }

    console.log('\n--- Testing School Table (to verify general connectivity) ---');
    const { data: schools, error: schoolsError } = await supabase.from('School').select('*').limit(1);
    if (schoolsError) {
        console.error('School Error:', schoolsError);
    } else {
        console.log('School Data (first item):', schools);
    }
}

test();
