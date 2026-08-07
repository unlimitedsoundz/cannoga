
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

async function seedCivil() {
    console.log('Seeding Civil Engineering Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'civil-engineering').single();
    if (!dept) {
        console.error('Department "civil-engineering" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'math-basic',
            title: 'Engineering Mathematics & Basic Sciences',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Engineering Mathematics I, II, III:</strong> Calculus and advanced analysis.</li>
                    <li><strong>Linear Algebra:</strong> Matrices and systems of equations.</li>
                    <li><strong>Differential Equations:</strong> Tools for dynamic systems.</li>
                    <li><strong>Probability & Engineering Statistics:</strong> Reliability and data analysis.</li>
                    <li><strong>Applied Physics:</strong> Mechanics and fluids foundations.</li>
                    <li><strong>Engineering Chemistry:</strong> Materials chemistry.</li>
                </ul>
            `
        },
        {
            id: 'core-civil',
            title: 'Core Civil Engineering Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Engineering Drawing:</strong> Technical graphics and CAD.</li>
                    <li><strong>Introduction to Civil Engineering:</strong> Overview of the profession.</li>
                    <li><strong>Strength of Materials:</strong> Mechanics of solid bodies.</li>
                    <li><strong>Structural Analysis I & II:</strong> Forces in structures.</li>
                    <li><strong>Reinforced Concrete Design:</strong> Concrete structural elements.</li>
                    <li><strong>Steel Structures Design:</strong> Steel framing and connections.</li>
                    <li><strong>Foundation Engineering:</strong> Footings and piles.</li>
                    <li><strong>Engineering Geology:</strong> Soil and rock properties.</li>
                    <li><strong>Surveying I & II:</strong> Land measurement and mapping.</li>
                </ul>
            `
        },
        {
            id: 'geotechnical',
            title: 'Geotechnical Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Soil Mechanics:</strong> Soil behavior and classification.</li>
                    <li><strong>Rock Mechanics:</strong> properties of rock masses.</li>
                    <li><strong>Geotechnical Engineering:</strong> Application to slopes and dams.</li>
                    <li><strong>Earth Retaining Structures:</strong> Walls and bracing systems.</li>
                </ul>
            `
        },
        {
            id: 'transportation',
            title: 'Transportation Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Transportation Engineering:</strong> Systems and planning.</li>
                    <li><strong>Highway Engineering:</strong> Road design and construction.</li>
                    <li><strong>Traffic Engineering:</strong> Flow theory and control.</li>
                    <li><strong>Pavement Design:</strong> Flexible and rigid pavements.</li>
                </ul>
            `
        },
        {
            id: 'water-env',
            title: 'Water Resources & Environmental Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Fluid Mechanics:</strong> statics and dynamics of fluids.</li>
                    <li><strong>Hydraulics:</strong> Open channel flow and pipelines.</li>
                    <li><strong>Hydrology:</strong> Rainfall and runoff.</li>
                    <li><strong>Irrigation & Drainage Engineering:</strong> Agricultural water management.</li>
                    <li><strong>Water Supply Engineering:</strong> Treatment and distribution.</li>
                    <li><strong>Wastewater Engineering:</strong> Collection and treatment.</li>
                    <li><strong>Environmental Engineering:</strong> Pollution control and sustainability.</li>
                </ul>
            `
        },
        {
            id: 'construction',
            title: 'Construction & Management',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Construction Technology:</strong> Methods and equipment.</li>
                    <li><strong>Construction Planning & Scheduling:</strong> CPM and PERT.</li>
                    <li><strong>Engineering Economics:</strong> Financial analysis of projects.</li>
                    <li><strong>Project Management:</strong> Planning, execution, and control.</li>
                    <li><strong>Quantity Surveying (Intro):</strong> Estimation and contracts.</li>
                </ul>
            `
        },
        {
            id: 'computing',
            title: 'Computing & Design Tools',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Computer Programming for Engineers:</strong> Matlab/Python basics.</li>
                    <li><strong>Computer-Aided Design (AutoCAD):</strong> Digital drafting.</li>
                    <li><strong>Civil Engineering Software:</strong> STAAD, ETABS (Intro).</li>
                </ul>
            `
        },
        {
            id: 'labs',
            title: 'Laboratories & Field Work',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Materials Testing Laboratory:</strong> Concrete and steel testing.</li>
                    <li><strong>Geotechnical Engineering Laboratory:</strong> Soil properties.</li>
                    <li><strong>Concrete Technology Laboratory:</strong> Mix design and testing.</li>
                    <li><strong>Surveying Field Practice:</strong> Hands-on surveying camps.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Professional Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Engineering Ethics & Law:</strong> Legal and moral responsibilities.</li>
                    <li><strong>Health, Safety & Environment (HSE):</strong> Construction safety.</li>
                    <li><strong>Industrial Training / Internship:</strong> Work experience.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Independent research or design project.</li>
                    <li><strong>Design Project:</strong> Comprehensive design (Structural / Transportation / Water).</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Engineering in Civil Engineering',
        slug: 'beng-civil-engineering',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A comprehensive program designing the built environment, from skyscrapers and bridges to water systems and highways.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 240,
        imageUrl: '/images/departments/placeholder-civil-engineering.jpg',
        careerPaths: 'Construction Management, Structural Engineering, Transportation Planning, Water Resources'
    };

    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'core-advanced',
            title: 'Advanced Core Engineering',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Engineering Mathematics:</strong> Applied analysis.</li>
                    <li><strong>Advanced Structural Analysis:</strong> Matrix methods and FEA basics.</li>
                    <li><strong>Advanced Soil Mechanics:</strong> Critical state soil mechanics.</li>
                    <li><strong>Advanced Hydraulics:</strong> Unsteady flow and sediment transport.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Structural Engineering</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Reinforced Concrete</li>
                    <li>Prestressed Concrete</li>
                    <li>Structural Dynamics</li>
                    <li>Earthquake Engineering</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Geotechnical Engineering</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Foundation Engineering</li>
                    <li>Soil Dynamics</li>
                    <li>Slope Stability</li>
                    <li>Ground Improvement Techniques</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Transportation Engineering</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Traffic Engineering</li>
                    <li>Pavement Management Systems</li>
                    <li>Transportation Planning</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Water Resources & Environmental</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Hydrology</li>
                    <li>Water Resources Systems Engineering</li>
                    <li>Environmental Impact Assessment</li>
                    <li>Advanced Wastewater Treatment</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Construction Engineering & Management</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Advanced Project Management</li>
                    <li>Construction Economics</li>
                    <li>Risk & Contract Management</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Civil Engineering:</strong> Experimental and analytical methods.</li>
                    <li><strong>Engineering Modeling & Simulation:</strong> Computational tools.</li>
                    <li><strong>Graduate Seminar:</strong> Technical presentations.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Dissertation:</strong> Major research contribution.</li>
                    <li><strong>Industrial or Research Internship:</strong> Optional advanced placement.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Engineering in Civil Engineering',
        slug: 'meng-civil-engineering',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced degree for specialization in structural, geotechnical, transportation, or environmental engineering.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-civil-engineering.jpg',
        careerPaths: 'Senior Civil Engineer, Project Manager, Specialized Consultant, Researcher'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting B.Eng Civil:', bErr);
    else console.log('✅ Successfully seeded "B.Eng Civil Engineering".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting M.Eng Civil:', mErr);
    else console.log('✅ Successfully seeded "M.Eng Civil Engineering".');
}

seedCivil();
