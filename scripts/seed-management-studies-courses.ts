
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

async function seedManagement() {
    console.log('Seeding Management Studies Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'management').single();
    if (!dept) {
        console.error('Department "management" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'foundations',
            title: 'Foundations of Management',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Principles of Management:</strong> Fundamentals of leading.</li>
                    <li><strong>Organizational Behavior:</strong> Psychology in business.</li>
                    <li><strong>Business Communication:</strong> Effective messaging.</li>
                    <li><strong>Business Ethics & Corporate Governance:</strong> Moral frameworks.</li>
                    <li><strong>Business Law:</strong> Legal environment.</li>
                </ul>
            `
        },
        {
            id: 'quant-skills',
            title: 'Business & Quantitative Skills',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Business Mathematics:</strong> Calculations for decision making.</li>
                    <li><strong>Statistics for Management:</strong> Data analysis.</li>
                    <li><strong>Financial Accounting:</strong> Basics of recording.</li>
                    <li><strong>Managerial Accounting:</strong> Internal reporting.</li>
                    <li><strong>Economics (Micro & Macro):</strong> Market forces.</li>
                </ul>
            `
        },
        {
            id: 'core-mgmt',
            title: 'Core Management Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Human Resource Management:</strong> People strategy.</li>
                    <li><strong>Operations Management:</strong> Production efficiency.</li>
                    <li><strong>Marketing Management:</strong> Customer value.</li>
                    <li><strong>Financial Management:</strong> Capital management.</li>
                    <li><strong>Strategic Management:</strong> Long-term planning.</li>
                    <li><strong>Entrepreneurship & Innovation:</strong> New ventures.</li>
                </ul>
            `
        },
        {
            id: 'tech-info',
            title: 'Technology & Information Systems',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Introduction to Information Systems:</strong> IT basics.</li>
                    <li><strong>Management Information Systems (MIS):</strong> Systems for managers.</li>
                    <li><strong>Business Analytics (Intro):</strong> Data insights.</li>
                    <li><strong>Digital Business Tools:</strong> Excel, ERP basics.</li>
                </ul>
            `
        },
        {
            id: 'specialized',
            title: 'Specialized & Elective Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Project Management:</strong> Scope and time.</li>
                    <li><strong>International Business:</strong> Global trade.</li>
                    <li><strong>Organizational Change & Development:</strong> Managing transition.</li>
                    <li><strong>Supply Chain Management:</strong> Logistics.</li>
                    <li><strong>Leadership & Team Management:</strong> Motivating teams.</li>
                </ul>
            `
        },
        {
            id: 'practical',
            title: 'Practical Experience',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Case Studies & Simulations:</strong> Applied learning.</li>
                    <li><strong>Internship / Industrial Training:</strong> Industry exposure.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Research in Management.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Science in Management Studies',
        slug: 'bsc-management-studies',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A holistic degree focused on building strong leadership, strategic thinking, and operational expertise.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-management.jpg',
        careerPaths: 'Management Consultant, HR Manager, Operations Manager, Business Development Executive'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-core',
            title: 'Advanced Core Management',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Strategic Management:</strong> Corporate strategy.</li>
                    <li><strong>Advanced Human Resource Management:</strong> Talent strategy.</li>
                    <li><strong>Corporate Governance & Ethics:</strong> Boardroom dynamics.</li>
                    <li><strong>Managerial Decision-Making:</strong> Analytical frameworks.</li>
                    <li><strong>Leadership & Organizational Behavior:</strong> Leading change.</li>
                </ul>
            `
        },
        {
            id: 'finance-ops',
            title: 'Finance, Marketing & Operations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Financial Management:</strong> Corporate finance.</li>
                    <li><strong>Marketing Strategy & Consumer Behavior:</strong> Market psychology.</li>
                    <li><strong>Operations & Supply Chain Strategy:</strong> Global operations.</li>
                    <li><strong>Project & Program Management:</strong> Portfolio management.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Business Strategy & Leadership</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Strategic Innovation & Change</li>
                    <li>Corporate Strategy & Policy</li>
                    <li>Leadership Development</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Finance & Accounting</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Corporate Finance</li>
                    <li>Risk Management & Financial Planning</li>
                    <li>Financial Analytics</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Operations & Technology Management</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Operations Management</li>
                    <li>Technology & Innovation Management</li>
                    <li>Digital Transformation & Analytics</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Entrepreneurship & International Business</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Entrepreneurship & Business Growth</li>
                    <li>International Business Management</li>
                    <li>Global Business Strategy</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Management:</strong> Qualitative/Quantitative.</li>
                    <li><strong>Case Studies & Industry Analysis:</strong> Sector deep dives.</li>
                    <li><strong>Professional Communication & Leadership:</strong> Executive presence.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis:</strong> Academic research.</li>
                    <li><strong>Applied Business Project:</strong> Strategic consulting project.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Science in Management Studies',
        slug: 'msc-management-studies',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced leadership program designed to cultivate strategic vision and executive management skills.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-management.jpg',
        careerPaths: 'CEO/COO, Management Consultant, Strategy Director, HR Director'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BSc Management:', bErr);
    else console.log('✅ Successfully seeded "BSc Management".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MSc Management:', mErr);
    else console.log('✅ Successfully seeded "MSc Management".');
}

seedManagement();
