
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local or .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

dotenv.config({ path: envLocalPath });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const YEAR_1_SUBJECTS = [
    { name: 'Calculus I', creditUnits: 6, semester: 1 },
    { name: 'Linear Algebra', creditUnits: 6, semester: 1 },
    { name: 'Classical Mechanics', creditUnits: 6, semester: 1 },
    { name: 'Introduction to Applied Physics', creditUnits: 6, semester: 1 },
    { name: 'General Physics Laboratory I', creditUnits: 6, semester: 1 },
    { name: 'Programming for Scientists', creditUnits: 6, semester: 2 },
    { name: 'Calculus II', creditUnits: 6, semester: 2 },
    { name: 'Probability and Statistics', creditUnits: 6, semester: 2 },
    { name: 'Waves and Optics', creditUnits: 6, semester: 2 },
    { name: 'Electricity and Magnetism I', creditUnits: 6, semester: 2 },
];

const YEAR_2_SUBJECTS = [
    { name: 'Differential Equations', creditUnits: 6, semester: 3 },
    { name: 'Electricity and Magnetism II', creditUnits: 6, semester: 3 },
    { name: 'Thermodynamics', creditUnits: 6, semester: 3 },
    { name: 'Modern Physics', creditUnits: 6, semester: 3 },
    { name: 'Experimental Physics Laboratory II', creditUnits: 6, semester: 3 },
    { name: 'Numerical Methods in Physics', creditUnits: 6, semester: 4 },
    { name: 'Solid State Physics', creditUnits: 6, semester: 4 },
    { name: 'Electronics for Physicists', creditUnits: 6, semester: 4 },
    { name: 'Measurement Techniques and Instrumentation', creditUnits: 6, semester: 4 },
    { name: 'Systems Analysis and Modelling', creditUnits: 6, semester: 4 },
];

const YEAR_3_SUBJECTS = [
    { name: 'Applied Quantum Physics', creditUnits: 6, semester: 5 },
    { name: 'Materials Physics', creditUnits: 6, semester: 5 },
    { name: 'Energy Systems and Applied Thermophysics', creditUnits: 6, semester: 5 },
    { name: 'Computational Physics', creditUnits: 6, semester: 5 },
    { name: 'Applied Optics and Photonics', creditUnits: 6, semester: 5 },
    { name: 'Elective I', creditUnits: 6, semester: 6 },
    { name: 'Elective II', creditUnits: 6, semester: 6 },
    { name: 'Research Methods in Physics', creditUnits: 6, semester: 6 },
    { name: 'Industrial Training or Applied Project', creditUnits: 6, semester: 6 },
    { name: 'Bachelor Thesis in Applied Physics', creditUnits: 12, semester: 6 },
];

const ALL_SUBJECTS = [...YEAR_1_SUBJECTS, ...YEAR_2_SUBJECTS, ...YEAR_3_SUBJECTS];

async function run() {
    const targetSlug = 'bsc-applied-physics-science';
    console.log(`Searching for course with slug: "${targetSlug}"...`);

    // First list all potential candidates to debug
    const { data: allPhysics } = await supabase.from('Course').select('id, title, slug').ilike('title', '%Physics%');
    console.log('Available Physics Courses:', allPhysics?.map(c => `${c.title} (${c.slug})`).join(', '));

    let { data: course, error } = await supabase
        .from('Course')
        .select('id, title')
        .eq('slug', targetSlug)
        .maybeSingle();

    if (!course) {
        console.log('Exact slug match failed. Trying by Title "Applied Physics"...');
        const match = allPhysics?.find(c => c.slug === targetSlug || c.title.toLowerCase().includes('applied physics'));
        if (match) {
            course = match;
        }
    }

    if (!course) {
        console.error(`Course with slug "${targetSlug}" not found using exact match.`);
        return;
    }

    console.log(`Found course: ${course.title} (${course.id})`);

    // Clear existing subjects
    console.log('Deleting existing subjects...');
    const { error: deleteError } = await supabase
        .from('Subject')
        .delete()
        .eq('courseId', course.id);

    if (deleteError) {
        console.error('Error deleting subjects:', deleteError);
        return;
    }

    console.log(`Inserting ${ALL_SUBJECTS.length} new subjects...`);
    const subjectsToInsert = ALL_SUBJECTS.map(s => ({
        ...s,
        courseId: course.id,
        code: `${s.name.substring(0, 4).toUpperCase()}${s.semester}0${Math.floor(Math.random() * 9)}`,
        description: `${s.name} - Detailed study.`,
        type: s.name.includes('Elective') ? 'Elective' : 'Core'
    }));

    const { error: insertError } = await supabase
        .from('Subject')
        .insert(subjectsToInsert);

    if (insertError) {
        console.error('Error inserting subjects:', insertError);
    } else {
        console.log('Successfully updated curriculum.');
    }
}

run().catch(console.error);
