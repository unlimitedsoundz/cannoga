
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

async function seedElectronics() {
    console.log('Seeding Electronics & Nanoengineering Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'electronics-nano').single();
    if (!dept) {
        console.error('Department "electronics-nano" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'math',
            title: 'Mathematics & Foundations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Calculus I, II, III:</strong> Analysis fundamentals.</li>
                    <li><strong>Linear Algebra:</strong> Vector spaces and matrices.</li>
                    <li><strong>Differential Equations:</strong> Modeling dynamic systems.</li>
                    <li><strong>Probability & Statistics:</strong> Data analysis.</li>
                    <li><strong>Physics for Engineers:</strong> Mechanics and electromagnetism.</li>
                </ul>
            `
        },
        {
            id: 'core-electronics',
            title: 'Core Electronics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Circuit Theory I & II:</strong> Network analysis.</li>
                    <li><strong>Analog Electronics:</strong> Amplifiers and filters.</li>
                    <li><strong>Digital Electronics:</strong> Logic gates and systems.</li>
                    <li><strong>Microprocessors & Microcontrollers:</strong> Computer architecture.</li>
                    <li><strong>Electronic Devices & Instrumentation:</strong> Measuring systems.</li>
                    <li><strong>Signal Processing Fundamentals:</strong> Signals and systems.</li>
                    <li><strong>Communication Systems (Intro):</strong> Data transmission basics.</li>
                </ul>
            `
        },
        {
            id: 'nano-fundamentals',
            title: 'Nanoscience & Nanoengineering Fundamentals',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Introduction to Nanotechnology:</strong> Nanoscale phenomena.</li>
                    <li><strong>Materials Science for Nanoengineering:</strong> Properties at small scales.</li>
                    <li><strong>Solid-State Physics:</strong> Crystal quantum properties.</li>
                    <li><strong>Nanomaterials & Nanostructures:</strong> Carbon nanotubes, nanowires.</li>
                    <li><strong>Thin Films & Coatings:</strong> Deposition techniques.</li>
                    <li><strong>Nanoscale Fabrication Techniques:</strong> Lithography and etching.</li>
                </ul>
            `
        },
        {
            id: 'automation',
            title: 'Automation & Embedded Systems',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Embedded Systems Design:</strong> Hardware-software integration.</li>
                    <li><strong>Sensors & Actuators:</strong> Transducers for control.</li>
                    <li><strong>Mechatronics Basics:</strong> Integrated systems.</li>
                    <li><strong>Robotics Fundamentals:</strong> Kinematics and control.</li>
                </ul>
            `
        },
        {
            id: 'computing',
            title: 'Computing & Software',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Programming for Engineers:</strong> Python / C / MATLAB.</li>
                    <li><strong>Simulation & Modeling:</strong> SPICE and finite element.</li>
                    <li><strong>CAD for Electronics & Nanodevices:</strong> Layout design tools.</li>
                </ul>
            `
        },
        {
            id: 'labs',
            title: 'Laboratory & Practical Work',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Electronics Lab:</strong> Circuit experiments.</li>
                    <li><strong>Analog & Digital Circuits Lab:</strong> Design and testing.</li>
                    <li><strong>Micro/Nano Fabrication Lab:</strong> Cleanroom basics.</li>
                    <li><strong>Sensors & Embedded Systems Lab:</strong> Microcontroller interfacing.</li>
                    <li><strong>Signal & Communication Lab:</strong> Modulation and filtering.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Professional Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Industrial Training / Internship:</strong> Industry exposure.</li>
                    <li><strong>Engineering Ethics & Safety:</strong> Professional conduct.</li>
                    <li><strong>Project Management for Engineers:</strong> Planning and execution.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Major design project (Electronics or Nanoengineering focus).</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Engineering in Electronics and Nanoengineering',
        slug: 'beng-electronics-nano',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A cutting-edge program merging traditional electronics with the revolutionary field of nanotechnology.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 240,
        imageUrl: '/images/departments/placeholder-electronics-nano.jpg',
        careerPaths: 'Electronics Engineer, Nanotechnologist, Process Engineer, Semiconductor Hardware Engineer'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-electronics',
            title: 'Advanced Electronics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Analog & Digital Circuits:</strong> High-performance design.</li>
                    <li><strong>Advanced Signal Processing:</strong> Digital image and audio processing.</li>
                    <li><strong>VLSI & Microelectronics:</strong> Integrated circuit design.</li>
                    <li><strong>Communication Systems & Networks:</strong> Wireless and optical comms.</li>
                    <li><strong>Power Electronics:</strong> Efficient energy conversion.</li>
                </ul>
            `
        },
        {
            id: 'adv-nano',
            title: 'Advanced Nanoengineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Nanomaterials & Nanostructures:</strong> Synthesis and applications.</li>
                    <li><strong>Nanofabrication & Characterization:</strong> Advanced microscopy and lithography.</li>
                    <li><strong>Nanoelectronics:</strong> Molecular and quantum devices.</li>
                    <li><strong>Quantum Devices & Nanophotonics:</strong> Light-matter interaction.</li>
                    <li><strong>Molecular Electronics:</strong> Single-molecule devices.</li>
                    <li><strong>MEMS & NEMS Devices:</strong> Micro-electro-mechanical systems.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Electronics & Embedded Systems</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Embedded Systems & IoT</li>
                    <li>Robotics & Automation</li>
                    <li>Control Systems</li>
                    <li>Intelligent Electronic Systems</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Nanotechnology & Materials</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Materials Characterization</li>
                    <li>Nanostructured Semiconductors</li>
                    <li>Nano-optics & Plasmonics</li>
                    <li>Biomedical Nanodevices</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Energy & Sustainability</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Nanoelectronics for Energy Applications</li>
                    <li>Nanomaterials for Batteries & Solar Cells</li>
                    <li>Energy Harvesting at Nanoscale</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Electronics & Nanoengineering:</strong> Experimental design.</li>
                    <li><strong>Graduate Seminar:</strong> Latest research presentations.</li>
                    <li><strong>Technical Writing & Ethics:</strong> Scientific communication.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Dissertation:</strong> Independent research.</li>
                    <li><strong>Industrial or Research Internship:</strong> Advanced practical training.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Engineering in Electronics and Nanoengineering',
        slug: 'meng-electronics-nano',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced program focused on next-generation microelectronics, quantum devices, and material science at the nanoscale.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-electronics-nano.jpg',
        careerPaths: 'R&D Engineer, Nanofabrication Engineer, Chip Designer, Research Scientist'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting B.Eng Electronics-Nano:', bErr);
    else console.log('✅ Successfully seeded "B.Eng Electronics and Nanoengineering".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting M.Eng Electronics-Nano:', mErr);
    else console.log('✅ Successfully seeded "M.Eng Electronics and Nanoengineering".');
}

seedElectronics();
