
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

async function seedChemMats() {
    console.log('Seeding Chemistry & Materials Science Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'chemistry-materials').single();
    if (!dept) {
        console.error('Department "chemistry-materials" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'core-chem',
            title: 'Core Chemistry',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>General Chemistry I & II:</strong> Fundamentals of atomic structure and bonding.</li>
                    <li><strong>Inorganic Chemistry I & II:</strong> Main group and transition metal chemistry.</li>
                    <li><strong>Organic Chemistry I & II:</strong> Hydrocarbons, functional groups, and synthesis.</li>
                    <li><strong>Physical Chemistry I & II:</strong> Thermodynamics, kinetics, and quantum chemistry.</li>
                    <li><strong>Analytical Chemistry I & II:</strong> Quantitative and qualitative analysis.</li>
                    <li><strong>Environmental Chemistry:</strong> Chemical processes in the environment.</li>
                </ul>
            `
        },
        {
            id: 'lab-practical',
            title: 'Laboratory & Practical Chemistry',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>General Chemistry Laboratory:</strong> Basic techniques.</li>
                    <li><strong>Organic Chemistry Laboratory:</strong> Synthesis and characterization.</li>
                    <li><strong>Inorganic Chemistry Laboratory:</strong> Preparation of inorganic compounds.</li>
                    <li><strong>Physical Chemistry Laboratory:</strong> Experiments in thermodynamics and spectroscopy.</li>
                    <li><strong>Analytical Chemistry Laboratory:</strong> Wet chemical analysis.</li>
                    <li><strong>Instrumental Analysis Laboratory:</strong> Use of modern instrumentation.</li>
                </ul>
            `
        },
        {
            id: 'materials-core',
            title: 'Materials Science Core',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Introduction to Materials Science:</strong> Overview of material families.</li>
                    <li><strong>Structure of Materials:</strong> Atomic packing and defects.</li>
                    <li><strong>Crystallography:</strong> Crystal lattices and symmetry.</li>
                    <li><strong>Solid State Chemistry:</strong> Synthesis and properties of solids.</li>
                    <li><strong>Phase Equilibria & Phase Diagrams:</strong> Understanding stability of phases.</li>
                    <li><strong>Materials Thermodynamics:</strong> Energy relations in materials.</li>
                </ul>
            `
        },
        {
            id: 'classes-materials',
            title: 'Classes of Materials',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Metals & Alloys:</strong> Steels, aluminum, and superalloys.</li>
                    <li><strong>Ceramics & Glasses:</strong> Processing and properties of brittle materials.</li>
                    <li><strong>Polymers & Elastomers:</strong> Structure and mechanics of soft materials.</li>
                    <li><strong>Composite Materials:</strong> Fiber-reinforced and laminate systems.</li>
                    <li><strong>Functional Materials:</strong> Semiconductors, magnetics, and dielectrics.</li>
                </ul>
            `
        },
        {
            id: 'characterization',
            title: 'Materials Characterization',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>X-ray Diffraction (XRD):</strong> Structural analysis.</li>
                    <li><strong>Electron Microscopy (SEM / TEM):</strong> Microstructural imaging.</li>
                    <li><strong>Spectroscopy Methods (IR, UV-Vis, NMR):</strong> Chemical identification.</li>
                    <li><strong>Thermal Analysis (DSC, TGA):</strong> Phase transitions and stability.</li>
                </ul>
            `
        },
        {
            id: 'math-physics',
            title: 'Mathematics & Physics Support',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Calculus for Scientists:</strong> Mathematical foundations.</li>
                    <li><strong>Linear Algebra:</strong> Vectors and matrices.</li>
                    <li><strong>Differential Equations:</strong> Kinetics and transport rates.</li>
                    <li><strong>Applied Physics for Materials:</strong> Mechanics and waves basics.</li>
                </ul>
            `
        },
        {
            id: 'computing',
            title: 'Computing & Data Skills',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Scientific Computing:</strong> Python / MATLAB for analysis.</li>
                    <li><strong>Data Analysis for Chemists:</strong> Statistics and error handling.</li>
                    <li><strong>Materials Modeling (Intro):</strong> Basics of simulation.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Professional & Applied Studies',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Industrial Chemistry:</strong> Chemical manufacturing processes.</li>
                    <li><strong>Corrosion Science:</strong> Oxidation and protection.</li>
                    <li><strong>Surface Chemistry:</strong> Adsorption and catalysis.</li>
                    <li><strong>Health, Safety & Environmental Chemistry:</strong> Risk management.</li>
                    <li><strong>Industrial Training / Internship:</strong> Practical experience.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Project / Undergraduate Thesis:</strong> Independent investigation.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Science in Chemistry and Materials Science',
        slug: 'bsc-chemistry-materials',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A dual-focus program integrating fundamental chemistry with the engineering of new materials, covering synthesis, characterization, and application.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180, // or 240
        imageUrl: '/images/departments/placeholder-chemistry-materials.jpg',
        careerPaths: 'Chemical & Materials Industries, Pharmaceuticals, Quality Control, Research Labs'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-chem',
            title: 'Advanced Chemistry',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Physical Chemistry:</strong> Quantum mechanics and spectroscopy.</li>
                    <li><strong>Advanced Inorganic Chemistry:</strong> Organometallics and bioinorganic chemistry.</li>
                    <li><strong>Advanced Organic Chemistry:</strong> Stereochemistry and synthesis.</li>
                    <li><strong>Chemical Kinetics & Reaction Mechanisms:</strong> Detailed pathway analysis.</li>
                    <li><strong>Advanced Analytical & Instrumental Methods:</strong> Leading-edge techniques.</li>
                </ul>
            `
        },
        {
            id: 'adv-materials',
            title: 'Advanced Materials Science',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Solid State Chemistry:</strong> Defect chemistry and transport.</li>
                    <li><strong>Advanced Materials Thermodynamics:</strong> Nanoscale thermodynamics.</li>
                    <li><strong>Electronic & Optical Materials:</strong> Semiconductors and photonics.</li>
                    <li><strong>Magnetic & Superconducting Materials:</strong> Quantum materials.</li>
                    <li><strong>Biomaterials:</strong> Materials for medical applications.</li>
                    <li><strong>Energy Materials:</strong> Batteries and fuel cells.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Nanoscience & Nanotechnology</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Nanomaterials</li>
                    <li>Nanofabrication Techniques</li>
                    <li>Nanocharacterization</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Energy & Sustainability</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Materials for Energy Storage</li>
                    <li>Solar Cell Materials</li>
                    <li>Catalysis & Surface Science</li>
                    <li>Green & Sustainable Materials</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Polymers & Soft Matter</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Polymer Chemistry & Physics</li>
                    <li>Rheology & Soft Materials</li>
                </ul>
            `
        },
        {
            id: 'research-dev',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Research Methods:</strong> Grant writing and experimental design.</li>
                    <li><strong>Scientific Writing & Ethics:</strong> Publishing research.</li>
                    <li><strong>Graduate Seminar:</strong> Discussing recent literature.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Dissertation:</strong> Comprehensive research project.</li>
                    <li><strong>Research or Industrial Internship:</strong> Optional advanced placement.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Science in Chemistry and Materials Science',
        slug: 'msc-chemistry-materials',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An expert-level program emphasizing research in advanced materials, nanotechnology, and sustainable chemical processes.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-chemistry-materials.jpg',
        careerPaths: 'Research Scientist, Materials Engineer, Nanotechnologist, Laboratory Manager, Academia'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BSc Chem-Materials:', bErr);
    else console.log('✅ Successfully seeded "BSc Chemistry and Materials Science".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MSc Chem-Materials:', mErr);
    else console.log('✅ Successfully seeded "MSc Chemistry and Materials Science".');
}

seedChemMats();
