
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

async function seedMarketing() {
    console.log('Seeding Marketing Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'marketing').single();
    if (!dept) {
        console.error('Department "marketing" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'foundations',
            title: 'Foundations & Business Basics',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Principles of Marketing:</strong> Market assessment.</li>
                    <li><strong>Principles of Management:</strong> Organizational theory.</li>
                    <li><strong>Business Communication:</strong> Pitching/presenting.</li>
                    <li><strong>Business Ethics & Corporate Governance:</strong> Responsibility.</li>
                    <li><strong>Microeconomics & Macroeconomics:</strong> Economic context.</li>
                    <li><strong>Business Law:</strong> Regulations.</li>
                </ul>
            `
        },
        {
            id: 'marketing-core',
            title: 'Marketing Core Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Consumer Behavior:</strong> Psychology of buying.</li>
                    <li><strong>Marketing Research:</strong> Data gathering.</li>
                    <li><strong>Product & Brand Management:</strong> Lifecycle management.</li>
                    <li><strong>Sales & Distribution Management:</strong> Channels.</li>
                    <li><strong>Advertising & Promotion:</strong> IMC.</li>
                    <li><strong>Retail & Service Marketing:</strong> Customer touchpoints.</li>
                    <li><strong>International Marketing (Intro):</strong> Global reach.</li>
                </ul>
            `
        },
        {
            id: 'digital',
            title: 'Digital & Analytical Skills',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Digital Marketing Fundamentals:</strong> Online landscape.</li>
                    <li><strong>Social Media Marketing:</strong> Engagement strategies.</li>
                    <li><strong>Marketing Analytics:</strong> ROI measurement.</li>
                    <li><strong>E-Commerce & Online Marketing:</strong> Digital sales.</li>
                    <li><strong>CRM Systems:</strong> Managing relationships.</li>
                </ul>
            `
        },
        {
            id: 'strategy',
            title: 'Business & Strategy',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Strategic Marketing:</strong> Competitive advantage.</li>
                    <li><strong>Business Statistics for Marketing:</strong> Quantitative analysis.</li>
                    <li><strong>Pricing Strategy:</strong> Value capture.</li>
                    <li><strong>Marketing Communications:</strong> Messaging.</li>
                    <li><strong>Project Management for Marketing:</strong> Campaign execution.</li>
                </ul>
            `
        },
        {
            id: 'practical',
            title: 'Practical Experience',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Case Studies & Simulations:</strong> Real-world scenarios.</li>
                    <li><strong>Marketing Campaign Projects:</strong> Hands-on work.</li>
                    <li><strong>Internship / Industrial Training:</strong> Industry placement.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Marketing Research Project.</li>
                    <li><strong>Portfolio Development:</strong> Showcase of work.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Science in Marketing',
        slug: 'bsc-marketing',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A dynamic program focused on understanding consumer needs and creating value through innovative marketing strategies.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-marketing.jpg',
        careerPaths: 'Marketing Executive, Social Media Manager, Brand Analyst, Sales Coordinator'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-core',
            title: 'Advanced Core Marketing',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Marketing Management:</strong> Strategic leadership.</li>
                    <li><strong>Consumer & Buyer Behavior Analysis:</strong> Deep behavioral insights.</li>
                    <li><strong>Strategic Brand Management:</strong> Brand equity.</li>
                    <li><strong>Marketing Research & Analytics (Advanced):</strong> Complex data.</li>
                    <li><strong>International Marketing Strategy:</strong> Global expansion.</li>
                </ul>
            `
        },
        {
            id: 'digital-tech',
            title: 'Digital & Technology Marketing',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Digital Marketing Strategy:</strong> Integrated digital plans.</li>
                    <li><strong>Social Media & Content Marketing:</strong> Viral strategies.</li>
                    <li><strong>E-Commerce & Omnichannel Marketing:</strong> Seamless retail.</li>
                    <li><strong>Marketing Automation & CRM Tools:</strong> Tech stack mastery.</li>
                    <li><strong>Data-Driven Marketing:</strong> Precision targeting.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Brand & Communication</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advertising Strategy & Campaigns</li>
                    <li>Public Relations & Media Strategy</li>
                    <li>Visual & Experiential Marketing</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Sales & Customer Experience</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Sales Management & Techniques</li>
                    <li>Customer Experience & Service Management</li>
                    <li>Retail & Omnichannel Strategy</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Analytics & Digital Marketing</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Marketing Analytics & Big Data</li>
                    <li>AI in Marketing</li>
                    <li>Search Engine Marketing & SEO</li>
                    <li>Social Media Analytics</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Strategy & Innovation</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Marketing Strategy & Planning</li>
                    <li>Innovation & Product Development</li>
                    <li>Global & International Marketing</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Marketing:</strong> Academic rigor.</li>
                    <li><strong>Case Studies & Industry Projects:</strong> Applied strategy.</li>
                    <li><strong>Professional Communication:</strong> Executive presentation.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Applied Marketing Project:</strong> Significant inquiry.</li>
                    <li><strong>Industry-Based Marketing Campaign:</strong> Real-world execution.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Science in Marketing',
        slug: 'msc-marketing',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced degree for marketing leaders, integrating creativity with data-driven decision making.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-marketing.jpg',
        careerPaths: 'CMO, Brand Director, Digital Marketing Manager, Market Research Director'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BSc Marketing:', bErr);
    else console.log('✅ Successfully seeded "BSc Marketing".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MSc Marketing:', mErr);
    else console.log('✅ Successfully seeded "MSc Marketing".');
}

seedMarketing();
