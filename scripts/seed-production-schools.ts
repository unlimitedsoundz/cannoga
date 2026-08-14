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

const SCHOOLS_TO_SEED = [
    { slug: 'health-community', name: 'School of Health and Community Services', description: 'Preparing compassionate professionals for healthcare, nursing, and community support roles.', imageUrl: '/images/school-health.png' },
    { slug: 'hospitality-tourism', name: 'School of Hospitality and Tourism', description: 'Providing hands-on education in culinary arts, baking, hotel, and tourism management.', imageUrl: '/images/school-hospitality.png' },
    { slug: 'education-social-sciences', name: 'School of Education and Social Sciences', description: 'Empowering leaders in early childhood education, child youth care, and community justice.', imageUrl: '/images/school-education.png' },
    { slug: 'transportation-aviation', name: 'School of Transportation and Aviation', description: 'Training professionals in aviation management, logistics, and automotive service technologies.', imageUrl: '/images/school-transportation.png' },
];

const DEPTS_TO_SEED = [
    { slug: 'health-community-dept', name: 'Department of Health and Community Services', schoolSlug: 'health-community' },
    { slug: 'hospitality-tourism-dept', name: 'Department of Hospitality and Tourism', schoolSlug: 'hospitality-tourism' },
    { slug: 'education-social-sciences-dept', name: 'Department of Education and Social Sciences', schoolSlug: 'education-social-sciences' },
    { slug: 'transportation-aviation-dept', name: 'Department of Transportation and Aviation', schoolSlug: 'transportation-aviation' },
];

