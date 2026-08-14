
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

async function seedEconomics() {
    console.log('Seeding Economics Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'economics').single();
    if (!dept) {
        console.error('Department "economics" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'math-quant',
            title: 'Mathematics & Quantitative Foundations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Mathematics for Economists:</strong> Optimization and logic.</li>
                    <li><strong>Calculus I & II:</strong> Limits and derivatives.</li>
                    <li><strong>Linear Algebra:</strong> Matrix applications in economics.</li>
                    <li><strong>Probability & Statistics:</strong> Inference and hypothesis testing.</li>
                    <li><strong>Introductory Econometrics:</strong> Regression analysis basics.</li>
                </ul>
            `
        },
        {
            id: 'core-econ',
            title: 'Core Economics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Principles of Microeconomics:</strong> Supply, demand, and markets.</li>
                    <li><strong>Principles of Macroeconomics:</strong> GDP, inflation, and growth.</li>
                    <li><strong>Intermediate Microeconomics:</strong> Consumer theory and firms.</li>
                    <li><strong>Intermediate Macroeconomics:</strong> IS-LM and AD-AS models.</li>
                    <li><strong>Economic Theory:</strong> Advanced modeling.</li>
                    <li><strong>History of Economic Thought:</strong> Smith, Marx, Keynes, and beyond.</li>
                </ul>
            `
        },
        {
            id: 'econometrics',
            title: 'Econometrics & Data Analysis',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Econometrics I & II:</strong> Time series and cross-sectional data.</li>
                    <li><strong>Economic Data Analysis:</strong> Interpretation of economic indicators.</li>
                    <li><strong>Applied Statistics for Economics:</strong> Survey data and sampling.</li>
                </ul>
            `
        },
        {
            id: 'applied',
            title: 'Applied & Specialized Economics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Development Economics:</strong> Growth in developing nations.</li>
                    <li><strong>International Economics:</strong> Trade and exchange rates.</li>
                    <li><strong>Monetary Economics:</strong> Central banks and money supply.</li>
                    <li><strong>Public Finance:</strong> Taxation and government spending.</li>
                    <li><strong>Labor Economics:</strong> Wages and employment.</li>
                    <li><strong>Industrial Organization:</strong> Market structures and competition.</li>
                    <li><strong>Environmental & Resource Economics:</strong> Sustainability and policy.</li>
                    <li><strong>Health Economics (Intro):</strong> Economics of healthcare systems.</li>
                </ul>
            `
        },
        {
            id: 'finance-policy',
            title: 'Finance & Policy',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Money & Banking:</strong> Financial systems.</li>
                    <li><strong>Financial Economics:</strong> Asset pricing and risk.</li>
                    <li><strong>Economic Policy Analysis:</strong> Impact assessment.</li>
                    <li><strong>Fiscal & Monetary Policy:</strong> Stabilization strategies.</li>
                </ul>
            `
        },
        {
            id: 'interdisciplinary',
            title: 'Interdisciplinary & Electives',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Political Economy:</strong> Intersection of politics and economics.</li>
                    <li><strong>Behavioral Economics:</strong> Psychology in economic decisions.</li>
                    <li><strong>Game Theory (Intro):</strong> Strategic interaction.</li>
                    <li><strong>Economic Geography:</strong> Location and regional growth.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Professional Skills',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Economics:</strong> Study design.</li>
                    <li><strong>Academic & Policy Writing:</strong> Briefs and papers.</li>
                    <li><strong>Presentation & Communication Skills:</strong> Effective delivery.</li>
                    <li><strong>Internship / Industrial Training:</strong> Practical experience.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Independent research thesis.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Science in Economics',
        slug: 'bsc-economics',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A comprehensive program providing a strong foundation in economic theory, quantitative methods, and policy analysis.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-economics.jpg',
        careerPaths: 'Economist, Data Analyst, Policy Advisor, Financial Consultant'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-core',
            title: 'Advanced Core Theory',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Microeconomic Theory:</strong> General equilibrium and game theory.</li>
                    <li><strong>Advanced Macroeconomic Theory:</strong> Dynamic stochastic general equilibrium.</li>
                    <li><strong>Advanced Econometrics:</strong> Panel data and time series.</li>
                    <li><strong>Mathematical Economics:</strong> rigorous mathematical foundations.</li>
                </ul>
            `
        },
        {
            id: 'applied-policy',
            title: 'Applied & Policy Economics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Applied Econometrics:</strong> Causal inference.</li>
                    <li><strong>Economic Forecasting:</strong> Predictive modeling.</li>
                    <li><strong>Policy Evaluation & Impact Analysis:</strong> Assessing interventions.</li>
                    <li><strong>International Trade Theory:</strong> Models of trade.</li>
                    <li><strong>International Finance:</strong> Open economy macroeconomics.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Development & Public Economics</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Development Economics</li>
                    <li>Public Expenditure Analysis</li>
                    <li>Poverty & Inequality</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Financial & Monetary Economics</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Monetary Theory & Policy</li>
                    <li>Financial Markets & Institutions</li>
                    <li>Central Banking</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Labor & Industrial Economics</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Labor Market Analysis</li>
                    <li>Industrial Organization Theory</li>
                </ul>

                 <h4 class="font-bold mt-4 mb-2">Environmental & Resource Economics</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Climate Change Economics</li>
                    <li>Natural Resource Economics</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Behavioral & Experimental Economics</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Behavioral Economics</li>
                    <li>Experimental Economics</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods & Thesis Workshop:</strong> Proposal development.</li>
                    <li><strong>Graduate Seminar:</strong> Current research topics.</li>
                    <li><strong>Academic & Policy Writing:</strong> Professional dissemination.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Dissertation:</strong> Original research.</li>
                    <li><strong>Research or Policy Internship:</strong> Optional professional track.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Science in Economics',
        slug: 'msc-economics',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced degree focusing on rigorous economic analysis, econometric modeling, and specialization in fields like development, finance, or policy.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-economics.jpg',
        careerPaths: 'Senior Economist, Central Banker, Economic Consultant, Academic Researcher'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BSc Economics:', bErr);
    else console.log('✅ Successfully seeded "BSc Economics".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MSc Economics:', mErr);
    else console.log('✅ Successfully seeded "MSc Economics".');
}

seedEconomics();
