import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('🌱 Updating tuition rates to match Canadian pricing...\n');

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

    const { data: existingRates } = await supabase.from('tuition_rates').select('*');
    const existingMap = new Map((existingRates || []).map(r => [r.degree_level + '-' + r.field, r]));

    const newRates: any[] = [];

    const rateConfig: Record<string, { domestic: number; international: number }> = {
        'CERTIFICATE': { domestic: 1500, international: 2500 },
        'DIPLOMA': { domestic: 1500, international: 2500 },
        'BACHELOR': { domestic: 2500, international: 4000 },
        'MASTER': { domestic: 3500, international: 6000 },
    };

    for (const [degreeLevel, rates] of Object.entries(rateConfig)) {
        for (const field of allFields) {
            const key = degreeLevel + '-' + field;
            const isInternational = field.includes('INTERNATIONAL');
            const annualFee = isInternational ? rates.international : rates.domestic;

            if (existingMap.has(key)) {
                const existing = existingMap.get(key)!;
                if (existing.annual_fee !== annualFee) {
                    newRates.push({
                        id: existing.id,
                        degree_level: degreeLevel,
                        field: field,
                        annual_fee: annualFee,
                        currency: 'CAD'
                    });
                }
            } else {
                newRates.push({
                    degree_level: degreeLevel,
                    field: field,
                    annual_fee: annualFee,
                    currency: 'CAD'
                });
            }
        }
    }

    if (newRates.length === 0) {
        console.log('✅ All tuition rates are already up to date.');
        return;
    }

    console.log(`Updating/inserting ${newRates.length} tuition rates...\n`);

    const updates = newRates.filter(r => r.id);
    const inserts = newRates.filter(r => !r.id);

    for (const rate of updates) {
        const { error } = await supabase
            .from('tuition_rates')
            .update({ annual_fee: rate.annual_fee, currency: rate.currency })
            .eq('id', rate.id);
        
        if (error) {
            console.error('❌ Failed to update ' + rate.degree_level + ' ' + rate.field + ':', error.message);
        } else {
            console.log('  ✅ Updated ' + rate.degree_level + ' ' + rate.field + ': $' + rate.annual_fee + '/year');
        }
    }

    if (inserts.length > 0) {
        const { data, error } = await supabase.from('tuition_rates').insert(inserts).select();
        if (error) {
            console.error('❌ Failed to insert new rates:', error);
        } else {
            console.log('\n  ✅ Inserted ' + (data?.length || 0) + ' new tuition rates:');
            (data || []).forEach(rate => {
                console.log('    ' + rate.degree_level + ' ' + rate.field + ': $' + rate.annual_fee + '/year');
            });
        }
    }

    console.log('\n✅ Tuition rates updated!');
    console.log('\nFinal structure:');
    console.log('  Certificate: Domestic $1,500/year | International $2,500/year');
    console.log('  Diploma: Domestic $1,500/year | International $2,500/year');
    console.log('  Bachelor: Domestic $2,500/year | International $4,000/year');
    console.log('  Master: Domestic $3,500/year | International $6,000/year');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});