const COURSES_TO_SEED = [
    // Health and Community Services
    { title: 'Personal Support Worker', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'personal-support-worker-cert' },
    { title: 'Medical Office Administration', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'medical-office-admin-cert' },
    { title: 'Community Support Worker', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'community-support-worker-cert' },
    { title: 'Mental Health and Addictions Support', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'mental-health-addictions-cert' },
    { title: 'Practical Nursing', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'practical-nursing-dip' },
    { title: 'Pharmacy Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'pharmacy-technician-dip' },
    { title: 'Occupational Therapist Assistant', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'occupational-therapist-assistant-dip' },
    { title: 'Physiotherapist Assistant', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'physiotherapist-assistant-dip' },
    { title: 'Dental Hygiene', degreeLevel: 'DIPLOMA', duration: '3 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'dental-hygiene-dip' },
    { title: 'Early Childhood Education (Health)', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'early-childhood-education-health-dip' },
    { title: 'Social Service Worker', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'social-service-worker-dip' },

    // Hospitality and Tourism
    { title: 'Event Planning', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'event-planning-cert' },
    { title: 'Culinary Skills', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'culinary-skills-cert' },
    { title: 'Hotel Operations', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'hotel-operations-cert' },
    { title: 'Hospitality Management', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'hospitality-management-dip' },
    { title: 'Tourism Management', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'tourism-management-dip' },
    { title: 'Culinary Management', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'culinary-management-dip' },
    { title: 'Baking and Pastry Arts', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'baking-pastry-arts-dip' },

    // Education and Social Sciences
    { title: 'Educational Assistant', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'educational-assistant-cert' },
    { title: 'Leadership Development', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'leadership-development-cert' },
    { title: 'Early Childhood Education', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'early-childhood-education-dip' },
    { title: 'Child and Youth Care', degreeLevel: 'DIPLOMA', duration: '3 Years', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'child-youth-care-dip' },
    { title: 'Developmental Services Worker', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'developmental-services-worker-dip' },
    { title: 'Community and Justice Services', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'community-justice-services-dip' },

    // Transportation and Aviation
    { title: 'Logistics and Transportation', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'transportation-aviation-dept', schoolSlug: 'transportation-aviation', slug: 'logistics-transportation-cert' },
    { title: 'Flight Services', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'transportation-aviation-dept', schoolSlug: 'transportation-aviation', slug: 'flight-services-cert' },
    { title: 'Aviation Management', degreeLevel: 'DIPLOMA', duration: '3 Years', deptSlug: 'transportation-aviation-dept', schoolSlug: 'transportation-aviation', slug: 'aviation-management-dip' },
    { title: 'Aircraft Maintenance Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'transportation-aviation-dept', schoolSlug: 'transportation-aviation', slug: 'aircraft-maintenance-technician-dip' },
    { title: 'Automotive Service Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'transportation-aviation-dept', schoolSlug: 'transportation-aviation', slug: 'automotive-service-technician-dip' },
];

const SUBJECT_TEMPLATES: Record<string, { prefix: string, area: string, subjects: { name: string, credits: number, semester: number }[] }> = {
    'health-community-dept': {
        prefix: 'HTH',
        area: 'Health Sciences',
        subjects: [
            { name: "Introduction to Health Sciences", credits: 5, semester: 1 },
            { name: "Human Anatomy and Physiology", credits: 5, semester: 1 },
            { name: "Medical Terminology", credits: 5, semester: 1 },
            { name: "Patient Care Fundamentals", credits: 5, semester: 2 },
            { name: "Infection Control and Safety", credits: 5, semester: 2 },
            { name: "Health and Community Practices", credits: 5, semester: 2 },
        ]
    },
    'hospitality-tourism-dept': {
        prefix: 'HOS',
        area: 'Hospitality',
        subjects: [
            { name: "Introduction to Hospitality", credits: 5, semester: 1 },
            { name: "Customer Service Excellence", credits: 5, semester: 1 },
            { name: "Food Safety and Sanitation", credits: 5, semester: 1 },
            { name: "Tourism Principles", credits: 5, semester: 2 },
            { name: "Hotel Operations", credits: 5, semester: 2 },
            { name: "Event Management Basics", credits: 5, semester: 2 },
        ]
    },
    'education-social-sciences-dept': {
        prefix: 'EDU',
        area: 'Education',
        subjects: [
            { name: "Foundations of Education", credits: 5, semester: 1 },
            { name: "Child Development", credits: 5, semester: 1 },
            { name: "Inclusive Learning", credits: 5, semester: 1 },
            { name: "Community Engagement", credits: 5, semester: 2 },
            { name: "Social Policy and Practice", credits: 5, semester: 2 },
            { name: "Professional Practice", credits: 5, semester: 2 },
        ]
    },
    'transportation-aviation-dept': {
        prefix: 'TRN',
        area: 'Transportation',
        subjects: [
            { name: "Introduction to Transportation", credits: 5, semester: 1 },
            { name: "Aviation Fundamentals", credits: 5, semester: 1 },
            { name: "Logistics and Supply Chain", credits: 5, semester: 1 },
            { name: "Automotive Systems", credits: 5, semester: 2 },
            { name: "Transportation Safety", credits: 5, semester: 2 },
            { name: "Industry Practicum", credits: 5, semester: 2 },
        ]
    },
};

async function seed() {
    console.log('Starting production seed for missing schools...');

    const { data: existingSchools } = await supabase.from('School').select('slug');
    const existingSchoolSlugs = new Set((existingSchools || []).map(s => s.slug));

    const schoolMap: Record<string, string> = {};

    for (const s of SCHOOLS_TO_SEED) {
        if (existingSchoolSlugs.has(s.slug)) {
            const { data } = await supabase.from('School').select('id').eq('slug', s.slug).single();
            if (data) schoolMap[s.slug] = data.id;
            continue;
        }

        const { data, error } = await supabase.from('School').insert({
            name: s.name,
            slug: s.slug,
            description: s.description,
            imageUrl: s.imageUrl,
        }).select('id').single();

        if (error) {
            console.error(`Failed to create school ${s.slug}:`, error);
        } else if (data) {
            schoolMap[s.slug] = data.id;
            console.log(`Created school: ${s.name}`);
        }
    }

    const { data: existingDepts } = await supabase.from('Department').select('slug');
    const existingDeptSlugs = new Set((existingDepts || []).map(d => d.slug));

    const deptMap: Record<string, string> = {};

    for (const dept of DEPTS_TO_SEED) {
        if (existingDeptSlugs.has(dept.slug)) {
            const { data } = await supabase.from('Department').select('id').eq('slug', dept.slug).single();
            if (data) deptMap[dept.slug] = data.id;
            continue;
        }

        const schoolId = schoolMap[dept.schoolSlug];
        if (!schoolId) {
            console.error(`School not found for dept ${dept.slug}`);
            continue;
        }

        const { data, error } = await supabase.from('Department').insert({
            name: dept.name,
            slug: dept.slug,
            schoolId,
            description: dept.name,
        }).select('id').single();

        if (error) {
            console.error(`Failed to create dept ${dept.slug}:`, error);
        } else if (data) {
            deptMap[dept.slug] = data.id;
            console.log(`Created dept: ${dept.name}`);
        }
    }

    for (const course of COURSES_TO_SEED) {
        const departmentId = deptMap[course.deptSlug];
        const schoolId = schoolMap[course.schoolSlug];
        if (!departmentId || !schoolId) continue;

        const { data: existingCourse } = await supabase.from('Course').select('id').eq('slug', course.slug).maybeSingle();
        let courseId = existingCourse?.id;

        if (!courseId) {
            const { data, error } = await supabase.from('Course').insert({
                title: course.title,
                slug: course.slug,
                degreeLevel: course.degreeLevel,
                duration: course.duration,
                schoolId,
                departmentId,
                language: 'English',
                description: `Official ${course.title} programme at Cannoga College.`,
                careerPaths: 'Diverse opportunities in global industries.',
            }).select('id').single();

            if (error) {
                console.error(`Failed to create course ${course.slug}:`, error);
                continue;
            }
            courseId = data.id;
            console.log(`Created course: ${course.title}`);
        }

        const template = SUBJECT_TEMPLATES[course.deptSlug];
        if (!template) continue;

        const subjectsToInsert = template.subjects.map((s, index) => ({
            name: s.name,
            code: `${template.prefix}-${course.slug.substring(0, 3).toUpperCase()}-${100 + index}`,
            creditUnits: s.credits,
            semester: s.semester,
            courseId,
        }));

        const { error: subError } = await supabase.from('Subject').upsert(
            subjectsToInsert.map((s, i) => ({ ...s, id: `${courseId}-${i}` })),
            { onConflict: 'id' }
        );

        if (subError) {
            console.error(`Failed to seed subjects for ${course.slug}:`, subError);
        } else {
            console.log(`Seeded ${subjectsToInsert.length} subjects for ${course.title}`);
        }
    }

    console.log('Production seed complete.');
}

seed();
