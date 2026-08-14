
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

async function seedInfoService() {
    console.log('Seeding Information & Service Management Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'info-service').single();
    if (!dept) {
        console.error('Department "info-service" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'foundations',
            title: 'Foundations & Quantitative Skills',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Business Mathematics:</strong> Algebra for business.</li>
                    <li><strong>Statistics for Business:</strong> Data interpretation.</li>
                    <li><strong>Data Analysis & Visualization:</strong> Presenting insights.</li>
                    <li><strong>Operations Research (Intro):</strong> Optimization basics.</li>
                    <li><strong>Financial Accounting (Intro):</strong> Reporting fundamentals.</li>
                </ul>
            `
        },
        {
            id: 'info-systems',
            title: 'Information Systems & IT',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Introduction to Information Systems:</strong> Tech in business.</li>
                    <li><strong>Database Management Systems:</strong> SQL and data structures.</li>
                    <li><strong>Business Analytics Fundamentals:</strong> Descriptive analytics.</li>
                    <li><strong>Programming for Business:</strong> Python / SQL / Excel.</li>
                    <li><strong>Enterprise Resource Planning (ERP) Basics:</strong> Integrated systems.</li>
                </ul>
            `
        },
        {
            id: 'service-mgmt',
            title: 'Service Management & Operations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Principles of Service Management:</strong> Service logic.</li>
                    <li><strong>Operations & Process Management:</strong> Efficiency.</li>
                    <li><strong>Service Quality & Customer Experience:</strong> Satisfaction metrics.</li>
                    <li><strong>Supply Chain Management (Intro):</strong> Logistics basics.</li>
                    <li><strong>Project Management Fundamentals:</strong> Methodologies.</li>
                </ul>
            `
        },
        {
            id: 'business-mgmt',
            title: 'Business & Management',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Principles of Management:</strong> Leadership concepts.</li>
                    <li><strong>Organizational Behavior:</strong> Team dynamics.</li>
                    <li><strong>Marketing Management:</strong> Promoting services.</li>
                    <li><strong>Business Communication:</strong> Professional skills.</li>
                    <li><strong>Business Law & Ethics:</strong> Compliance.</li>
                </ul>
            `
        },
        {
            id: 'applied',
            title: 'Applied & Specialized Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>E-Business & Digital Services:</strong> Online commerce.</li>
                    <li><strong>IT Service Management (ITSM):</strong> ITIL concepts.</li>
                    <li><strong>Knowledge Management:</strong> Organizational learning.</li>
                    <li><strong>Innovation & Service Design:</strong> Creating value.</li>
                    <li><strong>Business Intelligence & Decision Support:</strong> Data for decisions.</li>
                </ul>
            `
        },
        {
            id: 'practical',
            title: 'Practical & Professional Experience',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Case Studies & Simulations:</strong> Real-world problems.</li>
                    <li><strong>Internship / Industrial Training:</strong> Work experience.</li>
                    <li><strong>Group Projects & Presentations:</strong> Collaborative work.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Research in Information or Service Management.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Science in Information and Service Management',
        slug: 'bsc-info-service',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A program bridging technology and business, focusing on managing information, digital services, and operational efficiency.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-info-service.jpg',
        careerPaths: 'Business Analyst, Service Manager, IT Consultant, Data Analyst'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-it',
            title: 'Advanced Information & IT Systems',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Enterprise Systems:</strong> ERP configurations.</li>
                    <li><strong>Data Analytics & Big Data for Services:</strong> Mining insights.</li>
                    <li><strong>Digital Transformation & Innovation:</strong> Change management.</li>
                    <li><strong>Cloud Computing & IT Infrastructure:</strong> Scalable tech.</li>
                    <li><strong>IT Service Management (Advanced):</strong> Strategic ITSM.</li>
                </ul>
            `
        },
        {
            id: 'adv-service',
            title: 'Advanced Service & Operations Management',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Service Operations:</strong> Optimizing flows.</li>
                    <li><strong>Service Design & Customer Experience Management:</strong> CX strategy.</li>
                    <li><strong>Supply Chain & Logistics for Services:</strong> Service delivery chains.</li>
                    <li><strong>Strategic Service Management:</strong> Competitive advantage.</li>
                    <li><strong>Process Optimization & Lean Services:</strong> Waste reduction.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Business Analytics & Data Management</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Business Intelligence Systems</li>
                    <li>Predictive Analytics</li>
                    <li>Data-Driven Decision Making</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Digital & Technology-Driven Services</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Digital Business Models</li>
                    <li>E-Government & E-Services</li>
                    <li>Smart Services & IoT Applications</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Management & Strategy</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Innovation & Knowledge Management</li>
                    <li>Strategic Management in Service Organizations</li>
                    <li>Leadership & Organizational Change</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in ISM:</strong> Quantitative and qualitative.</li>
                    <li><strong>Graduate Seminar & Case Studies:</strong> Advanced topics.</li>
                    <li><strong>Technical & Professional Writing:</strong> Research communication.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis:</strong> In-depth research.</li>
                    <li><strong>Applied Industry Project:</strong> Practical solution implementation.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Science in Information and Service Management',
        slug: 'msc-info-service',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced degree focused on leveraging data, technology, and service design to drive business innovation.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-info-service.jpg',
        careerPaths: 'CIO, Service Operations Director, Digital Transformation Lead, Business Intelligence Manager'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BSc Info-Service:', bErr);
    else console.log('✅ Successfully seeded "BSc Info-Service".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MSc Info-Service:', mErr);
    else console.log('✅ Successfully seeded "MSc Info-Service".');
}

seedInfoService();
