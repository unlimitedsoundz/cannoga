import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    console.log('🌱 Starting seed...');

    try {
        // 1. Clean existing data (Delete in order to avoid FK constraints)
        console.log('🧹 Cleaning existing data...');
        const tables = ['News', 'Event', 'Subject', 'Course', 'Faculty', 'Department', 'School'];
        for (const table of tables) {
            const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a dummy NEQ if needed or just use empty filter with delete usually requires a where clause in JS client if RLS/Safe mode, but service role bypasses RLS. However, delete() usually requires a filter. using neq id dummy is a trick, or we can use .gt('id', '') etc.)
            // Actually, without a filter, .delete() throws "Rows would be updated...".
            // We can use .neq('id', 'placeholder') assuming UUIDs.
            if (error) throw new Error(`Failed to clean ${table}: ${error.message}`);
        }

        // 2. Seed Schools
        console.log('🏫 Seeding schools...');

        const schoolsData = [
            {
                name: 'School of Technology',
                slug: 'technology',
                description: 'Driving the development of next-generation systems and intelligent computing solutions.',
                imageUrl: '/images/school-technology.png',
            },
            {
                name: 'School of Business',
                slug: 'business',
                description: 'Cultivating leaders for market disruption and transformative business strategies.',
                imageUrl: '/images/school-business.png',
            },
            {
                name: 'School of Arts & Design',
                slug: 'arts',
                description: 'Fusing aesthetics with ecological responsibility.',
                imageUrl: '/images/school-arts.png',
            }
        ];

        const schools = [];
        for (const s of schoolsData) {
            const { data, error } = await supabase.from('School').insert(s).select().single();
            if (error) throw error;
            schools.push(data);
        }
        const [schoolEngineering, schoolBusiness, schoolArts] = schools;


        // 3. Seed Departments
        console.log('🏢 Seeding departments...');

        const deptsData = [
            {
                name: 'Department of Renewable Energy',
                slug: 'renewable-energy',
                schoolId: schoolEngineering.id,
                description: 'Focusing on solar, wind, and bioenergy technologies.',
            },
            {
                name: 'Department of Sustainable Civil Engineering',
                slug: 'civil-engineering',
                schoolId: schoolEngineering.id,
                description: 'Eco-friendly construction and urban planning.',
            },
            {
                name: 'Department of Sustainable Management',
                slug: 'sustainable-management',
                schoolId: schoolBusiness.id,
                description: 'Leadership strategies for a resilient future.',
            }
        ];

        const depts = [];
        for (const d of deptsData) {
            const { data, error } = await supabase.from('Department').insert(d).select().single();
            if (error) throw error;
            depts.push(data);
        }
        const [deptRenewable, deptCivil, deptManagement] = depts;


        // 4. Seed Faculty
        console.log('👩‍🏫 Seeding faculty...');

        const facultyData = [
            {
                name: 'Dr. Elena Virtanen',
                role: 'Head of Renewable Energy',
                bio: 'Leading expert in solar photovoltaic systems with 15 years of industry experience.',
                email: 'elena.virtanen@cannogacollege.ca',
                schoolId: schoolEngineering.id,
                departmentId: deptRenewable.id,
            },
            {
                name: 'Prof. Markus Korhonen',
                role: 'Senior Lecturer',
                bio: 'Specialist in circular economy economics.',
                email: 'markus.korhonen@cannogacollege.ca',
                schoolId: schoolBusiness.id,
                departmentId: deptManagement.id,
            }
        ];

        for (const f of facultyData) {
            const { error } = await supabase.from('Faculty').insert(f);
            if (error) throw error;
        }


        // 5. Seed Courses
        console.log('📚 Seeding courses...');

        // Course 1
        const course1Data = {
            title: 'Solar Energy Systems Engineering',
            slug: 'solar-energy-systems',
            degreeLevel: 'MASTER',
            duration: '2 Years',
            language: 'English',
            description: 'A comprehensive master\'s program focused on the design, installation, and management of advanced solar energy systems. Students gain hands-on experience with PV technologies and grid integration.',
            entryRequirements: 'Bachelor\'s degree in Engineering or Physics.',
            careerPaths: 'Solar Project Manager, PV Systems Engineer, Energy Consultant.',
            imageUrl: '/images/course-solar.jpg',
            schoolId: schoolEngineering.id,
            departmentId: deptRenewable.id,
        };
        const { data: course1, error: course1Error } = await supabase.from('Course').insert(course1Data).select().single();
        if (course1Error) throw course1Error;

        await supabase.from('Subject').insert([
            { name: 'Photovoltaic Fundamentals', creditUnits: 5, semester: 1, courseId: course1.id },
            { name: 'Grid Integration Technologies', creditUnits: 6, semester: 2, courseId: course1.id },
            { name: 'Solar Thermal Systems', creditUnits: 5, semester: 2, courseId: course1.id },
        ]);

        // Course 2
        const course2Data = {
            title: 'Sustainable Urban Planning',
            slug: 'sustainable-urban-planning',
            degreeLevel: 'BACHELOR',
            duration: '3 Years',
            language: 'English',
            description: 'Learn to design cities of the future. This program combines civil engineering with environmental science to create resilient urban environments.',
            entryRequirements: 'High School Diploma with Mathematics and Physics.',
            careerPaths: 'Urban Planner, Municipal Advisor, Sustainability Coordinator.',
            imageUrl: '/images/course-urban.jpg',
            schoolId: schoolEngineering.id,
            departmentId: deptCivil.id,
        };
        const { data: course2, error: course2Error } = await supabase.from('Course').insert(course2Data).select().single();
        if (course2Error) throw course2Error;

        await supabase.from('Subject').insert([
            { name: 'Introduction to Urban Design', creditUnits: 5, semester: 1, courseId: course2.id },
            { name: 'Green Infrastructure', creditUnits: 4, semester: 3, courseId: course2.id },
            { name: 'Smart City Data Analysis', creditUnits: 5, semester: 4, courseId: course2.id },
        ]);

        // Course 3
        const course3Data = {
            title: 'Circular Economy Business Models',
            slug: 'circular-economy-business',
            degreeLevel: 'MASTER',
            duration: '1.5 Years',
            language: 'English',
            description: 'Redefine business value. This program explores how to transition from linear to circular economic models, reducing waste and maximizing resource efficiency.',
            entryRequirements: 'Bachelor\'s degree in Business or Economics.',
            careerPaths: 'Circular Economy Officer, Strategy Consultant, Sustainability Manager.',
            imageUrl: '/images/course-circular.jpg',
            schoolId: schoolBusiness.id,
            departmentId: deptManagement.id,
        };
        const { error: course3Error } = await supabase.from('Course').insert(course3Data);
        if (course3Error) throw course3Error;

        // Course 4
        const course4Data = {
            title: 'Bachelor of Eco-Design',
            slug: 'eco-design',
            degreeLevel: 'BACHELOR',
            duration: '3 Years',
            language: 'English',
            description: 'Design with nature in mind. Learn sustainable material selection, lifecycle analysis, and biophilic design principles.',
            entryRequirements: 'High School Diploma and Portfolio.',
            careerPaths: 'Product Designer, Sustainable Materials Specialist.',
            schoolId: schoolArts.id,
        };
        const { error: course4Error } = await supabase.from('Course').insert(course4Data);
        if (course4Error) throw course4Error;


        // 6. Seed News
        console.log('📰 Seeding news...');

        await supabase.from('News').insert([
            {
                title: 'Penkka University Partners with GreenTech Canada',
                slug: 'penkka-partners-greentech',
                content: 'We are thrilled to announce a new strategic partnership with GreenTech Canada...',
                excerpt: 'New internship opportunities for engineering students.',
                published: true,
                publishDate: new Date().toISOString(),
            },
            {
                title: 'Applications Open for Fall 2026',
                slug: 'applications-open-fall-2026',
                content: 'Apply now for our Bachelor and Advanced Diploma programs...',
                excerpt: 'Don\'t miss the deadline for the upcoming academic year.',
                published: true,
                publishDate: new Date().toISOString(),
            }
        ]);

        console.log('✅ Seeding completed!');
    } catch (e) {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    }
}

main();
