
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    console.log('--- REMAPPING COURSES TO DEPARTMENTS ---');

    // Trying both slugs just in case
    let schoolId = '';
    const { data: s1 } = await supabase.from('School').select('id').eq('slug', 'business').single();
    if (s1) schoolId = s1.id;
    else {
        const { data: s2 } = await supabase.from('School').select('id').eq('slug', 'school-of-business').single();
        if (s2) schoolId = s2.id;
    }

    if (!schoolId) {
        console.error('School not found with slug "business" or "school-of-business"');
        return;
    }

    console.log('Using School ID:', schoolId);

    const { data: depts } = await supabase.from('Department').select('id, slug').eq('schoolId', schoolId);
    if (!depts) return;

    const deptMap = Object.fromEntries(depts.map(d => [d.slug, d.id]));

    // Mapping rules based on course slug patterns
    const mappings = [
        { pattern: 'finance', targetSlug: 'finance' },
        { pattern: 'marketing', targetSlug: 'marketing' },
        { pattern: 'economics', targetSlug: 'economics' },
        { pattern: 'management', targetSlug: 'management' },
        { pattern: 'accounting', targetSlug: 'accounting-business-law' },
        { pattern: 'info-service', targetSlug: 'info-service' },
        { pattern: 'analytics', targetSlug: 'info-service' },
    ];

    for (const mapping of mappings) {
        const targetId = deptMap[mapping.targetSlug];
        if (!targetId) {
            console.warn(`Target department ${mapping.targetSlug} not found`);
            continue;
        }

        console.log(`Remapping courses matching "${mapping.pattern}" to department "${mapping.targetSlug}" (${targetId})`);

        const { data: updated, error } = await supabase
            .from('Course')
            .update({ departmentId: targetId })
            .ilike('slug', `%${mapping.pattern}%`)
            .eq('schoolId', schoolId)
            .select('title, slug');

        if (error) {
            console.error(`Error updating courses for ${mapping.pattern}:`, error.message);
        } else {
            console.log(`✅ Updated ${updated?.length || 0} courses:`, updated?.map(c => c.slug).join(', '));
        }
    }

    console.log('--- REMAPPING COMPLETE ---');
}

main();
