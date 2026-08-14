
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

async function main() {
    console.log('🌱 Seeding Business School data...');

    // 1. Get School of Business
    const { data: school, error: schoolError } = await supabase
        .from('School')
        .select('id')
        .eq('slug', 'school-of-business')
        .single();

    if (schoolError || !school) {
        console.error('❌ School of Business not found.');
        return;
    }

    // 2. Get Department (Sustainable Management)
    const { data: dept, error: deptError } = await supabase
        .from('Department')
        .select('id')
        .eq('slug', 'sustainable-management')
        .single();

    if (deptError || !dept) {
        console.error('❌ Department not found.');
        return;
    }

    // --- BSc Data ---
    const bscCourse = {
        title: 'International Business',
        slug: 'international-business',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'Comprehensive curriculum covering Accounting, Economics, Finance, and Management.',
        entryRequirements: 'High School Diploma.',
        careerPaths: 'Business Analyst, Financial Consultant, Marketing Manager.',
        schoolId: school.id,
        departmentId: dept.id,
        imageUrl: null // User used placeholder
    };

    // Upsert Course
    const { data: bscData, error: bscError } = await supabase
        .from('Course')
        .upsert(bscCourse, { onConflict: 'slug' })
        .select()
        .single();

    if (bscError) {
        console.error('Error upserting BSc course:', bscError);
    } else {
        console.log('✅ Upserted BSc Course:', bscData.title);

        // Delete existing subjects for this course to be clean
        await supabase.from('Subject').delete().eq('courseId', bscData.id);

        const bscSubjects = [
            { area: "Accounting", code: "ABL-C1111", name: "Introduction to Financial Accounting", ects: 6, eligibility: "BSc only" },
            { area: "Accounting", code: "ABL-C1122", name: "Management Accounting I: Towards Profitable Decision Making", ects: 6, eligibility: "BSc only" },
            { area: "Accounting", code: "ABL-C1144", name: "Management Accounting II: Planning and Performance Management", ects: 6, eligibility: "BSc only" },
            { area: "Economics", code: "ECON-C9000", name: "Principles of Economics", ects: 6, eligibility: "BSc only" },
            { area: "Economics", code: "ECON-C2110", name: "Intermediate Microeconomics I", ects: 5, eligibility: "BSc only" },
            { area: "Finance", code: "CAN-A0103", name: "Fundamentals of Corporate Finance", ects: 6, eligibility: "BSc only" },
            { area: "Finance", code: "CAN-A0104", name: "Fundamentals of Investments", ects: 6, eligibility: "BSc only" },
            { area: "ISM", code: "37C00400", name: "Programming I", ects: 6, eligibility: "BSc only" },
            { area: "Management", code: "MNGT-C1001", name: "Introduction to Strategic Management", ects: 6, eligibility: "BSc only" },
            { area: "Marketing", code: "23C510", name: "Integrated Marketing Communications", ects: 6, eligibility: "BSc only" },
            { area: "Language Studies", code: "LC-5771", name: "Swedish for International Students 1A", ects: 3, eligibility: "BSc & MSc" },
        ];

        const bscSubjectsMapped = bscSubjects.map(s => ({
            name: s.name,
            code: s.code,
            area: s.area,
            creditUnits: s.ects,
            eligibility: s.eligibility,
            language: 'English',
            courseId: bscData.id,
            semester: 1 // Default
        }));

        const { error: subError } = await supabase.from('Subject').insert(bscSubjectsMapped);
        if (subError) console.error('Error inserting BSc subjects:', subError);
        else console.log(`✅ Inserted ${bscSubjects.length} BSc subjects.`);
    }

    // --- MSc Data ---
    const mscCourse = {
        title: 'Strategic Management & Finance',
        slug: 'strategic-management-finance',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'Advanced studies in corporate finance, brand management, and international strategy.',
        entryRequirements: 'Bachelor\'s degree in Business.',
        careerPaths: 'CFO, Strategy Director, Investment Banker.',
        schoolId: school.id,
        departmentId: dept.id,
        imageUrl: null
    };

    const { data: mscData, error: mscError } = await supabase
        .from('Course')
        .upsert(mscCourse, { onConflict: 'slug' })
        .select()
        .single();

    if (mscError) {
        console.error('Error upserting MSc course:', mscError);
    } else {
        console.log('✅ Upserted MSc Course:', mscData.title);

        await supabase.from('Subject').delete().eq('courseId', mscData.id);

        const mscSubjects = [
            { area: "Accounting", code: "22E00100", name: "Financial Statement Analysis", ects: 6, eligibility: "MSc only" },
            { area: "Accounting", code: "22E00210", name: "Financial Accounting Theories", ects: 6, eligibility: "MSc only" },
            { area: "Economics", code: "31E00910", name: "Applied Microeconometrics I D", ects: 6, eligibility: "MSc only" },
            { area: "Finance", code: "28E29000", name: "Advanced Corporate Finance", ects: 6, eligibility: "MSc only" },
            { area: "Finance", code: "CAN-E0311", name: "Advanced Investments", ects: 6, eligibility: "MSc only" },
            { area: "ISM", code: "30E00400", name: "Simulation D", ects: 6, eligibility: "MSc only" },
            { area: "Management", code: "MNGT-E2009", name: "International Strategy", ects: 6, eligibility: "MSc only" },
            { area: "Marketing", code: "23E24000", name: "Brand Management", ects: 6, eligibility: "MSc only" },
            { area: "Entrepreneurship", code: "TU-E4101", name: "Entrepreneurship Lab D", ects: 10, eligibility: "MSc only" },
            { area: "Interdisciplinary", code: "JOIN-C8001", name: "Diving into Radical Creativity", ects: 3, eligibility: "BSc & MSc" },
        ];

        const mscSubjectsMapped = mscSubjects.map(s => ({
            name: s.name,
            code: s.code,
            area: s.area,
            creditUnits: s.ects,
            eligibility: s.eligibility,
            language: 'English',
            courseId: mscData.id,
            semester: 1
        }));

        const { error: subError } = await supabase.from('Subject').insert(mscSubjectsMapped);
        if (subError) console.error('Error inserting MSc subjects:', subError);
        else console.log(`✅ Inserted ${mscSubjects.length} MSc subjects.`);
    }
}

main();
