
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

const subjects = [
    { code: "ART101", name: "Drawing & Visual Studies", credits: 6, semester: 1 },
    { code: "ART102", name: "Color Theory", credits: 6, semester: 1 },
    { code: "MED103", name: "Digital Imaging", credits: 6, semester: 1 },
    { code: "HIS104", name: "History of Art", credits: 6, semester: 1 },
    { code: "COM105", name: "Visual Composition", credits: 6, semester: 1 },
    { code: "ART201", name: "2D Design", credits: 6, semester: 2 },
    { code: "MED202", name: "Video Production", credits: 6, semester: 2 },
    { code: "THE203", name: "Media Theory", credits: 6, semester: 2 },
    { code: "DES204", name: "Graphic Design", credits: 6, semester: 2 },
    { code: "PHO205", name: "Digital Photography", credits: 6, semester: 2 },
];

async function seed() {
    console.log('🚀 Seeding Art and Media subjects...');

    const { data: course } = await supabase
        .from('Course')
        .select('id, title')
        .eq('slug', 'ba-art-media')
        .single();

    if (!course) {
        console.error('❌ Course "ba-art-media" not found!');
        return;
    }

    console.log(`✅ Found Course: ${course.title} (${course.id})`);

    const payload = subjects.map(s => ({
        code: s.code,
        name: s.name,
        creditUnits: s.credits,
        semester: s.semester,
        courseId: course.id,
        language: 'English',
        area: 'Art & Media'
    }));

    const { error } = await supabase.from('Subject').upsert(payload, { onConflict: 'code, courseId' });

    if (error) {
        console.error('❌ Error seeding subjects:', error.message);
    } else {
        console.log(`✨ Successfully seeded ${payload.length} subjects for Art & Media!`);
    }
}

seed();
