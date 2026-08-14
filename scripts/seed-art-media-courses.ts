
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

async function seedArtMedia() {
    console.log('Seeding Art and Media Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'art-media').single();
    if (!dept) {
        console.error('Department "art-media" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'foundations',
            title: 'Core Art & Design Foundations',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Drawing & Visual Studies:</strong> Observation, anatomy, and perspective.</li>
                    <li><strong>Color Theory:</strong> Psychology and application of color.</li>
                    <li><strong>2D Design:</strong> Composition, layout, and visual hierarchy.</li>
                    <li><strong>3D Design & Sculpture:</strong> Spatial relationships and material exploration.</li>
                    <li><strong>Visual Composition:</strong> Principles of design organization.</li>
                    <li><strong>Art Practice Studio:</strong> Hands-on creative experimentation.</li>
                </ul>
            `
        },
        {
            id: 'media-digital',
            title: 'Media & Digital Arts',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Digital Imaging:</strong> Raster and vector graphics editing.</li>
                    <li><strong>Photography:</strong> Digital and analog photographic techniques.</li>
                    <li><strong>Video Production:</strong> Filming, editing, and post-production.</li>
                    <li><strong>Sound & Media Arts:</strong> Audio recording and soundscape design.</li>
                    <li><strong>Animation Basics:</strong> Principles of movement and timing.</li>
                    <li><strong>Motion Graphics:</strong> Design for moving image.</li>
                </ul>
            `
        },
        {
            id: 'tech-new-media',
            title: 'Technology & New Media',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Graphic Design:</strong> Typography and branding.</li>
                    <li><strong>Interactive Media Design:</strong> User engagement and interaction.</li>
                    <li><strong>Web & Media Design:</strong> Design for web platforms.</li>
                    <li><strong>Digital Illustration:</strong> Painting and drawing digitally.</li>
                    <li><strong>Introduction to UX/UI Design:</strong> User experience principles.</li>
                    <li><strong>Creative Coding (Basics):</strong> Programming for artistic expression.</li>
                </ul>
            `
        },
        {
            id: 'theory-history',
            title: 'Theory & History',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>History of Art:</strong> Survey of global art movements.</li>
                    <li><strong>Media Theory:</strong> Analysis of media impact on society.</li>
                    <li><strong>Visual Culture Studies:</strong> Decoding images in culture.</li>
                    <li><strong>Contemporary Art & Media:</strong> Current trends and practices.</li>
                    <li><strong>Film & Media Analysis:</strong> Critical reading of time-based media.</li>
                </ul>
            `
        },
        {
            id: 'communication',
            title: 'Communication & Storytelling',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Visual Storytelling:</strong> Narrative through image.</li>
                    <li><strong>Media Writing:</strong> Writing for various media platforms.</li>
                    <li><strong>Scriptwriting (Intro):</strong> Fundamentals of script structure.</li>
                    <li><strong>Communication Design:</strong> Visual messaging strategy.</li>
                    <li><strong>Presentation & Portfolio Skills:</strong> Professional presentation techniques.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Professional Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Creative Entrepreneurship:</strong> Business skills for artists.</li>
                    <li><strong>Media Ethics & Law:</strong> Copyright and ethical responsibilities.</li>
                    <li><strong>Project Management for Creatives:</strong> Managing creative projects.</li>
                    <li><strong>Internship / Industry Placement:</strong> Professional work experience.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Year Project:</strong> Major self-directed creative project.</li>
                    <li><strong>Portfolio Development & Exhibition:</strong> Professional showcase of work.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Art and Media (BA)',
        slug: 'ba-art-media',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A multidisciplinary program blending traditional art foundations with cutting-edge digital media and technology, nurturing creative visionaries.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-art-media.jpg'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'advanced-studio',
            title: 'Advanced Studio & Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Studio Practice:</strong> Independent artistic development.</li>
                    <li><strong>Experimental Media Art:</strong> Pushing boundaries of medium.</li>
                    <li><strong>Cross-Media Art Practices:</strong> Hybrid and interdisciplinary work.</li>
                    <li><strong>Research-Based Art Practice:</strong> Art as inquiry.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Digital & Interactive Media</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Animation</li>
                    <li>Interactive Installations</li>
                    <li>Virtual & Augmented Reality</li>
                    <li>Game Art & Design</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Film, Photography & Sound</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Film Production</li>
                    <li>Documentary Media</li>
                    <li>Advanced Photography</li>
                    <li>Sound Design</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Design & Visual Communication</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Graphic Design</li>
                    <li>Branding & Identity Systems</li>
                    <li>Information Design</li>
                    <li>Advanced UX/UI Design</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Critical & Theoretical Studies</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Critical Media Theory</li>
                    <li>Art & Technology Studies</li>
                    <li>Cultural & Media Studies</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Art & Media:</strong> Methodologies for artistic research.</li>
                    <li><strong>Creative Writing for Artists:</strong> Writing artist statements and texts.</li>
                    <li><strong>Exhibition & Curatorial Practice:</strong> Staging and curation.</li>
                    <li><strong>Professional Portfolio Development:</strong> Advanced career preparation.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis:</strong> Written or Practice-Based research project.</li>
                    <li><strong>Final Exhibition / Media Project:</strong> Public presentation of master's work.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Art and Media (MA)',
        slug: 'ma-art-media',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced studio and research program dealing with contemporary art practices, digital media, and critical theory.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-art-media.jpg'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BA Art & Media:', bErr);
    else console.log('✅ Successfully seeded "BA Art & Media".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MA Art & Media:', mErr);
    else console.log('✅ Successfully seeded "MA Art & Media".');

    // Update career paths for Bachelor's (using the provided list which seems general for both, but more entry-level relevant for BA, though also MA)
    // We can add it to both or just one. I'll add to BA description or section if needed, but schema has careerPaths column.
    // Let's update the careerPaths column.
    const careers = "Visual Artists, Graphic Designers, Media Artists, Animators, Filmmakers, UX/UI Designers, Creative Directors, Content Creators";

    await supabase.from('Course').update({ careerPaths: careers }).eq('slug', 'ba-art-media');
    await supabase.from('Course').update({ careerPaths: careers }).eq('slug', 'ma-art-media');
}

seedArtMedia();
