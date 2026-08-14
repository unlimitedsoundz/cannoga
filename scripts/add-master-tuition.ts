import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('🌱 Adding missing MASTER tuition rates...\n');

    // Get existing tuition rates to find all fields
    const { data: existingRates } = await supabase.from('tuition_rates').select('field');
    const existingFields = new Set((existingRates || []).map(r => r.field));
    console.log(`Existing fields: ${[...existingFields].sort().join(', ')}`);

    // Define all fields that should have MASTER rates
    const allFields = [
        'ARTS', 'ARTS_INTERNATIONAL',
        'BUSINESS', 'BUSINESS_INTERNATIONAL',
        'EDUCATION', 'EDUCATION_INTERNATIONAL',
        'HEALTH', 'HEALTH_INTERNATIONAL',
        'HOSPITALITY', 'HOSPITALITY_INTERNATIONAL',
        'SCIENCE', 'SCIENCE_INTERNATIONAL',
        'TECHNOLOGY', 'TECHNOLOGY_INTERNATIONAL',
        'TRANSPORTATION', 'TRANSPORTATION_INTERNATIONAL'
    ];

    // MASTER rates: domestic $3500/year, international $6000/year
    const masterRates = allFields.map(field => {
        const isInternational = field.includes('INTERNATIONAL');
        const annualFee = isInternational ? 6000 : 3500;
        return {
            degree_level: 'MASTER',
            field: field,
            annual_fee: annualFee,
            currency: 'CAD'
        };
    });

    // Filter out existing MASTER rates
    const newRates = masterRates.filter(rate => !existingFields.has(rate.field));
    console.log(`\nAdding ${newRates.length} new MASTER tuition rates...`);

    if (newRates.length === 0) {
        console.log('No new MASTER rates needed.');
        return;
    }

    const { data, error } = await supabase.from('tuition_rates').insert(newRates).select();
    
    if (error) {
        console.error('❌ Failed to insert MASTER rates:', error);
    } else {
        console.log(`✅ Inserted ${data?.length || 0} MASTER tuition rates`);
        (data || []).forEach(rate => {
            console.log(`  - MASTER ${rate.field}: $${rate.annual_fee}/year`);
        });
    }

    console.log('\n✅ MASTER tuition rates complete!');
    console.log('\nFinal tuition rate structure:');
    console.log('  Certificate: Domestic $1,500/year | International $2,500/year');
    console.log('  Diploma: Domestic $1,500/year | International $2,500/year');
    console.log('  Bachelor: Domestic $2,500/year | International $4,000/year');
    console.log('  Master: Domestic $3,500/year | International $6,000/year');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});