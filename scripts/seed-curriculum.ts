
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

const curriculumData = [
    {
        courseTitle: "Bachelor's in Management Studies",
        courseSlug: "bsc-management-studies",
        deptSlug: "management",
        degreeLevel: "BACHELOR",
        duration: "3 Years",
        credits: 180,
        subjects: [
            { code: "MGT101", name: "Principles of Management", credits: 6, semester: 1 },
            { code: "BUS102", name: "Business Mathematics", credits: 6, semester: 1 },
            { code: "ECO103", name: "Microeconomics", credits: 6, semester: 1 },
            { code: "ORG104", name: "Organizational Behavior", credits: 6, semester: 2 },
            { code: "ACC105", name: "Financial Accounting", credits: 6, semester: 2 },
            { code: "STA106", name: "Business Statistics", credits: 6, semester: 2 },
            { code: "MGT201", name: "Operations Management", credits: 6, semester: 3 },
            { code: "HRM202", name: "Human Resource Management", credits: 6, semester: 3 },
            { code: "CAN203", name: "Corporate Finance", credits: 6, semester: 3 },
            { code: "STR204", name: "Business Strategy", credits: 6, semester: 4 },
            { code: "MKT205", name: "Marketing Management", credits: 6, semester: 4 },
            { code: "LAW206", name: "Business Law", credits: 6, semester: 4 },
            { code: "ENT301", name: "Entrepreneurship", credits: 6, semester: 5 },
            { code: "RSM302", name: "Research Methods", credits: 6, semester: 5 },
            { code: "ELE303", name: "Electives", credits: 6, semester: 5 },
            { code: "THS399", name: "Bachelor Thesis", credits: 12, semester: 6 },
        ]
    },
    {
        courseTitle: "Master's in Management Studies",
        courseSlug: "msc-management-studies",
        deptSlug: "management",
        degreeLevel: "MASTER",
        duration: "2 Years",
        credits: 120,
        subjects: [
            { code: "MGT501", name: "Advanced Management Theory", credits: 6, semester: 1 },
            { code: "STR502", name: "Strategic Management", credits: 6, semester: 1 },
            { code: "ORG503", name: "Leadership and Change", credits: 6, semester: 1 },
            { code: "CAN504", name: "Managerial Finance", credits: 6, semester: 2 },
            { code: "OPS505", name: "Advanced Operations", credits: 6, semester: 2 },
            { code: "INN506", name: "Innovation Management", credits: 6, semester: 2 },
            { code: "RSM601", name: "Advanced Research Methods", credits: 6, semester: 3 },
            { code: "ELE602", name: "Electives", credits: 12, semester: 3 },
            { code: "THS699", name: "Master Thesis", credits: 30, semester: 4 },
        ]
    },
    {
        courseTitle: "Bachelor's in Finance",
        courseSlug: "bsc-finance",
        deptSlug: "finance",
        degreeLevel: "BACHELOR",
        duration: "3 Years",
        credits: 180,
        subjects: [
            { code: "CAN101", name: "Introduction to Finance", credits: 6, semester: 1 },
            { code: "ACC102", name: "Financial Accounting", credits: 6, semester: 1 },
            { code: "MAT103", name: "Business Mathematics", credits: 6, semester: 1 },
            { code: "ECO104", name: "Microeconomics", credits: 6, semester: 2 },
            { code: "CAN105", name: "Financial Markets", credits: 6, semester: 2 },
            { code: "STA106", name: "Statistics", credits: 6, semester: 2 },
            { code: "CAN201", name: "Corporate Finance", credits: 6, semester: 3 },
            { code: "INV202", name: "Investment Analysis", credits: 6, semester: 3 },
            { code: "ECO203", name: "Macroeconomics", credits: 6, semester: 3 },
            { code: "RSK204", name: "Risk Management", credits: 6, semester: 4 },
            { code: "BNK205", name: "Banking Systems", credits: 6, semester: 4 },
            { code: "LAW206", name: "Financial Regulation", credits: 6, semester: 4 },
            { code: "CAN301", name: "Portfolio Management", credits: 6, semester: 5 },
            { code: "RSM302", name: "Research Methods", credits: 6, semester: 5 },
            { code: "THS399", name: "Bachelor Thesis", credits: 12, semester: 6 },
        ]
    },
    {
        courseTitle: "Master's in Finance",
        courseSlug: "msc-finance",
        deptSlug: "finance",
        degreeLevel: "MASTER",
        duration: "2 Years",
        credits: 120,
        subjects: [
            { code: "CAN501", name: "Advanced Corporate Finance", credits: 6, semester: 1 },
            { code: "INV502", name: "Asset Pricing", credits: 6, semester: 1 },
            { code: "RSK503", name: "Financial Risk Modeling", credits: 6, semester: 1 },
            { code: "DER504", name: "Derivatives and Hedging", credits: 6, semester: 2 },
            { code: "CAN505", name: "International Finance", credits: 6, semester: 2 },
            { code: "ANA506", name: "Financial Analytics", credits: 6, semester: 2 },
            { code: "RSM601", name: "Research Methods", credits: 6, semester: 3 },
            { code: "ELE602", name: "Electives", credits: 12, semester: 3 },
            { code: "THS699", name: "Master Thesis", credits: 30, semester: 4 },
        ]
    },
    {
        courseTitle: "Bachelor's in Economics",
        courseSlug: "bsc-economics",
        deptSlug: "economics",
        degreeLevel: "BACHELOR",
        duration: "3 Years",
        credits: 180,
        subjects: [
            { code: "ECO101", name: "Principles of Economics", credits: 6, semester: 1 },
            { code: "MAT102", name: "Mathematics for Economists", credits: 6, semester: 1 },
            { code: "STA103", name: "Statistics", credits: 6, semester: 1 },
            { code: "ECO104", name: "Microeconomics", credits: 6, semester: 2 },
            { code: "ECO105", name: "Macroeconomics", credits: 6, semester: 2 },
            { code: "ECO106", name: "Economic History", credits: 6, semester: 2 },
            { code: "ECO201", name: "Econometrics I", credits: 6, semester: 3 },
            { code: "ECO202", name: "Public Economics", credits: 6, semester: 3 },
            { code: "ECO203", name: "International Economics", credits: 6, semester: 3 },
            { code: "ECO204", name: "Development Economics", credits: 6, semester: 4 },
            { code: "ECO205", name: "Monetary Economics", credits: 6, semester: 4 },
            { code: "LAW206", name: "Economic Policy", credits: 6, semester: 4 },
            { code: "ECO301", name: "Applied Econometrics", credits: 6, semester: 5 },
            { code: "RSM302", name: "Research Methods", credits: 6, semester: 5 },
            { code: "THS399", name: "Bachelor Thesis", credits: 12, semester: 6 },
        ]
    },
    {
        courseTitle: "Master's in Economics",
        courseSlug: "msc-economics",
        deptSlug: "economics",
        degreeLevel: "MASTER",
        duration: "2 Years",
        credits: 120,
        subjects: [
            { code: "ECO501", name: "Advanced Microeconomics", credits: 6, semester: 1 },
            { code: "ECO502", name: "Advanced Macroeconomics", credits: 6, semester: 1 },
            { code: "ECO503", name: "Econometrics II", credits: 6, semester: 1 },
            { code: "ECO504", name: "International Trade Theory", credits: 6, semester: 2 },
            { code: "ECO505", name: "Applied Economic Policy", credits: 6, semester: 2 },
            { code: "ECO506", name: "Behavioral Economics", credits: 6, semester: 2 },
            { code: "RSM601", name: "Research Methods", credits: 6, semester: 3 },
            { code: "ELE602", name: "Electives", credits: 12, semester: 3 },
            { code: "THS699", name: "Master Thesis", credits: 30, semester: 4 },
        ]
    },
    {
        courseTitle: "Bachelor's in Mathematics and Systems Analysis",
        courseSlug: "bsc-math-systems",
        deptSlug: "math-systems",
        degreeLevel: "BACHELOR",
        duration: "3 Years",
        credits: 180,
        subjects: [
            { code: "MAT101", name: "Calculus I", credits: 6, semester: 1 },
            { code: "MAT102", name: "Linear Algebra", credits: 6, semester: 1 },
            { code: "SYS103", name: "Systems Thinking", credits: 6, semester: 1 },
            { code: "MAT104", name: "Calculus II", credits: 6, semester: 2 },
            { code: "PRO105", name: "Programming for Scientists", credits: 6, semester: 2 },
            { code: "STA106", name: "Probability Theory", credits: 6, semester: 2 },
            { code: "MAT201", name: "Differential Equations", credits: 6, semester: 3 },
            { code: "SYS202", name: "Systems Modeling", credits: 6, semester: 3 },
            { code: "OPT203", name: "Optimization Methods", credits: 6, semester: 3 },
            { code: "MAT204", name: "Numerical Analysis", credits: 6, semester: 4 },
            { code: "STA205", name: "Statistical Inference", credits: 6, semester: 4 },
            { code: "SYS206", name: "Simulation Techniques", credits: 6, semester: 4 },
            { code: "RSM301", name: "Research Methods", credits: 6, semester: 5 },
            { code: "ELE302", name: "Electives", credits: 6, semester: 5 },
            { code: "THS399", name: "Bachelor Thesis", credits: 12, semester: 6 },
        ]
    },
    {
        courseTitle: "Master's in Mathematics and Systems Analysis",
        courseSlug: "msc-math-systems",
        deptSlug: "math-systems",
        degreeLevel: "MASTER",
        duration: "2 Years",
        credits: 120,
        subjects: [
            { code: "MAT501", name: "Advanced Linear Systems", credits: 6, semester: 1 },
            { code: "OPT502", name: "Advanced Optimization", credits: 6, semester: 1 },
            { code: "STA503", name: "Stochastic Processes", credits: 6, semester: 1 },
            { code: "SYS504", name: "Systems Control Theory", credits: 6, semester: 2 },
            { code: "MAT505", name: "Numerical Optimization", credits: 6, semester: 2 },
            { code: "ANA506", name: "Data Analysis", credits: 6, semester: 2 },
            { code: "RSM601", name: "Research Methods", credits: 6, semester: 3 },
            { code: "ELE602", name: "Electives", credits: 12, semester: 3 },
            { code: "THS699", name: "Master Thesis", credits: 30, semester: 4 },
        ]
    },
    {
        courseTitle: "Bachelor's in Applied Physics",
        courseSlug: "bsc-applied-physics",
        deptSlug: "applied-physics",
        degreeLevel: "BACHELOR",
        duration: "3 Years",
        credits: 180,
        subjects: [
            { code: "PHY101", name: "Classical Mechanics", credits: 6, semester: 1 },
            { code: "MAT102", name: "Calculus", credits: 6, semester: 1 },
            { code: "PHY103", name: "Waves and Optics", credits: 6, semester: 1 },
            { code: "PHY104", name: "Electromagnetism", credits: 6, semester: 2 },
            { code: "PHY105", name: "Thermodynamics", credits: 6, semester: 2 },
            { code: "LAB106", name: "Physics Laboratory", credits: 6, semester: 2 },
            { code: "PHY201", name: "Quantum Mechanics", credits: 6, semester: 3 },
            { code: "MAT202", name: "Mathematical Methods", credits: 6, semester: 3 },
            { code: "PHY203", name: "Solid State Physics", credits: 6, semester: 3 },
            { code: "PHY204", name: "Nuclear Physics", credits: 6, semester: 4 },
            { code: "PHY205", name: "Computational Physics", credits: 6, semester: 4 },
            { code: "ELE206", name: "Electives", credits: 6, semester: 4 },
            { code: "RSM301", name: "Research Methods", credits: 6, semester: 5 },
            { code: "THS399", name: "Bachelor Thesis", credits: 12, semester: 6 },
        ]
    },
    {
        courseTitle: "Master's in Applied Physics",
        courseSlug: "msc-applied-physics",
        deptSlug: "applied-physics",
        degreeLevel: "MASTER",
        duration: "2 Years",
        credits: 120,
        subjects: [
            { code: "PHY501", name: "Advanced Quantum Mechanics", credits: 6, semester: 1 },
            { code: "PHY502", name: "Advanced Electromagnetics", credits: 6, semester: 1 },
            { code: "PHY503", name: "Nanophysics", credits: 6, semester: 1 },
            { code: "PHY504", name: "Computational Modeling", credits: 6, semester: 2 },
            { code: "PHY505", name: "Materials Physics", credits: 6, semester: 2 },
            { code: "PHY506", name: "Experimental Techniques", credits: 6, semester: 2 },
            { code: "RSM601", name: "Research Methods", credits: 6, semester: 3 },
            { code: "ELE602", name: "Electives", credits: 12, semester: 3 },
            { code: "THS699", name: "Master Thesis", credits: 30, semester: 4 },
        ]
    },
    {
        courseTitle: "Bachelor's in Design",
        courseSlug: "bachelor-design",
        deptSlug: "design",
        degreeLevel: "BACHELOR",
        duration: "3 Years",
        credits: 180,
        subjects: [
            { code: "DES101", name: "Design Foundations", credits: 6, semester: 1 },
            { code: "HIS102", name: "Design History", credits: 6, semester: 1 },
            { code: "VIS103", name: "Visual Communication", credits: 6, semester: 1 },
            { code: "DES104", name: "Product Design Studio", credits: 8, semester: 2 },
            { code: "MAT105", name: "Materials and Processes", credits: 6, semester: 2 },
            { code: "DIG106", name: "Digital Tools for Design", credits: 6, semester: 2 },
            { code: "DES201", name: "User Centered Design", credits: 8, semester: 3 },
            { code: "TEC202", name: "Prototyping", credits: 6, semester: 3 },
            { code: "MKT203", name: "Design and Marketing", credits: 6, semester: 3 },
            { code: "DES204", name: "Service Design", credits: 8, semester: 4 },
            { code: "SUS205", name: "Sustainable Design", credits: 6, semester: 4 },
            { code: "ELE206", name: "Electives", credits: 6, semester: 4 },
            { code: "DES301", name: "Capstone Studio", credits: 12, semester: 5 },
            { code: "THS399", name: "Bachelor Thesis", credits: 12, semester: 6 },
        ]
    },
    {
        courseTitle: "Master's in Design",
        courseSlug: "master-design",
        deptSlug: "design",
        degreeLevel: "MASTER",
        duration: "2 Years",
        credits: 120,
        subjects: [
            { code: "DES501", name: "Advanced Design Studio", credits: 12, semester: 1 },
            { code: "DES502", name: "Strategic Design", credits: 6, semester: 1 },
            { code: "DES503", name: "Design Research", credits: 6, semester: 1 },
            { code: "DES504", name: "Design Futures", credits: 6, semester: 2 },
            { code: "DES505", name: "Sustainability and Ethics", credits: 6, semester: 2 },
            { code: "ELE506", name: "Electives", credits: 6, semester: 2 },
            { code: "RSM601", name: "Research Methods", credits: 6, semester: 3 },
            { code: "ELE602", name: "Electives", credits: 6, semester: 3 },
            { code: "THS699", name: "Master Thesis", credits: 30, semester: 4 },
        ]
    }
];

