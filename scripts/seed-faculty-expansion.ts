
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

const SCHOOL_BUSINESS_ID = 'a54123ea-caae-40ec-b3b0-d2c1d91528ca';
const SCHOOL_SCIENCE_ID = '3592d39b-e747-44c4-ab63-2fa22a1cc49a';

const DEPT_BUSINESS_ID = 'c4549615-f6bb-43f1-8e84-f523065bb08a';
const DEPT_CS_ID = '36796002-4383-4129-942e-8d8d2ad07e38';
const DEPT_CIVIL_ID = '6844c4bb-09b9-465a-b469-dd640f8c561c';
const DEPT_MGMT_ID = 'a4e247de-8e3b-4bcb-8422-45f7672b29a9';

const facultyData = [
    // BUSINESS FACULTY
    {
        name: "Dr. Elena Rossi",
        role: "Professor of Digital Transformation",
        bio: "Expert in digital business models and platform economy.",
        email: "elena.rossi@cannogacollege.ca",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID
    },
    {
        name: "Markus Jääskeläinen",
        role: "Senior Lecturer in Project Management",
        bio: "Specializes in Agile methodologies and global project teams.",
        email: "markus.j@cannogacollege.ca",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_MGMT_ID
    },
    {
        name: "Prof. Sofia Lindström",
        role: "Associate Professor of Entrepreneurship",
        bio: "Serial entrepreneur and researcher in venture capital.",
        email: "sofia.l@cannogacollege.ca",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID
    },
    {
        name: "Dr. Thomas Weber",
        role: "Senior Lecturer in Logistics",
        bio: "Research focus on sustainable supply chain management.",
        email: "thomas.weber@cannogacollege.ca",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID
    },

    // SCIENCE FACULTY
    {
        name: "Prof. Aleksei Ivanov",
        role: "Professor of Artificial Intelligence",
        bio: "Leading researcher in Deep Learning and Neural Networks.",
        email: "aleksei.i@cannogacollege.ca",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID
    },
    {
        name: "Dr. Sarah Chen",
        role: "Associate Professor of Cybersecurity",
        bio: "Expert in cryptographic engineering and network defense.",
        email: "sarah.chen@cannogacollege.ca",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID
    },
    {
        name: "Dr. Hans Becker",
        role: "Senior Lecturer in Software Engineering",
        bio: "Focus on DevOps, CI/CD, and software measurement.",
        email: "hans.becker@cannogacollege.ca",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID
    },
    {
        name: "Prof. Maria Virtanen",
        role: "Professor of Environmental Science",
        bio: "Specializes in climate change science and sustainable policy.",
        email: "maria.v@cannogacollege.ca",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CIVIL_ID
    },
    {
        name: "Dr. Kenji Tanaka",
        role: "Associate Professor of Data Science",
        bio: "Expert in predictive analytics and big data systems.",
        email: "kenji.t@cannogacollege.ca",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID
    }
];

async function main() {
    console.log('🌱 Seeding Faculty expansion data...');

    const { error } = await supabase.from('Faculty').insert(facultyData);

    if (error) {
        console.error('❌ Error seeding faculty:', error.message);
    } else {
        console.log(`✅ Successfully seeded ${facultyData.length} new faculty members.`);
    }

    console.log('✨ Faculty seeding complete!');
}

main();
