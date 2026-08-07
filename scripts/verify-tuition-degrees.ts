import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Checking tuition rates by degree level...\n');

    const { data: tuitionRates } = await supabase.from('tuition_rates').select('degree_level, field, annual_fee').order('degree_level, field');
    
    const byDegree: Record<string, any[]> = {};
    for (const rate of tuitionRates || []) {
        if (!byDegree[rate.degree_level]) {
            byDegree[rate.degree_level] = [];
        }
        byDegree[rate.degree_level].push(rate);
    }

    for (const [degree, rates] of Object.entries(byDegree)) {
        console.log(`\n${degree}:`);
        rates.forEach(r => {
            console.log(`  ${r.field}: $${r.annual_fee}/year`);
        });
    }

    console.log(`\nTotal records: ${tuitionRates?.length || 0}`);
    console.log(`Degree levels: ${Object.keys(byDegree).join(', ')}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});