async function seed() {
    console.log('🚀 Seeding curriculum data...');

    // Get all depts to map
    const { data: depts } = await supabase.from('Department').select('id, slug, schoolId');
    if (!depts) return;
    const deptMap = Object.fromEntries(depts.map(d => [d.slug, d]));

    for (const data of curriculumData) {
        const dept = deptMap[data.deptSlug];
        if (!dept) {
            console.error(`❌ Dept not found: ${data.deptSlug}`);
            continue;
        }

        // 1. Upsert Course
        const coursePayload = {
            title: data.courseTitle,
            slug: data.courseSlug,
            degreeLevel: data.degreeLevel,
            duration: data.duration,
            credits: data.credits,
            departmentId: dept.id,
            schoolId: dept.schoolId,
            description: `A comprehensive program in ${data.courseTitle.replace("Bachelor's in ", "").replace("Master's in ", "")}.`,
            language: "English",
            sections: null // Reset dynamic sections to use Subject table
        };

        const { data: course, error: cErr } = await supabase
            .from('Course')
            .upsert(coursePayload, { onConflict: 'slug' })
            .select()
            .single();

        if (cErr) {
            console.error(`❌ Error upserting course ${data.courseSlug}:`, cErr.message);
            continue;
        }

        console.log(`✅ Course: ${data.courseTitle}`);

        // 2. Delete existing subjects to avoid duplicates (optional but cleaner for seed)
        await supabase.from('Subject').delete().eq('courseId', course.id);

        // 3. Insert Subjects
        const subjectsPayload = data.subjects.map(s => ({
            code: s.code,
            name: s.name,
            creditUnits: s.credits,
            semester: s.semester,
            courseId: course.id
        }));

        const { error: sErr } = await supabase.from('Subject').insert(subjectsPayload);
        if (sErr) {
            console.error(`❌ Error inserting subjects for ${data.courseSlug}:`, sErr.message);
        } else {
            console.log(`   - Seeded ${subjectsPayload.length} subjects.`);
        }
    }

    console.log('✨ Seeding complete!');
}

seed();
