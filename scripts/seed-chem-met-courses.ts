
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

async function seedChemMet() {
    console.log('Seeding Chemical & Metallurgical Engineering Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'chemical-metallurgical').single();
    if (!dept) {
        console.error('Department "chemical-metallurgical" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'math',
            title: 'Engineering Mathematics & Basics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Engineering Mathematics I, II, III:</strong> Calculus, analysis, and transforms.</li>
                    <li><strong>Linear Algebra:</strong> Matrices and vector spaces.</li>
                    <li><strong>Differential Equations:</strong> ODEs and PDEs for engineering systems.</li>
                    <li><strong>Probability & Engineering Statistics:</strong> Data analysis and quality control basics.</li>
                    <li><strong>Numerical Methods:</strong> Computational solutions to mathematical problems.</li>
                </ul>
            `
        },
        {
            id: 'core-chem',
            title: 'Core Chemical Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Material & Energy Balances:</strong> Conservation laws in process systems.</li>
                    <li><strong>Chemical Engineering Thermodynamics I & II:</strong> Phase equilibria and reaction energetics.</li>
                    <li><strong>Fluid Mechanics:</strong> Flow of fluids in pipes and equipment.</li>
                    <li><strong>Heat Transfer:</strong> Conduction, convection, and radiation.</li>
                    <li><strong>Mass Transfer:</strong> Diffusion and interphase transfer.</li>
                    <li><strong>Chemical Reaction Engineering (Kinetics):</strong> Reactor design and catalysis.</li>
                    <li><strong>Separation Processes:</strong> Distillation, absorption, and extraction.</li>
                    <li><strong>Process Control:</strong> Dynamics and control of chemical processes.</li>
                    <li><strong>Process Design & Economics:</strong> Plant design fundamentals.</li>
                </ul>
            `
        },
        {
            id: 'core-met',
            title: 'Metallurgical Engineering Core',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Physical Metallurgy:</strong> Structure-property relationships in metals.</li>
                    <li><strong>Extractive Metallurgy:</strong> Mineral Processing, Pyrometallurgy, Hydrometallurgy, Electrometallurgy.</li>
                    <li><strong>Phase Diagrams & Transformations:</strong> Alloy systems and kinetics.</li>
                    <li><strong>Iron & Steel Making:</strong> Blast furnace and steelmaking processes.</li>
                    <li><strong>Non-Ferrous Metallurgy:</strong> Aluminum, copper, and precious metals.</li>
                </ul>
            `
        },
        {
            id: 'materials',
            title: 'Materials & Applied Science',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Materials Science & Engineering:</strong> Fundamentals of all material classes.</li>
                    <li><strong>Solid State Chemistry:</strong> Crystal chemistry and bonding.</li>
                    <li><strong>Corrosion Engineering:</strong> Degradation and protection of materials.</li>
                    <li><strong>Surface Engineering:</strong> Coatings and surface modifications.</li>
                    <li><strong>Ceramic & Composite Materials:</strong> Advanced material systems.</li>
                </ul>
            `
        },
        {
            id: 'lab',
            title: 'Laboratory & Practical Work',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Chemical Engineering Laboratory I & II:</strong> Unit operations experiments.</li>
                    <li><strong>Metallurgical Laboratory I & II:</strong> Casting, welding, and microscopy.</li>
                    <li><strong>Mineral Processing Lab:</strong> Comminution and separation.</li>
                    <li><strong>Materials Characterization Lab:</strong> SEM, XRD, and mechanical testing.</li>
                    <li><strong>Instrumentation & Measurements:</strong> Process sensors and analytics.</li>
                </ul>
            `
        },
        {
            id: 'computing',
            title: 'Computing & Design',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Computer Programming for Engineers:</strong> Algorithmic problem solving.</li>
                    <li><strong>Process Simulation:</strong> ASPEN / HYSYS (Intro).</li>
                    <li><strong>CAD for Engineers:</strong> 2D/3D modeling.</li>
                </ul>
            `
        },
        {
            id: 'industrial',
            title: 'Industrial & Professional Studies',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Engineering Economics:</strong> Cost analysis and project evaluation.</li>
                    <li><strong>Industrial Safety & Risk Analysis:</strong> HAZOP and safety protocols.</li>
                    <li><strong>Environmental Engineering:</strong> Pollution control and sustainability.</li>
                    <li><strong>Engineering Ethics:</strong> Professional conduct.</li>
                    <li><strong>Industrial Training:</strong> Internship / SIWES.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Major design or research project (Chemical or Metallurgical focus).</li>
                    <li><strong>Plant Design Project:</strong> Comprehensive design of an industrial facility.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Engineering in Chemical and Metallurgical Engineering',
        slug: 'beng-chem-met',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'An integrated program covering the processing of raw materials into useful products, combining chemical process engineering with the science of metals and materials.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 240,
        imageUrl: '/images/departments/placeholder-chemical-metallurgical.jpg',
        careerPaths: 'Chemical & Process Industries, Oil & Gas, Mining & Mineral Processing, Iron & Steel Plants, Materials & Manufacturing Industries'
    };

    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-chemical',
            title: 'Advanced Chemical Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Chemical Thermodynamics:</strong> Molecular thermodynamics.</li>
                    <li><strong>Advanced Transport Phenomena:</strong> Momentum, heat, and mass transfer.</li>
                    <li><strong>Advanced Reaction Engineering:</strong> Non-ideal reactors and catalysis.</li>
                    <li><strong>Advanced Separation Processes:</strong> Membrane science and chromatography.</li>
                    <li><strong>Process Optimization & Control:</strong> Advanced control strategies.</li>
                </ul>
            `
        },
        {
            id: 'adv-met',
            title: 'Advanced Metallurgical Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Physical Metallurgy:</strong> Microstructural control.</li>
                    <li><strong>Advanced Extractive Metallurgy:</strong> Novel extraction techniques.</li>
                    <li><strong>Advanced Mineral Processing:</strong> Flotation and comminution modeling.</li>
                    <li><strong>Metallurgical Process Design:</strong> Integrated plant design.</li>
                    <li><strong>High-Temperature Processes:</strong> Thermodynamics of smelters and kilns.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Materials & Metallurgy</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Nanomaterials & Nanometallurgy</li>
                    <li>Advanced Materials Characterization</li>
                    <li>Failure Analysis</li>
                    <li>Corrosion & Protection Engineering</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Energy & Sustainability</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Energy Engineering</li>
                    <li>Metallurgy for Renewable Energy Systems</li>
                    <li>Waste Recycling & Resource Recovery</li>
                    <li>Sustainable Process Engineering</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Process & Manufacturing</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Advanced Manufacturing Processes</li>
                    <li>Powder Metallurgy</li>
                    <li>Additive Manufacturing (Metals)</li>
                    <li>Quality Control & Six Sigma</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Engineering:</strong> Experimental design and analysis.</li>
                    <li><strong>Advanced Engineering Mathematics:</strong> Mathematical modeling.</li>
                    <li><strong>Technical Writing & Research Ethics:</strong> Scientific communication.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Dissertation:</strong> Independent research contribution.</li>
                    <li><strong>Industrial or Research Internship:</strong> Optional advanced placement.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Engineering in Chemical and Metallurgical Engineering',
        slug: 'meng-chem-met',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced degree focusing on specialized process technologies, advanced materials, and sustainable engineering solutions.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-chemical-metallurgical.jpg',
        careerPaths: 'Research & Academia, Senior Process Engineer, Metallic Materials Expert, Energy & Environmental Consultant'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting B.Eng Chem-Met:', bErr);
    else console.log('✅ Successfully seeded "B.Eng Chemical and Metallurgical Engineering".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting M.Eng Chem-Met:', mErr);
    else console.log('✅ Successfully seeded "M.Eng Chemical and Metallurgical Engineering".');
}

seedChemMet();
