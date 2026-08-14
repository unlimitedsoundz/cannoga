
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

async function seedAppliedPhysics() {
    console.log('Seeding Applied Physics Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'applied-physics').single();
    if (!dept) {
        console.error('Department "applied-physics" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'core-physics',
            title: 'Core Physics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Classical Mechanics:</strong> Newtonian dynamics, Lagrangian and Hamiltonian formalisms.</li>
                    <li><strong>Electricity & Magnetism:</strong> Electrostatics, magnetostatics, and Maxwell's equations.</li>
                    <li><strong>Waves and Optics:</strong> Wave propagation, interference, diffraction, and polarization.</li>
                    <li><strong>Thermal Physics:</strong> Thermodynamics and statistical mechanics.</li>
                    <li><strong>Modern Physics:</strong> Special relativity and introduction to quantum theory.</li>
                    <li><strong>Quantum Mechanics (Introductory):</strong> Wave functions, Schrödinger equation, and hydrogen atom.</li>
                    <li><strong>Solid State Physics:</strong> Crystal structures, lattice vibrations, and electronic properties.</li>
                    <li><strong>Nuclear & Atomic Physics:</strong> Structure of nuclei, radioactivity, and atomic spectra.</li>
                </ul>
            `
        },
        {
            id: 'mathematics',
            title: 'Mathematics for Physics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Calculus I, II, III:</strong> Limits, differentiation, integration, and multivariate calculus.</li>
                    <li><strong>Linear Algebra:</strong> Vector spaces, matrices, and eigenvalues.</li>
                    <li><strong>Differential Equations:</strong> Ordinary and partial differential equations.</li>
                    <li><strong>Vector Analysis:</strong> Gradient, divergence, curl, and integral theorems.</li>
                    <li><strong>Probability & Statistics:</strong> Error analysis and statistical distributions.</li>
                    <li><strong>Mathematical Methods for Physics:</strong> Complex analysis and special functions.</li>
                </ul>
            `
        },
        {
            id: 'laboratory',
            title: 'Laboratory & Experimental Physics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>General Physics Laboratory I & II:</strong> Foundational experiments.</li>
                    <li><strong>Electronics Laboratory:</strong> Circuit design and analysis.</li>
                    <li><strong>Optics Laboratory:</strong> Experiments in geometric and wave optics.</li>
                    <li><strong>Modern Physics Laboratory:</strong> Experiments in quantum and atomic physics.</li>
                    <li><strong>Measurement & Instrumentation:</strong> Techniques for precise physical measurements.</li>
                </ul>
            `
        },
        {
            id: 'computing',
            title: 'Computing & Electronics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Programming for Physicists:</strong> Python, MATLAB, or C++ for scientific computing.</li>
                    <li><strong>Computational Physics:</strong> Numerical simulations and modeling.</li>
                    <li><strong>Analog and Digital Electronics:</strong> Circuit theory, logic gates, and signal processing.</li>
                    <li><strong>Microprocessors & Embedded Systems:</strong> Microcontroller programming and interfacing.</li>
                </ul>
            `
        },
        {
            id: 'applied-interdisciplinary',
            title: 'Applied & Interdisciplinary Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Materials Science:</strong> Structure-property relationships in materials.</li>
                    <li><strong>Semiconductor Physics:</strong> Physics of semiconductor devices.</li>
                    <li><strong>Renewable Energy Systems:</strong> Physics of solar and wind energy.</li>
                    <li><strong>Medical Physics (Intro):</strong> Physics applications in medicine.</li>
                    <li><strong>Applied Optics:</strong> Lasers, fiber optics, and photonics.</li>
                    <li><strong>Acoustics:</strong> Physics of sound and vibration.</li>
                    <li><strong>Geophysics (Intro):</strong> Physics of the Earth.</li>
                </ul>
            `
        },
        {
            id: 'general-professional',
            title: 'General & Professional Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Technical Communication:</strong> Writing and presenting scientific results.</li>
                    <li><strong>Engineering Drawing:</strong> Technical drawing and CAD standards.</li>
                    <li><strong>Research Methods:</strong> Methodologies for scientific inquiry.</li>
                    <li><strong>Industrial Training / Internship:</strong> Practical experience in industry.</li>
                    <li><strong>Final Year Project / Thesis:</strong> Independent research project.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Science in Applied Physics',
        slug: 'bsc-applied-physics',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A robust program combining theoretical physics with practical applications in engineering and technology, preparing students for research and industry.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180, // or 240 depending on system, defaulting to 180 ECTS for 3 years usually
        imageUrl: '/images/departments/placeholder-applied-physics.jpg'
    };

    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'advanced-core',
            title: 'Advanced Core Physics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Quantum Mechanics:</strong> Perturbation theory, scattering, and relativistic QM.</li>
                    <li><strong>Advanced Electromagnetism:</strong> Electrodynamics and radiation theory.</li>
                    <li><strong>Statistical Mechanics:</strong> Ensembles, phase transitions, and critical phenomena.</li>
                    <li><strong>Solid State & Condensed Matter Physics:</strong> Many-body theory and advanced materials.</li>
                    <li><strong>Advanced Optics & Photonics:</strong> Nonlinear optics and quantum optics.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Areas (Electives)',
            content: `
                <p class="mb-2"><strong>Materials & Nanotechnology:</strong> Nanophysics, Thin Film Technology, Advanced Materials Characterization.</p>
                <p class="mb-2"><strong>Electronics & Devices:</strong> Semiconductor Devices, VLSI & Microelectronics, Sensors & Instrumentation.</p>
                <p class="mb-2"><strong>Energy & Environment:</strong> Solar Energy Physics, Energy Conversion & Storage, Environmental Physics.</p>
                <p class="mb-2"><strong>Medical & Nuclear Physics:</strong> Radiation Physics, Medical Imaging Physics, Health Physics.</p>
                <p><strong>Computational & Applied Methods:</strong> Numerical Methods, Computational Modeling, Data Analysis for Physics.</p>
            `
        },
        {
            id: 'advanced-lab',
            title: 'Advanced Laboratory & Research',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Experimental Techniques:</strong> Sophisticated measurement and analysis methods.</li>
                    <li><strong>Research Seminar:</strong> Presentation and discussion of current research topics.</li>
                    <li><strong>Scientific Writing & Ethics:</strong> Publication standards and research integrity.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Research Project:</strong> A major original research contribution.</li>
                    <li><strong>Industrial or Research Internship:</strong> Advanced professional placement.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Science in Applied Physics',
        slug: 'msc-applied-physics',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced research-oriented degree offering specialization in cutting-edge areas of physics and technology.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-applied-physics.jpg'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BSc Applied Physics:', bErr);
    else console.log('✅ Successfully seeded "BSc Applied Physics".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MSc Applied Physics:', mErr);
    else console.log('✅ Successfully seeded "MSc Applied Physics".');
}

seedAppliedPhysics();
