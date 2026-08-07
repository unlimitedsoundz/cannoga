
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import * as fs from 'fs';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    console.log('--- DEEP SEARCH: CANANCE ---');

    // 1. All departments with slug 'finance'
    const { data: depts } = await supabase
        .from('Department')
        .select('*, school:School(name, slug)')
        .eq('slug', 'finance');

    console.log('All Finance Departments:', JSON.stringify(depts, null, 2));

    // 2. All courses containing 'finance'
    const { data: courses } = await supabase
        .from('Course')
        .select('*, department:Department(name, slug), school:School(name, slug)')
        .ilike('title', '%finance%');

    const results = {
        depts,
        courses
    };

    fs.writeFileSync('deep_diag.json', JSON.stringify(results, null, 2));
    console.log('Results saved to deep_diag.json');
}

main();
