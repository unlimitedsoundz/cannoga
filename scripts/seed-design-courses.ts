
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

async function seedDesign() {
    console.log('Seeding Design Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'design').single();
    if (!dept) {
        console.error('Department "design" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'foundations',
            title: 'Design Foundations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Design Principles:</strong> Balance, contrast, and rhythm.</li>
                    <li><strong>Visual Communication:</strong> Conveying messages visually.</li>
                    <li><strong>Drawing & Sketching:</strong> Visualization techniques.</li>
                    <li><strong>Color Theory:</strong> Application and psychology.</li>
                    <li><strong>Typography:</strong> Art of type and layout.</li>
                    <li><strong>Composition & Layout:</strong> Spatial arrangement.</li>
                    <li><strong>2D & 3D Design:</strong> Form and space.</li>
                </ul>
            `
        },
        {
            id: 'digital-skills',
            title: 'Digital Design Skills',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Graphic Design:</strong> Vector and raster tools.</li>
                    <li><strong>Digital Illustration:</strong> Digital painting and rendering.</li>
                    <li><strong>Motion Graphics (Intro):</strong> Animation basics.</li>
                    <li><strong>Photography for Designers:</strong> Image capture and editing.</li>
                    <li><strong>Video & Media Design:</strong> Time-based media.</li>
                    <li><strong>Design Software:</strong> Adobe Creative Suite mastery.</li>
                </ul>
            `
        },
        {
            id: 'theory-history',
            title: 'Design Theory & History',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>History of Design:</strong> Evolution of design styles.</li>
                    <li><strong>Design Theory & Criticism:</strong> Analyzing design impact.</li>
                    <li><strong>Visual Culture Studies:</strong> Contextualizing images.</li>
                    <li><strong>Contemporary Design Studies:</strong> Current trends.</li>
                </ul>
            `
        },
        {
            id: 'specialized',
            title: 'Specialized Design Areas',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Product Design (Intro):</strong> Form and function.</li>
                    <li><strong>Interaction Design (Intro):</strong> Designing behaviors.</li>
                    <li><strong>UX/UI Design (Intro):</strong> User experience foundations.</li>
                    <li><strong>Information Design:</strong> Data visualization.</li>
                    <li><strong>Branding & Identity Design:</strong> Corporate identity systems.</li>
                    <li><strong>Packaging Design:</strong> 3D branding.</li>
                </ul>
            `
        },
        {
            id: 'materials',
            title: 'Materials & Making',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Materials & Manufacturing Processes:</strong> Fabrication techniques.</li>
                    <li><strong>Model Making & Prototyping:</strong> Physical models.</li>
                    <li><strong>Workshop Practice:</strong> Safety and tool usage.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Communication & Professional Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Design Research Methods:</strong> User inquiry.</li>
                    <li><strong>Design Thinking:</strong> Problem-solving framework.</li>
                    <li><strong>Creative Writing & Presentation:</strong> Pitching ideas.</li>
                    <li><strong>Design Ethics & Law:</strong> Copyright and responsibility.</li>
                    <li><strong>Entrepreneurship for Designers:</strong> Business of design.</li>
                    <li><strong>Industrial Training:</strong> Professional placement.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Design Project:</strong> Major studio project.</li>
                    <li><strong>Portfolio Development & Exhibition:</strong> Professional showcase.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Design (BDes)',
        slug: 'bdes-design',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A studio-based program aimed at developing creative professionals proficient in visual communication, product design, and digital experiences.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-design.jpg',
        careerPaths: 'Graphic Designer, Product Designer, UX/UI Designer, Creative Strategist'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-practice',
            title: 'Advanced Design Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Studio Practice:</strong> Mastery of craft.</li>
                    <li><strong>Design Research & Methods:</strong> Academic inquiry.</li>
                    <li><strong>Strategic Design:</strong> Design for business strategy.</li>
                    <li><strong>Systems & Service Design:</strong> Holistic problem solving.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Graphic & Visual Communication</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Typography</li>
                    <li>Editorial & Information Design</li>
                    <li>Advanced Branding Systems</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Product & Industrial Design</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Product Design</li>
                    <li>Sustainable Product Design</li>
                    <li>Ergonomics & Human Factors</li>
                    <li>Advanced Prototyping</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Interaction, UX & Digital Design</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced UX/UI Design</li>
                    <li>Human–Computer Interaction</li>
                    <li>Service & Experience Design</li>
                    <li>Interactive Systems Design</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Media & Motion Design</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Advanced Motion Graphics</li>
                    <li>Animation & Visual Effects</li>
                    <li>Immersive Media (AR/VR)</li>
                </ul>
            `
        },
        {
            id: 'strategic',
            title: 'Professional & Strategic Studies',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Design Management:</strong> Leading creative teams.</li>
                    <li><strong>Innovation & Entrepreneurship:</strong> Design-led ventures.</li>
                    <li><strong>Design for Sustainability:</strong> Eco-design principles.</li>
                    <li><strong>Design Policy & Ethics:</strong> Societal impact.</li>
                </ul>
            `
        },
        {
            id: 'research-dev',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Seminar:</strong> Critical discourse.</li>
                    <li><strong>Academic & Professional Writing:</strong> Thesis preparation.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis:</strong> Practice-based or Written.</li>
                    <li><strong>Final Design Exhibition:</strong> Public display of work.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Design (MDes)',
        slug: 'mdes-design',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced program for design leadership, focusing on strategy, innovation, and specialized practice.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-design.jpg',
        careerPaths: 'Design Manager, Creative Director, Senior UX Researcher, Product Lead'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BDes Design:', bErr);
    else console.log('✅ Successfully seeded "Bachelor of Design".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MDes Design:', mErr);
    else console.log('✅ Successfully seeded "Master of Design".');
}

seedDesign();
