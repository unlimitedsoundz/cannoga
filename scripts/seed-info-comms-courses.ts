
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

async function seedInfoComms() {
    console.log('Seeding Information & Communications Engineering Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'info-comms').single();
    if (!dept) {
        console.error('Department "info-comms" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'math',
            title: 'Mathematics & Foundations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Calculus I, II, III:</strong> Advanced calculus.</li>
                    <li><strong>Linear Algebra:</strong> Vector spaces.</li>
                    <li><strong>Differential Equations:</strong> Dynamic systems.</li>
                    <li><strong>Probability & Statistics:</strong> Stochastic processes.</li>
                    <li><strong>Discrete Mathematics:</strong> Crypto and coding theory basics.</li>
                    <li><strong>Engineering Physics:</strong> Electromagnetics.</li>
                </ul>
            `
        },
        {
            id: 'core-ece',
            title: 'Core Electrical & Communications Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Circuit Theory I & II:</strong> Networks.</li>
                    <li><strong>Analog Electronics:</strong> Amplifiers.</li>
                    <li><strong>Digital Electronics:</strong> Logic design.</li>
                    <li><strong>Signals and Systems:</strong> Fourier/Laplace.</li>
                    <li><strong>Electromagnetic Fields & Waves:</strong> Propagation.</li>
                    <li><strong>Communication Systems Fundamentals:</strong> Modulation.</li>
                    <li><strong>Digital Signal Processing:</strong> Filters and sampling.</li>
                    <li><strong>Microprocessors & Microcontrollers:</strong> Computer systems.</li>
                </ul>
            `
        },
        {
            id: 'info-net',
            title: 'Information & Network Systems',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Computer Networks (Intro):</strong> OSI model.</li>
                    <li><strong>Data Communication:</strong> Protocols.</li>
                    <li><strong>Network Protocols & Architecture:</strong> TCP/IP.</li>
                    <li><strong>Wireless Communication Basics:</strong> Mobile networks.</li>
                    <li><strong>Internet of Things (Intro):</strong> Connected devices.</li>
                </ul>
            `
        },
        {
            id: 'computing',
            title: 'Programming & Computing',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Programming for Engineers:</strong> Python / C / MATLAB.</li>
                    <li><strong>Embedded Systems Programming:</strong> Real-time constraints.</li>
                    <li><strong>Simulation & Modeling:</strong> Network sim.</li>
                    <li><strong>Database & Information Systems:</strong> Data management.</li>
                </ul>
            `
        },
        {
            id: 'labs',
            title: 'Laboratory & Practical Work',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Electronics Lab:</strong> Hardware testing.</li>
                    <li><strong>Communication Systems Lab:</strong> Radio and networking.</li>
                    <li><strong>Digital Signal Processing Lab:</strong> Audio/Video processing.</li>
                    <li><strong>Network & Information Systems Lab:</strong> Routing and switching.</li>
                    <li><strong>Embedded Systems Lab:</strong> Microcontroller projects.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Professional Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Industrial Training / Internship:</strong> Field experience.</li>
                    <li><strong>Engineering Ethics & Safety:</strong> Standards.</li>
                    <li><strong>Project Management for Engineers:</strong> Agile/Waterfall.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Information, Communication, or Embedded Systems focus.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Engineering in Information and Communications Engineering',
        slug: 'beng-info-comms',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A comprehensive program covering the convergence of telecommunications, electronics, and software engineering.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 240,
        imageUrl: '/images/departments/placeholder-info-comms.jpg',
        careerPaths: 'Network Engineer, Telecommunications Specialist, Embedded Systems Engineer, DSP Engineer'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-core',
            title: 'Advanced Core Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Communication Systems:</strong> MIMO, OFDM.</li>
                    <li><strong>Advanced Digital Signal Processing:</strong> Adaptive filtering.</li>
                    <li><strong>Advanced Wireless & Mobile Communications:</strong> 5G/6G.</li>
                    <li><strong>Optical Communications:</strong> Fiber optics.</li>
                    <li><strong>Advanced Networking & Internet Protocols:</strong> SDN, NFV.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Telecommunications & Wireless</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>5G & Next-Generation Networks</li>
                    <li>Satellite & Space Communication</li>
                    <li>Network Security & Cryptography</li>
                    <li>Internet of Things & Smart Systems</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Signal Processing & Electronics</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced DSP & Image Processing</li>
                    <li>Multimedia Signal Processing</li>
                    <li>Embedded & Real-Time Systems</li>
                    <li>Analog & Mixed-Signal Design</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Networking & Information Systems</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Cloud Computing & Networking</li>
                    <li>Advanced Computer Networks</li>
                    <li>Data Analytics for Communication Systems</li>
                    <li>Network Simulation & Modeling</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Control & Automation</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Industrial Communication Systems</li>
                    <li>Networked Control Systems</li>
                    <li>Robotics & Intelligent Systems</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in ICE:</strong> Scientific process.</li>
                    <li><strong>Technical Writing & Communication:</strong> Publishing.</li>
                    <li><strong>Graduate Seminar:</strong> Emerging tech.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Research Project:</strong> Major contribution.</li>
                    <li><strong>Industrial or Research Internship:</strong> Advanced placement.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Engineering in Information and Communications Engineering',
        slug: 'meng-info-comms',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced specialized degree for designing the future of global connectivity and smart systems.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-info-comms.jpg',
        careerPaths: 'Lead Systems Architect, Research Scientist, Senior Network Engineer, CTO'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting B.Eng Info-Comms:', bErr);
    else console.log('✅ Successfully seeded "B.Eng Info-Comms".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting M.Eng Info-Comms:', mErr);
    else console.log('✅ Successfully seeded "M.Eng Info-Comms".');
}

seedInfoComms();
