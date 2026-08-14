
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

// Constants from previous steps
const DEPT_DS_AI_ID = 'a4923b7e-0425-43d7-88ee-90fc7eab1165';
const DEPT_ENTR_DIGITAL_ID = 'e33659ec-b0a8-4af3-80d7-f990c9be56fb';
const SCHOOL_BUSINESS_ID = 'a54123ea-caae-40ec-b3b0-d2c1d91528ca';
const SCHOOL_SCIENCE_ID = '3592d39b-e747-44c4-ab63-2fa22a1cc49a';

async function main() {
    console.log('🏁 Starting Final Academic Expansion...');

    // 1. Generate 20 More Faculty Names
    const additionalFaculty = [
        // SCIENCE / DATA SCIENCE / AI
        { name: "Prof. Li Wei", role: "Professor of Computational Linguistics", bio: "Nature Language Processing and semantic analysis expert.", email: "li.wei@cannogacollege.ca", schoolId: SCHOOL_SCIENCE_ID, departmentId: DEPT_DS_AI_ID },
        { name: "Dr. Isabella Martinez", role: "Associate Professor of Machine Learning", bio: "Specializes in reinforcement learning and neural architecture search.", email: "isabella.m@cannogacollege.ca", schoolId: SCHOOL_SCIENCE_ID, departmentId: DEPT_DS_AI_ID },
        { name: "Dr. David Thorne", role: "Senior Lecturer in Cyber Security", bio: "Expert in distributed ledger technology and protocol design.", email: "david.t@cannogacollege.ca", schoolId: SCHOOL_SCIENCE_ID, departmentId: DEPT_DS_AI_ID },
        { name: "Prof. Chloe Dubois", role: "Professor of Software Engineering", bio: "Leading figure in formal methods and software verification.", email: "chloe.d@cannogacollege.ca", schoolId: SCHOOL_SCIENCE_ID, departmentId: DEPT_DS_AI_ID },
        { name: "Dr. Samuel Osei", role: "Associate Professor of Data Analytics", bio: "Predictive modeling and big data infrastructure specialist.", email: "samuel.o@cannogacollege.ca", schoolId: SCHOOL_SCIENCE_ID, departmentId: DEPT_DS_AI_ID },
        { name: "Dr. Anna Krantz", role: "Senior Lecturer in AI Ethics", bio: "Philospher and computer scientist focusing on algorithmic bias.", email: "anna.k@cannogacollege.ca", schoolId: SCHOOL_SCIENCE_ID, departmentId: DEPT_DS_AI_ID },
        { name: "Prof. Robert Zhang", role: "Professor of Information Systems", bio: "Strategic information management and digital transformation.", email: "robert.z@cannogacollege.ca", schoolId: SCHOOL_SCIENCE_ID, departmentId: DEPT_DS_AI_ID },
        { name: "Dr. Emily Watson", role: "Senior Lecturer in Environmental Science", bio: "Marine ecology and climate adaptation strategies.", email: "emily.w@cannogacollege.ca", schoolId: SCHOOL_SCIENCE_ID, departmentId: DEPT_DS_AI_ID },
        { name: "Dr. Victor Hugo", role: "Associate Professor of Mathematics", bio: "Stochastic processes and financial mathematics.", email: "victor.h@cannogacollege.ca", schoolId: SCHOOL_SCIENCE_ID, departmentId: DEPT_DS_AI_ID },
        { name: "Prof. Nina Sorokin", role: "Professor of Computer Vision", bio: "Real-time object detection and augmented reality expert.", email: "nina.s@cannogacollege.ca", schoolId: SCHOOL_SCIENCE_ID, departmentId: DEPT_DS_AI_ID },

        // BUSINESS / ENTR / DIGITAL
        { name: "Dr. Marcus Aurelius", role: "Professor of Entrepreneurial Leadership", bio: "Philosophical approaches to modern venture leadership.", email: "marcus.a@cannogacollege.ca", schoolId: SCHOOL_BUSINESS_ID, departmentId: DEPT_ENTR_DIGITAL_ID },
        { name: "Dr. Sophia Vala", role: "Associate Professor of Digital Marketing", bio: "CXP and data-driven marketing strategy expert.", email: "sophia.v@cannogacollege.ca", schoolId: SCHOOL_BUSINESS_ID, departmentId: DEPT_ENTR_DIGITAL_ID },
        { name: "Dr. Arsh Gupta", role: "Senior Lecturer in International Business", bio: "Global supply chain and emerging markets specialist.", email: "arsh.g@cannogacollege.ca", schoolId: SCHOOL_BUSINESS_ID, departmentId: DEPT_ENTR_DIGITAL_ID },
        { name: "Prof. Olivia Bennet", role: "Professor of Innovation Management", bio: "Expert in open innovation and R&D strategies.", email: "olivia.b@cannogacollege.ca", schoolId: SCHOOL_BUSINESS_ID, departmentId: DEPT_ENTR_DIGITAL_ID },
        { name: "Dr. Lars Erikson", role: "Senior Lecturer in Venture Capital", bio: "Former VC partner and expert in startup valuation.", email: "lars.e@cannogacollege.ca", schoolId: SCHOOL_BUSINESS_ID, departmentId: DEPT_ENTR_DIGITAL_ID },
        { name: "Dr. Fatima Al-Sayed", role: "Associate Professor of Business Ethics", bio: "CSR and sustainable business models in a global context.", email: "fatima.a@cannogacollege.ca", schoolId: SCHOOL_BUSINESS_ID, departmentId: DEPT_ENTR_DIGITAL_ID },
        { name: "Prof. James Carter", role: "Professor of Strategic Management", bio: "Competitive advantage and corporate restructuring expert.", email: "james.c@cannogacollege.ca", schoolId: SCHOOL_BUSINESS_ID, departmentId: DEPT_ENTR_DIGITAL_ID },
        { name: "Dr. Yuki Hara", role: "Senior Lecturer in HRM", bio: "Cultural diversity and performance management in tech firms.", email: "yuki.h@cannogacollege.ca", schoolId: SCHOOL_BUSINESS_ID, departmentId: DEPT_ENTR_DIGITAL_ID },
        { name: "Dr. Peter Thompson", role: "Associate Professor of FinTech", bio: "Blockchain in finance and digital banking systems.", email: "peter.t@cannogacollege.ca", schoolId: SCHOOL_BUSINESS_ID, departmentId: DEPT_ENTR_DIGITAL_ID },
        { name: "Prof. Sarah Miller", role: "Professor of Digital Economics", bio: "Platform competition and network effects expert.", email: "sarah.m@cannogacollege.ca", schoolId: SCHOOL_BUSINESS_ID, departmentId: DEPT_ENTR_DIGITAL_ID }
    ];

    console.log('🔹 Seeding 20 new faculty members...');
    const { error: facultyError } = await supabase.from('Faculty').insert(additionalFaculty);
    if (facultyError) console.error('❌ Faculty seeding failed:', facultyError.message);

    // 2. Fetch all Subjects for the new courses to populate modules
    console.log('🔹 Fetching subjects for module population...');
    const { data: subjects } = await supabase
        .from('Subject')
        .select(`
            id, code, name, creditUnits, courseId, 
            course:Course(degreeLevel, title)
        `)
        .in('courseId', [
            // List of UUIDs previously fetched
            'e78cd184-d70f-476d-8925-9a94d8754d16', '44aa0886-019f-475a-b616-9511729d1386', '1df3d8b1-9133-4222-b033-a28f8e33851e',
            '1c8e7234-9785-47aa-a838-b7db2cabae19', 'e82ccc83-dc9b-4b90-a6e0-90689f49ad3a', 'e037b19c-08f1-455c-9048-3548fe8a3c48',
            '76111223-8b47-4bab-aec6-08486b1ac08e', '54c454e0-fc2d-4190-b562-7c9411b430e1', '767ee2d0-be50-4a1b-bddd-81e20e29b3bf',
            '98857c40-e58f-4778-bd6b-9909d39f985b', 'b7575c72-6bc8-44af-b640-b3034575e851', '586d3032-d371-4032-91c2-c964dba62488',
            'cefbb6c1-d03f-4a94-9ce6-81389a3c5223', '48e55410-283c-40e1-b897-4d440ef27a19', '0a788bd6-ec83-4d79-a5b1-3f174d3393a8',
            'c27fdf2a-f786-47d0-8c9c-c9c3e65b5580', '51dab0f3-6f72-4d6c-ad23-ca4a35fe005b', '3cf65dd9-bc92-4b9f-aabf-383de5901327',
            'cb16b448-5c5d-4e94-8ada-5049a0f0be4e', '3a0578ec-17d6-4b83-bdc6-da2742969869', 'cd3b3eb9-6fd2-435c-9cb2-61c803195f21',
            '09892638-d4d8-4528-bc85-264f64a29474', '49b84c9a-009f-4840-a61c-27abaf03fc07', '00a6ad7f-68a7-4f79-b28b-2dc086365722',
            '34bd1ac7-e7d6-42e6-8888-c899fd0d5cea', '24e9ab9d-d00c-4594-8825-0472992d3d0c', '337cecf9-4132-4a60-8cdb-ed316a316b30',
            '29ae6600-245a-4e1b-afa8-127117f20969'
        ]);

    if (subjects) {
        console.log(`🔹 Preparing ${subjects.length} module entries for registration portal...`);
        const academicLevelMap: Record<string, string> = {
            'BACHELOR': 'Bachelor',
            'MASTER': 'Master'
        };

        const modules = subjects.map((s: any) => ({
            code: s.code,
            title: s.name,
            credits: s.creditUnits,
            description: `Core module for ${s.course?.title}. Focuses on practical application of ${s.name} concepts in a professional environment.`,
            program_id: s.courseId,
            academic_level: academicLevelMap[s.course?.degreeLevel] || 'Bachelor',
            capacity: 100,
            instructor: additionalFaculty[Math.floor(Math.random() * additionalFaculty.length)].name
        }));

        // Insert modules in chunks to avoid payload limits
        const chunkSize = 50;
        for (let i = 0; i < modules.length; i += chunkSize) {
            const chunk = modules.slice(i, i + chunkSize);
            const { error: moduleError } = await supabase.from('modules').upsert(chunk, { onConflict: 'code' });
            if (moduleError) console.error(`❌ Module upsert failed at chunk ${i}:`, moduleError.message);
        }
    }

    console.log('✨ Final Academic Expansion complete!');
}

main();
