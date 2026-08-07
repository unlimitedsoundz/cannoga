
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

async function seedCS() {
    console.log('Seeding Computer Science Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'computer-science').single();
    if (!dept) {
        console.error('Department "computer-science" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'math',
            title: 'Mathematics & Foundations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Calculus I & II:</strong> Limits, derivatives, and integrals.</li>
                    <li><strong>Linear Algebra:</strong> Vector spaces and matrices.</li>
                    <li><strong>Discrete Mathematics:</strong> Logic, set theory, and combinatorics.</li>
                    <li><strong>Probability & Statistics:</strong> Statistical inference for computing.</li>
                    <li><strong>Numerical Methods:</strong> Algorithms for continuous math problems.</li>
                </ul>
            `
        },
        {
            id: 'core-cs',
            title: 'Core Computer Science',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Introduction to Computer Science:</strong> Overview of computational thinking.</li>
                    <li><strong>Programming I:</strong> Fundamentals in Python / C++.</li>
                    <li><strong>Programming II:</strong> Object-Oriented Programming (Java).</li>
                    <li><strong>Data Structures & Algorithms:</strong> Efficient data organization.</li>
                    <li><strong>Computer Organization & Architecture:</strong> Hardware systems.</li>
                    <li><strong>Operating Systems:</strong> Processes, memory, and concurrency.</li>
                    <li><strong>Databases & Information Systems:</strong> SQL and data modeling.</li>
                    <li><strong>Software Engineering:</strong> Methodologies and lifecycle.</li>
                    <li><strong>Theory of Computation:</strong> Automata and complexity.</li>
                    <li><strong>Compiler Design:</strong> Lexical analysis and parsing.</li>
                </ul>
            `
        },
        {
            id: 'systems',
            title: 'Systems & Networks',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Computer Networks:</strong> Protocols and architecture.</li>
                    <li><strong>Distributed Systems:</strong> System design across networks.</li>
                    <li><strong>Cloud Computing (Intro):</strong> Virtualization and services.</li>
                </ul>
            `
        },
        {
            id: 'security',
            title: 'Security',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Introduction to Cybersecurity:</strong> Threats and defenses.</li>
                    <li><strong>Cryptography (Intro):</strong> Encryption techniques.</li>
                    <li><strong>Computer & Network Security:</strong> Secure communication.</li>
                </ul>
            `
        },
        {
            id: 'ai-data',
            title: 'Artificial Intelligence & Data',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Artificial Intelligence:</strong> Search and logic agents.</li>
                    <li><strong>Machine Learning (Intro):</strong> Supervised and unsupervised learning.</li>
                    <li><strong>Data Science Fundamentals:</strong> Analysis and visualization.</li>
                    <li><strong>Data Mining:</strong> Pattern discovery in large datasets.</li>
                </ul>
            `
        },
        {
            id: 'hci',
            title: 'Human–Computer Interaction',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Human–Computer Interaction (HCI):</strong> User-centered design.</li>
                    <li><strong>User Interface Design:</strong> Usability and prototyping.</li>
                </ul>
            `
        },
        {
            id: 'app-dev',
            title: 'Application Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Web Development:</strong> Full-stack web technologies.</li>
                    <li><strong>Mobile Application Development:</strong> iOS/Android programming.</li>
                </ul>
            `
        },
        {
            id: 'prog-lang',
            title: 'Programming Languages & Paradigms',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Programming Languages Concepts:</strong> Syntax and semantics.</li>
                    <li><strong>Functional Programming:</strong> Haskell/Scala concepts.</li>
                    <li><strong>Logic Programming:</strong> Prolog and reasoning.</li>
                </ul>
            `
        },
        {
            id: 'labs',
            title: 'Laboratories & Practical Work',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Programming Laboratory:</strong> Hands-on coding.</li>
                    <li><strong>Systems Programming Lab:</strong> Low-level system interaction.</li>
                    <li><strong>Database Lab:</strong> SQL and NoSQL practice.</li>
                    <li><strong>Networks Lab:</strong> Packet tracing and configuration.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Professional Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods:</strong> Academic research skills.</li>
                    <li><strong>Technical Writing & Communication:</strong> Documentation and presentation.</li>
                    <li><strong>Entrepreneurship & Innovation:</strong> Startup basics.</li>
                    <li><strong>Industrial Training / Internship:</strong> Real-world experience.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Comprehensive software project.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Science in Computer Science',
        slug: 'bsc-computer-science',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A rigorous program covering the theory and practice of computing, from algorithms and AI to software engineering and systems.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-computerscience.jpg', // Assuming this exists or using generic
        careerPaths: 'Software Engineer, Data Scientist, Systems Architect, Web Developer'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-core',
            title: 'Advanced Core Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Algorithms:</strong> Approximation and randomized algos.</li>
                    <li><strong>Advanced Operating Systems:</strong> Distributed OS and kernels.</li>
                    <li><strong>Advanced Database Systems:</strong> Distributed databases and concurrency.</li>
                    <li><strong>Advanced Software Engineering:</strong> Enterprise architecture.</li>
                    <li><strong>Research Methods in Computer Science:</strong> Quantitative and qualitative methods.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Artificial Intelligence & Data Science</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Machine Learning & Deep Learning</li>
                    <li>Natural Language Processing</li>
                    <li>Computer Vision</li>
                    <li>Big Data Analytics</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Software Engineering</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Software Architecture</li>
                    <li>Software Testing & Quality Assurance</li>
                    <li>DevOps & Continuous Integration</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Cybersecurity</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Cryptography</li>
                    <li>Network Security</li>
                    <li>Ethical Hacking & Digital Forensics</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Systems & Networking</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Distributed Systems</li>
                    <li>Cloud & Edge Computing</li>
                    <li>High-Performance Computing</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Theory & Computing Foundations</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Computational Complexity</li>
                    <li>Advanced Programming Languages</li>
                </ul>
            `
        },
        {
            id: 'research-dev',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Graduate Seminar:</strong> Emerging topics in CS.</li>
                    <li><strong>Scientific Writing & Ethics:</strong> Publication standards.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Dissertation:</strong> Novel research contribution.</li>
                    <li><strong>Industrial or Research Internship:</strong> Optional practical track.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Science in Computer Science',
        slug: 'msc-computer-science',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced degree deepening knowledge in specialized areas like AI, Cybersecurity, and Distributed Systems.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-computerscience.jpg',
        careerPaths: 'AI Researcher, Senior Security Analyst, Cloud Solutions Architect, Professor'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BSc CS:', bErr);
    else console.log('✅ Successfully seeded "BSc Computer Science".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MSc CS:', mErr);
    else console.log('✅ Successfully seeded "MSc Computer Science".');
}

seedCS();
