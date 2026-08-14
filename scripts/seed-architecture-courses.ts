
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

async function seedArchitecture() {
    console.log('Seeding Architecture Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'architecture').single();
    if (!dept) {
        console.error('Department "architecture" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'design-studio',
            title: 'Design & Studio',
            content: `
                <p class="mb-2">Central to architecture training, repeated each year at increasing complexity.</p>
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Architectural Design / Studio (multiple levels):</strong> Design projects and critiques.</li>
                    <li><strong>Design Portfolio:</strong> Curation of design work for professional presentation.</li>
                    <li><strong>Integrated Design Projects:</strong> Comprehensive projects combining structural, environmental, and aesthetic elements.</li>
                </ul>
            `
        },
        {
            id: 'theory-history',
            title: 'Theory & History',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Theory of Architecture:</strong> Fundamental concepts and philosophies of architectural space.</li>
                    <li><strong>History of Architecture (I, II, III):</strong> Chronological study of architectural styles and movements.</li>
                    <li><strong>Architectural Theory and Criticism:</strong> Critical analysis of contemporary and historical works.</li>
                </ul>
            `
        },
        {
            id: 'technology',
            title: 'Technology & Construction',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Building Technology and Services:</strong> HVAC, lighting, and acoustics.</li>
                    <li><strong>Building Structures I–IV:</strong> Statics, strength of materials, and structural systems.</li>
                    <li><strong>Working Drawings & Details:</strong> Technical documentation and construction detailing.</li>
                    <li><strong>Materials and Construction Methods:</strong> Properties and applications of building materials.</li>
                </ul>
            `
        },
        {
            id: 'technical-skills',
            title: 'Technical Skills',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Computer-Aided Design (CAD):</strong> 2D and 3D digital drafting tools.</li>
                    <li><strong>Descriptive Geometry and Modeling:</strong> Spatial visualization and geometric representation.</li>
                    <li><strong>Workshop Practice / Model Making:</strong> Hands-on fabrication and physical prototyping.</li>
                </ul>
            `
        },
        {
            id: 'context',
            title: 'Context & Environment',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Environmental Building Science:</strong> Sustainable design principles and climate responsiveness.</li>
                    <li><strong>Landscape Design:</strong> Integration of built forms with natural environments.</li>
                    <li><strong>Urban and Regional Planning:</strong> Broad-scale planning and urban design strategies.</li>
                </ul>
            `
        },
        {
            id: 'professional-practice',
            title: 'Professional Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Building Economics and Project Management:</strong> Cost estimation and project delivery.</li>
                    <li><strong>Business Law for Architects:</strong> Legal frameworks and contracts.</li>
                    <li><strong>Professional Architectural Practice & Ethics:</strong> Codes of conduct and professional responsibility.</li>
                </ul>
            `
        },
        {
            id: 'supporting',
            title: 'Supporting Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Mathematics for Architects:</strong> Applied mathematics for structural and geometric analysis.</li>
                    <li><strong>Communication Skills:</strong> Technical writing and verbal presentation.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone / Internship',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Design Project / Studio:</strong> A comprehensive thesis project demonstrating mastery.</li>
                    <li><strong>Industrial Training / Internship:</strong> Practical work experience in an architectural firm.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Architecture (B.Arch)',
        slug: 'bachelor-architecture',
        degreeLevel: 'BACHELOR',
        duration: '3 Years', // B.Arch is often 4-5 years
        language: 'English',
        description: 'A rigorous professional degree program establishing the foundation of architectural practice through design studios, technical coursework, and historical theory.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 240, // Assuming 4 years x 60 ECTS
        imageUrl: '/images/departments/placeholder-architecture.jpg'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'advanced-design',
            title: 'Advanced Design & Research',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Architectural Design:</strong> Complex design challenges requiring innovative solutions.</li>
                    <li><strong>Architecture Thesis or Final Research Project:</strong> Independent research contribution to the field.</li>
                    <li><strong>Design Theories and Methodologies:</strong> Advanced frameworks for design thinking.</li>
                </ul>
            `
        },
        {
            id: 'specialized-tech',
            title: 'Specialized Technical Studies',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Sustainable Architecture / Sustainable Systems:</strong> Deep dive into ecological design.</li>
                    <li><strong>Building Systems and Performance:</strong> Advanced simulation and optimization of building performance.</li>
                    <li><strong>Detail and Construction Studies:</strong> Advanced tectonic articulation and material research.</li>
                </ul>
            `
        },
        {
            id: 'focused-topics',
            title: 'Focused Topics (Electives)',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Urban Design:</strong> Designing for cities and communities.</li>
                    <li><strong>Digital and Parametric Design:</strong> Computational design workflows.</li>
                    <li><strong>Environmental and Social Sustainability:</strong> Architecture for social impact.</li>
                </ul>
            `
        },
        {
            id: 'professional-management',
            title: 'Professional & Management',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Architecture Practice & Project Management:</strong> Advanced practice management and leadership.</li>
                    <li><strong>Research Methods in Architecture:</strong> Methodologies for academic and practice-based research.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Architecture (M.Arch)',
        slug: 'master-architecture',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced degree focusing on specialization, research, and complex design problems, preparing graduates for licensure and leadership in the field.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-architecture.jpg'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting B.Arch:', bErr);
    else console.log('✅ Successfully seeded "Bachelor of Architecture".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting M.Arch:', mErr);
    else console.log('✅ Successfully seeded "Master of Architecture".');
}

seedArchitecture();
