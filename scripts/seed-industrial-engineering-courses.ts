
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedIndustrial() {
    console.log('Seeding Industrial Engineering & Management Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'industrial-engineering').single();
    if (!dept) {
        console.error('Department "industrial-engineering" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'math-quant',
            title: 'Mathematics & Quantitative Foundations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Calculus I & II:</strong> Fundamentals of change and accumulation.</li>
                    <li><strong>Linear Algebra:</strong> Systems of equations.</li>
                    <li><strong>Probability & Statistics:</strong> Data distribution for engineers.</li>
                    <li><strong>Operations Research I:</strong> Optimization basics.</li>
                    <li><strong>Engineering Economics:</strong> Cost-benefit analysis.</li>
                </ul>
            `
        },
        {
            id: 'core-ie',
            title: 'Core Industrial Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Introduction to Industrial Engineering:</strong> Systems thinking.</li>
                    <li><strong>Work Study & Ergonomics:</strong> Efficiency and human factors.</li>
                    <li><strong>Production Planning & Control:</strong> Scheduling and flow.</li>
                    <li><strong>Manufacturing Processes & Systems:</strong> Fabrication methods.</li>
                    <li><strong>Quality Control & Management:</strong> Statistical quality assurance.</li>
                    <li><strong>Supply Chain Management:</strong> Logistics networks.</li>
                    <li><strong>Facility Layout & Design:</strong> Space optimization.</li>
                    <li><strong>Industrial Safety & Risk Management:</strong> Workplace safety.</li>
                </ul>
            `
        },
        {
            id: 'computing',
            title: 'Computing & Analytical Tools',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Engineering Software:</strong> AutoCAD / SolidWorks.</li>
                    <li><strong>Industrial Simulation & Modeling:</strong> Process simulation.</li>
                    <li><strong>Database & Data Analytics:</strong> Information management.</li>
                    <li><strong>Excel / Python:</strong> Tools for analysis.</li>
                </ul>
            `
        },
        {
            id: 'management',
            title: 'Management & Business Fundamentals',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Principles of Management:</strong> Organizational theory.</li>
                    <li><strong>Project Management:</strong> Planning and execution.</li>
                    <li><strong>Operations Management:</strong> Efficient resource use.</li>
                    <li><strong>Organizational Behavior:</strong> Team dynamics.</li>
                    <li><strong>Business Communication & Ethics:</strong> Professional conduct.</li>
                    <li><strong>Financial Accounting (Intro):</strong> Basics of finance.</li>
                </ul>
            `
        },
        {
            id: 'optimization',
            title: 'Optimization & Decision-Making',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Linear Programming & Optimization:</strong> Maximizing utility.</li>
                    <li><strong>Inventory Management:</strong> Stock control strategies.</li>
                    <li><strong>Forecasting & Demand Planning:</strong> Predicting future needs.</li>
                    <li><strong>Decision Analysis:</strong> Making choices under uncertainty.</li>
                </ul>
            `
        },
        {
            id: 'labs',
            title: 'Laboratory & Practical Work',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Industrial Engineering Lab:</strong> Practical experiments.</li>
                    <li><strong>Simulation & Production Lab:</strong> Virtual testing.</li>
                    <li><strong>Work Measurement & Ergonomics Lab:</strong> Time and motion studies.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Professional Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Internship / Industrial Training:</strong> Real-world experience.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Process Improvement / Production Optimization.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Engineering in Industrial Engineering and Management',
        slug: 'beng-industrial-engineering',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A multidisciplinary program blending engineering technology with business management to optimize complex systems and processes.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 240,
        imageUrl: '/images/departments/placeholder-industrial-engineering.jpg',
        careerPaths: 'Industrial Engineer, Production Manager, Supply Chain Analyst, Quality Engineer'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-ie',
            title: 'Advanced Industrial Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Production & Operations Management:</strong> Strategic operations.</li>
                    <li><strong>Advanced Quality & Reliability Engineering:</strong> Six Sigma and reliability.</li>
                    <li><strong>Advanced Supply Chain Management:</strong> Global logistics.</li>
                    <li><strong>Lean Manufacturing & Six Sigma:</strong> Waste reduction.</li>
                    <li><strong>Advanced Work Design & Ergonomics:</strong> Human-centric design.</li>
                </ul>
            `
        },
        {
            id: 'mgmt-sci',
            title: 'Management & Decision Sciences',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Project Management:</strong> Complex projects.</li>
                    <li><strong>Operations Research II:</strong> Stochastic models.</li>
                    <li><strong>Decision Analysis & Risk Management:</strong> Quantitative risk.</li>
                    <li><strong>Strategic Management:</strong> Corporate strategy.</li>
                    <li><strong>Innovation & Technology Management:</strong> R&D strategy.</li>
                </ul>
            `
        },
        {
            id: 'computational',
            title: 'Computational & Analytical Tools',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Industrial Systems Simulation:</strong> System dynamics.</li>
                    <li><strong>Data Analytics & Big Data:</strong> Data-driven insights.</li>
                    <li><strong>Optimization Techniques (Advanced):</strong> Heuristics and metaheuristics.</li>
                    <li><strong>Industrial IoT & Smart Manufacturing:</strong> Industry 4.0 applications.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Production & Operations</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Lean Production Systems</li>
                    <li>Production Systems Design</li>
                    <li>Advanced Inventory & Logistics Management</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Human Factors & Ergonomics</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Ergonomics & Human-Centered Design</li>
                    <li>Occupational Health & Safety Engineering</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Supply Chain & Logistics</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Supply Chain Strategy</li>
                    <li>Logistics & Transportation Systems</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Management & Strategy</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Organizational Change & Development</li>
                    <li>Entrepreneurship & Innovation Management</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Industrial Engineering:</strong> Experimental design.</li>
                    <li><strong>Graduate Seminar & Case Studies:</strong> Best practices.</li>
                    <li><strong>Professional Ethics & Leadership:</strong> Responsible management.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Research Project:</strong> Independent study.</li>
                    <li><strong>Industrial Internship:</strong> Applied research project.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Engineering in Industrial Engineering and Management',
        slug: 'meng-industrial-engineering',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An expert program focusing on advanced operations research, smart manufacturing, and strategic technology management.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-industrial-engineering.jpg',
        careerPaths: 'Operations Director, Supply Chain Manager, Process Improvement Consultant, Plant Manager'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting B.Eng Industrial:', bErr);
    else console.log('✅ Successfully seeded "B.Eng Industrial Engineering".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting M.Eng Industrial:', mErr);
    else console.log('✅ Successfully seeded "M.Eng Industrial Engineering".');
}

seedIndustrial();
