
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const departments = [
    // ARTS
    { name: 'Architecture', school: 'arts' },
    { name: 'Art and Media', school: 'arts' },
    { name: 'Design', school: 'arts' },
    { name: 'Film, Television and Scenography', school: 'arts' },

    // BUSINESS
    { name: 'Accounting & Business Law', school: 'business' },
    { name: 'Economics', school: 'business' },
    { name: 'Finance', school: 'business' },
    { name: 'Information and Service Management', school: 'business' },
    { name: 'Management Studies', school: 'business' },
    { name: 'Marketing', school: 'business' },

    // TECHNOLOGY (Engineering & Science)
    { name: 'Applied Physics', school: 'technology' },
    { name: 'Chemical and Metallurgical Engineering', school: 'technology' },
    { name: 'Chemistry and Materials Science', school: 'technology' },
    { name: 'Civil Engineering', school: 'technology' },
    { name: 'Computer Science', school: 'technology' },
    { name: 'Electrical Engineering and Automation', school: 'technology' },
    { name: 'Electronics and Nanoengineering', school: 'technology' },
    { name: 'Industrial Engineering and Management', school: 'technology' },
    { name: 'Information and Communications Engineering', school: 'technology' },
    { name: 'Mathematics and Systems Analysis', school: 'technology' },
    { name: 'Energy and Mechanical Engineering', school: 'technology' },
];

function generateSlug(name: string) {
    return name.toLowerCase()
        .replace(/&/g, '')
        .replace(/,/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

async function seed() {
    console.log('Fetching Schools...');
    const { data: schools } = await supabase.from('School').select('id, slug');

    if (!schools) {
        console.error('No schools found! Please seed schools first.');
        return;
    }

    const schoolMap: Record<string, string> = {};
    schools.forEach(s => schoolMap[s.slug] = s.id);

    // Check if technology exists, if not maybe fallback to science or create it
    if (!schoolMap['technology']) {
        console.log('School "technology" not found. Creating it...');
        const { data: newSchool, error } = await supabase.from('School').insert({
            name: 'School of Technology',
            slug: 'technology',
            description: 'Shaping the future through engineering and science.',
            imageUrl: 'https://images.unsplash.com/photo-1581094794329-cd5434177d01?q=80&w=2070&auto=format&fit=crop'
        }).select().single();

        if (error) {
            console.error('Failed to create School of Technology:', error);
        } else if (newSchool) {
            schoolMap['technology'] = newSchool.id;
            console.log('Created School of Technology:', newSchool.id);
        }
    }

    for (const dept of departments) {
        const schoolId = schoolMap[dept.school];
        if (!schoolId) {
            console.error(`School ${dept.school} not found for ${dept.name}, skipping.`);
            continue;
        }

        const slug = generateSlug(dept.name);

        // Manual override for common short slugs if needed to match existing links
        // e.g. "Electronics and Nanoengineering" -> "electronics-nano"
        let finalSlug = slug;
        if (dept.name === 'Electronics and Nanoengineering') finalSlug = 'electronics-nano';
        if (dept.name === 'Information and Communications Engineering') finalSlug = 'info-comms';
        if (dept.name === 'Electrical Engineering and Automation') finalSlug = 'electrical-automation';
        if (dept.name === 'Energy and Mechanical Engineering') finalSlug = 'energy-mechanical';
        if (dept.name === 'Art and Media') finalSlug = 'art-media';
        if (dept.name === 'Accounting & Business Law') finalSlug = 'accounting-business-law';
        if (dept.name === 'Chemical and Metallurgical Engineering') finalSlug = 'chemical-metallurgical';
        if (dept.name === 'Chemistry and Materials Science') finalSlug = 'chemistry-materials';
        if (dept.name === 'Film, Television and Scenography') finalSlug = 'film-tv';
        if (dept.name === 'Information and Service Management') finalSlug = 'info-service';
        if (dept.name === 'Industrial Engineering and Management') finalSlug = 'industrial-engineering';
        if (dept.name === 'Management Studies') finalSlug = 'management';
        if (dept.name === 'Mathematics and Systems Analysis') finalSlug = 'math-systems';


        console.log(`Upserting ${dept.name} (${finalSlug})...`);
        const { error } = await supabase.from('Department').upsert({
            name: dept.name,
            slug: finalSlug,
            schoolId: schoolId,
            description: `Department of ${dept.name}`,
            // Add an image url if column exists (we added it to type, hopefully migrated in DB or logic ignores it if generic upsert ok)
            // Note: If DB schema doesn't have imageUrl yet, this might fail if we include it. 
            // My typescript check showed I updated the Interface, but I didn't run a strict migration tool. 
            // Assuming Supabase table is flexible or just omitting imageUrl for now to be safe.
        }, { onConflict: 'slug' });

        if (error) console.error(`Error upserting ${dept.name}:`, error);
    }
    console.log('Seeding complete.');
}

seed();
