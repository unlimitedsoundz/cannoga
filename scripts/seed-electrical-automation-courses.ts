
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

async function seedElectrical() {
    console.log('Seeding Electrical Engineering & Automation Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'electrical-automation').single();
    if (!dept) {
        console.error('Department "electrical-automation" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'math-foundations',
            title: 'Mathematics & Foundations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Calculus I, II, III:</strong> Analysis of continuous change.</li>
                    <li><strong>Linear Algebra:</strong> Vector spaces and systems.</li>
                    <li><strong>Differential Equations:</strong> Modeling dynamic systems.</li>
                    <li><strong>Probability & Statistics:</strong> Random processes.</li>
                    <li><strong>Engineering Physics:</strong> Electromagnetism and mechanics.</li>
                </ul>
            `
        },
        {
            id: 'core-ee',
            title: 'Core Electrical Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Circuit Theory I & II:</strong> DC/AC analysis and networks.</li>
                    <li><strong>Electrical Machines & Drives:</strong> Motors and generators.</li>
                    <li><strong>Power Systems I & II:</strong> Grid architecture and stability.</li>
                    <li><strong>Control Systems I & II:</strong> Feedback and stability analysis.</li>
                    <li><strong>Digital Logic Design:</strong> Boolean algebra and circuits.</li>
                    <li><strong>Analog Electronics:</strong> Amplifiers and semiconductors.</li>
                    <li><strong>Signal Processing Fundamentals:</strong> Time and frequency domains.</li>
                    <li><strong>Measurements & Instrumentation:</strong> Sensing and accuracy.</li>
                </ul>
            `
        },
        {
            id: 'automation',
            title: 'Automation & Control',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Industrial Automation Systems:</strong> Factory control.</li>
                    <li><strong>PLC Programming:</strong> Logic for industrial control.</li>
                    <li><strong>Robotics Fundamentals:</strong> Kinematics and actuators.</li>
                    <li><strong>Embedded Systems:</strong> Microcontrollers in systems.</li>
                    <li><strong>Sensors & Actuators:</strong> Interfacing with the physical world.</li>
                    <li><strong>Mechatronics Basics:</strong> Mechanical-electrical integration.</li>
                </ul>
            `
        },
        {
            id: 'computing',
            title: 'Computing & Software',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Computer Programming:</strong> C / Python / MATLAB.</li>
                    <li><strong>Microcontrollers & Microprocessors:</strong> Architecture and coding.</li>
                    <li><strong>SCADA Systems:</strong> Supervisory control.</li>
                    <li><strong>Simulation & Modeling:</strong> Virtual prototyping.</li>
                </ul>
            `
        },
        {
            id: 'power',
            title: 'Power & Energy Systems',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Electrical Power Generation & Distribution:</strong> Energy delivery.</li>
                    <li><strong>Renewable Energy Systems:</strong> Solar and Wind.</li>
                    <li><strong>Electrical Machines & Transformers:</strong> Energy conversion.</li>
                    <li><strong>Power Electronics:</strong> Inverters and converters.</li>
                </ul>
            `
        },
        {
            id: 'labs',
            title: 'Laboratory & Practical Work',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Electrical Machines Lab:</strong> Testing motors.</li>
                    <li><strong>Electronics Lab:</strong> Circuit building.</li>
                    <li><strong>Control Systems Lab:</strong> PID tuning.</li>
                    <li><strong>Automation & Robotics Lab:</strong> PLC and arm programming.</li>
                    <li><strong>Measurement & Instrumentation Lab:</strong> Calibration.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Professional Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Engineering Ethics & Safety:</strong> Standards and responsibility.</li>
                    <li><strong>Industrial Training / Internship:</strong> On-site experience.</li>
                    <li><strong>Project Management for Engineers:</strong> Executing technical projects.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Major design (Automation / Electrical).</li>
                    <li><strong>Plant Design / Industrial Automation Project:</strong> System integration.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Engineering in Electrical Engineering and Automation',
        slug: 'beng-electrical-automation',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A comprehensive program combining power systems, electronics, and advanced automation technologies for modern industry.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 240,
        imageUrl: '/images/departments/placeholder-electrical-automation.jpg',
        careerPaths: 'Automation Engineer, Power Systems Engineer, Robotics Specialist, Electrical Designer'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-ee',
            title: 'Advanced Electrical Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Power Systems:</strong> Grid dynamics and smart delivery.</li>
                    <li><strong>Advanced Electrical Machines & Drives:</strong> High-efficiency control.</li>
                    <li><strong>Advanced Signal Processing:</strong> Digital filtering and analysis.</li>
                    <li><strong>Advanced Power Electronics:</strong> Switching methodologies.</li>
                    <li><strong>High Voltage Engineering:</strong> Transmission and insulation.</li>
                </ul>
            `
        },
        {
            id: 'adv-automation',
            title: 'Advanced Automation & Control',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Control Systems:</strong> Robust and adaptive control.</li>
                    <li><strong>Robotics & Intelligent Systems:</strong> AI in robotics.</li>
                    <li><strong>Industrial Automation & Smart Factories:</strong> Industry 4.0.</li>
                    <li><strong>Embedded Systems Design:</strong> Real-time operating systems.</li>
                    <li><strong>Advanced PLC & SCADA Systems:</strong> Complex distributed control.</li>
                    <li><strong>Artificial Intelligence for Automation:</strong> Machine learning in control.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Power & Energy Systems</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Smart Grids</li>
                    <li>Energy Management & Optimization</li>
                    <li>Renewable Energy Integration</li>
                    <li>Electrical Vehicle Systems</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Robotics & Mechatronics</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Industrial Robotics</li>
                    <li>Mechatronic Systems Design</li>
                    <li>Sensors, Actuators & Motion Control</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Signal & Communication</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Digital Signal Processing</li>
                    <li>Communication Systems & Networks</li>
                    <li>IoT for Industrial Automation</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Electrical Engineering:</strong> Experimental design.</li>
                    <li><strong>Technical Writing & Professional Communication:</strong> Publishing results.</li>
                    <li><strong>Graduate Seminar:</strong> Advanced topics.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Dissertation:</strong> In-depth research.</li>
                    <li><strong>Industrial or Research Internship:</strong> Advanced practice.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Engineering in Electrical Engineering and Automation',
        slug: 'meng-electrical-automation',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An expert-level program focusing on smart grids, intelligent robotics, and next-generation industrial control systems.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-electrical-automation.jpg',
        careerPaths: 'Senior Electrical Engineer, Automation Architect, Grid Operations Manager, R&D Scientist'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting B.Eng Electrical:', bErr);
    else console.log('✅ Successfully seeded "B.Eng Electrical Automation".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting M.Eng Electrical:', mErr);
    else console.log('✅ Successfully seeded "M.Eng Electrical Automation".');
}

seedElectrical();
