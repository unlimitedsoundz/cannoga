
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

async function seedFinance() {
    console.log('Seeding Finance Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'finance').single();
    if (!dept) {
        console.error('Department "finance" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'math-quant',
            title: 'Mathematics & Quantitative Skills',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Business Mathematics:</strong> Algebra and calculus applications.</li>
                    <li><strong>Calculus for Economists:</strong> Derivatives and integrals.</li>
                    <li><strong>Probability & Statistics:</strong> Data analysis fundamentals.</li>
                    <li><strong>Quantitative Methods for Finance:</strong> Time value of money.</li>
                    <li><strong>Financial Modeling (Intro):</strong> Excel-based modeling.</li>
                </ul>
            `
        },
        {
            id: 'core-finance',
            title: 'Core Finance Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Principles of Finance:</strong> Introduction to markets and valuation.</li>
                    <li><strong>Corporate Finance:</strong> Capital structure and budgeting.</li>
                    <li><strong>Investment Analysis:</strong> Equity and bond valuation.</li>
                    <li><strong>Financial Accounting & Reporting:</strong> Analyzing statements.</li>
                    <li><strong>Managerial Accounting:</strong> Cost analysis for decisions.</li>
                    <li><strong>Financial Statement Analysis:</strong> Ratio analysis and health checks.</li>
                </ul>
            `
        },
        {
            id: 'markets',
            title: 'Financial Markets & Institutions',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Money & Banking:</strong> Central banks and monetary theory.</li>
                    <li><strong>Capital Markets & Securities:</strong> Trading and exchanges.</li>
                    <li><strong>International Finance:</strong> FX and global markets.</li>
                    <li><strong>Financial Institutions & Regulation:</strong> Banking laws and compliance.</li>
                    <li><strong>Derivatives & Risk Management (Intro):</strong> Options and futures.</li>
                </ul>
            `
        },
        {
            id: 'computing',
            title: 'Computing & Analytical Tools',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Excel for Finance:</strong> Advanced functions and macros.</li>
                    <li><strong>Financial Software Applications:</strong> Bloomberg and Reuters.</li>
                    <li><strong>Database & Data Analysis:</strong> SQL basics for finance.</li>
                </ul>
            `
        },
        {
            id: 'applied',
            title: 'Applied & Specialized Finance',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Portfolio Management:</strong> Asset allocation strategies.</li>
                    <li><strong>Asset Pricing & Valuation:</strong> Determining fair value.</li>
                    <li><strong>Corporate Risk Management:</strong> Hedging strategies.</li>
                    <li><strong>Personal Finance & Wealth Management:</strong> Financial planning.</li>
                    <li><strong>Behavioral Finance (Intro):</strong> Psychology of investing.</li>
                </ul>
            `
        },
        {
            id: 'foundations',
            title: 'Business & Economics Foundations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Microeconomics & Macroeconomics:</strong> Economic drivers.</li>
                    <li><strong>Business Law & Ethics:</strong> Corporate governance.</li>
                    <li><strong>Business Communication:</strong> Professional reporting.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Professional Experience',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Internship / Industrial Training:</strong> Workplace immersion.</li>
                    <li><strong>Case Studies & Financial Projects:</strong> Real-world scenarios.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Comprehensive research or analysis.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Science in Finance',
        slug: 'bsc-finance',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A rigorous program designed to provide a deep understanding of financial systems, investment analysis, and corporate financial management.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-finance.jpg',
        careerPaths: 'Financial Analyst, Investment Banker, Wealth Manager, Risk Analyst'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-core',
            title: 'Advanced Core Finance',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Corporate Finance:</strong> Strategic financing decisions.</li>
                    <li><strong>Advanced Investment Analysis:</strong> Complex asset valuation.</li>
                    <li><strong>Financial Econometrics:</strong> Statistical methods for finance.</li>
                    <li><strong>Advanced Portfolio Theory:</strong> Modern portfolio optimization.</li>
                    <li><strong>Risk Management & Derivatives:</strong> Advanced hedging techniques.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Corporate & Investment Finance</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Mergers & Acquisitions</li>
                    <li>Venture Capital & Private Equity</li>
                    <li>Corporate Financial Strategy</li>
                    <li>Capital Budgeting</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Financial Markets & Banking</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>International Financial Management</li>
                    <li>Banking Operations & Regulations</li>
                    <li>Fixed Income Securities</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Quantitative & Computational Finance</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Financial Engineering</li>
                    <li>Quantitative Risk Modeling</li>
                    <li>Algorithmic Trading & Financial Computing</li>
                    <li>Big Data Analytics for Finance</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Behavioral & Sustainable Finance</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Behavioral Finance</li>
                    <li>ESG Investing</li>
                    <li>Sustainable Finance</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Finance:</strong> Academic inquiry.</li>
                    <li><strong>Financial Case Studies:</strong> Strategic analysis.</li>
                    <li><strong>Graduate Seminar:</strong> Contemporary issues.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Research Project:</strong> Original contribution.</li>
                    <li><strong>Internship / Industry Collaboration:</strong> Optional professional track.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Science in Finance',
        slug: 'msc-finance',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced degree for future financial leaders, offering deep dives into quantitative finance, investment strategy, and global markets.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-finance.jpg',
        careerPaths: 'Portfolio Manager, CFO, Quant Analyst, Investment Fund Manager'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BSc Finance:', bErr);
    else console.log('✅ Successfully seeded "BSc Finance".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MSc Finance:', mErr);
    else console.log('✅ Successfully seeded "MSc Finance".');
}

seedFinance();
