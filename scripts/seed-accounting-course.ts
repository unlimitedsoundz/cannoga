
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedAccounting() {
    console.log('Seeding Accounting Course...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'accounting-business-law').single();
    if (!dept) {
        console.error('Department accounting-business-law not found');
        return;
    }

    const sections = [
        {
            id: 'description',
            title: 'Description',
            content: `<p>The Accounting & Finance BSc program at Penkka University provides a solid foundation in accounting, finance, and management. Students gain practical and theoretical knowledge in financial accounting, management accounting, corporate governance, auditing, performance management, and financial decision-making.</p><p>The program equips students with analytical skills and business understanding necessary for careers in accounting, finance, and corporate administration.</p>`
        },
        {
            id: 'language',
            title: 'Language of Instruction',
            content: `<p>English (all courses)</p><p>The program is designed to prepare students for careers in international business environments.</p>`
        },
        {
            id: 'tuition',
            title: 'Tuition Fees and Scholarships',
            content: `<p>Tuition Fee: Included in degree tuition for full-time BSc students</p><p>Scholarships:</p><ul><li>Merit-based scholarships for high-achieving students</li><li>Need-based financial aid</li><li>Support for international students</li><li>Detailed scholarship information is available on the Penkka University Scholarships page.</li></ul>`
        },
        {
            id: 'structure',
            title: 'Structure of Studies',
            content: `<p>This is the structure content with Penkka University.</p>`
        },
        {
            id: 'specialisations',
            title: 'Specialisations',
            content: `<p>Specialisations content.</p>`
        },
        {
            id: 'internationalisation',
            title: 'Internationalisation',
            content: `<p>Internationalisation content.</p>`
        },
        {
            id: 'opportunities',
            title: 'Further Study Opportunities',
            content: `<p>Further study opportunities.</p>`
        },
        {
            id: 'careers',
            title: 'Career Opportunities',
            content: `<p>Career opportunities content.</p>`
        },
        {
            id: 'research',
            title: 'Research Focus',
            content: `<p>Research focus content.</p>`
        },
        {
            id: 'cooperation',
            title: 'Co-operation with Other Parties',
            content: `<p>Co-operation content.</p>`
        },
        {
            id: 'evaluation',
            title: 'Study-Option-Specific Evaluation Criteria in Admissions',
            content: `<p>Evaluation criteria content.</p>`
        }
    ];

    const courseData = {
        title: 'BSc Accounting & Finance',
        slug: 'accounting-and-finance-bsc',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'The Accounting & Finance BSc program at Penkka University provides a solid foundation in accounting, finance, and management. Students gain practical and theoretical knowledge in financial accounting, management accounting, corporate governance, auditing, performance management, and financial decision-making. The program equips students with analytical skills and business understanding necessary for careers in accounting, finance, and corporate administration.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: sections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-accounting.jpg' // Reusing dept image as placeholder
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-accounting',
            title: 'Advanced Accounting',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Financial Accounting:</strong> Complex consolidation and reporting.</li>
                    <li><strong>Advanced Management Accounting:</strong> Strategic decision support.</li>
                    <li><strong>International Financial Reporting Standards (IFRS):</strong> Global standards application.</li>
                    <li><strong>Forensic Accounting & Auditing:</strong> Fraud detection and investigation.</li>
                    <li><strong>Corporate Financial Reporting & Analysis:</strong> Financial health assessment.</li>
                    <li><strong>Accounting Information Systems:</strong> Advanced system design and control.</li>
                </ul>
            `
        },
        {
            id: 'business-law-gov',
            title: 'Business Law & Corporate Governance',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Business & Corporate Law:</strong> Advanced legal frameworks.</li>
                    <li><strong>Commercial Law & Contracts:</strong> Complex commercial agreements.</li>
                    <li><strong>Corporate Governance & Compliance:</strong> Regulatory adherence and board responsibilities.</li>
                    <li><strong>Employment & Labor Law:</strong> Workforce regulations.</li>
                    <li><strong>Intellectual Property Law:</strong> Patents, trademarks, and copyrights.</li>
                    <li><strong>International Business Law:</strong> Cross-border legal issues.</li>
                </ul>
            `
        },
        {
            id: 'finance-strategy',
            title: 'Finance & Strategic Management',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Corporate Finance & Risk Management:</strong> Financial strategy and hedging.</li>
                    <li><strong>Taxation & Tax Planning:</strong> Strategic tax minimization.</li>
                    <li><strong>Financial Statement Analysis & Valuation:</strong> Business valuation techniques.</li>
                    <li><strong>Strategic Management for Accountants:</strong> Integrating finance with strategy.</li>
                    <li><strong>Business Ethics & Regulatory Compliance:</strong> Ethical decision making.</li>
                </ul>
            `
        },
        {
            id: 'tech-data',
            title: 'Technology & Data in Accounting',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Accounting Information Systems (AIS):</strong> Deep dive into ERPs.</li>
                    <li><strong>Financial Modelling & Data Analytics:</strong> Predictive analysis.</li>
                    <li><strong>Digital Finance & E-Accounting:</strong> Cloud accounting and fintech.</li>
                    <li><strong>Auditing with Technology:</strong> CAATs and digital audit trails.</li>
                </ul>
            `
        },
        {
            id: 'electives',
            title: 'Specialization & Elective Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li>Mergers & Acquisitions Accounting</li>
                    <li>International Taxation</li>
                    <li>Corporate Law & Governance</li>
                    <li>Business Risk & Forensic Investigation</li>
                    <li>Advanced Auditing Techniques</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Accounting & Business Law:</strong> Academic and applied research.</li>
                    <li><strong>Professional Writing & Reporting:</strong> Communication for executives.</li>
                    <li><strong>Case Studies & Industry Analysis:</strong> Real-world problem solving.</li>
                    <li><strong>Graduate Seminar:</strong> Contemporary issues.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Applied Research Project:</strong> Independent study.</li>
                    <li><strong>Professional Internship (optional):</strong> Industry placement.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Science in Accounting & Business Law',
        slug: 'msc-accounting-business-law',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced program blending strategic financial management with in-depth legal expertise for higher-level corporate and advisory roles.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-accounting.jpg',
        careerPaths: 'Chartered Accountant, Corporate Legal Advisor, Financial Controller, Compliance Officer, Tax Consultant'
    };

    const { error: bErr } = await supabase.from('Course').upsert(courseData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BSc:', bErr);
    else console.log('✅ Successfully seeded "BSc Accounting & Business Law".');

    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MSc:', mErr);
    else console.log('✅ Successfully seeded "MSc Accounting & Business Law".');
}

seedAccounting();
