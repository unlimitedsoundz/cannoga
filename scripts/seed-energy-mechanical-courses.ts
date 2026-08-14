
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

async function seedEnergyMechanical() {
    console.log('Seeding Energy & Mechanical Engineering Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'energy-mechanical').single();
    if (!dept) {
        console.error('Department "energy-mechanical" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'foundations',
            title: 'Mathematics & Foundations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Calculus I, II, III:</strong> Analysis.</li>
                    <li><strong>Linear Algebra:</strong> Vectors.</li>
                    <li><strong>Differential Equations:</strong> Modeling.</li>
                    <li><strong>Probability & Statistics:</strong> Data.</li>
                    <li><strong>Engineering Physics:</strong> Fundamentals.</li>
                    <li><strong>Engineering Mechanics:</strong> Statics/Dynamics.</li>
                </ul>
            `
        },
        {
            id: 'core-mechanical',
            title: 'Core Mechanical Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Mechanics of Materials:</strong> Stress/Strain.</li>
                    <li><strong>Fluid Mechanics:</strong> Flow dynamics.</li>
                    <li><strong>Thermodynamics I & II:</strong> Energy cycles.</li>
                    <li><strong>Heat Transfer:</strong> Conduction/Convection/Radiation.</li>
                    <li><strong>Mechanical Design & Machine Elements:</strong> Component design.</li>
                    <li><strong>Manufacturing Processes:</strong> Production methods.</li>
                    <li><strong>Dynamics of Machines:</strong> Kinematics.</li>
                    <li><strong>Mechanical Measurements:</strong> Instrumentation.</li>
                </ul>
            `
        },
        {
            id: 'energy-power',
            title: 'Energy & Power Systems',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Energy Systems & Conversion:</strong> Transformation methods.</li>
                    <li><strong>Renewable Energy Technologies:</strong> Solar, Wind, Hydro.</li>
                    <li><strong>Power Plant Engineering:</strong> Generation.</li>
                    <li><strong>Energy Efficiency & Management:</strong> Conservation.</li>
                    <li><strong>Thermal Systems Design:</strong> Optimization.</li>
                </ul>
            `
        },
        {
            id: 'computing',
            title: 'Computing & Simulation',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>CAD:</strong> Computer-Aided Design.</li>
                    <li><strong>FEA:</strong> Finite Element Analysis.</li>
                    <li><strong>CFD (Intro):</strong> Fluid simulations.</li>
                    <li><strong>Simulation & Modeling:</strong> Systems.</li>
                </ul>
            `
        },
        {
            id: 'practical',
            title: 'Laboratory & Professional Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Labs:</strong> Thermodynamics, Fluids, Design, Materials, Energy.</li>
                    <li><strong>Industrial Training:</strong> Internship.</li>
                    <li><strong>Engineering Ethics & Safety:</strong> Professional conduct.</li>
                    <li><strong>Project Management:</strong> Planning.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Mechanical / Energy Systems Design Project.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Engineering in Mechanical and Energy Engineering',
        slug: 'beng-mechanical-energy',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A comprehensive program covering core mechanical principles and modern energy systems.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 240,
        imageUrl: '/images/departments/placeholder-energy-mechanical.jpg',
        careerPaths: 'Mechanical Engineer, Energy System Designer, Plant Engineer, Manufacturing Specialist'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-mechanical',
            title: 'Advanced Mechanical Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Thermodynamics:</strong> Exergy analysis.</li>
                    <li><strong>Advanced Fluid Mechanics & Heat Transfer:</strong> Complex flows.</li>
                    <li><strong>Advanced Mechanical Design:</strong> Fatigue and failure.</li>
                    <li><strong>Advanced Materials & Manufacturing:</strong> Composites/Additive.</li>
                    <li><strong>Dynamics & Control of Mechanical Systems:</strong> Advanced control.</li>
                </ul>
            `
        },
        {
            id: 'adv-energy',
            title: 'Advanced Energy Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Renewable & Sustainable Energy Systems:</strong> Deep dive.</li>
                    <li><strong>Power Generation & Energy Storage:</strong> Batteries/Hydrogen.</li>
                    <li><strong>Energy Efficiency & Management Strategies:</strong> Auditing.</li>
                    <li><strong>Advanced Thermal Systems:</strong> Simulation.</li>
                    <li><strong>Smart Grids & Energy Automation:</strong> Grid integration.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Mechanical Systems & Design</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced CAD & FEA</li>
                    <li>Robotics & Mechatronics</li>
                    <li>HVAC Systems Design</li>
                    <li>Vibration & Acoustics Analysis</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Energy & Sustainability</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Solar & Wind Energy Systems</li>
                    <li>Energy Management & Policy</li>
                    <li>Biomass & Alternative Energy</li>
                    <li>Thermal Energy Storage</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Control & Automation</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Industrial Automation</li>
                    <li>Advanced Control Systems</li>
                    <li>Mechatronic Systems Design</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods:</strong> Experimental design.</li>
                    <li><strong>Technical Writing & Communication:</strong> Publishing.</li>
                    <li><strong>Graduate Seminar:</strong> Talks.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Research Project:</strong> Major work.</li>
                    <li><strong>Industrial Internship:</strong> Practical experience.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Engineering in Mechanical and Energy Engineering',
        slug: 'meng-mechanical-energy',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced specialized degree for leadership in mechanical design and sustainable energy solutions.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-energy-mechanical.jpg',
        careerPaths: 'Senior Mechanical Engineer, Energy Consultant, R&D Engineer, Sustainability Manager'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting B.Eng Mechanical:', bErr);
    else console.log('✅ Successfully seeded "B.Eng Mechanical/Energy".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting M.Eng Mechanical:', mErr);
    else console.log('✅ Successfully seeded "M.Eng Mechanical/Energy".');
}

seedEnergyMechanical();
