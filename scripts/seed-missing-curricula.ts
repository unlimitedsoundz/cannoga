
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const subjectTemplates: Record<string, { codePrefix: string, area: string, subjects: { name: string, credits: number, semester: number }[] }> = {
    'ENGINEERING': {
        codePrefix: 'ENG',
        area: 'Engineering',
        subjects: [
            { name: "Engineering Mathematics I", credits: 5, semester: 1 },
            { name: "Introduction to Engineering", credits: 5, semester: 1 },
            { name: "Materials Science", credits: 5, semester: 1 },
            { name: "Thermodynamics", credits: 5, semester: 2 },
            { name: "Solid Mechanics", credits: 5, semester: 2 },
            { name: "CAD and Design Foundation", credits: 5, semester: 2 },
        ]
    },
    'BUSINESS': {
        codePrefix: 'BUS',
        area: 'Business',
        subjects: [
            { name: "Principles of Management", credits: 5, semester: 1 },
            { name: "Financial Accounting", credits: 5, semester: 1 },
            { name: "Business Economics", credits: 5, semester: 1 },
            { name: "Marketing Strategy", credits: 5, semester: 2 },
            { name: "Organizational Behavior", credits: 5, semester: 2 },
            { name: "Data Analytics for Business", credits: 5, semester: 2 },
        ]
    },
    'ARTS': {
        codePrefix: 'ART',
        area: 'Art and Media',
        subjects: [
            { name: "Visual Composition", credits: 5, semester: 1 },
            { name: "Media History & Theory", credits: 5, semester: 1 },
            { name: "Digital Tools I", credits: 5, semester: 1 },
            { name: "Contemporary Art Practice", credits: 5, semester: 2 },
            { name: "Interactive Design", credits: 5, semester: 2 },
            { name: "Creative Storytelling", credits: 5, semester: 2 },
        ]
    },
    'SCIENCE': {
        codePrefix: 'SCI',
        area: 'Science',
        subjects: [
            { name: "Quantum Mechanics I", credits: 5, semester: 1 },
            { name: "Advanced Thermodynamics", credits: 5, semester: 1 },
            { name: "Laboratory Practice", credits: 5, semester: 1 },
            { name: "Numerical Methods", credits: 5, semester: 2 },
            { name: "Electromagnetism", credits: 5, semester: 2 },
            { name: "Scientific Communication", credits: 5, semester: 2 },
        ]
    }
};

async function seed() {
    console.log('🚀 Checking for programs with empty subjects...');

    const { data: programs, error: pError } = await supabase
        .from('Course')
        .select('id, title, slug, degreeLevel');

    if (pError) {
        console.error('Error fetching programs:', pError);
        return;
    }

    // Get counts per course
    const { data: subjectCounts, error: cError } = await supabase
        .rpc('get_subject_counts_per_course');

    // If the RPC doesn't exist, we fall back to a manual check
    let missingPrograms = [];
    if (cError) {
        console.log('Falling back to manual subject count check...');
        for (const p of programs) {
            const { count } = await supabase.from('Subject').select('*', { count: 'exact', head: true }).eq('courseId', p.id);
            if (!count || count === 0) missingPrograms.push(p);
        }
    } else {
        const countsMap = new Map((subjectCounts as any[]).map(sc => [sc.course_id, sc.count]));
        missingPrograms = programs.filter(p => !countsMap.has(p.id) || (countsMap.get(p.id) || 0) === 0);
    }

    if (missingPrograms.length === 0) {
        console.log('✅ All programs already have subjects!');
        return;
    }

    console.log(`🔍 Found ${missingPrograms.length} programs missing subjects.`);

    let totalInserted = 0;

    for (const program of missingPrograms) {
        let templateKey = 'ENGINEERING';
        const title = program.title.toLowerCase();

        if (title.includes('marketing') || title.includes('business') || title.includes('accounting') || title.includes('service management') || title.includes('information systems') || title.includes('management')) {
            templateKey = 'BUSINESS';
        } else if (title.includes('art') || title.includes('media') || title.includes('architecture') || title.includes('language') || title.includes('intercultural')) {
            templateKey = 'ARTS';
        } else if (title.includes('physics') || title.includes('chemistry') || title.includes('mathematics') || title.includes('science')) {
            templateKey = 'SCIENCE';
        }

        const template = subjectTemplates[templateKey];
        const payload = template.subjects.map((s, idx) => ({
            id: `subj-${program.slug.substring(0, 10)}-${idx}`, // deterministic ID for upsert-friendliness
            code: `${template.codePrefix}-${Math.floor(Math.random() * 900) + 100}`,
            name: s.name,
            creditUnits: s.credits,
            semester: s.semester,
            courseId: program.id,
            language: 'English',
            area: template.area
        }));

        const { error } = await supabase.from('Subject').upsert(payload, { onConflict: 'id' });

        if (error) {
            console.error(`❌ Error seeding ${program.title}:`, error.message);
        } else {
            console.log(`✨ Seeded ${payload.length} subjects for ${program.title}`);
            totalInserted += payload.length;
        }
    }

    console.log(`\n🎉 All done! Inserted/Updated ${totalInserted} subjects across ${missingPrograms.length} programs.`);
}

seed();
