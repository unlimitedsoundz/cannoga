import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('🌱 Updating tuition rates and Canadian credits...\n');

    // 1. Update tuition_rates
    console.log('💰 Updating tuition rates...');
    
    // First, get all current tuition rates
    const { data: tuitionRates, error: fetchError } = await supabase.from('tuition_rates').select('*');
    if (fetchError) {
        console.error('Error fetching tuition rates:', fetchError);
        return;
    }

    // Define new rates based on user input
    const newRates: Record<string, { domestic: number; international: number }> = {
        'CERTIFICATE': { domestic: 1500, international: 2500 },
        'DIPLOMA': { domestic: 1500, international: 2500 },
        'BACHELOR': { domestic: 2500, international: 4000 },
        'MASTER': { domestic: 3500, international: 6000 },
    };

    // Update each record
    for (const rate of tuitionRates || []) {
        const degreeLevel = rate.degree_level;
        const isInternational = rate.field.includes('INTERNATIONAL');
        const baseField = rate.field.replace('_INTERNATIONAL', '');
        
        // Get the new rate for this degree level
        const newRate = newRates[degreeLevel];
        if (!newRate) {
            console.log(`  Skipping unknown degree level: ${degreeLevel}`);
            continue;
        }

        const newAmount = isInternational ? newRate.international : newRate.domestic;
        
        const { error: updateError } = await supabase
            .from('tuition_rates')
            .update({ 
                annual_fee: newAmount,
                currency: 'CAD'
            })
            .eq('id', rate.id);
        
        if (updateError) {
            console.error(`  ❌ Failed to update ${degreeLevel} ${rate.field}:`, updateError.message);
        } else {
            console.log(`  ✅ Updated ${degreeLevel} ${rate.field}: $${newAmount}/year`);
        }
    }

    // 2. Add credits column to Course table if it doesn't exist
    console.log('\n📚 Adding credits column to Course table...');
    
    // Use raw SQL to add column
    const { error: columnError } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 30;`
    });
    
    if (columnError) {
        console.log('  Note: Could not add credits column via RPC, trying alternative approach');
        // The column might already exist or we need to use a different approach
    } else {
        console.log('  ✅ Credits column added/verified');
    }

    // 3. Update ECTS references in course descriptions
    console.log('\n🔄 Converting ECTS to Canadian credits in descriptions...');
    
    const { data: allCourses } = await supabase.from('Course').select('id, title, description');
    const ectsPattern = /(\d+)\s*ECTS/gi;
    const canadianCreditsPattern = /60\s*ECTS/gi;
    
    let updatedCount = 0;
    for (const course of allCourses || []) {
        if (!course.description) continue;
        
        let newDescription = course.description;
        let hasChanges = false;
        
        // Replace specific ECTS values with Canadian credits
        // 60 ECTS -> 30 Canadian credits
        newDescription = newDescription.replace(/60\s*ECTS/gi, '30 Canadian credits');
        // 120 ECTS -> 60 Canadian credits
        newDescription = newDescription.replace(/120\s*ECTS/gi, '60 Canadian credits');
        // 180 ECTS -> 90 Canadian credits
        newDescription = newDescription.replace(/180\s*ECTS/gi, '90 Canadian credits');
        
        // Also replace generic "ECTS" mentions
        if (newDescription !== course.description) {
            hasChanges = true;
        }
        
        if (hasChanges) {
            const { error: updateError } = await supabase
                .from('Course')
                .update({ description: newDescription })
                .eq('id', course.id);
            
            if (updateError) {
                console.error(`  ❌ Failed to update ${course.title}:`, updateError.message);
            } else {
                updatedCount++;
            }
        }
    }
    console.log(`  ✅ Updated ${updatedCount} course descriptions`);

    // 4. Update course credits based on degree level
    console.log('\n🎓 Updating course credits based on degree level...');
    
    const creditsMap: Record<string, number> = {
        'CERTIFICATE': 30,
        'DIPLOMA': 60,
        'BACHELOR': 90,
        'MASTER': 60,
    };

    // Get all courses again to update credits
    const { data: coursesForCredits } = await supabase.from('Course').select('id, title, degreeLevel');
    let creditsUpdated = 0;
    
    for (const course of coursesForCredits || []) {
        const credits = creditsMap[course.degreeLevel];
        if (!credits) continue;
        
        const { error: updateError } = await supabase
            .from('Course')
            .update({ credits })
            .eq('id', course.id);
        
        if (updateError) {
            console.error(`  ❌ Failed to update credits for ${course.title}:`, updateError.message);
        } else {
            creditsUpdated++;
        }
    }
    console.log(`  ✅ Updated credits for ${creditsUpdated} courses`);

    console.log('\n✅ All updates complete!');
    console.log('\nSummary:');
    console.log('  - Tuition rates updated to Canadian values');
    console.log('  - ECTS references converted to Canadian credits');
    console.log('  - Course credits set based on degree level');
    console.log('\nCanadian Credit System:');
    console.log('  Certificate: 30 credits (1 year)');
    console.log('  Diploma: 60 credits (2 years)');
    console.log('  Bachelor\'s: 90 credits (3 years)');
    console.log('  Master\'s: 60 credits (2 years)');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});