
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local or .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

dotenv.config({ path: envLocalPath });
// If not found or incomplete, try .env 
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("Trying .env...");
    dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Checked .env.local and .env');
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) console.log('Found URL but missing Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SUBJECTS = [
    { name: 'Classical Mechanics I', creditUnits: 5, semester: 1, type: 'Core', code: 'PHYS101', eligibility: 'High School Physics' },
    { name: 'Mathematical Methods', creditUnits: 5, semester: 1, type: 'Core', code: 'MATH101' },
    { name: 'Laboratory Physics I', creditUnits: 5, semester: 1, type: 'Core', code: 'LAB101' },
    { name: 'Electromagnetism I', creditUnits: 5, semester: 2, type: 'Core', code: 'PHYS102' },
    { name: 'Thermodynamics', creditUnits: 5, semester: 2, type: 'Core', code: 'PHYS103' },
    { name: 'Modern Physics', creditUnits: 5, semester: 2, type: 'Core', code: 'PHYS104' },
    { name: 'Quantum Mechanics I', creditUnits: 5, semester: 3, type: 'Core', code: 'PHYS201' },
    { name: 'Computational Physics', creditUnits: 5, semester: 3, type: 'Elective', code: 'COMP201' },
];

async function run() {
    console.log('Searching for "Bachelor in Applied Physics"...');

    let { data: course, error } = await supabase
        .from('Course')
        .select('id, title')
        .ilike('title', '%Applied Physics%')
        .maybeSingle();

    if (!course) {
        // Fallback: try finding any course with "Physics" to be sure
        const { data: courses } = await supabase.from('Course').select('id, title').ilike('title', '%Physics%');
        if (courses && courses.length > 0) {
            console.log('Did not find exact "Applied Physics", but found:');
            courses.forEach(c => console.log(`- ${c.title} (${c.id})`));
            // Heuristic: pick the one that looks most like Bachelor Applied Physics
            course = courses.find(c => c.title.includes('Applied')) || courses[0];
            console.log(`Selecting: ${course.title}`);
        }
    }

    if (!course) {
        console.error('Course "Applied Physics" not found in database.');
        return;
    }

    console.log(`Found course: ${course.title} (${course.id})`);

    // Check existing subjects
    const { data: existingSubjects } = await supabase
        .from('Subject')
        .select('id')
        .eq('courseId', course.id);

    if (existingSubjects && existingSubjects.length > 0) {
        console.log(`Course already has ${existingSubjects.length} subjects.`);
        // Force insert if they are just a few placeholders?
        // Let's assume if it has data, we don't touch it unless asked.
        // The user said "no subjects", so likely it has 0.
        if (existingSubjects.length < 2) {
            console.log('Very few subjects found. Appending new list...');
        } else {
            console.log('Skipping population.');
            return;
        }
    }

    console.log('Populating subjects...');
    const subjectsToInsert = SUBJECTS.map(s => ({
        ...s,
        courseId: course.id,
        description: `Introduction to ${s.name}`, // minimal desc
        learningOutcomes: ['Understand key concepts', 'Solve problems'],
        assessmentMethods: ['Written exam']
    }));

    const { error: insertError } = await supabase
        .from('Subject')
        .insert(subjectsToInsert);

    if (insertError) {
        console.error('Error inserting subjects:', insertError);
    } else {
        console.log('Successfully added subjects.');
    }
}

run().catch(console.error);
