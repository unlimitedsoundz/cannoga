
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

async function seedMathSystems() {
    console.log('Seeding Mathematics & Systems Analysis Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'math-systems').single();
    if (!dept) {
        console.error('Department "math-systems" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'core-math',
            title: 'Core Mathematics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Calculus I, II, III:</strong> Foundations of analysis.</li>
                    <li><strong>Linear Algebra:</strong> Vector spaces and matrices.</li>
                    <li><strong>Differential Equations:</strong> Modeling change.</li>
                    <li><strong>Discrete Mathematics:</strong> Algorithm basics.</li>
                    <li><strong>Probability & Statistics:</strong> Data foundations.</li>
                    <li><strong>Numerical Analysis:</strong> Approximation methods.</li>
                    <li><strong>Real Analysis:</strong> Rigorous calculus.</li>
                    <li><strong>Complex Analysis:</strong> Complex numbers.</li>
                </ul>
            `
        },
        {
            id: 'systems-comp',
            title: 'Systems & Computational Foundations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Introduction to Systems Analysis:</strong> Systems thinking.</li>
                    <li><strong>Operations Research I:</strong> Optimization basics.</li>
                    <li><strong>Mathematical Modeling:</strong> Abstracting reality.</li>
                    <li><strong>Optimization Methods:</strong> Linear/Nonlinear.</li>
                    <li><strong>Computer Programming for Mathematicians:</strong> Python / MATLAB.</li>
                    <li><strong>Simulation & Computational Techniques:</strong> Virtual experiments.</li>
                </ul>
            `
        },
        {
            id: 'applied-analysis',
            title: 'Applied Mathematics & Analysis',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Applied Linear & Nonlinear Systems:</strong> Dynamics.</li>
                    <li><strong>Dynamical Systems:</strong> Chaos and stability.</li>
                    <li><strong>Control Theory (Intro):</strong> Feedback loops.</li>
                    <li><strong>Stochastic Processes:</strong> Random systems.</li>
                    <li><strong>Time Series Analysis:</strong> Temporal data.</li>
                    <li><strong>Network Analysis & Modeling:</strong> Connectivity.</li>
                </ul>
            `
        },
        {
            id: 'electives',
            title: 'Interdisciplinary & Electives',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Mathematical Logic:</strong> Reasoning.</li>
                    <li><strong>Graph Theory & Combinatorics:</strong> Discrete structures.</li>
                    <li><strong>Data Analysis & Visualization:</strong> Communicating data.</li>
                    <li><strong>Mathematical Methods in Economics / Engineering:</strong> Cross-domain applications.</li>
                </ul>
            `
        },
        {
            id: 'practical',
            title: 'Practical & Professional Experience',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Laboratory / Computational Lab:</strong> Hands-on coding.</li>
                    <li><strong>Case Studies & Simulations:</strong> Applied problems.</li>
                    <li><strong>Internship / Industrial Training:</strong> Work placement.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Mathematical Modeling Project.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Science in Mathematics and Systems Analysis',
        slug: 'bsc-math-systems',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A rigorous program combining pure mathematics with computational systems analysis to solve complex problems.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-math-systems.jpg',
        careerPaths: 'Data Scientist, Systems Analyst, Risk Model analyst, Operations Researcher'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-core',
            title: 'Advanced Core Mathematics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Linear Algebra:</strong> Theoretical depth.</li>
                    <li><strong>Advanced Differential Equations:</strong> PDEs.</li>
                    <li><strong>Functional Analysis:</strong> Spaces of functions.</li>
                    <li><strong>Optimization & Nonlinear Programming:</strong> Advanced techniques.</li>
                    <li><strong>Advanced Probability & Stochastic Processes:</strong> Measure theory.</li>
                </ul>
            `
        },
        {
            id: 'systems-analytical',
            title: 'Systems & Analytical Methods',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Systems Analysis & Modeling:</strong> Complex systems.</li>
                    <li><strong>Control Systems & Optimization:</strong> Optimal control.</li>
                    <li><strong>Simulation & Computational Modeling:</strong> Monte Carlo etc.</li>
                    <li><strong>Network & Queueing Theory:</strong> Traffic flow.</li>
                    <li><strong>Applied Dynamical Systems:</strong> Bifurcations.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Applied Mathematics</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Mathematical Modeling in Engineering</li>
                    <li>Mathematical Methods in Finance / Economics</li>
                    <li>Computational Mathematics</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Systems Analysis & Optimization</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Decision Support Systems</li>
                    <li>Operations Research II (Advanced)</li>
                    <li>Systems Simulation & Performance Analysis</li>
                    <li>Optimization in Networks & Logistics</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Data & Computational Analysis</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Big Data Analytics & Modeling</li>
                    <li>Machine Learning for Systems Analysis</li>
                    <li>Predictive Analytics & Forecasting</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods:</strong> Methodology.</li>
                    <li><strong>Scientific Writing & Communication:</strong> Publishing papers.</li>
                    <li><strong>Graduate Seminar:</strong> Current research.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Research Project:</strong> Major contribution.</li>
                    <li><strong>Industrial or Applied Project:</strong> Practical application.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Science in Mathematics and Systems Analysis',
        slug: 'msc-math-systems',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced degree focusing on mathematical theory and its application to complex systems, optimization, and data analysis.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-math-systems.jpg',
        careerPaths: 'Quantitative Analyst, Research Scientist, Algorithm Engineer, Systems Architect'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BSc Math:', bErr);
    else console.log('✅ Successfully seeded "BSc Math & Systems".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MSc Math:', mErr);
    else console.log('✅ Successfully seeded "MSc Math & Systems".');
}

seedMathSystems();
