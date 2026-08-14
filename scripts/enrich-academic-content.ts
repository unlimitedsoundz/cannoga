
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    console.log('🌱 Starting academic content enrichment...');

    // 1. Fetch Courses to enrich
    const { data: courses } = await supabase
        .from('Course')
        .select('id, title, slug, degreeLevel')
        .in('slug', [
            'bba', 'mba', 'computer-science-bachelor', 'data-science-bachelor',
            'artificial-intelligence-bachelor', 'environmental-science-bachelor',
            'cybersecurity-bachelor', 'artificial-intelligence-msc', 'data-science-analytics-msc'
        ]);

    if (!courses) return;

    for (const course of courses) {
        console.log(`🔹 Enriching sections for: ${course.title}`);

        const sections = [
            {
                id: 'overview',
                title: 'Programme Overview',
                content: `
                    <p class="mb-4">The ${course.title} at Penkka University offers a rigorous and future-oriented curriculum designed to equip students with the technical skills and theoretical foundation needed to lead in the modern ${course.slug.includes('business') ? 'business' : 'technological'} landscape.</p>
                    <p>Our approach combines intensive classroom learning with hands-on laboratory work and industry-integrated projects, ensuring that graduates are prepared for high-impact careers in global markets.</p>
                `
            },
            {
                id: 'curriculum',
                title: 'Core Pillars of Study',
                content: `
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Foundational Excellence:</strong> Mastery of core concepts and specialized tools.</li>
                        <li><strong>Innovation-Driven Research:</strong> Engaging with the latest trends in ${course.slug.includes('ai') ? 'Artificial Intelligence' : 'modern development'}.</li>
                        <li><strong>Leadership & Ethics:</strong> Understanding the societal impact of ${course.slug.includes('data') ? 'data usage' : 'business decisions'}.</li>
                        <li><strong>Industry Integration:</strong> Real-world capstone projects and internships with partner firms.</li>
                    </ul>
                `
            },
            {
                id: 'outcomes',
                title: 'Career Outcomes',
                content: `
                    <p class="mb-4">Graduates of the ${course.title} are highly sought after by top-tier employers. Potential career paths include:</p>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">${course.slug.includes('ai') ? 'AI Engineer' : 'Lead Architect'}</div>
                        <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">${course.slug.includes('data') ? 'Data Scientist' : 'Strategic Consultant'}</div>
                        <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">${course.slug.includes('master') ? 'Senior Researcher' : 'Systems Analyst'}</div>
                        <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Innovation Lead</div>
                    </div>
                `
            }
        ];

        const { error: updateError } = await supabase
            .from('Course')
            .update({ sections })
            .eq('id', course.id);

        if (updateError) console.error(`   ❌ Failed: ${updateError.message}`);
    }

    // 2. Enrich Subjects with Areas
    console.log('🔹 Updating subject metadata (areas)...');

    const subjectUpdates = [
        { pattern: 'AI', area: 'Artificial Intelligence' },
        { pattern: 'DATA', area: 'Data Science' },
        { pattern: 'BUS', area: 'Business Administration' },
        { pattern: 'MGMT', area: 'Management' },
        { pattern: 'CS', area: 'Computer Science' },
        { pattern: 'ENV', area: 'Environmental Science' },
        { pattern: 'SEC', area: 'Cybersecurity' }
    ];

    for (const update of subjectUpdates) {
        const { error } = await supabase
            .from('Subject')
            .update({ area: update.area })
            .ilike('code', `%${update.pattern}%`);

        if (error) console.error(`   ❌ Failed update for ${update.area}:`, error.message);
    }

    console.log('✨ Enrichment complete!');
}

main();
