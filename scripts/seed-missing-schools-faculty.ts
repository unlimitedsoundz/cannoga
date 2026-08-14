import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const FACULTY_TO_SEED = [
    { name: 'Dr. Emily Campbell', role: 'Professor & Chair', bio: 'Dr. Campbell is a registered nurse and community health advocate specializing in practical nursing programs across Canada.', email: 'emily.campbell@cannogacollege.ca', schoolSlug: 'health-community', deptSlug: 'health-community-dept' },
    { name: 'Dr. Sarah Mitchell', role: 'Associate Professor', bio: 'Specializes in mental health nursing and addiction support services.', email: 'sarah.mitchell@cannogacollege.ca', schoolSlug: 'health-community', deptSlug: 'health-community-dept' },
    { name: 'Prof. Michael O\'Brien', role: 'Lecturer', bio: 'Experienced pharmacy technician and educator with focus on clinical practice.', email: 'michael.obrien@cannogacollege.ca', schoolSlug: 'health-community', deptSlug: 'health-community-dept' },

    { name: 'Dr. Isabella Santos', role: 'Professor & Chair', bio: 'Dr. Santos oversees hospitality management systems and culinary arts program certifications with global tourism networks.', email: 'isabella.santos@cannogacollege.ca', schoolSlug: 'hospitality-tourism', deptSlug: 'hospitality-tourism-dept' },
    { name: 'Chef Marcus Dubois', role: 'Senior Lecturer', bio: 'Award-winning chef with experience in Michelin-starred restaurants across Europe and Canada.', email: 'marcus.dubois@cannogacollege.ca', schoolSlug: 'hospitality-tourism', deptSlug: 'hospitality-tourism-dept' },
    { name: 'Prof. Anna Lindqvist', role: 'Lecturer', bio: 'Tourism specialist with expertise in sustainable destination management.', email: 'anna.lindqvist@cannogacollege.ca', schoolSlug: 'hospitality-tourism', deptSlug: 'hospitality-tourism-dept' },

    { name: 'Prof. Arthur Bertrand', role: 'Professor & Chair', bio: 'Prof. Bertrand is a specialist in early childhood learning models and developmental support systems in Ontario.', email: 'arthur.bertrand@cannogacollege.ca', schoolSlug: 'education-social-sciences', deptSlug: 'education-social-sciences-dept' },
    { name: 'Dr. Rachel Kim', role: 'Associate Professor', bio: 'Focuses on inclusive education strategies and special needs support systems.', email: 'rachel.kim@cannogacollege.ca', schoolSlug: 'education-social-sciences', deptSlug: 'education-social-sciences-dept' },
    { name: 'Prof. David Thompson', role: 'Lecturer', bio: 'Experienced social worker specializing in community justice and youth outreach.', email: 'david.thompson@cannogacollege.ca', schoolSlug: 'education-social-sciences', deptSlug: 'education-social-sciences-dept' },

    { name: 'Dr. James Vance', role: 'Professor & Chair', bio: 'Dr. Vance is a veteran aerospace specialist and licensed instructor with background in aviation management and safety systems.', email: 'james.vance@cannogacollege.ca', schoolSlug: 'transportation-aviation', deptSlug: 'transportation-aviation-dept' },
    { name: 'Prof. Carlos Mendez', role: 'Senior Lecturer', bio: 'Expert in automotive engineering and hybrid vehicle technologies with North American industry experience.', email: 'carlos.mendez@cannogacollege.ca', schoolSlug: 'transportation-aviation', deptSlug: 'transportation-aviation-dept' },
    { name: 'Dr. Sarah Chen', role: 'Lecturer', bio: 'Aviation management specialist with airline operations and logistics background.', email: 'sarah.chen@cannogacollege.ca', schoolSlug: 'transportation-aviation', deptSlug: 'transportation-aviation-dept' },
];

async function seedFaculty() {
    console.log('Seeding faculty for missing schools...');

    const { data: depts } = await supabase.from('Department').select('id, slug, schoolId');
    if (!depts) {
        console.error('Failed to fetch departments');
        return;
    }

    const deptMap = new Map(depts.map(d => [d.slug, d.id]));

    for (const f of FACULTY_TO_SEED) {
        const deptId = deptMap.get(f.deptSlug);
        if (!deptId) {
            console.error(`Department not found: ${f.deptSlug}`);
            continue;
        }

        const { data: existing } = await supabase.from('Faculty').select('id').eq('email', f.email).maybeSingle();
        if (existing) {
            console.log(`Faculty already exists: ${f.email}`);
            continue;
        }

        const { error } = await supabase.from('Faculty').insert({
            name: f.name,
            role: f.role,
            bio: f.bio,
            email: f.email,
            schoolId: (depts.find(d => d.id === deptId)?.schoolId) || '',
            departmentId: deptId,
        });

        if (error) {
            console.error(`Failed to insert ${f.name}:`, error.message);
        } else {
            console.log(`Inserted faculty: ${f.name}`);
        }
    }

    console.log('Faculty seeding complete.');
}

seedFaculty();
